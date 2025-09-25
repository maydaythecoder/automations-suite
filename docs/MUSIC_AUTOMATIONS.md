# 🎵 Music Automations Documentation

## Overview

The Music Automations module provides intelligent music control based on your work context. It automatically detects what you're working on from your Chrome tabs and switches Spotify music accordingly.

## Features

- **Smart Context Detection**: Automatically detects coding, focus, meetings, creative work
- **Spotify Integration**: Direct control of Spotify Desktop app via AppleScript
- **Volume Management**: Context-aware volume control
- **Playlist Management**: Automatic playlist switching
- **Meeting Control**: Auto-pause during video calls

## Architecture

```
Music Automations
├── smart-music-controller.js    # Main controller
├── spotify-integration.js       # Spotify API integration
├── music-contexts.json          # Context configuration
└── output/                      # Logs and analytics
```

## Components

### SmartMusicController

Main controller for music automation logic.

**File**: `music/smart-music-controller.js`

#### Key Methods

```javascript
// Start smart music automation
await controller.startSmartMusic()

// Stop automation
await controller.stopSmartMusic()

// Manual context switch
await controller.manualSwitch('coding')

// Show current status
controller.showStatus()

// Display configuration
controller.showConfig()
```

#### Context Detection

The controller detects work context by analyzing Chrome tab URLs and titles:

```javascript
async detectContext() {
    // Scans active Chrome tabs
    // Matches against configured keywords
    // Returns context: 'coding', 'focus', 'meetings', 'creative', 'default'
}
```

**Context Priority Order**:
1. Meetings (highest priority)
2. Coding
3. Creative
4. Focus
5. Default (lowest priority)

### SpotifyIntegration

Handles direct Spotify Desktop app control via AppleScript.

**File**: `music/spotify-integration.js`

#### Key Methods

```javascript
// Get current track info
await spotify.getCurrentTrack()

// Play specific playlist
await spotify.playPlaylist(playlistUri)

// Set volume
await spotify.setVolume(60)

// Pause/resume music
await spotify.pauseMusic()
await spotify.resumeMusic()

// Get user playlists
await spotify.getPlaylists()
```

#### AppleScript Integration

The integration uses AppleScript to control Spotify:

```applescript
tell application "Spotify"
    play track "spotify:playlist:PLAYLIST_ID"
    set sound volume to 60
end tell
```

## Configuration

### Music Contexts

Edit `configs/music-contexts.json`:

```json
{
  "coding": {
    "playlist_uri": "spotify:playlist:37i9dQZF1DXcBWIGoYBM5M",
    "volume": 60,
    "keywords": ["github", "stackoverflow", "dev", "code", "programming", "vscode", "cursor", "terminal"],
    "description": "Upbeat music for coding sessions"
  },
  "focus": {
    "playlist_uri": "spotify:playlist:37i9dQZF1DX4WY4goJ5hcy",
    "volume": 40,
    "keywords": ["docs", "reading", "research", "learning", "documentation", "tutorial", "medium"],
    "description": "Ambient music for deep focus and reading"
  },
  "meetings": {
    "playlist_uri": "spotify:playlist:37i9dQZF1DX4sWSpwq3LiO",
    "volume": 20,
    "keywords": ["zoom", "meet", "teams", "calendar", "call", "webex"],
    "description": "Very quiet ambient music for meetings"
  },
  "creative": {
    "playlist_uri": "spotify:playlist:37i9dQZF1DX4JAvHpjipBk",
    "volume": 70,
    "keywords": ["figma", "design", "adobe", "sketch", "photoshop", "canva"],
    "description": "Inspiring music for creative work"
  },
  "default": {
    "playlist_uri": "spotify:playlist:37i9dQZF1DXcBWIGoYBM5M",
    "volume": 50,
    "keywords": [],
    "description": "General work music"
  }
}
```

### Finding Spotify Playlist URIs

