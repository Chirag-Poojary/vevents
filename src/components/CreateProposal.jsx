"use client";
import React, { useState } from "react";

export default function CreateProposal() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isMultiDay, setIsMultiDay] = useState(false);

  return (
      <div className="max-w-2xl  p-6 bg-[#FAFAFA] rounded-2xl shadow-2xl text-[#000000]">
        <h2 className="text-3xl font-bold text-center mb-6 text-[#1A1F71]">
          Create New Event Proposal
        </h2>

        <form className="space-y-4">
          <input
            type="text"
            placeholder="Event Name"
            className="w-full px-4 py-2 rounded-lg border border-[#E0E0E0] bg-white text-sm"
          />
          <input
            type="text"
            placeholder="Committee Head Name"
            className="w-full px-4 py-2 rounded-lg border border-[#E0E0E0] bg-white text-sm"
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
              />
            </div>
          )}

          <input
            type="text"
            placeholder="Timing (e.g. 10:00 AM - 4:00 PM)"
            className="w-full px-4 py-2 rounded-lg border border-[#E0E0E0] bg-white text-sm"
          />

          <div>
            <label className="block text-sm font-medium text-[#1A1F71] mb-1">
              Department
            </label>
            <select className="w-full px-4 py-2 rounded-lg border border-[#E0E0E0] bg-white text-sm">
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
            placeholder="Venue"
            className="w-full px-4 py-2 rounded-lg border border-[#E0E0E0] bg-white text-sm"
          />
          <input
            type="number"
            placeholder="Budget (optional)"
            className="w-full px-4 py-2 rounded-lg border border-[#E0E0E0] bg-white text-sm"
          />
          <textarea
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
  );
}
