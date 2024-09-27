"use client";
import useField from "./useField";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useCookies } from "next-client-cookies";

export default function Page() {
  const router = useRouter();
  const cookies = useCookies();
  const handlePasswordLogin = async () => {
    LoginRef.current.disabled = true;
    LoginRef.current.style.backgroundColor = "gray";
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/tempLogin`,
      {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ username: username, gmail: gmail }),
      }
    ).catch((err) => {
      console.log(err);
    });
    if (res.status != 200) {
      setUserDoesNotExistWarning(true);
    } else {
      setUserDoesNotExistWarning(false);
      const resJSON = await res.json();
      console.log(resJSON);
      cookies.set("temp_token", resJSON["temp_token"]);
      cookies.set("expires_at", resJSON["expires_at"]);
      router.push("/auth/OTPvalidate?type=recovery");
    }
    LoginRef.current.style.backgroundColor = "white";
    LoginRef.current.disabled = false;
  };

  const [username, usernameComponent] = useField({
    title: "Username*",
    placeholder: "username",
  });
  const [gmail, gmailComponent] = useField({
    title: "Gmail*",
    placeholder: "gmail",
  });
  const [userDoesNotExistWarning, setUserDoesNotExistWarning] = useState(false);
  const LoginRef = useRef(null);
  return (
    <>

        <div className="relative bg-white/10 backdrop-blur-md border border-white/10 shadow-[0_0_40px_rgba(8,7,16,0.6)] rounded-lg p-10 w-[400px]">
          <h3 className="text-center text-white text-2xl font-medium">
            Password Recovery
          </h3>

          {usernameComponent}
          {gmailComponent}
          <button
            className={`loginButton w-full mt-12 bg-white text-[#080710] py-3 rounded font-semibold text-lg hover:bg-gray-100`}
            ref={LoginRef}
            onClick={handlePasswordLogin}
          >
            Continue &gt;
          </button>
          {userDoesNotExistWarning && (
            <div className="flex text-red-600 italic text-sm mt-2 justify-center">
              Invalid credentials
            </div>
          )}
        </div>
    </>
  );
}
