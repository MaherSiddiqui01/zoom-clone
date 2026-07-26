"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { api } from "@/lib/api";

export default function SchedulePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState(30);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim() || !date || !time) {
      setError("Title, date and time are required.");
      return;
    }

    const scheduledTime = new Date(`${date}T${time}`);
    if (isNaN(scheduledTime.getTime())) {
      setError("Invalid date/time.");
      return;
    }

    setSubmitting(true);
    try {
      await api.createScheduledMeeting({
        title: title.trim(),
        description: description.trim() || undefined,
        scheduled_time: scheduledTime.toISOString(),
        duration_minutes: duration,
      });
      router.push("/"); // back to dashboard, new meeting shows in Upcoming
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not schedule meeting.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="mx-auto max-w-md px-6 py-16">
        <h1 className="mb-6 text-2xl font-semibold text-gray-800">Schedule a Meeting</h1>

        <form onSubmit={handleSchedule} className="flex flex-col gap-4 rounded-lg bg-white p-6 shadow-sm">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Weekly Team Sync"
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-[#2D8CFF] focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Description (optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-[#2D8CFF] focus:outline-none"
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="mb-1 block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-[#2D8CFF] focus:outline-none"
              />
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-sm font-medium text-gray-700">Time</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-[#2D8CFF] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Duration (minutes)</label>
            <select
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-[#2D8CFF] focus:outline-none"
            >
              <option value={15}>15</option>
              <option value={30}>30</option>
              <option value={45}>45</option>
              <option value={60}>60</option>
              <option value={90}>90</option>
            </select>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="rounded bg-[#7C3AED] px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? "Scheduling..." : "Schedule"}
          </button>
        </form>
      </main>
    </div>
  );
}
