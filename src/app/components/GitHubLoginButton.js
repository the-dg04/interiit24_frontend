"use client";
const GITHUB_CLIENT_ID = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;

const GitHubLoginButton = () => {
  const handleLogin = () => {
    // Redirect the user to GitHub OAuth authorization page
    // const redirectUri = `${process.env.BACKEND_URL}/api/`;
    const scope = 'read:user user:email';
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&scope=${scope}`;
  };

  return (
    <button onClick={handleLogin}>
      Sign in with GitHub
    </button>
  );
};

export default GitHubLoginButton;
