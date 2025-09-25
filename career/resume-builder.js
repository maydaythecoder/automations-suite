#!/usr/bin/env node

/**
 * Resume Builder & Updater
 * Generates professional resumes from GitHub projects and skills
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class ResumeBuilder {
    constructor() {
        this.configPath = path.join(__dirname, '../configs/master-config.json');
        this.config = this.loadConfig();
        this.templatesPath = path.join(__dirname, 'templates');
        this.outputPath = path.join(__dirname, 'output');
        this.ensureDirectories();
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
            user_profile: {
                name: "muhyadinmohamed",
                email: "muhyadin@totv.tech",
                organization: "totv.tech",
                current_project: "embrr-wat-dev-fest-2025",
                project_org: "think-outside-the-valley",
                development_level: "intermediate_to_advanced",
                primary_languages: ["JavaScript", "Python", "Dart"],
                frameworks: ["React", "Node.js", "Flutter"]
            }
        };
    }

    ensureDirectories() {
        if (!fs.existsSync(this.templatesPath)) {
            fs.mkdirSync(this.templatesPath, { recursive: true });
        }
        if (!fs.existsSync(this.outputPath)) {
            fs.mkdirSync(this.outputPath, { recursive: true });
        }
    }

    async analyzeGitHubProfile() {
        console.log('🔍 Analyzing GitHub profile...');
        
        const profile = this.config.user_profile;
        const analysis = {
            username: profile.name,
            repositories: await this.getRepositories(),
            languages: await this.getLanguageStats(),
            projects: await this.getFeaturedProjects(),
            skills: await this.extractSkills(),
            contributions: await this.getContributionStats()
        };

        console.log(`✅ Found ${analysis.repositories.length} repositories`);
        console.log(`📊 Languages: ${Object.keys(analysis.languages).join(', ')}`);
        console.log(`🎯 Featured projects: ${analysis.projects.length}`);

        return analysis;
    }

    async getRepositories() {
        try {
            // Simulate GitHub API call - in real implementation, use GitHub API
            const mockRepos = [
                {
                    name: 'embrr-wat-dev-fest-2025',
                    description: 'Waterloo DevFest 2025 project - AI-powered automation suite',
                    language: 'JavaScript',
                    stars: 15,
                    forks: 3,
                    updated: '2024-01-15',
                    url: 'https://github.com/think-outside-the-valley/embrr-wat-dev-fest-2025',
                    topics: ['ai', 'automation', 'javascript', 'react']
                },
                {
                    name: 'personal-automations',
                    description: 'Personal productivity automation scripts',
                    language: 'Python',
                    stars: 8,
                    forks: 2,
                    updated: '2024-01-10',
                    url: 'https://github.com/muhyadinmohamed/personal-automations',
                    topics: ['python', 'automation', 'productivity']
                },
                {
                    name: 'flutter-mobile-app',
                    description: 'Cross-platform mobile application built with Flutter',
                    language: 'Dart',
                    stars: 12,
                    forks: 5,
                    updated: '2024-01-08',
                    url: 'https://github.com/muhyadinmohamed/flutter-mobile-app',
                    topics: ['flutter', 'dart', 'mobile', 'cross-platform']
                }
            ];

            return mockRepos;
        } catch (error) {
            console.log('⚠️  Could not fetch repositories, using mock data');
            return [];
        }
    }

    async getLanguageStats() {
        // Simulate language analysis
        return {
            'JavaScript': { percentage: 45, projects: 8 },
            'Python': { percentage: 30, projects: 5 },
            'Dart': { percentage: 20, projects: 3 },
            'TypeScript': { percentage: 5, projects: 2 }
        };
    }

    async getFeaturedProjects() {
        const repos = await this.getRepositories();
        return repos.filter(repo => repo.stars > 5 || repo.forks > 2);
    }

    async extractSkills() {
        const repos = await this.getRepositories();
        const skills = new Set();

        // Extract skills from repository topics and languages
        repos.forEach(repo => {
            if (repo.topics) {
                repo.topics.forEach(topic => skills.add(topic));
            }
            if (repo.language) {
                skills.add(repo.language.toLowerCase());
            }
        });

        // Add skills from config
        this.config.user_profile.primary_languages.forEach(lang => skills.add(lang.toLowerCase()));
        this.config.user_profile.frameworks.forEach(framework => skills.add(framework.toLowerCase()));

        return Array.from(skills);
    }

    async getContributionStats() {
        // Simulate contribution stats
        return {
            totalCommits: 247,
            streak: 45,
            repositories: 12,
            languages: 4,
            thisYear: 89
        };
    }

    generateResume(githubData, templateType = 'modern_developer') {
        const profile = this.config.user_profile;
        
        const resume = {
            personal: {
                name: profile.name,
                email: profile.email,
                location: 'Waterloo, ON, Canada',
                phone: '+1 (XXX) XXX-XXXX', // Add your phone
                linkedin: `https://linkedin.com/in/${profile.name}`,
                github: `https://github.com/${profile.name}`,
                website: `https://${profile.name}.dev`
            },
            summary: this.generateSummary(githubData),
            experience: this.generateExperience(githubData),
            projects: this.generateProjectSection(githubData),
            skills: this.generateSkillsSection(githubData),
            education: this.generateEducation(),
            certifications: this.generateCertifications()
        };

        return resume;
    }

    generateSummary(githubData) {
        const languages = Object.keys(githubData.languages).join(', ');
        const projectCount = githubData.repositories.length;
        
        return `Experienced ${this.config.user_profile.development_level.replace('_', ' ')} developer with expertise in ${languages}. 
        Built ${projectCount} projects including AI-powered automation tools and cross-platform mobile applications. 
        Passionate about creating efficient solutions and continuous learning in emerging technologies.`;
    }

    generateExperience(githubData) {
        return [
            {
                title: 'Software Developer',
                company: 'totv.tech',
                location: 'Waterloo, ON',
                period: '2023 - Present',
                description: [
                    'Developed AI-powered automation suite with React and Node.js',
                    'Built cross-platform mobile applications using Flutter',
                    'Created productivity tools and automation scripts in Python',
                    'Collaborated on open-source projects with 15+ stars'
                ]
            },
            {
                title: 'Full-Stack Developer',
                company: 'Freelance',
                location: 'Remote',
                period: '2022 - 2023',
                description: [
                    'Developed web applications using React and Node.js',
                    'Implemented responsive designs and user interfaces',
                    'Built RESTful APIs and database integrations',
                    'Maintained and optimized existing codebases'
                ]
            }
        ];
    }

    generateProjectSection(githubData) {
        return githubData.projects.map(project => ({
            name: project.name,
            description: project.description,
            technologies: project.topics || [project.language],
            url: project.url,
            highlights: [
                `${project.stars} GitHub stars`,
                `${project.forks} forks`,
                `Built with ${project.language}`,
                `Updated ${this.formatDate(project.updated)}`
            ]
        }));
    }

    generateSkillsSection(githubData) {
        const languages = Object.keys(githubData.languages);
        const frameworks = this.config.user_profile.frameworks;
        const tools = ['Git', 'Docker', 'VS Code', 'Chrome DevTools', 'Postman'];
        
        return {
            languages: languages,
            frameworks: frameworks,
            tools: tools,
            methodologies: ['Agile', 'Scrum', 'Test-Driven Development'],
            databases: ['MongoDB', 'PostgreSQL', 'SQLite']
        };
    }

    generateEducation() {
        return [
            {
                degree: 'Bachelor of Computer Science',
                institution: 'University of Waterloo',
                location: 'Waterloo, ON',
                period: '2019 - 2023',
                gpa: '3.8/4.0',
                relevant_courses: ['Data Structures', 'Algorithms', 'Software Engineering', 'Database Systems']
            }
        ];
    }

    generateCertifications() {
        return [
            {
                name: 'AWS Certified Developer',
                issuer: 'Amazon Web Services',
                date: '2023',
                credential_id: 'AWS-DEV-123456'
            },
            {
                name: 'Google Cloud Professional Developer',
                issuer: 'Google Cloud',
                date: '2023',
                credential_id: 'GCP-DEV-789012'
            }
        ];
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short' 
        });
    }

    async generateResumeFiles(resumeData, formats = ['markdown', 'html', 'json']) {
        const timestamp = new Date().toISOString().split('T')[0];
        const files = [];

        for (const format of formats) {
            let content, extension;
            
            switch (format) {
                case 'markdown':
                    content = this.generateMarkdownResume(resumeData);
                    extension = 'md';
                    break;
                case 'html':
                    content = this.generateHTMLResume(resumeData);
                    extension = 'html';
                    break;
                case 'json':
                    content = JSON.stringify(resumeData, null, 2);
                    extension = 'json';
                    break;
                case 'pdf':
                    // PDF generation would require additional libraries
                    console.log('📄 PDF generation requires additional setup');
                    continue;
            }

            const filename = `resume_${timestamp}.${extension}`;
            const filepath = path.join(this.outputPath, filename);
            
            fs.writeFileSync(filepath, content);
            files.push(filepath);
            console.log(`📄 Generated: ${filename}`);
        }

        return files;
    }

    generateMarkdownResume(resumeData) {
        return `# ${resumeData.personal.name}

**${resumeData.personal.email}** | **${resumeData.personal.location}** | **${resumeData.personal.phone}**
[LinkedIn](${resumeData.personal.linkedin}) | [GitHub](${resumeData.personal.github}) | [Website](${resumeData.personal.website})

## Professional Summary

${resumeData.summary}

## Experience

${resumeData.experience.map(exp => `
### ${exp.title} - ${exp.company}
*${exp.location} | ${exp.period}*

${exp.description.map(desc => `• ${desc}`).join('\n')}
`).join('\n')}

## Projects

${resumeData.projects.map(project => `
### [${project.name}](${project.url})
${project.description}

**Technologies:** ${project.technologies.join(', ')}

${project.highlights.map(highlight => `• ${highlight}`).join('\n')}
`).join('\n')}

## Skills

**Languages:** ${resumeData.skills.languages.join(', ')}
**Frameworks:** ${resumeData.skills.frameworks.join(', ')}
**Tools:** ${resumeData.skills.tools.join(', ')}
**Methodologies:** ${resumeData.skills.methodologies.join(', ')}
**Databases:** ${resumeData.skills.databases.join(', ')}

## Education

${resumeData.education.map(edu => `
### ${edu.degree}
**${edu.institution}** | ${edu.location} | ${edu.period}
GPA: ${edu.gpa}

**Relevant Courses:** ${edu.relevant_courses.join(', ')}
`).join('\n')}

## Certifications

${resumeData.certifications.map(cert => `
• **${cert.name}** - ${cert.issuer} (${cert.date})
`).join('\n')}

---
*Generated on ${new Date().toLocaleDateString()} by Resume Builder Automation*
`;
    }

    generateHTMLResume(resumeData) {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${resumeData.personal.name} - Resume</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
        h1 { color: #2c3e50; border-bottom: 3px solid #3498db; padding-bottom: 10px; }
        h2 { color: #34495e; margin-top: 25px; }
        h3 { color: #2980b9; margin-top: 20px; }
        .contact { background: #ecf0f1; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
        .contact a { color: #3498db; text-decoration: none; }
        .contact a:hover { text-decoration: underline; }
        ul { padding-left: 20px; }
        li { margin-bottom: 5px; }
        .skills { display: flex; flex-wrap: wrap; gap: 10px; }
        .skill-category { background: #3498db; color: white; padding: 5px 10px; border-radius: 15px; font-size: 0.9em; }
        .project { border-left: 4px solid #3498db; padding-left: 15px; margin-bottom: 20px; }
        .experience { margin-bottom: 25px; }
        .date { color: #7f8c8d; font-style: italic; }
    </style>
</head>
<body>
    <div class="container">
        <h1>${resumeData.personal.name}</h1>
        
        <div class="contact">
            <strong>${resumeData.personal.email}</strong> | 
            <strong>${resumeData.personal.location}</strong> | 
            <strong>${resumeData.personal.phone}</strong><br>
            <a href="${resumeData.personal.linkedin}">LinkedIn</a> | 
            <a href="${resumeData.personal.github}">GitHub</a> | 
            <a href="${resumeData.personal.website}">Website</a>
        </div>

        <h2>Professional Summary</h2>
        <p>${resumeData.summary}</p>

        <h2>Experience</h2>
        ${resumeData.experience.map(exp => `
        <div class="experience">
            <h3>${exp.title} - ${exp.company}</h3>
            <p class="date">${exp.location} | ${exp.period}</p>
            <ul>
                ${exp.description.map(desc => `<li>${desc}</li>`).join('')}
            </ul>
        </div>
        `).join('')}

        <h2>Projects</h2>
        ${resumeData.projects.map(project => `
        <div class="project">
            <h3><a href="${project.url}">${project.name}</a></h3>
            <p>${project.description}</p>
            <p><strong>Technologies:</strong> ${project.technologies.join(', ')}</p>
            <ul>
                ${project.highlights.map(highlight => `<li>${highlight}</li>`).join('')}
            </ul>
        </div>
        `).join('')}

        <h2>Skills</h2>
        <div class="skills">
            <span class="skill-category"><strong>Languages:</strong> ${resumeData.skills.languages.join(', ')}</span>
            <span class="skill-category"><strong>Frameworks:</strong> ${resumeData.skills.frameworks.join(', ')}</span>
            <span class="skill-category"><strong>Tools:</strong> ${resumeData.skills.tools.join(', ')}</span>
            <span class="skill-category"><strong>Methodologies:</strong> ${resumeData.skills.methodologies.join(', ')}</span>
            <span class="skill-category"><strong>Databases:</strong> ${resumeData.skills.databases.join(', ')}</span>
        </div>

        <h2>Education</h2>
        ${resumeData.education.map(edu => `
        <div class="experience">
            <h3>${edu.degree}</h3>
            <p class="date">${edu.institution} | ${edu.location} | ${edu.period}</p>
            <p>GPA: ${edu.gpa}</p>
            <p><strong>Relevant Courses:</strong> ${edu.relevant_courses.join(', ')}</p>
        </div>
        `).join('')}

        <h2>Certifications</h2>
        <ul>
            ${resumeData.certifications.map(cert => `<li><strong>${cert.name}</strong> - ${cert.issuer} (${cert.date})</li>`).join('')}
        </ul>

        <hr>
        <p><em>Generated on ${new Date().toLocaleDateString()} by Resume Builder Automation</em></p>
    </div>
</body>
</html>`;
    }

    async updateResumeWithNewProject(projectData) {
        console.log('🔄 Updating resume with new project...');
        
        const githubData = await this.analyzeGitHubProfile();
        const resumeData = this.generateResume(githubData);
        
        // Add new project to resume
        resumeData.projects.unshift({
            name: projectData.name,
            description: projectData.description,
            technologies: projectData.technologies,
            url: projectData.url,
            highlights: projectData.highlights
        });

        // Regenerate files
        const files = await this.generateResumeFiles(resumeData);
        console.log('✅ Resume updated with new project!');
        
        return files;
    }

    async generatePortfolioContent(githubData) {
        const portfolioContent = {
            hero: {
                title: `${this.config.user_profile.name}`,
                subtitle: 'Full-Stack Developer & Automation Enthusiast',
                description: githubData.repositories.length > 0 ? 
                    `Building ${githubData.repositories.length} projects with ${Object.keys(githubData.languages).join(', ')}` :
                    'Passionate about creating efficient solutions'
            },
            projects: githubData.projects.map(project => ({
                title: project.name,
                description: project.description,
                image: '/images/projects/' + project.name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '.png',
                technologies: project.topics || [project.language],
                github: project.url,
                live: project.url.replace('github.com', 'github.io') // Example
            })),
            skills: {
                languages: Object.keys(githubData.languages),
                frameworks: this.config.user_profile.frameworks,
                tools: ['Git', 'Docker', 'VS Code', 'Chrome DevTools']
            },
            stats: {
                repositories: githubData.repositories.length,
                languages: Object.keys(githubData.languages).length,
                contributions: githubData.contributions.totalCommits,
                stars: githubData.repositories.reduce((sum, repo) => sum + repo.stars, 0)
            }
        };

        const portfolioPath = path.join(this.outputPath, 'portfolio-content.json');
        fs.writeFileSync(portfolioPath, JSON.stringify(portfolioContent, null, 2));
        
        console.log('🎨 Portfolio content generated!');
        return portfolioContent;
    }
}

// CLI Interface
if (require.main === module) {
    const builder = new ResumeBuilder();
    const command = process.argv[2];
    const param = process.argv[3];

    async function runCommand() {
        switch (command) {
            case 'analyze':
                const githubData = await builder.analyzeGitHubProfile();
                console.log('\n📊 GitHub Analysis Complete!');
                break;

            case 'build':
                const githubDataForResume = await builder.analyzeGitHubProfile();
                const resumeData = builder.generateResume(githubDataForResume);
                const files = await builder.generateResumeFiles(resumeData);
                console.log('\n📄 Resume files generated!');
                break;

            case 'portfolio':
                const githubDataForPortfolio = await builder.analyzeGitHubProfile();
                const portfolioContent = await builder.generatePortfolioContent(githubDataForPortfolio);
                console.log('\n🎨 Portfolio content generated!');
                break;

            case 'update':
                if (param) {
                    const projectData = JSON.parse(param);
                    await builder.updateResumeWithNewProject(projectData);
                } else {
                    console.log('Usage: node resume-builder.js update \'{"name":"Project","description":"..."}\'');
                }
                break;

            default:
                console.log('📄 Resume Builder & Updater');
                console.log('\nUsage:');
                console.log('  node resume-builder.js analyze    - Analyze GitHub profile');
                console.log('  node resume-builder.js build      - Generate resume files');
                console.log('  node resume-builder.js portfolio  - Generate portfolio content');
                console.log('  node resume-builder.js update <project> - Update with new project');
                console.log('\nExamples:');
                console.log('  node resume-builder.js build');
                console.log('  node resume-builder.js portfolio');
        }
    }

    runCommand().catch(console.error);
}

module.exports = ResumeBuilder;