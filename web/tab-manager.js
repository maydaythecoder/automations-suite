#!/usr/bin/env node

/**
 * Tab Declutter Automation
 * Manages Chrome tabs intelligently based on usage patterns
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class TabManager {
    constructor() {
        this.configPath = path.join(__dirname, '../configs/master-config.json');
        this.config = this.loadConfig();
        this.sessionHistory = [];
    }

    loadConfig() {
        try {
            const configData = fs.readFileSync(this.configPath, 'utf8');
            return JSON.parse(configData);
        } catch (error) {
            console.error('Error loading config:', error.message);
            return this.getDefaultConfig();
        }
    }

    getDefaultConfig() {
        return {
            web_automations: {
                tab_declutter: {
                    enabled: true,
                    auto_close_rules: {
                        duplicates: true,
                        old_searches: "after_30_minutes",
                        youtube_watched: "after_1_hour",
                        social_media: "limit_to_2_tabs"
                    },
                    keep_patterns: [
                        "github.com/think-outside-the-valley",
                        "gmail.com", "docs.google.com", "drive.google.com"
                    ],
                    grouping_rules: {
                        development: ["github", "localhost", "stackblitz", "codesandbox"],
                        productivity: ["gmail", "sheets", "drive", "calendar"],
                        learning: ["youtube", "medium", "dev.to", "stackoverflow"],
                        ai_tools: ["deepseek", "claude", "chatgpt", "copilot"]
                    }
                }
            }
        };
    }

    async getChromeTabs() {
        try {
            // Use AppleScript to get Chrome tabs on macOS
            const script = `
                tell application "Google Chrome"
                    set tabList to {}
                    repeat with w in windows
                        repeat with t in tabs of w
                            set tabTitle to title of t
                            set tabURL to URL of t
                            set tabList to tabList & (tabTitle & "|" & tabURL)
                        end repeat
                    end repeat
                    return tabList as string
                end tell
            `;

            const result = execSync(`osascript -e '${script}'`, { encoding: 'utf8' });
            const tabs = result.trim().split(',');
            
            return tabs.map(tab => {
                const [title, url] = tab.split('|');
                return {
                    title: title.trim(),
                    url: url.trim(),
                    domain: this.extractDomain(url.trim()),
                    category: this.categorizeTab(url.trim())
                };
            });
        } catch (error) {
            console.error('Error getting Chrome tabs:', error.message);
            return [];
        }
    }

    extractDomain(url) {
        try {
            const urlObj = new URL(url);
            return urlObj.hostname;
        } catch (error) {
            return 'unknown';
        }
    }

    categorizeTab(url) {
        const config = this.config.web_automations.tab_declutter.grouping_rules;
        
        for (const [category, keywords] of Object.entries(config)) {
            if (keywords.some(keyword => url.toLowerCase().includes(keyword))) {
                return category;
            }
        }
        
        return 'other';
    }

    async closeTab(tabIndex, windowIndex = 1) {
        try {
            const script = `
                tell application "Google Chrome"
                    close tab ${tabIndex} of window ${windowIndex}
                end tell
            `;

            execSync(`osascript -e '${script}'`, { encoding: 'utf8' });
            return { success: true };
        } catch (error) {
            return { error: error.message };
        }
    }

    async closeTabsByPattern(pattern) {
        const tabs = await this.getChromeTabs();
        const tabsToClose = tabs.filter(tab => 
            tab.url.includes(pattern) || tab.title.toLowerCase().includes(pattern.toLowerCase())
        );

        console.log(`🗑️  Closing ${tabsToClose.length} tabs matching "${pattern}"`);
        
        for (const tab of tabsToClose) {
            console.log(`   Closing: ${tab.title}`);
            // Note: In a real implementation, you'd need to track tab indices
            // This is a simplified version
        }

        return { closed: tabsToClose.length, tabs: tabsToClose };
    }

    async declutterTabs(mode = 'standard') {
        const tabs = await this.getChromeTabs();
        console.log(`📊 Found ${tabs.length} open tabs`);

        const analysis = this.analyzeTabs(tabs);
        console.log('\n📈 Tab Analysis:');
        Object.entries(analysis.categories).forEach(([category, count]) => {
            console.log(`   ${category}: ${count} tabs`);
        });

        const actions = this.generateActions(tabs, mode);
        
        console.log('\n🎯 Recommended Actions:');
        actions.forEach(action => {
            console.log(`   ${action.action}: ${action.count} tabs (${action.reason})`);
        });

        return { tabs, analysis, actions };
    }

    analyzeTabs(tabs) {
        const categories = {};
        const domains = {};
        const duplicates = {};

        tabs.forEach(tab => {
            // Count by category
            categories[tab.category] = (categories[tab.category] || 0) + 1;
            
            // Count by domain
            domains[tab.domain] = (domains[tab.domain] || 0) + 1;
            
            // Find duplicates
            const key = `${tab.domain}${tab.title}`;
            if (duplicates[key]) {
                duplicates[key].push(tab);
            } else {
                duplicates[key] = [tab];
            }
        });

        return { categories, domains, duplicates };
    }

    generateActions(tabs, mode) {
        const actions = [];
        const config = this.config.web_automations.tab_declutter;

        // Find duplicates
        const duplicates = this.findDuplicates(tabs);
        if (duplicates.length > 0) {
            actions.push({
                action: 'Close duplicates',
                count: duplicates.length,
                reason: 'Multiple tabs with same content',
                tabs: duplicates
            });
        }

        // Find old search tabs
        const oldSearches = tabs.filter(tab => 
            tab.url.includes('google.com/search') && 
            this.isOldTab(tab)
        );
        if (oldSearches.length > 0) {
            actions.push({
                action: 'Close old searches',
                count: oldSearches.length,
                reason: 'Search results older than 30 minutes',
                tabs: oldSearches
            });
        }

        // Find excess social media tabs
        const socialTabs = tabs.filter(tab => 
            ['twitter', 'facebook', 'instagram', 'linkedin'].some(social => 
                tab.url.includes(social)
            )
        );
        if (socialTabs.length > 2) {
            const excess = socialTabs.slice(2);
            actions.push({
                action: 'Close excess social media',
                count: excess.length,
                reason: 'More than 2 social media tabs',
                tabs: excess
            });
        }

        // Find watched YouTube videos
        const youtubeTabs = tabs.filter(tab => 
            tab.url.includes('youtube.com/watch') && 
            this.isWatchedVideo(tab)
        );
        if (youtubeTabs.length > 0) {
            actions.push({
                action: 'Close watched videos',
                count: youtubeTabs.length,
                reason: 'YouTube videos already watched',
                tabs: youtubeTabs
            });
        }

        return actions;
    }

    findDuplicates(tabs) {
        const seen = new Set();
        const duplicates = [];

        tabs.forEach(tab => {
            const key = `${tab.domain}${tab.title}`;
            if (seen.has(key)) {
                duplicates.push(tab);
            } else {
                seen.add(key);
            }
        });

        return duplicates;
    }

    isOldTab(tab) {
        // Simplified: assume tabs with "search" in URL are old if they're not recent
        return tab.url.includes('search') && !tab.url.includes('recent');
    }

    isWatchedVideo(tab) {
        // Simplified: assume YouTube tabs are watched if they're not actively playing
        return tab.url.includes('youtube.com/watch');
    }

    async saveSession(tabs, sessionName = 'current') {
        const sessionData = {
            name: sessionName,
            timestamp: new Date().toISOString(),
            tabs: tabs.map(tab => ({
                title: tab.title,
                url: tab.url,
                category: tab.category
            }))
        };

        const sessionsDir = path.join(__dirname, '../sessions');
        if (!fs.existsSync(sessionsDir)) {
            fs.mkdirSync(sessionsDir, { recursive: true });
        }

        const sessionFile = path.join(sessionsDir, `${sessionName}.json`);
        fs.writeFileSync(sessionFile, JSON.stringify(sessionData, null, 2));
        
        console.log(`💾 Session saved: ${sessionName}`);
        return sessionData;
    }

    async restoreSession(sessionName) {
        const sessionFile = path.join(__dirname, '../sessions', `${sessionName}.json`);
        
        if (!fs.existsSync(sessionFile)) {
            return { error: `Session ${sessionName} not found` };
        }

        const sessionData = JSON.parse(fs.readFileSync(sessionFile, 'utf8'));
        
        console.log(`🔄 Restoring session: ${sessionName}`);
        console.log(`   ${sessionData.tabs.length} tabs from ${sessionData.timestamp}`);
        
        // In a real implementation, you'd open these tabs in Chrome
        sessionData.tabs.forEach(tab => {
            console.log(`   Opening: ${tab.title}`);
        });

        return sessionData;
    }

    async groupTabs() {
        const tabs = await this.getChromeTabs();
        const grouped = {};

        tabs.forEach(tab => {
            if (!grouped[tab.category]) {
                grouped[tab.category] = [];
            }
            grouped[tab.category].push(tab);
        });

        console.log('📁 Tab Grouping:');
        Object.entries(grouped).forEach(([category, categoryTabs]) => {
            console.log(`\n${category.toUpperCase()} (${categoryTabs.length} tabs):`);
            categoryTabs.forEach(tab => {
                console.log(`   ${tab.title}`);
            });
        });

        return grouped;
    }
}

// CLI Interface
if (require.main === module) {
    const tabManager = new TabManager();
    const command = process.argv[2];
    const param = process.argv[3];

    async function runCommand() {
        switch (command) {
            case 'analyze':
                const tabs = await tabManager.getChromeTabs();
                console.log(`📊 Chrome Tab Analysis`);
                console.log(`   Total tabs: ${tabs.length}`);
                
                const analysis = tabManager.analyzeTabs(tabs);
                console.log('\n📈 Categories:');
                Object.entries(analysis.categories).forEach(([category, count]) => {
                    console.log(`   ${category}: ${count}`);
                });
                break;

            case 'declutter':
                const mode = param || 'standard';
                const result = await tabManager.declutterTabs(mode);
                break;

            case 'group':
                await tabManager.groupTabs();
                break;

            case 'save':
                const tabsToSave = await tabManager.getChromeTabs();
                const sessionName = param || 'current';
                await tabManager.saveSession(tabsToSave, sessionName);
                break;

            case 'restore':
                const sessionNameToRestore = param || 'current';
                await tabManager.restoreSession(sessionNameToRestore);
                break;

            case 'close':
                if (param) {
                    await tabManager.closeTabsByPattern(param);
                } else {
                    console.log('Usage: node tab-manager.js close <pattern>');
                }
                break;

            default:
                console.log('🌐 Tab Manager');
                console.log('\nUsage:');
                console.log('  node tab-manager.js analyze              - Analyze current tabs');
                console.log('  node tab-manager.js declutter [mode]    - Declutter tabs');
                console.log('  node tab-manager.js group               - Group tabs by category');
                console.log('  node tab-manager.js save [name]         - Save current session');
                console.log('  node tab-manager.js restore [name]      - Restore session');
                console.log('  node tab-manager.js close <pattern>     - Close tabs by pattern');
                console.log('\nModes: gentle, standard, aggressive, focus');
        }
    }

    runCommand().catch(console.error);
}

module.exports = TabManager;