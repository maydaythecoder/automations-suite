/**
 * Automation Suite Web Interface - Frontend JavaScript
 */

class AutomationApp {
    constructor() {
        this.socket = null;
        this.currentSection = 'dashboard';
        this.systemStatus = null;
        this.currentWalkthrough = null;
        this.currentStep = null;
        this.terminalHistory = [];
        this.init();
    }

    init() {
        this.setupSocket();
        this.setupEventListeners();
        this.setupNavigation();
        this.setupWalkthrough();
        this.setupTerminal();
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

        // Walkthrough button
        document.getElementById('walkthroughBtn').addEventListener('click', () => {
            this.playSound('click');
            this.showWalkthroughModal();
        });

        // Terminal button
        document.getElementById('terminalBtn').addEventListener('click', () => {
            this.playSound('click');
            this.showTerminalModal();
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
                    case '9':
                        e.preventDefault();
                        this.showSection('help');
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
            case 'help':
                this.loadHelpData();
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
        
        // Start periodic track updates if music is running
        this.startMusicTrackUpdates();
    }

    startMusicTrackUpdates() {
        // Clear existing interval
        if (this.musicUpdateInterval) {
            clearInterval(this.musicUpdateInterval);
        }
        
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

    async loadHelpData() {
        try {
            const response = await fetch('/api/terminal/categories');
            const categories = await response.json();
            this.loadCommandCategories(categories);
        } catch (error) {
            console.error('Failed to load help data:', error);
        }
    }

    loadCommandCategories(categories) {
        const container = document.getElementById('commandCategories');
        container.innerHTML = '';

        categories.forEach(category => {
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'command-category';
            categoryDiv.innerHTML = `
                <h5>${category.category}</h5>
                <p>${category.description}</p>
                <div class="command-list" style="display: none;">
                    ${category.commands.map(cmd => `
                        <div class="command-item">
                            <span class="command">${cmd.command}</span>
                            <span class="description">${cmd.description}</span>
                        </div>
                    `).join('')}
                </div>
            `;

            categoryDiv.addEventListener('click', () => {
                const commandList = categoryDiv.querySelector('.command-list');
                const isVisible = commandList.style.display !== 'none';
                
                // Hide all other command lists
                container.querySelectorAll('.command-list').forEach(list => {
                    list.style.display = 'none';
                });
                
                // Toggle current command list
                commandList.style.display = isVisible ? 'none' : 'flex';
            });

            container.appendChild(categoryDiv);
        });
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
            let statusText = `${status.isRunning ? 'Running' : 'Stopped'} - Context: ${status.currentContext}`;
            let statusClass = status.isRunning ? 'connected' : 'disconnected';
            
            // Add Spotify status
            if (status.spotifyRunning !== undefined) {
                statusText += ` - Spotify: ${status.spotifyRunning ? 'Running' : 'Not Running'}`;
            }
            
            // Add current track info
            let trackInfo = '';
            if (status.currentTrack) {
                if (status.currentTrack.error) {
                    trackInfo = `<div class="track-info error">❌ ${status.currentTrack.error}</div>`;
                } else if (status.currentTrack.track) {
                    trackInfo = `<div class="track-info">🎵 ${status.currentTrack.track}</div>`;
                }
            }
            
            container.innerHTML = `
                <div class="status-indicator ${statusClass}">
                    <i class="fas fa-circle"></i>
                    <span>${statusText}</span>
                </div>
                ${trackInfo}
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

    // Walkthrough Methods
    setupWalkthrough() {
        // Walkthrough modal close
        document.getElementById('walkthroughClose').addEventListener('click', () => {
            this.hideWalkthroughModal();
        });

        // Walkthrough navigation
        document.getElementById('walkthroughNext').addEventListener('click', () => {
            this.nextWalkthroughStep();
        });

        document.getElementById('walkthroughPrevious').addEventListener('click', () => {
            this.previousWalkthroughStep();
        });

        document.getElementById('walkthroughSkip').addEventListener('click', () => {
            this.skipWalkthrough();
        });

        // Close modal when clicking outside
        document.getElementById('walkthroughModal').addEventListener('click', (e) => {
            if (e.target.id === 'walkthroughModal') {
                this.hideWalkthroughModal();
            }
        });
    }

    async showWalkthroughModal() {
        const modal = document.getElementById('walkthroughModal');
        modal.classList.add('show');
        
        try {
            const response = await fetch('/api/walkthroughs');
            const walkthroughs = await response.json();
            this.loadWalkthroughList(walkthroughs);
        } catch (error) {
            this.showToast('Error', 'Failed to load walkthroughs', 'error');
        }
    }

    hideWalkthroughModal() {
        const modal = document.getElementById('walkthroughModal');
        modal.classList.remove('show');
    }

    loadWalkthroughList(walkthroughs) {
        const container = document.getElementById('walkthroughList');
        container.innerHTML = '';

        walkthroughs.forEach(walkthrough => {
            const item = document.createElement('div');
            item.className = 'walkthrough-item';
            if (walkthrough.completed) {
                item.classList.add('completed');
            }

            item.innerHTML = `
                <h5>${walkthrough.title}</h5>
                <p>${walkthrough.description}</p>
                <div class="walkthrough-meta">
                    <span>⏱️ ${walkthrough.estimatedTime}</span>
                    <span>📊 ${walkthrough.difficulty}</span>
                    <span>📝 ${walkthrough.totalSteps} steps</span>
                </div>
            `;

            item.addEventListener('click', () => {
                this.startWalkthrough(walkthrough.id);
            });

            container.appendChild(item);
        });
    }

    async startWalkthrough(walkthroughId) {
        try {
            const response = await fetch(`/api/walkthroughs/${walkthroughId}/start`, {
                method: 'POST'
            });
            const walkthrough = await response.json();
            
            this.currentWalkthrough = walkthroughId;
            this.showWalkthroughProgress();
            this.loadCurrentStep();
        } catch (error) {
            this.showToast('Error', 'Failed to start walkthrough', 'error');
        }
    }

    showWalkthroughProgress() {
        document.getElementById('walkthroughSelection').style.display = 'none';
        document.getElementById('walkthroughProgress').style.display = 'block';
    }

    async loadCurrentStep() {
        try {
            const response = await fetch('/api/walkthroughs/current');
            const step = await response.json();
            
            if (step) {
                this.currentStep = step;
                this.updateWalkthroughStep(step);
            } else {
                this.completeWalkthrough();
            }
        } catch (error) {
            this.showToast('Error', 'Failed to load walkthrough step', 'error');
        }
    }

    updateWalkthroughStep(step) {
        document.getElementById('walkthroughStepTitle').textContent = step.title;
        document.getElementById('walkthroughStepDescription').textContent = step.content;
        document.getElementById('walkthroughStepCounter').textContent = `${step.stepNumber} / ${step.totalSteps}`;
        
        const progressFill = document.getElementById('walkthroughProgressFill');
        const progress = (step.stepNumber / step.totalSteps) * 100;
        progressFill.style.width = `${progress}%`;

        // Highlight target element if it exists
        if (step.target) {
            this.highlightElement(step.target);
        }
    }

    highlightElement(selector) {
        // Remove previous highlights
        document.querySelectorAll('.walkthrough-highlight').forEach(el => {
            el.classList.remove('walkthrough-highlight');
        });

        const element = document.querySelector(selector);
        if (element) {
            element.classList.add('walkthrough-highlight');
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    async nextWalkthroughStep() {
        try {
            const response = await fetch('/api/walkthroughs/next', {
                method: 'POST'
            });
            const step = await response.json();
            
            if (step) {
                this.currentStep = step;
                this.updateWalkthroughStep(step);
            } else {
                this.completeWalkthrough();
            }
        } catch (error) {
            this.showToast('Error', 'Failed to advance walkthrough', 'error');
        }
    }

    async previousWalkthroughStep() {
        try {
            const response = await fetch('/api/walkthroughs/previous', {
                method: 'POST'
            });
            const step = await response.json();
            
            if (step) {
                this.currentStep = step;
                this.updateWalkthroughStep(step);
            }
        } catch (error) {
            this.showToast('Error', 'Failed to go back in walkthrough', 'error');
        }
    }

    async skipWalkthrough() {
        try {
            await fetch('/api/walkthroughs/skip', {
                method: 'POST'
            });
            this.completeWalkthrough();
        } catch (error) {
            this.showToast('Error', 'Failed to skip walkthrough', 'error');
        }
    }

    completeWalkthrough() {
        this.showToast('Success', 'Walkthrough completed!', 'success');
        this.hideWalkthroughModal();
        this.currentWalkthrough = null;
        this.currentStep = null;
    }

    // Terminal Methods
    setupTerminal() {
        // Terminal modal close
        document.getElementById('terminalClose').addEventListener('click', () => {
            this.hideTerminalModal();
        });

        // Terminal input
        const terminalInput = document.getElementById('terminalInput');
        terminalInput.addEventListener('keydown', (e) => {
            this.handleTerminalKeydown(e);
        });

        terminalInput.addEventListener('input', (e) => {
            this.handleTerminalInput(e);
        });

        // Close modal when clicking outside
        document.getElementById('terminalModal').addEventListener('click', (e) => {
            if (e.target.id === 'terminalModal') {
                this.hideTerminalModal();
            }
        });

        // Load terminal data
        this.loadTerminalData();
    }

    async showTerminalModal() {
        const modal = document.getElementById('terminalModal');
        modal.classList.add('show');
        
        // Focus on input
        setTimeout(() => {
            document.getElementById('terminalInput').focus();
        }, 100);
    }

    hideTerminalModal() {
        const modal = document.getElementById('terminalModal');
        modal.classList.remove('show');
    }

    async loadTerminalData() {
        try {
            // Load quick commands
            const quickResponse = await fetch('/api/terminal/quick-commands');
            const quickCommands = await quickResponse.json();
            this.loadQuickCommands(quickCommands);

            // Load recent commands
            const recentResponse = await fetch('/api/terminal/recent');
            const recentCommands = await recentResponse.json();
            this.loadRecentCommands(recentCommands);
        } catch (error) {
            console.error('Failed to load terminal data:', error);
        }
    }

    loadQuickCommands(commands) {
        const container = document.getElementById('quickCommandGrid');
        container.innerHTML = '';

        commands.forEach(cmd => {
            const item = document.createElement('div');
            item.className = 'quick-command-item';
            item.innerHTML = `
                <span class="icon">${cmd.icon}</span>
                <div>${cmd.description}</div>
            `;

            item.addEventListener('click', () => {
                this.executeTerminalCommand(cmd.command);
            });

            container.appendChild(item);
        });
    }

    loadRecentCommands(commands) {
        const container = document.getElementById('historyList');
        container.innerHTML = '';

        commands.forEach(cmd => {
            const item = document.createElement('div');
            item.className = 'history-item';
            item.innerHTML = `
                <span class="command">${cmd.command}</span>
                <span class="status ${cmd.success ? 'success' : 'error'}">
                    ${cmd.success ? 'SUCCESS' : 'ERROR'}
                </span>
            `;

            item.addEventListener('click', () => {
                document.getElementById('terminalInput').value = cmd.command;
            });

            container.appendChild(item);
        });
    }

    handleTerminalKeydown(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const command = e.target.value.trim();
            if (command) {
                this.executeTerminalCommand(command);
                e.target.value = '';
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            // Navigate command history
        } else if (e.key === 'Tab') {
            e.preventDefault();
            // Auto-complete
        }
    }

    async handleTerminalInput(e) {
        const query = e.target.value;
        if (query.length > 0) {
            try {
                const response = await fetch(`/api/terminal/suggestions?q=${encodeURIComponent(query)}`);
                const suggestions = await response.json();
                this.showCommandSuggestions(suggestions);
            } catch (error) {
                console.error('Failed to load suggestions:', error);
            }
        } else {
            this.hideCommandSuggestions();
        }
    }

    showCommandSuggestions(suggestions) {
        const container = document.getElementById('terminalSuggestions');
        container.innerHTML = '';

        if (suggestions.length > 0) {
            const title = document.createElement('h4');
            title.textContent = 'SUGGESTIONS';
            container.appendChild(title);

            suggestions.slice(0, 5).forEach(suggestion => {
                const item = document.createElement('div');
                item.className = 'suggestion-item';
                item.innerHTML = `
                    <span class="command">${suggestion.command}</span>
                    <span class="description">${suggestion.description}</span>
                `;

                item.addEventListener('click', () => {
                    document.getElementById('terminalInput').value = suggestion.command;
                    this.hideCommandSuggestions();
                });

                container.appendChild(item);
            });
        }
    }

    hideCommandSuggestions() {
        const container = document.getElementById('terminalSuggestions');
        container.innerHTML = '';
    }

    async executeTerminalCommand(command) {
        this.addTerminalOutput(`automation-suite@localhost:~$ ${command}`);
        
        try {
            const response = await fetch('/api/terminal/execute', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ command })
            });

            const result = await response.json();
            
            if (result.success) {
                this.addTerminalOutput(`✓ Command executed successfully`);
                if (result.result) {
                    this.addTerminalOutput(result.result);
                }
            } else {
                this.addTerminalOutput(`✗ Error: ${result.error}`);
            }
        } catch (error) {
            this.addTerminalOutput(`✗ Error: ${error.message}`);
        }

        // Reload recent commands
        this.loadTerminalData();
    }

    addTerminalOutput(text) {
        const container = document.getElementById('terminalOutput');
        const line = document.createElement('div');
        line.className = 'terminal-line';
        
        if (text.startsWith('automation-suite@localhost:~$')) {
            line.innerHTML = `
                <span class="terminal-prompt">automation-suite@localhost:~$</span>
                <span class="terminal-text">${text.replace('automation-suite@localhost:~$ ', '')}</span>
            `;
        } else {
            line.innerHTML = `<span class="terminal-text">${text}</span>`;
        }

        container.appendChild(line);
        container.scrollTop = container.scrollHeight;
    }

    // Cleanup method
    destroy() {
        if (this.musicUpdateInterval) {
            clearInterval(this.musicUpdateInterval);
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