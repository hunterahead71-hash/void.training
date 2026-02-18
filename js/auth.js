// Authentication Manager
class AuthManager {
    constructor() {
        this.baseUrl = CONFIG.API_BASE_URL;
    }

    async startTest() {
        try {
            console.log("Starting test flow...");
            
            const takeTestBtn = document.getElementById('takeTestBtn');
            if (takeTestBtn) {
                takeTestBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Starting test...';
                takeTestBtn.disabled = true;
            }
            
            const response = await fetch(`${this.baseUrl}/set-test-intent`, {
                method: 'GET',
                credentials: 'include'
            });
            
            if (response.ok) {
                window.location.href = `${this.baseUrl}/auth/discord`;
            } else {
                throw new Error("Failed to set test intent");
            }
        } catch (error) {
            console.error("Start test error:", error);
            alert("Failed to start test. Please try again.");
            
            const takeTestBtn = document.getElementById('takeTestBtn');
            if (takeTestBtn) {
                takeTestBtn.innerHTML = '<i class="fas fa-vial"></i> Begin Certification Test';
                takeTestBtn.disabled = false;
            }
        }
    }
    
    startAdminLogin() {
        window.location.href = `${this.baseUrl}/auth/discord/admin`;
    }
    
    // Handle OAuth return
    handleOAuthReturn() {
        const params = new URLSearchParams(window.location.search);
        const startTest = params.get('startTest');
        const discordUsername = params.get('discord_username');
        const discordId = params.get('discord_id');
        
        if (startTest === '1' && discordUsername && discordId) {
            console.log("Returning from OAuth, starting test for:", discordUsername);
            
            testState.initUser(discordUsername, discordId);
            
            const isMobile = window.innerWidth <= 768;
            
            if (isMobile) {
                mobile.init();
                mobile.show();
                mobile.updateUserDisplay();
            } else {
                desktop.init();
                desktop.show();
                desktop.updateUserDisplay();
            }
            
            setTimeout(() => {
                testLogic.start(isMobile);
            }, 1000);
        }
    }
}

// Initialize auth manager
window.authManager = new AuthManager();

// Handle OAuth return on page load
document.addEventListener('DOMContentLoaded', () => {
    window.authManager.handleOAuthReturn();
});
