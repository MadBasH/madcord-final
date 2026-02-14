"use client";

import { useEffect, useState } from "react";
import { RemoteAudioTrack } from "livekit-client";
import { Slider } from "@/components/ui/slider";
import { Volume2, VolumeX, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button"; // Shadcn Button varsa

interface AudioTrackSliderProps {
  track: RemoteAudioTrack;
  participantName: string;
  isScreenShare?: boolean;
}

export const AudioTrackSlider = ({ track, participantName, isScreenShare }: AudioTrackSliderProps) => {
  // Başlangıçta localStorage'dan değeri oku veya 1 (varsayılan) yap
  const [volume, setVolume] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(`vol-${participantName}-${isScreenShare}`);
      return saved ? parseFloat(saved) : 1;
    }
    return 1;
  });

  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(1);

  useEffect(() => {
    // Sesi track üzerinde uygula
    track.setVolume(isMuted ? 0 : volume);
    
    // Değeri kaydet
    localStorage.setItem(`vol-${participantName}-${isScreenShare}`, volume.toString());
  }, [volume, track, isMuted, participantName, isScreenShare]);

  const toggleMute = () => {
    if (isMuted) {
      setVolume(previousVolume);
      setIsMuted(false);
    } else {
      setPreviousVolume(volume);
      setVolume(0);
      setIsMuted(true);
    }
  };

  return (
    <div className="flex flex-col gap-y-2 p-3 bg-zinc-800/40 hover:bg-zinc-800/60 transition rounded-lg mb-2 group">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2 text-[11px] font-semibold text-zinc-400 uppercase tracking-tight">
          {isScreenShare ? <Monitor className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
          <span className="truncate max-w-[120px]">{participantName}</span>
        </div>
        <span className="text-[10px] font-mono text-zinc-500">
          {Math.round(volume * 100)}%
        </span>
      </div>

      <div className="flex items-center gap-x-3">
        <button 
          onClick={toggleMute}
          className="text-zinc-400 hover:text-white transition"
        >
          {volume === 0 || isMuted ? (
            <VolumeX className="h-4 w-4 text-rose-500" />
          ) : (
            <Volume2 className="h-4 w-4" />
          )}
        </button>
        <Slider
          value={[volume]}
          max={1}
          step={0.01}
          onValueChange={(vals) => {
            setVolume(vals[0]);
            if (vals[0] > 0) setIsMuted(false);
          }}
          className="w-full cursor-pointer"
        />
      </div>
    </div>
  );
};