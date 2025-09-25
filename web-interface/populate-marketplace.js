#!/usr/bin/env node

/**
 * Populate Marketplace with Sample Automations
 * Creates sample automations to demonstrate the marketplace functionality
 */

const Marketplace = require('./marketplace');

const sampleAutomations = [
    {
        name: 'Smart Email Organizer',
        description: 'Automatically organize emails by priority and category',
        longDescription: 'This automation uses AI to analyze incoming emails and automatically sorts them into folders based on content, sender, and priority. It can also flag urgent emails and create follow-up reminders.',
        category: 'communication',
        version: '1.2.0',
        authorDisplayName: 'Productivity Pro',
        code: `// Smart Email Organizer
class EmailOrganizer {
    async organizeEmails() {
        const emails = await this.getUnreadEmails();
        for (const email of emails) {
            const category = await this.categorizeEmail(email);
            await this.moveToFolder(email, category);
        }
    }
}`,
        config: {
            folders: ['urgent', 'work', 'personal', 'newsletters'],
            keywords: {
                urgent: ['urgent', 'asap', 'deadline'],
                work: ['meeting', 'project', 'report']
            }
        },
        dependencies: ['nodemailer', 'natural'],
        tags: ['email', 'productivity', 'ai', 'organization'],
        documentation: 'Install and configure your email provider credentials. The automation will run every 15 minutes to organize new emails.',
        license: 'MIT',
        requirements: {
            nodeVersion: '>=16.0.0',
            dependencies: ['nodemailer', 'natural'],
            permissions: ['email:read', 'email:write']
        }
    },
    {
        name: 'Code Quality Monitor',
        description: 'Monitor code quality and suggest improvements',
        longDescription: 'Continuously monitors your codebase for quality issues, technical debt, and potential bugs. Provides detailed reports and suggestions for improvement.',
        category: 'development',
        version: '2.1.0',
        authorDisplayName: 'DevTools Master',
        code: `// Code Quality Monitor
class CodeQualityMonitor {
    async analyzeCodebase(path) {
        const files = await this.scanFiles(path);
        const issues = [];
        for (const file of files) {
            const analysis = await this.analyzeFile(file);
            issues.push(...analysis.issues);
        }
        return this.generateReport(issues);
    }
}`,
        config: {
            rules: ['complexity', 'duplication', 'maintainability'],
            thresholds: {
                complexity: 10,
                duplication: 5
            }
        },
        dependencies: ['eslint', 'sonarjs'],
        tags: ['code', 'quality', 'monitoring', 'development'],
        documentation: 'Configure your project paths and quality thresholds. The automation will scan your code and generate quality reports.',
        license: 'MIT',
        requirements: {
            nodeVersion: '>=14.0.0',
            dependencies: ['eslint', 'sonarjs'],
            permissions: ['file:read']
        }
    },
    {
        name: 'Focus Timer Pro',
        description: 'Advanced Pomodoro timer with smart breaks',
        longDescription: 'An intelligent Pomodoro timer that adapts to your work patterns. It learns your productivity cycles and suggests optimal break times and work sessions.',
        category: 'productivity',
        version: '1.5.0',
        authorDisplayName: 'Focus Expert',
        code: `// Focus Timer Pro
class FocusTimer {
    constructor() {
        this.workSessions = [];
        this.breakSessions = [];
    }
    
    async startSession(type = 'work') {
        const duration = await this.calculateOptimalDuration(type);
        return this.runTimer(duration, type);
    }
}`,
        config: {
            workDuration: 25,
            breakDuration: 5,
            longBreakDuration: 15,
            sessionsPerCycle: 4
        },
        dependencies: ['node-notifier'],
        tags: ['timer', 'productivity', 'focus', 'pomodoro'],
        documentation: 'Customize your work and break durations. The timer will notify you when sessions start and end.',
        license: 'MIT',
        requirements: {
            nodeVersion: '>=12.0.0',
            dependencies: ['node-notifier'],
            permissions: ['notification']
        }
    },
    {
        name: 'Smart File Backup',
        description: 'Intelligent file backup with version control',
        longDescription: 'Automatically backs up your important files with intelligent versioning. It detects changes and creates incremental backups, saving space while ensuring data safety.',
        category: 'system',
        version: '1.8.0',
        authorDisplayName: 'Data Guardian',
        code: `// Smart File Backup
class SmartBackup {
    async backupFiles(sourcePath, backupPath) {
        const changes = await this.detectChanges(sourcePath);
        if (changes.length > 0) {
            await this.createBackup(changes, backupPath);
        }
    }
}`,
        config: {
            backupInterval: '1h',
            retentionDays: 30,
            compressionLevel: 6
        },
        dependencies: ['fs-extra', 'archiver'],
        tags: ['backup', 'files', 'version-control', 'system'],
        documentation: 'Configure your source and backup directories. The automation will monitor changes and create backups automatically.',
        license: 'MIT',
        requirements: {
            nodeVersion: '>=14.0.0',
            dependencies: ['fs-extra', 'archiver'],
            permissions: ['file:read', 'file:write']
        }
    },
    {
        name: 'Social Media Scheduler',
        description: 'Schedule and optimize social media posts',
        longDescription: 'Intelligently schedules your social media posts for optimal engagement. Analyzes your audience activity patterns and suggests the best times to post.',
        category: 'communication',
        version: '2.0.0',
        authorDisplayName: 'Social Media Guru',
        code: `// Social Media Scheduler
class SocialScheduler {
    async schedulePost(content, platforms, optimalTime) {
        const scheduledTime = await this.findOptimalTime(platforms);
        return this.schedulePost(content, platforms, scheduledTime);
    }
}`,
        config: {
            platforms: ['twitter', 'linkedin', 'facebook'],
            postingTimes: {
                twitter: ['9:00', '13:00', '17:00'],
                linkedin: ['8:00', '12:00', '16:00']
            }
        },
        dependencies: ['twitter-api-v2', 'linkedin-api'],
        tags: ['social-media', 'scheduling', 'marketing', 'automation'],
        documentation: 'Connect your social media accounts and configure posting schedules. The automation will analyze engagement patterns and optimize posting times.',
        license: 'MIT',
        requirements: {
            nodeVersion: '>=16.0.0',
            dependencies: ['twitter-api-v2', 'linkedin-api'],
            permissions: ['social:write']
        }
    },
    {
        name: 'Website Performance Monitor',
        description: 'Monitor website performance and uptime',
        longDescription: 'Continuously monitors your website\'s performance, uptime, and user experience. Alerts you when issues are detected and provides detailed performance reports.',
        category: 'web',
        version: '1.3.0',
        authorDisplayName: 'Web Performance Expert',
        code: `// Website Performance Monitor
class PerformanceMonitor {
    async monitorWebsite(url) {
        const metrics = await this.measurePerformance(url);
        const alerts = await this.checkThresholds(metrics);
        return this.generateReport(metrics, alerts);
    }
}`,
        config: {
            checkInterval: '5m',
            thresholds: {
                loadTime: 3000,
                uptime: 99.9
            }
        },
        dependencies: ['puppeteer', 'lighthouse'],
        tags: ['web', 'performance', 'monitoring', 'uptime'],
        documentation: 'Configure your website URLs and performance thresholds. The automation will monitor your sites and alert you to any issues.',
        license: 'MIT',
        requirements: {
            nodeVersion: '>=16.0.0',
            dependencies: ['puppeteer', 'lighthouse'],
            permissions: ['network:read']
        }
    }
];

