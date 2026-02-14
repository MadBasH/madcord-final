// pages/api/socket/servers/[serverId]/leave.ts
import { NextApiRequest } from "next";
import { NextApiResponseServerIo } from "@/types";
import { currentProfilePages } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponseServerIo) {
  if (req.method !== "PATCH") return res.status(405).json({ error: "Method not allowed" });

  try {
    const profile = await currentProfilePages(req);
    const { serverId } = req.query;

    if (!profile || !serverId) return res.status(400).json({ error: "Missing data" });

    const server = await db.server.update({
      where: {
        id: serverId as string,
        profileId: { not: profile.id }, // Admin kendini atamaz/ayrılamaz kontrolü
        members: { some: { profileId: profile.id } }
      },
      data: {
        members: {
          deleteMany: { profileId: profile.id }
        }
      },
      include: { members: { include: { profile: true }, orderBy: { role: "asc" } } }
    });

    // SOCKET EMIT
    const updateKey = `server:${serverId}:members`;
    res.socket.server.io.emit(updateKey, server);

    return res.status(200).json(server);
  } catch (error) {
    return res.status(500).json({ message: "Internal Error" });
  }
}