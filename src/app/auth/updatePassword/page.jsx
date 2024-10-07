"use client";
import { useEffect, useState } from "react";
import useField from "./useField";
import { useRouter } from "next/navigation";
import { useCookies } from "next-client-cookies";
export default function Page() {
  const router = useRouter();
  const cookies = useCookies();

  useEffect(()=>{if(!cookies.get("token")){router.push("/auth/login")}},[cookies, router])

  const [oldPassword, oldPasswordComponent] = useField({
    title: "Old Password",
    placeholder: "password",
  });
  const [newPassword, newPasswordComponent] = useField({
    title: "New password",
    placeholder: "password",
  });

  const handleUpdatePassword = async () => {
    const token = cookies.get("token");
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_AUTH_BACKEND_URL}/api/user/updatePassword`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ old_password:oldPassword,new_password:newPassword }),
      }
    ).catch((err) => {
      console.log(err);
    });
    const resJSON=await res.json()
    if(res.status==200){
      setErrorWarning(null)
      router.push("/auth/login")
    }else{
      setErrorWarning(resJSON.message)
    }
  };

  const [errorWarning, setErrorWarning] = useState(null);
  return (
    <>
        <div className="relative bg-white/10 backdrop-blur-md border border-white/10 shadow-[0_0_40px_rgba(8,7,16,0.6)] rounded-lg p-10 w-[400px]">
          <h3 className="text-center text-white text-2xl font-medium">
            Update Password
          </h3>
          {oldPasswordComponent}
          {newPasswordComponent}
          {errorWarning && (
            <div className="flex text-red-600 italic text-sm mt-2 justify-center">
              {errorWarning}
            </div>
          )}
          <button
            className="w-full mt-8 bg-white text-[#080710] py-3 rounded font-semibold text-lg hover:bg-gray-100"
            onClick={handleUpdatePassword}
          >
            Update
          </button>
          <div className="flex space-x-6 mt-4"></div>
        </div>
    </>
  );
}
