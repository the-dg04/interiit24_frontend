import jwt from "jsonwebtoken";

const signupKey = process.env.NEXT_PUBLIC_USERNAME_SECRET;

export const encodeUsername = (username) => {
  const token = jwt.sign(username, signupKey);
  return token;
};

export const decodeUsername = (token) => {
  if (!token) return "";
  const username = jwt.verify(token, signupKey);
  return username;
};
