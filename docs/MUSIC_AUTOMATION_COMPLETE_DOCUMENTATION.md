# 🎵 Music Automation System - Complete Documentation

## Overview

The Music Automation System is a comprehensive solution that provides intelligent music control based on work context, real-time track information, pixelated album art generation, and dynamic music visualizations. The system integrates with Spotify Desktop via AppleScript and provides both CLI and web interface access.

## Architecture

``` txt
Music Automation System
├── Core Components
│   ├── smart-music-controller.js     # Main automation logic
│   ├── spotify-integration.js        # Spotify Desktop integration
│   ├── music-visualizer.js           # Real-time visualizations
│   └── music-contexts.json           # Context configuration
├── Web Interface
│   ├── server.js                     # Backend API routes
│   ├── public/app.js                 # Frontend JavaScript
│   ├── public/index.html             # Web UI structure
│   └── public/styles.css              # Styling
└── Configuration
    ├── configs/music-contexts.json   # Context settings
    └── sessions/                     # Generated files
```

## Core Components

### 1. SmartMusicController (`music/smart-music-controller.js`)

**Purpose**: Main controller for intelligent music automation based on work context.

#### Key Features

- **Context Detection**: Analyzes Chrome tabs to determine work context
- **Automatic Playlist Switching**: Changes music based on detected activity
- **Volume Management**: Context-aware volume control
- **Status Tracking**: Monitors current track and automation state

#### Key Methods

```javascript
// Start smart music automation
await controller.startSmartMusic()

// Stop automation
await controller.stopSmartMusic()

// Manual context switch
await controller.manualSwitch('coding')

// Get current status
const status = await controller.getStatus()

// Show current track info
controller.showCurrentTrack()

// Display configuration
controller.showConfig()
```

#### Context Detection Logic

```javascript
async detectContext() {
    // Simulates Chrome tab analysis
    const simulatedTabs = [
        'github.com/...', 'docs.google.com/...', 'mail.google.com/...'
    ];
    
    const tabText = simulatedTabs.join(' ').toLowerCase();
    const priorities = ['meetings', 'coding', 'creative', 'focus', 'default'];
    
    for (const context of priorities) {
        const keywords = this.config[context].keywords;
        if (keywords.some(keyword => tabText.includes(keyword))) {
            return context;
        }
    }
    return 'default';
}
```

#### Context Priority Order

1. **Meetings** (highest priority) - Keywords: zoom, meet, teams, calendar, call, webex
2. **Coding** - Keywords: github, stackoverflow, dev, code, programming, vscode, cursor, terminal
3. **Creative** - Keywords: figma, design, adobe, sketch, photoshop, canva
4. **Focus** - Keywords: docs, reading, research, learning, documentation, tutorial, medium
5. **Default** (lowest priority) - General work music

### 2. SpotifyIntegration (`music/spotify-integration.js`)

**Purpose**: Handles direct Spotify Desktop app control via AppleScript on macOS.

 Key Features

- **Track Information**: Gets current track, artist, album, volume, duration, position
- **Album Art Processing**: Fetches real album art and creates pixelated versions
- **Playlist Control**: Plays specific playlists and manages playback
- **Volume Control**: Sets Spotify volume levels
- **Playback Control**: Pause, resume, and playlist switching

 Key Methods

```javascript
// Get current track with full details
const trackInfo = await spotify.getCurrentTrack()

// Get pixelated album art
const albumArt = await spotify.getAlbumArt(trackName, artistName, albumName)

// Play specific playlist
await spotify.playPlaylist(playlistUri)

// Set volume
await spotify.setVolume(volume)

// Control playback
await spotify.pauseMusic()
await spotify.resumeMusic()

// Switch to context
await spotify.switchToContext(context)
```

#### Track Information Structure

```javascript
{
    track: "Song Name - Artist Name",
    trackName: "Song Name",
    artist: "Artist Name", 
    album: "Album Name",
    volume: 60,
    duration: 240000, // milliseconds
    position: 120000,  // milliseconds
    albumArt: {
        url: "data:image/svg+xml;base64...", // Pixelated version
        originalUrl: "https://...",          // Original Spotify URL
        placeholder: false,                  // Whether it's real or generated
        track: "Song Name",
        artist: "Artist Name",
        album: "Album Name"
    }
}
```

