"use client";

import { Meeting } from "@/lib/api";

function formatDate(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function MeetingCard({ meeting }: { meeting: Meeting }) {
  const copyLink = () => {
    navigator.clipboard.writeText(meeting.invite_link);
    alert("Invite link copied!");
  };

  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm">
      <div>
        <p className="font-medium text-gray-800">{meeting.title}</p>
        <p className="text-xs text-gray-500">
          {meeting.meeting_type === "scheduled"
            ? formatDate(meeting.scheduled_time)
            : formatDate(meeting.created_at)}
          {" · "}
          ID: {meeting.meeting_code}
        </p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={copyLink}
          className="rounded border border-gray-300 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50"
        >
          Copy Link
        </button>
        {meeting.status === "upcoming" && (
          <a
            href={`/meeting/${meeting.meeting_code}`}
            className="rounded bg-[#2D8CFF] px-3 py-1 text-xs font-medium text-white hover:opacity-90"
          >
            Start
          </a>
        )}
      </div>
    </div>
  );
}
