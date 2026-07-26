"""
Run this once to fill the database with sample meetings so the dashboard
isn't empty when you demo it.

Terminal:
    python seed.py
"""
from datetime import datetime, timedelta

from database import SessionLocal, engine, Base
import models

Base.metadata.create_all(bind=engine)
db = SessionLocal()

# Avoid duplicate seeding if run twice
if db.query(models.Meeting).count() == 0:
    now = datetime.utcnow()

    seed_meetings = [
        models.Meeting(
            title="Product Sync",
            description="Weekly product team sync-up",
            host_name="Default User",
            meeting_type=models.MeetingType.scheduled,
            scheduled_time=now + timedelta(days=1, hours=2),
            duration_minutes=30,
            status=models.MeetingStatus.upcoming,
        ),
        models.Meeting(
            title="Client Demo",
            description="Demo of new dashboard features to client",
            host_name="Default User",
            meeting_type=models.MeetingType.scheduled,
            scheduled_time=now + timedelta(days=2, hours=5),
            duration_minutes=60,
            status=models.MeetingStatus.upcoming,
        ),
        models.Meeting(
            title="Daily Standup",
            description="Quick daily standup",
            host_name="Default User",
            meeting_type=models.MeetingType.instant,
            duration_minutes=15,
            status=models.MeetingStatus.completed,
            created_at=now - timedelta(days=1),
        ),
        models.Meeting(
            title="1:1 with Manager",
            description="Monthly check-in",
            host_name="Default User",
            meeting_type=models.MeetingType.instant,
            duration_minutes=30,
            status=models.MeetingStatus.completed,
            created_at=now - timedelta(days=3),
        ),
    ]

    db.add_all(seed_meetings)
    db.commit()
    print(f"Seeded {len(seed_meetings)} meetings.")
else:
    print("Meetings already exist, skipping seed.")

db.close()
