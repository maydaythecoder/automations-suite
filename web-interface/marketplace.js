#!/usr/bin/env node

/**
 * Automation Marketplace System
 * Handles discovery, installation, and management of community automations
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class Marketplace {
    constructor() {
        this.automationsPath = path.join(__dirname, '..', 'sessions', 'marketplace-automations.json');
        this.categoriesPath = path.join(__dirname, '..', 'sessions', 'marketplace-categories.json');
        this.automations = this.loadAutomations();
        this.categories = this.loadCategories();
        this.initializeDefaultCategories();
    }

    loadAutomations() {
        try {
            if (fs.existsSync(this.automationsPath)) {
                return JSON.parse(fs.readFileSync(this.automationsPath, 'utf8'));
            }
        } catch (error) {
            console.error('Error loading marketplace automations:', error.message);
        }
        return {};
    }

    loadCategories() {
        try {
            if (fs.existsSync(this.categoriesPath)) {
                return JSON.parse(fs.readFileSync(this.categoriesPath, 'utf8'));
            }
        } catch (error) {
            console.error('Error loading marketplace categories:', error.message);
        }
        return {};
    }

    saveAutomations() {
        try {
            fs.writeFileSync(this.automationsPath, JSON.stringify(this.automations, null, 2));
        } catch (error) {
            console.error('Error saving marketplace automations:', error.message);
        }
    }

    saveCategories() {
        try {
            fs.writeFileSync(this.categoriesPath, JSON.stringify(this.categories, null, 2));
        } catch (error) {
            console.error('Error saving marketplace categories:', error.message);
        }
    }

    initializeDefaultCategories() {
        const defaultCategories = {
            'productivity': {
                name: 'Productivity',
                description: 'Automations to boost your productivity and efficiency',
                icon: 'fas fa-rocket',
                color: '#3b82f6'
            },
            'development': {
                name: 'Development',
                description: 'Tools and automations for developers',
                icon: 'fas fa-code',
                color: '#10b981'
            },
            'music': {
                name: 'Music & Audio',
                description: 'Music control and audio-related automations',
                icon: 'fas fa-music',
                color: '#8b5cf6'
            },
            'web': {
                name: 'Web & Browsing',
                description: 'Browser automation and web-related tools',
                icon: 'fas fa-globe',
                color: '#f59e0b'
            },
            'system': {
                name: 'System & OS',
                description: 'System-level automations and OS integrations',
                icon: 'fas fa-desktop',
                color: '#ef4444'
            },
            'communication': {
                name: 'Communication',
                description: 'Email, messaging, and communication automations',
                icon: 'fas fa-comments',
                color: '#06b6d4'
            },
            'data': {
                name: 'Data & Analytics',
                description: 'Data processing and analytics automations',
                icon: 'fas fa-chart-bar',
                color: '#84cc16'
            },
            'creative': {
                name: 'Creative & Design',
                description: 'Design tools and creative workflow automations',
                icon: 'fas fa-palette',
                color: '#f97316'
            }
        };

        // Only add categories that don't exist
        Object.entries(defaultCategories).forEach(([key, category]) => {
            if (!this.categories[key]) {
                this.categories[key] = category;
            }
        });

        this.saveCategories();
    }

    async publishAutomation(automationData, author) {
        const automationId = crypto.randomUUID();
        const automation = {
            id: automationId,
            name: automationData.name,
            description: automationData.description,
            longDescription: automationData.longDescription || automationData.description,
            category: automationData.category,
            version: automationData.version || '1.0.0',
            author: author,
            authorDisplayName: automationData.authorDisplayName || author,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            code: automationData.code,
            config: automationData.config || {},
            dependencies: automationData.dependencies || [],
            tags: automationData.tags || [],
            screenshots: automationData.screenshots || [],
            documentation: automationData.documentation || '',
            license: automationData.license || 'MIT',
            isPublic: true,
            stats: {
                downloads: 0,
                rating: 0,
                reviews: 0,
                installs: 0
            },
            requirements: automationData.requirements || {
                nodeVersion: '>=14.0.0',
                dependencies: [],
                permissions: []
            }
        };

        this.automations[automationId] = automation;
        this.saveAutomations();

        return { success: true, automation };
    }

    async updateAutomation(automationId, updates, author) {
        const automation = this.automations[automationId];
        if (!automation) {
            return { success: false, error: 'Automation not found' };
        }

        if (automation.author !== author) {
            return { success: false, error: 'Not authorized to update this automation' };
        }

        // Update allowed fields
        if (updates.name) automation.name = updates.name;
        if (updates.description) automation.description = updates.description;
        if (updates.longDescription) automation.longDescription = updates.longDescription;
        if (updates.category) automation.category = updates.category;
        if (updates.version) automation.version = updates.version;
        if (updates.code) automation.code = updates.code;
        if (updates.config) automation.config = updates.config;
        if (updates.dependencies) automation.dependencies = updates.dependencies;
        if (updates.tags) automation.tags = updates.tags;
        if (updates.screenshots) automation.screenshots = updates.screenshots;
        if (updates.documentation) automation.documentation = updates.documentation;
        if (updates.requirements) automation.requirements = updates.requirements;

        automation.updatedAt = new Date().toISOString();
        this.saveAutomations();

        return { success: true, automation };
    }

    async deleteAutomation(automationId, author) {
        const automation = this.automations[automationId];
        if (!automation) {
            return { success: false, error: 'Automation not found' };
        }

        if (automation.author !== author) {
            return { success: false, error: 'Not authorized to delete this automation' };
        }

        delete this.automations[automationId];
        this.saveAutomations();

        return { success: true };
    }

    searchAutomations(query, filters = {}) {
        let results = Object.values(this.automations).filter(automation => automation.isPublic);

        // Text search
        if (query) {
            const searchTerm = query.toLowerCase();
            results = results.filter(automation => 
                automation.name.toLowerCase().includes(searchTerm) ||
                automation.description.toLowerCase().includes(searchTerm) ||
                automation.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
                automation.author.toLowerCase().includes(searchTerm)
            );
        }

        // Category filter
        if (filters.category) {
            results = results.filter(automation => automation.category === filters.category);
        }

        // Author filter
        if (filters.author) {
            results = results.filter(automation => automation.author === filters.author);
        }

        // Rating filter
        if (filters.minRating) {
            results = results.filter(automation => automation.stats.rating >= filters.minRating);
        }

        // Sort results
        const sortBy = filters.sortBy || 'downloads';
        results.sort((a, b) => {
            switch (sortBy) {
                case 'downloads':
                    return b.stats.downloads - a.stats.downloads;
                case 'rating':
                    return b.stats.rating - a.stats.rating;
                case 'newest':
                    return new Date(b.createdAt) - new Date(a.createdAt);
                case 'updated':
                    return new Date(b.updatedAt) - new Date(a.updatedAt);
                case 'name':
                    return a.name.localeCompare(b.name);
                default:
                    return b.stats.downloads - a.stats.downloads;
            }
        });

        return results;
    }

    getAutomation(automationId) {
        return this.automations[automationId] || null;
    }

    getFeaturedAutomations(limit = 10) {
        const automations = Object.values(this.automations)
            .filter(automation => automation.isPublic)
            .sort((a, b) => b.stats.downloads - a.stats.downloads)
            .slice(0, limit);

        return automations;
    }

    getPopularAutomations(limit = 10) {
        const automations = Object.values(this.automations)
            .filter(automation => automation.isPublic)
            .sort((a, b) => b.stats.installs - a.stats.installs)
            .slice(0, limit);

        return automations;
    }

    getRecentAutomations(limit = 10) {
        const automations = Object.values(this.automations)
            .filter(automation => automation.isPublic)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, limit);

        return automations;
    }

    getAutomationsByCategory(category, limit = 20) {
        const automations = Object.values(this.automations)
            .filter(automation => automation.isPublic && automation.category === category)
            .sort((a, b) => b.stats.downloads - a.stats.downloads)
            .slice(0, limit);

        return automations;
    }

    getAutomationsByAuthor(author, limit = 20) {
        const automations = Object.values(this.automations)
            .filter(automation => automation.isPublic && automation.author === author)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, limit);

        return automations;
    }

    async downloadAutomation(automationId) {
        const automation = this.automations[automationId];
        if (!automation) {
            return { success: false, error: 'Automation not found' };
        }

        // Increment download count
        automation.stats.downloads++;
        this.saveAutomations();

        return { success: true, automation };
    }

    async installAutomation(automationId, username) {
        const automation = this.automations[automationId];
        if (!automation) {
            return { success: false, error: 'Automation not found' };
        }

        // Increment install count
        automation.stats.installs++;
        this.saveAutomations();

        return { success: true, automation };
    }

    async rateAutomation(automationId, rating, review = '', username) {
        const automation = this.automations[automationId];
        if (!automation) {
            return { success: false, error: 'Automation not found' };
        }

        if (rating < 1 || rating > 5) {
            return { success: false, error: 'Rating must be between 1 and 5' };
        }

        // Add review
        if (!automation.reviews) {
            automation.reviews = [];
        }

        automation.reviews.push({
            id: crypto.randomUUID(),
            username: username,
            rating: rating,
            review: review,
            createdAt: new Date().toISOString()
        });

        // Update average rating
        const totalRating = automation.reviews.reduce((sum, review) => sum + review.rating, 0);
        automation.stats.rating = totalRating / automation.reviews.length;
        automation.stats.reviews = automation.reviews.length;

        this.saveAutomations();

        return { success: true };
    }

    getCategories() {
        return this.categories;
    }

    getCategoryStats() {
        const stats = {};
        
        Object.keys(this.categories).forEach(category => {
            const automations = Object.values(this.automations)
                .filter(automation => automation.isPublic && automation.category === category);
            
            stats[category] = {
                count: automations.length,
                totalDownloads: automations.reduce((sum, automation) => sum + automation.stats.downloads, 0),
                totalInstalls: automations.reduce((sum, automation) => sum + automation.stats.installs, 0),
                averageRating: automations.length > 0 ? 
                    automations.reduce((sum, automation) => sum + automation.stats.rating, 0) / automations.length : 0
            };
        });

        return stats;
    }

    getMarketplaceStats() {
        const automations = Object.values(this.automations).filter(automation => automation.isPublic);
        
        return {
            totalAutomations: automations.length,
            totalCategories: Object.keys(this.categories).length,
            totalDownloads: automations.reduce((sum, automation) => sum + automation.stats.downloads, 0),
            totalInstalls: automations.reduce((sum, automation) => sum + automation.stats.installs, 0),
            averageRating: automations.length > 0 ? 
                automations.reduce((sum, automation) => sum + automation.stats.rating, 0) / automations.length : 0,
            topAuthors: this.getTopAuthors(10),
            recentActivity: this.getRecentActivity(20)
        };
    }

    getTopAuthors(limit = 10) {
        const authorStats = {};
        
        Object.values(this.automations).forEach(automation => {
            if (!authorStats[automation.author]) {
                authorStats[automation.author] = {
                    author: automation.author,
                    authorDisplayName: automation.authorDisplayName,
                    automations: 0,
                    downloads: 0,
                    installs: 0
                };
            }
            
            authorStats[automation.author].automations++;
            authorStats[automation.author].downloads += automation.stats.downloads;
            authorStats[automation.author].installs += automation.stats.installs;
        });

        return Object.values(authorStats)
            .sort((a, b) => b.downloads - a.downloads)
            .slice(0, limit);
    }

    getRecentActivity(limit = 20) {
        const activities = [];
        
        Object.values(this.automations).forEach(automation => {
            activities.push({
                type: 'published',
                automation: automation.name,
                author: automation.author,
                timestamp: automation.createdAt
            });
            
            if (automation.updatedAt !== automation.createdAt) {
                activities.push({
                    type: 'updated',
                    automation: automation.name,
                    author: automation.author,
                    timestamp: automation.updatedAt
                });
            }
        });

        return activities
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, limit);
    }
}

module.exports = Marketplace;