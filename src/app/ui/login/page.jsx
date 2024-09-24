/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import useField from "./useField";
import AuthButtons from "@/app/components/AuthButtons";

export default function Page() {
  const [username, usernameComponent] = useField({
    title: "Username",
    placeholder: "username",
  });
  const [password, passwordComponent] = useField({
    title: "Password",
    placeholder: "password",
  });

  return (
    <>
      <div className="wrapper bg-[#080710] h-screen flex items-center justify-center">
        {/* Background gradient circles */}
        <div className="absolute w-[430px] h-[520px]">
          <div className="absolute w-[200px] h-[200px] bg-gradient-to-r from-[#1845ad] to-[#23a2f6] rounded-full top-[-80px] left-[-80px]"></div>
          <div className="absolute w-[200px] h-[200px] bg-gradient-to-r from-[#ff512f] to-[#f09819] rounded-full bottom-[-80px] right-[-30px]"></div>
        </div>

        {/* Form Container */}
        <form className="relative bg-white/10 backdrop-blur-md border border-white/10 shadow-[0_0_40px_rgba(8,7,16,0.6)] rounded-lg p-10 w-[400px]">
          <h3 className="text-center text-white text-2xl font-medium">Login</h3>

          {/* Username and Password Fields */}
          {usernameComponent}
          {passwordComponent}

          {/* Login Button */}
          <button className="w-full mt-12 bg-white text-[#080710] py-3 rounded font-semibold text-lg hover:bg-gray-100">
            Log In
          </button>

          {/* Authentication Buttons */}
          <div className="flex space-x-6 mt-8">
            <AuthButtons />
          </div>

          {/* Sign-up Link */}
          <a
            href="/ui/signup"
            className="flex justify-center text-white underline mt-2"
          >
            You need a freaking account huh?
          </a>
        </form>
      </div>
    </>
  );
}
