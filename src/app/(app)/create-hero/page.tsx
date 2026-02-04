import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { CreateHeroClient } from "./create-hero-client";

export default async function CreateHeroPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Get the parent's first child
  const parent = await prisma.parent.findUnique({
    where: { id: session.user.id },
    include: {
      children: {
        include: {
          heroCharacter: true,
        },
        take: 1,
      },
    },
  });

  if (!parent?.children?.[0]) {
    redirect("/onboarding");
  }

  const child = parent.children[0];
  const existingHero = child.heroCharacter;

  return (
    <CreateHeroClient
      childId={child.id}
      childName={child.firstName}
      existingHero={
        existingHero
          ? {
              name: existingHero.name,
              pixels: existingHero.pixelData as string[][],
            }
          : null
      }
    />
  );
}


