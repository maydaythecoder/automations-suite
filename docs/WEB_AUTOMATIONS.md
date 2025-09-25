# 🌐 Web Automations Documentation

## Overview

The Web Automations module provides intelligent Chrome tab management and web productivity tools. It automatically organizes, declutters, and manages your browsing sessions for improved focus and productivity.

## Features

- **Intelligent Tab Decluttering**: Automatically closes duplicate and old tabs
- **Smart Tab Grouping**: Organizes tabs by category and context
- **Session Management**: Saves and restores browsing sessions
- **Context-Aware Organization**: Adapts to your work patterns
- **Research Assistant**: Auto-opens relevant documentation

## Architecture

```
Web Automations
├── tab-manager.js              # Main tab management controller
├── sessions/                   # Saved tab sessions
├── configs/master-config.json  # Tab management configuration
└── output/                    # Analytics and logs
```

## Components

### TabManager

Main controller for Chrome tab management.

**File**: `web/tab-manager.js`

#### Key Methods

```javascript
// Get all Chrome tabs
const tabs = await manager.getChromeTabs()

// Declutter tabs intelligently
await manager.declutterTabs('standard')

// Group tabs by category
await manager.groupTabs()

// Save current session
await manager.saveSession(tabs, 'session-name')

// Restore saved session
await manager.restoreSession('session-name')

// Close tabs by pattern
await manager.closeTabsByPattern('google.com/search')
```

#### Tab Analysis

The manager analyzes tabs for intelligent management:

```javascript
analyzeTabs(tabs) {
    return {
        categories: {},    // Group by category
        domains: {},       // Group by domain
        duplicates: {},    // Find duplicate tabs
        patterns: {}       // Identify patterns
    }
}
```

### Session Management

Handles saving and restoring browsing sessions.

#### Session Data Structure

```javascript
{
    name: 'work-session-2024-01-15',
    timestamp: '2024-01-15T10:30:00Z',
    tabs: [
        {
            title: 'GitHub - Repository',
            url: 'https://github.com/user/repo',
            domain: 'github.com',
            category: 'development'
        }
    ]
}
```

## Configuration

### Tab Management Rules

Edit `configs/master-config.json`:

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
    }
  }
}
```

### Declutter Modes

**Gentle Mode**: Only removes obvious duplicates and very old tabs
```bash
node web/tab-manager.js declutter gentle
```

**Standard Mode**: Smart cleanup based on usage patterns
```bash
node web/tab-manager.js declutter standard
```

**Aggressive Mode**: Keeps only essential work tabs
```bash
node web/tab-manager.js declutter aggressive
```

**Focus Mode**: Closes everything except current project
```bash
node web/tab-manager.js declutter focus
```

**Meeting Mode**: Minimizes to essential tabs only
```bash
node web/tab-manager.js declutter meeting
```

## Usage

### Command Line Interface

```bash
# Analyze current tabs
node web/tab-manager.js analyze

# Declutter tabs
node web/tab-manager.js declutter [mode]

# Group tabs by category
node web/tab-manager.js group

# Save current session
node web/tab-manager.js save [session-name]

# Restore session
node web/tab-manager.js restore [session-name]

# Close tabs by pattern
node web/tab-manager.js close [pattern]
```

### Natural Language Commands

```bash
# Via automation controller
node automation-controller.js "Declutter my tabs"
node automation-controller.js "Group my tabs"
node automation-controller.js "Save current session"
node automation-controller.js "Clean duplicate tabs"
```

### Programmatic Usage

```javascript
const TabManager = require('./web/tab-manager');

const manager = new TabManager();

// Get current tabs
const tabs = await manager.getChromeTabs();

// Analyze tabs
const analysis = manager.analyzeTabs(tabs);

// Declutter
await manager.declutterTabs('standard');

// Save session
await manager.saveSession(tabs, 'work-session');
```

## Tab Categorization

### Automatic Categories

**Development**
- GitHub repositories
- Local development servers (localhost)
- Code editors (VS Code, StackBlitz)
- Documentation sites

**Productivity**
- Email (Gmail, Outlook)
- Calendar and scheduling
- Document editors (Google Docs, Sheets)
- Cloud storage (Drive, Dropbox)

**Learning**
- Educational content (YouTube, Coursera)
- Technical blogs (Medium, Dev.to)
- Documentation sites
- Tutorial platforms

**AI Tools**
- AI chat interfaces (ChatGPT, Claude)
- AI coding assistants (GitHub Copilot)
- AI research tools
- Machine learning platforms

**Social Media**
- Twitter, Facebook, Instagram
- LinkedIn, Reddit
- Communication platforms

### Custom Categories

Add custom categories in configuration:

```json
{
  "grouping_rules": {
    "custom_category": ["keyword1", "keyword2", "domain.com"],
    "project_specific": ["project-name", "specific-url"]
  }
}
```

## Tab Scoring System

Tabs are scored based on importance and usage:

```javascript
const tabScores = {
    "github.com/your-username": 10,    // Active project
    "gmail.com": 9,                   // Important communication
    "docs.google.com": 8,              // Work documents
    "youtube.com/watch": 3,           // Entertainment
    "google.com/search": 2             // Old searches
};
```

### Scoring Factors

- **Domain Importance**: Work domains score higher
- **Recency**: Recently accessed tabs score higher
- **User Patterns**: Frequently used tabs score higher
- **Content Type**: Active work content scores higher

## Session Management

### Auto-Save Sessions

Sessions are automatically saved:
- Before major declutter operations
- Daily backups (morning and evening)
- Project-specific sessions
- Focus session snapshots

### Session Restoration

```bash
# Restore work session
node web/tab-manager.js restore work-session