**Method 1: Spotify Desktop App**
1. Right-click on playlist
2. Select "Share" → "Copy Spotify URI"
3. Format: `spotify:playlist:37i9dQZF1DXcBWIGoYBM5M`

**Method 2: Spotify Web**
1. Go to open.spotify.com
2. Find your playlist
3. Click "..." → "Share" → "Copy link to playlist"
4. Extract ID from URL: `https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M`
5. Convert to URI: `spotify:playlist:37i9dQZF1DXcBWIGoYBM5M`

## Usage

### Command Line Interface

```bash
# Start smart music automation
node music/smart-music-controller.js start

# Stop automation
node music/smart-music-controller.js stop

# Manual context switch
node music/smart-music-controller.js switch coding
node music/smart-music-controller.js switch focus
node music/smart-music-controller.js switch meetings
node music/smart-music-controller.js switch creative

# Show status
node music/smart-music-controller.js status

# Show configuration
node music/smart-music-controller.js config
```

### Natural Language Commands

```bash
# Via automation controller
node automation-controller.js "Start smart focus music"
node automation-controller.js "Switch to coding music"
node automation-controller.js "Stop smart music"
```

### Programmatic Usage

```javascript
const SmartMusicController = require('./music/smart-music-controller');

const controller = new SmartMusicController();

// Start automation
await controller.startSmartMusic();

// Manual switch
await controller.manualSwitch('coding');

// Check status
controller.showStatus();
```

## Context Detection Logic

### Keyword Matching

The system matches tab URLs and titles against configured keywords:

```javascript
const contextKeywords = {
    coding: ['github', 'stackoverflow', 'dev', 'code', 'programming', 'vscode', 'cursor', 'terminal'],
    focus: ['docs', 'reading', 'research', 'learning', 'documentation', 'tutorial', 'medium'],
    meetings: ['zoom', 'meet', 'teams', 'calendar', 'call', 'webex'],
    creative: ['figma', 'design', 'adobe', 'sketch', 'photoshop', 'canva']
};
```

### Detection Process

1. **Scan Chrome Tabs**: Get all open Chrome tabs
2. **Extract Content**: URLs and titles
3. **Keyword Matching**: Match against context keywords
4. **Priority Resolution**: Apply priority order
5. **Context Switch**: Change music if context changed

### Example Detection

**Coding Context Triggered By**:
- `github.com/username/repo`
- `stackoverflow.com/questions`
- `localhost:3000`
- `vscode://file/path`
- Tab title containing "code", "dev", "programming"

**Focus Context Triggered By**:
- `docs.google.com/document`
- `medium.com/article`
- `dev.to/post`
- Tab title containing "reading", "learning", "tutorial"

**Meeting Context Triggered By**:
- `zoom.us/j/meeting-id`
- `meet.google.com/meeting`
- `teams.microsoft.com/call`
- Tab title containing "meeting", "call", "conference"

## Spotify Integration Details

### AppleScript Commands

**Play Playlist**:
```applescript
tell application "Spotify"
    play track "spotify:playlist:PLAYLIST_ID"
end tell
```

**Set Volume**:
```applescript
tell application "Spotify"
    set sound volume to 60
end tell
```

**Get Current Track**:
```applescript
tell application "Spotify"
    if player state is playing then
        set currentTrack to name of current track
        set currentArtist to artist of current track
        set currentVolume to sound volume
        return currentTrack & " - " & currentArtist & " (Volume: " & currentVolume & "%)"
    else
        return "No track playing"
    end if
end tell
```

**Pause/Resume**:
```applescript
tell application "Spotify"
    pause
end tell

tell application "Spotify"
    play
end tell
```

### Error Handling

The integration includes robust error handling:

```javascript
try {
    const result = execSync(`osascript -e '${script}'`, { encoding: 'utf8' });
    return { success: true, data: result };
} catch (error) {
    return { error: error.message };
}
```

