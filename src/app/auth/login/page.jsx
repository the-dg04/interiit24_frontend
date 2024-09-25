"use client";
import useField from "./useField";
import GoogleLoginComponent from "./google";
import { useRef, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { useCookies } from "next-client-cookies";
export default function Page() {
  const router=useRouter()
  const cookies=useCookies()
  const handlePasswordLogin = async () => {
    LoginRef.current.disabled=true
    LoginRef.current.style.backgroundColor="gray"
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/login`,
      {
        method: "POST",
        headers: { "login-method": "password","Content-type":"application/json" },
        body: JSON.stringify({ username: username, password: password }),
      }
      ).catch((err) => {
        console.log(err);
      });
      if(res.status!=200){
        setUserDoesNotExistWarning(true)
      }else{
        setUserDoesNotExistWarning(false)
        const resJSON=await res.json()
        console.log(resJSON);
        cookies.set("temp_token",resJSON["temp_token"])
        cookies.set("expires_at",resJSON["expires_at"])
        router.push("/auth/OTPvalidate?type=login")
      }
      LoginRef.current.style.backgroundColor="white"
    LoginRef.current.disabled=false
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
  const LoginRef=useRef(null)
  return (
    <>
      <div className="wrapper bg-[#080710] h-screen flex items-center justify-center">
        <div class="absolute w-[430px] h-[520px]">
          <div class="absolute w-[200px] h-[200px] bg-gradient-to-r from-[#1845ad] to-[#23a2f6] rounded-full top-[-80px] left-[-80px]"></div>
          <div class="absolute w-[200px] h-[200px] bg-gradient-to-r from-[#ff512f] to-[#f09819] rounded-full bottom-[-80px] right-[-30px]"></div>
        </div>

        <div class="relative bg-white/10 backdrop-blur-md border border-white/10 shadow-[0_0_40px_rgba(8,7,16,0.6)] rounded-lg p-10 w-[400px]">
          <h3 class="text-center text-white text-2xl font-medium">Login</h3>

          {usernameComponent}
          {passwordComponent}

          <button
            class={`loginButton w-full mt-12 bg-white text-[#080710] py-3 rounded font-semibold text-lg hover:bg-gray-100`} ref={LoginRef}
            onClick={handlePasswordLogin}
          >
            Log In
          </button>
          {userDoesNotExistWarning && (
            <div className="flex text-red-600 italic text-sm mt-2 justify-center">
              Invalid credentials
            </div>
          )}
          <div class="flex space-x-6 mt-8">
            <GoogleLoginComponent />
            <div class="flex-1 text-center bg-white/30 py-3 rounded-lg text-white hover:bg-white/50 cursor-pointer">
              <i class="fab fa-facebook mr-2"></i>Github
            </div>
          </div>
          <a
            href="/auth/signup"
            className="flex justify-center text-white underline mt-2"
          >
            you need a fucking account huh?
          </a>
        </div>
      </div>
    </>
  );
}
