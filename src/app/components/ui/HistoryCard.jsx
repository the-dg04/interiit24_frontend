import React from "react";
import Link from "next/link";

const HistoryCard = ({ company }) => {
  return (
    <Link href="/">
    <div className="bg-cyan-50 w-[250px] mb-[50px] mr-10 p-6  rounded-[10px] shadow-lg shadow-gray-500 text-black hover:shadow-cyan-300">
      <h2 className="font-bold text-2xl mb-2 text-cyan-800">{company.name}</h2>
      <p><strong className="text-cyan-700">Country:</strong> {company.country}</p>
      <p><strong className="text-cyan-700">Country Code:</strong> {company.countryCode}</p>
      {/* <p><strong>Same Country Count:</strong> {company.sameCountry}</p>
      <p><strong>Greater Div:</strong> {company.greaterDiv}</p>
      <p><strong>Change Values:</strong> {company.change.join(", ")}</p>
      <p><strong>Greater Values:</strong> {company.greater.join(", ")}</p> */}
    </div>
    </Link>
  );
};

const styles = {
  card: {
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "16px",
    margin: "16px",
    width: "300px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
};

export default HistoryCard;
