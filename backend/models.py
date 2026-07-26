import enum
import uuid
from datetime import datetime

from sqlalchemy import Column, String, Integer, DateTime, Enum, ForeignKey, Text
from sqlalchemy.orm import relationship

from database import Base


class MeetingType(str, enum.Enum):
    instant = "instant"
    scheduled = "scheduled"


class MeetingStatus(str, enum.Enum):
    upcoming = "upcoming"
    completed = "completed"


def generate_meeting_code() -> str:
    # Zoom-style: 3-4-3 digit groups, e.g. 123-4567-890
    raw = uuid.uuid4().int
    s = str(raw)[:10].rjust(10, "1")
    return f"{s[0:3]}-{s[3:7]}-{s[7:10]}"


class Meeting(Base):
    __tablename__ = "meetings"

    id = Column(Integer, primary_key=True, index=True)
    meeting_code = Column(String, unique=True, index=True, default=generate_meeting_code)
    title = Column(String, nullable=False, default="Zoom Meeting")
    description = Column(Text, nullable=True)
    host_name = Column(String, nullable=False, default="Default User")
    meeting_type = Column(Enum(MeetingType), nullable=False)
    scheduled_time = Column(DateTime, nullable=True)  # only for scheduled meetings
    duration_minutes = Column(Integer, nullable=False, default=30)
    status = Column(Enum(MeetingStatus), nullable=False, default=MeetingStatus.upcoming)
    created_at = Column(DateTime, default=datetime.utcnow)

    participants = relationship("Participant", back_populates="meeting", cascade="all, delete-orphan")


class Participant(Base):
    __tablename__ = "participants"

    id = Column(Integer, primary_key=True, index=True)
    meeting_id = Column(Integer, ForeignKey("meetings.id"), nullable=False)
    display_name = Column(String, nullable=False)
    joined_at = Column(DateTime, default=datetime.utcnow)

    meeting = relationship("Meeting", back_populates="participants")
