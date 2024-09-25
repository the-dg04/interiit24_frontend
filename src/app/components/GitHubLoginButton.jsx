"use client";
const GITHUB_CLIENT_ID = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;

const GitHubLoginButton = () => {
  console.log("Function triggered");
  
  const handleLogin = () => {
    const scope = 'read:user user:email';
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&scope=${scope}`;
  };

  return (
    <button onClick={handleLogin}>
      GitHub
    </button>
  );
};

export default GitHubLoginButton;
