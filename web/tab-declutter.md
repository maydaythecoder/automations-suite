# Tab Declutter Automation

## 🎯 Purpose

Automatically organize, close, and manage your Chrome tabs to reduce clutter and improve focus.

## 🔧 How It Works

1. Scans all open Chrome tabs
2. Identifies duplicate, old, or unnecessary tabs
3. Groups related tabs together
4. Closes tabs based on your configured rules
5. Saves important tabs for later

## 📋 Prerequisites

- Chrome browser with multiple tabs
- MCP connections: Chrome Control, Filesystem

## ⚙️ Smart Tab Management

### Automatic Rules (Inferred from your usage)

```json
{
  "close_rules": {
    "duplicates": true,
    "old_github_tabs": "after_24_hours",
    "youtube_videos": "after_watching",
    "google_search_results": "after_30_minutes",
    "documentation": "keep_recent_5",
    "social_media": "limit_to_2_tabs"
  },
  "keep_rules": {
    "active_projects": ["github.com/think-outside-the-valley"],
    "work_tools": ["gmail", "sheets", "drive"],
    "development": ["localhost", "stackblitz", "codesandbox"],
    "important_docs": "never_close"
  }
}
```

## 🚀 Usage

### Quick Commands

```bash
# Run full declutter
"Declutter my tabs"

# Gentle cleanup (just duplicates)
"Clean duplicate tabs"

# Close old tabs only
"Close old tabs"

# Group related tabs
"Group my tabs"

# Save important tabs
"Save current session"

# Emergency restore
"Restore closed tabs"
```

### Scheduled Cleanup

- **Every hour**: Remove duplicates
- **Every 4 hours**: Close old search results
- **Daily**: Full tab declutter
- **Weekly**: Archive old sessions

## 📊 Tab Organization

### Intelligent Grouping

Based on your current tabs, I'll group:

1. **Development Work**
   - GitHub repos (think-outside-the-valley/embrr-wat-dev-fest-2025)
   - AI tools (DeepSeek chat)
   - Learning resources (MCP tutorial)

2. **Productivity Tools**
   - Google Sheets
   - Gmail
   - Google Drive

3. **Research & Learning**
   - YouTube tutorials
   - Documentation
   - Articles

### Tab Scoring System

```javascript
{
  tab_priority: {
    "github.com/think-outside-the-valley": 10, // Your active project
    "gmail.com": 9,                           // Important communication
    "docs.google.com": 8,                     // Work documents  
    "youtube.com/watch": 3,                   // Entertainment
    "google.com/search": 2                    // Old searches
  }
}
```

## 🛠️ Customization

### Personal Rules (Auto-configured)

```json
{
  "personal_patterns": {
    "work_domains": ["totv.tech", "github.com", "docs.google.com"],
    "project_keywords": ["embrr", "waterloo", "dev-fest"],
    "learning_sources": ["youtube.com", "medium.com", "dev.to"],
    "temp_tabs": ["google.com/search", "stackoverflow.com"]
  }
}
```

### Declutter Modes

- **Gentle**: Only duplicates and very old tabs
- **Standard**: Smart cleanup based on usage patterns  
- **Aggressive**: Keep only essential work tabs
- **Focus**: Close everything except current project
- **Meeting**: Minimize to essential tabs only

## 📈 Tab Analytics

Track your browsing patterns:

- Average tabs open per day
- Most visited domains
- Tab lifespan statistics
- Productivity correlation with tab count
- Focus improvement metrics

## 🔄 Session Management

### Auto-Save Sessions

```json
{
  "session_saves": {
    "before_declutter": true,
    "daily_backup": "morning_and_evening", 
    "project_sessions": "auto_detect",
    "focus_sessions": "manual_save"
  }
}
```

### Quick Session Restore

- **"Restore work session"**: Opens your core work tabs
- **"Restore learning session"**: Opens educational content
- **"Restore project session"**: Opens current project tabs
- **"Emergency restore"**: Restores last closed session

## 🎯 Smart Features

### Context-Aware Closing

- Never close tabs during active development
- Preserve tabs with unsaved changes
- Keep reference documentation open
- Maintain workflow context

### Learning from Usage

- Tracks which tabs you actually use
- Learns your work patterns
- Adapts rules to your behavior
- Improves accuracy over time

---

## 🧹 Ready to Declutter?

Say: **"Set up tab declutter"** and I'll analyze your current tabs and create personalized cleanup rules!
