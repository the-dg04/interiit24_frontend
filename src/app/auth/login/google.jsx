"use client"
import {
  useGoogleLogin,
} from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useCookies } from "next-client-cookies";
import { useRouter } from "next/navigation";

export default function GoogleLoginComponent() {
  const cookies = useCookies();
  const router = useRouter();
  const handleLogin = async (user) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: user.email }),
    }).then((res) => res.json());
    console.log(res);
    if (res.newUser) {
      router.push(`/register?authToken=${res.authToken}`);
    } else {
      cookies.set("authToken", res.authToken);
      router.push("/dashboard");
    }
  };
  const login = useGoogleLogin({
    onSuccess: (credentialResponse) => {
      const decode = jwtDecode(credentialResponse.credential);
      const user = {
        email: decode.email,
      };
      return redirect("/ui/login")
      handleLogin(user);
    },
    ux_mode:"redirect",
    redirect_uri:"/"
  });

  return (
    <>
      <div
<<<<<<< HEAD
        className="flex-1 text-center bg-white/30 py-3 rounded-lg text-white hover:bg-white/50 cursor-pointer"
=======
        className="flex-1 text-center bg-white/30 py-3 rounded-lg text-white hover:bg-white/50 cursor-pointer p-2"
>>>>>>> 5c6e9725f95ac8fba049aaea6d9a42533f5c0f83
        onClick={login}
      >
        <i className="fab fa-google mr-2"></i>Google
      </div>
    </>
  );
}
