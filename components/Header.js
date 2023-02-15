import { useRouter } from "next/router";
import React from "react";

export default function Header() {
  const router = useRouter();
  return (
    <div>
      <header className="bg-blue-500 text-white shadow-lg p-2">
        <h1 onClick={() => router.push("/")} className="cursor-pointer">
          Driver Management Portal
        </h1>
        <div></div>
      </header>
    </div>
  );
}
