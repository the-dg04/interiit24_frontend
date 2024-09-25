// "use client"
import {
  GoogleOAuthProvider,
  GoogleLogin,
  useGoogleLogin,
} from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useCookies } from "next-client-cookies";
import { redirect, useRouter } from "next/navigation";

export default function GoogleLoginComponent() {
  const cookies = useCookies();
  const router = useRouter();
  const handleLogin = async (user) => {
    const res = await fetch(`${process.env.BACKEND_URL}/api/auth/login`, {
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
  // const login = useGoogleLogin({
  //   onSuccess: (credentialResponse) => {
  //     const decode = jwtDecode(credentialResponse.credential);
  //     const user = {
  //       email: decode.email,
  //     };
  //     return redirect("/ui/login")
  //     handleLogin(user);
  //   },
  //   ux_mode:"redirect",
  //   redirect_uri:"/"
  // });
  const login = () => {};
  return (
    <>
      <div
        class="flex-1 text-center bg-white/30 py-3 rounded-lg text-white hover:bg-white/50 cursor-pointer"
        onClick={login}
      >
        <i class="fab fa-google mr-2"></i>Google
      </div>
    </>
  );
}
