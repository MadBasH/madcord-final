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

    try {
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

        if (server) {
            return redirect(`/servers/${server.id}`);
        }
    } catch (error: any) { // Hata tipini any olarak belirledik
        // Hata durumunda
        if (error.code === 'P2025') { // Geçersiz davet kodu hatası
            return (
                <div>
                    <h1>Invalid or expired invite code.</h1>
                    <p>Please check your invite code and try again.</p>
                </div>
            );
        }

        // Diğer hatalar için genel bir mesaj dönebiliriz
        return (
            <div>
                <h1>An error occurred.</h1>
                <p>Please try again later.</p>
            </div>
        );
    }

    return null;
}

export default InviteCodePage;
