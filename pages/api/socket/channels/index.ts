// pages/api/socket/channels/index.ts

import { NextApiRequest } from "next";
import { NextApiResponseServerIo } from "@/types"; // Bu tip tanımının projenizde olduğunu varsayıyorum
import { currentProfilePages } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const profile = await currentProfilePages(req);
    const { name, type } = req.body;
    const { serverId } = req.query;

    if (!profile) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!serverId) {
      return res.status(400).json({ error: "Server ID missing" });
    }

    if (name === "general") {
      return res.status(400).json({ error: "Name cannot be 'general'" });
    }

    // Veritabanına kanalı ekle
    const server = await db.server.update({
      where: {
        id: serverId as string,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR]
            }
          }
        }
      },
      data: {
        channels: {
          create: {
            profileId: profile.id,
            name,
            type,
          }
        }
      },
      include: {
        channels: true
      }
    });

    /* KRİTİK NOKTA BURASI:
       Kanal oluşturulduktan sonra socket'e haber veriyoruz.
       Event ismi: "server:{serverId}:channels"
    */
    const updateKey = `server:${serverId}:channels`;
    res.socket.server.io.emit(updateKey, server);

    return res.status(200).json(server);

  } catch (error) {
    console.log("[CHANNELS_POST]", error);
    return res.status(500).json({ message: "Internal Error" });
  }
}