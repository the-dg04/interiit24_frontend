"use client";
import { useEffect, useState } from "react";

export default function useGithub(use_type) {
  const [github, setGithub] = useState(null);
  const [currentState, setCurrentState] = useState("idle");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
        checkUserExists(data);
      })
      .catch((error) => {
        console.error("Authentication error:", error);
        setError(error.message);
        setLoading(false);
        setCurrentState("error");
      });
  };

  const checkUserExists = (data) => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/checkGithub`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${data.accessToken}`,
      },
      body: JSON.stringify({ github: data.email }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to verify GitHub email");
        }
        return res.json();
      })
      .then((userRes) => {
        if (userRes.userExists) {
          localStorage.setItem("token", `Bearer ${data.accessToken}`);
          setGithub(data);
          setCurrentState("idle");
        } else {
          setError("No account associated with this GitHub email.");
          setCurrentState("error");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error verifying user:", error);
        setError(error.message);
        setLoading(false);
        setCurrentState("error");
      });
  };

  const redirectToGitHub = () => {
    const client_id = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
    const scope = "read:user user:email";
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${client_id}&scope=${scope}`;
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