#### Album Art Processing

**Real Album Art with Pixelation** (`createPixelatedArtWithColors`):

- Fetches actual album art URL from Spotify
- Embeds image in SVG with pixelation filters
- Preserves original colors while applying super compression
- Adds pixelated text overlays and corner accents
- Uses SVG filters: `feMorphology`, `feGaussianBlur`, `feColorMatrix`, `feComponentTransfer`

**Generated Album Art** (`createPixelatedArt`):

- Creates abstract pixelated art when real art unavailable
- Uses track metadata to generate consistent colors
- Large pixel blocks (8x8) for super compression effect
- Multiple SVG filters for pixelation
- Track info overlay with pixelated styling

#### AppleScript Integration

```javascript
// Example: Get current track
const script = `
    tell application "Spotify"
        if player state is playing then
            set currentTrack to name of current track
            set currentArtist to artist of current track
            set currentAlbum to album of current track
            set currentVolume to sound volume
            set trackDuration to duration of current track
            set trackPosition to player position
            return currentTrack & "|" & currentArtist & "|" & currentAlbum & "|" & currentVolume & "|" & trackDuration & "|" & trackPosition
        else
            return "No track playing"
        end if
    end tell
`;
```

### 3. MusicVisualizer (`web-interface/music-visualizer.js`)

**Purpose**: Creates real-time animated SVG visualizations based on music data.

 Key Features

- **Dynamic Color Generation**: Mood-based color palettes
- **Tempo Analysis**: Infers BPM from track metadata
- **Mood Detection**: Analyzes track/artist names for emotional context
- **Audio Bar Visualization**: Dancing bars synchronized to music beat
- **Frequency Simulation**: Different animation patterns for bass/mid/treble

 Key Methods

```javascript
// Start visualization with track data
const visualization = await visualizer.startVisualization(trackData)

// Stop visualization
visualizer.stopVisualization()

// Get current visualization data
const data = visualizer.getVisualizationData()
```

#### Visualization Data Structure

```javascript
{
    track: "Song Name",
    artist: "Artist Name", 
    album: "Album Name",
    colors: ["hsl(120, 80%, 60%)", "hsl(240, 70%, 50%)", ...],
    patterns: ["pulse", "wave", "spiral"],
    intensity: 0.8,
    tempo: 120,
    mood: "energetic"
}
```

#### Mood Detection Logic

```javascript
analyzeMood(trackData) {
    const text = (trackData.trackName + ' ' + trackData.artist).toLowerCase();
    
    if (text.includes('happy') || text.includes('joy')) return 'happy';
    if (text.includes('sad') || text.includes('cry')) return 'melancholic';
    if (text.includes('angry') || text.includes('rage')) return 'aggressive';
    if (text.includes('love') || text.includes('heart')) return 'romantic';
    if (text.includes('party') || text.includes('dance')) return 'energetic';
    return 'neutral';
}
```

#### Tempo Analysis

```javascript
analyzeTempo(trackData) {
    const text = (trackData.trackName + ' ' + trackData.artist).toLowerCase();
    
    if (text.includes('fast') || text.includes('speed')) return 140;
    if (text.includes('slow') || text.includes('ballad')) return 80;
    if (text.includes('dance') || text.includes('electronic')) return 120;
    return 100; // Default tempo
}
```

#### Dynamic Color Generation

```javascript
generateDynamicColors(trackData, mood, intensity) {
    const moodPalettes = {
        'energetic': ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'],
        'romantic': ['#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFC9', '#BAE1FF'],
        'melancholic': ['#6C5CE7', '#A29BFE', '#74B9FF', '#81ECEC', '#FDCB6E'],
        'aggressive': ['#E17055', '#FDCB6E', '#6C5CE7', '#A29BFE', '#74B9FF'],
        'happy': ['#00B894', '#00CEC9', '#6C5CE7', '#A29BFE', '#FDCB6E'],
        'calm': ['#74B9FF', '#81ECEC', '#A29BFE', '#6C5CE7', '#FDCB6E']
    };
    
    // Generate HSL colors with intensity-based saturation and lightness
    // Create variations based on track hash for consistency
}
```

#### Audio Bar Visualization

