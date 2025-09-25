# 🔄 Workflow Automations Documentation

## Overview

The Workflow Automations module provides intelligent work session management, productivity tracking, and integrated automation orchestration. It coordinates all other automations to create seamless, productive work experiences.

## Features

- **Work Session Management**: Complete start/end session automation
- **Integrated Actions**: Coordinates music, tabs, files, and more
- **Productivity Tracking**: Monitors and analyzes work patterns
- **Session Analytics**: Detailed productivity metrics and insights
- **Smart Scheduling**: Adapts to your work schedule and preferences
- **Break Management**: Intelligent break reminders and management

## Architecture

``` txt
Workflow Automations
├── work-session-manager.js     # Main session management controller
├── sessions/                   # Session data and history
├── configs/master-config.json  # Workflow configuration
└── logs/                       # Session logs and analytics
```

## Components

### WorkSessionManager

Main controller for work session management and automation orchestration.

**File**: `workflows/work-session-manager.js`

#### Key Methods

```javascript
// Start work session
const session = await manager.startWorkSession('focus')

// End work session
await manager.endWorkSession(sessionId)

// Show session status
await manager.showSessionStatus()

// Get session history
const history = await manager.getSessionHistory(7)

// Get active session
const active = await manager.getActiveSession()
```

#### Session Data Structure

```javascript
{
    id: 'session_1758759691008_wnpg9',
    type: 'focus',
    start_time: '2024-01-15T10:30:00Z',
    end_time: '2024-01-15T12:30:00Z',
    status: 'completed',
    actions_completed: [
        {
            action: 'open_project_tabs',
            completed_at: '2024-01-15T10:30:05Z',
            status: 'success'
        }
    ],
    tabs_saved: [...],
    music_context: 'coding',
    project_context: 'embrr-wat-dev-fest-2025',
    productivity_score: 85,
    summary: {...}
}
```

## Configuration

### Workflow Configuration

Edit `configs/master-config.json`:

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

### Session Types

**Default Session**:

- Standard work session
- All automations enabled
- Balanced productivity focus

**Focus Session**:

- Deep work emphasis
- Minimal distractions
- Extended focus blocks
- Enhanced music automation

**Creative Session**:

- Creative work emphasis
- Inspiring music
- Design tools integration
- Brainstorming support

**Learning Session**:

- Educational content focus
- Documentation integration
- Tutorial support
- Knowledge management

**Meeting Session**:

- Meeting preparation
- Audio optimization
- Note-taking support
- Follow-up automation

## Usage

### Command Line Interface

```bash
# Start work session
node workflows/work-session-manager.js start [type]

# End work session
node workflows/work-session-manager.js end [session-id]

# Show session status
node workflows/work-session-manager.js status

# Show session history
node workflows/work-session-manager.js history [days]
```

### Natural Language Commands

```bash
# Via automation controller
node automation-controller.js "Start work session"
node automation-controller.js "Start focus session"
node automation-controller.js "End work session"
node automation-controller.js "Show session status"
node automation-controller.js "Show my productivity"
```

### Programmatic Usage

```javascript
const WorkSessionManager = require('./workflows/work-session-manager');

const manager = new WorkSessionManager();

// Start session
const session = await manager.startWorkSession('focus');

// End session
await manager.endWorkSession(session.id);

// Check status
await manager.showSessionStatus();

// Get history
const history = await manager.getSessionHistory(7);
```

## Session Actions

### Start Actions

**Open Project Tabs**:

```javascript
async openProjectTabs(session) {
    const projectUrls = [
        'https://github.com/think-outside-the-valley/embrr-wat-dev-fest-2025',
        'https://docs.google.com/spreadsheets',
        'https://drive.google.com/drive',
        'https://mail.google.com'
    ];

    for (const url of projectUrls) {
        execSync(`open -a "Google Chrome" "${url}"`);
        session.tabs_saved.push(url);
    }
}
```

**Start Focus Music**:

```javascript
async startFocusMusic(session) {
    const musicController = require('../music/smart-music-controller');
    const controller = new musicController();
    await controller.startSmartMusic();
    session.music_context = 'smart_focus';
}
```

**Create Daily Folder**:

```javascript
async createDailyFolder(session) {
    const today = new Date().toISOString().split('T')[0];
    const dailyFolder = path.join(process.env.HOME, 'Documents', 'Work', today);
    
    if (!fs.existsSync(dailyFolder)) {
        fs.mkdirSync(dailyFolder, { recursive: true });
    }
    
    session.daily_folder = dailyFolder;
}
```

**Show Today's Agenda**:

```javascript
async showTodayAgenda(session) {
    console.log('📅 Today\'s Agenda:');
    console.log('   🎯 Focus on embrr-wat-dev-fest-2025 project');
    console.log('   📊 Review automation suite implementations');
    console.log('   🧪 Test new automation features');
    console.log('   📝 Update documentation');
    console.log('   ☕ Break reminders every 2 hours');
    
    session.agenda_shown = true;
}
```

### End Actions

**Save Session Tabs**:

```javascript
async saveSessionTabs(session) {
    const tabManager = require('../web/tab-manager');
    const manager = new tabManager();
    const tabs = await manager.getChromeTabs();
    await manager.saveSession(tabs, `session_${session.id}`);
    session.tabs_saved = tabs.map(tab => tab.url);
}
```

**Archive Work Files**:

```javascript
async archiveWorkFiles(session) {
    const today = new Date().toISOString().split('T')[0];
    const archiveFolder = path.join(process.env.HOME, 'Documents', 'Work', 'Archive', today);
    
    if (!fs.existsSync(archiveFolder)) {
        fs.mkdirSync(archiveFolder, { recursive: true });
    }
    
    // Archive work files from today
    const workFolder = path.join(process.env.HOME, 'Documents', 'Work', today);
    if (fs.existsSync(workFolder)) {
        const files = fs.readdirSync(workFolder);
        files.forEach(file => {
            const sourcePath = path.join(workFolder, file);
            const destPath = path.join(archiveFolder, file);
            if (fs.statSync(sourcePath).isFile()) {
                fs.copyFileSync(sourcePath, destPath);
            }
        });
    }
    
    session.files_archived = archiveFolder;
}
```

**Generate Summary**:

```javascript
async generateSummary(session) {
    const summary = {
        session_id: session.id,
        duration: this.calculateDuration(session.start_time),
        actions_completed: session.actions_completed.length,
        tabs_saved: session.tabs_saved.length,
        music_context: session.music_context,
        project_context: session.project_context || 'embrr-wat-dev-fest-2025',
        productivity_score: this.calculateProductivityScore(session),
        recommendations: this.generateRecommendations(session)
    };
    
    const summaryPath = path.join(this.sessionsPath, `summary_${session.id}.json`);
    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
    
    session.summary = summary;
}
```

**Cleanup Temp Files**:

```javascript
async cleanupTempFiles(session) {
    const tempDirs = [
        '/tmp',
        path.join(process.env.HOME, 'Downloads'),
        path.join(process.env.HOME, 'Desktop')
    ];
    
    let cleanedCount = 0;
    
    tempDirs.forEach(dir => {
        if (fs.existsSync(dir)) {
            const files = fs.readdirSync(dir);
            files.forEach(file => {
                const filePath = path.join(dir, file);
                const stats = fs.statSync(filePath);
                
                // Clean files older than 7 days
                const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                if (stats.mtime < weekAgo && stats.isFile()) {
                    fs.unlinkSync(filePath);
                    cleanedCount++;
                }
            });
        }
    });
    
    session.temp_files_cleaned = cleanedCount;
}
```

## Productivity Tracking

### Productivity Score Calculation

```javascript
calculateProductivityScore(session) {
    let score = 0;
    
    // Base score for starting session
    score += 20;
    
    // Points for completed actions
    const completedActions = session.actions_completed.filter(action => action.status === 'success');
    score += completedActions.length * 10;
    
    // Points for tabs saved
    score += Math.min(session.tabs_saved.length * 2, 20);
    
    // Points for music context
    if (session.music_context) score += 10;
    
    // Points for agenda shown
    if (session.agenda_shown) score += 10;
    
    return Math.min(score, 100);
}
```

### Productivity Metrics

**Session Metrics**:

- Duration and frequency
- Actions completed
- Productivity score
- Focus time percentage
- Break frequency

**Daily Metrics**:

- Total work time
- Average session length
- Productivity trend
- Most productive hours
- Distraction patterns

**Weekly Metrics**:

- Work pattern analysis
- Productivity improvements
- Goal achievement
- Skill development progress

### Recommendations Generation

```javascript
generateRecommendations(session) {
    const recommendations = [];
    
    if (session.actions_completed.length < 3) {
        recommendations.push('Complete more start actions for better session setup');
    }
    
    if (!session.music_context) {
        recommendations.push('Enable focus music for better concentration');
    }
    
    if (session.tabs_saved.length < 3) {
        recommendations.push('Save more tabs for better session continuity');
    }
    
    if (recommendations.length === 0) {
        recommendations.push('Great session! Keep up the productive work');
    }
    
    return recommendations;
}
```

