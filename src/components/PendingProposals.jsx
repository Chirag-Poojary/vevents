"use client";
import Navbar from "@/src/components/Navbar";
import React, { useEffect, useState } from "react";
import { db } from "@/src/firebase";
import { collection, getDocs } from "firebase/firestore";
import ProposalCard from "@/src/components/ProposalCard";

const PendingProposals = () => {
  const [proposals, setProposals] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "proposals"));
      const data = querySnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((proposal) => proposal.status === "pending");
      setProposals(data);
    };
    fetchData();
  }, []);

  return (
    <>
      <Navbar />
      <div className="p-6 bg-[#e4f4ff] min-h-screen text-[#212121]">
        <h2 className="text-2xl font-bold mb-6 text-[#1A1F71]">
          Pending Proposals
        </h2>

        <div className="grid gap-4">
          {proposals.map((proposal) => (
            <ProposalCard
              key={proposal.id}
              proposal={proposal}
              onClick={() => {
                setSelectedProposal(proposal);
                setShowDetails(true);
              }}
            />
          ))}
        </div>

        {showDetails && selectedProposal && (
          <div className="fixed inset-0 bg-transparent bg-opacity-30 z-50 flex justify-center items-center">
            <div className="bg-white w-full max-w-2xl rounded-2xl p-6 shadow-xl relative max-h-[90vh] overflow-y-auto">
              <button
                className="absolute top-2 right-3 text-xl"
                onClick={() => setShowDetails(false)}
              >
                ×
              </button>
              <p className="text-2xl font-bold mb-4 text-[#1A1F71]">
                {selectedProposal.eventName}
              </p>

              <form className="space-y-3">
                <input
                  value={selectedProposal.committeeHead}
                  readOnly
                  className="w-full px-4 py-2 bg-gray-100 rounded-lg border"
                />
                <input
                  value={selectedProposal.department}
                  readOnly
                  className="w-full px-4 py-2 bg-gray-100 rounded-lg border"
                />
                <input
                  value={selectedProposal.date}
                  readOnly
                  className="w-full px-4 py-2 bg-gray-100 rounded-lg border"
                />
                <input
                  value={selectedProposal.endDate}
                  readOnly
                  className="w-full px-4 py-2 bg-gray-100 rounded-lg border"
                />
                <input
                  value={selectedProposal.time}
                  readOnly
                  className="w-full px-4 py-2 bg-gray-100 rounded-lg border"
                />
                <input
                  value={selectedProposal.venue}
                  readOnly
                  className="w-full px-4 py-2 bg-gray-100 rounded-lg border"
                />
                <input
                  value={selectedProposal.budget}
                  readOnly
                  className="w-full px-4 py-2 bg-gray-100 rounded-lg border"
                />
                <textarea
                  value={selectedProposal.description}
                  readOnly
                  className="w-full px-4 py-2 bg-gray-100 rounded-lg border resize-y"
                  rows={3}
                />
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PendingProposals;
