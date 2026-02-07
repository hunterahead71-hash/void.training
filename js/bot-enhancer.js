// BOT ENHANCER - Advanced Discord Bot Manager
// BOT ENHANCER - Advanced Discord Bot Manager
const { EmbedBuilder, PermissionsBitField } = require('discord.js');

class EnhancedBotManager {
    constructor(botClient) {
        this.bot = botClient;
        this.ready = false;
        this.initialized = false;
        this.lastActivity = Date.now();
        this.retryCount = 0;
        this.maxRetries = 5;
        this.pendingOperations = new Map();
        
        // Activity monitoring
        this.activityCheckInterval = setInterval(() => {
            this.checkBotActivity();
        }, 30000);
        
        // Initialize enhanced features
        this.init();
    }
    
    async init() {
        try {
            console.log('🤖 Initializing Enhanced Bot Manager...');
            
            // Wait for bot to be ready
            this.bot.on('ready', () => {
                this.ready = true;
                this.initialized = true;
                console.log(`✅ Bot ready as ${this.bot.user.tag} (Enhanced)`);
                this.setBotPresence();
                
                // Process any pending operations
                this.processPendingOperations();
            });
            
            // Error handling
            this.bot.on('error', (error) => {
                console.error('🤖 Bot Error:', error);
                this.ready = false;
                this.attemptReconnect();
            });
            
            // Disconnect handling
            this.bot.on('disconnect', () => {
                console.log('🤖 Bot disconnected');
                this.ready = false;
            });
            
            // Reconnect handling
            this.bot.on('reconnecting', () => {
                console.log('🤖 Bot reconnecting...');
            });
            
            console.log('🤖 Bot Manager Initialized');
        } catch (error) {
            console.error('🤖 Failed to initialize bot manager:', error);
        }
    }
    
    async attemptReconnect() {
        if (this.retryCount >= this.maxRetries) {
            console.error('🤖 Max reconnection attempts reached');
            return;
        }
        
        this.retryCount++;
        console.log(`🤖 Reconnection attempt ${this.retryCount}/${this.maxRetries}`);
        
        setTimeout(async () => {
            try {
                await this.bot.login(process.env.DISCORD_BOT_TOKEN);
                this.ready = true;
                this.retryCount = 0;
                console.log('🤖 Reconnected successfully');
            } catch (error) {
                console.error('🤖 Reconnection failed:', error.message);
            }
        }, 5000 * this.retryCount); // Exponential backoff
    }
    
    setBotPresence() {
        if (!this.bot.user) return;
        
        const activities = [
            { name: 'Void Mod Applications', type: 3 }, // WATCHING
            { name: 'Admin Dashboard', type: 0 }, // PLAYING
            { name: 'Ticket System', type: 2 }, // LISTENING
        ];
        
        const activity = activities[Math.floor(Math.random() * activities.length)];
        
        this.bot.user.setPresence({
            activities: [{
                name: activity.name,
                type: activity.type
            }],
            status: 'online'
        });
        
        console.log(`🤖 Bot presence set to: ${activity.name}`);
        
        // Rotate presence every 5 minutes
        setInterval(() => {
            if (this.ready) {
                const newActivity = activities[Math.floor(Math.random() * activities.length)];
                this.bot.user.setPresence({
                    activities: [{
                        name: newActivity.name,
                        type: newActivity.type
                    }],
                    status: 'online'
                });
            }
        }, 300000);
    }
    
    checkBotActivity() {
        if (!this.ready) {
            console.log('⚠️ Bot is not ready, attempting to reconnect...');
            this.attemptReconnect();
        } else {
            this.lastActivity = Date.now();
        }
    }
    
    addPendingOperation(operationId, operation) {
        this.pendingOperations.set(operationId, {
            ...operation,
            timestamp: Date.now(),
            attempts: 0
        });
    }
    
    async processPendingOperations() {
        if (this.pendingOperations.size === 0) return;
        
        console.log(`🤖 Processing ${this.pendingOperations.size} pending operations...`);
        
        for (const [operationId, operation] of this.pendingOperations) {
            try {
                await this.executeOperation(operation);
                this.pendingOperations.delete(operationId);
                console.log(`✅ Processed pending operation: ${operationId}`);
            } catch (error) {
                console.error(`❌ Failed pending operation ${operationId}:`, error.message);
                operation.attempts++;
                
                // Remove if too many attempts
                if (operation.attempts >= 3) {
                    this.pendingOperations.delete(operationId);
                    console.log(`🗑️ Removed failed operation: ${operationId}`);
                }
            }
        }
    }
    
    async executeOperation(operation) {
        switch (operation.type) {
            case 'assignRole':
                return await this.assignRoleToUser(operation.userId, operation.roleId);
            case 'sendDM':
                return await this.sendDirectMessage(operation.userId, operation.message);
            case 'sendWelcome':
                return await this.sendWelcomeMessage(operation.userId, operation.username);
            case 'sendRejection':
                return await this.sendRejectionMessage(operation.userId, operation.username, operation.reason);
        }
    }
    
