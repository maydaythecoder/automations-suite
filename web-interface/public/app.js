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
                    case '0':
                        e.preventDefault();
                        this.showSection('marketplace');
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
                this.checkVisualizerStatus();
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
            case 'marketplace':
                this.loadMarketplaceData();
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
            
            // Auto-start visualizer if we have track data
            if (this.systemStatus.automations.music.currentTrack && 
                !this.systemStatus.automations.music.currentTrack.error) {
                this.autoStartVisualizer(this.systemStatus.automations.music.currentTrack);
            }
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

            // Auto-restart visualizer with new track data
            if (status.currentTrack && !status.currentTrack.error) {
                this.autoStartVisualizer(status.currentTrack);
            }
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

    // Marketplace Methods
    async loadMarketplaceData() {
        try {
            // Load featured automations
            const featuredResponse = await fetch('/api/marketplace/featured?limit=6');
            const featuredAutomations = await featuredResponse.json();
            this.loadFeaturedAutomations(featuredAutomations);

            // Load categories
            const categoriesResponse = await fetch('/api/marketplace/categories');
            const categoriesData = await categoriesResponse.json();
            this.loadCategories(categoriesData);

            // Setup marketplace event listeners
            this.setupMarketplaceEvents();
        } catch (error) {
            console.error('Failed to load marketplace data:', error);
            this.showToast('Error', 'Failed to load marketplace data', 'error');
        }
    }

    loadFeaturedAutomations(automations) {
        const container = document.getElementById('featuredAutomations');
        container.innerHTML = '';

        automations.forEach(automation => {
            const card = document.createElement('div');
            card.className = 'automation-card';
            card.innerHTML = `
                <div class="category-badge">${automation.category}</div>
                <h4>${automation.name}</h4>
                <p>${automation.description}</p>
                <div class="author">by ${automation.authorDisplayName || automation.author}</div>
                <div class="stats">
                    <span>📥 ${automation.stats.downloads}</span>
                    <span>⭐ ${automation.stats.rating.toFixed(1)}</span>
                    <span>📅 ${new Date(automation.createdAt).toLocaleDateString()}</span>
                </div>
                <div class="actions">
                    <button class="nes-btn is-primary" onclick="viewAutomation('${automation.id}')">
                        <i class="fas fa-eye"></i>
                        VIEW
                    </button>
                    <button class="nes-btn is-success" onclick="installAutomation('${automation.id}')">
                        <i class="fas fa-download"></i>
                        INSTALL
                    </button>
                </div>
            `;

            container.appendChild(card);
        });
    }

    loadCategories(categoriesData) {
        const container = document.getElementById('categoriesGrid');
        container.innerHTML = '';

        Object.entries(categoriesData.categories).forEach(([key, category]) => {
            const stats = categoriesData.stats[key] || { count: 0 };
            const card = document.createElement('div');
            card.className = 'category-card';
            card.innerHTML = `
                <i class="${category.icon} icon" style="color: ${category.color}"></i>
                <h4>${category.name}</h4>
                <p>${category.description}</p>
                <div class="count">${stats.count} automations</div>
            `;

            card.addEventListener('click', () => {
                this.browseCategory(key);
            });

            container.appendChild(card);
        });
    }

    async browseCategory(category) {
        try {
            const response = await fetch(`/api/marketplace/category/${category}?limit=20`);
            const automations = await response.json();
            this.showSearchResults(automations, `Category: ${category}`);
        } catch (error) {
            this.showToast('Error', 'Failed to load category automations', 'error');
        }
    }

    async searchMarketplace() {
        const query = document.getElementById('marketplaceSearch').value;
        const category = document.getElementById('categoryFilter').value;
        const sortBy = document.getElementById('sortBy').value;

        try {
            const params = new URLSearchParams();
            if (query) params.append('q', query);
            if (category) params.append('category', category);
            if (sortBy) params.append('sortBy', sortBy);

            const response = await fetch(`/api/marketplace/search?${params}`);
            const automations = await response.json();
            this.showSearchResults(automations, query ? `Search: "${query}"` : 'All Automations');
        } catch (error) {
            this.showToast('Error', 'Search failed', 'error');
        }
    }

    showSearchResults(automations, title) {
        const container = document.getElementById('searchResults');
        const resultsContainer = document.getElementById('searchResultsContainer');
        
        container.innerHTML = '';
        
        if (automations.length === 0) {
            container.innerHTML = '<p>No automations found.</p>';
        } else {
            automations.forEach(automation => {
                const item = document.createElement('div');
                item.className = 'search-result-item';
                item.innerHTML = `
                    <h4>${automation.name}</h4>
                    <p>${automation.description}</p>
                    <div class="meta">
                        <span>by ${automation.authorDisplayName || automation.author}</span>
                        <span>📥 ${automation.stats.downloads} • ⭐ ${automation.stats.rating.toFixed(1)}</span>
                    </div>
                `;

                item.addEventListener('click', () => {
                    this.viewAutomation(automation.id);
                });

                container.appendChild(item);
            });
        }

        resultsContainer.style.display = 'block';
        resultsContainer.querySelector('.title').textContent = title;
    }

    async viewAutomation(automationId) {
        try {
            const response = await fetch(`/api/marketplace/automation/${automationId}`);
            const automation = await response.json();
            this.showAutomationDetails(automation);
        } catch (error) {
            this.showToast('Error', 'Failed to load automation details', 'error');
        }
    }

    showAutomationDetails(automation) {
        const modal = document.getElementById('automationModal');
        const detailsContainer = document.getElementById('automationDetails');
        
        detailsContainer.innerHTML = `
            <div class="automation-header">
                <div class="automation-title">
                    <h2>${automation.name}</h2>
                    <div class="author">by ${automation.authorDisplayName || automation.author}</div>
                    <div class="description">${automation.longDescription || automation.description}</div>
                </div>
                <div class="automation-stats">
                    <div class="stat">
                        <span class="stat-value">${automation.stats.downloads}</span>
                        <span>DOWNLOADS</span>
                    </div>
                    <div class="stat">
                        <span class="stat-value">${automation.stats.rating.toFixed(1)}</span>
                        <span>RATING</span>
                    </div>
                    <div class="stat">
                        <span class="stat-value">${automation.stats.installs}</span>
                        <span>INSTALLS</span>
                    </div>
                </div>
            </div>
            
            <div class="automation-info">
                <div>
                    <h4>DETAILS</h4>
                    <p><strong>Version:</strong> ${automation.version}</p>
                    <p><strong>Category:</strong> ${automation.category}</p>
                    <p><strong>License:</strong> ${automation.license}</p>
                    <p><strong>Created:</strong> ${new Date(automation.createdAt).toLocaleDateString()}</p>
                    <p><strong>Updated:</strong> ${new Date(automation.updatedAt).toLocaleDateString()}</p>
                </div>
                <div>
                    <h4>TAGS</h4>
                    <div class="automation-tags">
                        ${automation.tags.map(tag => `<span class="automation-tag">${tag}</span>`).join('')}
                    </div>
                    ${automation.dependencies.length > 0 ? `
                        <h4>DEPENDENCIES</h4>
                        <p>${automation.dependencies.join(', ')}</p>
                    ` : ''}
                </div>
            </div>
            
            ${automation.documentation ? `
                <div>
                    <h4>DOCUMENTATION</h4>
                    <p>${automation.documentation}</p>
                </div>
            ` : ''}
            
            <div class="automation-actions">
                <button class="nes-btn is-primary" onclick="installAutomation('${automation.id}')">
                    <i class="fas fa-download"></i>
                    INSTALL AUTOMATION
                </button>
                <button class="nes-btn" onclick="downloadAutomation('${automation.id}')">
                    <i class="fas fa-download"></i>
                    DOWNLOAD
                </button>
            </div>
        `;

        modal.classList.add('show');
    }

    async installAutomation(automationId) {
        // Check if user is authenticated
        if (!this.currentUser) {
            this.showAuthModal();
            return;
        }

        try {
            const response = await fetch(`/api/marketplace/automation/${automationId}/install`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.authToken}`,
                    'Content-Type': 'application/json'
                }
            });

            const result = await response.json();
            if (result.success) {
                this.showToast('Success', 'Automation installed successfully!', 'success');
            } else {
                this.showToast('Error', result.error, 'error');
            }
        } catch (error) {
            this.showToast('Error', 'Failed to install automation', 'error');
        }
    }

    async downloadAutomation(automationId) {
        try {
            const response = await fetch(`/api/marketplace/automation/${automationId}/download`, {
                method: 'POST'
            });

            const result = await response.json();
            if (result.success) {
                this.showToast('Success', 'Automation downloaded!', 'success');
            } else {
                this.showToast('Error', result.error, 'error');
            }
        } catch (error) {
            this.showToast('Error', 'Failed to download automation', 'error');
        }
    }

    // Authentication Methods
    showAuthModal() {
        const modal = document.getElementById('authModal');
        modal.classList.add('show');
    }

    hideAuthModal() {
        const modal = document.getElementById('authModal');
        modal.classList.remove('show');
    }

    showLoginForm() {
        document.getElementById('loginForm').style.display = 'block';
        document.getElementById('registerForm').style.display = 'none';
        document.getElementById('authModalTitle').textContent = 'LOGIN';
    }

    showRegisterForm() {
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('registerForm').style.display = 'block';
        document.getElementById('authModalTitle').textContent = 'CREATE ACCOUNT';
    }

    async loginUser() {
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;

        if (!username || !password) {
            this.showToast('Error', 'Please fill in all fields', 'error');
            return;
        }

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const result = await response.json();
            if (result.success) {
                this.currentUser = result.user;
                this.authToken = result.sessionToken;
                this.hideAuthModal();
                this.showToast('Success', `Welcome back, ${result.user.displayName}!`, 'success');
                this.updateUserInterface();
            } else {
                this.showToast('Error', result.error, 'error');
            }
        } catch (error) {
            this.showToast('Error', 'Login failed', 'error');
        }
    }

    async registerUser() {
        const username = document.getElementById('registerUsername').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const displayName = document.getElementById('registerDisplayName').value;

        if (!username || !email || !password) {
            this.showToast('Error', 'Please fill in all required fields', 'error');
            return;
        }

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password, displayName })
            });

            const result = await response.json();
            if (result.success) {
                this.showToast('Success', 'Account created successfully! Please login.', 'success');
                this.showLoginForm();
            } else {
                this.showToast('Error', result.error, 'error');
            }
        } catch (error) {
            this.showToast('Error', 'Registration failed', 'error');
        }
    }

    updateUserInterface() {
        // Update header to show user info
        const headerActions = document.querySelector('.header-actions');
        if (this.currentUser) {
            // Add user info to header
            const userInfo = document.createElement('div');
            userInfo.className = 'user-info';
            userInfo.innerHTML = `
                <span>👤 ${this.currentUser.displayName}</span>
                <button class="nes-btn" onclick="logoutUser()">LOGOUT</button>
            `;
            headerActions.insertBefore(userInfo, headerActions.firstChild);
        }
    }

    async logoutUser() {
        try {
            await fetch('/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.authToken}`
                }
            });

            this.currentUser = null;
            this.authToken = null;
            this.showToast('Success', 'Logged out successfully', 'success');
            this.updateUserInterface();
        } catch (error) {
            this.showToast('Error', 'Logout failed', 'error');
        }
    }

    setupMarketplaceEvents() {
        // Auth modal close
        document.getElementById('authModalClose').addEventListener('click', () => {
            this.hideAuthModal();
        });

        // Automation modal close
        document.getElementById('automationModalClose').addEventListener('click', () => {
            document.getElementById('automationModal').classList.remove('show');
        });

        // Close modals when clicking outside
        document.getElementById('authModal').addEventListener('click', (e) => {
            if (e.target.id === 'authModal') {
                this.hideAuthModal();
            }
        });

        document.getElementById('automationModal').addEventListener('click', (e) => {
            if (e.target.id === 'automationModal') {
                document.getElementById('automationModal').classList.remove('show');
            }
        });

        // Search on Enter key
        document.getElementById('marketplaceSearch').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchMarketplace();
            }
        });
    }

    // Music Visualizer Methods
    async autoStartVisualizer(trackData) {
        try {
            // Start visualizer with track data
            const visualizerResponse = await fetch('/api/music/visualizer/start', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(trackData)
            });

            const result = await visualizerResponse.json();
            
            if (result.success) {
                this.updateVisualizerDisplay(result.visualization, true);
            } else {
                console.log('Failed to start visualizer:', result.error);
                this.updateVisualizerDisplay(null, false);
            }
        } catch (error) {
            console.log('Error starting visualizer:', error);
            this.updateVisualizerDisplay(null, false);
        }
    }

    async startVisualizer() {
        try {
            // Get current track data
            const response = await fetch('/api/music/status');
            const musicData = await response.json();
            
            if (musicData.error || !musicData.currentTrack) {
                this.showToast('Error', 'No track data available for visualization', 'error');
                return;
            }

            const trackData = musicData.currentTrack;
            await this.autoStartVisualizer(trackData);
            this.showToast('Success', 'Music visualizer started!', 'success');
        } catch (error) {
            this.showToast('Error', 'Failed to start visualizer', 'error');
        }
    }

    async stopVisualizer() {
        try {
            const response = await fetch('/api/music/visualizer/stop', {
                method: 'POST'
            });

            const result = await response.json();
            
            if (result.success) {
                this.updateVisualizerDisplay(null, false);
                this.showToast('Success', 'Music visualizer stopped', 'success');
            } else {
                this.showToast('Error', 'Failed to stop visualizer', 'error');
            }
        } catch (error) {
            this.showToast('Error', 'Failed to stop visualizer', 'error');
        }
    }

    updateVisualizerDisplay(visualization, isActive) {
        const container = document.getElementById('visualizerContainer');
        const statusElement = document.getElementById('visualizerStatus');
        
        if (isActive && visualization) {
            container.innerHTML = `
                <img src="${visualization}" alt="Music Visualization" class="visualizer-image">
                <div class="visualizer-overlay"></div>
            `;
            container.parentElement.classList.add('visualizer-active');
            
            statusElement.innerHTML = `
                <div class="status-indicator connected">
                    <i class="fas fa-circle"></i>
                    <span>VISUALIZER ACTIVE</span>
                </div>
            `;
        } else {
            container.innerHTML = `
                <div class="visualizer-placeholder">
                    <i class="fas fa-magic"></i>
                    <p>Start the visualizer to see animated music visualization</p>
                    <p class="visualizer-info">Analyzes track mood, tempo, and colors to create dynamic visuals</p>
                </div>
            `;
            container.parentElement.classList.remove('visualizer-active');
            
            statusElement.innerHTML = `
                <div class="status-indicator">
                    <i class="fas fa-circle"></i>
                    <span>VISUALIZER INACTIVE</span>
                </div>
            `;
        }
    }

    async checkVisualizerStatus() {
        try {
            const response = await fetch('/api/music/visualizer/status');
            const data = await response.json();
            
            if (data.isActive && data.visualization) {
                this.updateVisualizerDisplay(data.visualization, true);
            } else {
                this.updateVisualizerDisplay(null, false);
            }
        } catch (error) {
            // Silently handle errors for status checks
        }
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

// Marketplace global functions
function searchMarketplace() {
    if (window.automationApp) {
        window.automationApp.searchMarketplace();
    }
}

function viewAutomation(id) {
    if (window.automationApp) {
        window.automationApp.viewAutomation(id);
    }
}

function installAutomation(id) {
    if (window.automationApp) {
        window.automationApp.installAutomation(id);
    }
}

function downloadAutomation(id) {
    if (window.automationApp) {
        window.automationApp.downloadAutomation(id);
    }
}

function loginUser() {
    if (window.automationApp) {
        window.automationApp.loginUser();
    }
}

function registerUser() {
    if (window.automationApp) {
        window.automationApp.registerUser();
    }
}

function showLoginForm() {
    if (window.automationApp) {
        window.automationApp.showLoginForm();
    }
}

function showRegisterForm() {
    if (window.automationApp) {
        window.automationApp.showRegisterForm();
    }
}

function logoutUser() {
    if (window.automationApp) {
        window.automationApp.logoutUser();
    }
}

// Visualizer global functions
function startVisualizer() {
    if (window.automationApp) {
        window.automationApp.startVisualizer();
    }
}

function stopVisualizer() {
    if (window.automationApp) {
        window.automationApp.stopVisualizer();
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.automationApp = new AutomationApp();
});