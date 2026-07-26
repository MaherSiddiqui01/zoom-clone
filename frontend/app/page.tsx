"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import ActionButton from "@/components/ActionButton";
import MeetingCard from "@/components/MeetingCard";
import { api, Meeting } from "@/lib/api";

export default function Dashboard() {
  const router = useRouter();
  const [upcoming, setUpcoming] = useState<Meeting[]>([]);
  const [recent, setRecent] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      const [u, r] = await Promise.all([api.getUpcoming(), api.getRecent()]);
      setUpcoming(u);
      setRecent(r);
    } catch {
      setError(
        "Could not reach the backend. Is it running at the URL set in NEXT_PUBLIC_API_URL?"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleNewMeeting = async () => {
    const meeting = await api.createInstantMeeting();
    router.push(`/meeting/${meeting.meeting_code}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="mb-6 text-2xl font-semibold text-gray-800">Welcome back, Default User</h1>

        {error && (
          <div className="mb-4 rounded bg-red-50 px-4 py-2 text-sm text-red-600">{error}</div>
        )}

        {/* Main action buttons */}
        <div className="mb-10 flex gap-4">
          <ActionButton
            label="New Meeting"
            color="bg-[#2D8CFF]"
            onClick={handleNewMeeting}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7">
                <path d="M4 4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-4.586l4.293 4.293A1 1 0 0 0 22 15V9a1 1 0 0 0-1.707-.707L16 12.586V8a2 2 0 0 0-2-2H4Z" />
              </svg>
            }
          />
          <ActionButton
            label="Join Meeting"
            color="bg-[#0E9F6E]"
            href="/join"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7">
                <path
                  fillRule="evenodd"
                  d="M7.5 3.75A1.5 1.5 0 0 0 6 5.25v13.5a1.5 1.5 0 0 0 1.5 1.5h9a1.5 1.5 0 0 0 1.5-1.5V15a.75.75 0 0 1 1.5 0v3.75a3 3 0 0 1-3 3h-9a3 3 0 0 1-3-3V5.25a3 3 0 0 1 3-3h9a3 3 0 0 1 3 3V9A.75.75 0 0 1 18 9V5.25a1.5 1.5 0 0 0-1.5-1.5h-9Zm10.72 4.72a.75.75 0 0 1 1.06 0l3 3a.75.75 0 0 1 0 1.06l-3 3a.75.75 0 1 1-1.06-1.06l1.72-1.72H9a.75.75 0 0 1 0-1.5h10.94l-1.72-1.72a.75.75 0 0 1 0-1.06Z"
                  clipRule="evenodd"
                />
              </svg>
            }
          />
          <ActionButton
            label="Schedule Meeting"
            color="bg-[#7C3AED]"
            href="/schedule"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7">
                <path
                  fillRule="evenodd"
                  d="M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H6V3a.75.75 0 0 1 .75-.75Zm13.5 9a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5v8.25a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V11.25Z"
                  clipRule="evenodd"
                />
              </svg>
            }
          />
        </div>

        {/* Upcoming meetings */}
        <section className="mb-10">
          <h2 className="mb-3 text-lg font-semibold text-gray-800">Upcoming Meetings</h2>
          {loading ? (
            <p className="text-sm text-gray-500">Loading...</p>
          ) : upcoming.length === 0 ? (
            <p className="text-sm text-gray-500">No upcoming meetings. Schedule one above.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {upcoming.map((m) => (
                <MeetingCard key={m.id} meeting={m} />
              ))}
            </div>
          )}
        </section>

        {/* Recent meetings */}
        <section>
          <h2 className="mb-3 text-lg font-semibold text-gray-800">Recent Meetings</h2>
          {loading ? (
            <p className="text-sm text-gray-500">Loading...</p>
          ) : recent.length === 0 ? (
            <p className="text-sm text-gray-500">No recent meetings yet.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {recent.map((m) => (
                <MeetingCard key={m.id} meeting={m} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
