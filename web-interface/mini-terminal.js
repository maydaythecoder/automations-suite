#!/usr/bin/env node

/**
 * Mini Terminal System for Automation Suite
 * Provides command suggestions and execution interface
 */

const AutomationController = require('../automation-controller');

class MiniTerminal {
    constructor() {
        this.automationController = new AutomationController();
        this.commandHistory = this.loadCommandHistory();
        this.commandSuggestions = this.generateCommandSuggestions();
        this.currentInput = '';
        this.historyIndex = -1;
    }

    loadCommandHistory() {
        const historyPath = require('path').join(__dirname, '..', 'sessions', 'terminal-history.json');
        try {
            const fs = require('fs');
            if (fs.existsSync(historyPath)) {
                return JSON.parse(fs.readFileSync(historyPath, 'utf8'));
            }
        } catch (error) {
            console.error('Error loading command history:', error.message);
        }
        return [];
    }

    saveCommandHistory() {
        const historyPath = require('path').join(__dirname, '..', 'sessions', 'terminal-history.json');
        try {
            const fs = require('fs');
            fs.writeFileSync(historyPath, JSON.stringify(this.commandHistory, null, 2));
        } catch (error) {
            console.error('Error saving command history:', error.message);
        }
    }

    generateCommandSuggestions() {
        return {
            'music': {
                category: 'Music Control',
                description: 'Control smart music automation',
                commands: [
                    {
                        command: 'music start',
                        description: 'Start smart music automation',
                        example: 'music start',
                        category: 'music'
                    },
                    {
                        command: 'music stop',
                        description: 'Stop music automation',
                        example: 'music stop',
                        category: 'music'
                    },
                    {
                        command: 'music switch',
                        description: 'Switch music context',
                        example: 'music switch coding',
                        category: 'music',
                        parameters: ['coding', 'focus', 'meetings', 'creative']
                    },
                    {
                        command: 'music status',
                        description: 'Show current music status and track',
                        example: 'music status',
                        category: 'music'
                    }
                ]
            },
            'tabs': {
                category: 'Tab Management',
                description: 'Manage browser tabs intelligently',
                commands: [
                    {
                        command: 'tabs declutter',
                        description: 'Clean up browser tabs',
                        example: 'tabs declutter standard',
                        category: 'tabs',
                        parameters: ['gentle', 'standard', 'aggressive', 'focus']
                    },
                    {
                        command: 'tabs group',
                        description: 'Group similar tabs together',
                        example: 'tabs group',
                        category: 'tabs'
                    },
                    {
                        command: 'tabs save',
                        description: 'Save current tab session',
                        example: 'tabs save "work session"',
                        category: 'tabs'
                    }
                ]
            },
            'code': {
                category: 'Code Analysis',
                description: 'Analyze code with AI explanations',
                commands: [
                    {
                        command: 'code analyze',
                        description: 'Analyze codebase for improvements',
                        example: 'code analyze ./my-project',
                        category: 'code'
                    },
                    {
                        command: 'code docs',
                        description: 'Generate project documentation',
                        example: 'code docs ./my-project',
                        category: 'code'
                    }
                ]
            },
            'resume': {
                category: 'Resume Builder',
                description: 'Generate professional resumes',
                commands: [
                    {
                        command: 'resume build',
                        description: 'Build resume from GitHub projects',
                        example: 'resume build',
                        category: 'resume'
                    },
                    {
                        command: 'resume portfolio',
                        description: 'Generate portfolio website',
                        example: 'resume portfolio',
                        category: 'resume'
                    }
                ]
            },
            'ideas': {
                category: 'App Ideas',
                description: 'Generate innovative app ideas',
                commands: [
                    {
                        command: 'ideas generate',
                        description: 'Generate app ideas',
                        example: 'ideas generate 5 ai_ml',
                        category: 'ideas',
                        parameters: ['ai_ml', 'productivity', 'mobile', 'web', 'devtools']
                    }
                ]
            },
            'session': {
                category: 'Work Sessions',
                description: 'Manage work sessions',
                commands: [
                    {
                        command: 'session start',
                        description: 'Start a work session',
                        example: 'session start focus',
                        category: 'session',
                        parameters: ['default', 'focus', 'creative', 'learning', 'meeting']
                    },
                    {
                        command: 'session end',
                        description: 'End current work session',
                        example: 'session end',
                        category: 'session'
                    }
                ]
            },
            'system': {
                category: 'System Commands',
                description: 'System and utility commands',
                commands: [
                    {
                        command: 'status',
                        description: 'Show system status',
                        example: 'status',
                        category: 'system'
                    },
                    {
                        command: 'help',
                        description: 'Show help information',
                        example: 'help',
                        category: 'system'
                    }
                ]
            }
        };
    }

