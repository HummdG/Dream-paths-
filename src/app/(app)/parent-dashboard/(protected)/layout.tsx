import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { PARENT_PIN_COOKIE, verifyParentCookie } from "@/lib/parent-pin";

export default async function ProtectedParentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
