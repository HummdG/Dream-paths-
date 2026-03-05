import { Suspense } from "react";
import { VerifyClient } from "./verify-client";

interface Props {
  searchParams: Promise<{ expired?: string }>;
}

export default async function ParentVerifyPage({ searchParams }: Props) {
  const params = await searchParams;
  const expired = params.expired === "true";

  return (
    <Suspense>
      <VerifyClient expired={expired} />
    </Suspense>
  );
}
