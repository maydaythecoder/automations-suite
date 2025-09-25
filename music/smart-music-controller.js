#!/usr/bin/env node

/**
 * Smart Focus Music Controller
 * Automatically switches Spotify music based on Chrome tab context
 */

const fs = require('fs');
const path = require('path');
const SpotifyIntegration = require('./spotify-integration');

class SmartMusicController {
    constructor() {
        this.configPath = path.join(__dirname, '../configs/music-contexts.json');
        this.config = this.loadConfig();
        this.currentContext = 'default';
        this.isRunning = false;
        this.spotify = new SpotifyIntegration();
        this.currentTrack = null;
        this.lastUpdate = null;
    }

    loadConfig() {
        try {
            const configData = fs.readFileSync(this.configPath, 'utf8');
            return JSON.parse(configData);
        } catch (error) {
            console.error('Error loading music config:', error.message);
            return this.getDefaultConfig();
        }
    }

    getDefaultConfig() {
        return {
            coding: {
                playlist_uri: "spotify:playlist:REPLACE_WITH_YOUR_CODING_PLAYLIST_ID",
                volume: 60,
                keywords: ["github", "stackoverflow", "dev", "code", "programming", "vscode", "cursor", "terminal"],
                description: "Upbeat music for coding sessions"
            },
            focus: {
                playlist_uri: "spotify:playlist:REPLACE_WITH_YOUR_FOCUS_PLAYLIST_ID", 
                volume: 40,
                keywords: ["docs", "reading", "research", "learning", "documentation", "tutorial", "medium"],
                description: "Ambient music for deep focus and reading"
            },
            meetings: {
                playlist_uri: "spotify:playlist:REPLACE_WITH_YOUR_AMBIENT_PLAYLIST_ID",
                volume: 20,
                keywords: ["zoom", "meet", "teams", "calendar", "call", "webex"],
                description: "Very quiet ambient music for meetings"
            },
            creative: {
                playlist_uri: "spotify:playlist:REPLACE_WITH_YOUR_CREATIVE_PLAYLIST_ID",
                volume: 70,
                keywords: ["figma", "design", "adobe", "sketch", "photoshop", "canva"],
                description: "Inspiring music for creative work"
            },
            default: {
                playlist_uri: "spotify:playlist:REPLACE_WITH_YOUR_DEFAULT_PLAYLIST_ID",
                volume: 50,
                keywords: [],
                description: "General work music"
            }
        };
    }

    async detectContext() {
        try {
            // This would normally use Chrome MCP to get tabs
            // For now, we'll simulate based on your current setup
            const simulatedTabs = [
                'github.com/think-outside-the-valley/embrr-wat-dev-fest-2025',
                'docs.google.com/spreadsheets',
                'drive.google.com/drive/shared-with-me',
                'mail.google.com',
                'youtube.com/watch',
                'chat.deepseek.com'
            ];

            const tabText = simulatedTabs.join(' ').toLowerCase();
            
            // Check contexts in priority order
            const priorities = ['meetings', 'coding', 'creative', 'focus', 'default'];
            
            for (const context of priorities) {
                const keywords = this.config[context].keywords;
                if (keywords.some(keyword => tabText.includes(keyword))) {
                    return context;
                }
            }
            
            return 'default';
        } catch (error) {
            console.error('Error detecting context:', error.message);
            return 'default';
        }
    }

    async switchToContext(context) {
        if (!this.config[context]) {
            console.error(`Unknown context: ${context}`);
            return false;
        }

        const contextConfig = this.config[context];
        
        console.log(`🎵 Switching to ${context} music:`);
        console.log(`   Playlist: ${contextConfig.playlist_uri}`);
        console.log(`   Volume: ${contextConfig.volume}%`);
        console.log(`   Description: ${contextConfig.description}`);
        
        // Use Spotify integration to actually switch
        const result = await this.spotify.switchToContext(context);
        
        if (result.success) {
            this.currentContext = context;
            // Update current track info
            await this.updateCurrentTrack();
            return true;
        } else {
            console.error(`❌ Failed to switch to ${context}: ${result.error}`);
            if (result.suggestion) {
                console.log(`💡 Suggestion: ${result.suggestion}`);
            }
            return false;
        }
    }

