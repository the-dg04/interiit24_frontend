import { useEffect, useState } from "react";

function GithubAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");

  useEffect(() => {
    if (code && !localStorage.getItem("token")) {
      authenticateWithGithub(code);
    }
  }, [code]);

  const authenticateWithGithub = (code) => {
    setLoading(true);
    fetch(`http://localhost:6969/oauth/redirect?code=${code}&state=YOUR_RANDOMLY_GENERATED_STATE`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to authenticate with GitHub');
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
      });
  };

  const checkUserExists = (data) => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/checkGithub`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${data.accessToken}`
      },
      body: JSON.stringify({ github: data.userData.email }) // Assuming GitHub email is part of userData
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to verify GitHub email');
        }
        return res.json();
      })
      .then((userRes) => {
        if (userRes.userExists) {
          localStorage.setItem("token", `Bearer ${data.accessToken}`);
          // Redirect user or perform additional actions
        } else {
          setError('No account associated with this GitHub email.');
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
    <button className="login-button" onClick={redirectToGitHub}>
      Login with GitHub
    </button>
  );
}

export default GithubAuth;
