import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getServerSession } from "next-auth";
import { authOptions, DEV_EMAIL } from "@/lib/auth";
import { PARENT_PIN_COOKIE, verifyParentCookie } from "@/lib/parent-pin";

export default async function ProtectedParentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Dev account bypasses PIN entirely
  if (session?.user?.email === DEV_EMAIL) {
    return <>{children}</>;
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(PARENT_PIN_COOKIE)?.value;

  if (!token) {
    redirect("/parent-dashboard/verify");
  }

  const result = await verifyParentCookie(token);

  if (!result.parentId) {
    if (result.expired) {
      redirect("/parent-dashboard/verify?expired=true");
    }
    redirect("/parent-dashboard/verify");
  }

  return <>{children}</>;
}
