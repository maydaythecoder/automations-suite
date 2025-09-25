# 🔧 Troubleshooting Guide

## Overview

This comprehensive troubleshooting guide helps you diagnose and resolve common issues with the automation suite. Each automation module has specific troubleshooting steps, error codes, and solutions.

## Table of Contents

- [General Troubleshooting](#general-troubleshooting)
- [Music Automation Issues](#music-automation-issues)
- [Web Automation Issues](#web-automation-issues)
- [Development Automation Issues](#development-automation-issues)
- [Career Automation Issues](#career-automation-issues)
- [Innovation Automation Issues](#innovation-automation-issues)
- [Workflow Automation Issues](#workflow-automation-issues)
- [System Issues](#system-issues)
- [Performance Issues](#performance-issues)
- [FAQ](#faq)

---

## General Troubleshooting

### Quick Diagnostic Commands

```bash
# Check system status
node automation-controller.js status

# Test individual components
node music/smart-music-controller.js status
node web/tab-manager.js analyze
node development/code-analyzer.js analyze .
node career/resume-builder.js analyze
node innovation/app-idea-generator.js generate 1
node workflows/work-session-manager.js status

# Check configuration
node scripts/validate-config.js

# View logs
tail -f logs/automation.log
```

### Common Error Patterns

**Permission Errors**:

``` txt
Error: Permission denied
Solution: Grant accessibility permissions to Terminal/VS Code
```

**File Not Found**:

``` txt
Error: ENOENT: no such file or directory
Solution: Check file paths and ensure files exist
```

**Configuration Errors**:

``` txt
Error: Invalid configuration
Solution: Run config validation and fix JSON syntax
```

**Network Errors**:

``` txt
Error: Network request failed
Solution: Check internet connection and API credentials
```

---

## Music Automation Issues

### Spotify Not Responding

**Symptoms**:

- Music doesn't switch automatically
- Manual commands fail
- "Spotify is not running" errors

**Diagnosis**:

```bash
# Check if Spotify is running
pgrep -f "Spotify"

# Test Spotify integration
node music/spotify-integration.js status
```

**Solutions**:

1. **Start Spotify**:

   ```bash
   open -a Spotify
   ```

2. **Check AppleScript Permissions**:
   - System Preferences → Security & Privacy → Privacy
   - Select "Accessibility" from left sidebar
   - Add Terminal, VS Code, and other apps
   - Restart applications

3. **Verify Playlist URIs**:

   ```bash
   # Check music configuration
   node music/smart-music-controller.js config
   ```

4. **Test Manual Control**:

   ```bash
   node music/spotify-integration.js volume 50
   node music/spotify-integration.js pause
   node music/spotify-integration.js resume
   ```

### Wrong Context Detection

**Symptoms**:

- Music switches to wrong context
- Context detection fails
- Inconsistent behavior

**Diagnosis**:

```bash
# Check current context detection
node music/smart-music-controller.js status

# Test context detection
node music/smart-music-controller.js start
```

**Solutions**:

1. **Update Keywords**:

   ```json
   {
     "coding": {
       "keywords": ["github", "vscode", "your-specific-keywords"]
     }
   }
   ```

2. **Check Tab Detection**:

   ```bash
   # Verify Chrome tabs are detected
   node web/tab-manager.js analyze
   ```

3. **Manual Override**:

   ```bash
   node music/smart-music-controller.js switch coding
   ```

### Volume Issues

**Symptoms**:

- Volume doesn't change
- Volume changes incorrectly
- Volume resets unexpectedly

**Solutions**:

1. **Check Volume Settings**:

   ```json
   {
     "coding": {
       "volume": 60  // Ensure 0-100 range
     }
   }
   ```

2. **Test Volume Control**:

   ```bash
   node music/spotify-integration.js volume 60
   ```

3. **Check System Volume**:
   - Ensure system volume is not muted
   - Check Spotify's own volume control
   - Verify audio output device

### Playlist Issues

**Symptoms**:

- Playlist doesn't play
- "Playlist not found" errors
- Wrong playlist plays

**Solutions**:

1. **Verify Playlist URIs**:

   ```bash
   # Get your playlists
   node music/spotify-integration.js playlists
   ```

2. **Update Configuration**:

   ```json
   {
     "coding": {
       "playlist_uri": "spotify:playlist:YOUR_ACTUAL_PLAYLIST_ID"
     }
   }
   ```

3. **Test Playlist**:

   ```bash
   node music/spotify-integration.js switch coding
   ```

---

## Web Automation Issues

### Chrome Tabs Not Detected

**Symptoms**:

- No tabs found
- Empty tab list
- Tab operations fail

**Diagnosis**:

```bash
# Test tab detection
node web/tab-manager.js analyze
```

**Solutions**:

1. **Check Chrome Status**:
   - Ensure Chrome is running
   - Verify Chrome is the default browser
   - Check if Chrome is responsive

2. **Grant Permissions**:
   - System Preferences → Security & Privacy → Privacy
   - Select "Accessibility" from left sidebar
   - Add Terminal, VS Code, and other apps

3. **Test AppleScript**:

   ```bash
   # Test Chrome AppleScript
   osascript -e 'tell application "Google Chrome" to get tabs of window 1'
   ```

### Tab Operations Fail

**Symptoms**:

- Cannot close tabs
- Cannot group tabs
- Tab operations error

**Solutions**:

1. **Check Tab Indices**:

   ```bash
   # Get current tab information
   node web/tab-manager.js analyze
   ```

2. **Test Individual Operations**:

   ```bash
   # Test grouping
   node web/tab-manager.js group
   
   # Test declutter
   node web/tab-manager.js declutter gentle
   ```

3. **Check Chrome Permissions**:
   - Ensure Chrome allows automation
   - Check for Chrome security restrictions
   - Restart Chrome if needed

### Session Save/Restore Issues

**Symptoms**:

- Sessions not saving
- Sessions not restoring
- Session data corrupted

**Solutions**:

1. **Check File Permissions**:

   ```bash
   # Check sessions directory
   ls -la web/sessions/
   ```

2. **Test Session Operations**:

   ```bash
   # Save test session
   node web/tab-manager.js save test-session
   
   # Restore test session
   node web/tab-manager.js restore test-session
   ```

3. **Clear Corrupted Sessions**:

   ```bash
   # Remove corrupted session files
   rm web/sessions/corrupted-session.json
   ```

---

## Development Automation Issues

### File Scanning Fails

**Symptoms**:

- No files found
- Analysis errors
- File reading fails

**Diagnosis**:

```bash
# Test file scanning
node development/code-analyzer.js analyze .
```

**Solutions**:

1. **Check File Permissions**:

   ```bash
   # Check directory permissions
   ls -la .
   ```

2. **Verify File Types**:
   - Ensure files have supported extensions (.js, .py, .ts, etc.)
   - Check if files are readable
   - Verify file encoding (UTF-8)

3. **Test with Specific Path**:

   ```bash
   node development/code-analyzer.js analyze /path/to/project
   ```

### Analysis Errors

**Symptoms**:

- Analysis crashes
- Incomplete results
- Memory errors

**Solutions**:

1. **Reduce File Count**:
   - Use .gitignore to exclude unnecessary files
   - Analyze smaller directories
   - Process files in batches

2. **Check Memory Usage**:

   ```bash
   # Monitor memory usage
   top -p $(pgrep node)
   ```

3. **Increase Memory Limit**:

   ```bash
   node --max-old-space-size=4096 development/code-analyzer.js analyze .
   ```

### Documentation Generation Issues

**Symptoms**:

- Documentation not generated
- Incomplete documentation
- File write errors

**Solutions**:

1. **Check Output Directory**:

   ```bash
   # Check output directory permissions
   ls -la development/output/
   ```

2. **Test Documentation Generation**:

   ```bash
   node development/code-analyzer.js docs .
   ```

3. **Clear Output Directory**:

   ```bash
   # Remove old documentation
   rm development/output/*
   ```

---

## Career Automation Issues

### GitHub Profile Not Found

**Symptoms**:

- No repositories found
- Analysis fails
- "Profile not found" errors

**Diagnosis**:

```bash
# Test GitHub analysis
node career/resume-builder.js analyze
```

**Solutions**:

1. **Verify GitHub Username**:

   ```json
   {
     "user_profile": {
       "name": "your-actual-github-username"
     }
   }
   ```

2. **Check Internet Connection**:

   ```bash
   # Test GitHub connectivity
   curl -I https://api.github.com
   ```

3. **Verify Profile Visibility**:
   - Ensure GitHub profile is public
   - Check if repositories are public
   - Verify username spelling

### Resume Generation Errors

**Symptoms**:

- Resume files not generated
- Incomplete resume data
- File write errors

**Solutions**:

1. **Check Output Directory**:

   ```bash
   # Check output directory permissions
   ls -la career/output/
   ```

2. **Test Resume Generation**:

   ```bash
   node career/resume-builder.js build
   ```

3. **Verify GitHub Data**:

   ```bash
   # Check GitHub analysis
   node career/resume-builder.js analyze
   ```

### Portfolio Generation Issues

**Symptoms**:

- Portfolio content not generated
- Missing project data
- Incomplete portfolio

**Solutions**:

1. **Check Featured Project**:

   ```json
   {
     "portfolio_generator": {
       "featured_project": "your-actual-project-name"
     }
   }
   ```

2. **Test Portfolio Generation**:

   ```bash
   node career/resume-builder.js portfolio
   ```

3. **Verify Project Data**:
   - Ensure featured project exists
   - Check project has sufficient data
   - Verify project is public

---

## Innovation Automation Issues

### Idea Generation Fails

**Symptoms**:

- No ideas generated
- Generation errors
- Empty results

**Diagnosis**:

```bash
# Test idea generation
node innovation/app-idea-generator.js generate 1
```

**Solutions**:

1. **Check Configuration**:

   ```json
   {
     "innovation_automations": {
       "idea_generator": {
         "enabled": true,
         "based_on_interests": ["AI/ML", "Web Development"]
       }
     }
   }
   ```

2. **Test Category Generation**:

   ```bash
   node innovation/app-idea-generator.js category ai_ml
   ```

3. **Clear Output Directory**:

   ```bash
   rm innovation/output/*
   ```

### Market Analysis Errors

**Symptoms**:

- Analysis fails
- Incomplete market data
- Calculation errors

**Solutions**:

1. **Check Analysis Data**:

   ```bash
   # Test market analysis
   node innovation/app-idea-generator.js generate 1
   ```

2. **Verify Idea Data**:
   - Ensure ideas are properly generated
   - Check idea data structure
   - Verify analysis inputs

3. **Test Individual Analysis**:

   ```bash
   # Test specific analysis functions
   node -e "
   const generator = require('./innovation/app-idea-generator');
   const gen = new generator();
   console.log(gen.assessCompetition({category: 'ai_ml'}));
   "
   ```

### Report Generation Issues

**Symptoms**:

- Reports not generated
- Incomplete reports
- File write errors

**Solutions**:

1. **Check Output Directory**:

   ```bash
   # Check output directory permissions
   ls -la innovation/output/
   ```

2. **Test Report Generation**:

   ```bash
   node innovation/app-idea-generator.js generate 3
   ```

3. **Verify Report Data**:
   - Ensure ideas are analyzed
   - Check analysis completeness
   - Verify data structure

---

## Workflow Automation Issues

### Session Start Fails

**Symptoms**:

- Session doesn't start
- Actions fail
- Session creation errors

**Diagnosis**:

```bash
# Test session creation
node workflows/work-session-manager.js start test
```

**Solutions**:

1. **Check Dependencies**:
   - Ensure Chrome is running
   - Verify Spotify is running
   - Check file system permissions

2. **Test Individual Actions**:

   ```bash
   # Test action execution
   node workflows/work-session-manager.js start focus
   ```

3. **Check Configuration**:

   ```json
   {
     "workflow_automations": {
       "work_session": {
         "enabled": true,
         "start_actions": ["open_project_tabs", "start_focus_music"]
       }
     }
   }
   ```

### Session End Issues

**Symptoms**:

- Session doesn't end
- Cleanup fails
- Session data corrupted

**Solutions**:

1. **Check Session ID**:

   ```bash
   # Get active session
   node workflows/work-session-manager.js status
   ```

2. **Test Session End**:

   ```bash
   node workflows/work-session-manager.js end session-id
   ```

3. **Check File Permissions**:

   ```bash
   # Check sessions directory
   ls -la workflows/sessions/
   ```

### Productivity Tracking Errors

**Symptoms**:

- Metrics not calculated
- Incorrect productivity scores
- Tracking data missing

**Solutions**:

1. **Check Session Data**:

   ```bash
   # View session data
   cat workflows/sessions/session-id.json
   ```

2. **Test Score Calculation**:

   ```bash
   node workflows/work-session-manager.js status
   ```

3. **Verify Data Integrity**:
   - Check session data structure
   - Ensure all required fields present
   - Verify data types

---

## System Issues

### Permission Problems

**Symptoms**:

- "Permission denied" errors
- AppleScript failures
- File access denied

**Solutions**:

1. **Grant Accessibility Permissions**:
   - System Preferences → Security & Privacy → Privacy
   - Select "Accessibility" from left sidebar
   - Add Terminal, VS Code, and other apps
   - Restart applications

2. **Check File Permissions**:

   ```bash
   # Check directory permissions
   ls -la automations-suite/
   
   # Fix permissions if needed
   chmod -R 755 automations-suite/
   ```

3. **Grant Automation Permissions**:
   - System Preferences → Security & Privacy → Privacy
   - Select "Automation" from left sidebar
   - Allow Terminal to control Spotify and Chrome

### Node.js Issues

**Symptoms**:

- "Command not found" errors
- Module loading failures
- Version compatibility issues

**Solutions**:

1. **Check Node.js Version**:

   ```bash
   node --version  # Should be v14 or higher
   npm --version
   ```

2. **Update Node.js**:

   ```bash
   # Using nvm
   nvm install node
   nvm use node
   
   # Or download from nodejs.org
   ```

3. **Reinstall Dependencies**:

   ```bash
   npm install
   ```

### File System Issues

**Symptoms**:

- File not found errors
- Directory creation fails
- Path resolution issues

**Solutions**:

1. **Check File Paths**:

   ```bash
   # Verify paths exist
   ls -la /Users/username/Documents/Work/
   ```

2. **Create Missing Directories**:

   ```bash
   mkdir -p /Users/username/Documents/Work/
   mkdir -p automations-suite/output/
   ```

3. **Fix Path Configuration**:

   ```json
   {
     "system_paths": {
       "home": "/Users/your-actual-username",
       "documents": "/Users/your-actual-username/Documents"
     }
   }
   ```

---

## Performance Issues

### Slow Execution

**Symptoms**:

- Commands take too long
- System becomes unresponsive
- High CPU usage

**Solutions**:

1. **Check System Resources**:

   ```bash
   # Monitor CPU and memory
   top
   ```

2. **Optimize Configuration**:

   ```json
   {
     "music_automations": {
       "check_interval_seconds": 60  // Increase interval
     }
   }
   ```

3. **Reduce Concurrent Operations**:
   - Run one automation at a time
   - Close unnecessary applications
   - Increase system resources

### Memory Issues

**Symptoms**:

- Out of memory errors
- System slowdown
- Application crashes

**Solutions**:

1. **Increase Node.js Memory**:

   ```bash
   node --max-old-space-size=4096 automation-controller.js
   ```

2. **Optimize File Processing**:
   - Process files in smaller batches
   - Use streaming for large files
   - Clear temporary data

3. **Monitor Memory Usage**:

   ```bash
   # Monitor Node.js memory
   node --inspect automation-controller.js
   ```

### Network Issues

**Symptoms**:

- API calls fail
- Slow responses
- Connection timeouts

**Solutions**:

1. **Check Internet Connection**:

   ```bash
   ping google.com
   curl -I https://api.github.com
   ```

2. **Configure Proxy** (if needed):

   ```bash
   export HTTP_PROXY=http://proxy:port
   export HTTPS_PROXY=http://proxy:port
   ```

3. **Increase Timeouts**:

   ```javascript
   const timeout = 30000; // 30 seconds
   ```

---

## FAQ

### General Questions

**Q: How do I know if the automation suite is working?**
A: Run `node automation-controller.js status` to check all automation statuses.

**Q: Can I use this on Windows or Linux?**
A: Currently optimized for macOS due to AppleScript integration. Windows/Linux support requires additional development.

**Q: How do I update the automation suite?**
A: Pull latest changes from your repository and run `node setup-automations.js`.

**Q: Can I customize the automations?**
A: Yes, all automations are highly configurable through the config files and can be extended programmatically.

### Music Automation Questions

**Q: Why doesn't my music switch automatically?**
A: Check if Spotify is running, verify playlist URIs, and ensure AppleScript permissions are granted.

**Q: How do I add my own playlists?**
A: Right-click playlist in Spotify → Share → Copy Spotify URI, then update `configs/music-contexts.json`.

**Q: Can I use Apple Music instead of Spotify?**
A: Currently supports Spotify only. Apple Music support would require additional development.

### Web Automation Questions

**Q: Why can't the system detect my Chrome tabs?**
A: Ensure Chrome is running, grant accessibility permissions, and verify Chrome is the default browser.

**Q: How do I customize which tabs to keep?**
A: Edit the `keep_patterns` array in `configs/master-config.json`.

**Q: Can I use Firefox or Safari instead of Chrome?**
A: Currently supports Chrome only. Other browsers would require additional AppleScript development.

### Development Automation Questions

**Q: Why does code analysis fail?**
A: Check file permissions, ensure supported file types, and verify you're in a project directory.

**Q: How do I add support for new programming languages?**
A: Add file extensions to the `supported_extensions` array in the configuration.

**Q: Can I customize the analysis rules?**
A: Yes, modify the analysis rules in the `CodeAnalyzer` class.

### Career Automation Questions

**Q: Why can't it find my GitHub profile?**
A: Verify your GitHub username in the configuration and ensure your profile is public.

**Q: How do I customize the resume template?**
A: Modify the resume generation methods in the `ResumeBuilder` class.

**Q: Can I generate resumes for different job types?**
A: Yes, create different templates and configurations for different job types.

### Innovation Automation Questions

**Q: Why are the generated ideas not relevant?**
A: Update your interests in the configuration and ensure the idea templates match your preferences.

**Q: How do I validate my app ideas?**
A: Use the `validateIdea` method with market research data and user feedback.

**Q: Can I add my own idea templates?**
A: Yes, extend the idea templates in the `AppIdeaGenerator` class.

### Workflow Automation Questions

**Q: Why does my work session fail to start?**
A: Check that all dependencies (Chrome, Spotify) are running and permissions are granted.

**Q: How do I customize session actions?**
A: Modify the `start_actions` and `end_actions` arrays in the configuration.

**Q: Can I track productivity across multiple projects?**
A: Yes, the system tracks productivity metrics and can be extended for multi-project tracking.

---

## Getting Help

### Debug Mode

Enable debug mode for detailed logging:

```bash
DEBUG=true node automation-controller.js "Start smart focus music"
```

### Log Files

Check log files for detailed error information:

```bash
# View recent logs
tail -f logs/automation.log

# View specific module logs
tail -f music/output/music-controller.log
tail -f web/output/tab-manager.log
```

### Support Channels

1. **Check Documentation**: Review the comprehensive documentation in the `docs/` folder
2. **Run Diagnostics**: Use the diagnostic commands provided in this guide
3. **Validate Configuration**: Run `node scripts/validate-config.js`
4. **Check System Status**: Run `node automation-controller.js status`

### Reporting Issues

When reporting issues, include:

- Operating system and version
- Node.js version
- Error messages and stack traces
- Steps to reproduce
- Configuration files (sanitized)
- Log files

---

This troubleshooting guide provides comprehensive solutions for common issues. If you encounter problems not covered here, check the log files and run the diagnostic commands for more detailed information.
