/**
 * Automation Suite Web Interface - Frontend JavaScript
 */

class AutomationApp {
    constructor() {
        this.socket = null;
        this.currentSection = 'dashboard';
        this.systemStatus = null;
        this.init();
    }

    init() {
        this.setupSocket();
        this.setupEventListeners();
        this.setupNavigation();
        this.loadInitialData();
    }

    setupSocket() {
        this.socket = io();
        
        this.socket.on('connect', () => {
            console.log('Connected to automation server');
            this.updateConnectionStatus('connected');
            this.socket.emit('subscribe-updates');
        });

        this.socket.on('disconnect', () => {
            console.log('Disconnected from automation server');
            this.updateConnectionStatus('disconnected');
        });

        this.socket.on('system-status', (status) => {
            this.systemStatus = status;
            this.updateSystemStatus(status);
        });

        this.socket.on('system-update', (status) => {
            this.systemStatus = status;
            this.updateSystemStatus(status);
        });

        this.socket.on('command-result', (result) => {
            this.handleCommandResult(result);
        });
    }

    setupEventListeners() {
        // Settings button
        document.getElementById('settingsBtn').addEventListener('click', () => {
            this.playSound('click');
            this.showToast('Settings', 'Settings panel coming soon!', 'info');
        });

        // Add click sounds to all buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('nes-btn') || e.target.closest('.nes-btn')) {
                this.playSound('click');
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case '1':
                        e.preventDefault();
                        this.showSection('dashboard');
                        break;
                    case '2':
                        e.preventDefault();
                        this.showSection('music');
                        break;
                    case '3':
                        e.preventDefault();
                        this.showSection('tabs');
                        break;
                    case '4':
                        e.preventDefault();
                        this.showSection('code');
                        break;
                    case '5':
                        e.preventDefault();
                        this.showSection('resume');
                        break;
                    case '6':
                        e.preventDefault();
                        this.showSection('ideas');
                        break;
                    case '7':
                        e.preventDefault();
                        this.showSection('sessions');
                        break;
                    case '8':
                        e.preventDefault();
                        this.showSection('analytics');
                        break;
                }
            }
        });
    }

    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = item.dataset.section;
                this.showSection(section);
            });
        });
    }

    showSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });

        // Remove active class from nav items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });

        // Show selected section
        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.classList.add('active');
            this.currentSection = sectionName;
        }

        // Add active class to nav item
        const navItem = document.querySelector(`[data-section="${sectionName}"]`);
        if (navItem) {
            navItem.classList.add('active');
        }

        // Load section-specific data
        this.loadSectionData(sectionName);
    }

    loadSectionData(sectionName) {
        switch (sectionName) {
            case 'dashboard':
                this.loadDashboardData();
                break;
            case 'music':
                this.loadMusicData();
                break;
            case 'tabs':
                this.loadTabData();
                break;
            case 'code':
                this.loadCodeData();
                break;
            case 'resume':
                this.loadResumeData();
                break;
            case 'ideas':
                this.loadIdeasData();
                break;
            case 'sessions':
                this.loadSessionData();
                break;
            case 'analytics':
                this.loadAnalyticsData();
                break;
        }
    }

    async loadInitialData() {
        try {
            const response = await fetch('/api/status');
            const status = await response.json();
            this.systemStatus = status;
            this.updateSystemStatus(status);
        } catch (error) {
            console.error('Failed to load initial data:', error);
            this.showToast('Error', 'Failed to load system status', 'error');
        }
    }

    loadDashboardData() {
        if (this.systemStatus) {
            this.updateSystemStatus(this.systemStatus);
        }
    }

    loadMusicData() {
        if (this.systemStatus && this.systemStatus.automations.music) {
            this.updateMusicStatus(this.systemStatus.automations.music);
        }
    }

    loadTabData() {
        if (this.systemStatus && this.systemStatus.automations.tabs) {
            this.updateTabStatus(this.systemStatus.automations.tabs);
        }
    }

    loadCodeData() {
        if (this.systemStatus && this.systemStatus.automations.code) {
            this.updateCodeStatus(this.systemStatus.automations.code);
        }
    }

    loadResumeData() {
        if (this.systemStatus && this.systemStatus.automations.resume) {
            this.updateResumeStatus(this.systemStatus.automations.resume);
        }
    }

    loadIdeasData() {
        if (this.systemStatus && this.systemStatus.automations.ideas) {
            this.updateIdeasStatus(this.systemStatus.automations.ideas);
        }
    }

    loadSessionData() {
        if (this.systemStatus && this.systemStatus.automations.session) {
            this.updateSessionStatus(this.systemStatus.automations.session);
        }
    }

    loadAnalyticsData() {
        this.showAnalyticsTab('music');
    }

    updateConnectionStatus(status) {
        const statusElement = document.getElementById('connectionStatus');
        const icon = statusElement.querySelector('i');
        const text = statusElement.querySelector('span');

        statusElement.className = 'status-indicator';
        
        switch (status) {
            case 'connected':
                statusElement.classList.add('connected');
                icon.style.color = 'var(--retro-accent-green)';
                text.textContent = 'CONNECTED';
                this.playSound('success');
                break;
            case 'disconnected':
                statusElement.classList.add('disconnected');
                icon.style.color = 'var(--retro-accent-red)';
                text.textContent = 'DISCONNECTED';
                this.playSound('error');
                break;
            default:
                statusElement.classList.add('connecting');
                icon.style.color = 'var(--retro-accent-yellow)';
                text.textContent = 'CONNECTING...';
        }
    }

    updateSystemStatus(status) {
        // Update system info
        if (status.system) {
            document.getElementById('uptime').textContent = this.formatUptime(status.system.uptime);
            document.getElementById('memory').textContent = this.formatBytes(status.system.memory.heapUsed);
            document.getElementById('platform').textContent = status.system.platform;
        }

        // Update automation status
        this.updateAutomationStatus(status.automations);
    }

    updateAutomationStatus(automations) {
        const container = document.getElementById('automationStatus');
        container.innerHTML = '';

        const automationConfig = {
            music: { name: 'Music Control', icon: 'fas fa-music', color: '#3b82f6' },
            tabs: { name: 'Tab Management', icon: 'fas fa-window-restore', color: '#10b981' },
            code: { name: 'Code Analysis', icon: 'fas fa-code', color: '#f59e0b' },
            resume: { name: 'Resume Builder', icon: 'fas fa-file-alt', color: '#8b5cf6' },
            ideas: { name: 'App Ideas', icon: 'fas fa-lightbulb', color: '#ef4444' },
            session: { name: 'Work Sessions', icon: 'fas fa-clock', color: '#06b6d4' }
        };

        Object.entries(automations).forEach(([key, status]) => {
            const config = automationConfig[key];
            if (!config) return;

            const item = document.createElement('div');
            item.className = 'automation-item';
            
            if (status.error) {
                item.classList.add('error');
            } else if (!status.enabled) {
                item.classList.add('disabled');
            }

            item.innerHTML = `
                <div class="automation-icon" style="background-color: ${config.color}">
                    <i class="${config.icon}"></i>
                </div>
                <div class="automation-info">
                    <h4>${config.name}</h4>
                    <p>${status.error ? status.error : (status.enabled ? 'Enabled' : 'Disabled')}</p>
                </div>
            `;

            container.appendChild(item);
        });
    }

    updateMusicStatus(status) {
        const container = document.getElementById('musicStatus');
        if (!container) return;

        if (status.error) {
            container.innerHTML = `
                <div class="status-indicator error">
                    <i class="fas fa-circle"></i>
                    <span>Error: ${status.error}</span>
                </div>
            `;
        } else {
            container.innerHTML = `
                <div class="status-indicator ${status.isRunning ? 'connected' : 'disconnected'}">
                    <i class="fas fa-circle"></i>
                    <span>${status.isRunning ? 'Running' : 'Stopped'} - Current: ${status.currentContext}</span>
                </div>
            `;
        }
    }

    updateTabStatus(status) {
        if (status.error) {
            document.getElementById('tabCount').textContent = 'Error';
            document.getElementById('tabCategories').textContent = 'Error';
        } else {
            document.getElementById('tabCount').textContent = status.tabCount || '--';
            document.getElementById('tabCategories').textContent = 
                status.categories ? Object.keys(status.categories).length : '--';
        }
    }

    updateCodeStatus(status) {
        // Code status updates can be added here
    }

    updateResumeStatus(status) {
        if (status.error) {
            document.getElementById('repoCount').textContent = 'Error';
            document.getElementById('languageCount').textContent = 'Error';
            document.getElementById('projectCount').textContent = 'Error';
        } else {
            document.getElementById('repoCount').textContent = status.repositories || '--';
            document.getElementById('languageCount').textContent = 
                status.languages ? status.languages.length : '--';
            document.getElementById('projectCount').textContent = status.projects || '--';
        }
    }

    updateIdeasStatus(status) {
        // Ideas status updates can be added here
    }

    updateSessionStatus(status) {
        if (status.error) {
            document.getElementById('activeSession').textContent = 'Error';
            document.getElementById('recentSessions').textContent = 'Error';
        } else {
            document.getElementById('activeSession').textContent = 
                status.activeSession ? status.activeSession.type : 'None';
            document.getElementById('recentSessions').textContent = status.recentSessions || '--';
        }
    }

    async executeCommand(command, params = []) {
        this.showLoading(true);
        
        try {
            const response = await fetch('/api/execute', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ command, params })
            });

            const result = await response.json();
            
            if (result.success) {
                this.showToast('Success', 'Command executed successfully', 'success');
                this.addActivity(`Executed: ${command}`);
            } else {
                this.showToast('Error', result.error, 'error');
            }
        } catch (error) {
            this.showToast('Error', 'Failed to execute command', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    handleCommandResult(result) {
        this.showLoading(false);
        
        if (result.success) {
            this.showToast('Success', 'Command executed successfully', 'success');
            this.addActivity(`Executed command`);
        } else {
            this.showToast('Error', result.error, 'error');
        }
    }

    // Music Control Functions
    async startMusic() {
        await this.executeCommand('music start');
    }

    async stopMusic() {
        await this.executeCommand('music stop');
    }

    async switchMusicContext(context) {
        await this.executeCommand('music switch', [context]);
    }

    // Tab Management Functions
    async declutterTabs(mode = 'standard') {
        await this.executeCommand('tabs declutter', [mode]);
    }

    async groupTabs() {
        await this.executeCommand('tabs group');
    }

    async saveTabSession() {
        await this.executeCommand('tabs save', ['current']);
    }

    // Code Analysis Functions
    async analyzeCode() {
        const path = document.getElementById('projectPath').value || '.';
        await this.executeCommand('code analyze', [path]);
    }

    async generateDocs() {
        const path = document.getElementById('projectPath').value || '.';
        await this.executeCommand('code docs', [path]);
    }

    // Resume Builder Functions
    async buildResume() {
        await this.executeCommand('resume build');
    }

    async generatePortfolio() {
        await this.executeCommand('resume portfolio');
    }

    // App Ideas Functions
    async generateIdeas() {
        const count = document.getElementById('ideaCount').value || 5;
        const category = document.getElementById('ideaCategory').value || 'all';
        await this.executeCommand('ideas generate', [count, category]);
    }

    // Work Session Functions
    async startSession(type = 'default') {
        await this.executeCommand('session start', [type]);
    }

    async endSession() {
        await this.executeCommand('session end');
    }

    // Analytics Functions
    async showAnalyticsTab(type) {
        const container = document.getElementById('analyticsContent');
        container.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i><span>Loading analytics...</span></div>';

        try {
            const response = await fetch(`/api/analytics/${type}`);
            const data = await response.json();
            
            if (data.error) {
                container.innerHTML = `<div class="error">Error: ${data.error}</div>`;
            } else {
                container.innerHTML = this.formatAnalyticsData(data, type);
            }
        } catch (error) {
            container.innerHTML = `<div class="error">Failed to load analytics</div>`;
        }

        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[onclick="showAnalyticsTab('${type}')"]`).classList.add('active');
    }

    formatAnalyticsData(data, type) {
        switch (type) {
            case 'music':
                return `
                    <div class="analytics-section">
                        <h4>Music Usage</h4>
                        <p>Context switches: ${data.context_switches ? data.context_switches.length : 0}</p>
                        <p>Playlist usage: ${data.playlist_usage ? Object.keys(data.playlist_usage).length : 0} playlists</p>
                    </div>
                `;
            case 'tabs':
                return `
                    <div class="analytics-section">
                        <h4>Tab Management</h4>
                        <p>Total tabs: ${data.total_tabs || 0}</p>
                        <p>Categories: ${data.categories ? Object.keys(data.categories).length : 0}</p>
                        <p>Declutter actions: ${data.declutter_actions ? data.declutter_actions.length : 0}</p>
                    </div>
                `;
            case 'sessions':
                return `
                    <div class="analytics-section">
                        <h4>Work Sessions</h4>
                        <p>Sessions: ${data.sessions ? data.sessions.length : 0}</p>
                        <p>Total time: ${data.summary ? data.summary.total_time : '--'}</p>
                        <p>Average productivity: ${data.summary ? data.summary.average_productivity : '--'}%</p>
                    </div>
                `;
            default:
                return '<div class="error">Unknown analytics type</div>';
        }
    }

    // Utility Functions
    formatUptime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return `${hours}h ${minutes}m`;
    }

    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    showLoading(show) {
        const overlay = document.getElementById('loadingOverlay');
        if (show) {
            overlay.classList.add('show');
        } else {
            overlay.classList.remove('show');
        }
    }

    showToast(title, message, type = 'info') {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };

        toast.innerHTML = `
            <i class="${icons[type]}"></i>
            <div class="toast-content">
                <div class="toast-title">${title.toUpperCase()}</div>
                <div class="toast-message">${message.toUpperCase()}</div>
            </div>
            <button class="toast-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;

        container.appendChild(toast);
        this.playSound(type);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 5000);
    }

    addActivity(message) {
        const container = document.getElementById('recentActivity');
        const activity = document.createElement('div');
        activity.className = 'activity-item';
        
        activity.innerHTML = `
            <i class="fas fa-info-circle"></i>
            <span>${message.toUpperCase()}</span>
            <span class="time">JUST NOW</span>
        `;

        container.insertBefore(activity, container.firstChild);
        this.playSound('info');

        // Keep only last 10 activities
        while (container.children.length > 10) {
            container.removeChild(container.lastChild);
        }
    }

    // Retro Sound Effects
    playSound(type) {
        // Create audio context for retro sound effects
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        const ctx = this.audioContext;
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        // Different sound patterns for different types
        switch (type) {
            case 'success':
                oscillator.frequency.setValueAtTime(800, ctx.currentTime);
                oscillator.frequency.setValueAtTime(1000, ctx.currentTime + 0.1);
                oscillator.frequency.setValueAtTime(1200, ctx.currentTime + 0.2);
                gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
                oscillator.start(ctx.currentTime);
                oscillator.stop(ctx.currentTime + 0.3);
                break;
            case 'error':
                oscillator.frequency.setValueAtTime(200, ctx.currentTime);
                oscillator.frequency.setValueAtTime(150, ctx.currentTime + 0.1);
                oscillator.frequency.setValueAtTime(100, ctx.currentTime + 0.2);
                gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
                oscillator.start(ctx.currentTime);
                oscillator.stop(ctx.currentTime + 0.3);
                break;
            case 'warning':
                oscillator.frequency.setValueAtTime(400, ctx.currentTime);
                oscillator.frequency.setValueAtTime(600, ctx.currentTime + 0.1);
                gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
                oscillator.start(ctx.currentTime);
                oscillator.stop(ctx.currentTime + 0.2);
                break;
            case 'info':
                oscillator.frequency.setValueAtTime(600, ctx.currentTime);
                gainNode.gain.setValueAtTime(0.05, ctx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
                oscillator.start(ctx.currentTime);
                oscillator.stop(ctx.currentTime + 0.1);
                break;
            case 'click':
                oscillator.frequency.setValueAtTime(1000, ctx.currentTime);
                gainNode.gain.setValueAtTime(0.05, ctx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
                oscillator.start(ctx.currentTime);
                oscillator.stop(ctx.currentTime + 0.05);
                break;
        }
    }
}

// Global functions for HTML onclick handlers
function executeCommand(command) {
    if (window.automationApp) {
        window.automationApp.executeCommand(command);
    }
}

function startMusic() {
    if (window.automationApp) {
        window.automationApp.startMusic();
    }
}

function stopMusic() {
    if (window.automationApp) {
        window.automationApp.stopMusic();
    }
}

function switchMusicContext(context) {
    if (window.automationApp) {
        window.automationApp.switchMusicContext(context);
    }
}

function declutterTabs(mode) {
    if (window.automationApp) {
        window.automationApp.declutterTabs(mode);
    }
}

function groupTabs() {
    if (window.automationApp) {
        window.automationApp.groupTabs();
    }
}

function saveTabSession() {
    if (window.automationApp) {
        window.automationApp.saveTabSession();
    }
}

function analyzeCode() {
    if (window.automationApp) {
        window.automationApp.analyzeCode();
    }
}

function generateDocs() {
    if (window.automationApp) {
        window.automationApp.generateDocs();
    }
}

function buildResume() {
    if (window.automationApp) {
        window.automationApp.buildResume();
    }
}

function generatePortfolio() {
    if (window.automationApp) {
        window.automationApp.generatePortfolio();
    }
}

function generateIdeas() {
    if (window.automationApp) {
        window.automationApp.generateIdeas();
    }
}

function startSession(type) {
    if (window.automationApp) {
        window.automationApp.startSession(type);
    }
}

function endSession() {
    if (window.automationApp) {
        window.automationApp.endSession();
    }
}

function showAnalyticsTab(type) {
    if (window.automationApp) {
        window.automationApp.showAnalyticsTab(type);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.automationApp = new AutomationApp();
});