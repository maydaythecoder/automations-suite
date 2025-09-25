#!/usr/bin/env node

/**
 * Smart Music Visualizer
 * Creates real-time animated visualizations based on music data
 */

const fs = require('fs');
const path = require('path');

class MusicVisualizer {
    constructor() {
        this.isActive = false;
        this.currentVisualization = null;
        this.visualizationData = {
            track: null,
            artist: null,
            album: null,
            colors: [],
            patterns: [],
            intensity: 0,
            tempo: 0,
            mood: 'neutral'
        };
    }

    async startVisualization(trackData) {
        this.isActive = true;
        this.visualizationData.track = trackData.trackName;
        this.visualizationData.artist = trackData.artist;
        this.visualizationData.album = trackData.album;
        
        // Analyze track for visualization parameters
        await this.analyzeTrack(trackData);
        
        // Generate visualization
        this.currentVisualization = await this.generateVisualization();
        
        return this.currentVisualization;
    }

    async analyzeTrack(trackData) {
        // Extract colors from album art if available
        if (trackData.albumArt && trackData.albumArt.originalUrl) {
            this.visualizationData.colors = await this.extractColorsFromArt(trackData.albumArt.originalUrl);
        } else {
            // Generate colors based on track metadata
            this.visualizationData.colors = this.generateDynamicColors(trackData, this.visualizationData.mood, this.visualizationData.intensity);
        }

        // Analyze track characteristics
        this.visualizationData.tempo = this.analyzeTempo(trackData);
        this.visualizationData.mood = this.analyzeMood(trackData);
        this.visualizationData.intensity = this.calculateIntensity(trackData);
        this.visualizationData.patterns = this.generatePatterns(trackData);
    }

    generateColorsFromMetadata(trackData) {
        const hash = this.simpleHash(trackData.trackName + trackData.artist);
        const colorPalettes = [
            ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'],
            ['#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'],
            ['#FF9F43', '#10AC84', '#EE5A24', '#0984E3', '#6C5CE7'],
            ['#A29BFE', '#FD79A8', '#FDCB6E', '#E17055', '#00B894'],
            ['#6C5CE7', '#A29BFE', '#FD79A8', '#FDCB6E', '#E17055']
        ];
        
        return colorPalettes[hash % colorPalettes.length];
    }

    generateDynamicColors(trackData, mood, intensity) {
        const baseHash = this.simpleHash(trackData.trackName + trackData.artist);
        
        // Define mood-based color palettes
        const moodPalettes = {
            'energetic': ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'],
            'romantic': ['#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFC9', '#BAE1FF'],
            'melancholic': ['#6C5CE7', '#A29BFE', '#74B9FF', '#81ECEC', '#FDCB6E'],
            'aggressive': ['#E17055', '#FDCB6E', '#6C5CE7', '#A29BFE', '#74B9FF'],
            'happy': ['#00B894', '#00CEC9', '#6C5CE7', '#A29BFE', '#FDCB6E'],
            'calm': ['#74B9FF', '#81ECEC', '#A29BFE', '#6C5CE7', '#FDCB6E']
        };
        
        const palette = moodPalettes[mood] || moodPalettes['happy'];
        
        // Generate colors based on mood and intensity
        const colors = [];
        for (let i = 0; i < 8; i++) {
            const baseColor = palette[i % palette.length];
            const variation = (baseHash + i) % 100;
            
            // Adjust intensity
            const intensityMultiplier = 0.5 + (intensity * 0.5);
            
            // Create color variations
            const hue = this.extractHue(baseColor) + (variation - 50) * 0.1;
            const saturation = Math.min(100, 60 + (intensity * 40));
            const lightness = Math.max(20, Math.min(80, 50 + (variation - 50) * 0.3));
            
            colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
        }
        
        return colors;
    }

    extractHue(color) {
        // Extract hue from hex color
        const hex = color.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const diff = max - min;
        
        let hue = 0;
        if (diff !== 0) {
            if (max === r) {
                hue = ((g - b) / diff) % 6;
            } else if (max === g) {
                hue = (b - r) / diff + 2;
            } else {
                hue = (r - g) / diff + 4;
            }
        }
        
        return Math.round(hue * 60);
    }

    analyzeTempo(trackData) {
        // Analyze track name and artist for tempo hints
        const text = (trackData.trackName + ' ' + trackData.artist).toLowerCase();
        
        if (text.includes('fast') || text.includes('speed') || text.includes('rap')) {
            return 140; // Fast tempo
        } else if (text.includes('slow') || text.includes('ballad') || text.includes('acoustic')) {
            return 80; // Slow tempo
        } else if (text.includes('dance') || text.includes('electronic') || text.includes('beat')) {
            return 120; // Medium-fast tempo
        } else {
            return 100; // Default tempo
        }
    }

