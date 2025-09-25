#!/usr/bin/env node

/**
 * Walkthrough System for Automation Suite
 * Provides guided tours and step-by-step tutorials
 */

const fs = require('fs');
const path = require('path');

class WalkthroughSystem {
    constructor() {
        this.walkthroughs = this.loadWalkthroughs();
        this.userProgress = this.loadUserProgress();
        this.currentWalkthrough = null;
        this.currentStep = 0;
    }

    loadWalkthroughs() {
        return {
            'getting-started': {
                title: 'Getting Started with Automation Suite',
                description: 'Learn the basics of using your automation suite',
                estimatedTime: '5 minutes',
                difficulty: 'beginner',
                steps: [
                    {
                        id: 'welcome',
                        title: 'Welcome to Automation Suite',
                        description: 'Let\'s explore your automation dashboard',
                        target: '#dashboard',
                        action: 'highlight',
                        content: 'This is your main dashboard where you can see the status of all your automations and perform quick actions.',
                        nextAction: 'click',
                        nextTarget: '.nav-item[data-section="music"]'
                    },
                    {
                        id: 'music-control',
                        title: 'Music Control',
                        description: 'Learn how to control your smart music automation',
                        target: '#music',
                        action: 'highlight',
                        content: 'The music control section lets you start, stop, and switch between different music contexts based on your work activity.',
                        nextAction: 'click',
                        nextTarget: '.nes-btn[onclick="startMusic()"]'
                    },
                    {
                        id: 'start-music',
                        title: 'Start Smart Music',
                        description: 'Start your first automation',
                        target: '.nes-btn[onclick="startMusic()"]',
                        action: 'highlight',
                        content: 'Click this button to start the smart music automation. It will automatically detect your work context and play appropriate music.',
                        nextAction: 'click',
                        nextTarget: '.nav-item[data-section="tabs"]'
                    },
                    {
                        id: 'tab-management',
                        title: 'Tab Management',
                        description: 'Organize your browser tabs intelligently',
                        target: '#tabs',
                        action: 'highlight',
                        content: 'The tab management section helps you declutter and organize your browser tabs automatically.',
                        nextAction: 'click',
                        nextTarget: '.nes-btn[onclick="declutterTabs(\'standard\')"]'
                    },
                    {
                        id: 'declutter-tabs',
                        title: 'Declutter Tabs',
                        description: 'Clean up your browser tabs',
                        target: '.nes-btn[onclick="declutterTabs(\'standard\')"]',
                        action: 'highlight',
                        content: 'This will analyze your open tabs and close duplicates, organize them into groups, and help you focus.',
                        nextAction: 'click',
                        nextTarget: '.nav-item[data-section="code"]'
                    },
                    {
                        id: 'code-analysis',
                        title: 'Code Analysis',
                        description: 'Analyze your code with AI explanations',
                        target: '#code',
                        action: 'highlight',
                        content: 'The code analysis section can scan your projects and provide insights with learning explanations.',
                        nextAction: 'click',
                        nextTarget: '.nav-item[data-section="resume"]'
                    },
                    {
                        id: 'resume-builder',
                        title: 'Resume Builder',
                        description: 'Generate professional resumes from your GitHub',
                        target: '#resume',
                        action: 'highlight',
                        content: 'This section analyzes your GitHub repositories and generates professional resumes and portfolios.',
                        nextAction: 'click',
                        nextTarget: '.nav-item[data-section="ideas"]'
                    },
                    {
                        id: 'app-ideas',
                        title: 'App Ideas Generator',
                        description: 'Generate innovative app ideas',
                        target: '#ideas',
                        action: 'highlight',
                        content: 'Get creative with AI-generated app ideas based on current trends and your interests.',
                        nextAction: 'click',
                        nextTarget: '.nav-item[data-section="sessions"]'
                    },
                    {
                        id: 'work-sessions',
                        title: 'Work Sessions',
                        description: 'Manage your work sessions',
                        target: '#sessions',
                        action: 'highlight',
                        content: 'Track your work sessions and integrate them with other automations for better productivity.',
                        nextAction: 'click',
                        nextTarget: '.nav-item[data-section="analytics"]'
                    },
                    {
                        id: 'analytics',
                        title: 'Analytics',
                        description: 'Track your productivity',
                        target: '#analytics',
                        action: 'highlight',
                        content: 'View analytics about your automation usage and productivity patterns.',
                        nextAction: 'complete',
                        nextTarget: null
                    }
                ]
            },
            'music-automation': {
                title: 'Master Music Automation',
                description: 'Learn advanced music automation features',
                estimatedTime: '3 minutes',
                difficulty: 'intermediate',
                steps: [
                    {
                        id: 'music-overview',
                        title: 'Music Automation Overview',
                        description: 'Understanding smart music control',
                        target: '#music',
                        action: 'highlight',
                        content: 'Music automation detects your work context and automatically switches playlists. It supports coding, focus, meetings, and creative modes.',
                        nextAction: 'click',
                        nextTarget: '.nes-btn[onclick="startMusic()"]'
                    },
                    {
                        id: 'start-music',
                        title: 'Start Music Automation',
                        description: 'Activate smart music control',
                        target: '.nes-btn[onclick="startMusic()"]',
                        action: 'highlight',
                        content: 'This starts the music automation. It will begin with your default context and can switch automatically.',
                        nextAction: 'click',
                        nextTarget: '.nes-btn[onclick="switchMusicContext(\'coding\')"]'
                    },
                    {
                        id: 'context-switching',
                        title: 'Manual Context Switching',
                        description: 'Switch music contexts manually',
                        target: '.context-buttons',
                        action: 'highlight',
                        content: 'You can manually switch between different music contexts: Coding, Focus, Meetings, and Creative.',
                        nextAction: 'click',
                        nextTarget: '.nes-btn[onclick="switchMusicContext(\'focus\')"]'
                    },
                    {
                        id: 'focus-mode',
                        title: 'Focus Mode',
                        description: 'Deep work music selection',
                        target: '.nes-btn[onclick="switchMusicContext(\'focus\')"]',
                        action: 'highlight',
                        content: 'Focus mode plays ambient or instrumental music designed to enhance concentration and deep work.',
                        nextAction: 'complete',
                        nextTarget: null
                    }
                ]
            },
            'tab-management': {
                title: 'Advanced Tab Management',
                description: 'Master browser tab organization',
                estimatedTime: '4 minutes',
                difficulty: 'intermediate',
                steps: [
                    {
                        id: 'tab-overview',
                        title: 'Tab Management Overview',
                        description: 'Understanding intelligent tab organization',
                        target: '#tabs',
                        action: 'highlight',
                        content: 'Tab management analyzes your open tabs and organizes them intelligently to reduce clutter and improve focus.',
                        nextAction: 'click',
                        nextTarget: '.nes-btn[onclick="declutterTabs(\'standard\')"]'
                    },
                    {
                        id: 'declutter-modes',
                        title: 'Declutter Modes',
                        description: 'Choose your decluttering intensity',
                        target: '.declutter-modes',
                        action: 'highlight',
                        content: 'Different modes: Gentle (closes obvious duplicates), Standard (organizes and closes some tabs), Aggressive (more aggressive cleanup), Focus (keeps only work-related tabs).',
                        nextAction: 'click',
                        nextTarget: '.nes-btn[onclick="declutterTabs(\'gentle\')"]'
                    },
                    {
                        id: 'gentle-mode',
                        title: 'Gentle Declutter',
                        description: 'Safe tab cleanup',
                        target: '.nes-btn[onclick="declutterTabs(\'gentle\')"]',
                        action: 'highlight',
                        content: 'Gentle mode only closes obvious duplicates and very old tabs. Safe for regular use.',
                        nextAction: 'click',
                        nextTarget: '.nes-btn[onclick="groupTabs()"]'
                    },
                    {
                        id: 'group-tabs',
                        title: 'Group Similar Tabs',
                        description: 'Organize tabs by category',
                        target: '.nes-btn[onclick="groupTabs()"]',
                        action: 'highlight',
                        content: 'Groups tabs by domain and purpose, making it easier to find related content.',
                        nextAction: 'click',
                        nextTarget: '.nes-btn[onclick="saveTabSession()"]'
                    },
                    {
                        id: 'save-session',
                        title: 'Save Tab Session',
                        description: 'Save your current tab setup',
                        target: '.nes-btn[onclick="saveTabSession()"]',
                        action: 'highlight',
                        content: 'Saves your current tab configuration so you can restore it later.',
                        nextAction: 'complete',
                        nextTarget: null
                    }
                ]
            },
            'code-analysis': {
                title: 'Code Analysis & Documentation',
                description: 'Learn to analyze code with AI explanations',
                estimatedTime: '3 minutes',
                difficulty: 'intermediate',
                steps: [
                    {
                        id: 'code-overview',
                        title: 'Code Analysis Overview',
                        description: 'Understanding AI-powered code analysis',
                        target: '#code',
                        action: 'highlight',
                        content: 'Code analysis scans your projects and provides insights with learning explanations to help you understand and improve your code.',
                        nextAction: 'click',
                        nextTarget: '#projectPath'
                    },
                    {
                        id: 'project-path',
                        title: 'Set Project Path',
                        description: 'Choose which project to analyze',
                        target: '#projectPath',
                        action: 'highlight',
                        content: 'Enter the path to your project. Use "." for current directory or specify a relative path.',
                        nextAction: 'click',
                        nextTarget: '.nes-btn[onclick="analyzeCode()"]'
                    },
                    {
                        id: 'analyze-code',
                        title: 'Analyze Code',
                        description: 'Run code analysis',
                        target: '.nes-btn[onclick="analyzeCode()"]',
                        action: 'highlight',
                        content: 'This will scan your codebase and provide detailed analysis with explanations for improvements.',
                        nextAction: 'click',
                        nextTarget: '.nes-btn[onclick="generateDocs()"]'
                    },
                    {
                        id: 'generate-docs',
                        title: 'Generate Documentation',
                        description: 'Create project documentation',
                        target: '.nes-btn[onclick="generateDocs()"]',
                        action: 'highlight',
                        content: 'Generates comprehensive documentation for your project including API references and usage examples.',
                        nextAction: 'complete',
                        nextTarget: null
                    }
                ]
            }
        };
    }

