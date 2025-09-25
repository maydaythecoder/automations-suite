#!/usr/bin/env node

/**
 * Master Automation Controller
 * Central hub for all automation suite functionality
 */

const fs = require('fs');
const path = require('path');

class AutomationController {
    constructor() {
        this.configPath = path.join(__dirname, 'configs/master-config.json');
        this.config = this.loadConfig();
        this.automations = this.initializeAutomations();
    }

    loadConfig() {
        try {
            const configData = fs.readFileSync(this.configPath, 'utf8');
            return JSON.parse(configData);
        } catch (error) {
            console.error('Error loading config:', error.message);
            return {};
        }
    }

    initializeAutomations() {
        return {
            music: {
                name: 'Smart Focus Music',
                description: 'Automatically switch music based on work context',
                controller: require('./music/smart-music-controller'),
                spotify: require('./music/spotify-integration'),
                enabled: this.config.music_automations?.smart_focus_music?.enabled || false
            },
            tabs: {
                name: 'Tab Declutter',
                description: 'Intelligently manage Chrome tabs',
                controller: require('./web/tab-manager'),
                enabled: this.config.web_automations?.tab_declutter?.enabled || false
            },
            code: {
                name: 'Code Health Checker',
                description: 'Analyze code with learning explanations',
                controller: require('./development/code-analyzer'),
                enabled: this.config.development_automations?.code_health_checker?.enabled || false
            },
            resume: {
                name: 'Resume Builder',
                description: 'Generate resumes from GitHub projects',
                controller: require('./career/resume-builder'),
                enabled: this.config.career_automations?.resume_builder?.enabled || false
            },
            ideas: {
                name: 'App Idea Generator',
                description: 'Generate innovative app ideas with market research',
                controller: require('./innovation/app-idea-generator'),
                enabled: this.config.innovation_automations?.idea_generator?.enabled || false
            },
            session: {
                name: 'Work Session Manager',
                description: 'Manage work sessions with integrated automations',
                controller: require('./workflows/work-session-manager'),
                enabled: this.config.workflow_automations?.work_session?.enabled || false
            }
        };
    }

    async executeCommand(command, params = []) {
        console.log(`🎯 Executing: ${command}\n`);
        
        const [category, action] = command.split(' ');
        
        switch (category) {
            case 'music':
                return await this.handleMusicCommand(action, params);
            case 'tabs':
                return await this.handleTabCommand(action, params);
            case 'code':
                return await this.handleCodeCommand(action, params);
            case 'resume':
                return await this.handleResumeCommand(action, params);
            case 'ideas':
                return await this.handleIdeasCommand(action, params);
            case 'session':
                return await this.handleSessionCommand(action, params);
            case 'status':
                return await this.showSystemStatus();
            case 'help':
                return await this.showHelp();
            default:
                return await this.handleNaturalLanguageCommand(command, params);
        }
    }

    async handleMusicCommand(action, params) {
        const music = this.automations.music;
        
        if (!music.enabled) {
            console.log('⚠️  Music automation is disabled');
            return;
        }

        switch (action) {
            case 'start':
                const controller = new music.controller();
                return await controller.startSmartMusic();
            case 'stop':
                const stopController = new music.controller();
                return await stopController.stopSmartMusic();
            case 'switch':
                const switchController = new music.controller();
                return await switchController.manualSwitch(params[0] || 'default');
            case 'status':
                const statusController = new music.controller();
                return statusController.showStatus();
            default:
                console.log('Music commands: start, stop, switch <context>, status');
        }
    }

    async handleTabCommand(action, params) {
        const tabs = this.automations.tabs;
        
        if (!tabs.enabled) {
            console.log('⚠️  Tab automation is disabled');
            return;
        }

        const controller = new tabs.controller();
        
        switch (action) {
            case 'analyze':
                return await controller.getChromeTabs();
            case 'declutter':
                return await controller.declutterTabs(params[0] || 'standard');
            case 'group':
                return await controller.groupTabs();
            case 'save':
                const tabsToSave = await controller.getChromeTabs();
                return await controller.saveSession(tabsToSave, params[0] || 'current');
            default:
                console.log('Tab commands: analyze, declutter [mode], group, save [name]');
        }
    }

