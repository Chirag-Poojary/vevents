"use client";
import React, { useState } from "react";
import { db } from "@/src/firebase";
import { collection, addDoc } from "firebase/firestore";

export default function CreateProposalForm() {
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

  // Handle text inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const fullData = {
        ...formData,
        date: startDate,
        endDate: isMultiDay ? endDate : startDate,
      };

      const docRef = await addDoc(collection(db, "proposals"), fullData);
      console.log("✅ Proposal submitted with ID:", docRef.id);
      alert("✅ Proposal submitted successfully!");

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
    } catch (error) {
      console.error("❌ Error submitting proposal:", error);
      alert("❌ Failed to submit proposal. See console for details.");
    }
  };

  return (
    <div className="bg-[#e4f4ff] h-[93vh] w-[100vw] pt-10">
      <div className="max-w-2xl mx-auto p-6 bg-[#FAFAFA] rounded-2xl shadow-2xl text-[#000000]">
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

          <button
            type="submit"
            className="w-full py-3 bg-[#1A1F71] text-white font-semibold rounded-lg hover:bg-[#2E7D32] transition duration-300"
          >
            Submit Proposal
          </button>
        </form>
      </div>
    </div>
  );
}
