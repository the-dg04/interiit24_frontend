import React from "react";
import Link from "next/link";

const HistoryCard = ({company }) => {
  return (
    <Link href={`/history/${company.CompanyID}`}>
      
    <div className="bg-cyan-50 w-[250px] mb-[50px] mr-10 p-6  rounded-[10px] shadow-lg shadow-gray-500 text-black hover:shadow-cyan-300 hover:border hover:border-cyan-300">
      <h2 className="font-bold text-2xl mb-2 text-cyan-800">{company.Company}</h2>
      <p><strong className="text-cyan-700">ID:</strong> {company.CompanyID}</p>
      {/* <p><strong>Same Country Count:</strong> {company.sameCountry}</p>
      <p><strong>Greater Div:</strong> {company.greaterDiv}</p>
      <p><strong>Change Values:</strong> {company.change.join(", ")}</p>
      <p><strong>Greater Values:</strong> {company.greater.join(", ")}</p> */}
    </div>
    </Link>
  );
};

export default HistoryCard;
