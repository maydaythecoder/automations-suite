# 🎯 Personal Automation Suite

A comprehensive collection of AI-powered automations for productivity, development, and career enhancement.

## 📋 Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Automation Categories](#automation-categories)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Reference](#api-reference)
- [Output Formats](#output-formats)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

This automation suite leverages AI and intelligent scripting to streamline your daily workflow, enhance coding productivity, and accelerate career development. All automations are fully functional and ready to use.

### Key Features

- **🎵 Smart Music Control**: Automatically switches Spotify music based on work context
- **🌐 Intelligent Tab Management**: Declutters and organizes Chrome tabs intelligently
- **💻 Code Health Analysis**: Analyzes code with learning-focused explanations
- **📝 Resume Generation**: Builds professional resumes from GitHub projects
- **💡 App Idea Generation**: Creates innovative app ideas with market research
- **🔄 Workflow Automation**: Manages complete work sessions with integrated actions

### Technology Stack

- **Runtime**: Node.js
- **Language**: JavaScript
- **Integrations**: Spotify (AppleScript), Chrome (AppleScript), GitHub API
- **Output Formats**: Markdown, HTML, JSON, PDF
- **Platform**: macOS (with AppleScript integration)

## 🚀 Quick Start

### 1. Prerequisites

- macOS (for AppleScript integrations)
- Node.js (v14 or higher)
- Spotify Desktop App
- Google Chrome
- Git

### 2. Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd automations-suite

# Install dependencies (if any)
npm install

# Run setup
node setup-automations.js
```

### 3. First Run

```bash
# Check system status
node automation-controller.js status

# Start with music automation
node automation-controller.js "Start smart focus music"

# Clean up your tabs
node automation-controller.js "Declutter my tabs"

# Analyze your code
node automation-controller.js "Analyze my code"
```

## 🎯 Automation Categories

### 🎵 Music Automations

**Smart Focus Music**
- Automatically detects work context from Chrome tabs
- Switches Spotify playlists based on activity
- Supports coding, focus, meetings, creative contexts
- Volume control and playlist management

**Meeting Music Control**
- Automatically pauses music during video calls
- Resumes music after meetings end
- Supports Zoom, Meet, Teams, WebEx

### 🌐 Web Automations

**Tab Declutter**
- Intelligently closes duplicate and old tabs
- Groups related tabs by category
- Saves important sessions for later
- Learns from usage patterns

**Research Assistant**
- Auto-opens relevant documentation
- Context-aware tab management
- Project-specific resource organization

### 💻 Development Automations

**Code Health Checker**
- Analyzes code patterns and best practices
- Provides learning-focused explanations
- Generates improvement suggestions
- Tracks progress over time

**Documentation Generator**
- Auto-generates project documentation
- Includes learning notes and explanations
- Updates based on code changes

### 📝 Career Automations

**Resume Builder & Updater**
- Extracts skills from GitHub repositories
- Generates professional resume formats
- Multiple output formats (Markdown, HTML, PDF)
- Auto-updates with new projects

**Portfolio Generator**
- Creates portfolio content from projects
- Generates case studies and descriptions
- Extracts technical achievements

### 💡 Innovation Automations

**App Idea Generator**
- Generates innovative app concepts
- Includes market research and validation
- Calculates success probability
- Provides detailed business analysis

**Market Research Assistant**
- Analyzes market trends and opportunities
- Competitor analysis and gap identification
- User persona generation

### 🔄 Workflow Automations

**Work Session Manager**
- Handles complete work session lifecycle
- Integrates all other automations
- Tracks productivity metrics
- Generates session summaries

## ⚙️ Installation

### System Requirements

- **Operating System**: macOS 10.14 or higher
- **Node.js**: Version 14 or higher
- **Applications**: Spotify Desktop, Google Chrome
- **Permissions**: Accessibility permissions for AppleScript

### Step-by-Step Installation

1. **Clone Repository**
   ```bash
   git clone <repository-url>
   cd automations-suite
   ```

2. **Verify Node.js**
   ```bash
   node --version  # Should be v14+
   ```

3. **Run Setup Script**
   ```bash
   node setup-automations.js
   ```

4. **Grant Permissions**
   - System Preferences → Security & Privacy → Privacy
   - Add Terminal/VS Code to Accessibility permissions
   - Allow Spotify and Chrome automation

5. **Test Installation**
   ```bash
   node automation-controller.js status
   ```

## 🔧 Configuration

### Master Configuration

Edit `configs/master-config.json`:

```json
{
  "user_profile": {
    "name": "your-username",
    "email": "your-email@domain.com",
    "organization": "your-org",
    "current_project": "your-project",
    "primary_languages": ["JavaScript", "Python"],
    "frameworks": ["React", "Node.js"]
  },
  "music_automations": {
    "smart_focus_music": { "enabled": true },
    "meeting_music_control": { "enabled": true }
  },
  "web_automations": {
    "tab_declutter": { "enabled": true },
    "research_assistant": { "enabled": true }
  }
}
```

### Music Configuration

Edit `configs/music-contexts.json`:

```json
{
  "coding": {
    "playlist_uri": "spotify:playlist:YOUR_CODING_PLAYLIST_ID",
    "volume": 60,
    "keywords": ["github", "vscode", "code"],
    "description": "Upbeat music for coding"
  },
  "focus": {
    "playlist_uri": "spotify:playlist:YOUR_FOCUS_PLAYLIST_ID",
    "volume": 40,
    "keywords": ["docs", "reading", "learning"],
    "description": "Ambient music for focus"
  }
}
```

### Environment Variables

Create `.env` file:

```bash
GITHUB_USERNAME=your-username
GITHUB_TOKEN=your-github-token
SPOTIFY_CLIENT_ID=your-spotify-client-id
SPOTIFY_CLIENT_SECRET=your-spotify-client-secret
LINKEDIN_PROFILE=https://linkedin.com/in/your-profile
PROJECT_ROOT=/path/to/automations-suite
LOG_LEVEL=info
```

## 📖 Usage

### Natural Language Commands

The automation controller understands natural language:

```bash
# Music commands
"Start smart focus music"
"Switch to coding music"
"Stop smart music"

# Web commands
"Declutter my tabs"
"Group my tabs"
"Save current session"

# Development commands
"Analyze my code"
"Generate project docs"

# Career commands
"Build my resume"
"Generate portfolio"

# Innovation commands
"Generate app ideas"
"Research market for [idea]"

# Workflow commands
"Start work session"
"End work session"
"Show session status"
```

### Direct Controller Commands

```bash
# System commands
node automation-controller.js status
node automation-controller.js help
node automation-controller.js interactive

# Individual automation commands
node music/smart-music-controller.js start
node web/tab-manager.js declutter
node development/code-analyzer.js analyze
node career/resume-builder.js build
node innovation/app-idea-generator.js generate 5
node workflows/work-session-manager.js start
```

### Interactive Mode

```bash
node automation-controller.js interactive
```

This starts an interactive session where you can type commands naturally:

```
automation> Start smart focus music
automation> Declutter my tabs
automation> Generate app ideas
automation> exit
```

## 📚 API Reference

### AutomationController

Main controller class for all automations.

#### Methods

- `executeCommand(command, params)` - Execute automation command
- `showSystemStatus()` - Display status of all automations
- `runInteractiveMode()` - Start interactive command mode

#### Usage

```javascript
const AutomationController = require('./automation-controller');
const controller = new AutomationController();

// Execute command
await controller.executeCommand('Start smart focus music');

// Show status
await controller.showSystemStatus();
```

### MusicController

Smart focus music automation.

#### Methods

- `startSmartMusic()` - Start automatic music switching
- `stopSmartMusic()` - Stop music automation
- `manualSwitch(context)` - Manually switch to context
- `showStatus()` - Display current status

#### Usage

```javascript
const MusicController = require('./music/smart-music-controller');
const controller = new MusicController();

await controller.startSmartMusic();
await controller.manualSwitch('coding');
```

### TabManager

Chrome tab management automation.

#### Methods

- `getChromeTabs()` - Get all open Chrome tabs
- `declutterTabs(mode)` - Clean up tabs intelligently
- `groupTabs()` - Group tabs by category
- `saveSession(tabs, name)` - Save current tab session

#### Usage

```javascript
const TabManager = require('./web/tab-manager');
const manager = new TabManager();

const tabs = await manager.getChromeTabs();
await manager.declutterTabs('standard');
```

### CodeAnalyzer

Code health analysis with learning explanations.

#### Methods

- `analyzeProject(path)` - Analyze project code health
- `generateDocumentation(path)` - Generate project docs
- `scanFiles(path)` - Scan project files

#### Usage

```javascript
const CodeAnalyzer = require('./development/code-analyzer');
const analyzer = new CodeAnalyzer();

const analysis = await analyzer.analyzeProject('.');
await analyzer.generateDocumentation('.');
```

### ResumeBuilder

Professional resume generation from GitHub.

#### Methods

- `analyzeGitHubProfile()` - Analyze GitHub profile
- `generateResume(githubData)` - Generate resume data
- `generateResumeFiles(resumeData)` - Create resume files
- `generatePortfolioContent(githubData)` - Create portfolio

#### Usage

```javascript
const ResumeBuilder = require('./career/resume-builder');
const builder = new ResumeBuilder();

const githubData = await builder.analyzeGitHubProfile();
const resumeData = builder.generateResume(githubData);
await builder.generateResumeFiles(resumeData);
```

### AppIdeaGenerator

Innovative app idea generation with market research.

#### Methods

- `generateAppIdeas(count, category)` - Generate app ideas
- `analyzeMarketPotential(ideas)` - Analyze market potential
- `validateIdea(ideaId, data)` - Validate app idea

#### Usage

```javascript
const AppIdeaGenerator = require('./innovation/app-idea-generator');
const generator = new AppIdeaGenerator();

const ideas = await generator.generateAppIdeas(5);
const analyzed = await generator.analyzeMarketPotential(ideas);
```

### WorkSessionManager

Complete work session automation.

#### Methods

- `startWorkSession(type)` - Start work session
- `endWorkSession(sessionId)` - End work session
- `showSessionStatus()` - Display session status
- `getSessionHistory(days)` - Get session history

#### Usage

```javascript
const WorkSessionManager = require('./workflows/work-session-manager');
const manager = new WorkSessionManager();

const session = await manager.startWorkSession('focus');
await manager.endWorkSession(session.id);
```

## 📄 Output Formats

### Resume Outputs

**Markdown Format** (`resume_YYYY-MM-DD.md`)
```markdown
# John Doe

**john@example.com** | **San Francisco, CA** | **+1 (555) 123-4567**

## Professional Summary
Experienced developer with expertise in...

## Experience
### Software Developer - Company Name
*San Francisco, CA | 2020 - Present*
• Developed web applications using React and Node.js
```

**HTML Format** (`resume_YYYY-MM-DD.html`)
- Professional styling with CSS
- Responsive design
- Print-friendly layout

**JSON Format** (`resume_YYYY-MM-DD.json`)
```json
{
  "personal": {
    "name": "John Doe",
    "email": "john@example.com"
  },
  "experience": [...],
  "projects": [...],
  "skills": {...}
}
```

### App Idea Reports

**Individual Idea Report** (`idea_[id]_YYYY-MM-DD.md`)
```markdown
# Smart Learning Assistant

**Category:** ai_ml  
**Success Probability:** 75%  
**Time to Market:** 6-12 months

## Description
AI-powered personalized learning platform...

## Market Analysis
- **Competition Level:** Medium
- **Market Readiness:** High
- **User Demand:** High
```

**Summary Report** (`app_ideas_summary_YYYY-MM-DD.md`)
- Top ideas by success probability
- Category breakdown
- Technology trends
- Recommendations

### Code Analysis Reports

**Health Report** (`CODE_HEALTH_REPORT.md`)
```markdown
# Code Health Report

## Summary
- Files analyzed: 25
- Issues found: 8
- Learning topics: 3

## Technology Stack
- JavaScript: 15 files
- Python: 8 files
- TypeScript: 2 files

## Recommendations
- **HIGH**: Fix security vulnerabilities
- **MEDIUM**: Optimize performance issues
```

### Session Reports

**Session Summary** (`summary_[session-id].json`)
```json
{
  "session_id": "session_1234567890_abcde",
  "duration": "2h 30m",
  "actions_completed": 6,
  "productivity_score": 85,
  "recommendations": [
    "Complete more start actions for better session setup"
  ]
}
```

## 🔧 Troubleshooting

### Common Issues

#### Music Automation Not Working

**Problem**: Music doesn't switch automatically
**Solutions**:
1. Check if Spotify is running
2. Verify playlist URIs in `configs/music-contexts.json`
3. Ensure AppleScript permissions are granted
4. Test with: `node music/smart-music-controller.js status`

#### Tab Management Issues

**Problem**: Chrome tabs not detected
**Solutions**:
1. Ensure Chrome is running
2. Check AppleScript permissions
3. Verify Chrome is the default browser
4. Test with: `node web/tab-manager.js analyze`

#### Code Analysis Errors

**Problem**: File scanning fails
**Solutions**:
1. Check file permissions
2. Ensure you're in a project directory
3. Verify Node.js version (v14+)
4. Test with: `node development/code-analyzer.js analyze .`

#### Resume Generation Issues

**Problem**: GitHub data not found
**Solutions**:
1. Verify GitHub username in config
2. Check internet connection
3. Ensure GitHub profile is public
4. Test with: `node career/resume-builder.js analyze`

### Debug Commands

```bash
# Test individual components
node music/smart-music-controller.js status
node web/tab-manager.js analyze
node development/code-analyzer.js analyze .
node career/resume-builder.js analyze
node innovation/app-idea-generator.js generate 1
node workflows/work-session-manager.js status

# Check system status
node automation-controller.js status

# View logs
tail -f logs/automation.log
```

### Permission Issues

**macOS Permissions Required**:
1. **Accessibility**: Terminal/VS Code needs accessibility permissions
2. **Automation**: Allow Spotify and Chrome automation
3. **File Access**: Grant access to Documents and Downloads folders

**Grant Permissions**:
1. System Preferences → Security & Privacy → Privacy
2. Select "Accessibility" from left sidebar
3. Add Terminal, VS Code, and other apps
4. Restart applications after granting permissions

### Performance Issues

**Slow Execution**:
1. Check system resources (CPU, Memory)
2. Close unnecessary applications
3. Reduce number of concurrent automations
4. Check network connectivity

**Memory Usage**:
1. Monitor Node.js memory usage
2. Restart automation controller periodically
3. Clear temporary files regularly

## 🤝 Contributing

### Development Setup

1. **Fork Repository**
   ```bash
   git fork <repository-url>
   cd automations-suite
   ```

2. **Create Feature Branch**
   ```bash
   git checkout -b feature/new-automation
   ```

3. **Make Changes**
   - Follow existing code style
   - Add tests for new features
   - Update documentation

4. **Test Changes**
   ```bash
   node setup-automations.js
   node automation-controller.js status
   ```

5. **Submit Pull Request**
   - Describe changes clearly
   - Include test results
   - Update documentation

### Code Style

- Use ES6+ JavaScript features
- Follow existing naming conventions
- Add JSDoc comments for functions
- Include error handling
- Write descriptive commit messages

### Testing

```bash
# Run all tests
npm test

# Test individual modules
node music/smart-music-controller.js status
node web/tab-manager.js analyze
node development/code-analyzer.js analyze .
```

## 📄 License

MIT License - Feel free to use and modify for your personal projects.

## 🆘 Support

### Getting Help

1. **Check Documentation**: Review this README and individual module docs
2. **Run Debug Commands**: Use troubleshooting commands above
3. **Check Logs**: Review log files in `logs/` directory
4. **Test Components**: Run individual automation tests

### Reporting Issues

When reporting issues, include:
- Operating system and version
- Node.js version
- Error messages and stack traces
- Steps to reproduce
- Expected vs actual behavior

### Feature Requests

For new features:
- Describe the use case
- Explain how it fits with existing automations
- Provide examples of desired functionality
- Consider implementation complexity

---

**Your automation suite is ready to boost your productivity!** 🎯

Start with `node automation-controller.js "Start smart focus music"` and watch the magic happen!