"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { api } from "@/lib/api";

// Accepts either a raw meeting code (123-4567-890) or a full invite link
// pasted from the "Copy Link" button, and extracts just the code.
function extractMeetingCode(input: string): string {
  const trimmed = input.trim();
  const parts = trimmed.split("/");
  return parts[parts.length - 1];
}

export default function JoinMeetingPage() {
  const router = useRouter();
  const [meetingIdOrLink, setMeetingIdOrLink] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!meetingIdOrLink.trim()) {
      setError("Please enter a Meeting ID or invite link.");
      return;
    }
    if (!displayName.trim()) {
      setError("Please enter your name.");
      return;
    }

    const code = extractMeetingCode(meetingIdOrLink);
    setSubmitting(true);
    try {
      // Validates the meeting exists, then registers this user as a participant
      await api.joinMeeting(code, displayName.trim());
      router.push(`/meeting/${code}?name=${encodeURIComponent(displayName.trim())}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not join meeting.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="mx-auto max-w-md px-6 py-16">
        <h1 className="mb-6 text-2xl font-semibold text-gray-800">Join a Meeting</h1>

        <form onSubmit={handleJoin} className="flex flex-col gap-4 rounded-lg bg-white p-6 shadow-sm">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Meeting ID or invite link
            </label>
            <input
              type="text"
              value={meetingIdOrLink}
              onChange={(e) => setMeetingIdOrLink(e.target.value)}
              placeholder="123-4567-890"
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-[#2D8CFF] focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Your name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. Jane Doe"
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-[#2D8CFF] focus:outline-none"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="rounded bg-[#2D8CFF] px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? "Joining..." : "Join"}
          </button>
        </form>
      </main>
    </div>
  );
}
