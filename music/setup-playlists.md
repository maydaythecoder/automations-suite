# 🎵 Spotify Playlist Setup Guide

## Quick Setup Steps

### 1. Find Your Spotify Playlist URIs

Method 1: Right-click in Spotify Desktop App

1. Open Spotify desktop app
2. Right-click on any playlist
3. Select "Share" → "Copy Spotify URI"
4. You'll get something like: `spotify:playlist:37i9dQZF1DXcBWIGoYBM5M`

Method 2: From Spotify Web

1. Go to open.spotify.com
2. Find your playlist
3. Click the "..." menu → "Share" → "Copy link to playlist"
4. The URI is in the URL: `https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M`
5. Convert to URI format: `spotify:playlist:37i9dQZF1DXcBWIGoYBM5M`

### 2. Create Your Context Playlists

Based on your music taste (R&B, Hip-Hop, Alternative), here are suggested playlist types:

**🎯 Coding Playlist** (Upbeat, energetic)

- Songs that help you focus while coding
- Examples: Instrumental hip-hop, electronic, upbeat R&B
- Volume: 60% (as configured)

**🧘 Focus Playlist** (Ambient, concentration)

- Songs for reading, learning, deep work
- Examples: Ambient, lo-fi hip-hop, instrumental
- Volume: 40% (as configured)

**🤝 Meeting Playlist** (Very quiet, non-distracting)

- Background music that won't interfere with calls
- Examples: Nature sounds, very quiet ambient
- Volume: 20% (as configured)

**🎨 Creative Playlist** (Inspiring, artistic)

- Music for design, brainstorming, creative work
- Examples: Alternative, indie, inspiring tracks
- Volume: 70% (as configured)

**🏠 Default Playlist** (Your general favorites)

- Your go-to playlist for general work
- Examples: Your favorite R&B, Hip-Hop, Alternative mix
- Volume: 50% (as configured)

### 3. Update Configuration

Once you have your playlist URIs, update `configs/music-contexts.json`:

```json
{
  "coding": {
    "playlist_uri": "spotify:playlist:YOUR_ACTUAL_CODING_PLAYLIST_ID",
    "volume": 60,
    "keywords": ["github", "stackoverflow", "dev", "code", "programming", "vscode", "cursor", "terminal"],
    "description": "Upbeat music for coding sessions"
  },
  "focus": {
    "playlist_uri": "spotify:playlist:YOUR_ACTUAL_FOCUS_PLAYLIST_ID", 
    "volume": 40,
    "keywords": ["docs", "reading", "research", "learning", "documentation", "tutorial", "medium"],
    "description": "Ambient music for deep focus and reading"
  },
  "meetings": {
    "playlist_uri": "spotify:playlist:YOUR_ACTUAL_AMBIENT_PLAYLIST_ID",
    "volume": 20,
    "keywords": ["zoom", "meet", "teams", "calendar", "call", "webex"],
    "description": "Very quiet ambient music for meetings"
  },
  "creative": {
    "playlist_uri": "spotify:playlist:YOUR_ACTUAL_CREATIVE_PLAYLIST_ID",
    "volume": 70,
    "keywords": ["figma", "design", "adobe", "sketch", "photoshop", "canva"],
    "description": "Inspiring music for creative work"
  },
  "default": {
    "playlist_uri": "spotify:playlist:YOUR_ACTUAL_DEFAULT_PLAYLIST_ID",
    "volume": 50,
    "keywords": [],
    "description": "General work music"
  }
}
```

### 4. Test Your Setup

After updating the configuration, test with:

```bash
# Navigate to your automation suite
cd /Users/muhyadinmohamed/automations-suite

# Test the music controller
node music/smart-music-controller.js status
node music/smart-music-controller.js config

# Start smart music
node music/smart-music-controller.js start
```

## 🎯 Your Current Context Detection

Based on your current tabs, the system will detect:

- **Coding Context**: When you have GitHub, VS Code, Cursor, or localhost tabs open
- **Focus Context**: When reading docs, tutorials, or research
- **Meeting Context**: When Zoom, Meet, Teams, or calendar tabs are active
- **Creative Context**: When design tools like Figma are open
- **Default Context**: For general work

## 🚀 Quick Commands

Once set up, you can use these commands:

```bash
# Start smart music automation
"Start smart focus music"

# Manual switches
"Switch to coding music"
"Switch to focus music"
"Switch to meeting music"
"Switch to creative music"

# Check status
"What's my current music context?"

# Stop automation
"Stop smart music"
```

## 🔧 Troubleshooting

**Music doesn't switch automatically:**

- Check if Spotify is running
- Verify playlist URIs are correct
- Ensure the music controller is running

**Wrong context detected:**

- Add more specific keywords to your contexts
- Check the priority order in config
- Review what tabs are being scanned

**Volume issues:**

- Adjust volume settings in config
- Check Spotify's own volume control
- Verify system audio settings

## 📊 Analytics

The system will track:

- Context switches per day
- Most used playlists
- Productivity patterns
- Music preferences by time/context

---

## 🎵 Ready to Set Up?

1. **Create your playlists** in Spotify (or use existing ones)
2. **Get the playlist URIs** using the methods above
3. **Update the config file** with your actual URIs
4. **Test the system** with the commands above

Once configured, your music will automatically adapt to your work context! 🎶
