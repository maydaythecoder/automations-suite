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
                        set currentVolume to sound volume
                        return currentTrack & " - " & currentArtist & " (Volume: " & currentVolume & "%)"
                    else
                        return "No track playing"
                    end if
                end tell
            `;

            const result = execSync(`osascript -e '${script}'`, { encoding: 'utf8' });
            return { track: result.trim() };
        } catch (error) {
            return { error: error.message };
        }
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
                } else {
                    console.log(`   Current: ${status.track}`);
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

            default:
                console.log('🎵 Spotify Integration');
                console.log('\nUsage:');
                console.log('  node spotify-integration.js status           - Show current track');
                console.log('  node spotify-integration.js playlists       - List your playlists');
                console.log('  node spotify-integration.js switch <context> - Switch to context');
                console.log('  node spotify-integration.js pause           - Pause music');
                console.log('  node spotify-integration.js resume          - Resume music');
                console.log('  node spotify-integration.js volume <0-100>   - Set volume');
                console.log('\nAvailable contexts:', Object.keys(spotify.config).join(', '));
        }
    }

    runCommand().catch(console.error);
}

module.exports = SpotifyIntegration;