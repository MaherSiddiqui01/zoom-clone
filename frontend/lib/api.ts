// Central place for all backend calls.
// Change NEXT_PUBLIC_API_URL in .env.local when deploying (see README).
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export type Meeting = {
  id: number;
  meeting_code: string;
  title: string;
  description: string | null;
  host_name: string;
  meeting_type: "instant" | "scheduled";
  scheduled_time: string | null;
  duration_minutes: number;
  status: "upcoming" | "completed";
  created_at: string;
  invite_link: string;
};

export type Participant = {
  id: number;
  display_name: string;
  joined_at: string;
};

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || `Request failed (${res.status})`);
  }
  return res.json();
}

export const api = {
  createInstantMeeting: (title = "Instant Meeting") =>
    fetch(`${API_URL}/api/meetings/instant`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    }).then((r) => handle<Meeting>(r)),

  createScheduledMeeting: (data: {
    title: string;
    description?: string;
    scheduled_time: string;
    duration_minutes: number;
  }) =>
    fetch(`${API_URL}/api/meetings/schedule`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((r) => handle<Meeting>(r)),

  getUpcoming: () =>
    fetch(`${API_URL}/api/meetings/upcoming`, { cache: "no-store" }).then((r) =>
      handle<Meeting[]>(r)
    ),

  getRecent: () =>
    fetch(`${API_URL}/api/meetings/recent`, { cache: "no-store" }).then((r) =>
      handle<Meeting[]>(r)
    ),

  getMeeting: (code: string) =>
    fetch(`${API_URL}/api/meetings/${code}`, { cache: "no-store" }).then((r) =>
      handle<Meeting>(r)
    ),

  joinMeeting: (code: string, display_name: string) =>
    fetch(`${API_URL}/api/meetings/${code}/join`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ display_name }),
    }).then((r) => handle<{ meeting: Meeting; participant: Participant }>(r)),
};
