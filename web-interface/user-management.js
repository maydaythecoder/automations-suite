#!/usr/bin/env node

/**
 * User Management System for Automation Suite
 * Handles user authentication, profiles, and workspace management
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class UserManager {
    constructor() {
        this.usersPath = path.join(__dirname, '..', 'sessions', 'users.json');
        this.sessionsPath = path.join(__dirname, '..', 'sessions', 'active-sessions.json');
        this.users = this.loadUsers();
        this.activeSessions = this.loadActiveSessions();
    }

    loadUsers() {
        try {
            if (fs.existsSync(this.usersPath)) {
                return JSON.parse(fs.readFileSync(this.usersPath, 'utf8'));
            }
        } catch (error) {
            console.error('Error loading users:', error.message);
        }
        return {};
    }

    loadActiveSessions() {
        try {
            if (fs.existsSync(this.sessionsPath)) {
                return JSON.parse(fs.readFileSync(this.sessionsPath, 'utf8'));
            }
        } catch (error) {
            console.error('Error loading active sessions:', error.message);
        }
        return {};
    }

    saveUsers() {
        try {
            fs.writeFileSync(this.usersPath, JSON.stringify(this.users, null, 2));
        } catch (error) {
            console.error('Error saving users:', error.message);
        }
    }

    saveActiveSessions() {
        try {
            fs.writeFileSync(this.sessionsPath, JSON.stringify(this.activeSessions, null, 2));
        } catch (error) {
            console.error('Error saving active sessions:', error.message);
        }
    }

    hashPassword(password) {
        return crypto.createHash('sha256').update(password + 'automation-suite-salt').digest('hex');
    }

    generateSessionToken() {
        return crypto.randomBytes(32).toString('hex');
    }

    async registerUser(userData) {
        const { username, email, password, displayName } = userData;

        // Validate input
        if (!username || !email || !password) {
            return { success: false, error: 'Missing required fields' };
        }

        if (this.users[username]) {
            return { success: false, error: 'Username already exists' };
        }

        // Check if email is already used
        const existingUser = Object.values(this.users).find(user => user.email === email);
        if (existingUser) {
            return { success: false, error: 'Email already registered' };
        }

        // Create user
        const userId = crypto.randomUUID();
        const hashedPassword = this.hashPassword(password);
        
        this.users[username] = {
            id: userId,
            username,
            email,
            password: hashedPassword,
            displayName: displayName || username,
            createdAt: new Date().toISOString(),
            lastLogin: null,
            profile: {
                bio: '',
                avatar: null,
                preferences: {
                    theme: 'retro',
                    notifications: true,
                    autoStart: false
                }
            },
            workspace: {
                installedAutomations: [],
                customAutomations: [],
                settings: {}
            },
            stats: {
                automationsUsed: 0,
                sessionsCompleted: 0,
                marketplaceContributions: 0
            }
        };

        this.saveUsers();
        return { success: true, user: this.getPublicUserData(username) };
    }

    async loginUser(username, password) {
        const user = this.users[username];
        if (!user) {
            return { success: false, error: 'Invalid username or password' };
        }

        const hashedPassword = this.hashPassword(password);
        if (user.password !== hashedPassword) {
            return { success: false, error: 'Invalid username or password' };
        }

        // Create session
        const sessionToken = this.generateSessionToken();
        this.activeSessions[sessionToken] = {
            userId: user.id,
            username: user.username,
            createdAt: new Date().toISOString(),
            lastActivity: new Date().toISOString(),
            ipAddress: null // Would be set by the server
        };

        // Update user last login
        user.lastLogin = new Date().toISOString();
        this.saveUsers();
        this.saveActiveSessions();

        return { 
            success: true, 
            sessionToken,
            user: this.getPublicUserData(username)
        };
    }

    async logoutUser(sessionToken) {
        if (this.activeSessions[sessionToken]) {
            delete this.activeSessions[sessionToken];
            this.saveActiveSessions();
            return { success: true };
        }
        return { success: false, error: 'Invalid session' };
    }

    validateSession(sessionToken) {
        const session = this.activeSessions[sessionToken];
        if (!session) {
            return { valid: false, error: 'Invalid session' };
        }

        // Update last activity
        session.lastActivity = new Date().toISOString();
        this.saveActiveSessions();

        const user = Object.values(this.users).find(u => u.id === session.userId);
        if (!user) {
            return { valid: false, error: 'User not found' };
        }

        return { 
            valid: true, 
            user: this.getPublicUserData(user.username),
            session 
        };
    }

    getPublicUserData(username) {
        const user = this.users[username];
        if (!user) return null;

        return {
            id: user.id,
            username: user.username,
            email: user.email,
            displayName: user.displayName,
            createdAt: user.createdAt,
            lastLogin: user.lastLogin,
            profile: user.profile,
            stats: user.stats
        };
    }

    async updateUserProfile(username, updates) {
        const user = this.users[username];
        if (!user) {
            return { success: false, error: 'User not found' };
        }

        // Update allowed fields
        if (updates.displayName) user.displayName = updates.displayName;
        if (updates.bio !== undefined) user.profile.bio = updates.bio;
        if (updates.avatar) user.profile.avatar = updates.avatar;
        if (updates.preferences) {
            user.profile.preferences = { ...user.profile.preferences, ...updates.preferences };
        }

        this.saveUsers();
        return { success: true, user: this.getPublicUserData(username) };
    }

    async installAutomation(username, automationId) {
        const user = this.users[username];
        if (!user) {
            return { success: false, error: 'User not found' };
        }

        if (!user.workspace.installedAutomations.includes(automationId)) {
            user.workspace.installedAutomations.push(automationId);
            user.stats.automationsUsed++;
            this.saveUsers();
        }

        return { success: true };
    }

    async uninstallAutomation(username, automationId) {
        const user = this.users[username];
        if (!user) {
            return { success: false, error: 'User not found' };
        }

        const index = user.workspace.installedAutomations.indexOf(automationId);
        if (index > -1) {
            user.workspace.installedAutomations.splice(index, 1);
            this.saveUsers();
        }

        return { success: true };
    }

    async createCustomAutomation(username, automationData) {
        const user = this.users[username];
        if (!user) {
            return { success: false, error: 'User not found' };
        }

        const automationId = crypto.randomUUID();
        const customAutomation = {
            id: automationId,
            name: automationData.name,
            description: automationData.description,
            category: automationData.category,
            version: automationData.version || '1.0.0',
            author: username,
            createdAt: new Date().toISOString(),
            code: automationData.code,
            config: automationData.config || {},
            dependencies: automationData.dependencies || [],
            tags: automationData.tags || [],
            isPublic: automationData.isPublic || false
        };

        user.workspace.customAutomations.push(customAutomation);
        this.saveUsers();

        return { success: true, automation: customAutomation };
    }

    getUserWorkspace(username) {
        const user = this.users[username];
        if (!user) return null;

        return {
            installedAutomations: user.workspace.installedAutomations,
            customAutomations: user.workspace.customAutomations,
            settings: user.workspace.settings
        };
    }

    getAllUsers() {
        return Object.values(this.users).map(user => this.getPublicUserData(user.username));
    }

    getUserStats(username) {
        const user = this.users[username];
        if (!user) return null;

        return {
            ...user.stats,
            totalUsers: Object.keys(this.users).length,
            totalSessions: Object.keys(this.activeSessions).length
        };
    }

    cleanupExpiredSessions() {
        const now = new Date();
        const expiredSessions = [];

        Object.entries(this.activeSessions).forEach(([token, session]) => {
            const lastActivity = new Date(session.lastActivity);
            const hoursSinceActivity = (now - lastActivity) / (1000 * 60 * 60);
            
            if (hoursSinceActivity > 24) { // Expire after 24 hours
                expiredSessions.push(token);
            }
        });

        expiredSessions.forEach(token => {
            delete this.activeSessions[token];
        });

        if (expiredSessions.length > 0) {
            this.saveActiveSessions();
            console.log(`Cleaned up ${expiredSessions.length} expired sessions`);
        }
    }
}

module.exports = UserManager;