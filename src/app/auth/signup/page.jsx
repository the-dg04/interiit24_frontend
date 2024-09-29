"use client";
import { useState } from "react";
import useField from "./useField";
import { useRouter } from "next/navigation";
import { encodeUsername } from "@/../utils/JWT";
export default function Page() {
  const router = useRouter();
  const [username, usernameComponent] = useField({
    title: "Choose a username",
    placeholder: "username",
  });

  const handleContinue = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/CheckUsername`,
      {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ username: username }),
      }
    ).catch((err) => {
      console.log(err);
    });
    if (res.status == 200) {
      const resJSON = await res.json();
      if (resJSON["userExists"]) {
        setUsernameExistsWarning(true);
      } else {
        setUsernameExistsWarning(false);
        const token = encodeUsername(username);
        router.push(`/auth/profile_setup?token=${token}`);
      }
    }
  };

  const [usernameExistsWarning, setUsernameExistsWarning] = useState(false);
  return (
    <>
        <div className="relative bg-white/10 backdrop-blur-md border border-white/10 shadow-[0_0_40px_rgba(8,7,16,0.6)] rounded-lg p-10 w-[400px]">
          <h3 className="text-center text-white text-2xl font-medium">
            Signup
          </h3>
          {usernameComponent}
          {usernameExistsWarning && (
            <div className="flex text-red-600 italic text-sm mt-2 justify-center">
              username already exists
            </div>
          )}
          <button
            className="w-full mt-8 bg-white text-[#080710] py-3 rounded font-semibold text-lg hover:bg-gray-100"
            onClick={handleContinue}
          >
            Continue &gt;
          </button>
          <div className="flex space-x-6 mt-4"></div>
          <a
            href="/auth/login"
            className="flex justify-center text-white underline mt-2"
          >
            accidentally hit signup? login here
          </a>
        </div>
    </>
  );
}
