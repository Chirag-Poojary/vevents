"use client";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/src/firebase";
import { toast } from "react-toastify";

const ApprovalActions = ({ proposal, comment, setShowDetails, fetchProposal }) => {
  const handleApprove = async () => {
    let nextStage = "";

    // Determine next approval stage
    if (proposal.approvalStage === "hod") nextStage = "principal";
    else if (proposal.approvalStage === "principal") nextStage = "accounts";
    else if (proposal.approvalStage === "accounts") nextStage = "done";

    const updatePayload =
      nextStage === "done"
        ? { approvalStage: "done", status: "accepted", comment }
        : { approvalStage: nextStage, comment };

    try {
      await updateDoc(doc(db, "proposals", proposal.id), updatePayload);
      toast.success("Proposal Approved!", { theme: "colored" });
      setShowDetails(false);
      fetchProposal();
    } catch (err) {
      console.error("Error approving:", err);
    }
  };

  const handleDecline = async () => {
    try {
      await updateDoc(doc(db, "proposals", proposal.id), {
        status: "declined",
        approvalStage: "done",
        comment,
      });
      toast.success("Proposal Declined!", { theme: "colored" });
      setShowDetails(false);
      fetchProposal();
    } catch (err) {
      console.error("Error declining:", err);
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
