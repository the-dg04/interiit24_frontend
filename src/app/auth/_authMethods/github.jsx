"use client";
import { useEffect, useState } from "react";
import { encodeGithub } from "../../../../utils/GAuth";
import { useCookies } from "next-client-cookies";
import { useRouter, useSearchParams } from "next/navigation";

export default function useGithub(use_type) {
  const [github, setGithub] = useState(null);
  const [currentState, setCurrentState] = useState("idle");
  const [, setLoading] = useState(false);
  const [, setError] = useState(null);
  const cookies = useCookies();
  const router = useRouter();
  const profile_token = useSearchParams().get("token");
  const urlParams = useSearchParams();
  const [code, setCode] = useState(useSearchParams().get("code"));
  useEffect(() => {
    if (!code) return;
    const authCode = urlParams.get("code");
    setCode(authCode);

    if (code) {
      authenticateWithGithub(code);
    }
  }, [code]);

  const handleLogin = async (token) => {
    setLoading(true);
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_AUTH_BACKEND_URL}/api/user/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "login-method": "github",
        },
        body: JSON.stringify({ token: token }),
      }
    ).catch((err) => {
      console.log(err);
    });
    const resJSON = await res.json();
    if (res.status != 200) {
      if (resJSON.message == "empty github") {
        setCurrentState("processing");
      } else {
        setCurrentState("error");
      }
    } else {
      cookies.set("temp_token", resJSON["temp_token"]);
      cookies.set("expires_at", resJSON["expires_at"]);
      router.push("/auth/OTPvalidate?type=login");
    }
  };

  const handleSignup = async (token) => {
    try {
      const checkRes = await fetch(
        `${process.env.NEXT_PUBLIC_AUTH_BACKEND_URL}/api/user/checkGithub`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ github: token }),
        }
      );

      const checkResJSON = await checkRes.json();

      if (checkResJSON.userExists) {
        setCurrentState("error");
        console.log("User already exists.");
        return false;
      } else {
        return true;
      }
    } catch (error) {
      console.error("Signup error:", error);
      setError(error.message);
      setCurrentState("error");
    }
  };

  const authenticateWithGithub = async (code) => {
    setCurrentState("processing");
    setLoading(true);
    console.log(code);
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_AUTH_BACKEND_URL}/api/user/githubTokenToUserData`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ code: code }),
      }
    );
    if (res.status != 200) {
      setError("error");
      setLoading(false);
      setCurrentState("error");
    } else {
      const resJSON = await res.json();
      const token = encodeGithub(resJSON.login);
      if (use_type === "login") {
        await handleLogin(token);
      } else if (use_type === "signup") {
        handleSignup(token).then((res) => {
          if (res) {
            setGithub(resJSON.login);
          }
        });
      } else {
        setCurrentState("idle");
      }
    }
  };

  const redirectToGitHub = () => {
    const client_id = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
    const scope = "read:user user:email";
    console.log("E", profile_token);
    if (profile_token == null && use_type == "signup") return;
    const redirect_uri =
      use_type === "signup"
        ? `http://localhost:3000/auth/proxy?token=${profile_token}&use_type=signup`
        : `http://localhost:3000/auth/proxy?use_type=login`;
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${client_id}&scope=${scope}&redirect_uri=${redirect_uri}`;
    console.log(authUrl);
    window.location.href = authUrl;
  };

  const component = (
    <div
      className="flex-1 text-center bg-white/30 py-3 rounded-lg text-white hover:bg-white/50 cursor-pointer p-2"
      onClick={redirectToGitHub}
    >
      {github || (use_type == "signup" ? "Link " : "") + "Github"}
    </div>
  );

  return [github, currentState, component];
}