    getSuggestions(input) {
        if (!input || input.trim() === '') {
            return this.getAllCommands();
        }

        const suggestions = [];
        const inputLower = input.toLowerCase();

        // Search through all commands
        Object.values(this.commandSuggestions).forEach(category => {
            category.commands.forEach(cmd => {
                if (cmd.command.toLowerCase().includes(inputLower) || 
                    cmd.description.toLowerCase().includes(inputLower)) {
                    suggestions.push(cmd);
                }
            });
        });

        // Sort by relevance
        return suggestions.sort((a, b) => {
            const aScore = this.getRelevanceScore(a, inputLower);
            const bScore = this.getRelevanceScore(b, inputLower);
            return bScore - aScore;
        });
    }

    getRelevanceScore(command, input) {
        let score = 0;
        
        // Exact command match gets highest score
        if (command.command.toLowerCase() === input) {
            score += 100;
        }
        
        // Command starts with input
        if (command.command.toLowerCase().startsWith(input)) {
            score += 50;
        }
        
        // Command contains input
        if (command.command.toLowerCase().includes(input)) {
            score += 25;
        }
        
        // Description contains input
        if (command.description.toLowerCase().includes(input)) {
            score += 10;
        }
        
        return score;
    }

    getAllCommands() {
        const allCommands = [];
        Object.values(this.commandSuggestions).forEach(category => {
            allCommands.push(...category.commands);
        });
        return allCommands;
    }

    getCommandsByCategory(category) {
        return this.commandSuggestions[category]?.commands || [];
    }

    getCategories() {
        return Object.keys(this.commandSuggestions).map(key => ({
            key,
            ...this.commandSuggestions[key]
        }));
    }

    async executeCommand(command) {
        try {
            // Add to history
            this.commandHistory.unshift({
                command,
                timestamp: new Date().toISOString(),
                success: true
            });

            // Keep only last 100 commands
            if (this.commandHistory.length > 100) {
                this.commandHistory = this.commandHistory.slice(0, 100);
            }

            this.saveCommandHistory();

            // Execute the command
            const result = await this.automationController.executeCommand(command);
            
            return {
                success: true,
                result,
                command,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            // Add failed command to history
            this.commandHistory.unshift({
                command,
                timestamp: new Date().toISOString(),
                success: false,
                error: error.message
            });

            this.saveCommandHistory();

            return {
                success: false,
                error: error.message,
                command,
                timestamp: new Date().toISOString()
            };
        }
    }

    getCommandHistory() {
        return this.commandHistory.slice(0, 20); // Return last 20 commands
    }

    getHistoryItem(index) {
        if (index >= 0 && index < this.commandHistory.length) {
            return this.commandHistory[index].command;
        }
        return '';
    }

    navigateHistory(direction) {
        if (direction === 'up') {
            this.historyIndex = Math.min(this.historyIndex + 1, this.commandHistory.length - 1);
        } else if (direction === 'down') {
            this.historyIndex = Math.max(this.historyIndex - 1, -1);
        }
        
        if (this.historyIndex === -1) {
            return this.currentInput;
        }
        
        return this.getHistoryItem(this.historyIndex);
    }

    setCurrentInput(input) {
        this.currentInput = input;
        this.historyIndex = -1;
    }

    getCommandHelp(command) {
        const [category, action] = command.split(' ');
        
        if (this.commandSuggestions[category]) {
            const cmd = this.commandSuggestions[category].commands.find(c => 
                c.command === command || c.command.startsWith(`${category} ${action}`)
            );
            
            if (cmd) {
                return {
                    command: cmd.command,
                    description: cmd.description,
                    example: cmd.example,
                    parameters: cmd.parameters || [],
                    category: cmd.category
                };
            }
        }
        
        return null;
    }

    getQuickCommands() {
        return [
            { command: 'music start', icon: '🎵', description: 'Start Music' },
            { command: 'tabs declutter', icon: '🧹', description: 'Clean Tabs' },
            { command: 'session start focus', icon: '🎯', description: 'Focus Session' },
            { command: 'code analyze', icon: '🔍', description: 'Analyze Code' },
            { command: 'ideas generate', icon: '💡', description: 'Generate Ideas' },
            { command: 'status', icon: '📊', description: 'System Status' }
        ];
    }

    getRecentCommands() {
        return this.commandHistory.slice(0, 5).map(item => ({
            command: item.command,
            success: item.success,
            timestamp: item.timestamp
        }));
    }
}

module.exports = MiniTerminal;