"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { nanoid } from "nanoid";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const roomId = nanoid();
    router.push(`/${roomId}`);
  }, [router]);

  return <div className="text-center p-10">Redirecting to your room...</div>;
}