async function populateMarketplace() {
    const marketplace = new Marketplace();
    
    console.log('🚀 Populating marketplace with sample automations...');
    
    for (const automationData of sampleAutomations) {
        try {
            const result = await marketplace.publishAutomation(automationData, 'demo-user');
            if (result.success) {
                console.log(`✅ Published: ${automationData.name}`);
                
                // Add some sample downloads and ratings
                await marketplace.downloadAutomation(result.automation.id);
                await marketplace.downloadAutomation(result.automation.id);
                await marketplace.rateAutomation(result.automation.id, 4.5, 'Great automation! Very useful.', 'reviewer1');
                await marketplace.rateAutomation(result.automation.id, 4.0, 'Works well, could use more features.', 'reviewer2');
            } else {
                console.log(`❌ Failed to publish: ${automationData.name}`);
            }
        } catch (error) {
            console.error(`❌ Error publishing ${automationData.name}:`, error.message);
        }
    }
    
    console.log('🎉 Marketplace population complete!');
    console.log(`📊 Total automations: ${Object.keys(marketplace.automations).length}`);
    
    const stats = marketplace.getMarketplaceStats();
    console.log(`📈 Marketplace stats:`);
    console.log(`   - Total downloads: ${stats.totalDownloads}`);
    console.log(`   - Total installs: ${stats.totalInstalls}`);
    console.log(`   - Average rating: ${stats.averageRating.toFixed(1)}`);
}

// Run if called directly
if (require.main === module) {
    populateMarketplace().catch(console.error);
}

module.exports = { populateMarketplace, sampleAutomations };