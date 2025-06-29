"use client";
import React, { useEffect, useState } from "react";
import { db } from "@/src/firebase";
import { collection, getDocs } from "firebase/firestore";
import Navbar from "@/src/components/Navbar";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const statusColors = {
  accepted: "bg-green-500 text-white",
  declined: "bg-red-500 text-white",
};

const ProposalStatus = () => {
  const [proposals, setProposals] = useState([]);
    const [userRole, setUserRole] = useState("");

  // ✅ ROLE-FETCHING LOGIC GOES HERE
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

  const fetchData = async (role) => {
    const querySnapshot = await getDocs(collection(db, "proposals"));
    const allData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    let filtered = [];

    if (role === "committee") {
      filtered = allData.filter((p) => p.status !== "pending"); // committee sees final result
    } else if (role === "hod") {
      filtered = allData.filter(
        (p) => p.approvalStage !== "hod" && p.status === "pending"
      );
    } else if (role === "principal") {
      filtered = allData.filter(
        (p) => p.approvalStage !== "principal" && p.status === "pending"
      );
    } else if (role === "accounts") {
      filtered = allData.filter(
        (p) => p.status !== "pending" && p.approvalStage === "done"
      );
    }

    setProposals(filtered);
  };

  useEffect(() => {
    if (userRole) fetchData(userRole);
  }, [userRole]);

  return (
    <>
      <Navbar />
      <div className="p-6 bg-[#e4f4ff] min-h-screen text-[#212121]">
        <h2 className="text-2xl font-bold mb-6 text-[#1A1F71]">
          Reviewed Proposals
        </h2>
        <div className="grid gap-4">
          {proposals.map((proposal) => (
            <div
              key={proposal.id}
              className="relative p-5 bg-white rounded-xl shadow-md hover:shadow-xl cursor-pointer transition"
            >
              <h3 className="text-xl font-bold text-[#1A1F71]">
                {proposal.eventName}
              </h3>
              <p className="text-sm mt-1">Head: {proposal.committeeHead}</p>
              <p className="text-sm text-[#616161]">
                Department: {proposal.department}
              </p>
              <div
                className={`absolute bottom-3 right-4 px-3 py-1 rounded-full text-xs font-medium ${
                  statusColors[proposal.status]
                }`}
              >
                {proposal.status.toUpperCase()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ProposalStatus;
