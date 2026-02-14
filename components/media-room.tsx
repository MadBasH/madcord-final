"use client";

import { useEffect, useState } from "react";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import "@livekit/components-styles";
import { useUser } from "@clerk/nextjs";
import { Loader2, AudioLines } from "lucide-react";

import { VolumeManager } from "@/components/media/volume-manager";

interface MediaRoomProps {
    chatId: string;
    video: boolean;
    audio: boolean;
};

export const MediaRoom = ({
    chatId,
    video,
    audio,
}: MediaRoomProps) => {
    const { user } = useUser();
    const [token, setToken] = useState("");
    const [isVolumeOpen, setIsVolumeOpen] = useState(false);

    useEffect(() => {
        if (!user?.firstName || !user?.lastName) return;
        const name = `${user.firstName} ${user.lastName}`;

        (async () => {
            try {
                const resp = await fetch(`/api/livekit?room=${chatId}&username=${name}`)
                const data = await resp.json();
                setToken(data.token);
            } catch (e) {
                console.log(e);
            }
        })()
    }, [user?.firstName, user?.lastName, chatId]);

    if (token === "") {
        return (
            <div className="flex flex-col flex-1 justify-center items-center">
                <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Loading...
                </p>
            </div>
        )
    }

    return (
        <div className="relative flex-1 h-full w-full bg-[#313338]">
            <LiveKitRoom 
                data-lk-theme="default" 
                serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL} 
                token={token} 
                connect={true} 
                video={video} 
                audio={audio} 
            >
                <VideoConference />

                {/* SES KONTROL BUTONU: z-index 100 ile en üstte */}
                <button 
                    onClick={() => setIsVolumeOpen(!isVolumeOpen)}
                    className={`absolute top-[14px] right-[52px] z-[100] p-2 rounded-md transition hover:bg-zinc-700/50 
                    ${isVolumeOpen ? "text-indigo-400 bg-zinc-700/80" : "text-zinc-400"}`}
                    title="Ses Düzeyleri"
                >
                    <AudioLines className="h-5 w-5" />
                </button>

                {/* PANEL VE DIŞARI TIKLAMA YÖNETİMİ */}
                {isVolumeOpen && (
                    <>
                        {/* Overlay: Panele tıklanmadığında kapanmasını sağlar */}
                        <div 
                            className="fixed inset-0 z-[80]" 
                            onClick={() => setIsVolumeOpen(false)} 
                        />
                        
                        {/* Panel Konumu: Butonun altına hizalandı */}
                        <div className="absolute top-[60px] right-4 z-[90] animate-in fade-in zoom-in-95 duration-200">
                            <VolumeManager />
                        </div>
                    </>
                )}
            </LiveKitRoom>
        </div>
    )
}