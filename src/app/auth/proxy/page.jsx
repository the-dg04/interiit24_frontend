"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Proxy() {
  const router = useRouter();
  const URLParams = new URLSearchParams(window.location.search);
  useEffect(() => {
    if (URLParams.get("use_type") == "login") {
      router.push(`/auth/login?code=${URLParams.get("code")}`);
    } else {
      router.push(`/auth/profile_setup?token=${URLParams.get("token")}&code=${URLParams.get("code")}`);
    }
  }, []);
  return <></>
}
