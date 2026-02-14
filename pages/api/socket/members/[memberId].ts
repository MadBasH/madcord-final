// pages/api/socket/members/[memberId].ts

import { NextApiRequest } from "next";
import { NextApiResponseServerIo } from "@/types";
import { currentProfilePages } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== "DELETE" && req.method !== "PATCH") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const profile = await currentProfilePages(req);
    const { memberId } = req.query;
    const { serverId } = req.query;
    const { role } = req.body;

    if (!profile) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!serverId) {
      return res.status(400).json({ error: "Server ID missing" });
    }

    if (!memberId) {
      return res.status(400).json({ error: "Member ID missing" });
    }

    // SERVER'I GÜNCELLE
    const server = await db.server.update({
      where: {
        id: serverId as string,
        profileId: profile.id, // DİKKAT: Buradaki "not" ifadesini kaldırdım, çünkü genellikle Owner işlem yapar.
      },
      data: {
        members: {
          // DELETE işlemi (Kick) -> BURASI DÜZELTİLDİ
          ...(req.method === "DELETE" && {
            deleteMany: {
              id: memberId as string,
              profileId: {
                not: profile.id
              }
            }
          }),
          // PATCH işlemi (Rol Değiştirme)
          ...(req.method === "PATCH" && {
            update: {
              where: {
                id: memberId as string,
                profileId: {
                  not: profile.id
                }
              },
              data: {
                role
              }
            }
          })
        }
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: "asc",
          }
        }
      }
    });

    // SOCKET EMIT: Üyelerin değiştiğini herkese haber ver
    const updateKey = `server:${serverId}:members`;
    res.socket.server.io.emit(updateKey, server);

    return res.status(200).json(server);

  } catch (error) {
    console.log("[MEMBERS_ID]", error);
    return res.status(500).json({ message: "Internal Error" });
  }
}