- **32 vertical bars** representing different frequency ranges
- **Beat-synchronized animations** with different durations for each bar
- **Frequency simulation**: Bass (slower), Mid (moderate), Treble (faster)
- **Staggered delays** to create wave-like dancing effect
- **Height and opacity animations** synchronized to music tempo

```javascript
generateAudioBars(barCount, barWidth, barHeights, colors, beatDuration) {
    // Creates SVG rect elements with animated properties
    // Each bar has different animation patterns based on frequency range
    // Bass bars: slower, larger height variations
    // Treble bars: faster, smaller height variations
    // Mid bars: moderate speed and variation
}
```

### 4. Configuration (`configs/music-contexts.json`)

**Purpose**: Defines music contexts, playlists, volumes, and detection keywords.

#### Structure

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

## Web Interface Integration

### Backend API Routes (`web-interface/server.js`)

#### Music API Endpoints

```javascript
// Get music status
GET /api/music/status

// Start music automation
POST /api/music/start

// Stop music automation  
POST /api/music/stop

// Switch music context
POST /api/music/switch/:context

// Visualizer endpoints
POST /api/music/visualizer/start
POST /api/music/visualizer/stop
GET /api/music/visualizer/status
```

#### Music Status Response

```javascript
{
  "isRunning": true,
  "currentContext": "coding",
  "currentTrack": {
    "track": "Song Name - Artist Name",
    "trackName": "Song Name",
    "artist": "Artist Name",
    "album": "Album Name", 
    "volume": 60,
    "duration": 240000,
    "position": 120000,
    "albumArt": {
      "url": "data:image/svg+xml;base64...",
      "originalUrl": "https://...",
      "placeholder": false
    }
  },
  "spotifyRunning": true,
  "lastUpdate": "2024-01-15T10:30:00.000Z",
  "availableContexts": ["coding", "focus", "meetings", "creative", "default"]
}
```

### Frontend Integration (`web-interface/public/app.js`)

#### Music Control Functions

```javascript
// Start/stop music automation
async startMusic()
async stopMusic()

// Switch music context
async switchMusicContext(context)

// Visualizer control
async autoStartVisualizer(trackData)
async startVisualizer()
async stopVisualizer()

// Update music status display
updateMusicStatus(status)

// Update visualizer display
updateVisualizerDisplay(visualization, isActive)
```

#### Auto-Start Visualizer Logic

```javascript
loadMusicData() {
    if (this.systemStatus && this.systemStatus.automations.music) {
        this.updateMusicStatus(this.systemStatus.automations.music);
        
        // Auto-start visualizer if we have track data
        if (this.systemStatus.automations.music.currentTrack && 
            !this.systemStatus.automations.music.currentTrack.error) {
            this.autoStartVisualizer(this.systemStatus.automations.music.currentTrack);
        }
    }
    
    // Start periodic track updates
    this.startMusicTrackUpdates();
}
```

#### Periodic Updates

```javascript
startMusicTrackUpdates() {
    // Update music track every 10 seconds
    this.musicUpdateInterval = setInterval(async () => {
        if (this.currentSection === 'music' || this.currentSection === 'dashboard') {
            try {
                const response = await fetch('/api/status');
                const status = await response.json();
                if (status.automations.music) {
                    this.updateMusicStatus(status.automations.music);
                }
            } catch (error) {
                console.error('Failed to update music status:', error);
            }
        }
    }, 10000);
}
```

## CLI Interface

### SmartMusicController CLI Commands

```bash
# Start smart music automation
node music/smart-music-controller.js start

# Stop automation
node music/smart-music-controller.js stop

# Manual context switch
node music/smart-music-controller.js switch coding

# Show current status
node music/smart-music-controller.js status

# Display configuration
node music/smart-music-controller.js config
```

### SpotifyIntegration CLI Commands

```bash
# Show current track details
node music/spotify-integration.js status

# List playlists
node music/spotify-integration.js playlists

# Switch to context
node music/spotify-integration.js switch coding

# Control playback
node music/spotify-integration.js pause
node music/spotify-integration.js resume

# Set volume
node music/spotify-integration.js volume 60

# Show pixelated album art
node music/spotify-integration.js art
```

## Key Features Deep Dive

### 1. Context Detection System

**Location**: `music/smart-music-controller.js` - `detectContext()` method

**Logic**:

- Simulates Chrome tab analysis (currently uses hardcoded tabs)
- Matches tab URLs/titles against context keywords
- Returns highest priority matching context
- Falls back to 'default' if no matches

**Priority Order**:

1. Meetings (zoom, meet, teams, calendar, call, webex)
2. Coding (github, stackoverflow, dev, code, programming, vscode, cursor, terminal)
3. Creative (figma, design, adobe, sketch, photoshop, canva)
4. Focus (docs, reading, research, learning, documentation, tutorial, medium)
5. Default (no specific keywords)

### 2. Album Art Processing System

**Location**: `music/spotify-integration.js` - `getAlbumArt()` method

**Two Processing Paths**:

**Path 1 - Real Album Art** (`createPixelatedArtWithColors`):

- Fetches actual album art URL from Spotify via AppleScript
- Embeds image in SVG with pixelation filters
- Preserves original colors while applying super compression
- Adds pixelated text overlays and corner accents
- Uses multiple SVG filters for maximum pixelation effect

**Path 2 - Generated Art** (`createPixelatedArt`):

- Creates abstract pixelated art when real art unavailable
- Uses track metadata hash for consistent colors
- Large pixel blocks (8x8) for super compression effect
- Multiple SVG filters: `feMorphology`, `feGaussianBlur`, `feColorMatrix`, `feComponentTransfer`

**CSS Pixelation Properties**:

```css
.album-art-image {
    image-rendering: pixelated;
    image-rendering: -moz-crisp-edges;
    image-rendering: crisp-edges;
    image-rendering: optimizeSpeed;
    image-rendering: -webkit-optimize-contrast;
    image-rendering: optimize-contrast;
    filter: contrast(1.8) saturate(0.6) brightness(1.2) sepia(0.1);
}
```

### 3. Music Visualizer System

**Location**: `web-interface/music-visualizer.js`

**Visualization Generation Process**:

1. **Track Analysis** (`analyzeTrack`):
   - Extracts colors from album art if available
   - Generates dynamic colors based on mood and intensity
   - Analyzes tempo from track/artist names
   - Detects mood from keywords
   - Calculates intensity based on mood

2. **Audio Bar Generation** (`generateAudioBars`):
   - Creates 32 vertical bars representing frequency ranges
   - Each bar has different animation patterns:
     - Bass bars (0-20%): Slower, larger height variations
     - Mid bars (20-60%): Moderate speed and variation
     - Treble bars (60-100%): Faster, smaller variations
   - Staggered animation delays create wave effect
   - Beat-synchronized timing based on detected tempo

3. **Animation Synchronization**:
   - Beat duration calculated from tempo: `60000 / tempo`
   - Different animation durations for each frequency range
   - Height, opacity, and position animations
   - Continuous loop with `repeatCount="indefinite"`

**SVG Structure**:

```xml
<svg width="400" height="300">
    <defs>
        <linearGradient id="bgGradient">...</linearGradient>
        <filter id="barGlow">...</filter>
    </defs>
    
    <!-- Background gradient -->
    <rect width="400" height="300" fill="url(#bgGradient)"/>
    
    <!-- Audio bars with animations -->
    <g transform="translate(200, 150)">
        <rect x="..." y="..." width="8" height="..." fill="..." filter="url(#barGlow)">
            <animate attributeName="height" values="..." dur="..." repeatCount="indefinite"/>
            <animate attributeName="opacity" values="..." dur="..." repeatCount="indefinite"/>
            <animate attributeName="y" values="..." dur="..." repeatCount="indefinite"/>
        </rect>
        <!-- ... more bars ... -->
    </g>
    
    <!-- Track info overlay -->
    <rect x="10" y="10" width="380" height="60" fill="rgba(0,0,0,0.8)" rx="5"/>
    <text x="20" y="30" fill="white">Track Name</text>
    <text x="20" y="45" fill="...">Artist Name</text>
    <text x="20" y="60" fill="...">MOOD • BPM • AUDIO VISUALIZER</text>
</svg>
```

### 4. Web Interface Integration

**Location**: `web-interface/public/app.js`

**Auto-Start Visualizer Logic**:

