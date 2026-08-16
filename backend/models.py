import datetime
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, JSON
from backend.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), default="editor", nullable=False)  # "editor" or "manager"
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class NewsStory(Base):
    __tablename__ = "news_stories"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), index=True, nullable=False)
    slug = Column(String(255), unique=True, index=True, nullable=False)
    category = Column(String(100), index=True, default="District News")  # Agriculture, Disaster & Flood, Health, Sports, Culture
    summary = Column(Text, nullable=False)
    content = Column(Text, nullable=False)
    author = Column(String(150), default="Nyanthepa News Desk")
    published_at = Column(DateTime, default=datetime.datetime.utcnow)
    is_featured = Column(Boolean, default=False)
    is_breaking = Column(Boolean, default=False)
    send_push = Column(Boolean, default=False)
    image_url = Column(String(500), nullable=True)

class ScheduleSlot(Base):
    __tablename__ = "schedule_slots"

    id = Column(Integer, primary_key=True, index=True)
    day_of_week = Column(String(20), index=True, nullable=False)  # Monday, Tuesday, ... Sunday
    start_time = Column(String(10), nullable=False)  # "06:00"
    end_time = Column(String(10), nullable=False)    # "09:00"
    program_name = Column(String(255), nullable=False)
    presenter = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String(100), default="General Broadcast")
    language = Column(String(50), default="Chisena / EN")
    order = Column(Integer, default=0)

class Podcast(Base):
    __tablename__ = "podcasts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    presenter = Column(String(255), nullable=False)
    duration = Column(String(50), default="30 mins")
    audio_url = Column(String(500), nullable=False)
    youtube_url = Column(String(500), nullable=True)
    description = Column(Text, nullable=False)
    category = Column(String(100), default="Sena Culture")  # Culture, Health, Agriculture, Youth
    broadcast_date = Column(String(50), default=lambda: datetime.date.today().isoformat())
    rights_cleared = Column(Boolean, default=True)

class LeagueTable(Base):
    __tablename__ = "league_tables"

    id = Column(Integer, primary_key=True, index=True)
    league_key = Column(String(50), unique=True, index=True, nullable=False)  # "local_nsanje", "fdh_bank_cup", "epl"
    league_name = Column(String(255), nullable=False)
    season = Column(String(50), default="2025/2026")
    standings_data = Column(JSON, nullable=False)  # List of objects with pos, team, played, won, drawn, lost, gd, points

class Partner(Base):
    __tablename__ = "partners"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    partner_type = Column(String(100), default="donor")  # "donor", "ngo", "corporate", "government"
    logo_url = Column(String(500), nullable=True)
    description = Column(Text, nullable=False)
    active_projects = Column(Text, nullable=False)
    order = Column(Integer, default=0)

class TeamMember(Base):
    __tablename__ = "team_members"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    role = Column(String(255), nullable=False)  # "Station Manager", "Senior Presenter", "Sports Editor"
    on_air_name = Column(String(255), nullable=True)
    bio = Column(Text, nullable=False)
    photo_url = Column(String(500), nullable=True)
    order = Column(Integer, default=0)

class FeedbackSubmission(Base):
    __tablename__ = "feedback_submissions"

    id = Column(Integer, primary_key=True, index=True)
    sender_name = Column(String(255), nullable=True)
    phone_or_email = Column(String(255), nullable=True)
    category = Column(String(100), default="General Feedback")  # "Complaint (Editorial)", "Programming Suggestion", "Song Request"
    message = Column(Text, nullable=False)
    is_urgent = Column(Boolean, default=False)
    status = Column(String(50), default="new")  # "new", "reviewed", "escalated_macra", "resolved"
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class StationStatus(Base):
    __tablename__ = "station_status"

    id = Column(Integer, primary_key=True, index=True)
    on_air_show_title = Column(String(255), default="Morning Shire Horizon (Kutcha kwa Shire)")
    on_air_presenter = Column(String(255), default="Chifundo Banda & Maria Nyasulu")
    stream_url = Column(String(500), default="https://stream.nyanthepa.mw/live.mp3")
    stream_status = Column(String(50), default="online")  # "online", "buffering", "maintenance"
    advisory_headline = Column(String(255), default="Live Shire Valley Advisory")
    advisory_message = Column(Text, default="Water levels along Chiromo and Marka riverbanks remain steady. Tune into 107.6 FM for hourly updates.")
    advisory_active = Column(Boolean, default=True)
