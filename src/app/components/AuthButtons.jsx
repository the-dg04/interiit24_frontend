import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useCookies } from "next-client-cookies";
import { useRouter } from "next/navigation";

const GITHUB_CLIENT_ID = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;

export default function AuthButtons() {
  const clientid = process.env.NEXT_PUBLIC_OAUTH_CLIENT_ID;
  const cookies = useCookies();
  const router = useRouter();

  // Google login handler
  const handleGoogleLogin = async (user) => {
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

  // GitHub login handler
  const handleGitHubLogin = () => {
    const scope = 'read:user user:email';
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&scope=${scope}`;
  };

  return (
    <div className="w-full flex items-center justify-center gap-4">
      {/* Google Button */}
      <button
        className="flex-1 text-center bg-white/30 py-3 rounded-lg text-white hover:bg-white/50 cursor-pointer"
        onClick={() => {
          // Trigger Google login
          const googleLogin = (
            <GoogleOAuthProvider clientId={clientid}>
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  const decode = jwtDecode(credentialResponse.credential);
                  const user = { email: decode.email };
                  handleGoogleLogin(user);
                }}
                onError={() => {
                  console.log("Google Login Failed");
                }}
              />
            </GoogleOAuthProvider>
          );
          return googleLogin;
        }}
      >
        Google
      </button>

      {/* GitHub Button */}
      <button
        className="flex-1 text-center bg-white/30 py-3 rounded-lg text-white hover:bg-white/50 cursor-pointer"
        onClick={handleGitHubLogin}
      >
        Github
      </button>
    </div>
  );
}
