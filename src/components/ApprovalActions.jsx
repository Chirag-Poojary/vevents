"use client";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/src/firebase";
import { toast } from "react-toastify";

const ApprovalActions = ({
  proposal,
  comment,
  setShowDetails,
  fetchProposal,
}) => {
  const handleApprove = async () => {
    let nextStage = "";
    let updatePayload = {};

    const currentStage = proposal.approvalStage;
    const budget = parseFloat(proposal.budget || "0");

    if (currentStage === "hod") {
      nextStage = "principal";
      updatePayload = {
        approvalStage: nextStage,
        status: "pending",
        remarks: comment, // ✅ use 'remarks' instead of 'comment'
      };
    } else if (currentStage === "principal") {
      if (budget > 0) {
        nextStage = "accounts";
        updatePayload = {
          approvalStage: nextStage,
          status: "pending",
          remarks: comment,
        };
      } else {
        updatePayload = {
          approvalStage: "done",
          status: "accepted",
          remarks: comment,
        };
      }
    } else if (currentStage === "accounts") {
      updatePayload = {
        approvalStage: "done",
        status: "accepted",
        remarks: comment,
      };
    }

    try {
      await updateDoc(doc(db, "proposals", proposal.id), updatePayload);
      toast.success("Proposal Approved!", { theme: "colored" });
      setShowDetails(false);
      fetchProposal();
    } catch (err) {
      console.error("Error approving:", err);
      toast.error("Failed to update proposal", { theme: "colored" });
    }
  };

  const handleDecline = async () => {
    try {
      await updateDoc(doc(db, "proposals", proposal.id), {
        status: "declined",
        approvalStage: "done",
        remarks: comment,
      });
      toast.success("Proposal Declined!", { theme: "colored" });
      setShowDetails(false);
      fetchProposal();
    } catch (err) {
      console.error("Error declining:", err);
      toast.error("Failed to decline proposal", { theme: "colored" });
    }
  };

  return (
    <div className="flex justify-end gap-4 mt-4">
      <button
        type="button"
        onClick={handleApprove}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
      >
        Accept
      </button>
      <button
        type="button"
        onClick={handleDecline}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
      >
        Decline
      </button>
    </div>
  );
};

export default ApprovalActions;
