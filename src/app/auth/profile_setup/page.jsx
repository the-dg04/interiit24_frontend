"use client";
import { useRef } from "react";
import useField from "./useField";
import useGoogle from "../_authMethods/google";
import useGithub from "../_authMethods/github";
import { decodeUsername} from "@/../utils/JWT";
import { useRouter, useSearchParams } from "next/navigation";
import { encodeGmail } from "../../../../utils/OAuth";
import { useCookies } from "next-client-cookies";
import { encodeGithub } from "../../../../utils/GAuth";

export default function Page() {
  const cookies = useCookies();
  const router = useRouter();
  const createAccountRef = useRef(null);
  const [name, nameComponent] = useField({
    title: "Name*",
    placeholder: "name",
  });

  const [gmail, gmailComponentState, gmailComponent] = useGoogle("signup");
  const [github, githubComponentState, githubComponent] = useGithub("signup");
  const token = useSearchParams().get("token");
  const username = decodeUsername(token);
  const [password, passwordComponent] = useField({
    title: "Password*",
    placeholder: "password",
  });

  const createAccount = async () => {
    createAccountRef.current.disabled = true;
    createAccountRef.current.style.backgroundColor = "gray";
    console.log(github);
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_AUTH_BACKEND_URL}/api/user/create`,
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
          github: github ? encodeGithub(github) : "",
        }),
      }
    ).catch((err) => {
      console.log(err);
    });
    const resJSON = await res.json();
    if (res.status === 201) {
      cookies.set("token", resJSON.token);
      router.push("/");
    } else {
      console.log(resJSON.message);
      createAccountRef.current.disabled = false;
      createAccountRef.current.style.backgroundColor = "white";
    }
  };

  return (
    <>
      <div className="relative bg-white/10 backdrop-blur-md border border-white/10 shadow-[0_0_40px_rgba(8,7,16,0.6)] rounded-lg p-10 w-[400px]">
        <h3 className="text-center text-white text-2xl font-medium">Signup</h3>
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

          {gmailComponentState === "error" && (
            <div className="text-center text-red-600 text-sm italic mt-2">
              Gmail already linked to another account
            </div>
          )}
          <div className="mt-2"></div>
          {githubComponent}

          {githubComponentState === "error" && (
            <div className="text-center text-red-600 text-sm italic mt-2">
              GitHub authentication failed
            </div>
          )}
        </div>

        <button
          className="w-full mt-8 bg-white text-[#080710] py-3 rounded font-semibold text-lg hover:bg-gray-100"
          onClick={createAccount}
          ref={createAccountRef}
        >
          Create account
        </button>
      </div>
    </>
  );
}
