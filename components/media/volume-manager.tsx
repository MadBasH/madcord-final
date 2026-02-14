"use client";

import { useTracks } from "@livekit/components-react";
import { RemoteAudioTrack, Track } from "livekit-client";
import { AudioTrackSlider } from "./audio-track-slider";

export const VolumeManager = () => {
  // Hem mikrofon hem de ekran paylaşımı ses kaynaklarını dinliyoruz
  const trackRefs = useTracks([
    Track.Source.Microphone,
    Track.Source.ScreenShareAudio
  ]);

  // Uzak katılımcılardan gelen ses izlerini filtreliyoruz
  const remoteAudioTracks = trackRefs.filter((t) => {
    const isRemote = !t.participant.isLocal; // Kendi sesimiz olmamalı
    const isAudio = t.publication.kind === "audio"; // Sadece ses izleri
    // Track'in gerçekten yüklendiğini ve bir RemoteAudioTrack olduğunu doğruluyoruz
    const hasTrack = t.publication.track instanceof RemoteAudioTrack;
    
    return isRemote && isAudio && hasTrack;
  });

  // Eğer odada aktif ses gönderen (konuşan veya ekran paylaşan) yoksa
  if (remoteAudioTracks.length === 0) {
    return (
      <div className="w-72 bg-[#1E1F22] p-6 rounded-xl border border-[#313338] shadow-2xl text-center">
        <p className="text-zinc-500 text-xs italic">Aktif ses kanalı bulunamadı.</p>
      </div>
    );
  }

  return (
    <div className="w-72 bg-[#1E1F22]/95 p-4 rounded-xl border border-[#313338] shadow-2xl backdrop-blur-md">
      {/* Başlık ve Kanal Sayısı */}
      <div className="flex items-center justify-between mb-4 border-b border-zinc-700/50 pb-2">
        <h3 className="text-zinc-100 text-[11px] font-bold uppercase tracking-wider">
          Ses Denetimi
        </h3>
        <span className="text-[10px] bg-indigo-500 text-white px-1.5 py-0.5 rounded font-bold">
          {remoteAudioTracks.length} Kanal
        </span>
      </div>
      
      {/* Ses Kaydırıcıları (Mikrofon ve Ekran Sesi ayrı ayrı listelenir) */}
      <div className="flex flex-col gap-y-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
        {remoteAudioTracks.map((t) => (
          <AudioTrackSlider
            key={t.publication.trackSid} // Her track için benzersiz anahtar
            track={t.publication.track as RemoteAudioTrack}
            participantName={t.participant.name || t.participant.identity}
            // Kaynağın ekran paylaşımı olup olmadığını kontrol ediyoruz
            isScreenShare={t.source === Track.Source.ScreenShareAudio}
          />
        ))}
      </div>
    </div>
  );
};