    analyzeMood(trackData) {
        const text = (trackData.trackName + ' ' + trackData.artist).toLowerCase();
        
        if (text.includes('happy') || text.includes('joy') || text.includes('smile')) {
            return 'happy';
        } else if (text.includes('sad') || text.includes('cry') || text.includes('tears')) {
            return 'melancholic';
        } else if (text.includes('angry') || text.includes('rage') || text.includes('fury')) {
            return 'aggressive';
        } else if (text.includes('love') || text.includes('heart') || text.includes('romance')) {
            return 'romantic';
        } else if (text.includes('party') || text.includes('celebration') || text.includes('dance')) {
            return 'energetic';
        } else {
            return 'neutral';
        }
    }

    calculateIntensity(trackData) {
        const moodIntensity = {
            'happy': 0.8,
            'energetic': 0.9,
            'aggressive': 0.95,
            'romantic': 0.6,
            'melancholic': 0.4,
            'neutral': 0.5
        };
        
        return moodIntensity[this.visualizationData.mood] || 0.5;
    }

    generatePatterns(trackData) {
        const patterns = [];
        const mood = this.visualizationData.mood;
        
        switch (mood) {
            case 'energetic':
                patterns.push('pulse', 'wave', 'spiral');
                break;
            case 'romantic':
                patterns.push('heart', 'flow', 'gentle');
                break;
            case 'melancholic':
                patterns.push('fade', 'drift', 'soft');
                break;
            case 'aggressive':
                patterns.push('spike', 'burst', 'sharp');
                break;
            default:
                patterns.push('flow', 'gentle', 'wave');
        }
        
        return patterns;
    }

    async generateVisualization() {
        const colors = this.visualizationData.colors;
        const tempo = this.visualizationData.tempo;
        const intensity = this.visualizationData.intensity;
        
        // Calculate beat timing for audio bars
        const beatDuration = 60000 / tempo; // Duration of one beat in ms
        const barCount = 32; // Number of audio bars
        const barWidth = 8;
        const maxBarHeight = 120;
        const centerX = 200;
        const centerY = 150;
        
        // Generate heights based on music mood and intensity
        const barHeights = [];
        const mood = this.visualizationData.mood;
        
        for (let i = 0; i < barCount; i++) {
            let baseHeight;
            
            // Adjust heights based on mood
            switch (mood) {
                case 'energetic':
                    baseHeight = (Math.random() * maxBarHeight * intensity * 1.2) + 20;
                    break;
                case 'romantic':
                    baseHeight = (Math.random() * maxBarHeight * intensity * 0.8) + 15;
                    break;
                case 'melancholic':
                    baseHeight = (Math.random() * maxBarHeight * intensity * 0.6) + 10;
                    break;
                case 'aggressive':
                    baseHeight = (Math.random() * maxBarHeight * intensity * 1.5) + 25;
                    break;
                default:
                    baseHeight = Math.random() * maxBarHeight * intensity + 15;
            }
            
            // Add frequency-based variation
            const frequencyVariation = this.getFrequencyVariation(i, barCount);
            barHeights.push(Math.max(5, baseHeight + frequencyVariation));
        }
        
        // Create simple audio visualizer with dancing bars
        const svg = `
            <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:${colors[0]};stop-opacity:0.1" />
                        <stop offset="50%" style="stop-color:${colors[1]};stop-opacity:0.05" />
                        <stop offset="100%" style="stop-color:${colors[2]};stop-opacity:0.1" />
                    </linearGradient>
                    
                    <filter id="barGlow">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                        <feMerge> 
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>
                
                <!-- Background -->
                <rect width="400" height="300" fill="url(#bgGradient)"/>
                
                <!-- Audio Visualizer Bars -->
                <g transform="translate(${centerX}, ${centerY})">
                    ${this.generateAudioBars(barCount, barWidth, barHeights, colors, beatDuration)}
                </g>
                
                <!-- Track Info Overlay -->
                <rect x="10" y="10" width="380" height="60" fill="rgba(0,0,0,0.8)" rx="5"/>
                <text x="20" y="30" fill="white" font-family="monospace" font-size="12" font-weight="bold">
                    ${this.visualizationData.track}
                </text>
                <text x="20" y="45" fill="${colors[0]}" font-family="monospace" font-size="10">
                    ${this.visualizationData.artist}
                </text>
                <text x="20" y="60" fill="${colors[1]}" font-family="monospace" font-size="9">
                    ${this.visualizationData.mood.toUpperCase()} • ${tempo} BPM • AUDIO VISUALIZER
                </text>
            </svg>
        `;
        
        return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
    }

