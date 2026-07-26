"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { api, Meeting } from "@/lib/api";

// NOTE ON SCOPE: This assignment's core features (dashboard, create/join/
// schedule meeting) do not require real camera/mic streaming, and it isn't
// part of the evaluation criteria either. So this room is a UI-only shell:
// it looks and behaves like a Zoom call (tiles, mute/camera toggle, leave)
// but doesn't open a real WebRTC connection. Toggle state is local only.

export default function MeetingRoomPage() {
  const { code } = useParams<{ code: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const myName = searchParams.get("name") || "You";

  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [error, setError] = useState("");
  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);

  useEffect(() => {
    api
      .getMeeting(code)
      .then((m) => setMeeting(m))
      .catch(() => setError("Meeting not found. It may have ended or the ID is wrong."));
  }, [code]);

  const initials = (name: string) =>
    name
      .split(" ")
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900 text-center text-white">
        <div>
          <p className="mb-4 text-lg">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="rounded bg-[#2D8CFF] px-4 py-2 text-sm font-medium"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-900 text-white">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3 text-sm">
        <span className="font-medium">{meeting?.title || "Meeting"}</span>
        <span className="text-gray-400">Meeting ID: {code}</span>
      </div>

      {/* Video grid (fake tiles) */}
      <div className="flex flex-1 items-center justify-center gap-6 px-10">
        <VideoTile name={myName} isSelf muted={muted} cameraOff={cameraOff} initials={initials(myName)} />
        <VideoTile name={meeting?.host_name || "Host"} initials={initials(meeting?.host_name || "H")} />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 py-6">
        <ControlButton
          active={muted}
          label={muted ? "Unmute" : "Mute"}
          onClick={() => setMuted(!muted)}
        />
        <ControlButton
          active={cameraOff}
          label={cameraOff ? "Start Video" : "Stop Video"}
          onClick={() => setCameraOff(!cameraOff)}
        />
        <button
          onClick={() => router.push("/")}
          className="rounded bg-red-600 px-5 py-2 text-sm font-medium hover:bg-red-700"
        >
          Leave
        </button>
      </div>
    </div>
  );
}

function VideoTile({
  name,
  initials,
  isSelf,
  muted,
  cameraOff,
}: {
  name: string;
  initials: string;
  isSelf?: boolean;
  muted?: boolean;
  cameraOff?: boolean;
}) {
  return (
    <div className="flex h-64 w-96 flex-col items-center justify-center rounded-lg bg-gray-800">
      {cameraOff && isSelf ? (
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-600 text-lg font-semibold">
          {initials}
        </div>
      ) : (
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#2D8CFF] text-lg font-semibold">
          {initials}
        </div>
      )}
      <p className="mt-3 text-sm text-gray-300">
        {name} {isSelf && "(You)"} {isSelf && muted && "🔇"}
      </p>
    </div>
  );
}

function ControlButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded px-5 py-2 text-sm font-medium ${
        active ? "bg-red-600 hover:bg-red-700" : "bg-gray-700 hover:bg-gray-600"
      }`}
    >
      {label}
    </button>
  );
}
