# 🎵 Spotify Integration - Complete Overhaul

## 🚨 Critical Security & Architecture Issues Fixed

The previous Spotify integration was **fundamentally flawed** and posed serious security risks. This complete rewrite addresses all critical issues:

### ❌ Previous Issues (FIXED)

- **Platform Lock-in**: AppleScript only worked on macOS
- **Security Vulnerabilities**: Direct shell command injection risks
- **Fake Integration**: Not using Spotify's actual API
- **Poor Error Handling**: Silent failures everywhere
- **Wasteful Resources**: CPU-intensive fake album art generation

### ✅ New Architecture (SECURE)

- **Cross-Platform**: Works on macOS, Windows, Linux
- **Real API Integration**: Uses official Spotify Web API
- **OAuth2 Security**: PKCE authentication flow
- **Input Validation**: All inputs sanitized and validated
- **Real Metadata**: Actual album art, track info, playlists
- **Comprehensive Error Handling**: Retry logic and recovery

## 🔧 Quick Migration

### 1. Run Migration Tool

```bash
cd music
node migrate-spotify.js run
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Spotify App

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create new app with redirect URI: `http://localhost:8888/callback`
3. Copy Client ID and Secret

### 4. Configure Environment

```bash
cp .env.example .env
# Edit .env with your Spotify credentials
```

### 5. Authenticate

```bash
npm run auth
```

### 6. Test Integration

```bash
npm run status
```

## 🎯 New Features

### Real Spotify Web API Integration

```javascript
const SpotifyWebIntegration = require('./spotify-web-api-integration.js');

const spotify = new SpotifyWebIntegration({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.SPOTIFY_REDIRECT_URI
});

// Authenticate once
await spotify.authenticate();

// Real playback control
await spotify.playContext('spotify:playlist:37i9dQZF1DXcBWIGoYBM5M');
await spotify.setVolume(50);
await spotify.setShuffle(true);
```

### Cross-Platform Device Control

```javascript
// Works on any platform with Spotify
const devices = await spotify.getMyDevices();
const activeDevice = devices.find(d => d.is_active);

await spotify.playContext(playlistUri, {
    device_id: activeDevice.id
});
```

### Real Search & Discovery

```javascript
// Search for tracks
const tracks = await spotify.searchTracks('focus music');
const playlists = await spotify.searchPlaylists('ambient');

// Get user's playlists
const userPlaylists = await spotify.getUserPlaylists();
```

### Real-time Playback Monitoring

```javascript
// Listen for playback changes
spotify.on('playbackStateChanged', (state) => {
    console.log('Now playing:', state.item.name);
});

spotify.on('playbackError', (error) => {
    console.error('Playback error:', error.message);
});

// Start monitoring
spotify.startPlaybackPolling(3000);
```

## 🔒 Security Improvements

### Input Validation

```javascript
// SECURITY: All inputs validated
await spotify.setVolume(150); // Clamped to 100
await spotify.searchTracks('<script>alert("xss")</script>'); // Sanitized
await spotify.setRepeat('invalid'); // Validated against allowed values
```

### Secure Token Management

```javascript
// Tokens stored securely, never logged
// Automatic refresh on expiration
// PKCE flow prevents token interception
```

### No Shell Commands

```javascript
// OLD (DANGEROUS):
execSync(`osascript -e 'tell application "Spotify" play track "${userInput}"'`);

// NEW (SECURE):
await spotify.playTrack(validatedTrackUri);
```

## 📊 Performance Improvements

### Efficient API Calls

- Cached tokens (no re-authentication needed)
- Batched requests where possible
- Proper rate limiting
- Automatic retry on failures

### Real Album Art

```javascript
// OLD: CPU-intensive SVG generation
const fakeArt = await createPixelatedArtWithColors(); // 100+ lines of SVG

// NEW: Direct Spotify metadata
const track = await spotify.getCurrentTrack();
const albumArt = track.track.albumArt; // Real Spotify image URL
```

## 🛠️ API Reference

### Authentication

- `authenticate()` - Start OAuth2 PKCE flow
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

## 🔄 Migration Guide

### Configuration Format (Unchanged)

```json
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

### Code Changes

```javascript
// OLD (AppleScript-based)
const oldSpotify = new SpotifyIntegration();
await oldSpotify.switchToContext('focus');

// NEW (Web API-based)
const newSpotify = new SpotifyWebIntegration();
await newSpotify.authenticate();
await newSpotify.switchToContext('focus', focusConfig);
```

### Smart Music Controller

The `SmartMusicController` has been updated to use the new integration:

- Automatic authentication handling
- Real track metadata display
- Cross-platform compatibility
- Better error handling

## 🧪 Testing

### Unit Tests

```bash
npm test
```

### Integration Tests

```bash
# Test authentication
npm run auth

# Test playback
npm run status
node spotify-web-api-integration.js play "spotify:playlist:37i9dQZF1DXcBWIGoYBM5M"

# Test search
node spotify-web-api-integration.js search "focus music"
```

## 📚 Documentation

- [Complete Setup Guide](SPOTIFY_WEB_API_SETUP.md)
- [API Reference](SPOTIFY_WEB_API_SETUP.md#api-reference)
- [Security Features](SPOTIFY_WEB_API_SETUP.md#security-features)
- [Troubleshooting](SPOTIFY_WEB_API_SETUP.md#troubleshooting)

## 🚀 What's Next

This new integration provides a solid foundation for:

- Advanced playlist management
- Collaborative playlists
- Music recommendation systems
- Integration with other productivity tools
- Real-time collaboration features

## ⚠️ Important Notes

1. **Spotify Premium Required**: Web API requires Premium subscription
2. **Rate Limits**: API has rate limits (handled automatically)
3. **Device Requirements**: At least one Spotify device must be active
4. **Network**: Requires internet connection for API calls

## 🆘 Support

If you encounter issues:

1. Check the [troubleshooting guide](SPOTIFY_WEB_API_SETUP.md#troubleshooting)
2. Verify your Spotify Developer App configuration
3. Ensure you have Spotify Premium
4. Check that at least one Spotify device is active

---

**This integration is now production-ready, secure, and cross-platform compatible. The previous AppleScript-based approach has been completely replaced with a proper Web API implementation.**
