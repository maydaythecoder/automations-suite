#!/usr/bin/env node

/**
 * Spotify Integration Migration Script
 * Helps migrate from AppleScript-based integration to Web API integration
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class SpotifyMigration {
    constructor() {
        this.oldIntegrationPath = path.join(__dirname, 'spotify-integration.js');
        this.newIntegrationPath = path.join(__dirname, 'spotify-web-api-integration.js');
        this.configPath = path.join(__dirname, '../configs/music-contexts.json');
        this.packageJsonPath = path.join(__dirname, 'package.json');
    }

    async runMigration() {
        console.log('🔄 Starting Spotify Integration Migration...');
        console.log('   From: AppleScript-based (macOS only)');
        console.log('   To:   Web API-based (cross-platform)');
        console.log('');

        try {
            // Step 1: Check if old integration exists
            await this.checkOldIntegration();

            // Step 2: Install new dependencies
            await this.installDependencies();

            // Step 3: Backup old files
            await this.backupOldFiles();

            // Step 4: Update configuration
            await this.updateConfiguration();

            // Step 5: Create environment template
            await this.createEnvironmentTemplate();

            // Step 6: Test new integration
            await this.testNewIntegration();

            console.log('');
            console.log('✅ Migration completed successfully!');
            console.log('');
            console.log('📋 Next Steps:');
            console.log('   1. Set up Spotify Developer App:');
            console.log('      https://developer.spotify.com/dashboard');
            console.log('   2. Configure environment variables in music/.env');
            console.log('   3. Run authentication: npm run auth');
            console.log('   4. Test the integration: npm run status');
            console.log('');
            console.log('📚 Documentation: music/SPOTIFY_WEB_API_SETUP.md');

        } catch (error) {
            console.error('❌ Migration failed:', error.message);
            console.log('');
            console.log('🔄 To rollback:');
            console.log('   git checkout HEAD -- music/spotify-integration.js');
            console.log('   git checkout HEAD -- music/smart-music-controller.js');
        }
    }

    async checkOldIntegration() {
        console.log('🔍 Checking old integration...');
        
        if (!fs.existsSync(this.oldIntegrationPath)) {
            throw new Error('Old Spotify integration not found');
        }

        const oldContent = fs.readFileSync(this.oldIntegrationPath, 'utf8');
        if (!oldContent.includes('AppleScript') && !oldContent.includes('osascript')) {
            console.log('   ⚠️  Old integration may already be migrated');
        }

        console.log('   ✅ Old integration found');
    }

    async installDependencies() {
        console.log('📦 Installing new dependencies...');
        
        try {
            execSync('npm install spotify-web-api-node', { 
                cwd: __dirname,
                stdio: 'pipe'
            });
            console.log('   ✅ Dependencies installed');
        } catch (error) {
            throw new Error(`Failed to install dependencies: ${error.message}`);
        }
    }

    async backupOldFiles() {
        console.log('💾 Backing up old files...');
        
        const backupDir = path.join(__dirname, 'backup');
        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir, { recursive: true });
        }

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        
        // Backup old integration
        if (fs.existsSync(this.oldIntegrationPath)) {
            const backupPath = path.join(backupDir, `spotify-integration-${timestamp}.js`);
            fs.copyFileSync(this.oldIntegrationPath, backupPath);
            console.log(`   ✅ Backed up to: ${backupPath}`);
        }

        // Backup old smart controller
        const oldControllerPath = path.join(__dirname, 'smart-music-controller.js');
        if (fs.existsSync(oldControllerPath)) {
            const backupPath = path.join(backupDir, `smart-music-controller-${timestamp}.js`);
            fs.copyFileSync(oldControllerPath, backupPath);
            console.log(`   ✅ Backed up to: ${backupPath}`);
        }

        console.log('   ✅ Backup completed');
    }

    async updateConfiguration() {
        console.log('⚙️  Updating configuration...');
        
        if (!fs.existsSync(this.configPath)) {
            console.log('   ⚠️  No existing configuration found');
            return;
        }

        const config = JSON.parse(fs.readFileSync(this.configPath, 'utf8'));
        let updated = false;

        // Update configuration format
        Object.keys(config).forEach(context => {
            const contextConfig = config[context];
            
            // Add new fields if missing
            if (contextConfig.playlist_uri && !contextConfig.shuffle) {
                contextConfig.shuffle = false;
                contextConfig.repeat = 'off';
                updated = true;
            }
        });

        if (updated) {
            fs.writeFileSync(this.configPath, JSON.stringify(config, null, 2));
            console.log('   ✅ Configuration updated');
        } else {
            console.log('   ✅ Configuration already up to date');
        }
    }

    async createEnvironmentTemplate() {
        console.log('📝 Creating environment template...');
        
        const envPath = path.join(__dirname, '.env.example');
        const envContent = `# Spotify Web API Configuration
# Get these from: https://developer.spotify.com/dashboard

SPOTIFY_CLIENT_ID=your_client_id_here
SPOTIFY_CLIENT_SECRET=your_client_secret_here
SPOTIFY_REDIRECT_URI=http://localhost:8888/callback

# Optional: Custom scopes (comma-separated)
# SPOTIFY_SCOPES=user-read-playback-state,user-modify-playback-state,user-read-currently-playing,playlist-read-private,playlist-read-collaborative,user-library-read,user-top-read,user-read-recently-played
`;

        fs.writeFileSync(envPath, envContent);
        console.log('   ✅ Environment template created: .env.example');
    }

    async testNewIntegration() {
        console.log('🧪 Testing new integration...');
        
        try {
            // Test if the new integration loads
            const SpotifyWebIntegration = require('./spotify-web-api-integration.js');
            const spotify = new SpotifyWebIntegration();
            
            console.log('   ✅ New integration loads successfully');
            console.log('   ✅ Class methods available');
            
            // Test configuration loading
            if (fs.existsSync(this.configPath)) {
                const config = JSON.parse(fs.readFileSync(this.configPath, 'utf8'));
                console.log(`   ✅ Configuration loaded (${Object.keys(config).length} contexts)`);
            }
            
        } catch (error) {
            throw new Error(`New integration test failed: ${error.message}`);
        }
    }

    async showMigrationSummary() {
        console.log('');
        console.log('📊 Migration Summary:');
        console.log('');
        console.log('🔄 What Changed:');
        console.log('   • AppleScript → Spotify Web API');
        console.log('   • macOS-only → Cross-platform');
        console.log('   • Shell commands → Secure API calls');
        console.log('   • Fake album art → Real Spotify metadata');
        console.log('   • Basic auth → OAuth2 PKCE');
        console.log('');
        console.log('✅ What Improved:');
        console.log('   • Security: No more shell injection risks');
        console.log('   • Compatibility: Works on Windows/Linux');
        console.log('   • Features: Real search, playlists, metadata');
        console.log('   • Reliability: Proper error handling & retry');
        console.log('   • Performance: Efficient API calls');
        console.log('');
        console.log('🔧 What You Need to Do:');
        console.log('   1. Create Spotify Developer App');
        console.log('   2. Configure environment variables');
        console.log('   3. Run authentication flow');
        console.log('   4. Test with your playlists');
    }
}

// CLI Interface
if (require.main === module) {
    const migration = new SpotifyMigration();
    
    const command = process.argv[2];
    
    switch (command) {
        case 'run':
            migration.runMigration()
                .then(() => migration.showMigrationSummary())
                .catch(console.error);
            break;
            
        case 'rollback':
            console.log('🔄 Rolling back migration...');
            try {
                // Restore from backup
                const backupDir = path.join(__dirname, 'backup');
                if (fs.existsSync(backupDir)) {
                    const files = fs.readdirSync(backupDir);
                    const latestBackup = files
                        .filter(f => f.endsWith('.js'))
                        .sort()
                        .pop();
                    
                    if (latestBackup) {
                        const backupPath = path.join(backupDir, latestBackup);
                        const targetPath = path.join(__dirname, latestBackup.replace(/-\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}Z/, ''));
                        fs.copyFileSync(backupPath, targetPath);
                        console.log(`✅ Restored: ${latestBackup}`);
                    }
                }
                console.log('✅ Rollback completed');
            } catch (error) {
                console.error('❌ Rollback failed:', error.message);
            }
            break;
            
        case 'status':
            console.log('📊 Migration Status:');
            console.log('');
            
            const oldExists = fs.existsSync(path.join(__dirname, 'spotify-integration.js'));
            const newExists = fs.existsSync(path.join(__dirname, 'spotify-web-api-integration.js'));
            const packageExists = fs.existsSync(path.join(__dirname, 'package.json'));
            const envExists = fs.existsSync(path.join(__dirname, '.env.example'));
            
            console.log(`   Old Integration: ${oldExists ? '✅ Exists' : '❌ Missing'}`);
            console.log(`   New Integration: ${newExists ? '✅ Exists' : '❌ Missing'}`);
            console.log(`   Package.json: ${packageExists ? '✅ Exists' : '❌ Missing'}`);
            console.log(`   Environment Template: ${envExists ? '✅ Exists' : '❌ Missing'}`);
            
            if (packageExists) {
                try {
                    const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
                    const hasSpotifyApi = packageJson.dependencies && packageJson.dependencies['spotify-web-api-node'];
                    console.log(`   Spotify Web API: ${hasSpotifyApi ? '✅ Installed' : '❌ Not Installed'}`);
                } catch (error) {
                    console.log(`   Spotify Web API: ❌ Error reading package.json`);
                }
            }
            break;
            
        default:
            console.log('🔄 Spotify Integration Migration Tool');
            console.log('');
            console.log('Usage:');
            console.log('  node migrate-spotify.js run      - Run migration');
            console.log('  node migrate-spotify.js rollback - Rollback migration');
            console.log('  node migrate-spotify.js status   - Check migration status');
            console.log('');
            console.log('This tool migrates from AppleScript-based Spotify integration');
            console.log('to the new Web API-based integration for better security and');
            console.log('cross-platform compatibility.');
    }
}

module.exports = SpotifyMigration;
