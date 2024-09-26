const jwt = require("jsonwebtoken");

const gmailKey = process.env.NEXT_PUBLIC_GMAIL_SECRET;

export const getUserEmail = async (token) => {
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

export const encodeGmail = (gmail) => {
  const token = jwt.sign({gmail:gmail}, gmailKey);
  return token;
};

export const decodeGmail = (token) => {
  if (!token) return "";
  const gmail = jwt.verify(token, gmailKey).gmail;
  return gmail;
};
