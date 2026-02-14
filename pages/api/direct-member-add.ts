import { NextApiRequest } from "next";
import { NextApiResponseServerIo } from "@/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { serverId } = req.body;

    if (!serverId) {
        return res.status(400).json({ error: "Server ID missing" });
    }

    const updateKey = `server:${serverId}:members`;

    // Socket.io sunucusu var mı kontrol et
    if (res.socket?.server?.io) {
        
        res.socket.server.io.emit(updateKey, {
            action: "new-member-joined",
            serverId: serverId
        });
        
        console.log("🚀 [API] Sinyal BAŞARIYLA gönderildi!");
    } else {
        console.log("❌ [API] HATA: Socket.io sunucusu (res.socket.server.io) BULUNAMADI!");
        console.log("⚠️ [API] Bu durum genellikle next dev ortamında ilk yüklemede olur.");
        return res.status(500).json({ message: "Socket server not ready" });
    }
    console.log("------------------------------------------");

    return res.status(200).json({ message: "Socket signal sent" });
  } catch (error) {
    console.log("❌ [API] CRITICAL ERROR:", error);
    return res.status(500).json({ message: "Internal Error" });
  }
}