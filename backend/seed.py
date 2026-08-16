"""
Nsanje-specific seed data for Nyanthepa Community Radio 107.6 FM.
Run: python -m backend.seed
"""
import datetime
import sys
import os
import warnings
warnings.filterwarnings("ignore", message=".*bcrypt.*")
os.environ.setdefault("PYTHONIOENCODING", "utf-8")
sys.stdout.reconfigure(encoding="utf-8", errors="replace")

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.database import engine, SessionLocal, Base
from backend import models
from backend.auth import get_password_hash

Base.metadata.create_all(bind=engine)

DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

def seed():
    db = SessionLocal()
    try:
        # ----- Users -----
        if not db.query(models.User).first():
            users = [
                models.User(
                    email="manager@nyanthepa.mw",
                    hashed_password=get_password_hash("Nyanthepa@2026!"),
                    full_name="Grace Phiri",
                    role="manager",
                ),
                models.User(
                    email="editor@nyanthepa.mw",
                    hashed_password=get_password_hash("Editor@1076"),
                    full_name="Peter Chisale",
                    role="editor",
                ),
            ]
            db.add_all(users)
            db.commit()
            print("[OK] Users seeded")

        # ----- Station Status -----
        if not db.query(models.StationStatus).first():
            db.add(models.StationStatus(
                on_air_show_title="Morning Shire Horizon (Kutcha kwa Shire)",
                on_air_presenter="Chifundo Banda & Maria Nyasulu",
                stream_url="https://stream.nyanthepa.mw/live.mp3",
                stream_status="online",
                advisory_headline="Live Shire Valley Advisory",
                advisory_message="Water levels along Chiromo and Marka riverbanks remain steady. Tune into 107.6 FM every hour for localized weather and agricultural updates.",
                advisory_active=True,
            ))
            db.commit()
            print("[OK] Station status seeded")

        # ----- News Stories -----
        if not db.query(models.NewsStory).first():
            stories = [
                models.NewsStory(
                    title="Bangula Cotton Farmers Welcome New Market Weighing Stations",
                    slug="bangula-cotton-farmers-weighing-stations-2026",
                    category="Agriculture & Trade",
                    summary="Growers in Nsanje North report improved transparency following installation of digital scales ahead of the primary cotton selling season.",
                    content="""Cotton farmers in the Bangula area of Nsanje District are celebrating the installation of six new digital weighing stations at the primary market, made possible through a joint initiative between the Agricultural Development and Marketing Corporation (ADMARC) and the Shire Valley Transformation Programme.\n\nThe new stations replace hand-balance scales that had been disputed by farmers for over a decade. "Before, we never knew if the weight was correct. Now we can see the number ourselves," said Lameck Sanudi, a smallholder farmer from Nsanje North. The district has approximately 14,000 registered cotton growers, many relying on the Bangula market as their primary income source each year.\n\nThe Nsanje District Agricultural Officer, Margaret Chikondi, confirmed that extension workers would be stationed at each weighing point through the peak selling period, expected to run from mid-August through October.\n\nNyanthepa 107.6 FM will carry live market reports each weekday at 09:30 during the Ulimi wa Patsogolo program.""",
                    author="Nyanthepa Agriculture Desk",
                    is_featured=True,
                    is_breaking=False,
                    published_at=datetime.datetime.utcnow() - datetime.timedelta(hours=3),
                ),
                models.NewsStory(
                    title="District Disaster Committee Completes Chiromo Riverbank Dykes Review",
                    slug="chiromo-riverbank-dykes-inspection-2026",
                    category="Disaster & Flood Preparedness",
                    summary="Community civil protection groups conduct joint inspection of reinforced river defences alongside traditional leaders ahead of the rainy season.",
                    content="""The Nsanje District Disaster Risk Management Committee has completed its pre-season inspection of dyke reinforcements along the Chiromo stretch of the Shire River, declaring the structures in a satisfactory condition to withstand anticipated rainfall between October and March.\n\nThe inspection, which also covered the Marka landing area, involved traditional authorities, village heads, and representatives from the Malawi Red Cross. Group Village Head Tengani commended the work of community volunteers who repaired two breach points identified after last season's high-water events.\n\n"Flood preparedness is not government work alone. It is our responsibility as communities," said the District Disaster Risk Management Officer, Charles Phakati.\n\nNyanthepa 107.6 FM carries emergency alerts for the Lower Shire on the hour, every hour, during active flood season. Community members are encouraged to register with their village heads to receive SMS alerts in partnership with the Department of Disaster Management Affairs (DoDMA).""",
                    author="Peter Chisale, Nyanthepa News Desk",
                    is_featured=True,
                    is_breaking=False,
                    published_at=datetime.datetime.utcnow() - datetime.timedelta(days=1),
                ),
                models.NewsStory(
                    title="Nsanje District Hospital Launches Under-Five Mobile Outreach in Marka",
                    slug="nsanje-hospital-under-five-outreach-marka-2026",
                    category="Community Health",
                    summary="Mobile clinical teams provide vaccinations and nutritional assessments for over 800 children along the border communities.",
                    content="""Nsanje District Hospital and the District Health Office launched a week-long mobile health outreach in Marka, targeting children under five years of age in communities with limited access to the main hospital.\n\nThe outreach, supported by UNICEF Malawi and the Ministry of Health, provided measles boosters, vitamin A supplementation, and MUAC nutritional screening to 847 children across seven villages in the Marka area. Community health workers reported that 23 children were identified as moderately acute malnourished and referred for therapeutic feeding support.\n\n"Many mothers in Marka have to walk over twelve kilometres to reach the hospital with a sick child. This outreach brings the clinic to them," said Clinical Officer Fanizo Gomani.\n\nThe next mobile outreach is scheduled for Tengani Trading Centre on 22nd August. Nyanthepa 107.6 FM will broadcast confirmed dates and venues each Tuesday morning.""",
                    author="Maria Nyasulu, Community Affairs Reporter",
                    is_featured=False,
                    is_breaking=False,
                    published_at=datetime.datetime.utcnow() - datetime.timedelta(days=2),
                ),
                models.NewsStory(
                    title="Bango FC Lead Nsanje District League After 14 Games",
                    slug="bango-fc-lead-district-league-2026",
                    category="Sports",
                    summary="Bango FC maintain a two-point lead over Bangula Stars in the 2025/26 Nsanje District Football League after a decisive 2-0 away win at Marka.",
                    content="""Bango FC extended their lead at the top of the Nsanje District Football League to two points following a professional 2-0 victory over Marka Border United at Marka Secondary School Ground on Saturday.\n\nGoals from striker Emmanuel Phiri in the 34th minute and a clinical finish from midfielder Tobias Nkhono ten minutes from time secured the three points. The win keeps Bango on 33 points from 14 games, with Bangula Stars level on games but two points behind after being held to a 1-1 draw by Tengani Youngsters.\n\n"We are focused on our game. The title is not won yet," Bango FC captain Daniel Mwale told Nyanthepa Sport after the final whistle.\n\nFull match reports, goal scorers, and updated standings for the Nsanje District League, FDH Premiership, and the English Premier League are available every Monday morning on the Nyanthepa Sport segment, and daily on this website.""",
                    author="Nyanthepa Sport",
                    is_featured=False,
                    is_breaking=False,
                    published_at=datetime.datetime.utcnow() - datetime.timedelta(days=1, hours=12),
                ),
                models.NewsStory(
                    title="Shire Valley Transformation Programme Opens Three New Boreholes in Tengani",
                    slug="svtp-boreholes-tengani-2026",
                    category="Water & Infrastructure",
                    summary="Communities in Tengani receive access to clean water as SVTP Phase II extends rural borehole coverage across southern Nsanje.",
                    content="""The Shire Valley Transformation Programme (SVTP) formally commissioned three new solar-powered boreholes in Tengani Extension Planning Area on Thursday, providing safe drinking water to an estimated 2,200 households who previously depended on unprotected shallow wells.\n\nThe boreholes were drilled as part of SVTP Phase II, a government irrigation and rural development initiative funded under a World Bank and African Development Bank package. Each borehole has a concrete apron, drainage channel, and a village water point committee established and trained by programme engineers.\n\n"This is not just water — this is health, time, and dignity for women and children who were walking long distances," said SVTP Project Coordinator Beatrice Kanjilima at the commissioning event.\n\nNyanthepa 107.6 FM has been broadcasting monthly updates on SVTP progress since the programme began in 2022. Full programme updates are available on the Projects & Donors section of this website.""",
                    author="Nyanthepa Community Development Desk",
                    is_featured=False,
                    is_breaking=False,
                    published_at=datetime.datetime.utcnow() - datetime.timedelta(days=3),
                ),
            ]
            db.add_all(stories)
            db.commit()
            print("[OK] News stories seeded")

        # ----- Schedule Slots (Full 7-Day Broadcast Timetable) -----
        if not db.query(models.ScheduleSlot).first():
            slots = []
            for i, day in enumerate(DAYS):
                is_weekend = day in ["Saturday", "Sunday"]
                day_slots = [
                    models.ScheduleSlot(day_of_week=day, start_time="05:00", end_time="06:00",
                        program_name="Shire Dawn Prayer & Devotions",
                        presenter="Various Community Faith Leaders",
                        description="Interfaith morning devotions shared by community religious leaders from Nsanje, Bangula, and Tengani.",
                        category="Religion & Culture", language="Chisena / EN", order=i * 20 + 1),
                    models.ScheduleSlot(day_of_week=day, start_time="06:00", end_time="09:00",
                        program_name="Morning Shire Horizon (Kutcha kwa Shire)" if not is_weekend else "Lowershire Weekend Sunrise",
                        presenter="Chifundo Banda & Maria Nyasulu" if not is_weekend else "Grace Kalonga",
                        description="Live breakfast show with community noticeboard, market prices from Bangula and Marka, and hourly weather and flood advisories for the Lower Shire." if not is_weekend else "Weekend community highlights, traditional music, and family announcements.",
                        category="Breakfast / Community", language="Chisena / EN", order=i * 20 + 2),
                    models.ScheduleSlot(day_of_week=day, start_time="09:00", end_time="11:30",
                        program_name="Ulimi wa Patsogolo (Agricultural Clinic)" if not is_weekend else "Cultural Sounds of the Lower Shire",
                        presenter="Agnes Phiri (with District Extension Officers)" if not is_weekend else "Elder Mwamadi Tembo",
                        description="Weekly farming clinic covering cotton preparation, maize seed selection, irrigation scheduling, and soil improvement for smallholders in the Lower Shire." if not is_weekend else "Traditional music and oral culture from Nsanje, celebrating Chisena heritage, Nyau traditions, and community proverbs.",
                        category="Agriculture" if not is_weekend else "Culture & Heritage", language="Chisena", order=i * 20 + 3),
                    models.ScheduleSlot(day_of_week=day, start_time="11:30", end_time="13:00",
                        program_name="Shire Midday Bulletin & Community Noticeboard",
                        presenter="Peter Chisale",
                        description="Comprehensive midday news bulletin covering district council decisions, health advisories, missing persons, and community announcements.",
                        category="News", language="English / Chisena", order=i * 20 + 4),
                    models.ScheduleSlot(day_of_week=day, start_time="13:00", end_time="14:00",
                        program_name="Musical Interlude & Song Requests",
                        presenter="DJ Mapanga",
                        description="Listener song requests and popular Malawian and Chisena music across all genres. Call 0888 107 107 to request your song.",
                        category="Music & Entertainment", language="Chisena", order=i * 20 + 5),
                    models.ScheduleSlot(day_of_week=day, start_time="14:00", end_time="16:30",
                        program_name="Za Chikhalidwe cha Chisena (Sena Heritage & Youth)" if not is_weekend else "Weekend Sports Round-Up",
                        presenter="Elder M. Tembo & Grace Kalonga" if not is_weekend else "Nyanthepa Sport Team",
                        description="Sena language programme celebrating local heritage, Chisena oral literature, traditional leadership, and youth voices from Nsanje communities." if not is_weekend else "Full match previews and results from the Nsanje District League, FDH Bank Cup Premiership, and EPL, with community football panel.",
                        category="Culture & Heritage" if not is_weekend else "Sports", language="Chisena" if not is_weekend else "English / Chisena", order=i * 20 + 6),
                    models.ScheduleSlot(day_of_week=day, start_time="17:00", end_time="19:00",
                        program_name="Evening Drive: Shire Voices",
                        presenter="Tobias Nkhono",
                        description="Drive-time phone-in and community debate. Listeners call in on the big issues facing Nsanje — from education and water access to local politics and market prices.",
                        category="Current Affairs / Phone-In", language="Chisena / EN", order=i * 20 + 7),
                    models.ScheduleSlot(day_of_week=day, start_time="19:00", end_time="20:00",
                        program_name="Nyanthepa Prime News (Nyuzulo wa Usiku)",
                        presenter="Peter Chisale",
                        description="Evening news with the day's top stories from Nsanje, Malawi national news, and regional East and Southern Africa coverage.",
                        category="News", language="English / Chisena", order=i * 20 + 8),
                    models.ScheduleSlot(day_of_week=day, start_time="20:00", end_time="22:00",
                        program_name="Night Stories & Listener Feedback",
                        presenter="Maria Nyasulu",
                        description="Stories from Nsanje communities, listener letters and feedback, and occasional live performances from local artists.",
                        category="Community / Entertainment", language="Chisena", order=i * 20 + 9),
                ]
                slots.extend(day_slots)
            db.add_all(slots)
            db.commit()
            print(f"[OK] {len(slots)} schedule slots seeded across 7 days")

        # ----- Podcasts -----
        if not db.query(models.Podcast).first():
            podcasts = [
                models.Podcast(
                    title="Nyau Oral Histories of the Lower Shire",
                    presenter="Elder Mwamadi Tembo",
                    duration="28 mins",
                    audio_url="https://audio.nyanthepa.mw/podcasts/nyau-oral-histories-ep1.mp3",
                    youtube_url=None,
                    description="Elder Tembo shares stories passed down through generations about the Nyau brotherhood and its role in marking life transitions in Chisena communities. Recorded live at the Nsanje Cultural Centre.",
                    category="Sena Culture & Heritage",
                    broadcast_date="2026-08-10",
                    rights_cleared=True,
                ),
                models.Podcast(
                    title="Safe Water Treatment for Marka & Tengani Villages",
                    presenter="Agnes Phiri with Environmental Health Officers",
                    duration="19 mins",
                    audio_url="https://audio.nyanthepa.mw/podcasts/safe-water-marka-tengani.mp3",
                    youtube_url="https://www.youtube.com/watch?v=placeholder-water-treatment",
                    description="Community health workers explain simple household water treatment methods using chlorine solution, boiling, and solar disinfection — practical for communities without piped water. Chisena language throughout.",
                    category="Community Health & Education",
                    broadcast_date="2026-08-07",
                    rights_cleared=True,
                ),
                models.Podcast(
                    title="Cotton Farming Best Practices — Nsanje 2025/26 Season",
                    presenter="District Agriculture Extension Officer John Banda",
                    duration="35 mins",
                    audio_url="https://audio.nyanthepa.mw/podcasts/cotton-best-practices-2025-26.mp3",
                    youtube_url=None,
                    description="Comprehensive guidance for cotton smallholders in the Nsanje District: planting schedules, fertiliser application, pest management, and how to assess bale quality before taking to the Bangula market.",
                    category="Agriculture & Farming",
                    broadcast_date="2026-07-28",
                    rights_cleared=True,
                ),
                models.Podcast(
                    title="Nyanthepa Youth Speaks — Flood Season and Our Future",
                    presenter="Grace Kalonga (Youth Reporter)",
                    duration="22 mins",
                    audio_url="https://audio.nyanthepa.mw/podcasts/youth-speaks-flood-future.mp3",
                    youtube_url="https://www.youtube.com/watch?v=placeholder-youth-flood",
                    description="Young people from Chiromo, Marka, and Tengani share how seasonal flooding affects their schooling, ambitions, and community life. A Nyanthepa Youth Journalism Project production.",
                    category="Youth & Community Voices",
                    broadcast_date="2026-08-01",
                    rights_cleared=True,
                ),
                models.Podcast(
                    title="Women in Agriculture: Shire Valley Profiles",
                    presenter="Maria Nyasulu",
                    duration="31 mins",
                    audio_url="https://audio.nyanthepa.mw/podcasts/women-agriculture-shire-valley.mp3",
                    youtube_url=None,
                    description="Profiles of three women leading agricultural change in the Lower Shire: a sunflower cooperative leader in Bangula, a fish-farming entrepreneur in Tengani, and a community seed-bank founder near Chiromo.",
                    category="Women & Development",
                    broadcast_date="2026-07-18",
                    rights_cleared=True,
                ),
            ]
            db.add_all(podcasts)
            db.commit()
            print("[OK] Podcasts seeded")

        # ----- League Tables -----
        if not db.query(models.LeagueTable).first():
            leagues = [
                models.LeagueTable(
                    league_key="local_nsanje",
                    league_name="Nsanje District Football League",
                    season="2025/2026",
                    standings_data=[
                        {"pos": 1, "team": "Bango FC", "played": 14, "won": 10, "drawn": 3, "lost": 1, "gd": 18, "points": 33},
                        {"pos": 2, "team": "Bangula Stars", "played": 14, "won": 9, "drawn": 4, "lost": 1, "gd": 15, "points": 31},
                        {"pos": 3, "team": "Tengani Youngsters", "played": 14, "won": 8, "drawn": 2, "lost": 4, "gd": 9, "points": 26},
                        {"pos": 4, "team": "Marka Border United", "played": 14, "won": 7, "drawn": 3, "lost": 4, "gd": 6, "points": 24},
                        {"pos": 5, "team": "Chiromo Riverside FC", "played": 14, "won": 6, "drawn": 3, "lost": 5, "gd": 2, "points": 21},
                        {"pos": 6, "team": "Nsanje Boma Rovers", "played": 14, "won": 5, "drawn": 4, "lost": 5, "gd": -1, "points": 19},
                        {"pos": 7, "team": "Malawi Prisons Nsanje", "played": 14, "won": 4, "drawn": 2, "lost": 8, "gd": -7, "points": 14},
                        {"pos": 8, "team": "Nyachilenda Village XI", "played": 14, "won": 2, "drawn": 1, "lost": 11, "gd": -20, "points": 7},
                        {"pos": 9, "team": "Mbenje Blazers", "played": 14, "won": 1, "drawn": 2, "lost": 11, "gd": -22, "points": 5},
                    ],
                ),
                models.LeagueTable(
                    league_key="fdh_bank_cup",
                    league_name="FDH Bank Cup Premiership",
                    season="2025/2026",
                    standings_data=[
                        {"pos": 1, "team": "Nyasa Big Bullets", "played": 16, "won": 12, "drawn": 3, "lost": 1, "gd": 27, "points": 39},
                        {"pos": 2, "team": "Be Forward Wanderers", "played": 16, "won": 11, "drawn": 3, "lost": 2, "gd": 21, "points": 36},
                        {"pos": 3, "team": "Silver Strikers", "played": 16, "won": 10, "drawn": 2, "lost": 4, "gd": 14, "points": 32},
                        {"pos": 4, "team": "Mighty Mukuru Bullets", "played": 16, "won": 9, "drawn": 3, "lost": 4, "gd": 12, "points": 30},
                        {"pos": 5, "team": "Civil Sporting Club", "played": 16, "won": 8, "drawn": 2, "lost": 6, "gd": 5, "points": 26},
                        {"pos": 6, "team": "Kamuzu Barracks FC", "played": 16, "won": 7, "drawn": 3, "lost": 6, "gd": 3, "points": 24},
                        {"pos": 7, "team": "Ntopwa FC", "played": 16, "won": 6, "drawn": 2, "lost": 8, "gd": -2, "points": 20},
                        {"pos": 8, "team": "Total Big Tigers", "played": 16, "won": 5, "drawn": 3, "lost": 8, "gd": -5, "points": 18},
                        {"pos": 9, "team": "Moyale Barracks", "played": 16, "won": 4, "drawn": 3, "lost": 9, "gd": -10, "points": 15},
                        {"pos": 10, "team": "Blue Eagles", "played": 16, "won": 3, "drawn": 2, "lost": 11, "gd": -15, "points": 11},
                    ],
                ),
                models.LeagueTable(
                    league_key="epl",
                    league_name="English Premier League",
                    season="2025/2026",
                    standings_data=[
                        {"pos": 1, "team": "Manchester City", "played": 3, "won": 3, "drawn": 0, "lost": 0, "gd": 7, "points": 9},
                        {"pos": 2, "team": "Arsenal", "played": 3, "won": 2, "drawn": 1, "lost": 0, "gd": 4, "points": 7},
                        {"pos": 3, "team": "Liverpool", "played": 3, "won": 2, "drawn": 1, "lost": 0, "gd": 3, "points": 7},
                        {"pos": 4, "team": "Chelsea", "played": 3, "won": 2, "drawn": 0, "lost": 1, "gd": 2, "points": 6},
                        {"pos": 5, "team": "Manchester United", "played": 3, "won": 1, "drawn": 1, "lost": 1, "gd": -1, "points": 4},
                        {"pos": 6, "team": "Tottenham Hotspur", "played": 3, "won": 1, "drawn": 1, "lost": 1, "gd": 0, "points": 4},
                        {"pos": 7, "team": "Aston Villa", "played": 3, "won": 1, "drawn": 0, "lost": 2, "gd": -2, "points": 3},
                        {"pos": 8, "team": "Newcastle United", "played": 3, "won": 0, "drawn": 1, "lost": 2, "gd": -3, "points": 1},
                    ],
                ),
            ]
            db.add_all(leagues)
            db.commit()
            print("[OK] League tables seeded")

        # ----- Partners & Donors -----
        if not db.query(models.Partner).first():
            partners = [
                models.Partner(name="Shire Valley Transformation Programme (SVTP)", partner_type="government",
                    description="World Bank and AfDB-funded irrigation and rural development programme covering the Lower Shire valley including Nsanje, Chikwawa, and Blantyre Rural.",
                    active_projects="Rural borehole drilling in Tengani, irrigation canal rehabilitation in Bangula, farmer training centres.", order=1),
                models.Partner(name="UNICEF Malawi", partner_type="ngo",
                    description="United Nations Children's Fund, supporting health outreach, nutrition monitoring, and school feeding programmes across Nsanje District.",
                    active_projects="Under-five mobile health outreach; WASH in Schools at Bangula and Marka Primary; Community-Based Management of Acute Malnutrition (CMAM).", order=2),
                models.Partner(name="Malawi Red Cross Society — Nsanje Branch", partner_type="ngo",
                    description="Disaster preparedness, flood response, and community first aid training across the Lower Shire communities.",
                    active_projects="Flood early warning volunteer network; riverbank community drills; emergency food distribution coordination.", order=3),
                models.Partner(name="FDH Bank Malawi", partner_type="corporate",
                    description="Title sponsor of the FDH Bank Cup — the Malawi national football premiership — and supporter of community radio sports programming.",
                    active_projects="FDH Bank Cup Premiership sponsorship; community sports development fund.", order=4),
                models.Partner(name="Malawi Communications Regulatory Authority (MACRA)", partner_type="government",
                    description="Community broadcasting license authority and regulator ensuring Nyanthepa 107.6 FM operates within the Malawi Communications Act framework.",
                    active_projects="Community broadcasting license renewal; spectrum allocation for 107.6 MHz transmitter.", order=5),
            ]
            db.add_all(partners)
            db.commit()
            print("[OK] Partners seeded")

        # ----- Team Members -----
        if not db.query(models.TeamMember).first():
            team = [
                models.TeamMember(name="Grace Phiri", role="Station Manager", on_air_name=None,
                    bio="Grace has led Nyanthepa Community Radio since 2019. A journalism graduate of the University of Malawi, she oversees editorial standards, community partnerships, and regulatory compliance. She is the primary contact for MACRA and the Media Council of Malawi.", order=1),
                models.TeamMember(name="Chifundo Banda", role="Senior Presenter & Broadcast Director", on_air_name="Chifundo wa Shire",
                    bio="Chifundo has been on air since the station's founding in 2015. He anchors Morning Shire Horizon and is responsible for the on-air training of junior presenters. Fluent Chisena speaker and cultural advocate.", order=2),
                models.TeamMember(name="Maria Nyasulu", role="News Editor & Women's Affairs Correspondent", on_air_name="Maria",
                    bio="Maria covers health, women, and youth development across the Lower Shire. She leads the Women in Agriculture feature series and is the station's UNICEF community reporter liaison.", order=3),
                models.TeamMember(name="Peter Chisale", role="News Anchor & Deputy Editor", on_air_name="Peter Chisale",
                    bio="Peter anchors the Midday Bulletin and Prime News. He joined Nyanthepa from the Malawi Broadcasting Corporation in 2020 and holds a diploma in journalism from Malawi Polytechnic.", order=4),
                models.TeamMember(name="Agnes Phiri", role="Agriculture Correspondent", on_air_name="Aggie",
                    bio="Agnes produces and hosts Ulimi wa Patsogolo, the station's weekday agricultural clinic, working with the Nsanje District Agriculture Office and extension workers across the Lower Shire catchment.", order=5),
                models.TeamMember(name="Grace Kalonga", role="Youth Reporter & Cultural Presenter", on_air_name="Kalonga",
                    bio="Grace leads the Nyanthepa Youth Journalism Project, training young reporters from Nsanje secondary schools to report on issues affecting their communities. She also presents Za Chikhalidwe cha Chisena.", order=6),
            ]
            db.add_all(team)
            db.commit()
            print("[OK] Team members seeded")

        print("\n[DONE] All seed data loaded successfully.")
        print("   Manager login: manager@nyanthepa.mw / Nyanthepa@2026!")
        print("   Editor login:  editor@nyanthepa.mw  / Editor@1076")

    finally:
        db.close()

if __name__ == "__main__":
    seed()