    async handleCodeCommand(action, params) {
        const code = this.automations.code;
        
        if (!code.enabled) {
            console.log('⚠️  Code automation is disabled');
            return;
        }

        const controller = new code.controller();
        
        switch (action) {
            case 'analyze':
                return await controller.analyzeProject(params[0] || '.');
            case 'docs':
                return await controller.generateDocumentation(params[0] || '.');
            default:
                console.log('Code commands: analyze [path], docs [path]');
        }
    }

    async handleResumeCommand(action, params) {
        const resume = this.automations.resume;
        
        if (!resume.enabled) {
            console.log('⚠️  Resume automation is disabled');
            return;
        }

        const controller = new resume.controller();
        
        switch (action) {
            case 'analyze':
                return await controller.analyzeGitHubProfile();
            case 'build':
                const githubData = await controller.analyzeGitHubProfile();
                const resumeData = controller.generateResume(githubData);
                return await controller.generateResumeFiles(resumeData);
            case 'portfolio':
                const portfolioData = await controller.analyzeGitHubProfile();
                return await controller.generatePortfolioContent(portfolioData);
            default:
                console.log('Resume commands: analyze, build, portfolio');
        }
    }

    async handleIdeasCommand(action, params) {
        const ideas = this.automations.ideas;
        
        if (!ideas.enabled) {
            console.log('⚠️  Ideas automation is disabled');
            return;
        }

        const controller = new ideas.controller();
        
        switch (action) {
            case 'generate':
                const count = parseInt(params[0]) || 5;
                return await controller.generateAppIdeas(count);
            case 'category':
                const category = params[0] || 'ai_ml';
                return await controller.generateAppIdeas(3, category);
            case 'validate':
                return await controller.validateIdea(params[0], {
                    user_feedback: 'positive',
                    market_research: 'favorable',
                    competitor_analysis: 'medium_competition',
                    technical_feasibility: 'high'
                });
            default:
                console.log('Ideas commands: generate [count], category <category>, validate <idea_id>');
        }
    }

    async handleSessionCommand(action, params) {
        const session = this.automations.session;
        
        if (!session.enabled) {
            console.log('⚠️  Session automation is disabled');
            return;
        }

        const controller = new session.controller();
        
        switch (action) {
            case 'start':
                const sessionType = params[0] || 'default';
                return await controller.startWorkSession(sessionType);
            case 'end':
                if (params[0]) {
                    return await controller.endWorkSession(params[0]);
                } else {
                    const activeSession = await controller.getActiveSession();
                    if (activeSession) {
                        return await controller.endWorkSession(activeSession.id);
                    } else {
                        console.log('❌ No active session to end');
                    }
                }
                break;
            case 'status':
                return await controller.showSessionStatus();
            case 'history':
                const days = parseInt(params[0]) || 7;
                return await controller.getSessionHistory(days);
            default:
                console.log('Session commands: start [type], end [id], status, history [days]');
        }
    }

    async handleNaturalLanguageCommand(command, params) {
        // Handle natural language commands
        const lowerCommand = command.toLowerCase();
        
        if (lowerCommand.includes('start') && lowerCommand.includes('music')) {
            return await this.handleMusicCommand('start', params);
        }
        
        if (lowerCommand.includes('stop') && lowerCommand.includes('music')) {
            return await this.handleMusicCommand('stop', params);
        }
        
        if (lowerCommand.includes('switch') && lowerCommand.includes('music')) {
            const context = lowerCommand.includes('coding') ? 'coding' :
                          lowerCommand.includes('focus') ? 'focus' :
                          lowerCommand.includes('meeting') ? 'meetings' :
                          lowerCommand.includes('creative') ? 'creative' : 'default';
            return await this.handleMusicCommand('switch', [context]);
        }
        
        if (lowerCommand.includes('declutter') || lowerCommand.includes('clean') || lowerCommand.includes('tabs')) {
            return await this.handleTabCommand('declutter', params);
        }
        
        if (lowerCommand.includes('analyze') && lowerCommand.includes('code')) {
            return await this.handleCodeCommand('analyze', params);
        }
        
        if (lowerCommand.includes('resume') || lowerCommand.includes('cv')) {
            return await this.handleResumeCommand('build', params);
        }
        
        if (lowerCommand.includes('ideas') || lowerCommand.includes('app')) {
            return await this.handleIdeasCommand('generate', params);
        }
        
        if (lowerCommand.includes('start') && lowerCommand.includes('work')) {
            return await this.handleSessionCommand('start', params);
        }
        
        if (lowerCommand.includes('end') && lowerCommand.includes('work')) {
            return await this.handleSessionCommand('end', params);
        }
        
        console.log('🤔 Command not recognized. Try "help" for available commands.');
    }

