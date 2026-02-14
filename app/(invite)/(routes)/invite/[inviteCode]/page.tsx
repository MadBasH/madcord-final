import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

interface InviteCodePageProps {
    params: {
        inviteCode: string;
    };
};

const InviteCodePage = async ({
    params
}: InviteCodePageProps) => {
    const profile = await currentProfile();
    
    if (!profile) {
        return redirectToSignIn();
    }

    if (!params.inviteCode) {
        return redirect("/");
    }

    const existingServer = await db.server.findFirst({
        where: {
            inviteCode: params.inviteCode,
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    });

    if (existingServer) {
        return redirect(`/servers/${existingServer.id}`);
    }

    const server = await db.server.update({
        where: {
            inviteCode: params.inviteCode,
        },
        data: {
            members: {
                create: [
                    {
                        profileId: profile.id,
                    }
                ]
            }
        }
    });

    // --- SOCKET GÜNCELLEME KISMI ---
    if (server) {
        // Site URL'ini belirle (Deploy edildiğinde veya Localhost'ta çalışması için)
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

        try {
            // İsteği gönderiyoruz ve cevabı bekliyoruz (await)
            const response = await fetch(`${siteUrl}/api/direct-member-add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    serverId: server.id,
                }),
            });

            if (response.ok) {
                console.log("✅ [INVITE PAGE] Socket API Başarılı!");
            } else {
                // API hata dönerse sebebini logluyoruz
                const errText = await response.text();
                console.log("❌ [INVITE PAGE] Socket API Hatası:", response.status, errText);
            }
        } catch (error) {
            // Fetch hatası olursa (örneğin sunucu kapalıysa)
            console.log("❌ [INVITE PAGE] Fetch Hatası:", error);
        }

        return redirect(`/servers/${server.id}`);
    }

    return null;
}
 
export default InviteCodePage;