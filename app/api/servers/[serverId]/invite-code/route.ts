// import { v4 as uuidv4 } from "uuid";
// import { currentProfile } from "@/lib/current-profile";
// import { db } from "@/lib/db";
// import { NextResponse } from "next/server";

// export async function PATCH(
//     req: Request,
//     { params }: { params: { serverId: string } }
// ) {
//     try {
//         const profile = await currentProfile();

//         if (!profile) {
//             return new NextResponse("Unauthorized", { status: 401 });
//         }

//         if (!params.serverId) {
//             return new NextResponse("Server ID Missing", { status: 400 });
//         }

//         const server = await db.server.update({
//             where: {
//                 id: params.serverId,
//                 profileId: profile.id,
//             },
//             data: {
//                 inviteCode: uuidv4(),
//             },
//         });
//         return NextResponse.json(server);
//     } catch (error) {
//         console.log("[SERVER_ID]", error);
//         return new NextResponse("Internal Error", { status: 500 });
//     }
// }

import { v4 as uuidv4 } from "uuid";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { MemberRole } from "@prisma/client";

export async function PATCH(
    req: Request,
    { params }: { params: { serverId: string } }
) {
    try {
        const profile = await currentProfile();

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!params.serverId) {
            return new NextResponse("Server ID Missing", { status: 400 });
        }

        // Sunucu üyesini bul
        const member = await db.member.findFirst({
            where: {
                serverId: params.serverId,
                profileId: profile.id,
            },
        });

        // Üye yoksa veya admin/moderator değilse hata döndür
        if (!member || (!MemberRole.ADMIN && !MemberRole.MODERATOR)) {
            return new NextResponse("Forbidden", { status: 403 });
        }

        // Davet kodunu güncelle
        const server = await db.server.update({
            where: {
                id: params.serverId,
            },
            data: {
                inviteCode: uuidv4(),
            },
        });
        return NextResponse.json(server);
    } catch (error) {
        console.log("[SERVER_ID]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