    // Enhanced role assignment
    async assignRoleToUser(userId, roleId) {
        console.log(`🤖 Assigning role ${roleId} to user ${userId}`);
        
        try {
            // Check bot readiness
            if (!this.ready) {
                throw new Error('Bot not ready');
            }
            
            // Get guild
            const guild = await this.bot.guilds.fetch(process.env.DISCORD_GUILD_ID);
            if (!guild) {
                throw new Error('Guild not found');
            }
            
            // Get member
            let member;
            try {
                member = await guild.members.fetch(userId);
            } catch (error) {
                throw new Error(`User ${userId} not found in guild: ${error.message}`);
            }
            
            // Get role
            const role = guild.roles.cache.get(roleId);
            if (!role) {
                throw new Error(`Role ${roleId} not found`);
            }
            
            // Check bot permissions
            const botMember = await guild.members.fetch(this.bot.user.id);
            if (!botMember.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
                throw new Error('Bot lacks ManageRoles permission');
            }
            
            if (role.position >= botMember.roles.highest.position) {
                throw new Error('Bot cannot assign role higher than its highest role');
            }
            
            // Assign role
            await member.roles.add(role);
            console.log(`✅ Role ${role.name} assigned to ${member.user.tag}`);
            
            // Update activity timestamp
            this.lastActivity = Date.now();
            
            return {
                success: true,
                username: member.user.tag,
                role: role.name
            };
            
        } catch (error) {
            console.error(`❌ Failed to assign role: ${error.message}`);
            throw error;
        }
    }
    
    // Enhanced DM sending
    async sendDirectMessage(userId, messageData) {
        console.log(`🤖 Sending DM to user ${userId}`);
        
        try {
            if (!this.ready) {
                throw new Error('Bot not ready');
            }
            
            // Get user
            let user;
            try {
                user = await this.bot.users.fetch(userId);
            } catch (error) {
                throw new Error(`User ${userId} not found: ${error.message}`);
            }
            
            // Create embed
            const embed = new EmbedBuilder()
                .setTitle(messageData.title || 'Void Esports Notification')
                .setDescription(messageData.description || '')
                .setColor(messageData.color || 0x00ffea)
                .setTimestamp();
            
            if (messageData.footer) {
                embed.setFooter({ text: messageData.footer });
            }
            
            if (messageData.fields && messageData.fields.length > 0) {
                embed.addFields(messageData.fields);
            }
            
            // Send DM
            await user.send({ embeds: [embed] });
            console.log(`✅ DM sent to ${user.tag}`);
            
            this.lastActivity = Date.now();
            
            return {
                success: true,
                username: user.tag,
                messageId: 'sent'
            };
            
        } catch (error) {
            console.error(`❌ Failed to send DM: ${error.message}`);
            
            // Check if user has DMs disabled
            if (error.code === 50007) {
                console.log(`📵 User ${userId} has DMs disabled`);
                return {
                    success: false,
                    error: 'User has DMs disabled',
                    username: userId
                };
            }
            
            throw error;
        }
    }
    
    // Enhanced welcome message
    async sendWelcomeMessage(userId, username) {
        const welcomeData = {
            title: '🎉 Welcome to the Void Esports Mod Team!',
            description: `**Congratulations ${username}!**\n\n` +
                `Your moderator application has been **APPROVED**.\n\n` +
                `**What happens next?**\n` +
                `1. You've been granted the **Trial Moderator** role\n` +
                `2. Read #staff-rules-and-info for protocols\n` +
                `3. Introduce yourself in #staff-introductions\n` +
                `4. Join our next training session\n` +
                `5. Start with ticket duty in #mod-tickets\n\n` +
                `**Quick Start Guide:**\n` +
                `• Use \`/login\` when starting your shift\n` +
                `• Use \`/logout\` when ending your shift\n` +
                `• Check #staff-commands for all commands\n` +
                `• For questions, ping @Senior Staff in #staff-chat\n\n` +
                `We're excited to have you on board! 🚀`,
            color: 0x3ba55c,
            footer: 'Welcome to the Team!',
            fields: [
                {
                    name: '📊 Next Steps',
                    value: 'Complete orientation within 48 hours',
                    inline: true
                },
                {
                    name: '🎯 First Task',
                    value: 'Read pinned messages in #staff-rules',
                    inline: true
                },
                {
                    name: '🆘 Need Help?',
                    value: 'Ping @Senior Staff anytime',
                    inline: true
                }
            ]
        };
        
        return await this.sendDirectMessage(userId, welcomeData);
    }
    
    // Enhanced rejection message
    async sendRejectionMessage(userId, username, reason) {
        const rejectionData = {
            title: '❌ Application Status Update',
            description: `Hello **${username}**,\n\n` +
                `After careful review, your moderator application has **not been approved** at this time.\n\n` +
                `**Reason for Rejection:**\n\`\`\`\n${reason}\n\`\`\`\n\n` +
                `**What you can do:**\n` +
                `• You can reapply in **30 days**\n` +
                `• Stay active in our community\n` +
                `• Improve your knowledge of our rules\n` +
                `• Consider volunteering in other areas\n\n` +
                `**Tips for next time:**\n` +
                `• Review all training materials thoroughly\n` +
                `• Spend more time in our community\n` +
                `• Ask questions if unsure about protocols\n\n` +
                `Thank you for your interest in joining the Void Esports team!`,
            color: 0xed4245,
            footer: 'Better luck next time!',
            fields: [
                {
                    name: '⏳ Reapply Date',
                    value: `You can reapply after ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}`,
                    inline: false
                },
                {
                    name: '📚 Resources',
                    value: 'Check #how-to-join-roster for requirements',
                    inline: true
                },
                {
                    name: '💬 Questions?',
                    value: 'Reach out to @Senior Staff',
                    inline: true
                }
            ]
        };
        
        return await this.sendDirectMessage(userId, rejectionData);
    }
    
    // Status check
    getStatus() {
        return {
            ready: this.ready,
            initialized: this.initialized,
            uptime: this.ready ? Date.now() - this.lastActivity : 0,
            guilds: this.bot.guilds.cache.size,
            pendingOperations: this.pendingOperations.size,
            retryCount: this.retryCount,
            user: this.bot.user ? this.bot.user.tag : 'Not logged in'
        };
    }
}

module.exports = { EnhancedBotManager };