    generateAudioBars(barCount, barWidth, barHeights, colors, beatDuration) {
        let bars = '';
        const spacing = 2;
        const totalWidth = (barCount * barWidth) + ((barCount - 1) * spacing);
        const startX = -totalWidth / 2;
        
        for (let i = 0; i < barCount; i++) {
            const x = startX + (i * (barWidth + spacing));
            const baseHeight = barHeights[i];
            const color = colors[i % colors.length];
            
            // Create different frequency patterns for different bars
            const frequency = this.getFrequencyPattern(i, barCount);
            const animationValues = this.generateAnimationValues(baseHeight, frequency, beatDuration);
            const animationDuration = this.getAnimationDuration(i, beatDuration);
            const delay = this.getAnimationDelay(i, beatDuration);
            
            bars += `
                <rect x="${x}" y="${-baseHeight/2}" width="${barWidth}" height="${baseHeight}" 
                      fill="${color}" opacity="0.8" filter="url(#barGlow)">
                    <animate attributeName="height" 
                             values="${animationValues}" 
                             dur="${animationDuration}ms" 
                             repeatCount="indefinite"
                             begin="${delay}ms"/>
                    <animate attributeName="opacity" 
                             values="0.8;0.3;0.8;0.2;0.8" 
                             dur="${animationDuration}ms" 
                             repeatCount="indefinite"
                             begin="${delay}ms"/>
                    <animate attributeName="y" 
                             values="${-baseHeight/2};${-baseHeight/2 - 5};${-baseHeight/2}" 
                             dur="${animationDuration}ms" 
                             repeatCount="indefinite"
                             begin="${delay}ms"/>
                </rect>
            `;
        }
        
        return bars;
    }

    getFrequencyPattern(barIndex, totalBars) {
        // Simulate different frequency ranges
        if (barIndex < totalBars * 0.2) {
            return 'bass'; // Low frequencies
        } else if (barIndex < totalBars * 0.6) {
            return 'mid'; // Mid frequencies
        } else {
            return 'treble'; // High frequencies
        }
    }

    generateAnimationValues(baseHeight, frequency, beatDuration) {
        const variations = {
            'bass': [baseHeight, baseHeight * 2.5, baseHeight * 0.8, baseHeight * 2.2, baseHeight],
            'mid': [baseHeight, baseHeight * 1.8, baseHeight * 0.6, baseHeight * 1.9, baseHeight * 0.7, baseHeight],
            'treble': [baseHeight, baseHeight * 1.3, baseHeight * 0.4, baseHeight * 1.6, baseHeight * 0.5, baseHeight * 1.2, baseHeight]
        };
        
        return variations[frequency].join(';');
    }

    getAnimationDuration(barIndex, beatDuration) {
        // Different bars animate at different speeds to simulate audio frequencies
        const variations = [
            beatDuration * 0.8,    // Bass - slower
            beatDuration * 0.6,    // Mid-bass
            beatDuration * 0.4,    // Mid - faster
            beatDuration * 0.3,    // Mid-treble
            beatDuration * 0.2,    // Treble - fastest
            beatDuration * 0.15,   // High treble
            beatDuration * 0.1,    // Ultra high
            beatDuration * 0.08    // Highest
        ];
        
        return variations[barIndex % variations.length];
    }

    getAnimationDelay(barIndex, beatDuration) {
        // Stagger animations to create wave-like effect
        return (barIndex * beatDuration) / 20;
    }

    getFrequencyVariation(barIndex, totalBars) {
        // Simulate different frequency characteristics
        if (barIndex < totalBars * 0.1) {
            return Math.random() * 30; // Bass - more variation
        } else if (barIndex < totalBars * 0.3) {
            return Math.random() * 20; // Low-mid
        } else if (barIndex < totalBars * 0.7) {
            return Math.random() * 15; // Mid - moderate variation
        } else if (barIndex < totalBars * 0.9) {
            return Math.random() * 10; // High-mid
        } else {
            return Math.random() * 5; // Treble - less variation
        }
    }


    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash);
    }

    stopVisualization() {
        this.isActive = false;
        this.currentVisualization = null;
    }

    getVisualizationData() {
        return {
            isActive: this.isActive,
            data: this.visualizationData,
            visualization: this.currentVisualization
        };
    }
}

module.exports = MusicVisualizer;