```javascript
loadMusicData() {
    // Auto-start visualizer when music data is available
    if (this.systemStatus.automations.music.currentTrack && 
        !this.systemStatus.automations.music.currentTrack.error) {
        this.autoStartVisualizer(this.systemStatus.automations.music.currentTrack);
    }
}

updateMusicStatus(status) {
    // Auto-restart visualizer with new track data
    if (status.currentTrack && !status.currentTrack.error) {
        this.autoStartVisualizer(status.currentTrack);
    }
}
```

**Periodic Updates**:

- Updates music status every 10 seconds
- Only runs when music or dashboard section is active
- Automatically restarts visualizer with new track data
- Handles errors gracefully

**Visualizer Display Management**:

```javascript
updateVisualizerDisplay(visualization, isActive) {
    if (isActive && visualization) {
        // Show animated SVG visualization
        container.innerHTML = `<img src="${visualization}" alt="Music Visualization" class="visualizer-image">`;
        container.parentElement.classList.add('visualizer-active');
    } else {
        // Show placeholder
        container.innerHTML = `<div class="visualizer-placeholder">...</div>`;
        container.parentElement.classList.remove('visualizer-active');
    }
}
```

## File Locations Summary

### Core Logic Files

- **`music/smart-music-controller.js`** - Main automation controller
- **`music/spotify-integration.js`** - Spotify Desktop integration
- **`web-interface/music-visualizer.js`** - Real-time visualizations
- **`configs/music-contexts.json`** - Context configuration

### Web Interface Files

- **`web-interface/server.js`** - Backend API routes (lines ~200-300 for music routes)
- **`web-interface/public/app.js`** - Frontend JavaScript (lines ~220-1750 for music functions)
- **`web-interface/public/index.html`** - Web UI structure (music section around line 200)
- **`web-interface/public/styles.css`** - Styling (music styles around line 800)

### Generated Files

- **`sessions/current-album-art.svg`** - Current pixelated album art
- **`sessions/original-album-art.jpg`** - Original album art (when available)
- **`sessions/album-art-preview.html`** - Standalone album art preview

## Usage Examples

### Starting Music Automation

```bash
# CLI
node music/smart-music-controller.js start

# Web Interface
# Navigate to Music section, click "Start Smart Music"
```

### Manual Context Switch

```bash
# CLI
node music/smart-music-controller.js switch coding

# Web Interface  
# Use context buttons in Music section
```

### Getting Track Information

```bash
# CLI - Detailed track info
node music/spotify-integration.js status

# CLI - Album art only
node music/spotify-integration.js art

# Web Interface
# Track info displayed automatically in Music section
```

### Visualizer Control

```bash
# Web Interface only
# Auto-starts when track data is available
# Manual control via "Stop Visualizer" button
```

## Troubleshooting

### Common Issues

1. **Spotify Not Running**:
   - Error: "Spotify is not running"
   - Solution: Start Spotify Desktop app

2. **Playlist URI Not Configured**:
   - Error: "Please configure playlist URI for [context]"
   - Solution: Update `configs/music-contexts.json` with real playlist URIs

3. **Visualizer Not Starting**:
   - Check: Track data is available and valid
   - Check: Web interface is connected to backend
   - Check: Browser console for errors

4. **Album Art Not Loading**:
   - Check: Spotify is playing a track
   - Check: Internet connection for fetching album art
   - Fallback: Generated pixelated art will be used

### Debug Commands

```bash
# Check Spotify status
node music/spotify-integration.js status

# Check music controller status  
node music/smart-music-controller.js status

# Test album art generation
node music/spotify-integration.js art

# Check web interface connection
# Open browser dev tools, check Network tab for API calls
```

## Future Enhancement Opportunities

1. **Real Chrome Tab Integration**: Replace simulated tab detection with actual Chrome MCP integration
2. **Advanced Visualizations**: Add more visualization types (waveforms, spectrograms, particle systems)
3. **Music Analysis**: Integrate with music analysis APIs for more accurate tempo/mood detection
4. **Custom Visualizations**: Allow users to create custom visualization patterns
5. **Multi-Platform Support**: Extend beyond macOS Spotify Desktop to other platforms
6. **Voice Control**: Add voice commands for music control
7. **Smart Playlists**: Generate playlists based on work patterns and preferences

This documentation provides a complete overview of the music automation system, including all features, file locations, and implementation details for future development and maintenance.