**Common Errors**:
- Spotify not running
- Invalid playlist URI
- AppleScript permissions denied
- Network connectivity issues

## Analytics and Learning

### Usage Tracking

The system tracks:
- Context switches per day
- Most used playlists
- Productivity patterns
- Music preferences by time/context

### Learning Features

- **Preference Learning**: Adapts to your music choices
- **Context Refinement**: Improves context detection over time
- **Volume Optimization**: Learns optimal volumes for different contexts
- **Playlist Suggestions**: Recommends new playlists based on usage

## Troubleshooting

### Common Issues

#### Music Doesn't Switch Automatically

**Symptoms**: Music stays on same playlist despite context changes

**Solutions**:
1. Check if Spotify is running
2. Verify playlist URIs in configuration
3. Ensure AppleScript permissions are granted
4. Test context detection: `node music/smart-music-controller.js status`

#### Wrong Context Detected

**Symptoms**: Music switches to wrong context

**Solutions**:
1. Add more specific keywords to contexts
2. Check priority order in configuration
3. Review tab titles being scanned
4. Use manual override: `node music/smart-music-controller.js switch [context]`

#### Volume Issues

**Symptoms**: Volume doesn't change or changes incorrectly

**Solutions**:
1. Adjust volume settings in configuration
2. Check Spotify's own volume control
3. Verify system audio settings
4. Test volume control: `node music/spotify-integration.js volume 50`

#### AppleScript Permission Errors

**Symptoms**: "Permission denied" or "Not authorized" errors

**Solutions**:
1. System Preferences → Security & Privacy → Privacy
2. Select "Accessibility" from left sidebar
3. Add Terminal, VS Code, and other apps
4. Restart applications after granting permissions

### Debug Commands

```bash
# Test context detection
node music/smart-music-controller.js status

# Test playlist switching
node music/spotify-integration.js switch coding

# Test volume control
node music/spotify-integration.js volume 60

# View current track
node music/spotify-integration.js status

# List playlists
node music/spotify-integration.js playlists
```

### Log Files

Check log files in `music/output/` directory:
- `music-controller.log` - Controller activity
- `spotify-integration.log` - Spotify API calls
- `context-detection.log` - Context detection events

## Integration with Other Automations

### Work Session Manager

Music automation integrates with work sessions:
- Starts automatically when work session begins
- Switches context based on session type
- Pauses during breaks
- Resumes after breaks

### Tab Manager

Coordinates with tab management:
- Context detection uses tab analysis
- Tab changes trigger music switches
- Session saving includes music context

### Meeting Detection

Automatic meeting detection:
- Monitors for meeting URLs
- Immediately switches to meeting context
- Pauses or reduces volume
- Resumes previous context after meeting

## Performance Considerations

### Optimization Tips

1. **Reduce Check Frequency**: Default 30-second intervals
2. **Cache Tab Data**: Avoid repeated Chrome queries
3. **Batch Operations**: Group multiple Spotify commands
4. **Error Recovery**: Graceful handling of Spotify issues

### Resource Usage

- **CPU**: Minimal impact (< 1%)
- **Memory**: ~10MB for controller
- **Network**: Only for Spotify API calls
- **Disk**: Log files (~1MB/day)

## Future Enhancements

### Planned Features

1. **Multiple Music Services**: Support for Apple Music, YouTube Music
2. **Advanced Context Detection**: Machine learning-based detection
3. **Custom Playlist Generation**: AI-generated playlists
4. **Team Integration**: Shared music contexts for teams
5. **Mobile Integration**: Control mobile Spotify app

### API Improvements

1. **REST API**: HTTP endpoints for external control
2. **WebSocket**: Real-time updates
3. **Plugin System**: Third-party integrations
4. **Configuration UI**: Web-based configuration interface

---

**Music automation is ready to enhance your productivity!** 🎵

Start with `node automation-controller.js "Start smart focus music"` and let the music adapt to your work!