## Session Analytics

### Session History

**History Data Structure**:

```javascript
{
    sessions: [
        {
            id: 'session_123',
            type: 'focus',
            start_time: '2024-01-15T10:00:00Z',
            end_time: '2024-01-15T12:00:00Z',
            duration: '2h 0m',
            productivity_score: 85,
            status: 'completed'
        }
    ],
    summary: {
        total_sessions: 15,
        average_duration: '1h 45m',
        average_productivity: 78,
        most_productive_type: 'focus'
    }
}
```

### Analytics Reports

**Daily Report**:

```json
{
    "date": "2024-01-15",
    "sessions": 3,
    "total_time": "6h 30m",
    "average_productivity": 82,
    "most_productive_session": "focus",
    "recommendations": [
        "Take more breaks during long sessions",
        "Enable music automation for better focus"
    ]
}
```

**Weekly Report**:

```json
{
    "week": "2024-W03",
    "total_sessions": 21,
    "total_time": "42h 15m",
    "productivity_trend": "increasing",
    "top_session_types": ["focus", "default", "creative"],
    "improvements": [
        "Productivity score increased by 12%",
        "Average session length increased by 15 minutes",
        "More consistent work patterns"
    ]
}
```

## Integration with Other Automations

### Music Automation

Coordinates with music automation:

- Starts appropriate music for session type
- Switches music based on session context
- Pauses music during breaks
- Resumes music after breaks

### Tab Manager

Integrates with tab management:

- Opens project tabs at session start
- Saves tabs at session end
- Organizes tabs by session context
- Maintains session continuity

### Code Analyzer

Coordinates with code analysis:

- Runs analysis during focus sessions
- Integrates learning into session summaries
- Tracks skill development progress
- Documents coding achievements

### Career Automation

Integrates with career tools:

- Tracks project work for resume updates
- Documents skill development
- Records achievements and milestones
- Updates portfolio content

## Troubleshooting

### Common Issues

#### Session Start Fails

**Symptoms**: Session doesn't start or actions fail

**Solutions**:

1. Check automation permissions
2. Verify Chrome and Spotify are running
3. Ensure file system permissions
4. Test with: `node workflows/work-session-manager.js start`

#### Session End Issues

**Symptoms**: Session doesn't end or cleanup fails

**Solutions**:

1. Check session ID validity
2. Verify file permissions
3. Ensure sufficient disk space
4. Test with: `node workflows/work-session-manager.js end`

#### Productivity Tracking Errors

**Symptoms**: Metrics not calculated or incorrect

**Solutions**:

1. Check session data integrity
2. Verify calculation algorithms
3. Ensure proper data collection
4. Test with: `node workflows/work-session-manager.js status`

### Debug Commands

```bash
# Test session creation
node workflows/work-session-manager.js start test

# Test session status
node workflows/work-session-manager.js status

# Test session history
node workflows/work-session-manager.js history 7

# Check session data
ls workflows/sessions/
```

### Permission Issues

**macOS Permissions Required**:

1. **Accessibility**: Terminal/VS Code needs accessibility permissions
2. **Automation**: Allow Chrome and Spotify automation
3. **File Access**: Grant access to Documents and Downloads folders

**Grant Permissions**:

1. System Preferences → Security & Privacy → Privacy
2. Select "Accessibility" from left sidebar
3. Add Terminal, VS Code, and other apps
4. Restart applications after granting permissions

## Performance Considerations

### Optimization Tips

1. **Parallel Actions**: Execute start/end actions concurrently
2. **Caching**: Cache session data for faster access
3. **Incremental Updates**: Only update changed data
4. **Background Processing**: Run analytics in background

### Resource Usage

- **CPU**: Low impact (< 5% during sessions)
- **Memory**: ~20MB for manager
- **Network**: Only for external integrations
- **Disk**: Session data (~1MB per session)

## Future Enhancements

### Planned Features

1. **AI-Powered Optimization**: Machine learning for productivity improvement
2. **Team Collaboration**: Shared work sessions and team analytics
3. **Mobile Integration**: Mobile app for session management
4. **Advanced Analytics**: Predictive productivity insights
5. **Integration Hub**: Connect with more productivity tools

### API Improvements

1. **REST API**: HTTP endpoints for external access
2. **WebSocket**: Real-time session updates
3. **Plugin System**: Third-party integrations
4. **Configuration UI**: Web-based configuration interface

---

**Workflow automation is ready to optimize your productivity!** 🔄

Start with `node automation-controller.js "Start work session"` and experience seamless productivity!
