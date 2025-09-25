#!/usr/bin/env node

/**
 * Automation Suite Web Interface Server
 * Provides a beautiful GUI for all automations
 */

const express = require('express');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const AutomationController = require('../automation-controller');
const WalkthroughSystem = require('./walkthrough-system');
const MiniTerminal = require('./mini-terminal');

class WebInterface {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3000;
        this.automationController = new AutomationController();
        this.walkthroughSystem = new WalkthroughSystem();
        this.miniTerminal = new MiniTerminal();
        this.setupMiddleware();
        this.setupRoutes();
        this.setupWebSocket();
    }

    setupMiddleware() {
        // Serve static files
        this.app.use(express.static(path.join(__dirname, 'public')));
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));

        // CORS for development
        this.app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
            res.header('Access-Control-Allow-Headers', 'Content-Type');
            next();
        });
    }

    setupWebSocket() {
        const http = require('http');
        const socketIo = require('socket.io');
        
        this.server = http.createServer(this.app);
        this.io = socketIo(this.server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"]
            }
        });

        this.io.on('connection', (socket) => {
            console.log('Client connected to automation interface');
            
            // Send initial status
            this.sendSystemStatus(socket);
            
            // Handle automation commands
            socket.on('execute-command', async (data) => {
                try {
                    const result = await this.automationController.executeCommand(data.command, data.params || []);
                    socket.emit('command-result', { success: true, result });
                } catch (error) {
                    socket.emit('command-result', { success: false, error: error.message });
                }
            });

            // Handle real-time updates
            socket.on('subscribe-updates', () => {
                this.startRealTimeUpdates(socket);
            });

            socket.on('disconnect', () => {
                console.log('Client disconnected');
            });
        });
    }

    async sendSystemStatus(socket) {
        try {
            const status = await this.getSystemStatus();
            socket.emit('system-status', status);
        } catch (error) {
            socket.emit('system-status', { error: error.message });
        }
    }

    async getSystemStatus() {
        const status = {
            timestamp: new Date().toISOString(),
            automations: {},
            system: {
                uptime: process.uptime(),
                memory: process.memoryUsage(),
                platform: process.platform,
                nodeVersion: process.version
            }
        };

        // Get status for each automation
        const automationModules = [
            'music', 'tabs', 'code', 'resume', 'ideas', 'session'
        ];

        for (const module of automationModules) {
            try {
                status.automations[module] = await this.getModuleStatus(module);
            } catch (error) {
                status.automations[module] = { error: error.message };
            }
        }

        return status;
    }

    async getModuleStatus(module) {
        switch (module) {
            case 'music':
                return await this.getMusicStatus();
            case 'tabs':
                return await this.getTabStatus();
            case 'code':
                return await this.getCodeStatus();
            case 'resume':
                return await this.getResumeStatus();
            case 'ideas':
                return await this.getIdeasStatus();
            case 'session':
                return await this.getSessionStatus();
            default:
                return { error: 'Unknown module' };
        }
    }

    async getMusicStatus() {
        try {
            const MusicController = require('../music/smart-music-controller');
            const controller = new MusicController();
            const context = await controller.detectContext();
            return {
                enabled: true,
                currentContext: context,
                isRunning: controller.isRunning,
                contexts: Object.keys(controller.config)
            };
        } catch (error) {
            return { enabled: false, error: error.message };
        }
    }

    async getTabStatus() {
        try {
            const TabManager = require('../web/tab-manager');
            const manager = new TabManager();
            const tabs = await manager.getChromeTabs();
            const analysis = manager.analyzeTabs(tabs);
            return {
                enabled: true,
                tabCount: tabs.length,
                categories: analysis.categories,
                domains: analysis.domains
            };
        } catch (error) {
            return { enabled: false, error: error.message };
        }
    }

    async getCodeStatus() {
        try {
            const CodeAnalyzer = require('../development/code-analyzer');
            const analyzer = new CodeAnalyzer();
            const files = await analyzer.scanFiles('.');
            return {
                enabled: true,
                filesScanned: files.length,
                supportedExtensions: ['.js', '.jsx', '.ts', '.tsx', '.py', '.dart']
            };
        } catch (error) {
            return { enabled: false, error: error.message };
        }
    }

    async getResumeStatus() {
        try {
            const ResumeBuilder = require('../career/resume-builder');
            const builder = new ResumeBuilder();
            const githubData = await builder.analyzeGitHubProfile();
            return {
                enabled: true,
                repositories: githubData.repositories.length,
                languages: Object.keys(githubData.languages),
                projects: githubData.projects.length
            };
        } catch (error) {
            return { enabled: false, error: error.message };
        }
    }

    async getIdeasStatus() {
        try {
            const AppIdeaGenerator = require('../innovation/app-idea-generator');
            const generator = new AppIdeaGenerator();
            return {
                enabled: true,
                categories: ['ai_ml', 'productivity', 'mobile', 'web', 'devtools'],
                interests: generator.config.user_profile.interests
            };
        } catch (error) {
            return { enabled: false, error: error.message };
        }
    }

    async getSessionStatus() {
        try {
            const WorkSessionManager = require('../workflows/work-session-manager');
            const manager = new WorkSessionManager();
            const activeSession = await manager.getActiveSession();
            const history = await manager.getSessionHistory(7);
            return {
                enabled: true,
                activeSession: activeSession ? {
                    id: activeSession.id,
                    type: activeSession.type,
                    duration: manager.calculateDuration(activeSession.start_time)
                } : null,
                recentSessions: history.length,
                sessionTypes: ['default', 'focus', 'creative', 'learning', 'meeting']
            };
        } catch (error) {
            return { enabled: false, error: error.message };
        }
    }

    startRealTimeUpdates(socket) {
        // Send updates every 5 seconds
        const interval = setInterval(async () => {
            try {
                const status = await this.getSystemStatus();
                socket.emit('system-update', status);
            } catch (error) {
                socket.emit('system-update', { error: error.message });
            }
        }, 5000);

        socket.on('disconnect', () => {
            clearInterval(interval);
        });
    }

    setupRoutes() {
        // Main dashboard
        this.app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, 'public', 'index.html'));
        });

        // API routes
        this.app.get('/api/status', async (req, res) => {
            try {
                const status = await this.getSystemStatus();
                res.json(status);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        this.app.post('/api/execute', async (req, res) => {
            try {
                const { command, params } = req.body;
                const result = await this.automationController.executeCommand(command, params || []);
                res.json({ success: true, result });
            } catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
        });

        // Music control routes
        this.app.post('/api/music/start', async (req, res) => {
            try {
                await this.automationController.executeCommand('music start');
                res.json({ success: true });
            } catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
        });

        this.app.post('/api/music/stop', async (req, res) => {
            try {
                await this.automationController.executeCommand('music stop');
                res.json({ success: true });
            } catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
        });

        this.app.post('/api/music/switch/:context', async (req, res) => {
            try {
                const { context } = req.params;
                await this.automationController.executeCommand('music switch', [context]);
                res.json({ success: true });
            } catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
        });

        // Tab management routes
        this.app.post('/api/tabs/declutter', async (req, res) => {
            try {
                const { mode } = req.body;
                await this.automationController.executeCommand('tabs declutter', [mode || 'standard']);
                res.json({ success: true });
            } catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
        });

        this.app.post('/api/tabs/group', async (req, res) => {
            try {
                await this.automationController.executeCommand('tabs group');
                res.json({ success: true });
            } catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
        });

        this.app.post('/api/tabs/save', async (req, res) => {
            try {
                const { name } = req.body;
                await this.automationController.executeCommand('tabs save', [name || 'current']);
                res.json({ success: true });
            } catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
        });

        // Code analysis routes
        this.app.post('/api/code/analyze', async (req, res) => {
            try {
                const { path } = req.body;
                await this.automationController.executeCommand('code analyze', [path || '.']);
                res.json({ success: true });
            } catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
        });

        this.app.post('/api/code/docs', async (req, res) => {
            try {
                const { path } = req.body;
                await this.automationController.executeCommand('code docs', [path || '.']);
                res.json({ success: true });
            } catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
        });

        // Resume builder routes
        this.app.post('/api/resume/build', async (req, res) => {
            try {
                await this.automationController.executeCommand('resume build');
                res.json({ success: true });
            } catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
        });

        this.app.post('/api/resume/portfolio', async (req, res) => {
            try {
                await this.automationController.executeCommand('resume portfolio');
                res.json({ success: true });
            } catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
        });

        // App idea generator routes
        this.app.post('/api/ideas/generate', async (req, res) => {
            try {
                const { count, category } = req.body;
                await this.automationController.executeCommand('ideas generate', [count || 5, category || 'all']);
                res.json({ success: true });
            } catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
        });

        // Work session routes
        this.app.post('/api/session/start', async (req, res) => {
            try {
                const { type } = req.body;
                await this.automationController.executeCommand('session start', [type || 'default']);
                res.json({ success: true });
            } catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
        });

        this.app.post('/api/session/end', async (req, res) => {
            try {
                await this.automationController.executeCommand('session end');
                res.json({ success: true });
            } catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
        });

        // Configuration routes
        this.app.get('/api/config', (req, res) => {
            try {
                const configPath = path.join(__dirname, '..', 'configs', 'master-config.json');
                const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
                res.json(config);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        this.app.post('/api/config', (req, res) => {
            try {
                const configPath = path.join(__dirname, '..', 'configs', 'master-config.json');
                fs.writeFileSync(configPath, JSON.stringify(req.body, null, 2));
                res.json({ success: true });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        // File download routes
        this.app.get('/api/download/:type/:filename', (req, res) => {
            try {
                const { type, filename } = req.params;
                const filePath = path.join(__dirname, '..', type, 'output', filename);
                
                if (fs.existsSync(filePath)) {
                    res.download(filePath);
                } else {
                    res.status(404).json({ error: 'File not found' });
                }
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        // Analytics routes
        this.app.get('/api/analytics/:type', async (req, res) => {
            try {
                const { type } = req.params;
                const analytics = await this.getAnalytics(type);
                res.json(analytics);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        // Walkthrough routes
        this.app.get('/api/walkthroughs', (req, res) => {
            try {
                const walkthroughs = this.walkthroughSystem.getAvailableWalkthroughs();
                res.json(walkthroughs);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        this.app.post('/api/walkthroughs/:id/start', (req, res) => {
            try {
                const { id } = req.params;
                const walkthrough = this.walkthroughSystem.startWalkthrough(id);
                res.json(walkthrough);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        this.app.get('/api/walkthroughs/current', (req, res) => {
            try {
                const currentStep = this.walkthroughSystem.getCurrentStep();
                res.json(currentStep);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        this.app.post('/api/walkthroughs/next', (req, res) => {
            try {
                const nextStep = this.walkthroughSystem.nextStep();
                res.json(nextStep);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        this.app.post('/api/walkthroughs/previous', (req, res) => {
            try {
                const previousStep = this.walkthroughSystem.previousStep();
                res.json(previousStep);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        this.app.post('/api/walkthroughs/skip', (req, res) => {
            try {
                const result = this.walkthroughSystem.skipWalkthrough();
                res.json({ skipped: true, result });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        this.app.get('/api/walkthroughs/progress', (req, res) => {
            try {
                const progress = this.walkthroughSystem.getProgress();
                res.json(progress);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        // Mini Terminal routes
        this.app.get('/api/terminal/suggestions', (req, res) => {
            try {
                const { q } = req.query;
                const suggestions = this.miniTerminal.getSuggestions(q || '');
                res.json(suggestions);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        this.app.get('/api/terminal/commands', (req, res) => {
            try {
                const { category } = req.query;
                const commands = category ? 
                    this.miniTerminal.getCommandsByCategory(category) : 
                    this.miniTerminal.getAllCommands();
                res.json(commands);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        this.app.get('/api/terminal/categories', (req, res) => {
            try {
                const categories = this.miniTerminal.getCategories();
                res.json(categories);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        this.app.post('/api/terminal/execute', async (req, res) => {
            try {
                const { command } = req.body;
                const result = await this.miniTerminal.executeCommand(command);
                res.json(result);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        this.app.get('/api/terminal/history', (req, res) => {
            try {
                const history = this.miniTerminal.getCommandHistory();
                res.json(history);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        this.app.get('/api/terminal/quick-commands', (req, res) => {
            try {
                const quickCommands = this.miniTerminal.getQuickCommands();
                res.json(quickCommands);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        this.app.get('/api/terminal/recent', (req, res) => {
            try {
                const recentCommands = this.miniTerminal.getRecentCommands();
                res.json(recentCommands);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        this.app.get('/api/terminal/help/:command', (req, res) => {
            try {
                const { command } = req.params;
                const help = this.miniTerminal.getCommandHelp(command);
                res.json(help);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }

    async getAnalytics(type) {
        switch (type) {
            case 'music':
                return await this.getMusicAnalytics();
            case 'tabs':
                return await this.getTabAnalytics();
            case 'sessions':
                return await this.getSessionAnalytics();
            default:
                return { error: 'Unknown analytics type' };
        }
    }

    async getMusicAnalytics() {
        try {
            const analyticsPath = path.join(__dirname, '..', 'music', 'output', 'music-analytics_2024-01-15.json');
            if (fs.existsSync(analyticsPath)) {
                return JSON.parse(fs.readFileSync(analyticsPath, 'utf8'));
            }
            return { message: 'No analytics data available' };
        } catch (error) {
            return { error: error.message };
        }
    }

    async getTabAnalytics() {
        try {
            const analyticsPath = path.join(__dirname, '..', 'web', 'output', 'tab-analytics_2024-01-15.json');
            if (fs.existsSync(analyticsPath)) {
                return JSON.parse(fs.readFileSync(analyticsPath, 'utf8'));
            }
            return { message: 'No analytics data available' };
        } catch (error) {
            return { error: error.message };
        }
    }

    async getSessionAnalytics() {
        try {
            const historyPath = path.join(__dirname, '..', 'workflows', 'sessions', 'history_2024-01-15.json');
            if (fs.existsSync(historyPath)) {
                return JSON.parse(fs.readFileSync(historyPath, 'utf8'));
            }
            return { message: 'No session data available' };
        } catch (error) {
            return { error: error.message };
        }
    }

    start() {
        this.server.listen(this.port, () => {
            console.log(`🎯 Automation Suite Web Interface running on http://localhost:${this.port}`);
            console.log(`📊 Dashboard: http://localhost:${this.port}`);
            console.log(`🔧 API: http://localhost:${this.port}/api`);
            console.log(`📡 WebSocket: ws://localhost:${this.port}`);
        });
    }
}

// Start server if called directly
if (require.main === module) {
    const webInterface = new WebInterface();
    webInterface.start();
}

module.exports = WebInterface;