    async showSystemStatus() {
        console.log('📊 Automation Suite Status\n');
        
        Object.entries(this.automations).forEach(([key, automation]) => {
            const status = automation.enabled ? '✅ Enabled' : '❌ Disabled';
            console.log(`${automation.name}: ${status}`);
            console.log(`   ${automation.description}`);
        });
        
        console.log('\n🎯 Quick Commands:');
        console.log('   "Start smart focus music"');
        console.log('   "Declutter my tabs"');
        console.log('   "Analyze my code"');
        console.log('   "Build my resume"');
        console.log('   "Generate app ideas"');
        console.log('   "Start work session"');
        console.log('   "Show system status"');
    }

    async showHelp() {
        console.log('🎯 Automation Suite Help\n');
        
        console.log('🎵 Music Automations:');
        console.log('   "Start smart focus music" - Auto-switch music based on tabs');
        console.log('   "Switch to coding music" - Manual music switch');
        console.log('   "Stop smart music" - Disable music automation');
        
        console.log('\n🌐 Web Automations:');
        console.log('   "Declutter my tabs" - Clean up Chrome tabs');
        console.log('   "Group my tabs" - Organize tabs by category');
        console.log('   "Save current session" - Bookmark current tabs');
        
        console.log('\n💻 Development Automations:');
        console.log('   "Analyze my code" - Code health check with learning');
        console.log('   "Generate project docs" - Auto-documentation');
        
        console.log('\n📝 Career Automations:');
        console.log('   "Build my resume" - Generate resume from GitHub');
        console.log('   "Generate portfolio" - Create portfolio content');
        
        console.log('\n💡 Innovation Automations:');
        console.log('   "Generate app ideas" - AI-powered idea generation');
        console.log('   "Research market for [idea]" - Market validation');
        
        console.log('\n🔄 Workflow Automations:');
        console.log('   "Start work session" - Begin productive work session');
        console.log('   "End work session" - Complete and archive session');
        console.log('   "Show session status" - Check current session');
        
        console.log('\n📊 System Commands:');
        console.log('   "Show system status" - Check all automation status');
        console.log('   "Help" - Show this help message');
    }

    async runInteractiveMode() {
        const readline = require('readline');
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        console.log('🎯 Automation Suite - Interactive Mode');
        console.log('Type "help" for commands, "exit" to quit\n');

        const askCommand = () => {
            rl.question('automation> ', async (input) => {
                if (input.toLowerCase() === 'exit') {
                    rl.close();
                    return;
                }
                
                if (input.trim()) {
                    await this.executeCommand(input.trim());
                    console.log(''); // Add spacing
                }
                
                askCommand();
            });
        };

        askCommand();
    }
}

// CLI Interface
if (require.main === module) {
    const controller = new AutomationController();
    const command = process.argv[2];
    const params = process.argv.slice(3);

    async function runCommand() {
        if (command === 'interactive') {
            await controller.runInteractiveMode();
        } else if (command) {
            await controller.executeCommand(command, params);
        } else {
            await controller.showSystemStatus();
        }
    }

    runCommand().catch(console.error);
}

module.exports = AutomationController;