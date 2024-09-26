"use client";
import { useEffect, useRef, useState } from "react";
import useField from "./useField";
import useGoogle from "../login/google";
import { decodeUsername } from "@/../utils/JWT";
import { useRouter, useSearchParams } from "next/navigation";
import AuthBackgroundWrapper from "./../../components/ui/AuthBackgroundWrapper";
import { encodeGmail } from "../../../../utils/OAuth";
import { useCookies } from "next-client-cookies";
export default function Page() {
  const cookies = useCookies();
  const router = useRouter();
  const createAccountRef = useRef(null);
  const [name, nameComponent] = useField({
    title: "Name*",
    placeholder: "name",
  });
  // const [username, setUsername] = useState("");
  const [gmail, gmailComponentState, gmailComponent] = useGoogle("signup");
  const token = useSearchParams().get("token");
  const username = decodeUsername(token);
  const [password, passwordComponent] = useField({
    title: "Password*",
    placeholder: "password",
  });
  const createAccount = async () => {
    createAccountRef.current.disabled = true;
    createAccountRef.current.backgroundColor = "gray";
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/create`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          username: username,
          password: password,
          gmail: encodeGmail(gmail),
          github: "a",
        }),
      }
    ).catch((err) => {
      console.log(err);
    });
    const resJSON = await res.json();
    if (res.status == 201) {
      cookies.set("token", resJSON.token);
      router.push("/");
    } else {
      console.log(resJSON.message);
      createAccountRef.current.disabled = false;
      createAccountRef.current.backgroundColor = "white";
    }
  };
  return (
    <>
      <AuthBackgroundWrapper>
        <div className="relative bg-white/10 backdrop-blur-md border border-white/10 shadow-[0_0_40px_rgba(8,7,16,0.6)] rounded-lg p-10 w-[400px]">
          <h3 className="text-center text-white text-2xl font-medium">
            Signup
          </h3>
          {nameComponent}

          <label htmlFor="username" className="block mt-6 text-white text-lg">
            Username
          </label>
          <input
            type="text"
            disabled
            value={username}
            className="w-full h-12 bg-white/10 rounded mt-2 px-3 text-white placeholder-white/50"
          />
          {passwordComponent}
          <div className="flex mt-5 flex-col">
            {gmailComponent}
            {gmailComponentState == "error" && (
              <div className="text-center text-red-600 text-sm italic mt-2">
                Gmail already linked to another account
              </div>
            )}
            <div className="w-full mt-3 text-center bg-white/30 py-3 rounded-lg text-white hover:bg-white/50 cursor-pointer">
              <i className="fab fa-facebook mr-2"></i>Link Github
            </div>
          </div>
          <button
            className="w-full mt-8 bg-white text-[#080710] py-3 rounded font-semibold text-lg hover:bg-gray-100"
            onClick={createAccount}
            ref={createAccountRef}
          >
            Create account
          </button>
        </div>
      </AuthBackgroundWrapper>
    </>
  );
}
