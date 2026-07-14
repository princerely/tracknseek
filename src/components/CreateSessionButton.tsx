"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function CreateSessionButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleClick() {
    setPending(true);
    const response = await fetch("/api/sessions", { method: "POST" });
    const { code } = await response.json();
    router.push(`/create/${code}`);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      className="w-64 rounded-full bg-umber px-8 py-3 text-lg font-medium text-cream"
    >
      create a session
    </button>
  );
}
