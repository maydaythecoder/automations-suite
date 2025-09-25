# ⚙️ Configuration Guide

## Overview

This guide provides comprehensive instructions for configuring all automation modules in your automation suite. Each automation can be customized to match your preferences, work patterns, and technical environment.

## Table of Contents

- [Master Configuration](#master-configuration)
- [Music Automation Configuration](#music-automation-configuration)
- [Web Automation Configuration](#web-automation-configuration)
- [Development Automation Configuration](#development-automation-configuration)
- [Career Automation Configuration](#career-automation-configuration)
- [Innovation Automation Configuration](#innovation-automation-configuration)
- [Workflow Automation Configuration](#workflow-automation-configuration)
- [Environment Variables](#environment-variables)
- [Configuration Validation](#configuration-validation)

---

## Master Configuration

The master configuration file (`configs/master-config.json`) contains all automation settings and user profile information.

### File Location
```
automations-suite/
├── configs/
│   ├── master-config.json      # Main configuration file
│   └── music-contexts.json     # Music-specific configuration
└── .env                        # Environment variables
```

### Configuration Structure

```json
{
  "user_profile": {
    "name": "your-username",
    "email": "your-email@domain.com",
    "organization": "your-organization",
    "current_project": "your-main-project",
    "project_org": "your-project-org",
    "development_level": "intermediate_to_advanced",
    "primary_languages": ["JavaScript", "Python", "Dart"],
    "frameworks": ["React", "Node.js", "Flutter"],
    "interests": ["AI/ML", "Web Development", "Mobile Apps"]
  },
  "music_automations": { ... },
  "web_automations": { ... },
  "development_automations": { ... },
  "career_automations": { ... },
  "innovation_automations": { ... },
  "workflow_automations": { ... },
  "system_paths": { ... }
}
```

---

## Music Automation Configuration

### Master Config Section

```json
{
  "music_automations": {
    "smart_focus_music": {
      "enabled": true,
      "contexts": {
        "coding": {
          "volume": 60,
          "keywords": ["github", "vscode", "cursor", "dev", "code", "programming", "localhost"],
          "playlist_type": "upbeat_focus"
        },
        "focus": {
          "volume": 45,
          "keywords": ["docs", "reading", "research", "learning", "documentation"],
          "playlist_type": "ambient_concentration"
        },
        "meetings": {
          "volume": 25,
          "keywords": ["zoom", "meet", "teams", "call", "webex"],
          "playlist_type": "quiet_ambient"
        },
        "creative": {
          "volume": 65,
          "keywords": ["figma", "design", "adobe", "canva"],
          "playlist_type": "inspiring"
        },
        "learning": {
          "volume": 50,
          "keywords": ["youtube", "tutorial", "course", "deepseek", "claude"],
          "playlist_type": "instrumental_focus"
        }
      },
      "base_volume": 53,
      "preferred_genres": ["R&B", "Hip-Hop", "Alternative"],
      "check_interval_seconds": 30
    },
    "meeting_music_control": {
      "enabled": true,
      "action_on_meeting": "pause",
      "resume_delay_seconds": 5,
      "quiet_volume": 15,
      "meeting_patterns": [
        "zoom.us", "meet.google.com", "teams.microsoft.com", 
        "webex.com", "skype.com", "whereby.com"
      ]
    }
  }
}
```

### Music Contexts Configuration

**File**: `configs/music-contexts.json`

```json
{
  "coding": {
    "playlist_uri": "spotify:playlist:37i9dQZF1DXcBWIGoYBM5M",
    "volume": 60,
    "keywords": ["github", "stackoverflow", "dev", "code", "programming", "vscode", "cursor", "terminal"],
    "description": "Upbeat music for coding sessions"
  },
  "focus": {
    "playlist_uri": "spotify:playlist:37i9dQZF1DX4WY4goJ5hcy",
    "volume": 40,
    "keywords": ["docs", "reading", "research", "learning", "documentation", "tutorial", "medium"],
    "description": "Ambient music for deep focus and reading"
  },
  "meetings": {
    "playlist_uri": "spotify:playlist:37i9dQZF1DX4sWSpwq3LiO",
    "volume": 20,
    "keywords": ["zoom", "meet", "teams", "calendar", "call", "webex"],
    "description": "Very quiet ambient music for meetings"
  },
  "creative": {
    "playlist_uri": "spotify:playlist:37i9dQZF1DX4JAvHpjipBk",
    "volume": 70,
    "keywords": ["figma", "design", "adobe", "sketch", "photoshop", "canva"],
    "description": "Inspiring music for creative work"
  },
  "default": {
    "playlist_uri": "spotify:playlist:37i9dQZF1DXcBWIGoYBM5M",
    "volume": 50,
    "keywords": [],
    "description": "General work music"
  }
}
```

### Finding Spotify Playlist URIs

**Method 1: Spotify Desktop App**
1. Right-click on playlist in Spotify
2. Select "Share" → "Copy Spotify URI"
3. Format: `spotify:playlist:37i9dQZF1DXcBWIGoYBM5M`

**Method 2: Spotify Web**
1. Go to open.spotify.com
2. Find your playlist
3. Click "..." → "Share" → "Copy link to playlist"
4. Extract ID from URL: `https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M`
5. Convert to URI: `spotify:playlist:37i9dQZF1DXcBWIGoYBM5M`

### Customizing Context Detection

**Adding New Contexts**:
```json
{
  "gaming": {
    "playlist_uri": "spotify:playlist:YOUR_GAMING_PLAYLIST_ID",
    "volume": 80,
    "keywords": ["steam", "discord", "twitch", "gaming"],
    "description": "High-energy music for gaming"
  }
}
```

**Modifying Keywords**:
```json
{
  "coding": {
    "keywords": [
      "github", "stackoverflow", "dev", "code", "programming", 
      "vscode", "cursor", "terminal", "localhost", "your-custom-keyword"
    ]
  }
}
```

---

## Web Automation Configuration

### Master Config Section

```json
{
  "web_automations": {
    "tab_declutter": {
      "enabled": true,
      "auto_close_rules": {
        "duplicates": true,
        "old_searches": "after_30_minutes",
        "youtube_watched": "after_1_hour",
        "social_media": "limit_to_2_tabs"
      },
      "keep_patterns": [
        "github.com/your-username",
        "gmail.com", 
        "docs.google.com", 
        "drive.google.com"
      ],
      "grouping_rules": {
        "development": ["github", "localhost", "stackblitz", "codesandbox"],
        "productivity": ["gmail", "sheets", "drive", "calendar"],
        "learning": ["youtube", "medium", "dev.to", "stackoverflow"],
        "ai_tools": ["deepseek", "claude", "chatgpt", "copilot"]
      }
    },
    "research_assistant": {
      "enabled": true,
      "auto_open_docs": true,
      "project_context": "your-main-project",
      "related_technologies": ["React", "JavaScript", "Node.js"]
    }
  }
}
```

### Tab Management Rules

**Auto-Close Rules**:
```json
{
  "auto_close_rules": {
    "duplicates": true,                    // Close duplicate tabs
    "old_searches": "after_30_minutes",    // Close old search results
    "youtube_watched": "after_1_hour",     // Close watched YouTube videos
    "social_media": "limit_to_2_tabs",     // Limit social media tabs
    "news_sites": "after_2_hours",         // Close old news articles
    "shopping": "after_1_day"              // Close shopping tabs
  }
}
```

**Keep Patterns**:
```json
{
  "keep_patterns": [
    "github.com/your-username",           // Your GitHub repos
    "gmail.com",                          // Email
    "docs.google.com",                     // Google Docs
    "drive.google.com",                   // Google Drive
    "your-work-domain.com",               // Work websites
    "localhost:*"                         // Local development
  ]
}
```

**Grouping Rules**:
```json
{
  "grouping_rules": {
    "development": [
      "github", "localhost", "stackblitz", "codesandbox", 
      "your-dev-tools", "api-docs"
    ],
    "productivity": [
      "gmail", "sheets", "drive", "calendar", 
      "notion", "trello", "slack"
    ],
    "learning": [
      "youtube", "medium", "dev.to", "stackoverflow",
      "coursera", "udemy", "freecodecamp"
    ],
    "ai_tools": [
      "deepseek", "claude", "chatgpt", "copilot",
      "bard", "perplexity"
    ],
    "design": [
      "figma", "adobe", "sketch", "canva",
      "dribbble", "behance"
    ]
  }
}
```

### Declutter Modes

**Gentle Mode**:
- Only removes obvious duplicates
- Closes very old tabs (>24 hours)
- Preserves all work-related tabs

**Standard Mode**:
- Smart cleanup based on usage patterns
- Closes old search results
- Limits social media tabs
- Preserves important work tabs

**Aggressive Mode**:
- Keeps only essential work tabs
- Closes entertainment tabs
- Removes old documentation
- Focuses on current project

**Focus Mode**:
- Closes everything except current project
- Minimal tab count
- Maximum focus
- Project-specific organization

---

## Development Automation Configuration

### Master Config Section

```json
{
  "development_automations": {
    "code_health_checker": {
      "enabled": true,
      "analysis_types": [
        "error_patterns", 
        "best_practices", 
        "performance", 
        "security"
      ],
      "learning_mode": true,
      "generate_explanations": true
    },
    "documentation_generator": {
      "enabled": true,
      "auto_generate": true,
      "include_explanations": true,
      "learning_notes": true,
      "update_frequency": "weekly"
    },
    "documentation_lookup": {
      "enabled": true,
      "detected_technologies": [
        "JavaScript", "React", "Node.js", "Python", "Flutter", "Dart"
      ],
      "auto_open_docs": true,
      "preferred_sources": ["official_docs", "mdn", "stackoverflow"]
    }
  }
}
```

### Analysis Configuration

**Analysis Types**:
```json
{
  "analysis_types": [
    "error_patterns",      // Detect common error patterns
    "best_practices",      // Check coding best practices
    "performance",         // Identify performance issues
    "security",           // Scan for security vulnerabilities
    "accessibility",      // Check accessibility compliance
    "testing"             // Analyze test coverage
  ]
}
```

**Learning Mode Settings**:
```json
{
  "learning_mode": true,
  "generate_explanations": true,
  "include_resources": true,
  "difficulty_level": "intermediate",
  "learning_style": "practical_examples"
}
```

**File Type Support**:
```json
{
  "supported_extensions": [
    ".js", ".jsx", ".ts", ".tsx",    // JavaScript/TypeScript
    ".py", ".pyx", ".pyi",           // Python
    ".dart",                         // Dart
    ".java", ".kt",                  // Java/Kotlin
    ".cpp", ".c", ".h",              // C/C++
    ".go",                           // Go
    ".rs",                           // Rust
    ".php",                          // PHP
    ".rb"                            // Ruby
  ]
}
```

### Documentation Configuration

**Auto-Generation Settings**:
```json
{
  "auto_generate": true,
  "include_explanations": true,
  "learning_notes": true,
  "update_frequency": "weekly",
  "output_formats": ["markdown", "html", "json"],
  "include_diagrams": true,
  "code_examples": true
}
```

**Documentation Sources**:
```json
{
  "preferred_sources": [
    "official_docs",      // Official documentation
    "mdn",                // MDN Web Docs
    "stackoverflow",      // Stack Overflow
    "github",             // GitHub repositories
    "dev_to",             // Dev.to articles
    "medium"              // Medium articles
  ]
}
```

---

## Career Automation Configuration

### Master Config Section

```json
{
  "career_automations": {
    "resume_builder": {
      "enabled": true,
      "template": "modern_developer",
      "auto_update": true,
      "sync_with_projects": true,
      "extract_skills_from_code": true
    },
    "portfolio_generator": {
      "enabled": true,
      "featured_project": "your-main-project",
      "auto_generate": true,
      "include_analytics": true,
      "deploy_target": "github_pages"
    },
    "application_tracker": {
      "enabled": true,
      "templates": [
        "cover_letter", 
        "follow_up_email", 
        "thank_you_note"
      ],
      "auto_tracking": true,
      "reminder_system": true
    }
  }
}
```

### Resume Templates

**Modern Developer Template**:
```json
{
  "template": "modern_developer",
  "sections": [
    "personal_info",
    "professional_summary", 
    "experience",
    "projects",
    "skills",
    "education",
    "certifications"
  ],
  "style": "clean_professional",
  "ats_friendly": true
}
```

**Academic Template**:
```json
{
  "template": "academic",
  "sections": [
    "personal_info",
    "research_interests",
    "publications",
    "education",
    "experience",
    "awards",
    "skills"
  ],
  "style": "academic_formal",
  "emphasis": "research"
}
```

**Creative Template**:
```json
{
  "template": "creative",
  "sections": [
    "personal_info",
    "portfolio_summary",
    "projects",
    "skills",
    "experience",
    "education"
  ],
  "style": "visual_creative",
  "emphasis": "portfolio"
}
```

### Portfolio Configuration

**Portfolio Settings**:
```json
{
  "portfolio_generator": {
    "featured_project": "your-main-project",
    "max_projects": 6,
    "include_screenshots": true,
    "include_demo_links": true,
    "include_github_links": true,
    "include_technologies": true,
    "include_achievements": true
  }
}
```

**Deployment Options**:
```json
{
  "deploy_target": "github_pages",
  "custom_domain": "your-portfolio.com",
  "auto_deploy": true,
  "update_frequency": "weekly"
}
```

---

## Innovation Automation Configuration

### Master Config Section

```json
{
  "innovation_automations": {
    "idea_generator": {
      "enabled": true,
      "based_on_interests": [
        "AI/ML", 
        "Web Development", 
        "Mobile Apps", 
        "DevTools"
      ],
      "market_research": true,
      "trend_analysis": true,
      "competitor_analysis": true
    },
    "rapid_prototyping": {
      "enabled": true,
      "templates": [
        "mvp_webapp", 
        "mobile_prototype", 
        "api_service"
      ],
      "deployment_ready": true,
      "demo_generation": true
    }
  }
}
```

### Idea Generation Settings

**Interest Categories**:
```json
{
  "based_on_interests": [
    "AI/ML",              // Artificial Intelligence & Machine Learning
    "Web Development",     // Web applications and services
    "Mobile Apps",        // Mobile applications
    "DevTools",           // Developer tools and utilities
    "IoT",                // Internet of Things
    "Blockchain",         // Blockchain and cryptocurrency
    "AR/VR",              // Augmented/Virtual Reality
    "FinTech",            // Financial technology
    "HealthTech",         // Healthcare technology
    "EdTech"              // Educational technology
  ]
}
```

**Market Research Settings**:
```json
{
  "market_research": true,
  "trend_analysis": true,
  "competitor_analysis": true,
  "user_research": true,
  "market_sizing": true,
  "revenue_modeling": true
}
```

### Prototyping Configuration

**Prototype Templates**:
```json
{
  "templates": [
    "mvp_webapp",         // Minimum Viable Product web app
    "mobile_prototype",   // Mobile app prototype
    "api_service",        // API service prototype
    "desktop_app",        // Desktop application
    "chrome_extension",   // Browser extension
    "cli_tool"            // Command-line tool
  ]
}
```

**Deployment Settings**:
```json
{
  "deployment_ready": true,
  "demo_generation": true,
  "auto_deploy": true,
  "hosting_platform": "vercel",
  "database": "mongodb",
  "authentication": "firebase"
}
```

---

## Workflow Automation Configuration

### Master Config Section

```json
{
  "workflow_automations": {
    "work_session": {
      "enabled": true,
      "start_actions": [
        "open_project_tabs", 
        "start_focus_music", 
        "create_daily_folder", 
        "show_today_agenda"
      ],
      "end_actions": [
        "save_session_tabs", 
        "archive_work_files", 
        "generate_summary", 
        "cleanup_temp_files"
      ]
    },
    "schedule": {
      "work_hours": "09:00-17:00",
      "focus_blocks": ["10:00-12:00", "14:00-16:00"],
      "break_reminders": true,
      "end_of_day_cleanup": true
    }
  }
}
```

### Session Actions Configuration

**Start Actions**:
```json
{
  "start_actions": [
    "open_project_tabs",      // Open project-related tabs
    "start_focus_music",      // Start appropriate music
    "create_daily_folder",    // Create daily work folder
    "show_today_agenda",      // Display today's agenda
    "check_calendar",         // Check calendar events
    "set_focus_mode",         // Enable focus mode
    "start_timer"             // Start productivity timer
  ]
}
```

**End Actions**:
```json
{
  "end_actions": [
    "save_session_tabs",      // Save current tab session
    "archive_work_files",     // Archive work files
    "generate_summary",      // Generate session summary
    "cleanup_temp_files",    // Clean temporary files
    "update_progress",        // Update project progress
    "log_achievements",       // Log daily achievements
    "plan_tomorrow"           // Plan tomorrow's tasks
  ]
}
```

### Schedule Configuration

**Work Schedule**:
```json
{
  "schedule": {
    "work_hours": "09:00-17:00",
    "focus_blocks": [
      "10:00-12:00",          // Morning focus block
      "14:00-16:00"           // Afternoon focus block
    ],
    "break_reminders": true,
    "break_interval": "2_hours",
    "break_duration": "15_minutes",
    "end_of_day_cleanup": true,
    "weekend_mode": false
  }
}
```

**Session Types**:
```json
{
  "session_types": {
    "default": {
      "duration": "2_hours",
      "actions": ["standard"],
      "music_context": "default"
    },
    "focus": {
      "duration": "3_hours", 
      "actions": ["minimal_distractions"],
      "music_context": "focus"
    },
    "creative": {
      "duration": "2_hours",
      "actions": ["inspiration_mode"],
      "music_context": "creative"
    },
    "learning": {
      "duration": "1_hour",
      "actions": ["documentation_focus"],
      "music_context": "learning"
    },
    "meeting": {
      "duration": "1_hour",
      "actions": ["meeting_prep"],
      "music_context": "meetings"
    }
  }
}
```

---

## Environment Variables

### Environment File Setup

**File**: `.env`

```bash
# GitHub Configuration
GITHUB_USERNAME=your-username
GITHUB_TOKEN=your-github-token
GITHUB_ORG=your-organization

# Spotify Configuration
SPOTIFY_CLIENT_ID=your-spotify-client-id
SPOTIFY_CLIENT_SECRET=your-spotify-client-secret
SPOTIFY_REDIRECT_URI=http://localhost:3000/callback

# LinkedIn Configuration
LINKEDIN_PROFILE=https://linkedin.com/in/your-profile
LINKEDIN_API_KEY=your-linkedin-api-key

# Project Configuration
PROJECT_ROOT=/path/to/automations-suite
LOG_LEVEL=info
DEBUG_MODE=false

# External APIs
OPENAI_API_KEY=your-openai-api-key
ANTHROPIC_API_KEY=your-anthropic-api-key

# Database (if using)
DATABASE_URL=your-database-url
REDIS_URL=your-redis-url

# Deployment
DEPLOY_TARGET=github_pages
CUSTOM_DOMAIN=your-domain.com
```

### GitHub Token Setup

1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate new token with scopes:
   - `repo` (for private repositories)
   - `read:user` (for user information)
   - `read:org` (for organization data)
3. Copy token to `.env` file

### Spotify API Setup

1. Go to Spotify Developer Dashboard
2. Create new app
3. Get Client ID and Client Secret
4. Set redirect URI to `http://localhost:3000/callback`
5. Add credentials to `.env` file

---

## Configuration Validation

### Validation Script

**File**: `scripts/validate-config.js`

```javascript
const fs = require('fs');
const path = require('path');

class ConfigValidator {
    constructor() {
        this.configPath = path.join(__dirname, '../configs/master-config.json');
        this.envPath = path.join(__dirname, '../.env');
    }

    async validateAll() {
        console.log('🔍 Validating configuration...\n');
        
        await this.validateMasterConfig();
        await this.validateEnvironmentVariables();
        await this.validateMusicConfig();
        await this.validatePaths();
        
        console.log('✅ Configuration validation complete!');
    }

    async validateMasterConfig() {
        try {
            const config = JSON.parse(fs.readFileSync(this.configPath, 'utf8'));
            
            // Validate required sections
            const requiredSections = [
                'user_profile', 'music_automations', 'web_automations',
                'development_automations', 'career_automations',
                'innovation_automations', 'workflow_automations'
            ];
            
            requiredSections.forEach(section => {
                if (!config[section]) {
                    throw new Error(`Missing required section: ${section}`);
                }
            });
            
            console.log('✅ Master configuration valid');
        } catch (error) {
            console.log(`❌ Master configuration error: ${error.message}`);
        }
    }

    async validateEnvironmentVariables() {
        try {
            const envContent = fs.readFileSync(this.envPath, 'utf8');
            const envVars = envContent.split('\n')
                .filter(line => line.includes('='))
                .map(line => line.split('=')[0]);
            
            const requiredVars = [
                'GITHUB_USERNAME', 'SPOTIFY_CLIENT_ID', 
                'PROJECT_ROOT', 'LOG_LEVEL'
            ];
            
            requiredVars.forEach(varName => {
                if (!envVars.includes(varName)) {
                    throw new Error(`Missing required environment variable: ${varName}`);
                }
            });
            
            console.log('✅ Environment variables valid');
        } catch (error) {
            console.log(`❌ Environment variables error: ${error.message}`);
        }
    }

    async validateMusicConfig() {
        try {
            const musicConfigPath = path.join(__dirname, '../configs/music-contexts.json');
            const musicConfig = JSON.parse(fs.readFileSync(musicConfigPath, 'utf8'));
            
            // Validate playlist URIs
            Object.entries(musicConfig).forEach(([context, config]) => {
                if (!config.playlist_uri || config.playlist_uri.includes('REPLACE_WITH_YOUR')) {
                    throw new Error(`Invalid playlist URI for context: ${context}`);
                }
                
                if (config.volume < 0 || config.volume > 100) {
                    throw new Error(`Invalid volume for context: ${context}`);
                }
            });
            
            console.log('✅ Music configuration valid');
        } catch (error) {
            console.log(`❌ Music configuration error: ${error.message}`);
        }
    }

    async validatePaths() {
        try {
            const config = JSON.parse(fs.readFileSync(this.configPath, 'utf8'));
            const systemPaths = config.system_paths;
            
            Object.entries(systemPaths).forEach(([name, path]) => {
                if (!fs.existsSync(path)) {
                    throw new Error(`Path does not exist: ${name} (${path})`);
                }
            });
            
            console.log('✅ System paths valid');
        } catch (error) {
            console.log(`❌ System paths error: ${error.message}`);
        }
    }
}

// Run validation if called directly
if (require.main === module) {
    const validator = new ConfigValidator();
    validator.validateAll().catch(console.error);
}

module.exports = ConfigValidator;
```

### Running Validation

```bash
# Validate all configuration
node scripts/validate-config.js

# Validate specific sections
node scripts/validate-config.js --section music
node scripts/validate-config.js --section web
node scripts/validate-config.js --section development
```

---

## Configuration Examples

### Complete Configuration Example

**File**: `configs/master-config.json`

```json
{
  "user_profile": {
    "name": "johndoe",
    "email": "john@example.com",
    "organization": "TechCorp",
    "current_project": "my-awesome-project",
    "project_org": "johndoe",
    "development_level": "intermediate_to_advanced",
    "primary_languages": ["JavaScript", "Python", "TypeScript"],
    "frameworks": ["React", "Node.js", "Express", "Django"],
    "interests": ["AI/ML", "Web Development", "DevTools", "Open Source"]
  },
  "music_automations": {
    "smart_focus_music": {
      "enabled": true,
      "contexts": {
        "coding": {
          "volume": 65,
          "keywords": ["github", "vscode", "stackoverflow", "localhost"],
          "playlist_type": "upbeat_focus"
        },
        "focus": {
          "volume": 45,
          "keywords": ["docs", "reading", "research", "learning"],
          "playlist_type": "ambient_concentration"
        },
        "meetings": {
          "volume": 20,
          "keywords": ["zoom", "meet", "teams", "calendar"],
          "playlist_type": "quiet_ambient"
        },
        "creative": {
          "volume": 70,
          "keywords": ["figma", "design", "adobe", "sketch"],
          "playlist_type": "inspiring"
        }
      },
      "base_volume": 55,
      "preferred_genres": ["Electronic", "Ambient", "Jazz"],
      "check_interval_seconds": 30
    },
    "meeting_music_control": {
      "enabled": true,
      "action_on_meeting": "pause",
      "resume_delay_seconds": 5,
      "quiet_volume": 15,
      "meeting_patterns": [
        "zoom.us", "meet.google.com", "teams.microsoft.com"
      ]
    }
  },
  "web_automations": {
    "tab_declutter": {
      "enabled": true,
      "auto_close_rules": {
        "duplicates": true,
        "old_searches": "after_30_minutes",
        "youtube_watched": "after_1_hour",
        "social_media": "limit_to_2_tabs"
      },
      "keep_patterns": [
        "github.com/johndoe",
        "gmail.com",
        "docs.google.com",
        "drive.google.com"
      ],
      "grouping_rules": {
        "development": ["github", "localhost", "stackblitz"],
        "productivity": ["gmail", "sheets", "drive", "calendar"],
        "learning": ["youtube", "medium", "dev.to", "stackoverflow"],
        "ai_tools": ["chatgpt", "claude", "copilot"]
      }
    },
    "research_assistant": {
      "enabled": true,
      "auto_open_docs": true,
      "project_context": "my-awesome-project",
      "related_technologies": ["React", "Node.js", "MongoDB"]
    }
  },
  "development_automations": {
    "code_health_checker": {
      "enabled": true,
      "analysis_types": [
        "error_patterns",
        "best_practices",
        "performance",
        "security"
      ],
      "learning_mode": true,
      "generate_explanations": true
    },
    "documentation_generator": {
      "enabled": true,
      "auto_generate": true,
      "include_explanations": true,
      "learning_notes": true,
      "update_frequency": "weekly"
    }
  },
  "career_automations": {
    "resume_builder": {
      "enabled": true,
      "template": "modern_developer",
      "auto_update": true,
      "sync_with_projects": true,
      "extract_skills_from_code": true
    },
    "portfolio_generator": {
      "enabled": true,
      "featured_project": "my-awesome-project",
      "auto_generate": true,
      "include_analytics": true,
      "deploy_target": "github_pages"
    }
  },
  "innovation_automations": {
    "idea_generator": {
      "enabled": true,
      "based_on_interests": [
        "AI/ML",
        "Web Development",
        "DevTools"
      ],
      "market_research": true,
      "trend_analysis": true,
      "competitor_analysis": true
    },
    "rapid_prototyping": {
      "enabled": true,
      "templates": [
        "mvp_webapp",
        "api_service"
      ],
      "deployment_ready": true,
      "demo_generation": true
    }
  },
  "workflow_automations": {
    "work_session": {
      "enabled": true,
      "start_actions": [
        "open_project_tabs",
        "start_focus_music",
        "create_daily_folder",
        "show_today_agenda"
      ],
      "end_actions": [
        "save_session_tabs",
        "archive_work_files",
        "generate_summary",
        "cleanup_temp_files"
      ]
    },
    "schedule": {
      "work_hours": "09:00-17:00",
      "focus_blocks": ["10:00-12:00", "14:00-16:00"],
      "break_reminders": true,
      "end_of_day_cleanup": true
    }
  },
  "system_paths": {
    "home": "/Users/johndoe",
    "downloads": "/Users/johndoe/Downloads",
    "documents": "/Users/johndoe/Documents",
    "projects": "/Users/johndoe/Projects",
    "automation_suite": "/Users/johndoe/automations-suite"
  }
}
```

---

This configuration guide provides comprehensive instructions for customizing all automation modules. Each section includes detailed examples, validation methods, and best practices for optimal configuration.