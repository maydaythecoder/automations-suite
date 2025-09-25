#!/usr/bin/env node

/**
 * Spotify Integration for Smart Focus Music
 * Handles actual Spotify API calls and playlist management
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class SpotifyIntegration {
    constructor() {
        this.configPath = path.join(__dirname, '../configs/music-contexts.json');
        this.config = this.loadConfig();
        this.isSpotifyRunning = this.checkSpotifyStatus();
    }

    loadConfig() {
        try {
            const configData = fs.readFileSync(this.configPath, 'utf8');
            return JSON.parse(configData);
        } catch (error) {
            console.error('Error loading music config:', error.message);
            return {};
        }
    }

    checkSpotifyStatus() {
        try {
            // Check if Spotify is running on macOS
            const result = execSync('pgrep -f "Spotify"', { encoding: 'utf8' });
            return result.trim().length > 0;
        } catch (error) {
            return false;
        }
    }

    async getCurrentTrack() {
        try {
            if (!this.isSpotifyRunning) {
                return { error: 'Spotify is not running' };
            }

            // Use AppleScript to get current Spotify track on macOS
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

            const result = execSync(`osascript -e '${script}'`, { encoding: 'utf8' });
            const trackData = result.trim();
            
            if (trackData === "No track playing") {
                return { track: trackData };
            }

            const [track, artist, album, volume, duration, position] = trackData.split('|');
            
            return {
                track: `${track} - ${artist}`,
                trackName: track.trim(),
                artist: artist.trim(),
                album: album.trim(),
                volume: parseInt(volume),
                duration: parseInt(duration),
                position: parseInt(position),
                albumArt: await this.getAlbumArt(track.trim(), artist.trim(), album.trim())
            };
        } catch (error) {
            return { error: error.message };
        }
    }

    async getAlbumArt(trackName, artistName, albumName) {
        try {
            // Try to get actual album art from Spotify
            const albumArtUrl = await this.getSpotifyAlbumArt(trackName, artistName, albumName);
            
            if (albumArtUrl) {
                // Create pixelated version with preserved colors
                const pixelatedArt = await this.createPixelatedArtWithColors(trackName, artistName, albumName, albumArtUrl);
                return {
                    url: pixelatedArt,
                    originalUrl: albumArtUrl,
                    placeholder: false,
                    track: trackName,
                    artist: artistName,
                    album: albumName
                };
            } else {
                // Fallback to generated art with track-based colors
                const pixelatedArt = await this.createPixelatedArt(trackName, artistName, albumName);
                return {
                    url: pixelatedArt,
                    placeholder: true,
                    track: trackName,
                    artist: artistName,
                    album: albumName
                };
            }
        } catch (error) {
            return { error: error.message };
        }
    }

    async getSpotifyAlbumArt(trackName, artistName, albumName) {
        try {
            // Use AppleScript to get album art URL from Spotify
            const script = `
                tell application "Spotify"
                    if player state is playing then
                        set albumArtUrl to artwork url of current track
                        return albumArtUrl
                    else
                        return "No track playing"
                    end if
                end tell
            `;

            const result = execSync(`osascript -e '${script}'`, { encoding: 'utf8' });
            const url = result.trim();
            
            if (url && url !== "No track playing" && url.startsWith('http')) {
                return url;
            }
            return null;
        } catch (error) {
            console.log('Could not get Spotify album art URL:', error.message);
            return null;
        }
    }

    async createPixelatedArtWithColors(trackName, artistName, albumName, albumArtUrl) {
        try {
            // Create super pixelated art using the actual album art colors
            const pixelSize = 8; // Large pixels for super compression effect
            const width = 200;
            const height = 200;
            const cols = Math.floor(width / pixelSize);
            const rows = Math.floor(height / pixelSize);
            
            // Create SVG that uses the original album art as a base
            const svg = `
                <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg" style="image-rendering: pixelated; image-rendering: -moz-crisp-edges; image-rendering: crisp-edges;">
                    <defs>
                        <filter id="superPixelate" x="0" y="0" width="200" height="200">
                            <feMorphology operator="dilate" radius="4"/>
                            <feGaussianBlur stdDeviation="1"/>
                            <feMorphology operator="erode" radius="3"/>
                        </filter>
                        <filter id="compress" x="0" y="0" width="200" height="200">
                            <feColorMatrix type="saturate" values="0.4"/>
                            <feComponentTransfer>
                                <feFuncA type="discrete" tableValues="0 1"/>
                            </feComponentTransfer>
                        </filter>
                        <filter id="pixelateImage" x="0" y="0" width="200" height="200">
                            <feMorphology operator="dilate" radius="3"/>
                            <feGaussianBlur stdDeviation="0.8"/>
                            <feMorphology operator="erode" radius="2"/>
                        </filter>
                    </defs>
                    
                    <!-- Original album art with super pixelation -->
                    <image x="0" y="0" width="200" height="200" 
                           href="${albumArtUrl}" 
                           filter="url(#pixelateImage)"
                           style="image-rendering: pixelated; image-rendering: -moz-crisp-edges; image-rendering: crisp-edges;"/>
                    
                    <!-- Overlay with additional pixelation -->
                    <rect x="0" y="0" width="200" height="200" 
                          fill="none" 
                          stroke="rgba(0,0,0,0.3)" 
                          stroke-width="1" 
                          stroke-dasharray="8,8"/>
                    
                    <!-- Pixelated text overlay -->
                    <g filter="url(#compress)">
                        <rect x="10" y="140" width="180" height="50" fill="rgba(0,0,0,0.7)" rx="4"/>
                        <text x="100" y="155" text-anchor="middle" fill="#FFFFFF" 
                              font-family="monospace" font-size="10" font-weight="bold" 
                              style="text-shadow: 2px 2px 0px rgba(0,0,0,0.8);">
                            ${trackName.substring(0, 12).toUpperCase()}
                        </text>
                        <text x="100" y="170" text-anchor="middle" fill="#CCCCCC" 
                              font-family="monospace" font-size="8" 
                              style="text-shadow: 1px 1px 0px rgba(0,0,0,0.8);">
                            ${artistName.substring(0, 16).toUpperCase()}
                        </text>
                        <text x="100" y="185" text-anchor="middle" fill="#AAAAAA" 
                              font-family="monospace" font-size="6" 
                              style="text-shadow: 1px 1px 0px rgba(0,0,0,0.8);">
                            ${albumName.substring(0, 20).toUpperCase()}
                        </text>
                    </g>
                    
                    <!-- Corner pixel accents -->
                    <rect x="0" y="0" width="8" height="8" fill="rgba(255,255,255,0.8)"/>
                    <rect x="192" y="0" width="8" height="8" fill="rgba(255,255,255,0.8)"/>
                    <rect x="0" y="192" width="8" height="8" fill="rgba(255,255,255,0.8)"/>
                    <rect x="192" y="192" width="8" height="8" fill="rgba(255,255,255,0.8)"/>
                </svg>
            `;
            
            // Convert SVG to data URL
            const dataUrl = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
            return dataUrl;
        } catch (error) {
            console.log('Error creating pixelated art with colors:', error.message);
            // Fallback to regular pixelated art
            return await this.createPixelatedArt(trackName, artistName, albumName);
        }
    }

    async createPixelatedArt(trackName, artistName, albumName) {
        try {
            // Create a super compressed, pixelated album art
            const colors = [
                '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
                '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
                '#FF9F43', '#10AC84', '#EE5A24', '#0984E3', '#6C5CE7',
                '#A29BFE', '#FD79A8', '#FDCB6E', '#E17055', '#00B894'
            ];
            
            // Generate consistent colors based on track name
            const hash = this.simpleHash(trackName + artistName);
            const primaryColor = colors[hash % colors.length];
            const secondaryColor = colors[(hash + 1) % colors.length];
            const accentColor = colors[(hash + 2) % colors.length];
            
            // Create super pixelated pattern with large blocks
            const pixelSize = 8; // Large pixels for super compression effect
            const width = 200;
            const height = 200;
            const cols = Math.floor(width / pixelSize);
            const rows = Math.floor(height / pixelSize);
            
            // Generate pixelated pattern
            let pixelPattern = '';
            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    const pixelHash = this.simpleHash(`${row}-${col}-${trackName}`);
                    const color = pixelHash % 3 === 0 ? primaryColor : 
                                 pixelHash % 3 === 1 ? secondaryColor : accentColor;
                    const x = col * pixelSize;
                    const y = row * pixelSize;
                    pixelPattern += `<rect x="${x}" y="${y}" width="${pixelSize}" height="${pixelSize}" fill="${color}"/>`;
                }
            }
            
            // Create super compressed SVG with heavy pixelation
            const svg = `
                <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg" style="image-rendering: pixelated; image-rendering: -moz-crisp-edges; image-rendering: crisp-edges;">
                    <defs>
                        <filter id="superPixelate" x="0" y="0" width="200" height="200">
                            <feMorphology operator="dilate" radius="3"/>
                            <feGaussianBlur stdDeviation="0.5"/>
                            <feMorphology operator="erode" radius="2"/>
                        </filter>
                        <filter id="compress" x="0" y="0" width="200" height="200">
                            <feColorMatrix type="saturate" values="0.3"/>
                            <feComponentTransfer>
                                <feFuncA type="discrete" tableValues="0 1"/>
                            </feComponentTransfer>
                        </filter>
                    </defs>
                    
                    <!-- Super pixelated background -->
                    <g filter="url(#superPixelate)">
                        ${pixelPattern}
                    </g>
                    
                    <!-- Pixelated border -->
                    <rect x="0" y="0" width="200" height="200" fill="none" stroke="${accentColor}" stroke-width="2"/>
                    <rect x="4" y="4" width="192" height="192" fill="none" stroke="${secondaryColor}" stroke-width="1"/>
                    
                    <!-- Pixelated text with compression -->
                    <g filter="url(#compress)">
                        <text x="100" y="90" text-anchor="middle" fill="${accentColor}" 
                              font-family="monospace" font-size="10" font-weight="bold" 
                              style="text-shadow: 1px 1px 0px ${primaryColor};">
                            ${trackName.substring(0, 12).toUpperCase()}
                        </text>
                        <text x="100" y="110" text-anchor="middle" fill="${secondaryColor}" 
                              font-family="monospace" font-size="8" 
                              style="text-shadow: 1px 1px 0px ${primaryColor};">
                            ${artistName.substring(0, 16).toUpperCase()}
                        </text>
                        <text x="100" y="130" text-anchor="middle" fill="${primaryColor}" 
                              font-family="monospace" font-size="6" 
                              style="text-shadow: 1px 1px 0px ${accentColor};">
                            ${albumName.substring(0, 20).toUpperCase()}
                        </text>
                    </g>
                    
                    <!-- Additional pixelated effects -->
                    <rect x="20" y="20" width="160" height="160" fill="none" stroke="${primaryColor}" stroke-width="1" stroke-dasharray="4,4"/>
                    
                    <!-- Corner pixels -->
                    <rect x="0" y="0" width="8" height="8" fill="${accentColor}"/>
                    <rect x="192" y="0" width="8" height="8" fill="${accentColor}"/>
                    <rect x="0" y="192" width="8" height="8" fill="${accentColor}"/>
                    <rect x="192" y="192" width="8" height="8" fill="${accentColor}"/>
                </svg>
            `;
            
            // Convert SVG to data URL with compression
            const dataUrl = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
            return dataUrl;
        } catch (error) {
            return null;
        }
    }

    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash);
    }

    async playPlaylist(playlistUri) {
        try {
            if (!this.isSpotifyRunning) {
                console.log('⚠️  Spotify is not running. Starting Spotify...');
                execSync('open -a Spotify', { encoding: 'utf8' });
                await this.sleep(3000); // Wait for Spotify to start
            }

            // Extract playlist ID from URI
            const playlistId = playlistUri.replace('spotify:playlist:', '');
            
            const script = `
                tell application "Spotify"
                    play track "spotify:playlist:${playlistId}"
                end tell
            `;

            execSync(`osascript -e '${script}'`, { encoding: 'utf8' });
            return { success: true, playlist: playlistId };
        } catch (error) {
            return { error: error.message };
        }
    }

    async setVolume(volume) {
        try {
            const script = `
                tell application "Spotify"
                    set sound volume to ${volume}
                end tell
            `;

            execSync(`osascript -e '${script}'`, { encoding: 'utf8' });
            return { success: true, volume };
        } catch (error) {
            return { error: error.message };
        }
    }

    async pauseMusic() {
        try {
            const script = `
                tell application "Spotify"
                    pause
                end tell
            `;

            execSync(`osascript -e '${script}'`, { encoding: 'utf8' });
            return { success: true };
        } catch (error) {
            return { error: error.message };
        }
    }

    async resumeMusic() {
        try {
            const script = `
                tell application "Spotify"
                    play
                end tell
            `;

            execSync(`osascript -e '${script}'`, { encoding: 'utf8' });
            return { success: true };
        } catch (error) {
            return { error: error.message };
        }
    }

    async getPlaylists() {
        try {
            const script = `tell application "Spotify" to get name of user playlists`;

            const result = execSync(`osascript -e '${script}'`, { encoding: 'utf8' });
            const playlistNames = result.trim().split(', ');
            
            // For now, return a simplified list
            return playlistNames.map(name => ({
                name: name.trim(),
                uri: `spotify:playlist:${name.toLowerCase().replace(/\s+/g, '-')}`
            }));
        } catch (error) {
            return { error: error.message };
        }
    }

    async switchToContext(context) {
        if (!this.config[context]) {
            return { error: `Unknown context: ${context}` };
        }

        const contextConfig = this.config[context];
        
        // Check if playlist URI is configured
        if (contextConfig.playlist_uri.includes('REPLACE_WITH_YOUR')) {
            return { 
                error: `Please configure playlist URI for ${context} context`,
                suggestion: 'Run: node music/setup-playlists.js to configure playlists'
            };
        }

        try {
            // Play the playlist
            const playResult = await this.playPlaylist(contextConfig.playlist_uri);
            if (playResult.error) {
                return playResult;
            }

            // Set the volume
            const volumeResult = await this.setVolume(contextConfig.volume);
            if (volumeResult.error) {
                return volumeResult;
            }

            return {
                success: true,
                context,
                playlist: contextConfig.playlist_uri,
                volume: contextConfig.volume,
                description: contextConfig.description
            };
        } catch (error) {
            return { error: error.message };
        }
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// CLI Interface
if (require.main === module) {
    const spotify = new SpotifyIntegration();
    const command = process.argv[2];
    const param = process.argv[3];

    async function runCommand() {
        switch (command) {
            case 'status':
                const status = await spotify.getCurrentTrack();
                console.log('🎵 Spotify Status:');
                if (status.error) {
                    console.log(`   Error: ${status.error}`);
                } else if (status.track === "No track playing") {
                    console.log(`   Current: ${status.track}`);
                } else {
                    console.log(`   Current: ${status.track}`);
                    console.log(`   Track: ${status.trackName}`);
                    console.log(`   Artist: ${status.artist}`);
                    console.log(`   Album: ${status.album}`);
                    console.log(`   Volume: ${status.volume}%`);
                    console.log(`   Duration: ${Math.floor(status.duration / 1000)}s`);
                    console.log(`   Position: ${Math.floor(status.position / 1000)}s`);
                }
                console.log(`   Running: ${spotify.isSpotifyRunning ? '✅ Yes' : '❌ No'}`);
                break;

            case 'playlists':
                const playlists = await spotify.getPlaylists();
                console.log('📋 Your Spotify Playlists:');
                if (playlists.error) {
                    console.log(`   Error: ${playlists.error}`);
                } else {
                    playlists.forEach(playlist => {
                        console.log(`   ${playlist.name}: ${playlist.uri}`);
                    });
                }
                break;

            case 'switch':
                if (param) {
                    const result = await spotify.switchToContext(param);
                    if (result.success) {
                        console.log(`✅ Switched to ${param} music`);
                        console.log(`   Playlist: ${result.playlist}`);
                        console.log(`   Volume: ${result.volume}%`);
                        console.log(`   Description: ${result.description}`);
                    } else {
                        console.log(`❌ Error: ${result.error}`);
                        if (result.suggestion) {
                            console.log(`   Suggestion: ${result.suggestion}`);
                        }
                    }
                } else {
                    console.log('Usage: node spotify-integration.js switch <context>');
                    console.log('Available contexts:', Object.keys(spotify.config).join(', '));
                }
                break;

            case 'pause':
                const pauseResult = await spotify.pauseMusic();
                console.log(pauseResult.success ? '⏸️  Music paused' : `❌ Error: ${pauseResult.error}`);
                break;

            case 'resume':
                const resumeResult = await spotify.resumeMusic();
                console.log(resumeResult.success ? '▶️  Music resumed' : `❌ Error: ${resumeResult.error}`);
                break;

            case 'volume':
                if (param) {
                    const volumeResult = await spotify.setVolume(parseInt(param));
                    console.log(volumeResult.success ? `🔊 Volume set to ${param}%` : `❌ Error: ${volumeResult.error}`);
                } else {
                    console.log('Usage: node spotify-integration.js volume <0-100>');
                }
                break;

            case 'art':
                const trackInfo = await spotify.getCurrentTrack();
                if (trackInfo.error) {
                    console.log(`❌ Error: ${trackInfo.error}`);
                } else if (trackInfo.track === "No track playing") {
                    console.log('🎵 No track currently playing');
                } else {
                    console.log('🎨 Current Track Album Art:');
                    console.log(`   Track: ${trackInfo.trackName}`);
                    console.log(`   Artist: ${trackInfo.artist}`);
                    console.log(`   Album: ${trackInfo.album}`);
                    console.log(`   Volume: ${trackInfo.volume}%`);
                    console.log(`   Duration: ${Math.floor(trackInfo.duration / 1000)}s`);
                    console.log(`   Position: ${Math.floor(trackInfo.position / 1000)}s`);
                    
                    if (trackInfo.albumArt && trackInfo.albumArt.url) {
                        console.log('\n🎨 Pixelated Album Art:');
                        console.log(`   Type: ${trackInfo.albumArt.placeholder ? 'Generated' : 'Real Album Art'}`);
                        if (trackInfo.albumArt.originalUrl) {
                            console.log(`   Original URL: ${trackInfo.albumArt.originalUrl}`);
                        }
                        console.log(`   Data URL: ${trackInfo.albumArt.url.substring(0, 100)}...`);
                        console.log('   (Use this URL in your web interface to display the pixelated art)');
                        
                        // Save the SVG to a file for viewing
                        const fs = require('fs');
                        const path = require('path');
                        const svgContent = Buffer.from(trackInfo.albumArt.url.split(',')[1], 'base64').toString();
                        const artPath = path.join(__dirname, '..', 'sessions', 'current-album-art.svg');
                        fs.writeFileSync(artPath, svgContent);
                        console.log(`   Saved to: ${artPath}`);
                        
                        // Also save original art if available
                        if (trackInfo.albumArt.originalUrl) {
                            const originalPath = path.join(__dirname, '..', 'sessions', 'original-album-art.jpg');
                            try {
                                const https = require('https');
                                const file = fs.createWriteStream(originalPath);
                                https.get(trackInfo.albumArt.originalUrl, (response) => {
                                    response.pipe(file);
                                    file.on('finish', () => {
                                        file.close();
                                        console.log(`   Original saved to: ${originalPath}`);
                                    });
                                });
                            } catch (error) {
                                console.log('   Could not save original album art');
                            }
                        }
                    }
                }
                break;

            default:
                console.log('🎵 Spotify Integration');
                console.log('\nUsage:');
                console.log('  node spotify-integration.js status           - Show current track');
                console.log('  node spotify-integration.js playlists       - List your playlists');
                console.log('  node spotify-integration.js switch <context> - Switch to context');
                console.log('  node spotify-integration.js pause           - Pause music');
                console.log('  node spotify-integration.js resume          - Resume music');
                console.log('  node spotify-integration.js volume <0-100>   - Set volume');
                console.log('  node spotify-integration.js art             - Show pixelated album art');
                console.log('\nAvailable contexts:', Object.keys(spotify.config).join(', '));
        }
    }

    runCommand().catch(console.error);
}

module.exports = SpotifyIntegration;