    loadUserProgress() {
        const progressPath = path.join(__dirname, '..', 'sessions', 'walkthrough-progress.json');
        try {
            if (fs.existsSync(progressPath)) {
                return JSON.parse(fs.readFileSync(progressPath, 'utf8'));
            }
        } catch (error) {
            console.error('Error loading walkthrough progress:', error.message);
        }
        return {};
    }

    saveUserProgress() {
        const progressPath = path.join(__dirname, '..', 'sessions', 'walkthrough-progress.json');
        try {
            fs.writeFileSync(progressPath, JSON.stringify(this.userProgress, null, 2));
        } catch (error) {
            console.error('Error saving walkthrough progress:', error.message);
        }
    }

    getAvailableWalkthroughs() {
        return Object.keys(this.walkthroughs).map(id => ({
            id,
            ...this.walkthroughs[id],
            completed: this.userProgress[id]?.completed || false,
            currentStep: this.userProgress[id]?.currentStep || 0,
            totalSteps: this.walkthroughs[id].steps.length
        }));
    }

    startWalkthrough(walkthroughId) {
        if (!this.walkthroughs[walkthroughId]) {
            throw new Error(`Walkthrough ${walkthroughId} not found`);
        }

        this.currentWalkthrough = walkthroughId;
        this.currentStep = this.userProgress[walkthroughId]?.currentStep || 0;
        
        return {
            walkthrough: this.walkthroughs[walkthroughId],
            currentStep: this.currentStep,
            totalSteps: this.walkthroughs[walkthroughId].steps.length
        };
    }

