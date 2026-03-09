
import { float32ToInt16, base64ToFloat32, arrayBufferToBase64 } from './audioUtils';

export class AudioStore {
  private audioContext: AudioContext | null = null;
  private inputSource: MediaStreamAudioSourceNode | null = null;
  private processor: ScriptProcessorNode | null = null;
  private stream: MediaStream | null = null;
  private analyser: AnalyserNode | null = null;
  public scheduledSources: AudioBufferSourceNode[] = [];
  private nextStartTime: number = 0;

  constructor() {}

  async startRecording(onData: (base64: string) => void) {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 24000, 
      });
    }

    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }

    const inputSampleRate = 16000;
    
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ 
        audio: { 
          sampleRate: inputSampleRate,
          channelCount: 1,
          echoCancellation: true,
          autoGainControl: true,
          noiseSuppression: true
        } 
      });

      this.inputSource = this.audioContext.createMediaStreamSource(this.stream);
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256;
      
      this.processor = this.audioContext.createScriptProcessor(4096, 1, 1);
      
      this.inputSource.connect(this.analyser);
      this.analyser.connect(this.processor);
      this.processor.connect(this.audioContext.destination);

      this.processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        const ratio = this.audioContext!.sampleRate / 16000;
        const newLength = Math.floor(inputData.length / ratio);
        const downsampled = new Float32Array(newLength);
        
        for (let i = 0; i < newLength; i++) {
           downsampled[i] = inputData[Math.floor(i * ratio)];
        }

        const pcm16 = float32ToInt16(downsampled);
        const base64 = arrayBufferToBase64(pcm16.buffer);
        onData(base64);
      };

    } catch (err) {
      console.error("Error accessing microphone:", err);
      throw err;
    }
  }

  async playAudioChunk(base64Audio: string) {
    if (!this.audioContext) return;

    try {
      const float32Data = base64ToFloat32(base64Audio);
      const audioBuffer = this.audioContext.createBuffer(1, float32Data.length, 24000);
      audioBuffer.getChannelData(0).set(float32Data);

      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.audioContext.destination);

      const currentTime = this.audioContext.currentTime;
      const startTime = Math.max(currentTime, this.nextStartTime);
      
      source.start(startTime);
      this.nextStartTime = startTime + audioBuffer.duration;
      
      this.scheduledSources.push(source);
      
      source.onended = () => {
        this.scheduledSources = this.scheduledSources.filter(s => s !== source);
      };

    } catch (e) {
      console.error("Error decoding/playing audio chunk", e);
    }
  }

  stopRecording() {
    if (this.processor) {
      this.processor.disconnect();
      this.processor.onaudioprocess = null;
    }
    if (this.inputSource) {
      this.inputSource.disconnect();
    }
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
    }
  }

  /**
   * Clears the current playback queue instantly.
   * Required for conversational "barge-in" where the model must stop 
   * talking as soon as it detects the user speaking.
   */
  clearBuffer() {
    this.scheduledSources.forEach(source => {
      try { 
        source.stop(0); 
        source.disconnect();
      } catch(e) {}
    });
    this.scheduledSources = [];
    this.nextStartTime = this.audioContext?.currentTime || 0;
  }

  getAudioData(): Uint8Array {
    if (!this.analyser) return new Uint8Array(0);
    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(dataArray);
    return dataArray;
  }
}
