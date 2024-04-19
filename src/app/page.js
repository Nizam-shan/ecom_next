"use client";

import { GlobalContext } from "@/context";
import Image from "next/image";
import { useContext } from "react";

export default function Home() {
  const { isAuthUser } = useContext(GlobalContext);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-white text-black">
      <h1>E-commerce website</h1>
    </main>
  );
}
