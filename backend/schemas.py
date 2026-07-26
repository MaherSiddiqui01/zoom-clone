from datetime import datetime
from typing import Optional, List

from pydantic import BaseModel, ConfigDict


class ParticipantOut(BaseModel):
    id: int
    display_name: str
    joined_at: datetime

    model_config = ConfigDict(from_attributes=True)


class MeetingBase(BaseModel):
    title: str
    description: Optional[str] = None
    host_name: str = "Default User"


class InstantMeetingCreate(MeetingBase):
    title: str = "Instant Meeting"


class ScheduleMeetingCreate(MeetingBase):
    scheduled_time: datetime
    duration_minutes: int = 30


class MeetingOut(BaseModel):
    id: int
    meeting_code: str
    title: str
    description: Optional[str]
    host_name: str
    meeting_type: str
    scheduled_time: Optional[datetime]
    duration_minutes: int
    status: str
    created_at: datetime
    invite_link: str

    model_config = ConfigDict(from_attributes=True)


class JoinMeetingRequest(BaseModel):
    display_name: str


class JoinMeetingResponse(BaseModel):
    meeting: MeetingOut
    participant: ParticipantOut
