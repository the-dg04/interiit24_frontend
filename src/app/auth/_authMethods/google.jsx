"use client";
import { useGoogleLogin } from "@react-oauth/google";
import { useCookies } from "next-client-cookies";
import { useRouter } from "next/navigation";
import { encodeGmail, getUserEmail } from "@/../utils/OAuth";
import { useState } from "react";

export default function useGoogle(use_type) {
  const cookies = useCookies();
  const router = useRouter();
  const [gmail, setGmail] = useState(null);
  const [currentState, setCurrentState] = useState("idle"); // possible states : idle | processing | error

  const handleLogin = async (email) => {
    const token = encodeGmail(email);
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "login-method": "gmail",
        },
        body: JSON.stringify({ token: token }),
      }
    ).catch((err) => {
      console.log(err);
    });
    const resJSON = await res.json();
    if (res.status == 200) {
      cookies.set("temp_token", resJSON["temp_token"]);
      cookies.set("expires_at", resJSON["expires_at"]);
      router.push("/auth/OTPvalidate?type=login");
    } else {
      setCurrentState("error");
    }
  };

  const handleSignup = async (email) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/checkGmail`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ gmail: email }),
      }
    ).catch((err) => {
      console.log(err);
    });
    const resJSON = await res.json();
    if (resJSON.userExists) {
      setCurrentState("error");
    } else {
      setGmail(email);
      setCurrentState("idle");
    }
  };
  
  const login = useGoogleLogin({
    onSuccess: async (credentialResponse) => {
      setCurrentState("processing");
      const res = await getUserEmail(credentialResponse.access_token);
      console.log(res);
      if (use_type == "login") {
        await handleLogin(res);
      } else if (use_type == "signup") {
        await handleSignup(res);
      } else {
        setCurrentState("idle");
        setGmail(res);
      }
    },
    ux_mode: "redirect",
    redirect_uri: "/",
  });

  const component = (
    <>
      <div
        className="flex-1 text-center bg-white/30 py-3 rounded-lg text-white hover:bg-white/50 cursor-pointer p-2"
        onClick={login}
      >
        <i className="fab fa-google mr-2"></i>
        {gmail || (use_type == "signup" ? "Link " : "") + "Google"}
      </div>
    </>
  );
  return [gmail, currentState, component];
}
