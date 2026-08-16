import datetime
from typing import List, Optional, Any
from pydantic import BaseModel, ConfigDict

# --- User & Auth Schemas ---
class UserBase(BaseModel):
    email: str
    full_name: str
    role: str = "editor"
    is_active: bool = True

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    created_at: datetime.datetime
    model_config = ConfigDict(from_attributes=True)

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None

class LoginRequest(BaseModel):
    email: str
    password: str

# --- News Schemas ---
class NewsStoryBase(BaseModel):
    title: str
    slug: str
    category: str = "District News"
    summary: str
    content: str
    author: str = "Nyanthepa News Desk"
    is_featured: bool = False
    is_breaking: bool = False
    send_push: bool = False
    image_url: Optional[str] = None

class NewsStoryCreate(NewsStoryBase):
    pass

class NewsStoryUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    category: Optional[str] = None
    summary: Optional[str] = None
    content: Optional[str] = None
    author: Optional[str] = None
    is_featured: Optional[bool] = None
    is_breaking: Optional[bool] = None
    send_push: Optional[bool] = None
    image_url: Optional[str] = None

class NewsStoryResponse(NewsStoryBase):
    id: int
    published_at: datetime.datetime
    model_config = ConfigDict(from_attributes=True)

# --- Schedule Slot Schemas ---
class ScheduleSlotBase(BaseModel):
    day_of_week: str
    start_time: str
    end_time: str
    program_name: str
    presenter: str
    description: str
    category: str = "General Broadcast"
    language: str = "Chisena / EN"
    order: int = 0

class ScheduleSlotCreate(ScheduleSlotBase):
    pass

class ScheduleSlotUpdate(BaseModel):
    day_of_week: Optional[str] = None
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    program_name: Optional[str] = None
    presenter: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    language: Optional[str] = None
    order: Optional[int] = None

class ScheduleSlotResponse(ScheduleSlotBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

# --- Podcast Schemas ---
class PodcastBase(BaseModel):
    title: str
    presenter: str
    duration: str = "30 mins"
    audio_url: str
    youtube_url: Optional[str] = None
    description: str
    category: str = "Sena Culture"
    broadcast_date: str
    rights_cleared: bool = True

class PodcastCreate(PodcastBase):
    pass

class PodcastUpdate(BaseModel):
    title: Optional[str] = None
    presenter: Optional[str] = None
    duration: Optional[str] = None
    audio_url: Optional[str] = None
    youtube_url: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    broadcast_date: Optional[str] = None
    rights_cleared: Optional[bool] = None

class PodcastResponse(PodcastBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

# --- League Table Schemas ---
class StandingRow(BaseModel):
    pos: int
    team: str
    played: int
    won: int
    drawn: int
    lost: int
    gd: int
    points: int

class LeagueTableBase(BaseModel):
    league_key: str
    league_name: str
    season: str = "2025/2026"
    standings_data: List[StandingRow]

class LeagueTableCreate(LeagueTableBase):
    pass

class LeagueTableUpdate(BaseModel):
    league_name: Optional[str] = None
    season: Optional[str] = None
    standings_data: Optional[List[StandingRow]] = None

class LeagueTableResponse(LeagueTableBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

# --- Partner Schemas ---
class PartnerBase(BaseModel):
    name: str
    partner_type: str = "donor"
    logo_url: Optional[str] = None
    description: str
    active_projects: str
    order: int = 0

class PartnerCreate(PartnerBase):
    pass

class PartnerResponse(PartnerBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

# --- Team Member Schemas ---
class TeamMemberBase(BaseModel):
    name: str
    role: str
    on_air_name: Optional[str] = None
    bio: str
    photo_url: Optional[str] = None
    order: int = 0

class TeamMemberCreate(TeamMemberBase):
    pass

class TeamMemberResponse(TeamMemberBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

# --- Feedback & Complaints Schemas ---
class FeedbackSubmissionCreate(BaseModel):
    sender_name: Optional[str] = None
    phone_or_email: Optional[str] = None
    category: str = "General Feedback"
    message: str
    is_urgent: bool = False

class FeedbackSubmissionResponse(FeedbackSubmissionCreate):
    id: int
    status: str
    created_at: datetime.datetime
    model_config = ConfigDict(from_attributes=True)

class FeedbackStatusUpdate(BaseModel):
    status: str

# --- Station Status Schemas ---
class StationStatusBase(BaseModel):
    on_air_show_title: str
    on_air_presenter: str
    stream_url: str
    stream_status: str = "online"
    advisory_headline: str
    advisory_message: str
    advisory_active: bool = True

class StationStatusUpdate(BaseModel):
    on_air_show_title: Optional[str] = None
    on_air_presenter: Optional[str] = None
    stream_url: Optional[str] = None
    stream_status: Optional[str] = None
    advisory_headline: Optional[str] = None
    advisory_message: Optional[str] = None
    advisory_active: Optional[bool] = None

class StationStatusResponse(StationStatusBase):
    id: int
    model_config = ConfigDict(from_attributes=True)
