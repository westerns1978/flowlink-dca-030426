
import React, { useRef, useState, useEffect } from 'react';
import { Play, Zap, Loader2 } from 'lucide-react';

interface InteractiveMediaCardProps {
  imageSrc: string;
  videoSrc: string;
  title: string;
  description: string;
  badge?: string;
  className?: string;
  isHero?: boolean;
  isStatic?: boolean;
  onClick?: () => void;
}

export const InteractiveMediaCard: React.FC<InteractiveMediaCardProps> = ({
  imageSrc,
  videoSrc,
  title,
  description,
  badge,
  className = "",
  isHero = false,
  isStatic = false,
  onClick
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const playPromiseRef = useRef<Promise<void> | null>(null);

  useEffect(() => {
    if (isStatic || !videoRef.current) return;

    const video = videoRef.current;

    if (isHovering && isVideoLoaded) {
      // Robust Playback Logic: Prevent promise collisions
      playPromiseRef.current = video.play();
      playPromiseRef.current.catch((error) => {
        if (error.name !== 'AbortError') {
          console.log("Playback interrupted safely", error);
        }
      });
    } else {
      // Wait for the play promise to resolve before pausing to prevent DOMException
      if (playPromiseRef.current) {
        playPromiseRef.current.then(() => {
          video.pause();
          video.currentTime = 0;
        }).catch(() => {});
      } else {
        video.pause();
        video.currentTime = 0;
      }
    }
  }, [isHovering, isVideoLoaded, isStatic]);

  return (
    <div 
      className={`relative group overflow-hidden rounded-[2rem] border border-slate-200 dark:border-white/10 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer bg-slate-900 ring-1 ring-white/5 hover:ring-solaris-gold/30 ${className}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={onClick}
    >
      <div className="absolute top-4 right-4 z-50">
          <div className="flex items-center gap-2 px-2 py-1 bg-slate-950/80 backdrop-blur-md rounded-full border border-solaris-gold/20 shadow-lg">
              {isHovering && !isVideoLoaded ? (
                  <Loader2 size={10} className="animate-spin text-solaris-gold" />
              ) : (
                  <div className={`w-1.5 h-1.5 rounded-full ${isHovering ? 'bg-solaris-gold animate-pulse' : 'bg-slate-500'}`}></div>
              )}
              <span className="text-[8px] font-black text-solaris-gold uppercase tracking-widest">Live Node</span>
          </div>
      </div>

      <div className={`relative w-full ${isHero ? 'h-[200px]' : 'h-40'}`}>
        <img 
          src={imageSrc} 
          alt={title} 
          loading="lazy"
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 z-10 ${isHovering && isVideoLoaded ? 'opacity-0 scale-110' : 'opacity-100'}`}
        />

        {!isStatic && (
          <video
            ref={videoRef}
            src={videoSrc}
            muted
            loop
            playsInline
            onLoadedData={() => setIsVideoLoaded(true)}
            className={`absolute inset-0 w-full h-full object-cover z-20 transition-opacity duration-700 ${isHovering && isVideoLoaded ? 'opacity-100' : 'opacity-0'}`}
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent z-30 opacity-90 group-hover:opacity-70 transition-opacity" />

        <div className="absolute inset-0 z-40 p-6 flex flex-col justify-end">
          <div className="transform transition-all duration-500 group-hover:-translate-y-1">
            {badge && (
              <span className="inline-block px-2 py-0.5 mb-2 text-[8px] font-black tracking-[0.2em] text-solaris-gold uppercase bg-slate-950/80 backdrop-blur-md rounded-md border border-solaris-gold/30">
                {badge}
              </span>
            )}
            <h3 className="font-black text-white mb-1 leading-tight tracking-tighter text-lg">
              {title}
            </h3>
            <p className="text-slate-400 font-medium text-[11px] leading-relaxed line-clamp-1 group-hover:line-clamp-none transition-all">
              {description}
            </p>
            
            <div className="mt-3 flex items-center gap-2 text-solaris-gold text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
               Access Node <Zap size={10} fill="currentColor" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
