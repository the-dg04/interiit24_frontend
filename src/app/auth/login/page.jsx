"use client";
import useField from "./useField";
import useGoogle from "../_authMethods/google";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useCookies } from "next-client-cookies";
import GithubAuth from "../_authMethods/githubAuth";
import AuthBackgroundWrapper from "./../../components/ui/AuthBackgroundWrapper";

export default function Page() {
  const router = useRouter();
  const cookies = useCookies();
  const [gmail,googleComponentState,googleComponent]=useGoogle("login")
  useEffect(()=>{
    if(googleComponentState=="idle"){
      LoginRef.current.style.backgroundColor = "white";
      LoginRef.current.disabled = false;
      setUserDoesNotExistWarning(false)
    }else if(googleComponentState=="processing"){
      LoginRef.current.style.backgroundColor = "gray";
      LoginRef.current.disabled = true;
      setUserDoesNotExistWarning(false)
    }else if(googleComponentState=="error"){
      LoginRef.current.style.backgroundColor = "white";
      LoginRef.current.disabled = false;
      setUserDoesNotExistWarning(true)
    }
  },[googleComponentState])
  const handlePasswordLogin = async () => {
    LoginRef.current.disabled = true;
    LoginRef.current.style.backgroundColor = "gray";
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/login`,
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
  const [userDoesNotExistWarning, setUserDoesNotExistWarning] = useState(false);
  const LoginRef = useRef(null);
  return (
    <>
      <AuthBackgroundWrapper>
        <div className="relative bg-white/10 backdrop-blur-md border border-white/10 shadow-[0_0_40px_rgba(8,7,16,0.6)] rounded-lg p-10 w-[400px]">
          <h3 className="text-center text-white text-2xl font-medium">Login</h3>

          {usernameComponent}
          {passwordComponent}
          <a href="/auth/recover" className="mt-2 block underline">
            forgor password?
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
          <div className="flex space-x-6 mt-8">
            {googleComponent}
            <GithubAuth />
          </div>
          <a
            href="/auth/signup"
            className="flex justify-center text-white underline mt-2"
          >
            you need a fucking account huh?
          </a>
        </div>
      </AuthBackgroundWrapper>
    </>
  );
}
