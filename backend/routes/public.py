from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models import NewsStory, ScheduleSlot, Podcast, LeagueTable, Partner, TeamMember, StationStatus
from backend.schemas import (
    NewsStoryResponse, ScheduleSlotResponse, PodcastResponse,
    LeagueTableResponse, PartnerResponse, TeamMemberResponse,
    StationStatusResponse, FeedbackSubmissionCreate, FeedbackSubmissionResponse
)
from backend.models import FeedbackSubmission

router = APIRouter()

# --- Station Status (public) ---
@router.get("/status", response_model=StationStatusResponse)
def get_station_status(db: Session = Depends(get_db)):
    status_obj = db.query(StationStatus).first()
    if not status_obj:
        raise HTTPException(status_code=404, detail="Station status not configured")
    return status_obj

# --- News ---
@router.get("/news", response_model=List[NewsStoryResponse])
def get_news(skip: int = 0, limit: int = 20, category: Optional[str] = None, db: Session = Depends(get_db)):
    q = db.query(NewsStory)
    if category:
        q = q.filter(NewsStory.category == category)
    return q.order_by(NewsStory.published_at.desc()).offset(skip).limit(limit).all()

@router.get("/news/{slug}", response_model=NewsStoryResponse)
def get_news_story(slug: str, db: Session = Depends(get_db)):
    story = db.query(NewsStory).filter(NewsStory.slug == slug).first()
    if not story:
        raise HTTPException(status_code=404, detail="Story not found")
    return story

# --- Schedule ---
@router.get("/schedule", response_model=List[ScheduleSlotResponse])
def get_schedule(day: Optional[str] = None, db: Session = Depends(get_db)):
    q = db.query(ScheduleSlot)
    if day:
        q = q.filter(ScheduleSlot.day_of_week == day)
    return q.order_by(ScheduleSlot.order, ScheduleSlot.start_time).all()

# --- Podcasts ---
@router.get("/podcasts", response_model=List[PodcastResponse])
def get_podcasts(skip: int = 0, limit: int = 20, category: Optional[str] = None, db: Session = Depends(get_db)):
    q = db.query(Podcast)
    if category:
        q = q.filter(Podcast.category == category)
    return q.order_by(Podcast.broadcast_date.desc()).offset(skip).limit(limit).all()

@router.get("/podcasts/{podcast_id}", response_model=PodcastResponse)
def get_podcast(podcast_id: int, db: Session = Depends(get_db)):
    podcast = db.query(Podcast).filter(Podcast.id == podcast_id).first()
    if not podcast:
        raise HTTPException(status_code=404, detail="Podcast not found")
    return podcast

# --- Sports / League Tables ---
@router.get("/sports", response_model=List[LeagueTableResponse])
def get_all_leagues(db: Session = Depends(get_db)):
    return db.query(LeagueTable).all()

@router.get("/sports/{league_key}", response_model=LeagueTableResponse)
def get_league(league_key: str, db: Session = Depends(get_db)):
    league = db.query(LeagueTable).filter(LeagueTable.league_key == league_key).first()
    if not league:
        raise HTTPException(status_code=404, detail="League not found")
    return league

# --- Partners & Donors ---
@router.get("/partners", response_model=List[PartnerResponse])
def get_partners(db: Session = Depends(get_db)):
    return db.query(Partner).order_by(Partner.order).all()

# --- Team ---
@router.get("/team", response_model=List[TeamMemberResponse])
def get_team(db: Session = Depends(get_db)):
    return db.query(TeamMember).order_by(TeamMember.order).all()

# --- Feedback & Complaints (public submit) ---
@router.post("/feedback", response_model=FeedbackSubmissionResponse, status_code=201)
def submit_feedback(feedback_in: FeedbackSubmissionCreate, db: Session = Depends(get_db)):
    submission = FeedbackSubmission(**feedback_in.model_dump())
    db.add(submission)
    db.commit()
    db.refresh(submission)
    return submission
