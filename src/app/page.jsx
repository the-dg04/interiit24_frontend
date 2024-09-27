"use client";
import { useState } from "react";
import AuthBackgroundWrapper from "./components/ui/AuthBackgroundWrapper";
import Image from "next/image";
export default function Page() {
  return (
    <>
      <AuthBackgroundWrapper>
        <div className="relative bg-white/10 backdrop-blur-md border border-white/10 shadow-[0_0_40px_rgba(8,7,16,0.6)] rounded-lg p-10 w-[400px]">
          <h3 className="text-center text-white text-2xl font-medium">
            Get Started
          </h3>
          <div className="mt-4">
            <Image src="/cat_gif.webp" height={400} width={400} />
          </div>
          <a
            href="/auth/login"
            className="block text-center w-full mt-8 bg-white text-[#080710] py-3 rounded font-semibold text-lg hover:bg-gray-100"
          >
            Login
          </a>
          <div className="flex space-x-6 mt-4">
            <a
              href="/history"
              className="flex-1 text-center text-white font-bold mt-2 border border-gray-500 rounded p-3 transition hover:bg-white hover:text-black"
            >
              History
            </a>
            <a
              href="/company"
              className="flex-1 text-center text-white font-bold mt-2 border border-gray-500 rounded p-3 transition hover:bg-white hover:text-black"
            >
              Company
            </a>
          </div>
        </div>
      </AuthBackgroundWrapper>
    </>
  );
}
