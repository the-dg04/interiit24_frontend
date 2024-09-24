"use client";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useCookies } from "next-client-cookies";
import { useRouter } from "next/navigation";

export default function GoogleLoginFunction() {
  const clientid = process.env.NEXT_PUBLIC_OAUTH_CLIENT_ID;
  const cookies = useCookies();
  const router = useRouter();

  const handleLogin = async (user) => {
    const res = await fetch(
      `${process.env.BACKEND_URL}/api/auth/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      }
    ).then((res) => res.json());
    console.log(res);
    if (res.newUser) {
      router.push(`/register?authToken=${res.authToken}`);
    } else {
      cookies.set("authToken", res.authToken);
      router.push("/dashboard");
    }
  };

  return (
    <>
      <div className="w-full flex items-center justify-center">
        <GoogleOAuthProvider clientId={clientid}>
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              const decode = jwtDecode(credentialResponse.credential);
              // console.log(decode);
              const user = {
                email: decode.email,
              };
              handleLogin(user);
            }}
            onError={() => {
              console.log("Login Failed");
            }}
          />
        </GoogleOAuthProvider>
      </div>
    </>
  );
}