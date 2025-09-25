#!/usr/bin/env node

/**
 * Work Session Manager
 * Handles start/end work sessions with integrated automations
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class WorkSessionManager {
    constructor() {
        this.configPath = path.join(__dirname, '../configs/master-config.json');
        this.config = this.loadConfig();
        this.sessionsPath = path.join(__dirname, 'sessions');
        this.ensureDirectories();
    }

    loadConfig() {
        try {
            const configData = fs.readFileSync(this.configPath, 'utf8');
            return JSON.parse(configData);
        } catch (error) {
            return this.getDefaultConfig();
        }
    }

    getDefaultConfig() {
        return {
            workflow_automations: {
                work_session: {
                    enabled: true,
                    start_actions: [
                        "open_project_tabs", "start_focus_music", 
                        "create_daily_folder", "show_today_agenda"
                    ],
                    end_actions: [
                        "save_session_tabs", "archive_work_files", 
                        "generate_summary", "cleanup_temp_files"
                    ]
                },
                schedule: {
                    work_hours: "09:00-17:00",
                    focus_blocks: ["10:00-12:00", "14:00-16:00"],
                    break_reminders: true,
                    end_of_day_cleanup: true
                }
            }
        };
    }

    ensureDirectories() {
        if (!fs.existsSync(this.sessionsPath)) {
            fs.mkdirSync(this.sessionsPath, { recursive: true });
        }
    }

    async startWorkSession(sessionType = 'default') {
        console.log('🚀 Starting work session...\n');
        
        const session = {
            id: this.generateSessionId(),
            type: sessionType,
            start_time: new Date().toISOString(),
            status: 'active',
            actions_completed: [],
            tabs_saved: [],
            music_context: null,
            project_context: null
        };

        // Execute start actions
        await this.executeStartActions(session);
        
        // Save session
        await this.saveSession(session);
        
        console.log('✅ Work session started successfully!');
        console.log(`📊 Session ID: ${session.id}`);
        console.log(`🎯 Type: ${sessionType}`);
        console.log(`⏰ Started: ${new Date().toLocaleString()}`);
        
        return session;
    }

    async executeStartActions(session) {
        const actions = this.config.workflow_automations.work_session.start_actions;
        
        for (const action of actions) {
            try {
                console.log(`🔄 Executing: ${action}`);
                await this.executeAction(action, session);
                session.actions_completed.push({
                    action,
                    completed_at: new Date().toISOString(),
                    status: 'success'
                });
            } catch (error) {
                console.log(`⚠️  Failed: ${action} - ${error.message}`);
                session.actions_completed.push({
                    action,
                    completed_at: new Date().toISOString(),
                    status: 'failed',
                    error: error.message
                });
            }
        }
    }

    async executeAction(action, session) {
        switch (action) {
            case 'open_project_tabs':
                await this.openProjectTabs(session);
                break;
            case 'start_focus_music':
                await this.startFocusMusic(session);
                break;
            case 'create_daily_folder':
                await this.createDailyFolder(session);
                break;
            case 'show_today_agenda':
                await this.showTodayAgenda(session);
                break;
            case 'save_session_tabs':
                await this.saveSessionTabs(session);
                break;
            case 'archive_work_files':
                await this.archiveWorkFiles(session);
                break;
            case 'generate_summary':
                await this.generateSummary(session);
                break;
            case 'cleanup_temp_files':
                await this.cleanupTempFiles(session);
                break;
            default:
                console.log(`⚠️  Unknown action: ${action}`);
        }
    }

    async openProjectTabs(session) {
        const projectUrls = [
            'https://github.com/think-outside-the-valley/embrr-wat-dev-fest-2025',
            'https://docs.google.com/spreadsheets',
            'https://drive.google.com/drive',
            'https://mail.google.com'
        ];

        console.log('🌐 Opening project tabs...');
        
        for (const url of projectUrls) {
            try {
                execSync(`open -a "Google Chrome" "${url}"`, { encoding: 'utf8' });
                session.tabs_saved.push(url);
                console.log(`   ✅ Opened: ${url}`);
            } catch (error) {
                console.log(`   ❌ Failed to open: ${url}`);
            }
        }
    }

    async startFocusMusic(session) {
        console.log('🎵 Starting focus music...');
        
        try {
            // Try to start smart music automation
            const musicController = require('../music/smart-music-controller');
            const controller = new musicController();
            await controller.startSmartMusic();
            session.music_context = 'smart_focus';
            console.log('   ✅ Smart focus music started');
        } catch (error) {
            console.log('   ⚠️  Could not start smart music, continuing...');
        }
    }

    async createDailyFolder(session) {
        const today = new Date().toISOString().split('T')[0];
        const dailyFolder = path.join(process.env.HOME, 'Documents', 'Work', today);
        
        if (!fs.existsSync(dailyFolder)) {
            fs.mkdirSync(dailyFolder, { recursive: true });
            console.log(`📁 Created daily folder: ${dailyFolder}`);
        } else {
            console.log(`📁 Daily folder already exists: ${dailyFolder}`);
        }
        
        session.daily_folder = dailyFolder;
    }

    async showTodayAgenda(session) {
        console.log('📅 Today\'s Agenda:');
        console.log('   🎯 Focus on embrr-wat-dev-fest-2025 project');
        console.log('   📊 Review automation suite implementations');
        console.log('   🧪 Test new automation features');
        console.log('   📝 Update documentation');
        console.log('   ☕ Break reminders every 2 hours');
        
        session.agenda_shown = true;
    }

    async saveSessionTabs(session) {
        console.log('💾 Saving current session tabs...');
        
        try {
            const tabManager = require('../web/tab-manager');
            const manager = new tabManager();
            const tabs = await manager.getChromeTabs();
            await manager.saveSession(tabs, `session_${session.id}`);
            session.tabs_saved = tabs.map(tab => tab.url);
            console.log(`   ✅ Saved ${tabs.length} tabs`);
        } catch (error) {
            console.log(`   ⚠️  Could not save tabs: ${error.message}`);
        }
    }

    async archiveWorkFiles(session) {
        console.log('📦 Archiving work files...');
        
        const today = new Date().toISOString().split('T')[0];
        const archiveFolder = path.join(process.env.HOME, 'Documents', 'Work', 'Archive', today);
        
        if (!fs.existsSync(archiveFolder)) {
            fs.mkdirSync(archiveFolder, { recursive: true });
        }
        
        // Archive any work files from today
        const workFolder = path.join(process.env.HOME, 'Documents', 'Work', today);
        if (fs.existsSync(workFolder)) {
            const files = fs.readdirSync(workFolder);
            files.forEach(file => {
                const sourcePath = path.join(workFolder, file);
                const destPath = path.join(archiveFolder, file);
                if (fs.statSync(sourcePath).isFile()) {
                    fs.copyFileSync(sourcePath, destPath);
                }
            });
            console.log(`   ✅ Archived ${files.length} files`);
        }
        
        session.files_archived = archiveFolder;
    }

    async generateSummary(session) {
        console.log('📊 Generating work session summary...');
        
        const summary = {
            session_id: session.id,
            duration: this.calculateDuration(session.start_time),
            actions_completed: session.actions_completed.length,
            tabs_saved: session.tabs_saved.length,
            music_context: session.music_context,
            project_context: session.project_context || 'embrr-wat-dev-fest-2025',
            productivity_score: this.calculateProductivityScore(session),
            recommendations: this.generateRecommendations(session)
        };
        
        const summaryPath = path.join(this.sessionsPath, `summary_${session.id}.json`);
        fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
        
        console.log('   ✅ Summary generated');
        console.log(`   📊 Productivity Score: ${summary.productivity_score}/100`);
        console.log(`   ⏱️  Duration: ${summary.duration}`);
        
        session.summary = summary;
    }

    async cleanupTempFiles(session) {
        console.log('🧹 Cleaning up temporary files...');
        
        const tempDirs = [
            '/tmp',
            path.join(process.env.HOME, 'Downloads'),
            path.join(process.env.HOME, 'Desktop')
        ];
        
        let cleanedCount = 0;
        
        tempDirs.forEach(dir => {
            if (fs.existsSync(dir)) {
                try {
                    const files = fs.readdirSync(dir);
                    files.forEach(file => {
                        const filePath = path.join(dir, file);
                        const stats = fs.statSync(filePath);
                        
                        // Clean files older than 7 days
                        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                        if (stats.mtime < weekAgo && stats.isFile()) {
                            fs.unlinkSync(filePath);
                            cleanedCount++;
                        }
                    });
                } catch (error) {
                    // Skip directories we can't access
                }
            }
        });
        
        console.log(`   ✅ Cleaned ${cleanedCount} temporary files`);
        session.temp_files_cleaned = cleanedCount;
    }

    async endWorkSession(sessionId) {
        console.log('🏁 Ending work session...\n');
        
        const session = await this.loadSession(sessionId);
        if (!session) {
            console.log('❌ Session not found');
            return null;
        }
        
        session.end_time = new Date().toISOString();
        session.status = 'completed';
        
        // Execute end actions
        await this.executeEndActions(session);
        
        // Update session
        await this.saveSession(session);
        
        console.log('✅ Work session ended successfully!');
        console.log(`📊 Session ID: ${session.id}`);
        console.log(`⏰ Duration: ${this.calculateDuration(session.start_time, session.end_time)}`);
        console.log(`🎯 Actions completed: ${session.actions_completed.length}`);
        
        return session;
    }

    async executeEndActions(session) {
        const actions = this.config.workflow_automations.work_session.end_actions;
        
        for (const action of actions) {
            try {
                console.log(`🔄 Executing: ${action}`);
                await this.executeAction(action, session);
                session.actions_completed.push({
                    action,
                    completed_at: new Date().toISOString(),
                    status: 'success'
                });
            } catch (error) {
                console.log(`⚠️  Failed: ${action} - ${error.message}`);
                session.actions_completed.push({
                    action,
                    completed_at: new Date().toISOString(),
                    status: 'failed',
                    error: error.message
                });
            }
        }
    }

    async saveSession(session) {
        const sessionFile = path.join(this.sessionsPath, `session_${session.id}.json`);
        fs.writeFileSync(sessionFile, JSON.stringify(session, null, 2));
    }

    async loadSession(sessionId) {
        const sessionFile = path.join(this.sessionsPath, `session_${sessionId}.json`);
        
        if (fs.existsSync(sessionFile)) {
            return JSON.parse(fs.readFileSync(sessionFile, 'utf8'));
        }
        
        return null;
    }

    async getActiveSession() {
        const sessions = fs.readdirSync(this.sessionsPath)
            .filter(file => file.startsWith('session_') && file.endsWith('.json'))
            .map(file => JSON.parse(fs.readFileSync(path.join(this.sessionsPath, file), 'utf8')))
            .filter(session => session.status === 'active');
        
        return sessions.length > 0 ? sessions[0] : null;
    }

    async getSessionHistory(days = 7) {
        const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
        
        const sessions = fs.readdirSync(this.sessionsPath)
            .filter(file => file.startsWith('session_') && file.endsWith('.json'))
            .map(file => JSON.parse(fs.readFileSync(path.join(this.sessionsPath, file), 'utf8')))
            .filter(session => new Date(session.start_time) > cutoffDate)
            .sort((a, b) => new Date(b.start_time) - new Date(a.start_time));
        
        return sessions;
    }

    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
    }

    calculateDuration(startTime, endTime = null) {
        const start = new Date(startTime);
        const end = endTime ? new Date(endTime) : new Date();
        const diffMs = end - start;
        
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        
        return `${hours}h ${minutes}m`;
    }

    calculateProductivityScore(session) {
        let score = 0;
        
        // Base score for starting session
        score += 20;
        
        // Points for completed actions
        const completedActions = session.actions_completed.filter(action => action.status === 'success');
        score += completedActions.length * 10;
        
        // Points for tabs saved
        score += Math.min(session.tabs_saved.length * 2, 20);
        
        // Points for music context
        if (session.music_context) score += 10;
        
        // Points for agenda shown
        if (session.agenda_shown) score += 10;
        
        return Math.min(score, 100);
    }

    generateRecommendations(session) {
        const recommendations = [];
        
        if (session.actions_completed.length < 3) {
            recommendations.push('Complete more start actions for better session setup');
        }
        
        if (!session.music_context) {
            recommendations.push('Enable focus music for better concentration');
        }
        
        if (session.tabs_saved.length < 3) {
            recommendations.push('Save more tabs for better session continuity');
        }
        
        if (recommendations.length === 0) {
            recommendations.push('Great session! Keep up the productive work');
        }
        
        return recommendations;
    }

    async showSessionStatus() {
        const activeSession = await this.getActiveSession();
        
        if (activeSession) {
            console.log('🟢 Active Work Session');
            console.log(`   ID: ${activeSession.id}`);
            console.log(`   Started: ${new Date(activeSession.start_time).toLocaleString()}`);
            console.log(`   Duration: ${this.calculateDuration(activeSession.start_time)}`);
            console.log(`   Actions: ${activeSession.actions_completed.length} completed`);
            console.log(`   Type: ${activeSession.type}`);
        } else {
            console.log('🔴 No active work session');
        }
        
        // Show recent sessions
        const recentSessions = await this.getSessionHistory(3);
        if (recentSessions.length > 0) {
            console.log('\n📊 Recent Sessions:');
            recentSessions.slice(0, 3).forEach(session => {
                const duration = session.end_time ? 
                    this.calculateDuration(session.start_time, session.end_time) :
                    this.calculateDuration(session.start_time);
                console.log(`   ${session.id}: ${duration} (${session.status})`);
            });
        }
    }
}

// CLI Interface
if (require.main === module) {
    const manager = new WorkSessionManager();
    const command = process.argv[2];
    const param = process.argv[3];

    async function runCommand() {
        switch (command) {
            case 'start':
                const sessionType = param || 'default';
                await manager.startWorkSession(sessionType);
                break;
            case 'end':
                if (param) {
                    await manager.endWorkSession(param);
                } else {
                    const activeSession = await manager.getActiveSession();
                    if (activeSession) {
                        await manager.endWorkSession(activeSession.id);
                    } else {
                        console.log('❌ No active session to end');
                    }
                }
                break;
            case 'status':
                await manager.showSessionStatus();
                break;
            case 'history':
                const days = parseInt(param) || 7;
                const sessions = await manager.getSessionHistory(days);
                console.log(`📊 Session History (Last ${days} days):`);
                sessions.forEach(session => {
                    const duration = session.end_time ? 
                        manager.calculateDuration(session.start_time, session.end_time) :
                        manager.calculateDuration(session.start_time);
                    console.log(`   ${session.id}: ${duration} (${session.status})`);
                });
                break;
            default:
                console.log('🔄 Work Session Manager');
                console.log('\nUsage:');
                console.log('  node work-session-manager.js start [type]  - Start work session');
                console.log('  node work-session-manager.js end [id]      - End work session');
                console.log('  node work-session-manager.js status        - Show session status');
                console.log('  node work-session-manager.js history [days] - Show session history');
                console.log('\nSession Types: default, focus, creative, learning');
                console.log('\nExamples:');
                console.log('  node work-session-manager.js start focus');
                console.log('  node work-session-manager.js end');
                console.log('  node work-session-manager.js status');
        }
    }

    runCommand().catch(console.error);
}

module.exports = WorkSessionManager;