#!/usr/bin/env node

/**
 * Code Health Checker with Learning Explanations
 * Analyzes code patterns and provides educational feedback
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class CodeAnalyzer {
    constructor() {
        this.configPath = path.join(__dirname, '../configs/master-config.json');
        this.config = this.loadConfig();
        this.analysisHistory = [];
    }

    loadConfig() {
        try {
            const configData = fs.readFileSync(this.configPath, 'utf8');
            return JSON.parse(configData);
        } catch (error) {
            return this.getDefaultConfig();
        }
    }

    getDefaultConfig() {
        return {
            development_automations: {
                code_health_checker: {
                    enabled: true,
                    analysis_types: ["error_patterns", "best_practices", "performance", "security"],
                    learning_mode: true,
                    generate_explanations: true
                }
            }
        };
    }

    async analyzeProject(projectPath = '.') {
        console.log('🔍 Analyzing code health...\n');
        
        const analysis = {
            timestamp: new Date().toISOString(),
            project: projectPath,
            files: await this.scanFiles(projectPath),
            patterns: await this.analyzePatterns(projectPath),
            suggestions: [],
            learning: []
        };

        // Analyze different aspects
        analysis.suggestions.push(...await this.checkBestPractices(analysis.files));
        analysis.suggestions.push(...await this.checkPerformance(analysis.files));
        analysis.suggestions.push(...await this.checkSecurity(analysis.files));
        analysis.suggestions.push(...await this.checkErrorPatterns(analysis.files));

        // Generate learning explanations
        analysis.learning = this.generateLearningContent(analysis.suggestions);

        this.analysisHistory.push(analysis);
        this.displayResults(analysis);

        return analysis;
    }

    async scanFiles(projectPath) {
        const files = [];
        const extensions = ['.js', '.jsx', '.ts', '.tsx', '.py', '.dart', '.java', '.cpp', '.c'];

        try {
            const result = execSync(`find "${projectPath}" -type f \\( ${extensions.map(ext => `-name "*${ext}"`).join(' -o ')} \\)`, { 
                encoding: 'utf8',
                maxBuffer: 1024 * 1024 * 10 // 10MB buffer
            });
            
            const filePaths = result.trim().split('\n').filter(path => path.length > 0);
            
            for (const filePath of filePaths.slice(0, 50)) { // Limit to first 50 files
                try {
                    const content = fs.readFileSync(filePath, 'utf8');
                    const stats = fs.statSync(filePath);
                    
                    files.push({
                        path: filePath,
                        size: stats.size,
                        lines: content.split('\n').length,
                        extension: path.extname(filePath),
                        content: content.substring(0, 1000) // First 1000 chars for analysis
                    });
                } catch (error) {
                    // Skip files that can't be read
                }
            }
        } catch (error) {
            console.log('⚠️  Could not scan files automatically. Using current directory...');
            // Fallback to current directory
            const currentFiles = fs.readdirSync('.');
            for (const file of currentFiles) {
                if (fs.statSync(file).isFile() && extensions.includes(path.extname(file))) {
                    try {
                        const content = fs.readFileSync(file, 'utf8');
                        files.push({
                            path: file,
                            size: fs.statSync(file).size,
                            lines: content.split('\n').length,
                            extension: path.extname(file),
                            content: content.substring(0, 1000)
                        });
                    } catch (error) {
                        // Skip files that can't be read
                    }
                }
            }
        }

        return files;
    }

    async analyzePatterns(files) {
        const patterns = {
            languages: {},
            frameworks: {},
            patterns: {},
            complexity: {}
        };

        if (!Array.isArray(files)) {
            return patterns;
        }

        files.forEach(file => {
            // Count languages
            patterns.languages[file.extension] = (patterns.languages[file.extension] || 0) + 1;
            
            // Detect frameworks
            if (file.content.includes('react') || file.content.includes('React')) {
                patterns.frameworks.react = (patterns.frameworks.react || 0) + 1;
            }
            if (file.content.includes('express') || file.content.includes('Express')) {
                patterns.frameworks.express = (patterns.frameworks.express || 0) + 1;
            }
            if (file.content.includes('flutter') || file.content.includes('Flutter')) {
                patterns.frameworks.flutter = (patterns.frameworks.flutter || 0) + 1;
            }

            // Analyze complexity
            const lines = file.content.split('\n');
            patterns.complexity[file.path] = {
                lines: lines.length,
                functions: (file.content.match(/function|const.*=|def |class /g) || []).length,
                comments: (file.content.match(/\/\/|\/\*|\#/g) || []).length
            };
        });

        return patterns;
    }

    async checkBestPractices(files) {
        const suggestions = [];

        files.forEach(file => {
            const content = file.content;
            const lines = content.split('\n');

            // Check for console.log statements
            if (content.includes('console.log')) {
                suggestions.push({
                    type: 'best_practice',
                    severity: 'low',
                    file: file.path,
                    line: this.findLineNumber(content, 'console.log'),
                    issue: 'Console.log statements found',
                    explanation: 'Console.log statements should be removed or replaced with proper logging in production code.',
                    fix: 'Replace with proper logging library or remove for production',
                    learning: 'Console.log is great for debugging but should not be left in production code. Consider using a logging library like Winston (Node.js) or similar.'
                });
            }

            // Check for TODO comments
            if (content.includes('TODO') || content.includes('FIXME')) {
                suggestions.push({
                    type: 'best_practice',
                    severity: 'medium',
                    file: file.path,
                    line: this.findLineNumber(content, 'TODO|FIXME'),
                    issue: 'TODO/FIXME comments found',
                    explanation: 'TODO comments indicate incomplete work that should be addressed.',
                    fix: 'Complete the TODO items or create proper issues/tickets',
                    learning: 'TODO comments are helpful for tracking work but should be resolved before production. Consider using issue tracking systems for larger tasks.'
                });
            }

            // Check for long functions
            const functions = content.match(/function\s+\w+\([^)]*\)\s*\{[^}]*\}/g) || [];
            functions.forEach(func => {
                const funcLines = func.split('\n').length;
                if (funcLines > 20) {
                    suggestions.push({
                        type: 'best_practice',
                        severity: 'medium',
                        file: file.path,
                        issue: 'Long function detected',
                        explanation: `Function has ${funcLines} lines, which may be too complex.`,
                        fix: 'Break down into smaller, more focused functions',
                        learning: 'Functions should ideally be under 20 lines and do one thing well. This makes code more readable, testable, and maintainable.'
                    });
                }
            });

            // Check for hardcoded values
            if (content.match(/['"](https?:\/\/|localhost|127\.0\.0\.1)['"]/)) {
                suggestions.push({
                    type: 'best_practice',
                    severity: 'medium',
                    file: file.path,
                    issue: 'Hardcoded URLs found',
                    explanation: 'Hardcoded URLs make the code less flexible and harder to deploy.',
                    fix: 'Use environment variables or configuration files',
                    learning: 'Hardcoded values reduce flexibility. Use environment variables (process.env) or config files to make your application environment-aware.'
                });
            }
        });

        return suggestions;
    }

    async checkPerformance(files) {
        const suggestions = [];

        files.forEach(file => {
            const content = file.content;

            // Check for inefficient loops
            if (content.includes('for (') && content.includes('.length')) {
                suggestions.push({
                    type: 'performance',
                    severity: 'low',
                    file: file.path,
                    issue: 'Potential performance optimization',
                    explanation: 'Consider caching array length or using more efficient iteration methods.',
                    fix: 'Cache array.length or use forEach/map for better readability',
                    learning: 'In JavaScript, accessing array.length in every loop iteration can be inefficient. Consider caching it or using array methods like forEach, map, or for...of.'
                });
            }

            // Check for synchronous file operations
            if (content.includes('fs.readFileSync') || content.includes('fs.writeFileSync')) {
                suggestions.push({
                    type: 'performance',
                    severity: 'medium',
                    file: file.path,
                    issue: 'Synchronous file operations',
                    explanation: 'Synchronous file operations can block the event loop.',
                    fix: 'Use async file operations (fs.promises or callbacks)',
                    learning: 'Synchronous file operations block the Node.js event loop, which can make your application unresponsive. Use async operations for better performance.'
                });
            }
        });

        return suggestions;
    }

    async checkSecurity(files) {
        const suggestions = [];

        files.forEach(file => {
            const content = file.content;

            // Check for SQL injection risks
            if (content.includes('query(') && content.includes('+')) {
                suggestions.push({
                    type: 'security',
                    severity: 'high',
                    file: file.path,
                    issue: 'Potential SQL injection risk',
                    explanation: 'String concatenation in database queries can lead to SQL injection.',
                    fix: 'Use parameterized queries or prepared statements',
                    learning: 'SQL injection is a serious security vulnerability. Always use parameterized queries or prepared statements instead of string concatenation.'
                });
            }

            // Check for eval usage
            if (content.includes('eval(')) {
                suggestions.push({
                    type: 'security',
                    severity: 'high',
                    file: file.path,
                    issue: 'eval() usage detected',
                    explanation: 'eval() can execute arbitrary code and is a security risk.',
                    fix: 'Avoid eval() and use safer alternatives',
                    learning: 'eval() executes arbitrary JavaScript code, which is a major security risk. Use JSON.parse() for data or other safer alternatives.'
                });
            }
        });

        return suggestions;
    }

    async checkErrorPatterns(files) {
        const suggestions = [];

        files.forEach(file => {
            const content = file.content;

            // Check for missing error handling
            if (content.includes('fetch(') && !content.includes('.catch(')) {
                suggestions.push({
                    type: 'error_patterns',
                    severity: 'medium',
                    file: file.path,
                    issue: 'Missing error handling for fetch',
                    explanation: 'Fetch requests should include error handling.',
                    fix: 'Add .catch() or try-catch for error handling',
                    learning: 'Network requests can fail. Always handle errors with .catch() or try-catch blocks to provide better user experience.'
                });
            }

            // Check for unhandled promises
            if (content.match(/async\s+\w+\([^)]*\)\s*\{[^}]*\}/) && !content.includes('await')) {
                suggestions.push({
                    type: 'error_patterns',
                    severity: 'low',
                    file: file.path,
                    issue: 'Async function without await',
                    explanation: 'Async function should use await or return promises.',
                    fix: 'Add await or return the promise',
                    learning: 'Async functions should either use await for asynchronous operations or return promises. Otherwise, they may not work as expected.'
                });
            }
        });

        return suggestions;
    }

    generateLearningContent(suggestions) {
        const learning = [];

        // Group suggestions by type for learning
        const grouped = suggestions.reduce((acc, suggestion) => {
            if (!acc[suggestion.type]) {
                acc[suggestion.type] = [];
            }
            acc[suggestion.type].push(suggestion);
            return acc;
        }, {});

        Object.entries(grouped).forEach(([type, typeSuggestions]) => {
            learning.push({
                category: type,
                count: typeSuggestions.length,
                summary: this.generateLearningSummary(type, typeSuggestions),
                resources: this.getLearningResources(type)
            });
        });

        return learning;
    }

    generateLearningSummary(type, suggestions) {
        const summaries = {
            best_practice: 'Focus on writing clean, maintainable code. Follow established patterns and conventions.',
            performance: 'Optimize for speed and efficiency. Consider the impact of your code on application performance.',
            security: 'Security should be a priority. Always validate input and avoid common vulnerabilities.',
            error_patterns: 'Robust error handling makes applications more reliable and user-friendly.'
        };

        return summaries[type] || 'Continue learning and improving your coding skills.';
    }

    getLearningResources(type) {
        const resources = {
            best_practice: [
                'Clean Code by Robert Martin',
                'JavaScript: The Good Parts by Douglas Crockford',
                'MDN Web Docs - JavaScript Best Practices'
            ],
            performance: [
                'High Performance JavaScript by Nicholas Zakas',
                'Web Performance Best Practices',
                'Node.js Performance Tips'
            ],
            security: [
                'OWASP Top 10 Web Application Security Risks',
                'Node.js Security Best Practices',
                'JavaScript Security Guidelines'
            ],
            error_patterns: [
                'Error Handling in JavaScript',
                'Async/Await Best Practices',
                'Promise Error Handling Patterns'
            ]
        };

        return resources[type] || ['General Programming Resources'];
    }

    findLineNumber(content, pattern) {
        const lines = content.split('\n');
        for (let i = 0; i < lines.length; i++) {
            if (new RegExp(pattern).test(lines[i])) {
                return i + 1;
            }
        }
        return null;
    }

    displayResults(analysis) {
        console.log('📊 Code Health Analysis Results\n');
        
        console.log(`📁 Project: ${analysis.project}`);
        console.log(`📄 Files analyzed: ${analysis.files.length}`);
        console.log(`🔍 Patterns found: ${Object.keys(analysis.patterns).length}`);
        console.log(`💡 Suggestions: ${analysis.suggestions.length}`);
        console.log(`📚 Learning topics: ${analysis.learning.length}\n`);

        // Display patterns
        console.log('🏗️  Technology Stack:');
        Object.entries(analysis.patterns.languages).forEach(([lang, count]) => {
            console.log(`   ${lang}: ${count} files`);
        });
        
        if (Object.keys(analysis.patterns.frameworks).length > 0) {
            console.log('\n🔧 Frameworks Detected:');
            Object.entries(analysis.patterns.frameworks).forEach(([framework, count]) => {
                console.log(`   ${framework}: ${count} occurrences`);
            });
        }

        // Display suggestions by severity
        const bySeverity = analysis.suggestions.reduce((acc, suggestion) => {
            if (!acc[suggestion.severity]) {
                acc[suggestion.severity] = [];
            }
            acc[suggestion.severity].push(suggestion);
            return acc;
        }, {});

        console.log('\n🎯 Issues Found:');
        ['high', 'medium', 'low'].forEach(severity => {
            if (bySeverity[severity]) {
                console.log(`\n${severity.toUpperCase()} (${bySeverity[severity].length}):`);
                bySeverity[severity].forEach(suggestion => {
                    console.log(`   📍 ${suggestion.file}: ${suggestion.issue}`);
                    console.log(`      ${suggestion.explanation}`);
                });
            }
        });

        // Display learning content
        console.log('\n📚 Learning Opportunities:');
        analysis.learning.forEach(learning => {
            console.log(`\n${learning.category.toUpperCase()} (${learning.count} items):`);
            console.log(`   ${learning.summary}`);
            console.log('   Resources:');
            learning.resources.forEach(resource => {
                console.log(`   • ${resource}`);
            });
        });

        console.log('\n✨ Analysis complete! Focus on high-severity issues first.');
    }

    async generateDocumentation(projectPath = '.') {
        const analysis = await this.analyzeProject(projectPath);
        
        const docContent = `# Code Health Report

Generated: ${new Date().toISOString()}
Project: ${projectPath}

## Summary
- Files analyzed: ${analysis.files.length}
- Issues found: ${analysis.suggestions.length}
- Learning topics: ${analysis.learning.length}

## Technology Stack
${Object.entries(analysis.patterns.languages).map(([lang, count]) => `- ${lang}: ${count} files`).join('\n')}

## Recommendations
${analysis.suggestions.map(s => `- **${s.severity.toUpperCase()}**: ${s.issue} in ${s.file}`).join('\n')}

## Learning Resources
${analysis.learning.map(l => `### ${l.category}\n${l.summary}\n\nResources:\n${l.resources.map(r => `- ${r}`).join('\n')}`).join('\n\n')}
`;

        const docPath = path.join(projectPath, 'CODE_HEALTH_REPORT.md');
        fs.writeFileSync(docPath, docContent);
        console.log(`📄 Documentation generated: ${docPath}`);
        
        return docPath;
    }
}

// CLI Interface
if (require.main === module) {
    const analyzer = new CodeAnalyzer();
    const command = process.argv[2];
    const projectPath = process.argv[3] || '.';

    async function runCommand() {
        switch (command) {
            case 'analyze':
                await analyzer.analyzeProject(projectPath);
                break;
            case 'docs':
                await analyzer.generateDocumentation(projectPath);
                break;
            default:
                console.log('🔍 Code Health Checker');
                console.log('\nUsage:');
                console.log('  node code-analyzer.js analyze [path]  - Analyze code health');
                console.log('  node code-analyzer.js docs [path]    - Generate documentation');
                console.log('\nExamples:');
                console.log('  node code-analyzer.js analyze         - Analyze current directory');
                console.log('  node code-analyzer.js analyze ../my-project - Analyze specific project');
        }
    }

    runCommand().catch(console.error);
}

module.exports = CodeAnalyzer;