/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useCookies } from "next-client-cookies";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const router = useRouter();
  const cookies = useCookies();
  useEffect(() => {
    cookies.remove("temp_token");
    cookies.remove("expires_at");
    cookies.remove("token");
    router.push("/");
  }, []);
  return <></>;
}
