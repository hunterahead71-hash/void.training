// Utility Functions

// Load partials dynamically
async function loadPartials() {
    const partials = {
        'navSidebar': 'partials/navigation.html',
        'headerSection': 'partials/header.html',
        'ticketTypesSection': 'partials/ticket-types.html',
        'rosterCategoriesSection': 'partials/roster-categories.html',
        'quizSection': 'partials/quiz.html',
        'completionScreen': 'partials/completion.html',
        'footerSection': 'partials/footer.html',
        'discordHeader': 'partials/discord-header.html',
        'serverList': 'partials/discord-server-list.html',
        'discordSidebar': 'partials/discord-sidebar.html',
        'discordChatArea': 'partials/discord-chat.html',
        'scorePanel': 'partials/score-panel.html',
        'testCompleteScreen': 'partials/test-complete.html',
        'mobileHeader': 'partials/mobile-header.html',
        'mobileMessagesContainer': 'partials/mobile-messages.html',
        'mobileInputArea': 'partials/mobile-input.html',
        'mobileSidebar': 'partials/mobile-sidebar.html',
        'mobileScorePanel': 'partials/mobile-score-panel.html',
        'mobileTestComplete': 'partials/mobile-test-complete.html'
    };
    
    for (const [elementId, filePath] of Object.entries(partials)) {
        try {
            const response = await fetch(filePath);
            if (response.ok) {
                const html = await response.text();
                const element = document.getElementById(elementId);
                if (element) {
                    element.innerHTML = html;
                }
            }
        } catch (error) {
            console.error(`Error loading ${filePath}:`, error);
        }
    }
}

// Check URL parameters
function checkUrlParams() {
    const params = new URLSearchParams(window.location.search);
    
    // Check for test start flag in URL (after Discord auth)
    if (params.get("startTest") === "1") {
        const discordUsername = params.get("discord_username") || "User";
        const discordId = params.get("discord_id") || "0000";
        
        // Store Discord info globally
        window.userDiscordUsername = discordUsername;
        window.userDiscordId = discordId;
        
        console.log("Starting test for user:", discordUsername);
        
        // Hide main content and show test interface
        const mainContainer = document.getElementById('mainContainer');
        if (mainContainer) {
            mainContainer.style.display = 'none';
        }
        
        // Determine if mobile or desktop
        if (window.innerWidth <= 768) {
            // Mobile test
            const mobileDiscord = document.getElementById('mobileDiscord');
            if (mobileDiscord) {
                mobileDiscord.classList.add('active');
                
                // Initialize mobile interface
                if (typeof initializeMobileInterface === 'function') {
                    initializeMobileInterface();
                }
                
                setTimeout(() => {
                    if (typeof startMobileTest === 'function') {
                        startMobileTest();
                    }
                }, 1000);
            }
        } else {
            // Desktop test
            const testPage = document.getElementById('testPage');
            if (testPage) {
                testPage.style.display = 'block';
                
                // Update UI with Discord username
                const discordUsernameDisplay = document.getElementById('discordUsernameDisplay');
                const discordUserTag = document.getElementById('discordUserTag');
                const userAvatarInitial = document.getElementById('userAvatarInitial');
                
                if (discordUsernameDisplay) discordUsernameDisplay.textContent = discordUsername;
                if (discordUserTag) discordUserTag.textContent = "#" + (discordId.slice(-4) || "0000");
                if (userAvatarInitial) userAvatarInitial.textContent = discordUsername.charAt(0).toUpperCase();
                
                // Initialize Discord interface and start test
                if (typeof initializeDiscordInterface === 'function') {
                    initializeDiscordInterface();
                }
                
                setTimeout(() => {
                    if (typeof startDiscordTest === 'function') {
                        startDiscordTest();
                    }
                }, 1000);
            }
        }
        
        // Clear URL parameters
        window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    return params;
}

// Initialize AOS
function initAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true
        });
    }
}

// Check if mobile
function isMobile() {
    return window.innerWidth <= 768;
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Format time
function formatTime(date) {
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
}

// Export functions
window.utils = {
    loadPartials,
    checkUrlParams,
    initAOS,
    isMobile,
    debounce,
    formatTime
};
