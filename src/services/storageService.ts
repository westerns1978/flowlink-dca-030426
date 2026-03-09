
import { createClient } from '@supabase/supabase-js';
import { GoogleGenAI, Type } from "@google/genai";

const SUPABASE_URL = 'https://ldzzlndsspkyohvzfiiu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxkenpsbmRzc3BreW9odnpmaWl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3MTEzMDUsImV4cCI6MjA3NzI4NzMwNX0.SK2Y7XMzeGQoVMq9KAmEN1vwy7RjtbIXZf6TyNneFnI';
const STORAGE_BUCKET = 'vault';
const DEFAULT_ORG_ID = '71077b47-66e8-4fd9-90e7-709773ea6582';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export interface DocumentDNA {
    title: string;
    summary: string;
    tags: string[];
    confidence: number;
    document_type?: string;
}

export interface VaultFile {
    id: string;
    file_name: string;
    file_path: string; // Internal storage path
    file_type: string;
    file_size: number;
    public_url: string;
    metadata?: {
        dna: DocumentDNA;
        asset_id?: string;
    };
    uploaded_at: string;
    uploaded_by: string;
}

export const storageService = {
  
  checkConnection: async () => {
    try {
        const { error } = await supabase.storage.listBuckets();
        if (error) return { status: 'offline', message: error.message };
        return { status: 'healthy', message: 'Uplink Established' };
    } catch (e) {
        return { status: 'offline', message: 'Network unreachable' };
    }
  },

  /**
   * Solaris Neural Ingestion Loop
   * Consolidates upload + DNA extraction into one atomic-like transaction.
   */
  uploadWithDNA: async (file: File, assetId: string | 'GLOBAL', onProgress: (log: string) => void): Promise<VaultFile> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const cleanFileName = `${Date.now()}_${file.name.replace(/\s/g, '_')}`;
    const filePath = `ingestion/${assetId}/${cleanFileName}`;
    
    // --- STEP 1: NEURAL EXTRACTION ---
    onProgress("⚡️ INITIALIZING NEURAL EXTRACTION...");
    const base64Data = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.readAsDataURL(file);
    });

    onProgress("🧠 ANALYZING DOCUMENT TOPOLOGY...");
    let dna: DocumentDNA;
    try {
        const dnaResponse = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: [{
                parts: [
                    { text: "Role: Office Equipment Strategic Analyst. Task: Extract Document DNA. Identity key entities, technical specs, and commercial relevance. Return JSON: {title, summary, tags: [], confidence: 0.0-1.0, document_type: 'INVOICE' | 'MANUAL' | 'CONTRACT' | 'LOG' | 'OTHER'}." },
                    { inlineData: { data: base64Data, mimeType: file.type || 'application/pdf' } }
                ]
            }],
            config: { 
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        summary: { type: Type.STRING },
                        tags: { type: Type.ARRAY, items: { type: Type.STRING } },
                        confidence: { type: Type.NUMBER },
                        document_type: { type: Type.STRING }
                    },
                    required: ["title", "summary", "tags", "document_type"]
                }
            }
        });
        dna = JSON.parse(dnaResponse.text || '{}');
        onProgress(`🧬 DNA DECODED: ${dna.title}`);
    } catch (e) {
        console.warn("AI extraction failed, using fallback metadata", e);
        dna = { title: file.name, summary: 'Manual entry (AI failed)', tags: ['UPLOAD'], confidence: 0, document_type: 'OTHER' };
    }

    // --- STEP 2: BINARY TRANSMISSION ---
    onProgress("🛰️ TRANSMITTING BINARY TO VAULT...");
    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
      });

    if (uploadError) throw uploadError;

    const { data: urlData } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(filePath);

    // --- STEP 3: PERSISTENCE ---
    onProgress("🔒 COMMITTING TRANSACTION...");
    const { data: dbData, error: dbError } = await supabase
      .from('uploaded_files')
      .insert({
        file_name: file.name,
        file_path: filePath,
        file_type: file.type,
        file_size: file.size,
        public_url: urlData.publicUrl,
        org_id: DEFAULT_ORG_ID,
        metadata: { dna, asset_id: assetId },
        uploaded_by: 'dan-executive'
      })
      .select().single();

    if (dbError) throw dbError;
    return dbData;
  },

  /**
   * Retrieve all files for the organization
   */
  listVault: async (assetId?: string): Promise<VaultFile[]> => {
    let query = supabase.from('uploaded_files').select('*').order('uploaded_at', { ascending: false });
    
    if (assetId) {
        query = query.filter('metadata->>asset_id', 'eq', assetId);
    } else {
        query = query.eq('org_id', DEFAULT_ORG_ID);
    }

    const { data, error } = await query;
    if (error) {
        console.error("Vault retrieval error:", error);
        return [];
    }
    return data;
  },

  /**
   * Universal Deletion
   */
  deleteFile: async (file: VaultFile) => {
      // 1. Storage remove
      const { error: storageError } = await supabase.storage
          .from(STORAGE_BUCKET)
          .remove([file.file_path]);
      
      if (storageError) console.warn("Storage deletion error", storageError);

      // 2. Database remove
      const { error: dbError } = await supabase
          .from('uploaded_files')
          .delete()
          .eq('id', file.id);
      
      if (dbError) throw dbError;
      return true;
  }
};
