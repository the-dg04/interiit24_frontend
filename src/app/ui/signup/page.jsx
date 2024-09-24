"use client";
import { useState } from "react";
import useField from "./useField";
export default function Page() {
  const [username, usernameComponent] = useField({
    title: "Choose a username",
    placeholder: "username",
  });
  const [usernameExistsWarning, setUsernameExistsWarning] = useState(false);
  return (
    <>
      <div className="wrapper bg-[#080710] h-screen flex items-center justify-center">
        <div class="absolute w-[430px] h-[520px]">
          <div class="absolute w-[200px] h-[200px] bg-gradient-to-r from-[#1845ad] to-[#23a2f6] rounded-full top-[-80px] left-[-80px]"></div>
          <div class="absolute w-[200px] h-[200px] bg-gradient-to-r from-[#ff512f] to-[#f09819] rounded-full bottom-[-80px] right-[-30px]"></div>
        </div>

        <form class="relative bg-white/10 backdrop-blur-md border border-white/10 shadow-[0_0_40px_rgba(8,7,16,0.6)] rounded-lg p-10 w-[400px]">
          <h3 class="text-center text-white text-2xl font-medium">Signup</h3>
          {usernameComponent}
          {usernameExistsWarning && (
            <div className="flex text-red-600 italic text-sm mt-2 justify-center">
              username already exists
            </div>
          )}
          <div class="flex space-x-6 mt-4"></div>
          <a
            href="/ui/login"
            className="flex justify-center text-white underline mt-2"
          >
            accidentally hit signup? login here
          </a>
        </form>
      </div>
    </>
  );
}
