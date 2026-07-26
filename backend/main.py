import os
from datetime import datetime
from typing import List

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import desc

import models
import schemas
from database import engine, get_db, Base

# Create tables on startup (fine for SQLite + this assignment's scope)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Zoom Clone API")

# Frontend runs on a different port during dev -> need CORS
FRONTEND_ORIGIN = os.environ.get("FRONTEND_ORIGIN", "*")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_ORIGIN] if FRONTEND_ORIGIN != "*" else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_INVITE_URL = os.environ.get("BASE_INVITE_URL", "http://localhost:3000/meeting")


def to_meeting_out(m: models.Meeting) -> schemas.MeetingOut:
    return schemas.MeetingOut(
        id=m.id,
        meeting_code=m.meeting_code,
        title=m.title,
        description=m.description,
        host_name=m.host_name,
        meeting_type=m.meeting_type.value,
        scheduled_time=m.scheduled_time,
        duration_minutes=m.duration_minutes,
        status=m.status.value,
        created_at=m.created_at,
        invite_link=f"{BASE_INVITE_URL}/{m.meeting_code}",
    )


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.post("/api/meetings/instant", response_model=schemas.MeetingOut)
def create_instant_meeting(payload: schemas.InstantMeetingCreate, db: Session = Depends(get_db)):
    meeting = models.Meeting(
        title=payload.title,
        description=payload.description,
        host_name=payload.host_name,
        meeting_type=models.MeetingType.instant,
        status=models.MeetingStatus.upcoming,
    )
    db.add(meeting)
    db.commit()
    db.refresh(meeting)
    return to_meeting_out(meeting)


@app.post("/api/meetings/schedule", response_model=schemas.MeetingOut)
def create_scheduled_meeting(payload: schemas.ScheduleMeetingCreate, db: Session = Depends(get_db)):
    meeting = models.Meeting(
        title=payload.title,
        description=payload.description,
        host_name=payload.host_name,
        meeting_type=models.MeetingType.scheduled,
        scheduled_time=payload.scheduled_time,
        duration_minutes=payload.duration_minutes,
        status=models.MeetingStatus.upcoming,
    )
    db.add(meeting)
    db.commit()
    db.refresh(meeting)
    return to_meeting_out(meeting)


@app.get("/api/meetings/upcoming", response_model=List[schemas.MeetingOut])
def list_upcoming(db: Session = Depends(get_db)):
    meetings = (
        db.query(models.Meeting)
        .filter(models.Meeting.status == models.MeetingStatus.upcoming)
        .filter(models.Meeting.meeting_type == models.MeetingType.scheduled)
        .order_by(models.Meeting.scheduled_time.asc())
        .all()
    )
    return [to_meeting_out(m) for m in meetings]


@app.get("/api/meetings/recent", response_model=List[schemas.MeetingOut])
def list_recent(db: Session = Depends(get_db)):
    meetings = (
        db.query(models.Meeting)
        .order_by(desc(models.Meeting.created_at))
        .limit(10)
        .all()
    )
    return [to_meeting_out(m) for m in meetings]


@app.get("/api/meetings/{meeting_code}", response_model=schemas.MeetingOut)
def get_meeting(meeting_code: str, db: Session = Depends(get_db)):
    meeting = db.query(models.Meeting).filter(models.Meeting.meeting_code == meeting_code).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found. Check the ID and try again.")
    return to_meeting_out(meeting)


@app.post("/api/meetings/{meeting_code}/join", response_model=schemas.JoinMeetingResponse)
def join_meeting(meeting_code: str, payload: schemas.JoinMeetingRequest, db: Session = Depends(get_db)):
    meeting = db.query(models.Meeting).filter(models.Meeting.meeting_code == meeting_code).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found. Check the ID and try again.")

    if not payload.display_name.strip():
        raise HTTPException(status_code=400, detail="Display name is required.")

    participant = models.Participant(meeting_id=meeting.id, display_name=payload.display_name.strip())
    db.add(participant)
    db.commit()
    db.refresh(participant)

    return schemas.JoinMeetingResponse(
        meeting=to_meeting_out(meeting),
        participant=schemas.ParticipantOut.model_validate(participant),
    )


@app.get("/api/meetings/{meeting_code}/participants", response_model=List[schemas.ParticipantOut])
def get_participants(meeting_code: str, db: Session = Depends(get_db)):
    meeting = db.query(models.Meeting).filter(models.Meeting.meeting_code == meeting_code).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found.")
    return [schemas.ParticipantOut.model_validate(p) for p in meeting.participants]
