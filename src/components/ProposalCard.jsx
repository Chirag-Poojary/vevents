"use client";
import React from "react";

const statusColors = {
  pending: "bg-yellow-400 text-yellow-900",
  accepted: "bg-green-500 text-white",
  declined: "bg-red-500 text-white",
};

const ProposalCard = ({ proposal, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="relative p-5 bg-white rounded-xl shadow-md hover:shadow-xl cursor-pointer transition"
    >
      <h3 className="text-xl font-bold text-[#1A1F71]">
        {proposal.eventName}
      </h3>
      <p className="text-sm mt-1">Head: {proposal.committeeHead}</p>
      <p className="text-sm text-[#616161]">Department: {proposal.department}</p>
      <div
        className={`absolute bottom-3 right-4 px-3 py-1 rounded-full text-xs font-medium ${
          statusColors[proposal.status] || "bg-gray-400"
        }`}
      >
        {proposal.status?.toUpperCase()}
      </div>
    </div>
  );
};

export default ProposalCard;
