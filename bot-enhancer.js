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
        
        // Initialize
        this.init();
    }
    
    async init() {
        try {
            console.log('🤖 Initializing Enhanced Bot Manager...');
            
            this.bot.on('ready', () => {
                this.ready = true;
                this.initialized = true;
                console.log(`✅ Bot ready as ${this.bot.user.tag} (Enhanced)`);
                this.setBotPresence();
                this.processPendingOperations();
            });
            
            this.bot.on('error', (error) => {
                console.error('🤖 Bot Error:', error);
                this.ready = false;
            });
            
            console.log('🤖 Bot Manager Initialized');
        } catch (error) {
            console.error('🤖 Failed to initialize bot manager:', error);
        }
    }
    
    setBotPresence() {
        if (!this.bot.user) return;
        
        const activities = [
            { name: 'Void Mod Applications', type: 3 },
            { name: 'Admin Dashboard', type: 0 },
            { name: 'Ticket System', type: 2 },
        ];
        
        const activity = activities[Math.floor(Math.random() * activities.length)];
        
        this.bot.user.setPresence({
            activities: [{
                name: activity.name,
                type: activity.type
            }],
            status: 'online'
        });
        
        // Rotate every 5 minutes
        setInterval(() => {
            if (this.ready && this.bot.user) {
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
    
    async assignRoleToUser(userId, roleId) {
        console.log(`🤖 Assigning role ${roleId} to user ${userId}`);
        
        try {
            if (!this.ready) throw new Error('Bot not ready');
            
            const guild = await this.bot.guilds.fetch(process.env.DISCORD_GUILD_ID);
            if (!guild) throw new Error('Guild not found');
            
            let member;
            try {
                member = await guild.members.fetch(userId);
            } catch (error) {
                throw new Error(`User ${userId} not found in guild`);
            }
            
            const role = guild.roles.cache.get(roleId);
            if (!role) throw new Error(`Role ${roleId} not found`);
            
            const botMember = await guild.members.fetch(this.bot.user.id);
            if (!botMember.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
                throw new Error('Bot lacks ManageRoles permission');
            }
            
            if (role.position >= botMember.roles.highest.position) {
                throw new Error('Bot cannot assign role higher than its highest role');
            }
            
            await member.roles.add(role);
            console.log(`✅ Role ${role.name} assigned to ${member.user.tag}`);
            
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
    
    async sendDirectMessage(userId, messageData) {
        console.log(`🤖 Sending DM to user ${userId}`);
        
        try {
            if (!this.ready) throw new Error('Bot not ready');
            
            let user;
            try {
                user = await this.bot.users.fetch(userId);
            } catch (error) {
                throw new Error(`User ${userId} not found`);
            }
            
            const embed = new EmbedBuilder()
                .setTitle(messageData.title || 'Void Esports Notification')
                .setDescription(messageData.description || '')
                .setColor(messageData.color || 0x00ffea)
                .setTimestamp();
            
            if (messageData.footer) {
                embed.setFooter({ text: messageData.footer });
            }
            
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
                `We're excited to have you on board! 🚀`,
            color: 0x3ba55c,
            footer: 'Welcome to the Team!'
        };
        
        return await this.sendDirectMessage(userId, welcomeData);
    }
    
    async sendRejectionMessage(userId, username, reason) {
        const rejectionData = {
            title: '❌ Application Status Update',
            description: `Hello **${username}**,\n\n` +
                `After careful review, your moderator application has **not been approved** at this time.\n\n` +
                `**Reason for Rejection:**\n\`\`\`\n${reason}\n\`\`\`\n\n` +
                `**What you can do:**\n` +
                `• You can reapply in **30 days**\n` +
                `• Stay active in our community\n` +
                `• Improve your knowledge of our rules\n\n` +
                `Thank you for your interest in joining the Void Esports team!`,
            color: 0xed4245,
            footer: 'Better luck next time!'
        };
        
        return await this.sendDirectMessage(userId, rejectionData);
    }
    
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