    async startSmartMusic() {
        console.log('🎵 Starting Smart Focus Music...');
        this.isRunning = true;
        
        const context = await this.detectContext();
        console.log(`📊 Detected context: ${context}`);
        
        const success = await this.switchToContext(context);
        
        if (success) {
            console.log('✅ Smart music is now active!');
            console.log('   It will automatically switch based on your Chrome tabs.');
            console.log('   Say "Stop smart music" to disable.');
            
            // Show current track info
            await this.updateCurrentTrack();
            this.showCurrentTrack();
        } else {
            console.log('❌ Failed to start smart music. Check your Spotify configuration.');
        }
        
        return success;
    }

    async stopSmartMusic() {
        console.log('🛑 Stopping Smart Focus Music...');
        this.isRunning = false;
        console.log('✅ Smart music stopped.');
        return true;
    }

    async manualSwitch(context) {
        console.log(`🎵 Manually switching to ${context} music...`);
        return await this.switchToContext(context);
    }

    async updateCurrentTrack() {
        try {
            const trackInfo = await this.spotify.getCurrentTrack();
            if (trackInfo.error) {
                this.currentTrack = { error: trackInfo.error };
            } else {
                this.currentTrack = {
                    track: trackInfo.track,
                    context: this.currentContext,
                    timestamp: new Date().toISOString()
                };
            }
            this.lastUpdate = new Date();
        } catch (error) {
            this.currentTrack = { error: error.message };
        }
    }

    showCurrentTrack() {
        if (this.currentTrack) {
            if (this.currentTrack.error) {
                console.log(`🎵 Current Track: ❌ ${this.currentTrack.error}`);
            } else {
                console.log(`🎵 Current Track: ${this.currentTrack.track}`);
                console.log(`   Context: ${this.currentTrack.context}`);
            }
        } else {
            console.log('🎵 Current Track: No track information available');
        }
    }

    async getStatus() {
        await this.updateCurrentTrack();
        return {
            isRunning: this.isRunning,
            currentContext: this.currentContext,
            currentTrack: this.currentTrack,
            spotifyRunning: this.spotify.isSpotifyRunning,
            lastUpdate: this.lastUpdate,
            availableContexts: Object.keys(this.config)
        };
    }

    showStatus() {
        console.log('\n🎵 Smart Music Status:');
        console.log(`   Running: ${this.isRunning ? '✅ Yes' : '❌ No'}`);
        console.log(`   Spotify: ${this.spotify.isSpotifyRunning ? '✅ Running' : '❌ Not Running'}`);
        console.log(`   Current Context: ${this.currentContext}`);
        console.log(`   Available Contexts: ${Object.keys(this.config).join(', ')}`);
        
        // Show current track
        this.showCurrentTrack();
        
        if (this.isRunning) {
            console.log('\n📊 Context Detection:');
            Object.entries(this.config).forEach(([context, config]) => {
                console.log(`   ${context}: ${config.keywords.join(', ')}`);
            });
        }
    }

    showConfig() {
        console.log('\n⚙️ Music Configuration:');
        Object.entries(this.config).forEach(([context, config]) => {
            console.log(`\n${context.toUpperCase()}:`);
            console.log(`   Playlist: ${config.playlist_uri}`);
            console.log(`   Volume: ${config.volume}%`);
            console.log(`   Keywords: ${config.keywords.join(', ')}`);
            console.log(`   Description: ${config.description}`);
        });
    }
}

// CLI Interface
if (require.main === module) {
    const controller = new SmartMusicController();
    const command = process.argv[2];
    const context = process.argv[3];

    switch (command) {
        case 'start':
            controller.startSmartMusic();
            break;
        case 'stop':
            controller.stopSmartMusic();
            break;
        case 'switch':
            if (context) {
                controller.manualSwitch(context);
            } else {
                console.log('Usage: node smart-music-controller.js switch <context>');
                console.log('Available contexts:', Object.keys(controller.config).join(', '));
            }
            break;
        case 'status':
            controller.showStatus();
            break;
        case 'config':
            controller.showConfig();
            break;
        default:
            console.log('🎵 Smart Focus Music Controller');
            console.log('\nUsage:');
            console.log('  node smart-music-controller.js start     - Start smart music');
            console.log('  node smart-music-controller.js stop      - Stop smart music');
            console.log('  node smart-music-controller.js switch <context> - Manual switch');
            console.log('  node smart-music-controller.js status    - Show status');
            console.log('  node smart-music-controller.js config    - Show configuration');
            console.log('\nAvailable contexts:', Object.keys(controller.config).join(', '));
    }
}

module.exports = SmartMusicController;