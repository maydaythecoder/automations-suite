# Meeting Music Control Automation

## 🎯 Purpose

Automatically pause Spotify when joining video calls and resume when meetings end.

## 🔧 How It Works

1. Monitors Chrome tabs for meeting URLs (Zoom, Teams, Meet, etc.)
2. Detects when you join a call (URL patterns + tab activity)
3. Automatically pauses Spotify or switches to very quiet ambient music
4. Resumes previous music when meeting ends

## 📋 Prerequisites

- Spotify running on your Mac
- Chrome browser for video calls
- MCP connections: Spotify, Chrome Control

## ⚙️ Setup

The automation uses smart detection patterns:

```json
{
  "meeting_patterns": [
    "zoom.us",
    "meet.google.com", 
    "teams.microsoft.com",
    "webex.com",
    "skype.com",
    "whereby.com",
    "jitsi.org"
  ],
  "actions": {
    "on_meeting_start": "pause", // or "quiet_music"
    "on_meeting_end": "resume_previous",
    "quiet_volume": 15,
    "resume_delay_seconds": 5
  }
}
```

## 🚀 Usage

### Automatic Mode (Default)

- System automatically detects meeting joins/leaves
- No manual intervention needed
- Learns your meeting patterns

### Manual Controls

```bash
# Force meeting mode
"Start meeting mode"

# End meeting mode  
"End meeting mode"

# Check if in meeting
"Am I in a meeting?"

# Configure meeting behavior
"Set meeting volume to 10"
"Use quiet music in meetings" 
"Always pause in meetings"
```

## 📊 Meeting Detection

**Smart Detection Features:**

- URL pattern matching
- Tab title analysis ("Zoom Meeting", "Google Meet", etc.)
- Audio activity detection
- Calendar integration (if configured)
- Meeting duration tracking

**Detection Triggers:**

- Clicking meeting links
- Navigating to meeting URLs  
- Tab becoming active with meeting content
- Microphone/camera permissions requested

## 🛠️ Customization

### Meeting Behavior Options

```json
{
  "meeting_actions": {
    "pause_completely": "Stop all music during meetings",
    "quiet_music": "Play very quiet ambient music", 
    "notification_sounds": "Keep notification sounds on",
    "focus_music": "Switch to focus/concentration music"
  }
}
```

### Time-Based Rules

```json
{
  "schedule_rules": {
    "work_hours_only": true,
    "weekend_meetings": "manual_control",
    "after_hours": "quieter_than_usual"
  }
}
```

## 🔍 Analytics

Track your meeting patterns:

- Average meetings per day
- Most used meeting platforms
- Meeting duration statistics  
- Music interruption patterns
- Focus recovery time after meetings

## 🔄 Integration

**Works with other automations:**

- Smart Focus Music (context switching)
- Work Session Tracker (meeting logs)
- Calendar Integration (pre-meeting prep)
- Focus Mode (post-meeting transition)

---

## 🎵 Ready to Set Up?

Say: **"Set up meeting music control"** and I'll configure it based on your meeting patterns!
