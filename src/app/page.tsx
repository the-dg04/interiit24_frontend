// 'use client'
import GoogleLoginFunction from "./auth/login/google";
import GitHubLoginFunction from "./auth/login/github";
import { CookiesProvider } from "next-client-cookies/server";
import Link from "next/link";

export default function Home() {
  return (
    <CookiesProvider>
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <Link href="/history" className="bg-gray-500 p-2 rounded-md">History</Link>
        <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
          <GoogleLoginFunction />
          <GitHubLoginFunction />
        </main>
      </div>
    </CookiesProvider>
  );
}
