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
                
                // Update UI with Discord username immediately
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
                
                // Set a global flag to indicate test should start
                window.shouldStartDiscordTest = true;
                
                // If discord-test.js is already loaded, start the test directly
                if (typeof initializeDiscordInterface === 'function') {
                    console.log("Discord interface already loaded, starting test...");
                    initializeDiscordInterface();
                    
                    // Start test after a short delay
                    setTimeout(() => {
                        if (typeof startDiscordTest === 'function') {
                            console.log("Starting Discord test");
                            startDiscordTest();
                        }
                    }, 1500);
                } else {
                    console.log("Waiting for discord-test.js to load...");
                    // Set up a listener for when discord-test.js loads
                    window.addEventListener('discordTestLoaded', function() {
                        console.log("discord-test.js loaded via event");
                        if (typeof initializeDiscordInterface === 'function' && typeof startDiscordTest === 'function') {
                            initializeDiscordInterface();
                            setTimeout(() => {
                                startDiscordTest();
                            }, 1500);
                        }
                    });
                }
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
            
            // Set test intent
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
    
    async startAdminLogin() {
        try {
            console.log("Starting admin login flow...");
            
            // Show loading on admin button if it exists
            const adminLoginBtn = document.getElementById('adminLoginBtn');
            if (adminLoginBtn) {
                const originalText = adminLoginBtn.innerHTML;
                adminLoginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
                
                // Reset after 2 seconds if something goes wrong
                setTimeout(() => {
                    adminLoginBtn.innerHTML = originalText;
                }, 2000);
            }
            
            // Redirect directly to admin Discord OAuth
            window.location.href = `${this.baseUrl}/auth/discord/admin`;
        } catch (error) {
            console.error("Admin login error:", error);
            alert("Failed to start admin login. Please try again.");
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

// Update admin login button to use our auth manager
document.addEventListener('DOMContentLoaded', function() {
    const adminLoginBtn = document.getElementById('adminLoginBtn');
    if (adminLoginBtn) {
        // Replace the href with onclick
        adminLoginBtn.href = "#";
        adminLoginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log("Admin login button clicked");
            window.authManager.startAdminLogin();
        });
    }
});
