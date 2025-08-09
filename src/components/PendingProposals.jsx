"use client";
import Navbar from "@/src/components/Navbar";
import React, { useEffect, useState } from "react";
import { db } from "@/src/firebase";
import { collection, getDocs } from "firebase/firestore";
import ProposalCard from "@/src/components/ProposalCard";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import CreateProposal from "@/src/components/CreateProposal";

const PendingProposals = () => {
  const [showForm, setShowForm] = useState(false);
  const [proposals, setProposals] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [userRole, setUserRole] = useState("");

  const fetchData = async (userRole) => {
    const querySnapshot = await getDocs(collection(db, "proposals"));

    let filtered = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    if (userRole === "committee") {
      filtered = filtered.filter((p) => p.status === "pending");
    } else if (userRole === "hod") {
      filtered = filtered.filter((p) => p.approvalStage === "hod");
    } else if (userRole === "principal") {
      filtered = filtered.filter((p) => p.approvalStage === "principal");
    } else if (userRole === "accounts") {
      filtered = filtered.filter(
        (p) => p.approvalStage === "accounts" && p.budget > 0
      );
    }

    setProposals(filtered);
  };

  const fetchUserRole = async (email) => {
    const res = await fetch("/api/getUserRole", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const text = await res.text(); // Read raw response
    console.log("🧾 Raw API response:", text);

    try {
      const data = JSON.parse(text);
      console.log("✅ Parsed data:", data);
      if (data?.role) {
        const role = data.role.toLowerCase();
        setUserRole(role);
        fetchData(role);
      }
    } catch (err) {
      console.error("❌ Failed to parse JSON:", err);
    }
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserRole(user.email);
      } else {
        console.warn("User not logged in");
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      <Navbar />
      <div className="p-6 bg-[#e4f4ff] min-h-screen text-[#212121]">
        {/* Only show to committee users */}
        {userRole === "committee" && (
          <>
            <div className="flex items-center">
              <button
                className="bg-[#2E7D32] text-white font-bold text-lg px-5 py-3 rounded-full mb-5"
                onClick={() => setShowForm(true)}
              >
                Create Proposal
              </button>

              <a
                href="/eventproposalform.docx"
                download
                className="flex items-center gap-3 px-5 py-3 rounded-full transition cursor-pointer"
                style={{ textDecoration: "none" }}
              >
                <div className="text-sm text-[#1A1F71] font-medium">
                  <img src="/word.png" alt="Word Icon" className="w-6 h-6" />
                  Download Template
                </div>
              </a>
            </div>

            {showForm && (
              <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center">
                <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative shadow-lg">
                  <button
                    className="absolute top-2 right-3 text-2xl font-bold text-gray-600 hover:text-red-600"
                    onClick={() => setShowForm(false)}
                  >
                    ×
                  </button>
                  <CreateProposal />
                </div>
              </div>
            )}
          </>
        )}

        <h2 className="text-2xl font-bold mb-6 text-[#1A1F71]">
          Pending Proposals
        </h2>
        {!proposals.length ? (
          <div className="flex w-full h-[60vh] justify-center items-center flex-col">
            <img
              src="/background.svg"
              className="w-[25vw] mt-20 opacity-60"
            ></img>
            <p className="text-center text-gray-400 text-2xl mt-5 ">
              No proposals to show
            </p>
          </div>
        ) : (
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
        )}

        {showDetails && selectedProposal && (
          <div className="fixed inset-0 bg-transparent bg-opacity-30 z-50 flex justify-center items-center">
            <div className="bg-[#bce4ff] w-full max-w-2xl rounded-2xl p-6 shadow-xl relative max-h-[90vh] overflow-y-auto">
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
