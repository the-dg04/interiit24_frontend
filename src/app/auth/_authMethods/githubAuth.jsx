"use client";
import { useEffect, useState } from "react";

function GithubAuth() {
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
    const urlParams = new URLSearchParams(window.location.search);
    const authCode = urlParams.get("code");
    setCode(authCode);

    if (authCode && !localStorage.getItem("token")) {
      authenticateWithGithub(authCode);
    }
  }, [code]);

  const authenticateWithGithub = (code) => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_AUTH_BACKEND_URL}/api/user/githubLogin`, {
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
        console.log(`Username: ${data.login}`);
        console.log(`Name: ${data.name}`);
        console.log(checkUserExists(data)); // Verify User Existence : Requires Further Integration
      })
      .catch((error) => {
        console.error("Authentication error:", error);
        setError(error.message);
        setLoading(false);
      });
  };

  const checkUserExists = (data) => {
    fetch(`${process.env.NEXT_PUBLIC_AUTH_BACKEND_URL}/api/user/checkGithub`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${data.accessToken}`,
      },
      body: JSON.stringify({ github: data.userData.email }),
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
        } else {
          setError("No account associated with this GitHub email.");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error verifying user:", error);
        setError(error.message);
        setLoading(false);
      });
  };

  const redirectToGitHub = () => {
    const client_id = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
    const scope = "read:user user:email";
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${client_id}&scope=${scope}&state=YOUR_RANDOMLY_GENERATED_STATE`;
    window.location.href = authUrl;
  };

  if (loading) {
    return <h4>Loading...</h4>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <button
      className="flex-1 text-center bg-white/30 py-3 rounded-lg text-white hover:bg-white/50 cursor-pointer p-2"
      onClick={redirectToGitHub}
    >
      GitHub
    </button>
  );
}

export default GithubAuth;

