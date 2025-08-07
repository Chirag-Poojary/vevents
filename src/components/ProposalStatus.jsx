"use client";
import React, { useEffect, useState } from "react";
import { db } from "@/src/firebase";
import { collection, getDocs } from "firebase/firestore";
import Navbar from "@/src/components/Navbar";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const statusColors = {
  accepted: "bg-green-500 text-white",
  declined: "bg-red-500 text-white",
  pending: "bg-yellow-400 text-black",
};

const ProposalStatus = () => {
  const [proposals, setProposals] = useState([]);
  const [userRole, setUserRole] = useState("");

  // Fetch user's role from users collection
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const res = await fetch("/api/getUserRole", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: user.email }),
          });
          const data = await res.json();
          if (res.ok && data.role) {
            setUserRole(data.role.toLowerCase());
            console.log("✅ Role set to:", data.role.toLowerCase());
          } else {
            console.warn("❌ No role from API", data);
          }
        } catch (err) {
          console.error("🔥 Role fetch error:", err);
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
    console.log("📦 ALL Proposals:", allData);
    let filtered = [];

    if (role === "committee") {
      filtered = allData.filter(
        (p) =>
          p.approvalStage === "done" &&
          (p.status === "accepted" || p.status === "declined")
      );
    } else if (role === "hod") {
      filtered = allData.filter(
        (p) =>
          (p.approvalStage === "principal" && p.status === "pending") ||
          (p.approvalStage === "done" && p.status === "declined")
      );
    } else if (role === "principal") {
      filtered = allData.filter(
        (p) =>
          (p.approvalStage === "accounts" && p.status === "pending") ||
          (p.approvalStage === "done" &&
            (p.status === "accepted" || p.status === "declined"))
      );
    } else if (role === "accounts") {
      filtered = allData.filter(
        (p) =>
          p.approvalStage === "done" &&
          (p.status === "accepted" || p.status === "declined")
      );
    }

    setProposals(filtered);
  };

  useEffect(() => {
    if (userRole) {
      console.log("🔎 Fetching for role:", userRole);
      fetchData(userRole);
    }
  }, [userRole]);

  return (
    <>
      <Navbar />
      <div className="p-6 bg-[#e4f4ff] min-h-screen text-[#212121]">
        <h2 className="text-2xl font-bold mb-6 text-[#1A1F71]">
          Reviewed Proposals
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
              <div
                key={proposal.id}
                className="relative p-5 bg-white rounded-xl shadow-md hover:shadow-xl cursor-pointer transition"
              >
                <h3 className="text-xl font-bold text-[#1A1F71]">
                  {proposal.eventName || "Untitled Event"}
                </h3>
                <p className="text-sm mt-1">
                  Head: {proposal.committeeHead || "N/A"}
                </p>
                <p className="text-sm text-[#616161]">
                  Department: {proposal.department || "N/A"}
                </p>
                {proposal.comment && (
                  <p className="text-xs italic text-gray-600">
                    Remarks: {proposal.comment}
                  </p>
                )}
                <div
                  className={`absolute bottom-3 right-4 px-3 py-1 rounded-full text-xs font-medium ${
                    statusColors[proposal.status] || "bg-gray-300"
                  }`}
                >
                  {proposal.status?.toUpperCase()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default ProposalStatus;
