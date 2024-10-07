"use client";
import useField from "./useField";
import useGoogle from "../_authMethods/google";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useCookies } from "next-client-cookies";
import useGithub from "../_authMethods/github";

export default function Page() {
  const router = useRouter();
  const cookies = useCookies();
  const [, googleComponentState, googleComponent] = useGoogle("login");
  const [, githubComponentState, githubComponent] = useGithub("login");
  const [userDoesNotExistWarning, setUserDoesNotExistWarning] = useState(false);
  const [githubErrorWarning, setGithubErrorWarning] = useState(false);

  useEffect(() => {
    if (googleComponentState == "idle") {
      LoginRef.current.style.backgroundColor = "white";
      LoginRef.current.disabled = false;
      setUserDoesNotExistWarning(false);
    } else if (googleComponentState == "processing") {
      LoginRef.current.style.backgroundColor = "gray";
      LoginRef.current.disabled = true;
      setUserDoesNotExistWarning(false);
    } else if (googleComponentState == "error") {
      LoginRef.current.style.backgroundColor = "white";
      LoginRef.current.disabled = false;
      setUserDoesNotExistWarning(true);
    }
  }, [googleComponentState]);

  useEffect(() => {
    if (githubComponentState == "idle") {
      LoginRef.current.style.backgroundColor = "white";
      LoginRef.current.disabled = false;
      setUserDoesNotExistWarning(false);
    } else if (githubComponentState == "processing") {
      LoginRef.current.style.backgroundColor = "gray";
      LoginRef.current.disabled = true;
      setUserDoesNotExistWarning(false);
    } else if (githubComponentState == "error") {
      LoginRef.current.style.backgroundColor = "white";
      LoginRef.current.disabled = false;
      setUserDoesNotExistWarning(true);
    }
  }, [githubComponentState]);

  useEffect(() => {
    if (githubComponentState === "idle") {
      setGithubErrorWarning(false);
    } else if (githubComponentState === "processing") {
      setGithubErrorWarning(false);
    } else if (githubComponentState === "error") {
      setGithubErrorWarning(true);
    }
  }, [githubComponentState]);

  const handlePasswordLogin = async () => {
    LoginRef.current.disabled = true;
    LoginRef.current.style.backgroundColor = "gray";
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_AUTH_BACKEND_URL}/api/user/login`,
      {
        method: "POST",
        headers: {
          "login-method": "password",
          "Content-type": "application/json",
        },
        body: JSON.stringify({ username: username, password: password }),
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
      router.push("/auth/OTPvalidate?type=login");
    }
    LoginRef.current.style.backgroundColor = "white";
    LoginRef.current.disabled = false;
  };

  const [username, usernameComponent] = useField({
    title: "Username",
    placeholder: "username",
  });
  const [password, passwordComponent] = useField({
    title: "Password",
    placeholder: "password",
  });
  const LoginRef = useRef(null);
  return (
    <>
      <div className="relative bg-white/10 backdrop-blur-md border border-white/10 shadow-[0_0_40px_rgba(8,7,16,0.6)] rounded-lg p-10 w-[400px]">
        <h3 className="text-center text-white text-2xl font-medium">Login</h3>

        {usernameComponent}
        {passwordComponent}
        <a href="/auth/recover" className="mt-2 block underline">
          forgot password?
        </a>
        <button
          className={`loginButton w-full mt-12 bg-white text-[#080710] py-3 rounded font-semibold text-lg hover:bg-gray-100`}
          ref={LoginRef}
          onClick={handlePasswordLogin}
        >
          Log In
        </button>

        {userDoesNotExistWarning && (
          <div className="flex text-red-600 italic text-sm mt-2 justify-center">
            Invalid credentials
          </div>
        )}

        {githubErrorWarning && (
          <div className="flex text-red-600 italic text-sm mt-2 justify-center">
            GitHub authentication failed. User does not exist
          </div>
        )}
        <div className="flex space-x-6 mt-8">
          {googleComponent}
          {githubComponent}
        </div>
        <a
          href="/auth/signup"
          className="flex justify-center text-white underline mt-2"
        >
          you need a fucking account huh?
        </a>
      </div>
    </>
  );
}
