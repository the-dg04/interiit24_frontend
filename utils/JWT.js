const jwt = require("jsonwebtoken");

const signupKey=process.env.NEXT_PUBLIC_SIGNUP_SECRET;

export const encodeUsername = (username) => {
  const token = jwt.sign(username, signupKey);
  return token;
};

export const decodeUsername = (token) => {
  const username = jwt.verify(token, signupKey);
  return username;
};