    getCurrentStep() {
        if (!this.currentWalkthrough) {
            return null;
        }

        const walkthrough = this.walkthroughs[this.currentWalkthrough];
        if (this.currentStep >= walkthrough.steps.length) {
            return null;
        }

        return {
            ...walkthrough.steps[this.currentStep],
            stepNumber: this.currentStep + 1,
            totalSteps: walkthrough.steps.length,
            walkthroughTitle: walkthrough.title
        };
    }

    nextStep() {
        if (!this.currentWalkthrough) {
            return null;
        }

        const walkthrough = this.walkthroughs[this.currentWalkthrough];
        this.currentStep++;

        // Update progress
        if (!this.userProgress[this.currentWalkthrough]) {
            this.userProgress[this.currentWalkthrough] = {
                started: new Date().toISOString(),
                currentStep: 0,
                completed: false
            };
        }

        this.userProgress[this.currentWalkthrough].currentStep = this.currentStep;

        // Check if completed
        if (this.currentStep >= walkthrough.steps.length) {
            this.userProgress[this.currentWalkthrough].completed = true;
            this.userProgress[this.currentWalkthrough].completedAt = new Date().toISOString();
            this.currentWalkthrough = null;
            this.currentStep = 0;
        }

        this.saveUserProgress();
        return this.getCurrentStep();
    }

    previousStep() {
        if (!this.currentWalkthrough || this.currentStep <= 0) {
            return null;
        }

        this.currentStep--;
        this.userProgress[this.currentWalkthrough].currentStep = this.currentStep;
        this.saveUserProgress();
        
        return this.getCurrentStep();
    }

    skipWalkthrough() {
        if (!this.currentWalkthrough) {
            return null;
        }

        this.userProgress[this.currentWalkthrough].skipped = true;
        this.userProgress[this.currentWalkthrough].skippedAt = new Date().toISOString();
        this.currentWalkthrough = null;
        this.currentStep = 0;
        this.saveUserProgress();
        
        return null;
    }

    getProgress() {
        return {
            totalWalkthroughs: Object.keys(this.walkthroughs).length,
            completedWalkthroughs: Object.values(this.userProgress).filter(p => p.completed).length,
            currentWalkthrough: this.currentWalkthrough,
            currentStep: this.currentStep
        };
    }
}

module.exports = WalkthroughSystem;