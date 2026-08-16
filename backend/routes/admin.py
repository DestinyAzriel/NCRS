from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import re

from backend.database import get_db
from backend.models import (
    User, NewsStory, ScheduleSlot, Podcast, LeagueTable,
    Partner, TeamMember, FeedbackSubmission, StationStatus
)
from backend.schemas import (
    NewsStoryCreate, NewsStoryUpdate, NewsStoryResponse,
    ScheduleSlotCreate, ScheduleSlotUpdate, ScheduleSlotResponse,
    PodcastCreate, PodcastUpdate, PodcastResponse,
    LeagueTableCreate, LeagueTableUpdate, LeagueTableResponse,
    PartnerCreate, PartnerResponse,
    TeamMemberCreate, TeamMemberResponse,
    FeedbackSubmissionResponse, FeedbackStatusUpdate,
    StationStatusUpdate, StationStatusResponse, UserResponse
)
from backend.auth import get_current_user, require_role

router = APIRouter()

# --- Admin: Current User ---
@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

# --- Admin: Station Status ---
@router.put("/status", response_model=StationStatusResponse)
def update_status(
    update: StationStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["manager"])),
):
    obj = db.query(StationStatus).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Station status not found")
    for field, value in update.model_dump(exclude_unset=True).items():
        setattr(obj, field, value)
    db.commit()
    db.refresh(obj)
    return obj

# --- Admin: News Stories ---
@router.get("/news", response_model=List[NewsStoryResponse])
def admin_get_news(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(NewsStory).order_by(NewsStory.published_at.desc()).all()

@router.post("/news", response_model=NewsStoryResponse, status_code=201)
def admin_create_news(
    story_in: NewsStoryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["editor", "manager"])),
):
    # Auto-generate slug if needed
    slug = story_in.slug or re.sub(r'[^a-z0-9]+', '-', story_in.title.lower()).strip('-')
    existing = db.query(NewsStory).filter(NewsStory.slug == slug).first()
    if existing:
        raise HTTPException(status_code=400, detail="A story with this slug already exists")
    story = NewsStory(**story_in.model_dump())
    story.slug = slug
    db.add(story)
    db.commit()
    db.refresh(story)
    return story

@router.put("/news/{story_id}", response_model=NewsStoryResponse)
def admin_update_news(
    story_id: int,
    update: NewsStoryUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["editor", "manager"])),
):
    story = db.query(NewsStory).filter(NewsStory.id == story_id).first()
    if not story:
        raise HTTPException(status_code=404, detail="Story not found")
    for field, value in update.model_dump(exclude_unset=True).items():
        setattr(story, field, value)
    db.commit()
    db.refresh(story)
    return story

@router.delete("/news/{story_id}", status_code=204)
def admin_delete_news(
    story_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["manager"])),
):
    story = db.query(NewsStory).filter(NewsStory.id == story_id).first()
    if not story:
        raise HTTPException(status_code=404, detail="Story not found")
    db.delete(story)
    db.commit()

# --- Admin: Schedule Slots ---
@router.get("/schedule", response_model=List[ScheduleSlotResponse])
def admin_get_schedule(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(ScheduleSlot).order_by(ScheduleSlot.day_of_week, ScheduleSlot.start_time).all()

@router.post("/schedule", response_model=ScheduleSlotResponse, status_code=201)
def admin_create_slot(
    slot_in: ScheduleSlotCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["editor", "manager"])),
):
    slot = ScheduleSlot(**slot_in.model_dump())
    db.add(slot)
    db.commit()
    db.refresh(slot)
    return slot

@router.put("/schedule/{slot_id}", response_model=ScheduleSlotResponse)
def admin_update_slot(
    slot_id: int,
    update: ScheduleSlotUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["editor", "manager"])),
):
    slot = db.query(ScheduleSlot).filter(ScheduleSlot.id == slot_id).first()
    if not slot:
        raise HTTPException(status_code=404, detail="Schedule slot not found")
    for field, value in update.model_dump(exclude_unset=True).items():
        setattr(slot, field, value)
    db.commit()
    db.refresh(slot)
    return slot

@router.delete("/schedule/{slot_id}", status_code=204)
def admin_delete_slot(
    slot_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["editor", "manager"])),
):
    slot = db.query(ScheduleSlot).filter(ScheduleSlot.id == slot_id).first()
    if not slot:
        raise HTTPException(status_code=404, detail="Slot not found")
    db.delete(slot)
    db.commit()

