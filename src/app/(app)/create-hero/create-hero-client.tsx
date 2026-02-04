"use client";

import { useRouter } from "next/navigation";
import { CharacterCreator } from "@/components/character-creator";

interface CreateHeroClientProps {
  childId: string;
  childName: string;
  existingHero: {
    name: string;
    pixels: string[][];
  } | null;
}

export function CreateHeroClient({
  childId,
  childName,
  existingHero,
}: CreateHeroClientProps) {
  const router = useRouter();

  const handleSave = async (data: { name: string; pixels: string[][] }) => {
    const response = await fetch("/api/characters/hero", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        childId,
        name: data.name,
        pixelData: data.pixels,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to save hero");
    }

    // Navigate to dashboard after saving
    setTimeout(() => {
      router.push("/dashboard");
    }, 1500);
  };

  return (
    <CharacterCreator
      initialPixels={existingHero?.pixels}
      initialName={existingHero?.name}
      onSave={handleSave}
      childName={childName}
    />
  );
}


