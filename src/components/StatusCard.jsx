"use client";
import React, { useState, useEffect } from "react";
import { db } from "@/src/firebase";
import { collection, getDocs } from "firebase/firestore";
import ProposalCard from "@/src/components/ProposalCard";
import ApprovalActions from "@/src/components/ApprovalActions";
import { ToastContainer } from "react-toastify";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function StatusCard() {
  const [userRole, setUserRole] = useState("");
  const [proposals, setProposals] = useState([]);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [comment, setComment] = useState("");
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const querySnapshot = await getDocs(collection(db, "users"));
        const matchedDoc = querySnapshot.docs.find(
          (doc) => doc.data().email === user.email
        );
        if (matchedDoc) {
          setUserRole(matchedDoc.data().role);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchProposals = async (role) => {
    try {
      const querySnapshot = await getDocs(collection(db, "proposals"));
      const allData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      let filtered = [];

      if (role === "committee" || role === "hod") {
        filtered = allData.filter(
          (p) => p.status === "pending" && p.approvalStage === "hod"
        );
      } else if (role === "principal") {
        filtered = allData.filter(
          (p) => p.approvalStage === "principal" && p.status === "pending"
        );
      } else if (role === "accounts") {
        filtered = allData.filter(
          (p) => p.approvalStage === "accounts" && p.budget > 0
        );
      }

      setProposals(filtered);
    } catch (error) {
      console.error("Error fetching proposals:", error);
    }
  };

  useEffect(() => {
    if (userRole) fetchProposals(userRole);
  }, [userRole]);

  return (
    <div className="p-6 h-[93vh] bg-[#e4f4ff] text-[#212121]">
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        theme="colored"
      />
      <h2 className="text-2xl font-bold mb-6 text-[#1A1F71]">
        Pending Proposals
      </h2>
      {/* List all proposals */}
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

      {/* Modal for selected proposal */}
      {showDetails && selectedProposal && (
        <div className="fixed inset-0 bg-black bg-opacity-20 z-50 flex justify-center items-center">
          <div className="bg-[#c8e9ff] w-full max-w-2xl rounded-2xl p-6 shadow-xl relative max-h-[90vh] overflow-y-auto">
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

              <textarea
                placeholder="Add Comment (optional)"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border resize-y"
                rows={3}
              />

              {selectedProposal.approvalStage !== "done" && (
                <ApprovalActions
                  proposal={selectedProposal}
                  comment={comment}
                  setShowDetails={setShowDetails}
                  fetchProposal={fetchProposals}
                />
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
