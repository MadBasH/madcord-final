"use client";

import { useState } from "react";
import { X, Minimize2, Maximize2 } from "lucide-react"; // İkonlar için

import { useActiveCall } from "@/hooks/use-active-call";
import { MediaRoom } from "@/components/media-room";

export const ActiveCallProvider = () => {
  const { activeChannelId, setActiveChannel } = useActiveCall();
  const [isMinimized, setIsMinimized] = useState(false);

  // Eğer aktif bir arama yoksa hiçbir şey render etme
  if (!activeChannelId) return null;

  // Görüşmeyi tamamen sonlandıran fonksiyon
  const handleDisconnect = () => {
    setActiveChannel(null);
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 w-80 h-64 z-50 bg-white dark:bg-[#1E1F22] shadow-2xl rounded-xl border border-neutral-200 dark:border-[#2B2D31] overflow-hidden transition-all duration-300 ease-in-out flex flex-col">
        {/* Minimized Header */}
        <div className="bg-neutral-100 dark:bg-[#2B2D31] px-3 py-1.5 flex items-center justify-between border-b border-neutral-200 dark:border-[#1F2023]">
          <div className="flex items-center gap-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              Sesli Sohbet
            </span>
          </div>
          <div className="flex items-center gap-x-2">
             {/* Büyütme Butonu */}
            <button 
              onClick={() => setIsMinimized(false)}
              className="hover:bg-neutral-200 dark:hover:bg-[#3F4147] p-1 rounded transition"
            >
              <Maximize2 className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
            </button>
             {/* Kapatma Butonu */}
            <button 
              onClick={handleDisconnect}
              className="hover:bg-rose-500 hover:text-white p-1 rounded transition group"
            >
              <X className="w-4 h-4 text-neutral-500 dark:text-neutral-400 group-hover:text-white" />
            </button>
          </div>
        </div>
        
        {/* Video Area (Small) */}
        <div className="flex-1 relative">
            <MediaRoom
                chatId={activeChannelId}
                video={true}
                audio={true}
            />
        </div>
      </div>
    );
  }

  // MAXIMIZED MODE (Tam Ekran Modu)
  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col transition-all duration-300">
       {/* Maximized Header */}
       <div className="absolute bottom-4 right-4 z-[60] flex items-center gap-x-2 bg-black/50 p-2 rounded-lg backdrop-blur-sm">
          <button 
            onClick={() => setIsMinimized(true)}
            className="bg-neutral-800 hover:bg-neutral-700 text-white p-2 rounded-full transition"
            title="Küçült"
          >
            <Minimize2 className="w-5 h-5" />
          </button>
          
          <button 
            onClick={handleDisconnect}
            className="bg-rose-500 hover:bg-rose-600 text-white p-2 rounded-full transition"
            title="Görüşmeyi Sonlandır"
          >
            <X className="w-5 h-5" />
          </button>
       </div>

       <div className="w-full h-full">
         <MediaRoom
            chatId={activeChannelId}
            video={true}
            audio={true}
         />
       </div>
    </div>
  );
}