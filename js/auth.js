// Auth management for frontend - FIXED VERSION
document.addEventListener('DOMContentLoaded', function() {
    console.log("Auth.js loaded");
    
    // Check URL parameters for test start
    const urlParams = new URLSearchParams(window.location.search);
    const startTest = urlParams.get('startTest');
    const discordUsername = urlParams.get('discord_username');
    const discordId = urlParams.get('discord_id');
    
    console.log("URL Parameters:", { startTest, discordUsername, discordId });
    
    if (startTest === '1' && discordUsername && discordId) {
        console.log("Starting test for user:", discordUsername);
        
        // Store user info globally
        window.userDiscordUsername = discordUsername;
        window.userDiscordId = discordId;
        
        // Hide main content and show test interface
        const mainContainer = document.getElementById('mainContainer');
        const testPage = document.getElementById('testPage');
        const mobileDiscord = document.getElementById('mobileDiscord');
        
        if (mainContainer) {
            console.log("Hiding main container");
            mainContainer.style.display = 'none';
        }
        
        // Determine if mobile or desktop
        if (window.innerWidth <= 768) {
            // Mobile test
            console.log("Loading mobile interface");
            if (mobileDiscord) {
                mobileDiscord.classList.add('active');
                
                // Initialize mobile interface
                if (typeof initializeMobileInterface === 'function') {
                    console.log("Initializing mobile interface");
                    initializeMobileInterface();
                }
                
                setTimeout(() => {
                    if (typeof startMobileTest === 'function') {
                        console.log("Starting mobile test");
                        startMobileTest();
                    }
                }, 1000);
            }
        } else {
            // Desktop test
            console.log("Loading desktop interface");
            if (testPage) {
                testPage.style.display = 'block';
                
                // Update UI with Discord username
                const discordUsernameDisplay = document.getElementById('discordUsernameDisplay');
                const discordUserTag = document.getElementById('discordUserTag');
                const userAvatarInitial = document.getElementById('userAvatarInitial');
                
                if (discordUsernameDisplay) {
                    discordUsernameDisplay.textContent = discordUsername;
                    console.log("Set username display to:", discordUsername);
                }
                if (discordUserTag) {
                    discordUserTag.textContent = "#" + (discordId.slice(-4) || "0000");
                }
                if (userAvatarInitial) {
                    userAvatarInitial.textContent = discordUsername.charAt(0).toUpperCase();
                }
                
                // Initialize Discord interface
                if (typeof initializeDiscordInterface === 'function') {
                    console.log("Initializing Discord interface");
                    initializeDiscordInterface();
                }
                
                // Start test after a short delay
                setTimeout(() => {
                    if (typeof startDiscordTest === 'function') {
                        console.log("Starting Discord test");
                        startDiscordTest();
                    }
                }, 1500);
            }
        }
        
        // Clear URL parameters
        console.log("Clearing URL parameters");
        window.history.replaceState({}, document.title, window.location.pathname);
    }
});

// Auth manager class
class AuthManager {
    constructor() {
        this.baseUrl = "https://mod-application-backend.onrender.com";
        this.user = null;
        this.isAdmin = false;
    }

    async startTest() {
        try {
            console.log("Starting test flow...");
            
            // Show loading
            const takeTestBtn = document.getElementById('takeTestBtn');
            if (takeTestBtn) {
                takeTestBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Starting test...';
                takeTestBtn.disabled = true;
            }
            
            // Set test intent - USING GET INSTEAD OF POST
            console.log("Setting test intent...");
            const response = await fetch(`${this.baseUrl}/set-test-intent`, {
                method: 'GET',
                credentials: 'include'
            });
            
            console.log("Test intent response:", response);
            
            if (response.ok) {
                console.log("Test intent set, redirecting to Discord OAuth...");
                // Redirect to Discord OAuth
                window.location.href = `${this.baseUrl}/auth/discord`;
            } else {
                throw new Error("Failed to set test intent");
            }
        } catch (error) {
            console.error("Start test error:", error);
            alert("Failed to start test. Please try again.");
            
            // Reset button
            const takeTestBtn = document.getElementById('takeTestBtn');
            if (takeTestBtn) {
                takeTestBtn.innerHTML = '<i class="fas fa-vial"></i> Begin Certification Test';
                takeTestBtn.disabled = false;
            }
        }
    }
}

// Initialize auth manager
window.authManager = new AuthManager();

// Add event listener for take test button
document.addEventListener('click', function(e) {
    if (e.target.closest('#takeTestBtn')) {
        e.preventDefault();
        console.log("Take test button clicked");
        window.authManager.startTest();
    }
});
