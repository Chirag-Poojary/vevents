"use client";
import React, { useState } from "react";
import { db } from "@/src/firebase";
import { collection, addDoc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";

export default function CreateProposal() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isMultiDay, setIsMultiDay] = useState(false);

  // Form data state
  const [formData, setFormData] = useState({
    eventName: "",
    committeeHead: "",
    time: "",
    department: "",
    venue: "",
    budget: "",
    description: "",
    status: "pending",
  });

  // PDF file state
  const [pdfFile, setPdfFile] = useState(null);

  // Handle text inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (pdfFile) {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64PDF = reader.result;

          const fullData = {
            pdfBase64: base64PDF,
            date: startDate,
            endDate: isMultiDay ? endDate : startDate,
            approvalStage: "hod",
            status: "pending",
            uploadedAs: "pdf",
          };

          const docRef = await addDoc(collection(db, "proposals"), fullData);
          console.log("✅ Proposal PDF submitted with ID:", docRef.id);
          toast.success("PDF Proposal submitted", {
            position: "bottom-right",
            autoClose: 3000,
            pauseOnHover: true,
            draggable: true,
            theme: "colored",
          });

          setFormData({
            eventName: "",
            committeeHead: "",
            time: "",
            department: "",
            venue: "",
            budget: "",
            description: "",
            status: "pending",
          });
          setStartDate("");
          setEndDate("");
          setIsMultiDay(false);
          setPdfFile(null);
        };
        reader.readAsDataURL(pdfFile);
      } else {
        const fullData = {
          ...formData,
          date: startDate,
          endDate: isMultiDay ? endDate : startDate,
          approvalStage: "hod",
        };

        const docRef = await addDoc(collection(db, "proposals"), fullData);
        console.log("✅ Proposal submitted with ID:", docRef.id);
        toast.success("Proposal submitted", {
          position: "bottom-right",
          autoClose: 3000,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });

        // Optional: Clear form
        setFormData({
          eventName: "",
          committeeHead: "",
          time: "",
          department: "",
          venue: "",
          budget: "",
          description: "",
          status: "pending",
        });
        setStartDate("");
        setEndDate("");
        setIsMultiDay(false);
      }
    } catch (error) {
      console.error("❌ Error submitting proposal:", error);
      toast.error("Error submitting proposal", {
        position: "bottom-right",
        autoClose: 3000,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    }
  };

  return (
    <div className="max-w-2xl  p-6 bg-[#FAFAFA] rounded-2xl shadow-2xl text-[#000000]">
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <h2 className="text-3xl font-bold text-center mb-6 text-[#1A1F71]">
        Create New Event Proposal
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="eventName"
          value={formData.eventName}
          onChange={handleChange}
          placeholder="Event Name"
          className="w-full px-4 py-2 rounded-lg border border-[#E0E0E0] bg-white text-sm"
          required
        />
        <input
          type="text"
          name="committeeHead"
          value={formData.committeeHead}
          onChange={handleChange}
          placeholder="Committee Head Name"
          className="w-full px-4 py-2 rounded-lg border border-[#E0E0E0] bg-white text-sm"
          required
        />

        <div>
          <label className="block text-sm font-medium text-[#1A1F71] mb-1">
            Date of Event
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-[#E0E0E0] bg-white text-sm"
            required
          />
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={isMultiDay}
            onChange={(e) => setIsMultiDay(e.target.checked)}
            className="accent-[#2E7D32]"
          />
          Event lasts more than 1 day
        </label>

        {isMultiDay && (
          <div>
            <label className="block text-sm font-medium text-[#1A1F71] mb-1">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-[#E0E0E0] bg-white text-sm"
              required
            />
          </div>
        )}

        <input
          type="text"
          name="time"
          value={formData.time}
          onChange={handleChange}
          placeholder="Timing (e.g. 10:00 AM - 4:00 PM)"
          className="w-full px-4 py-2 rounded-lg border border-[#E0E0E0] bg-white text-sm"
          required
        />

        <div>
          <label className="block text-sm font-medium text-[#1A1F71] mb-1">
            Department
          </label>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-[#E0E0E0] bg-white text-sm"
            required
          >
            <option value="">Select Department</option>
            <option value="INFT">INFT</option>
            <option value="CMPN">CMPN</option>
            <option value="EXTC">EXTC</option>
            <option value="ENTC">ENTC</option>
            <option value="BIOMED">BIOMED</option>
            <option value="COUNCIL">Council</option>
          </select>
        </div>

        <input
          type="text"
          name="venue"
          value={formData.venue}
          onChange={handleChange}
          placeholder="Venue"
          className="w-full px-4 py-2 rounded-lg border border-[#E0E0E0] bg-white text-sm"
          required
        />
        <input
          type="number"
          name="budget"
          value={formData.budget}
          onChange={handleChange}
          placeholder="Budget (optional)"
          className="w-full px-4 py-2 rounded-lg border border-[#E0E0E0] bg-white text-sm"
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="More Description (optional)"
          rows="4"
          className="w-full px-4 py-2 rounded-lg border border-[#E0E0E0] bg-white text-sm resize-y"
        />

        {/* OR Upload PDF Option */}
        <div>
          <div>
            <label className="block text-sm font-medium text-[#1A1F71] mb-1 pl-[300px]">
              OR 
            </label>
            <a
              href="/eventproposalform.docx"
              download
              className="flex items-center gap-3 w-full px-4 py-3 border border-[#E0E0E0] rounded-lg bg-white hover:bg-[#f3f3f3] transition cursor-pointer"
              style={{ textDecoration: "none" }}
            >
              <img
                src="/word.png"
                alt="Word Icon"
                className="w-6 h-6"
              />
              <span className="text-sm text-[#1A1F71] font-medium">
                Event Proposal Template.docx
              </span>
            </a>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-[#1A1F71] text-white font-semibold rounded-lg hover:bg-[#2E7D32] transition duration-300"
        >
          Submit Proposal
        </button>
      </form>
    </div>
  );
}
