"use client";
import { useEffect, useState } from "react";
import { encodeGithub } from "../../../../utils/GAuth";

export default function useGithub(use_type) {
  const [github, setGithub] = useState(null);
  const [currentState, setCurrentState] = useState("idle");
  const [, setLoading] = useState(false);
  const [, setError] = useState(null);

  let urlParams;
  if (typeof window !== "undefined") {
    urlParams = new URLSearchParams(window.location.search);
  } else {
    urlParams = new URLSearchParams();
  }
  const [code, setCode] = useState(urlParams.get("code"));

  useEffect(() => {
    if (!code) return;
    const urlParams = new URLSearchParams(window.location.search);
    const authCode = urlParams.get("code");
    setCode(authCode);

    if (authCode && !localStorage.getItem("token")) {
      authenticateWithGithub(authCode);
    }
  }, [code]);

  const handleLogin = (token) => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "login-method": "gmail",
      },
      body: JSON.stringify({ token: token }),
    })
      .catch((err) => {
        console.log(err);
      })
      .then((res) => {
        if (res.status !== 200) {
          setError(true);
        }
        return res, res.status !== 200;
      })
      .then((res, err) => {
        return res.json(), err;
      })
      .then((resJSON, err) => {
        if (!err) {
          cookies.set("temp_token", resJSON["temp_token"]);
          cookies.set("expires_at", resJSON["expires_at"]);
          router.push("/auth/OTPvalidate?type=login");
        }
      });
  };

  const handleSignup = async (token) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/checkGithub`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ github: token }),
      }
    ).catch((err) => {
      console.log(err);
    });

    const resJSON = await res.json();
    if (resJSON.userExists) {
      setCurrentState("error");
    } else {
      setGithub(token);
      setCurrentState("idle");
    }
  };

  const authenticateWithGithub = (code) => {
    setCurrentState("processing");
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/githubLogin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code: code }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to authenticate with GitHub");
        }
        return res.json();
      })
      .then((data) => {
        console.log(`Email: ${data.email}`);
        const token = encodeGithub(data.login);
        console.log(`Token: ${token}`);

        if (use_type === "login") {
          handleLogin(token);
        } else if (use_type === "signup") {
          handleSignup(token);
        } else {
          setCurrentState("idle");
          setGithub(data);
        }
      })
      .catch((error) => {
        console.error("Authentication error:", error);
        setError(error.message);
        setLoading(false);
        setCurrentState("error");
      });
  };

  const redirectToGitHub = () => {
    const client_id = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
    const scope = "read:user user:email";
    const redirect_uri =
      use_type === "signup"
        ? `${process.env.NEXT_PUBLIC_REDIRECT_URI}/auth/profile_setup`
        : `${process.env.NEXT_PUBLIC_REDIRECT_URI}/auth/OTPvalidate?type=login`;
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${client_id}&scope=${scope}&redirect_uri=${redirect_uri}`;
    window.location.href = authUrl;
  };

  const component = (
    <div
      className="flex-1 text-center bg-white/30 py-3 rounded-lg text-white hover:bg-white/50 cursor-pointer p-2"
      onClick={redirectToGitHub}
    >
      GitHub
    </div>
  );

  return [github, currentState, component];
}
