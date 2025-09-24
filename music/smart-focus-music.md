# Smart Focus Music Automation

## 🎯 Purpose
Automatically switch your Spotify music based on what you're working on, detected from your Chrome tabs.

## 🔧 How It Works
1. Scans your active Chrome tabs
2. Detects work context (coding, reading, meetings, etc.)
3. Automatically switches to appropriate playlists
4. Learns your preferences over time

## 📋 Prerequisites
- Spotify running on your Mac
- Chrome browser with tabs open
- MCP connections: Spotify, Chrome Control

## ⚙️ Setup

### 1. Configure Your Playlists
Edit `configs/music-contexts.json` with your Spotify playlist URIs:

```json
{
  "coding": {
    "playlist_uri": "spotify:playlist:YOUR_CODING_PLAYLIST_ID",
    "volume": 60,
    "keywords": ["github", "stackoverflow", "dev", "code", "programming"]
  },
  "focus": {
    "playlist_uri": "spotify:playlist:YOUR_FOCUS_PLAYLIST_ID", 
    "volume": 40,
    "keywords": ["docs", "reading", "research", "learning"]
  },
  "meetings": {
    "playlist_uri": "spotify:playlist:YOUR_AMBIENT_PLAYLIST_ID",
    "volume": 20,
    "keywords": ["zoom", "meet", "teams", "calendar"]
  },
  "creative": {
    "playlist_uri": "spotify:playlist:YOUR_CREATIVE_PLAYLIST_ID",
    "volume": 70,
    "keywords": ["figma", "design", "adobe", "sketch"]
  }
}
```

### 2. Find Your Spotify Playlist URIs
1. Right-click any playlist in Spotify
2. Select "Share" > "Copy Spotify URI"
3. Paste into the config file

## 🚀 Usage

### Quick Commands
```bash
# Start smart music (run once)
"Start smart focus music"

# Check current context
"What's my current work context?"

# Manual override
"Switch to coding music"
"Switch to focus music" 
"Switch to meeting music"

# Stop automation
"Stop smart music"
```

### Automatic Detection
The system automatically detects these contexts:

- **Coding**: GitHub, Stack Overflow, VS Code, dev documentation
- **Focus**: Reading articles, documentation, research
- **Meetings**: Zoom, Google Meet, Teams, Calendar
- **Creative**: Design tools, Figma, Adobe products
- **Default**: Chill/ambient music for general work

## 📊 Learning Features

The system learns your preferences:
- Tracks which music you skip vs. let play
- Adjusts context detection based on your habits  
- Suggests new playlists for different contexts
- Remembers volume preferences by time of day

## 🛠️ Customization

### Adding New Contexts
1. Edit `configs/music-contexts.json`
2. Add new context with keywords and playlist
3. System will auto-detect the new context

### Time-Based Rules
```json
{
  "morning": {
    "start_time": "06:00",
    "end_time": "10:00", 
    "default_context": "energetic",
    "volume_boost": 10
  },
  "focus_time": {
    "start_time": "10:00",
    "end_time": "15:00",
    "default_context": "focus",
    "volume_boost": -10
  }
}
```

### Context Priority
Set which contexts override others:
```json
{
  "priority_order": [
    "meetings",  // Always highest priority
    "coding",
    "creative", 
    "focus",
    "default"
  ]
}
```

## 🔍 Troubleshooting

### Common Issues

**Music doesn't switch automatically**
- Check if Spotify is running
- Verify playlist URIs are correct
- Ensure Chrome tabs are being detected

**Wrong context detected** 
- Add more specific keywords to your contexts
- Check the priority order in config
- Review tab titles being scanned

**Volume issues**
- Adjust volume settings in config
- Check Spotify's own volume control
- Verify system audio settings

### Debug Commands
```bash
# See what tabs are detected
"Show my current tab context"

# Test playlist switching
"Test coding playlist"

# View current config
"Show my music config"

# Reset to defaults
"Reset music automation"
```

## 📈 Analytics

Track your music automation usage:
- Context switches per day
- Most used playlists  
- Productivity patterns
- Music preferences by time/context

## 🔄 Integration with Other Automations

Works seamlessly with:
- **Meeting Music Control**: Auto-pauses during calls
- **Work Session Tracker**: Logs music context with work sessions
- **Focus Mode**: Integrates with distraction blocking

## 📝 Example Scenarios

**Scenario 1: Starting a coding session**
1. You open GitHub and VS Code
2. System detects "coding" context
3. Switches to your coding playlist at 60% volume
4. Continues playing until context changes

**Scenario 2: Joining a meeting**
1. You click a Zoom link
2. System immediately detects "meetings" context
3. Switches to ambient music at 20% volume
4. After meeting, returns to previous context

**Scenario 3: Reading documentation**
1. You open React docs and Stack Overflow
2. System detects "focus" context
3. Switches to focus music at 40% volume
4. Learns this is your preferred reading setup

---

## 🎵 Ready to Set Up?

Say: **"Set up smart focus music"** and I'll help you configure your playlists and get started!
