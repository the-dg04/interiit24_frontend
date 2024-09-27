"use client";
import { useRef, useState } from "react";
import useOTP from "./useOTP";
import { useRouter, useSearchParams } from "next/navigation";
import { useCookies } from "next-client-cookies";
import useField from "../recover/useField";
export default function Page() {
  const [otp, otpComponent] = useOTP();
  const [otpWarning, setOtpWarning] = useState(false);
  const validateRef = useRef();
  const router = useRouter();
  const cookies = useCookies();
  const otp_type = useSearchParams().get("type");
  const [newPassword, newPasswordComponent] = useField({
    title: "New Password",
    placeholder: "password",
  });
  const handleOtpValidation = async () => {
    validateRef.current.disabled = true;
    validateRef.current.style.backgroundColor = "gray";
    // console.log(otp.join(""),otp_type);
    var bodyObject = {
      temp_token: cookies.get("temp_token"),
      otp: otp.join(""),
    };
    if (otp_type == "recovery") {
      bodyObject["new_password"] = newPassword;
    }
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/${
        otp_type == "login" ? "validateOTP" : "user/recoverPassword"
      }`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(bodyObject),
      }
    ).catch((err) => {
      console.log(err);
    });
    if (res.status != 200) {
      // setUserDoesNotExistWarning(true);
      setOtpWarning(true);
      const resJSON = await res.json();
      console.log(resJSON);
    } else {
      // setUserDoesNotExistWarning(false);
      setOtpWarning(false);
      const resJSON = await res.json();
      console.log(resJSON);
      cookies.remove("temp_token");
      cookies.remove("expires_at");
      if (otp_type == "login") cookies.set("token", resJSON["token"]);
      router.push("/");
    }
    validateRef.current.style.backgroundColor = "white";
    validateRef.current.disabled = false;
  };

  return (
    <>
        <div className="relative bg-white/10 backdrop-blur-md border border-white/10 shadow-[0_0_40px_rgba(8,7,16,0.6)] rounded-lg p-10 w-[400px]">
          <h3 className="text-center text-white text-2xl font-medium">2FA</h3>
          {otpComponent}
          {otp_type == "recovery" && newPasswordComponent}
          <button
            className="w-full mt-8 bg-white text-[#080710] py-3 rounded font-semibold text-lg hover:bg-gray-100"
            onClick={handleOtpValidation}
            ref={validateRef}
          >
            Validate
          </button>
          {otpWarning && (
            <div className="flex text-red-600 italic text-sm mt-2 justify-center">
              Invalid OTP
            </div>
          )}
          <div className="flex space-x-6 mt-4"></div>
          <a href="" className="flex justify-center text-white underline mt-2">
            Resend OTP
          </a>
        </div>
    </>
  );
}
