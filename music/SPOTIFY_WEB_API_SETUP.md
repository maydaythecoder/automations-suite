# Spotify Web API Integration Setup

## Overview

This is a **real** Spotify integration using the official Spotify Web API. It replaces the flawed AppleScript-based approach with a secure, cross-platform solution.

## Key Features

- ✅ **Real Spotify Web API** - Uses official API, not AppleScript
- ✅ **Cross-platform** - Works on macOS, Windows, Linux
- ✅ **OAuth2 PKCE Authentication** - Secure token management
- ✅ **Device Control** - Control any Spotify device
- ✅ **Real Metadata** - Actual album art, track info, playlists
- ✅ **Search & Discovery** - Find tracks, playlists, artists
- ✅ **Playback Control** - Play, pause, skip, volume, shuffle, repeat
- ✅ **Error Handling** - Comprehensive retry logic and error recovery
- ✅ **Security** - Input validation, secure token storage

## Setup Instructions

### 1. Install Dependencies

```bash
cd music
npm install
```

### 2. Create Spotify App

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Click "Create App"
3. Fill in:
   - **App Name**: `Automations Suite Music Controller`
   - **App Description**: `Smart music control for productivity`
   - **Redirect URI**: `http://localhost:8888/callback`
4. Note your **Client ID** and **Client Secret**

### 3. Configure Environment

Create `.env` file in the music directory:

```bash
# Spotify Web API Credentials
SPOTIFY_CLIENT_ID=your_client_id_here
SPOTIFY_CLIENT_SECRET=your_client_secret_here
SPOTIFY_REDIRECT_URI=http://localhost:8888/callback
```

### 4. Authenticate

```bash
npm run auth
```

This will:

- Open your browser to Spotify authorization
- Start a local server to receive the callback
- Save tokens securely for future use

### 5. Test the Integration

```bash
# Check status
npm run status

# List devices
node spotify-web-api-integration.js devices

# Search for music
node spotify-web-api-integration.js search "focus music"

# List your playlists
node spotify-web-api-integration.js playlists
```

## Usage Examples

### Basic Playback Control

```javascript
const SpotifyWebIntegration = require('./spotify-web-api-integration.js');

const spotify = new SpotifyWebIntegration({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.SPOTIFY_REDIRECT_URI
});

// Authenticate
await spotify.authenticate();

// Get current track
const currentTrack = await spotify.getCurrentTrack();
console.log('Now playing:', currentTrack.track.name);

// Play a playlist
await spotify.playContext('spotify:playlist:37i9dQZF1DXcBWIGoYBM5M');

// Set volume
await spotify.setVolume(50);

// Search and play
const tracks = await spotify.searchTracks('focus music');
if (tracks.length > 0) {
    await spotify.playTrack(tracks[0].uri);
}
```

### Context Switching

```javascript
// Switch to focus music context
const focusConfig = {
    playlist_uri: 'spotify:playlist:37i9dQZF1DXcBWIGoYBM5M',
    volume: 30,
    shuffle: true,
    repeat: 'context',
    description: 'Deep focus ambient music'
};

const result = await spotify.switchToContext('focus', focusConfig);
console.log('Switched to:', result.context);
```

### Real-time Playback Monitoring

```javascript
// Listen for playback changes
spotify.on('playbackStateChanged', (state) => {
    console.log('Playback changed:', state.item.name);
});

spotify.on('playbackError', (error) => {
    console.error('Playback error:', error.message);
});

// Start monitoring
spotify.startPlaybackPolling(3000); // Check every 3 seconds
```

## API Reference

### Authentication

- `authenticate()` - Start OAuth2 flow
- `refreshTokens()` - Refresh expired tokens
- `disconnect()` - Clear tokens and disconnect

### Playback Control

- `playContext(contextUri, options)` - Play playlist/album
- `playTrack(trackUri, options)` - Play specific track
- `pause()` - Pause playback
- `resume()` - Resume playback
- `skipToNext()` - Skip to next track
- `skipToPrevious()` - Skip to previous track
- `seek(positionMs)` - Seek to position
- `setVolume(volume)` - Set volume (0-100)
- `setShuffle(state)` - Enable/disable shuffle
- `setRepeat(state)` - Set repeat mode (off/track/context)

### Information

- `getCurrentTrack()` - Get current playback info
- `getMyDevices()` - List available devices
- `getCurrentPlaybackState()` - Get full playback state

### Search & Discovery

- `searchTracks(query, options)` - Search for tracks
- `searchPlaylists(query, options)` - Search for playlists
- `getUserPlaylists(options)` - Get user's playlists
- `getPlaylistTracks(playlistId, options)` - Get playlist tracks

### Events

- `playbackStateChanged` - Emitted when playback state changes
- `playbackError` - Emitted on playback errors
- `authenticated` - Emitted after successful authentication
- `tokenRefreshed` - Emitted when tokens are refreshed

## Security Features

### Input Validation

- All user inputs are validated and sanitized
- Volume values clamped to 0-100 range
- Search queries limited to 100 characters
- Repeat states validated against allowed values

### Token Security

- Tokens stored securely in sessions directory
- Automatic token refresh on expiration
- PKCE flow for enhanced security
- No hardcoded credentials

### Error Handling

- Comprehensive error recovery
- Automatic retry on authentication errors
- Graceful fallbacks for network issues
- Detailed error messages for debugging

## Migration from Old Integration

### Replace Old Calls

```javascript
// OLD (AppleScript-based)
const oldSpotify = new SpotifyIntegration();
await oldSpotify.switchToContext('focus');

// NEW (Web API-based)
const newSpotify = new SpotifyWebIntegration();
await newSpotify.authenticate();
await newSpotify.switchToContext('focus', focusConfig);
```

### Configuration Updates

```javascript
// OLD config format
{
    "focus": {
        "playlist_uri": "spotify:playlist:37i9dQZF1DXcBWIGoYBM5M",
        "volume": 30,
        "description": "Focus music"
    }
}

// NEW config format (same structure, but now works cross-platform)
{
    "focus": {
        "playlist_uri": "spotify:playlist:37i9dQZF1DXcBWIGoYBM5M",
        "volume": 30,
        "shuffle": true,
        "repeat": "context",
        "description": "Focus music"
    }
}
```

## Troubleshooting

### Authentication Issues

- Ensure Client ID and Secret are correct
- Check that redirect URI matches exactly
- Verify Spotify app is not in development mode restrictions

### Device Issues

- Make sure Spotify is running on at least one device
- Check that device is active and not in private session
- Verify user has Spotify Premium (required for Web API)

### Network Issues

- Check internet connection
- Verify Spotify API is accessible
- Check firewall settings for localhost:8888

### Token Issues

- Delete `sessions/spotify-tokens.json` and re-authenticate
- Check token expiration and refresh logic
- Verify file permissions for token storage

## Performance Notes

- Tokens are cached locally for performance
- Playback polling can be customized (default 5s)
- Search results are limited to prevent API abuse
- Automatic retry logic prevents temporary failures

## Compliance

This integration follows:

- Spotify Web API Terms of Service
- OAuth2 security best practices
- PKCE authentication standards
- Rate limiting guidelines
- User privacy requirements
