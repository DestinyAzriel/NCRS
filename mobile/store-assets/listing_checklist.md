# Google Play Store & Pitch Readiness Checklist
## Nyanthepa Community Radio (107.6 FM) — Official Mobile Application

---

### 1. Store Listing Metadata

| Field | Content |
|---|---|
| **App Title** | Nyanthepa Community Radio 107.6 FM |
| **Short Description (80 chars)** | Live radio broadcast, Nsanje news, flood alerts & sports from the Lower Shire. |
| **Full Description** | Official mobile application for Nyanthepa Community Radio (107.6 FM), broadcasting from Nsanje Boma to the communities of Bangula, Tengani, Marka, and Chiromo in the Lower Shire valley, Malawi.<br><br>Features:<br>• **24/7 Live Stream**: Continuous background audio playback with lock-screen controls.<br>• **Shire Valley News**: Local agricultural reporting, flood warnings, and district bulletins.<br>• **Broadcast Timetable**: Full 7-day program schedule with anchor details.<br>• **Sports Standings**: Live log tables for Nsanje District League and FDH Premiership.<br>• **Podcasts & Oral Histories**: Recorded Sena cultural archives and agricultural clinics.<br>• **Offline Resilience**: Cached articles and schedules for 2G/3G network conditions.<br>• **Accessible Design**: Built-in text scaling and high-contrast display modes. |
| **Package Name** | `mw.nyanthepa.radio` |
| **Default Language** | English (en-GB) / Localized Chisena |
| **Category** | News & Magazines / Music & Audio |
| **Content Rating** | PEGI 3 / Everyone (All ages) |
| **Privacy Policy URL** | `https://nyanthepa.mw/privacy` (Compliant with Data Protection Act 2024) |
| **Developer Contact** | `info@nyanthepa.mw` • Nsanje Boma, Southern Region, Malawi |

---

### 2. App Permissions Declared (Minimal & Clean)

1. `android.permission.INTERNET` — To stream live audio and fetch latest news/schedules.
2. `android.permission.FOREGROUND_SERVICE` & `FOREGROUND_SERVICE_MEDIA_PLAYBACK` — To maintain uninterrupted audio playback when the phone screen is locked or while multitasking.
3. `android.permission.POST_NOTIFICATIONS` — To display lock-screen playback controls and optional breaking flood emergency bulletins.
4. `android.permission.WAKE_LOCK` — To prevent audio stream buffering cut-offs.

---

### 3. Screenshot Delivery Specifications

1. **Screenshot 1 — Live Airwaves**: Showing 107.6 FM live player, active waveform, on-air anchor names, and listener shoutbox.
2. **Screenshot 2 — Shire Valley Dispatches**: Showing Bangula cotton market updates and localized flood safety bulletins.
3. **Screenshot 3 — Monospace Timetable**: Showing the 7-day program schedule grid with anchor names and Chisena tags.
4. **Screenshot 4 — Grassroots Sports Logs**: Showing the Nsanje District League standing table with Bango FC, Bangula Stars, and points breakdown.

---

### 4. Release Keystore & Signing Instructions

To generate the release keystore for submission:
```bash
keytool -genkey -v -keystore nyanthepa-release.jks -keyalg RSA -keysize 2048 -validity 10000 -alias nyanthepa
```
*Store `nyanthepa-release.jks` securely outside source control.*

To compile release builds:
- **Play Store Bundle (AAB)**: `flutter build appbundle --release`
- **Sideloadable Pitch APK**: `flutter build apk --release` (Generates `build/app/outputs/flutter-apk/app-release.apk`)
