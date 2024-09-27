import jwt from "jsonwebtoken";

const githubKey = process.env.NEXT_PUBLIC_GITHUB_SECRET;

export const getUserGithub = async (token) => {
  const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).catch((err) => {
    console.log(err);
  });
  const resJSON = await res.json();
  return resJSON.email;
};

export const encodeGithub = (github) => {
  const token = jwt.sign({github:github}, gmailKey);
  return token;
};

export const decodeGithub = (token) => {
  if (!token) return "";
  const github = jwt.verify(token, githubKey).github;
  return github;
};
