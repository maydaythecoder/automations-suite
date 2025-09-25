# 📚 API Reference Documentation

## Overview

This document provides comprehensive API reference for all automation controllers and their methods. Each automation module exposes a programmatic interface for integration and customization.

## Table of Contents

- [AutomationController](#automationcontroller)
- [SmartMusicController](#smartmusiccontroller)
- [SpotifyIntegration](#spotifyintegration)
- [TabManager](#tabmanager)
- [CodeAnalyzer](#codeanalyzer)
- [ResumeBuilder](#resumebuilder)
- [AppIdeaGenerator](#appideagenerator)
- [WorkSessionManager](#worksessionmanager)

---

## AutomationController

Main controller class for orchestrating all automations.

**File**: `automation-controller.js`

### Constructor

```javascript
const AutomationController = require('./automation-controller');
const controller = new AutomationController();
```

### Methods

#### `executeCommand(command, params = [])`

Execute automation commands using natural language or direct commands.

**Parameters**:

- `command` (string): Command to execute
- `params` (array): Additional parameters

**Returns**: `Promise<any>`

**Examples**:

```javascript
// Natural language commands
await controller.executeCommand('Start smart focus music');
await controller.executeCommand('Declutter my tabs');
await controller.executeCommand('Analyze my code');

// Direct commands
await controller.executeCommand('music start');
await controller.executeCommand('tabs declutter');
await controller.executeCommand('code analyze');
```

#### `showSystemStatus()`

Display status of all enabled automations.

**Returns**: `Promise<void>`

**Example**:

```javascript
await controller.showSystemStatus();
```

#### `runInteractiveMode()`

Start interactive command-line interface.

**Returns**: `Promise<void>`

**Example**:

```javascript
await controller.runInteractiveMode();
```

---

## SmartMusicController

Smart focus music automation controller.

**File**: `music/smart-music-controller.js`

 Constructor

```javascript
const SmartMusicController = require('./music/smart-music-controller');
const controller = new SmartMusicController();
```

 Methods

 `startSmartMusic()`

Start automatic music switching based on work context.

**Returns**: `Promise<boolean>`

**Example**:

```javascript
const success = await controller.startSmartMusic();
if (success) {
    console.log('Smart music started successfully');
}
```

 `stopSmartMusic()`

Stop music automation.

**Returns**: `Promise<boolean>`

**Example**:

```javascript
await controller.stopSmartMusic();
```

 `manualSwitch(context)`

Manually switch to specific music context.

**Parameters**:

- `context` (string): Context to switch to ('coding', 'focus', 'meetings', 'creative', 'default')

**Returns**: `Promise<boolean>`

**Example**:

```javascript
await controller.manualSwitch('coding');
```

 `detectContext()`

Detect current work context from Chrome tabs.

**Returns**: `Promise<string>`

**Example**:

```javascript
const context = await controller.detectContext();
console.log(`Current context: ${context}`);
```

 `showStatus()`

Display current music automation status.

**Returns**: `void`

**Example**:

```javascript
controller.showStatus();
```

 `showConfig()`

Display current music configuration.

**Returns**: `void`

**Example**:

```javascript
controller.showConfig();
```

---

## SpotifyIntegration

Direct Spotify Desktop app integration via AppleScript.

**File**: `music/spotify-integration.js`

 Constructor

```javascript
const SpotifyIntegration = require('./music/spotify-integration');
const spotify = new SpotifyIntegration();
```

 Methods

 `getCurrentTrack()`

Get currently playing track information.

**Returns**: `Promise<{track: string} | {error: string}>`

**Example**:

```javascript
const result = await spotify.getCurrentTrack();
if (result.track) {
    console.log(`Now playing: ${result.track}`);
} else {
    console.log(`Error: ${result.error}`);
}
```

 `playPlaylist(playlistUri)`

Play specific Spotify playlist.

**Parameters**:

- `playlistUri` (string): Spotify playlist URI (e.g., 'spotify:playlist:37i9dQZF1DXcBWIGoYBM5M')

**Returns**: `Promise<{success: boolean, playlist: string} | {error: string}>`

**Example**:

```javascript
const result = await spotify.playPlaylist('spotify:playlist:37i9dQZF1DXcBWIGoYBM5M');
if (result.success) {
    console.log(`Playing playlist: ${result.playlist}`);
}
```

 `setVolume(volume)`

Set Spotify volume.

**Parameters**:

- `volume` (number): Volume level (0-100)

**Returns**: `Promise<{success: boolean, volume: number} | {error: string}>`

**Example**:

```javascript
await spotify.setVolume(60);
```

 `pauseMusic()`

Pause currently playing music.

**Returns**: `Promise<{success: boolean} | {error: string}>`

**Example**:

```javascript
await spotify.pauseMusic();
```

 `resumeMusic()`

Resume paused music.

**Returns**: `Promise<{success: boolean} | {error: string}>`

**Example**:

```javascript
await spotify.resumeMusic();
```

 `getPlaylists()`

Get user's Spotify playlists.

**Returns**: `Promise<Array<{name: string, uri: string}> | {error: string}>`

**Example**:

```javascript
const playlists = await spotify.getPlaylists();
if (Array.isArray(playlists)) {
    playlists.forEach(playlist => {
        console.log(`${playlist.name}: ${playlist.uri}`);
    });
}
```

 `switchToContext(context)`

Switch to music context with configured playlist and volume.

**Parameters**:

- `context` (string): Context name ('coding', 'focus', 'meetings', 'creative', 'default')

**Returns**: `Promise<{success: boolean, context: string, playlist: string, volume: number, description: string} | {error: string}>`

**Example**:

```javascript
const result = await spotify.switchToContext('coding');
if (result.success) {
    console.log(`Switched to ${result.context} music`);
    console.log(`Playlist: ${result.playlist}`);
    console.log(`Volume: ${result.volume}%`);
}
```

---

## TabManager

Chrome tab management and organization automation.

**File**: `web/tab-manager.js`

 Constructor

```javascript
const TabManager = require('./web/tab-manager');
const manager = new TabManager();
```

 Methods

 `getChromeTabs()`

Get all open Chrome tabs with metadata.

**Returns**: `Promise<Array<{title: string, url: string, domain: string, category: string}>>`

**Example**:

```javascript
const tabs = await manager.getChromeTabs();
console.log(`Found ${tabs.length} tabs`);
tabs.forEach(tab => {
    console.log(`${tab.title} (${tab.category})`);
});
```

 `declutterTabs(mode = 'standard')`

Intelligently clean up Chrome tabs.

**Parameters**:

- `mode` (string): Declutter mode ('gentle', 'standard', 'aggressive', 'focus', 'meeting')

**Returns**: `Promise<{tabs: Array, analysis: Object, actions: Array}>`

**Example**:

```javascript
const result = await manager.declutterTabs('standard');
console.log(`Analyzed ${result.tabs.length} tabs`);
console.log(`Recommended ${result.actions.length} actions`);
```

 `groupTabs()`

Group tabs by category and display organization.

**Returns**: `Promise<Object>`

**Example**:

```javascript
const grouped = await manager.groupTabs();
Object.entries(grouped).forEach(([category, tabs]) => {
    console.log(`${category}: ${tabs.length} tabs`);
});
```

 `closeTab(tabIndex, windowIndex = 1)`

Close specific Chrome tab.

**Parameters**:

- `tabIndex` (number): Tab index to close
- `windowIndex` (number): Window index (default: 1)

**Returns**: `Promise<{success: boolean} | {error: string}>`

**Example**:

```javascript
const result = await manager.closeTab(1);
if (result.success) {
    console.log('Tab closed successfully');
}
```

 `closeTabsByPattern(pattern)`

Close tabs matching specific pattern.

**Parameters**:

- `pattern` (string): URL or title pattern to match

**Returns**: `Promise<{closed: number, tabs: Array}>`

**Example**:

```javascript
const result = await manager.closeTabsByPattern('google.com/search');
console.log(`Closed ${result.closed} tabs`);
```

 `saveSession(tabs, sessionName = 'current')`

Save current tab session for later restoration.

**Parameters**:

- `tabs` (Array): Array of tab objects
- `sessionName` (string): Name for saved session

**Returns**: `Promise<Object>`

**Example**:

```javascript
const tabs = await manager.getChromeTabs();
const session = await manager.saveSession(tabs, 'work-session');
console.log(`Session saved: ${session.name}`);
```

 `restoreSession(sessionName)`

Restore previously saved tab session.

**Parameters**:

- `sessionName` (string): Name of session to restore

**Returns**: `Promise<Object | {error: string}>`

**Example**:

```javascript
const session = await manager.restoreSession('work-session');
if (session.error) {
    console.log(`Error: ${session.error}`);
} else {
    console.log(`Restored session: ${session.name}`);
}
```

 `analyzeTabs(tabs)`

Analyze tab usage patterns and statistics.

**Parameters**:

- `tabs` (Array): Array of tab objects

**Returns**: `Object`

**Example**:

```javascript
const tabs = await manager.getChromeTabs();
const analysis = manager.analyzeTabs(tabs);
console.log('Categories:', analysis.categories);
console.log('Domains:', analysis.domains);
console.log('Duplicates:', Object.keys(analysis.duplicates).length);
```

---

## CodeAnalyzer

Code health analysis and documentation generation.

**File**: `development/code-analyzer.js`

 Constructor

```javascript
const CodeAnalyzer = require('./development/code-analyzer');
const analyzer = new CodeAnalyzer();
```

 Methods

 `analyzeProject(projectPath = '.')`

Analyze code health of project directory.

**Parameters**:

- `projectPath` (string): Path to project directory (default: current directory)

**Returns**: `Promise<Object>`

**Example**:

```javascript
const analysis = await analyzer.analyzeProject('./my-project');
console.log(`Files analyzed: ${analysis.files.length}`);
console.log(`Issues found: ${analysis.suggestions.length}`);
console.log(`Learning topics: ${analysis.learning.length}`);
```

 `scanFiles(projectPath)`

Scan project directory for supported files.

**Parameters**:

- `projectPath` (string): Path to project directory

**Returns**: `Promise<Array<{path: string, size: number, lines: number, extension: string, content: string}>>`

**Example**:

```javascript
const files = await analyzer.scanFiles('./my-project');
console.log(`Found ${files.length} files`);
files.forEach(file => {
    console.log(`${file.path}: ${file.lines} lines`);
});
```

 `analyzePatterns(files)`

Analyze code patterns and technology stack.

**Parameters**:

- `files` (Array): Array of file objects

**Returns**: `Promise<Object>`

**Example**:

```javascript
const files = await analyzer.scanFiles('./my-project');
const patterns = await analyzer.analyzePatterns(files);
console.log('Languages:', patterns.languages);
console.log('Frameworks:', patterns.frameworks);
```

 `checkBestPractices(files)`

Check code for best practice violations.

**Parameters**:

- `files` (Array): Array of file objects

**Returns**: `Promise<Array<Object>>`

**Example**:

```javascript
const files = await analyzer.scanFiles('./my-project');
const suggestions = await analyzer.checkBestPractices(files);
suggestions.forEach(suggestion => {
    console.log(`${suggestion.severity}: ${suggestion.issue} in ${suggestion.file}`);
});
```

 `checkPerformance(files)`

Check code for performance issues.

**Parameters**:

- `files` (Array): Array of file objects

**Returns**: `Promise<Array<Object>>`

**Example**:

```javascript
const files = await analyzer.scanFiles('./my-project');
const perfIssues = await analyzer.checkPerformance(files);
perfIssues.forEach(issue => {
    console.log(`Performance: ${issue.issue} in ${issue.file}`);
});
```

 `checkSecurity(files)`

Check code for security vulnerabilities.

**Parameters**:

- `files` (Array): Array of file objects

**Returns**: `Promise<Array<Object>>`

**Example**:

```javascript
const files = await analyzer.scanFiles('./my-project');
const securityIssues = await analyzer.checkSecurity(files);
securityIssues.forEach(issue => {
    console.log(`Security: ${issue.issue} in ${issue.file}`);
});
```

 `generateDocumentation(projectPath = '.')`

Generate project documentation with learning notes.

**Parameters**:

- `projectPath` (string): Path to project directory

**Returns**: `Promise<string>` (path to generated documentation)

**Example**:

```javascript
const docPath = await analyzer.generateDocumentation('./my-project');
console.log(`Documentation generated: ${docPath}`);
```

 `generateLearningContent(suggestions)`

Generate learning content from analysis suggestions.

**Parameters**:

- `suggestions` (Array): Array of suggestion objects

**Returns**: `Array<Object>`

**Example**:

```javascript
const suggestions = await analyzer.checkBestPractices(files);
const learning = analyzer.generateLearningContent(suggestions);
learning.forEach(topic => {
    console.log(`${topic.category}: ${topic.summary}`);
});
```

---

## ResumeBuilder

Professional resume and portfolio generation from GitHub data.

**File**: `career/resume-builder.js`

 Constructor

```javascript
const ResumeBuilder = require('./career/resume-builder');
const builder = new ResumeBuilder();
```

 Methods

 `analyzeGitHubProfile()`

Analyze GitHub profile and extract project data.

**Returns**: `Promise<Object>`

**Example**:

```javascript
const githubData = await builder.analyzeGitHubProfile();
console.log(`Found ${githubData.repositories.length} repositories`);
console.log(`Languages: ${Object.keys(githubData.languages).join(', ')}`);
console.log(`Featured projects: ${githubData.projects.length}`);
```

 `getRepositories()`

Get user's GitHub repositories with metadata.

**Returns**: `Promise<Array<Object>>`

**Example**:

```javascript
const repos = await builder.getRepositories();
repos.forEach(repo => {
    console.log(`${repo.name}: ${repo.stars} stars, ${repo.language}`);
});
```

 `getLanguageStats()`

Get programming language statistics from repositories.

**Returns**: `Promise<Object>`

**Example**:

```javascript
const languages = await builder.getLanguageStats();
Object.entries(languages).forEach(([lang, stats]) => {
    console.log(`${lang}: ${stats.percentage}% (${stats.projects} projects)`);
});
```

 `getFeaturedProjects()`

Get featured projects based on stars and forks.

**Returns**: `Promise<Array<Object>>`

**Example**:

```javascript
const projects = await builder.getFeaturedProjects();
projects.forEach(project => {
    console.log(`${project.name}: ${project.stars} stars`);
});
```

 `extractSkills()`

Extract technical skills from repositories and topics.

**Returns**: `Promise<Array<string>>`

**Example**:

```javascript
const skills = await builder.extractSkills();
console.log(`Skills: ${skills.join(', ')}`);
```

 `generateResume(githubData, templateType = 'modern_developer')`

Generate resume data structure from GitHub analysis.

**Parameters**:

- `githubData` (Object): GitHub profile analysis data
- `templateType` (string): Resume template type

**Returns**: `Object`

**Example**:

```javascript
const githubData = await builder.analyzeGitHubProfile();
const resumeData = builder.generateResume(githubData);
console.log(`Resume generated for ${resumeData.personal.name}`);
```

 `generateResumeFiles(resumeData, formats = ['markdown', 'html', 'json'])`

Generate resume files in multiple formats.

**Parameters**:

- `resumeData` (Object): Resume data structure
- `formats` (Array): Output formats ('markdown', 'html', 'json', 'pdf')

**Returns**: `Promise<Array<string>>` (file paths)

**Example**:

```javascript
const resumeData = builder.generateResume(githubData);
const files = await builder.generateResumeFiles(resumeData);
files.forEach(file => {
    console.log(`Generated: ${file}`);
});
```

 `generateMarkdownResume(resumeData)`

Generate Markdown format resume.

**Parameters**:

- `resumeData` (Object): Resume data structure

**Returns**: `string` (Markdown content)

**Example**:

```javascript
const markdown = builder.generateMarkdownResume(resumeData);
console.log(markdown);
```

 `generateHTMLResume(resumeData)`

Generate HTML format resume with styling.

**Parameters**:

- `resumeData` (Object): Resume data structure

**Returns**: `string` (HTML content)

**Example**:

```javascript
const html = builder.generateHTMLResume(resumeData);
console.log(html);
```

 `generatePortfolioContent(githubData)`

Generate portfolio content from GitHub data.

**Parameters**:

- `githubData` (Object): GitHub profile analysis data

**Returns**: `Promise<Object>`

**Example**:

```javascript
const githubData = await builder.analyzeGitHubProfile();
const portfolio = await builder.generatePortfolioContent(githubData);
console.log(`Portfolio generated with ${portfolio.projects.length} projects`);
```

 `updateResumeWithNewProject(projectData)`

Update resume with new project information.

**Parameters**:

- `projectData` (Object): New project data

**Returns**: `Promise<Array<string>>` (updated file paths)

**Example**:

```javascript
const projectData = {
    name: 'New Project',
    description: 'Project description',
    technologies: ['React', 'Node.js'],
    url: 'https://github.com/user/project',
    highlights: ['New feature', 'Performance improvement']
};

const files = await builder.updateResumeWithNewProject(projectData);
console.log(`Resume updated with new project`);
```

---

## AppIdeaGenerator

Innovative app idea generation with market research and validation.

**File**: `innovation/app-idea-generator.js`

 Constructor

```javascript
const AppIdeaGenerator = require('./innovation/app-idea-generator');
const generator = new AppIdeaGenerator();
```

 Methods

 `generateAppIdeas(count = 5, category = 'all')`

Generate innovative app ideas with market analysis.

**Parameters**:

- `count` (number): Number of ideas to generate
- `category` (string): Category filter ('all', 'ai_ml', 'productivity', 'mobile', 'web', 'devtools')

**Returns**: `Promise<Array<Object>>`

**Example**:

```javascript
const ideas = await generator.generateAppIdeas(5);
ideas.forEach(idea => {
    console.log(`${idea.name}: ${idea.success_probability}% success probability`);
});
```

 `generateIdea(category)`

Generate single app idea for specific category.

**Parameters**:

- `category` (string): Idea category

**Returns**: `Promise<Object>`

**Example**:

```javascript
const idea = await generator.generateIdea('ai_ml');
console.log(`Generated: ${idea.name}`);
console.log(`Problem: ${idea.problem}`);
console.log(`Solution: ${idea.solution}`);
```

 `analyzeMarketPotential(ideas)`

Analyze market potential for generated ideas.

**Parameters**:

- `ideas` (Array): Array of idea objects

**Returns**: `Promise<Array<Object>>`

**Example**:

```javascript
const ideas = await generator.generateAppIdeas(3);
const analyzed = await generator.analyzeMarketPotential(ideas);
analyzed.forEach(idea => {
    console.log(`${idea.name}: ${idea.success_probability}% success probability`);
});
```

 `assessCompetition(idea)`

Assess competition level for app idea.

**Parameters**:

- `idea` (Object): App idea object

**Returns**: `string` ('Low', 'Medium', 'High')

**Example**:

```javascript
const idea = await generator.generateIdea('ai_ml');
const competition = generator.assessCompetition(idea);
console.log(`Competition level: ${competition}`);
```

 `assessMarketReadiness(idea)`

Assess market readiness for app idea.

**Parameters**:

- `idea` (Object): App idea object

**Returns**: `string` ('Low', 'Medium', 'High')

**Example**:

```javascript
const idea = await generator.generateIdea('ai_ml');
const readiness = generator.assessMarketReadiness(idea);
console.log(`Market readiness: ${readiness}`);
```

 `assessUserDemand(idea)`

Assess user demand for app idea.

**Parameters**:

- `idea` (Object): App idea object

**Returns**: `string` ('Low', 'Medium', 'High')

**Example**:

```javascript
const idea = await generator.generateIdea('ai_ml');
const demand = generator.assessUserDemand(idea);
console.log(`User demand: ${demand}`);
```

 `assessMonetization(idea)`

Assess monetization potential for app idea.

**Parameters**:

- `idea` (Object): App idea object

**Returns**: `string` ('Low', 'Medium', 'High')

**Example**:

```javascript
const idea = await generator.generateIdea('ai_ml');
const monetization = generator.assessMonetization(idea);
console.log(`Monetization potential: ${monetization}`);
```

 `assessTechnicalFeasibility(idea)`

Assess technical feasibility for app idea.

**Parameters**:

- `idea` (Object): App idea object

**Returns**: `string` ('Low', 'Medium', 'High')

**Example**:

```javascript
const idea = await generator.generateIdea('ai_ml');
const feasibility = generator.assessTechnicalFeasibility(idea);
console.log(`Technical feasibility: ${feasibility}`);
```

 `assessRisks(idea)`

Assess risks for app idea.

**Parameters**:

- `idea` (Object): App idea object

**Returns**: `Object`

**Example**:

```javascript
const idea = await generator.generateIdea('ai_ml');
const risks = generator.assessRisks(idea);
console.log(`Technical risk: ${risks.technical_risk}`);
console.log(`Market risk: ${risks.market_risk}`);
```

 `calculateSuccessProbability(idea)`

Calculate success probability for app idea.

**Parameters**:

- `idea` (Object): App idea object

**Returns**: `number` (0-100)

**Example**:

```javascript
const idea = await generator.generateIdea('ai_ml');
const probability = generator.calculateSuccessProbability(idea);
console.log(`Success probability: ${probability}%`);
```

 `generateIdeaReports(ideas)`

Generate detailed reports for app ideas.

**Parameters**:

- `ideas` (Array): Array of analyzed idea objects

**Returns**: `Promise<void>`

**Example**:

```javascript
const ideas = await generator.generateAppIdeas(5);
await generator.generateIdeaReports(ideas);
console.log('Reports generated in output folder');
```

 `generateIdeaReport(idea)`

Generate individual report for app idea.

**Parameters**:

- `idea` (Object): App idea object

**Returns**: `string` (Markdown report content)

**Example**:

```javascript
const idea = await generator.generateIdea('ai_ml');
const report = generator.generateIdeaReport(idea);
console.log(report);
```

 `generateSummaryReport(ideas)`

Generate summary report for multiple ideas.

**Parameters**:

- `ideas` (Array): Array of analyzed idea objects

**Returns**: `string` (Markdown summary content)

**Example**:

```javascript
const ideas = await generator.generateAppIdeas(5);
const summary = generator.generateSummaryReport(ideas);
console.log(summary);
```

 `validateIdea(ideaId, validationData)`

Validate app idea with market research data.

**Parameters**:

- `ideaId` (string): Unique idea identifier
- `validationData` (Object): Validation data

**Returns**: `Promise<Object>`

**Example**:

```javascript
const validationData = {
    user_feedback: 'positive',
    market_research: 'favorable',
    competitor_analysis: 'low_competition',
    technical_feasibility: 'high'
};

const validation = await generator.validateIdea('idea_123', validationData);
console.log(`Updated success probability: ${validation.updated_success_probability}%`);
```

---

## WorkSessionManager

Work session management and productivity tracking.

**File**: `workflows/work-session-manager.js`

 Constructor

```javascript
const WorkSessionManager = require('./workflows/work-session-manager');
const manager = new WorkSessionManager();
```

 Methods

 `startWorkSession(sessionType = 'default')`

Start new work session with integrated automations.

**Parameters**:

- `sessionType` (string): Session type ('default', 'focus', 'creative', 'learning', 'meeting')

**Returns**: `Promise<Object>`

**Example**:

```javascript
const session = await manager.startWorkSession('focus');
console.log(`Session started: ${session.id}`);
console.log(`Type: ${session.type}`);
console.log(`Actions completed: ${session.actions_completed.length}`);
```

 `endWorkSession(sessionId)`

End work session and execute cleanup actions.

**Parameters**:

- `sessionId` (string): Session identifier

**Returns**: `Promise<Object>`

**Example**:

```javascript
const session = await manager.endWorkSession('session_123');
console.log(`Session ended: ${session.id}`);
console.log(`Duration: ${session.duration}`);
console.log(`Productivity score: ${session.productivity_score}`);
```

 `executeStartActions(session)`

Execute start actions for work session.

**Parameters**:

- `session` (Object): Session object

**Returns**: `Promise<void>`

**Example**:

```javascript
const session = await manager.startWorkSession('focus');
await manager.executeStartActions(session);
```

 `executeEndActions(session)`

Execute end actions for work session.

**Parameters**:

- `session` (Object): Session object

**Returns**: `Promise<void>`

**Example**:

```javascript
const session = await manager.startWorkSession('focus');
await manager.executeEndActions(session);
```

 `executeAction(action, session)`

Execute specific action for work session.

**Parameters**:

- `action` (string): Action name
- `session` (Object): Session object

**Returns**: `Promise<void>`

**Example**:

```javascript
const session = await manager.startWorkSession('focus');
await manager.executeAction('start_focus_music', session);
```

 `saveSession(session)`

Save session data to file.

**Parameters**:

- `session` (Object): Session object

**Returns**: `Promise<void>`

**Example**:

```javascript
const session = await manager.startWorkSession('focus');
await manager.saveSession(session);
```

 `loadSession(sessionId)`

Load session data from file.

**Parameters**:

- `sessionId` (string): Session identifier

**Returns**: `Promise<Object | null>`

**Example**:

```javascript
const session = await manager.loadSession('session_123');
if (session) {
    console.log(`Loaded session: ${session.id}`);
} else {
    console.log('Session not found');
}
```

 `getActiveSession()`

Get currently active work session.

**Returns**: `Promise<Object | null>`

**Example**:

```javascript
const activeSession = await manager.getActiveSession();
if (activeSession) {
    console.log(`Active session: ${activeSession.id}`);
} else {
    console.log('No active session');
}
```

 `getSessionHistory(days = 7)`

Get session history for specified number of days.

**Parameters**:

- `days` (number): Number of days to retrieve

**Returns**: `Promise<Array<Object>>`

**Example**:

```javascript
const history = await manager.getSessionHistory(7);
console.log(`Found ${history.length} sessions in last 7 days`);
history.forEach(session => {
    console.log(`${session.id}: ${session.duration} (${session.status})`);
});
```

 `calculateDuration(startTime, endTime = null)`

Calculate session duration.

**Parameters**:

- `startTime` (string): Session start time (ISO string)
- `endTime` (string): Session end time (ISO string, optional)

**Returns**: `string` (formatted duration)

**Example**:

```javascript
const duration = manager.calculateDuration('2024-01-15T10:00:00Z', '2024-01-15T12:00:00Z');
console.log(`Duration: ${duration}`); // "2h 0m"
```

 `calculateProductivityScore(session)`

Calculate productivity score for session.

**Parameters**:

- `session` (Object): Session object

**Returns**: `number` (0-100)

**Example**:

```javascript
const session = await manager.startWorkSession('focus');
const score = manager.calculateProductivityScore(session);
console.log(`Productivity score: ${score}/100`);
```

 `generateRecommendations(session)`

Generate productivity recommendations for session.

**Parameters**:

- `session` (Object): Session object

**Returns**: `Array<string>`

**Example**:

```javascript
const session = await manager.startWorkSession('focus');
const recommendations = manager.generateRecommendations(session);
recommendations.forEach(rec => {
    console.log(`Recommendation: ${rec}`);
});
```

 `showSessionStatus()`

Display current session status and recent history.

**Returns**: `Promise<void>`

**Example**:

```javascript
await manager.showSessionStatus();
```

---

## Error Handling

All automation controllers include comprehensive error handling:

 Common Error Patterns

**Promise Rejection**:

```javascript
try {
    const result = await controller.someMethod();
    console.log('Success:', result);
} catch (error) {
    console.error('Error:', error.message);
}
```

**Error Object Structure**:

```javascript
{
    error: 'Error message',
    code: 'ERROR_CODE',
    details: 'Additional error details',
    timestamp: '2024-01-15T10:30:00Z'
}
```

**Graceful Degradation**:

```javascript
const result = await controller.method();
if (result.error) {
    console.log('Operation failed:', result.error);
    // Fallback behavior
} else {
    console.log('Operation successful:', result.data);
}
```

### Error Codes

- `SPOTIFY_NOT_RUNNING`: Spotify application not running
- `CHROME_NOT_RUNNING`: Chrome browser not running
- `PERMISSION_DENIED`: AppleScript permissions not granted
- `FILE_NOT_FOUND`: Required file or directory not found
- `INVALID_CONFIG`: Configuration file invalid or missing
- `NETWORK_ERROR`: Network connectivity issues
- `API_RATE_LIMIT`: API rate limit exceeded

---

## Configuration

All controllers support configuration through the master config file:

### Configuration Structure

```javascript
{
    "automation_name": {
        "enabled": true,
        "setting1": "value1",
        "setting2": "value2"
    }
}
```

### Environment Variables

Controllers can access environment variables:

```javascript
const config = {
    githubToken: process.env.GITHUB_TOKEN,
    spotifyClientId: process.env.SPOTIFY_CLIENT_ID,
    projectRoot: process.env.PROJECT_ROOT
};
```

---

## Integration Examples

### Custom Automation

```javascript
const AutomationController = require('./automation-controller');
const MusicController = require('./music/smart-music-controller');

class CustomAutomation {
    constructor() {
        this.controller = new AutomationController();
        this.music = new MusicController();
    }

    async startCustomWorkflow() {
        // Start music automation
        await this.music.startSmartMusic();
        
        // Execute custom command
        await this.controller.executeCommand('Declutter my tabs');
        
        // Start work session
        await this.controller.executeCommand('Start work session');
    }
}
```

### Event-Driven Integration

```javascript
const WorkSessionManager = require('./workflows/work-session-manager');
const TabManager = require('./web/tab-manager');

class EventDrivenAutomation {
    constructor() {
        this.sessionManager = new WorkSessionManager();
        this.tabManager = new TabManager();
    }

    async onSessionStart(session) {
        // Custom logic when session starts
        console.log(`Session ${session.id} started`);
        
        // Integrate with tab management
        const tabs = await this.tabManager.getChromeTabs();
        await this.tabManager.saveSession(tabs, `session_${session.id}`);
    }
}
```

---

This API reference provides comprehensive documentation for all automation controllers. Each method includes parameters, return values, examples, and error handling patterns for easy integration and customization.
