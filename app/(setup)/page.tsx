import { redirect } from "next/navigation";
import { initialProfile } from "@/lib/initial-profile";
import { db } from "@/lib/db";
import { InitialModal } from "@/components/modals/initial-modal";
import { NextResponse } from "next/server";

const SetupPage = async () => {
  const profile = await initialProfile();

  // Check if 'profile' is an instance of NextResponse
  if (profile instanceof NextResponse) {
    // Handle this case appropriately
    return redirect('/error'); // Redirect to an error page or handle it accordingly
  }

  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (server) {
    return redirect(`/servers/${server.id}`);
  }

  return <InitialModal />;
};

export default SetupPage;
