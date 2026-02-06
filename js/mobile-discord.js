// Mobile Discord Interface Logic
document.addEventListener('DOMContentLoaded', function() {
    // Mobile interface elements
    const mobileDiscord = document.getElementById('mobileDiscord');
    
    // Check if mobile
    function isMobile() {
        return window.innerWidth <= 768;
    }
    
    // Initialize mobile interface
    function initializeMobileInterface() {
        console.log("Mobile interface initialized");
        
        // Add mobile event listeners here
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const mobileCloseSidebar = document.getElementById('mobileCloseSidebar');
        const mobileSidebar = document.getElementById('mobileSidebar');
        const mobileScoreBtn = document.getElementById('mobileScoreBtn');
        const mobileCloseScore = document.getElementById('mobileCloseScore');
        const mobileScorePanel = document.getElementById('mobileScorePanel');
        const mobileExitBtn = document.getElementById('mobileExitBtn');
        const mobileSendBtn = document.getElementById('mobileSendBtn');
        const mobileMessageInput = document.getElementById('mobileMessageInput');
        const mobileTestReviewBtn = document.getElementById('mobileTestReviewBtn');
        const mobileTestBackBtn = document.getElementById('mobileTestBackBtn');
        const mainContainer = document.getElementById('mainContainer');
        
        // Mobile menu button
        if (mobileMenuBtn && mobileSidebar) {
            mobileMenuBtn.addEventListener('click', function() {
                mobileSidebar.classList.add('active');
            });
        }
        
        // Close sidebar
        if (mobileCloseSidebar && mobileSidebar) {
            mobileCloseSidebar.addEventListener('click', function() {
                mobileSidebar.classList.remove('active');
            });
        }
        
        // Score button
        if (mobileScoreBtn && mobileScorePanel) {
            mobileScoreBtn.addEventListener('click', function() {
                mobileScorePanel.classList.add('active');
            });
        }
        
        // Close score panel
        if (mobileCloseScore && mobileScorePanel) {
            mobileCloseScore.addEventListener('click', function() {
                mobileScorePanel.classList.remove('active');
            });
        }
        
        // Exit button
        if (mobileExitBtn) {
            mobileExitBtn.addEventListener('click', function() {
                if (mobileDiscord) mobileDiscord.classList.remove('active');
                if (mainContainer) mainContainer.style.display = 'block';
                resetMobileTest();
            });
        }
        
        // Send button
        if (mobileSendBtn && mobileMessageInput) {
            mobileMessageInput.addEventListener('input', function() {
                mobileSendBtn.disabled = this.value.trim() === '';
            });
            
            mobileMessageInput.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMobileMessage();
                }
            });
            
            mobileSendBtn.addEventListener('click', sendMobileMessage);
        }
        
        // Test review button
        if (mobileTestReviewBtn) {
            mobileTestReviewBtn.addEventListener('click', function() {
                const mobileTestComplete = document.getElementById('mobileTestComplete');
                if (mobileTestComplete) mobileTestComplete.classList.remove('active');
                resetMobileTest();
                setTimeout(() => {
                    startMobileTest();
                }, 500);
            });
        }
        
        // Back to training button
        if (mobileTestBackBtn) {
            mobileTestBackBtn.addEventListener('click', function() {
                const mobileTestComplete = document.getElementById('mobileTestComplete');
                if (mobileTestComplete) mobileTestComplete.classList.remove('active');
                if (mobileDiscord) mobileDiscord.classList.remove('active');
                if (mainContainer) mainContainer.style.display = 'block';
                resetMobileTest();
            });
        }
    }
    
    // Start mobile test
    function startMobileTest() {
        console.log("Starting mobile test");
        // Your mobile test logic here
        // This would be similar to the desktop test but adapted for mobile
    }
    
    // Send mobile message
    function sendMobileMessage() {
        const mobileMessageInput = document.getElementById('mobileMessageInput');
        const mobileSendBtn = document.getElementById('mobileSendBtn');
        
        if (!mobileMessageInput) return;
        
        const message = mobileMessageInput.value.trim();
        if (!message) return;
        
        // Add message to mobile chat
        addMobileMessage("You", message, "#7289da");
        
        mobileMessageInput.value = '';
        mobileMessageInput.style.height = 'auto';
        if (mobileSendBtn) mobileSendBtn.disabled = true;
        
        // Simulate response
        setTimeout(() => {
            addMobileMessage("Test User", "Thank you for your response. Next question...", "#ed4245");
        }, 1000);
    }
    
    // Add message to mobile chat
    function addMobileMessage(username, content, color) {
        const mobileMessagesContainer = document.getElementById('mobileMessagesContainer');
        if (!mobileMessagesContainer) return;
        
        const messageGroup = document.createElement('div');
        messageGroup.className = 'mobile-message-group';
        
        const now = new Date();
        const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        
        let avatarInitials = username.charAt(0).toUpperCase();
        if (username === "Nicks Cold") avatarInitials = "N";
        if (username === "Void Bot") avatarInitials = "V";
        
        messageGroup.innerHTML = `
            <div class="mobile-message-header">
                <div class="mobile-message-avatar" style="background-color: ${color}">
                    ${avatarInitials}
                </div>
                <div>
                    <span class="mobile-message-author">${username}</span>
                    ${username === "Void Bot" ? '<span class="mobile-bot-tag">BOT</span>' : ''}
                    <span class="mobile-message-timestamp">${timeString}</span>
                </div>
            </div>
            <div class="mobile-message-content">
                ${content}
            </div>
        `;
        
        mobileMessagesContainer.appendChild(messageGroup);
        mobileMessagesContainer.scrollTop = mobileMessagesContainer.scrollHeight;
    }
    
    // Reset mobile test
    function resetMobileTest() {
        const mobileMessageInput = document.getElementById('mobileMessageInput');
        const mobileSendBtn = document.getElementById('mobileSendBtn');
        const mobileMessagesContainer = document.getElementById('mobileMessagesContainer');
        
        if (mobileMessageInput) {
            mobileMessageInput.value = '';
            mobileMessageInput.disabled = true;
        }
        
        if (mobileSendBtn) mobileSendBtn.disabled = true;
        
        if (mobileMessagesContainer) {
            // Clear all messages except the first two
            const allMessages = mobileMessagesContainer.querySelectorAll('.mobile-message-group');
            for (let i = 2; i < allMessages.length; i++) {
                allMessages[i].remove();
            }
        }
    }
    
    // Export functions to window
    window.initializeMobileInterface = initializeMobileInterface;
    window.startMobileTest = startMobileTest;
});
