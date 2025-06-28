"use client";
import React, { useState, useEffect } from "react";
import { db } from "@/src/firebase";
import { collection, getDocs } from "firebase/firestore"; // Firestore imports
import ProposalCard from "@/src/components/ProposalCard";

const dummyProposal = {
  eventName: "Tech Fest",
  committeeHead: "John Doe",
  department: "CMPN",
  date: "2025-07-10",
  endDate: "2025-07-12",
  time: "10:00 AM - 5:00 PM",
  venue: "Auditorium",
  budget: 5000,
  description: "Annual technology event with multiple workshops and speakers.",
  status: "pending", // accepted / declined
};

export default function StatusCard() {
  const [showDetails, setShowDetails] = useState(false);
  const [comment, setComment] = useState("");
  const [proposal, setProposal] = useState(dummyProposal); 

  const statusColors = {
    pending: "bg-yellow-400 text-yellow-900",
    accepted: "bg-green-500 text-white",
    declined: "bg-red-500 text-white",
  };

  useEffect(() => {
    const fetchProposal = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "proposals"));
        if (!querySnapshot.empty) {
          const data = querySnapshot.docs[0].data();
          setProposal(data);
        }
      } catch (error) {
        console.error("Error fetching proposal:", error);
      }
    };

    fetchProposal();
  }, []);

  return (
    <div className="p-6 h-[93vh] bg-[#e4f4ff] text-[#212121]">
      {/* Event Card */}
      <ProposalCard proposal={proposal} onClick={() => setShowDetails(true)} />

      {/* Popup */}
      {showDetails && (
        <div className="fixed inset-0 bg-transparent shadow-2xl bg-opacity-20 flex justify-center items-center z-50">
          <div className="bg-[#c8e9ff] w-full max-w-2xl rounded-2xl p-6 shadow-xl relative overflow-y-auto max-h-[90vh]">
            <button
              className="absolute top-2 right-3 text-xl"
              onClick={() => setShowDetails(false)}
            >
              ×
            </button>
            <p className="text-2xl font-bold mb-4 text-[#1A1F71]">
              {proposal.eventName}
            </p>

            <form className="space-y-3">
              <input
                value={proposal.committeeHead}
                readOnly
                className="w-full px-4 py-2 bg-gray-100 rounded-lg border border-[#E0E0E0]"
              />
              <input
                value={proposal.department}
                readOnly
                className="w-full px-4 py-2 bg-gray-100 rounded-lg border border-[#E0E0E0]"
              />
              <input
                value={proposal.date}
                readOnly
                className="w-full px-4 py-2 bg-gray-100 rounded-lg border border-[#E0E0E0]"
              />
              <input
                value={proposal.endDate}
                readOnly
                className="w-full px-4 py-2 bg-gray-100 rounded-lg border border-[#E0E0E0]"
              />
              <input
                value={proposal.time}
                readOnly
                className="w-full px-4 py-2 bg-gray-100 rounded-lg border border-[#E0E0E0]"
              />
              <input
                value={proposal.venue}
                readOnly
                className="w-full px-4 py-2 bg-gray-100 rounded-lg border border-[#E0E0E0]"
              />
              <input
                value={proposal.budget}
                readOnly
                className="w-full px-4 py-2 bg-gray-100 rounded-lg border border-[#E0E0E0]"
              />
              <textarea
                value={proposal.description}
                readOnly
                className="w-full px-4 py-2 bg-gray-100 rounded-lg border border-[#E0E0E0] resize-y"
                rows={3}
              />

              <textarea
                placeholder="Add Comment (optional)"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-[#E0E0E0] resize-y"
                rows={3}
              />

              {proposal.status === "pending" && (
                <div className="flex justify-end gap-4 mt-4">
                  <button
                    type="button"
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                  >
                    Accept
                  </button>
                  <button
                    type="button"
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                  >
                    Decline
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