# Restore learning session
node web/tab-manager.js restore learning-session

# Restore project session
node web/tab-manager.js restore project-session

# Emergency restore (last closed session)
node web/tab-manager.js restore emergency
```

### Session Data

Sessions include:
- Tab URLs and titles
- Tab categories
- Timestamp information
- User context
- Productivity metrics

## Chrome Integration

### AppleScript Integration

The system uses AppleScript to control Chrome:

```applescript
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
```

### Tab Operations

**Get Tabs**:
```applescript
tell application "Google Chrome"
    get tabs of window 1
end tell
```

**Close Tab**:
```applescript
tell application "Google Chrome"
    close tab 1 of window 1
end tell
```

**Open URL**:
```applescript
tell application "Google Chrome"
    open location "https://example.com"
end tell
```

## Analytics and Insights

### Tab Usage Analytics

The system tracks:
- Average tabs open per day
- Most visited domains
- Tab lifespan statistics
- Productivity correlation with tab count
- Focus improvement metrics

### Usage Reports

**Daily Report**:
```json
{
    "date": "2024-01-15",
    "total_tabs": 45,
    "categories": {
        "development": 15,
        "productivity": 12,
        "learning": 8,
        "social_media": 10
    },
    "productivity_score": 85,
    "focus_time": "4h 30m"
}
```

**Weekly Trends**:
- Tab count trends
- Category distribution changes
- Productivity patterns
- Focus improvement metrics

## Research Assistant

### Auto-Documentation Opening

When you visit a coding project, the research assistant:
1. Detects project technology stack
2. Identifies relevant documentation
3. Auto-opens documentation tabs
4. Organizes resources by category

### Context Detection

**Project Detection**:
- GitHub repository URLs
- Local development servers
- Code editor tabs
- Project-specific domains

**Documentation Mapping**:
```javascript
const docMapping = {
    "react": ["reactjs.org", "react.dev"],
    "node": ["nodejs.org", "expressjs.com"],
    "python": ["python.org", "docs.python.org"],
    "javascript": ["mdn.mozilla.org", "javascript.info"]
};
```

## Troubleshooting

### Common Issues

#### Chrome Tabs Not Detected

**Symptoms**: No tabs found or empty tab list

**Solutions**:
1. Ensure Chrome is running
2. Check AppleScript permissions
3. Verify Chrome is the default browser
4. Test with: `node web/tab-manager.js analyze`

#### Tab Operations Fail

**Symptoms**: Cannot close or manipulate tabs

**Solutions**:
1. Check Chrome permissions
2. Ensure tabs are not pinned
3. Verify tab indices are correct
4. Test with: `node web/tab-manager.js close test`

#### Session Save/Restore Issues

**Symptoms**: Sessions not saving or restoring correctly

**Solutions**:
1. Check file permissions in sessions directory
2. Verify session data format
3. Ensure sufficient disk space
4. Test with: `node web/tab-manager.js save test`

### Debug Commands

```bash
# Test tab detection
node web/tab-manager.js analyze

# Test declutter (dry run)
node web/tab-manager.js declutter standard

# Test session operations
node web/tab-manager.js save debug-session
node web/tab-manager.js restore debug-session

# Test Chrome integration
node web/tab-manager.js group
```

### Permission Issues

**macOS Permissions Required**:
1. **Accessibility**: Terminal/VS Code needs accessibility permissions
2. **Automation**: Allow Chrome automation
3. **File Access**: Grant access to sessions directory

**Grant Permissions**:
1. System Preferences → Security & Privacy → Privacy
2. Select "Accessibility" from left sidebar
3. Add Terminal, VS Code, and other apps
4. Restart applications after granting permissions

## Performance Considerations

### Optimization Tips

1. **Batch Operations**: Group multiple tab operations
2. **Cache Tab Data**: Avoid repeated Chrome queries
3. **Smart Scheduling**: Run declutter during breaks
4. **Memory Management**: Clear old session data

### Resource Usage

- **CPU**: Minimal impact (< 2%)
- **Memory**: ~15MB for manager
- **Network**: Only for documentation lookup
- **Disk**: Session files (~5MB/day)

## Integration with Other Automations

### Music Automation

Coordinates with music automation:
- Tab context detection triggers music changes
- Music context influences tab organization
- Session saving includes music context

### Work Session Manager

Integrates with work sessions:
- Automatic tab organization during sessions
- Session-specific tab management
- Productivity tracking through tab usage

### Code Analyzer

Coordinates with code analysis:
- Opens documentation tabs for analyzed projects
- Organizes development resources
- Maintains coding context tabs

## Future Enhancements

### Planned Features

1. **Cross-Browser Support**: Firefox, Safari integration
2. **Advanced Analytics**: Machine learning insights
3. **Team Collaboration**: Shared tab sessions
4. **Mobile Integration**: Mobile browser management
5. **AI-Powered Organization**: Intelligent tab grouping

### API Improvements

1. **REST API**: HTTP endpoints for external control
2. **WebSocket**: Real-time tab updates
3. **Plugin System**: Third-party integrations
4. **Configuration UI**: Web-based configuration interface

---

**Web automation is ready to organize your browsing!** 🌐

Start with `node automation-controller.js "Declutter my tabs"` and watch your productivity soar!