# --- Admin: Podcasts ---
@router.post("/podcasts", response_model=PodcastResponse, status_code=201)
def admin_create_podcast(
    podcast_in: PodcastCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["editor", "manager"])),
):
    podcast = Podcast(**podcast_in.model_dump())
    db.add(podcast)
    db.commit()
    db.refresh(podcast)
    return podcast

@router.put("/podcasts/{podcast_id}", response_model=PodcastResponse)
def admin_update_podcast(
    podcast_id: int,
    update: PodcastUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["editor", "manager"])),
):
    podcast = db.query(Podcast).filter(Podcast.id == podcast_id).first()
    if not podcast:
        raise HTTPException(status_code=404, detail="Podcast not found")
    for field, value in update.model_dump(exclude_unset=True).items():
        setattr(podcast, field, value)
    db.commit()
    db.refresh(podcast)
    return podcast

@router.delete("/podcasts/{podcast_id}", status_code=204)
def admin_delete_podcast(
    podcast_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["editor", "manager"])),
):
    podcast = db.query(Podcast).filter(Podcast.id == podcast_id).first()
    if not podcast:
        raise HTTPException(status_code=404, detail="Podcast not found")
    db.delete(podcast)
    db.commit()

# --- Admin: League Tables ---
@router.post("/sports", response_model=LeagueTableResponse, status_code=201)
def admin_create_league(
    league_in: LeagueTableCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["editor", "manager"])),
):
    existing = db.query(LeagueTable).filter(LeagueTable.league_key == league_in.league_key).first()
    if existing:
        raise HTTPException(status_code=400, detail="League with this key already exists")
    data = league_in.model_dump()
    data["standings_data"] = [row.model_dump() for row in league_in.standings_data]
    league = LeagueTable(**data)
    db.add(league)
    db.commit()
    db.refresh(league)
    return league

@router.put("/sports/{league_key}", response_model=LeagueTableResponse)
def admin_update_league(
    league_key: str,
    update: LeagueTableUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["editor", "manager"])),
):
    league = db.query(LeagueTable).filter(LeagueTable.league_key == league_key).first()
    if not league:
        raise HTTPException(status_code=404, detail="League not found")
    update_data = update.model_dump(exclude_unset=True)
    if "standings_data" in update_data and update_data["standings_data"]:
        update_data["standings_data"] = [row.model_dump() for row in update.standings_data]
    for field, value in update_data.items():
        setattr(league, field, value)
    db.commit()
    db.refresh(league)
    return league

# --- Admin: Partners (manager only) ---
@router.post("/partners", response_model=PartnerResponse, status_code=201)
def admin_create_partner(
    partner_in: PartnerCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["manager"])),
):
    partner = Partner(**partner_in.model_dump())
    db.add(partner)
    db.commit()
    db.refresh(partner)
    return partner

@router.delete("/partners/{partner_id}", status_code=204)
def admin_delete_partner(
    partner_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["manager"])),
):
    partner = db.query(Partner).filter(Partner.id == partner_id).first()
    if not partner:
        raise HTTPException(status_code=404, detail="Partner not found")
    db.delete(partner)
    db.commit()

# --- Admin: Team Members (manager only) ---
@router.post("/team", response_model=TeamMemberResponse, status_code=201)
def admin_create_team_member(
    member_in: TeamMemberCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["manager"])),
):
    member = TeamMember(**member_in.model_dump())
    db.add(member)
    db.commit()
    db.refresh(member)
    return member

@router.delete("/team/{member_id}", status_code=204)
def admin_delete_team_member(
    member_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["manager"])),
):
    member = db.query(TeamMember).filter(TeamMember.id == member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Team member not found")
    db.delete(member)
    db.commit()

# --- Admin: Feedback Inbox (read-only, manager reviews) ---
@router.get("/feedback", response_model=List[FeedbackSubmissionResponse])
def admin_get_feedback(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return db.query(FeedbackSubmission).order_by(FeedbackSubmission.created_at.desc()).all()

@router.put("/feedback/{submission_id}/status", response_model=FeedbackSubmissionResponse)
def admin_update_feedback_status(
    submission_id: int,
    update: FeedbackStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["manager"])),
):
    submission = db.query(FeedbackSubmission).filter(FeedbackSubmission.id == submission_id).first()
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
    submission.status = update.status
    db.commit()
    db.refresh(submission)
    return submission
