// Discord Test Interface Logic (PC) - BULLETPROOF VERSION
document.addEventListener('DOMContentLoaded', function() {
    console.log("🎮 Discord test.js loaded - Bulletproof Version");
    
    // Test state variables for PC
    let testCurrentQuestion = 0;
    let testScore = 0;
    let testActive = false;
    let testTotalQuestions = 8;
    window.userDiscordUsername = window.userDiscordUsername || 'User';
    window.userDiscordId = window.userDiscordId || '0000';
    let userAnswers = [];
    let correctAnswers = [];
    let testQuestions = [];
    let sessionTranscript = [];
    let testStartTime;
    let usedQuestionIds = new Set();
    
    // Test questions pool - Enhanced and unique
    const allTestQuestions = [
        {
            id: 1,
            userMessage: "Hi i want to join void",
            correctKeywords: ["age", "how old", "years old", "roster", "channel", "requirement", "fit", "category", "join", "hello", "hi", "help", "assist", "requirements", "first", "initial", "welcome"],
            requiredMatches: 2,
            user: "Nicks Cold",
            avatarColor: "#ed4245",
            explanation: "Your response should ask for their age and direct them to #how-to-join-roster to read requirements."
        },
        {
            id: 2,
            userMessage: "i want to join as a pro",
            correctKeywords: ["tracker", "fortnite tracker", "stats", "ranking", "pr", "send", "trapped", "chief", "ping", "earnings", "wait", "pro", "information", "verify", "proof", "power ranking"],
            requiredMatches: 2,
            user: "Nicks Cold",
            avatarColor: "#ed4245",
            explanation: "Ask for their Fortnite tracker and ping @trapped or @cheif for pro applications."
        },
        {
            id: 3,
            userMessage: "i want to join as creative roster",
            correctKeywords: ["clip", "video", "footage", "freebuilding", "send", "creativedepartment", "ping", "wait", "at least 2", "freebuild", "review", "creative", "skills", "show"],
            requiredMatches: 2,
            user: "Nicks Cold",
            avatarColor: "#ed4245",
            explanation: "Ask for at least 2 clips of freebuilding and ping @creativedepartment."
        },
        {
            id: 4,
            userMessage: "i want to join as academy player",
            correctKeywords: ["tracker", "fortnite tracker", "send", "verify", "username", "name change", "add void", "team.void", "proof", "academy", "requirements", "power ranking", "pr", "represent"],
            requiredMatches: 2,
            user: "Nicks Cold",
            avatarColor: "#ed4245",
            explanation: "Ask for their Fortnite tracker, verify PR meets requirements, ask for username change and team.void proof."
        },
        {
            id: 5,
            userMessage: "im 12 years old is that okay?",
            correctKeywords: ["cheif", "trapped", "ping", "underage", "minimum age", "13", "not allowed", "ban", "sorry", "violation", "rules", "discord tos", "terms of service"],
            requiredMatches: 2,
            user: "Nicks Cold",
            avatarColor: "#ed4245",
            explanation: "Underage users (under 13) should be pinged to @cheif or informed about age requirements."
        },
        {
            id: 6,
            userMessage: "i want to join as void grinder",
            correctKeywords: ["username", "discord name", "add void", "team.void", "proof", "change", "grinder", "represent", "name", "fortnite name", "in-game"],
            requiredMatches: 2,
            user: "Nicks Cold",
            avatarColor: "#ed4245",
            explanation: "Ask them to change Discord/Fortnite username to include 'Void' and use team.void with proof."
        },
        {
            id: 7,
            userMessage: "i will nuke this server",
            correctKeywords: ["cheif", "trapped", "ping", "threat", "dangerous", "ban", "immediately", "security", "nuke", "unacceptable", "report", "admin", "danger"],
            requiredMatches: 2,
            user: "Nicks Cold",
            avatarColor: "#ed4245",
            explanation: "Threats should result in immediate ping to @cheif and mention of potential ban."
        },
        {
            id: 8,
            userMessage: "i wanna join as a content creator",
            correctKeywords: ["social", "social media", "links", "send", "contentdep", "ping", "wait", "followers", "content", "review", "youtube", "twitch", "tiktok", "platform"],
            requiredMatches: 2,
            user: "Nicks Cold",
            avatarColor: "#ed4245",
            explanation: "Ask for social media links and ping @contentdep for content creator applications."
        },
        {
            id: 9,
            userMessage: "what are the requirements for semi-pro?",
            correctKeywords: ["power ranking", "pr", "10k", "25k", "earnings", "tracker", "fortnite", "consistently", "represent", "code", "requirements", "explain"],
            requiredMatches: 2,
            user: "Nicks Cold",
            avatarColor: "#ed4245",
            explanation: "Explain the semi-pro requirements: 10,000-25,000 PR, consistent placement, represent us in game, use Fortnite code, must have earnings."
        },
        {
            id: 10,
            userMessage: "how do i apply for streamer?",
            correctKeywords: ["followers", "viewers", "average", "stream", "social media", "links", "contentdep", "ping", "requirements", "twitch", "youtube", "schedule"],
            requiredMatches: 2,
            user: "Nicks Cold",
            avatarColor: "#ed4245",
            explanation: "Ask for follower count, average viewers, streaming schedule, and social media links, then ping @contentdep."
        },
        {
            id: 11,
            userMessage: "can i join as a graphic designer?",
            correctKeywords: ["portfolio", "gfx", "vfx", "work", "samples", "gfx-vfx", "ping", "experience", "quality", "resolution", "send"],
            requiredMatches: 2,
            user: "Nicks Cold",
            avatarColor: "#ed4245",
            explanation: "Ask for their portfolio and ping @gfx-vfx department for review."
        },
        {
            id: 12,
            userMessage: "i'm 15 with 15k PR, can i join?",
            correctKeywords: ["age", "academy", "tracker", "pr", "verify", "requirements", "semi-pro", "power ranking", "check"],
            requiredMatches: 2,
            user: "Nicks Cold",
            avatarColor: "#ed4245",
            explanation: "Verify age (15 is acceptable), ask for Fortnite tracker to check PR, then direct to appropriate roster category."
        }
    ];
    
    // Get random test questions WITHOUT duplicates
    function getRandomTestQuestions() {
        const availableQuestions = allTestQuestions.filter(q => !usedQuestionIds.has(q.id));
        const shuffled = [...availableQuestions].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 8);
        
        if (availableQuestions.length < 8) {
            usedQuestionIds.clear();
            const allShuffled = [...allTestQuestions].sort(() => 0.5 - Math.random());
            const newSelected = allShuffled.slice(0, 8);
            newSelected.forEach(q => usedQuestionIds.add(q.id));
            return newSelected;
        }
        
        selected.forEach(q => usedQuestionIds.add(q.id));
        return selected;
    }
    
    // ==================== HELPER FUNCTIONS ====================
    
    // Fetch with timeout
    function fetchWithTimeout(url, options, timeout = 8000) {
        return Promise.race([
            fetch(url, options),
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Request timeout')), timeout)
            )
        ]);
    }
    
    // Save results locally
    function saveResultsLocally() {
        try {
            const testData = {
                username: window.userDiscordUsername,
                userId: window.userDiscordId,
                score: `${testScore}/${testTotalQuestions}`,
                date: new Date().toISOString(),
                transcript: sessionTranscript,
                questions: testQuestions.map(q => ({
                    id: q.id,
                    userMessage: q.userMessage,
                    explanation: q.explanation
                })),
                userAnswers: userAnswers,
                correctAnswers: correctAnswers
            };
            
            localStorage.setItem('void_test_results', JSON.stringify(testData));
            localStorage.setItem('last_test_score', `${testScore}/${testTotalQuestions}`);
            localStorage.setItem('last_test_user', window.userDiscordUsername);
            localStorage.setItem('last_test_date', new Date().toISOString());
            
            console.log("💾 Saved to localStorage:", testData);
            return true;
        } catch (e) {
            console.error("Failed to save locally:", e);
            return false;
        }
    }
    
    // Send direct to Discord webhook (if webhook URL is hardcoded)
    async function sendDirectToDiscord() {
        // Try common webhook patterns - REPLACE WITH YOUR ACTUAL WEBHOOK URL
        const webhookUrls = [
            "https://discord.com/api/webhooks/1325238264322658304/DnupTjPQ9B2NKw3T2uZ3vDSc6p1Z2xf-CjBdP6gUa0tJF-LtQoU1LyhS0-1VzL6HhxwJ",
            // Add more backup webhooks if you have them
        ];
        
        for (const webhookUrl of webhookUrls) {
            if (!webhookUrl || !webhookUrl.includes('discord.com/api/webhooks')) continue;
            
            try {
                console.log("🌐 Trying direct Discord webhook:", webhookUrl.substring(0, 50) + "...");
                
                const response = await fetch(webhookUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        embeds: [{
                            title: "📝 MOD TEST SUBMISSION",
                            description: `**User:** ${window.userDiscordUsername}\n**Score:** ${testScore}/${testTotalQuestions}\n**Status:** Pending Review`,
                            fields: [
                                {
                                    name: "User Info",
                                    value: `Discord: ${window.userDiscordUsername}\nID: ${window.userDiscordId}`,
                                    inline: true
                                },
                                {
                                    name: "Test Details",
                                    value: `Score: ${testScore}/${testTotalQuestions}\nDate: ${new Date().toLocaleString()}`,
                                    inline: true
                                }
                            ],
                            color: 65280, // Green
                            timestamp: new Date().toISOString(),
                            footer: {
                                text: "Void Esports Mod Test System"
                            }
                        }]
                    })
                });
                
                if (response.ok) {
                    console.log("✅ Direct webhook sent successfully");
                    return true;
                } else {
                    console.log("❌ Webhook response not ok:", response.status);
                }
            } catch (e) {
                console.log("❌ Direct webhook failed:", e.message);
            }
        }
        
        throw new Error("No working webhook found");
    }
    
    // Show manual submission option
    function showManualSubmissionOption(score, total) {
        const testResultButtons = document.querySelector('.test-result-buttons');
        if (!testResultButtons) return;
        
        const manualDiv = document.createElement('div');
        manualDiv.className = 'manual-submission';
        manualDiv.style.marginTop = '20px';
        manualDiv.style.padding = '15px';
        manualDiv.style.background = 'rgba(255, 0, 51, 0.1)';
        manualDiv.style.borderRadius = '10px';
        manualDiv.style.textAlign = 'center';
        
        manualDiv.innerHTML = `
            <h4 style="margin-bottom: 10px; color: #ff0033;">📝 Manual Submission Required</h4>
            <p style="margin-bottom: 15px; font-size: 14px;">
                Please copy your test results and send them to a staff member:
            </p>
            <div style="background: rgba(0,0,0,0.3); padding: 10px; border-radius: 5px; margin-bottom: 15px; font-family: monospace; font-size: 13px; text-align: left;">
                🔹 Username: ${window.userDiscordUsername}<br>
                🔹 Discord ID: ${window.userDiscordId}<br>
                🔹 Score: ${score}/${total}<br>
                🔹 Date: ${new Date().toLocaleString()}<br>
                🔹 Status: ${score >= Math.ceil(total * 0.75) ? '✅ PASS' : '❌ FAIL'}
            </div>
            <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
                <button id="copyResultsBtn" class="test-result-btn primary" style="margin-top: 5px;">
                    <i class="fas fa-copy"></i> Copy Results
                </button>
                <a href="https://discord.com/users/727888300210913310" target="_blank" class="test-result-btn" style="background: #5865f2; margin-top: 5px;">
                    <i class="fab fa-discord"></i> Message Staff
                </a>
            </div>
        `;
        
        testResultButtons.appendChild(manualDiv);
        
        // Copy button
        document.getElementById('copyResultsBtn')?.addEventListener('click', function() {
            const textToCopy = `
╔═══════════════════════════════╗
║   VOID ESPORTS MOD TEST       ║
╠═══════════════════════════════╣
║ 📋 User: ${window.userDiscordUsername}
║ 🔑 ID: ${window.userDiscordId}
║ 🎯 Score: ${score}/${total}
║ 📅 Date: ${new Date().toLocaleString()}
║ ✅ Status: ${score >= Math.ceil(total * 0.75) ? 'PASS' : 'FAIL'}
╚═══════════════════════════════╝
            `.trim();
            
            navigator.clipboard.writeText(textToCopy).then(() => {
                alert('✅ Results copied to clipboard! Send this to a staff member on Discord.');
            });
        });
    }
    
    // ==================== MAIN FUNCTIONS ====================
    
    // Initialize Discord interface (PC)
    function initializeDiscordInterface() {
        console.log("🔧 Initializing Discord interface...");
        
        // DOM elements
        const messageInput = document.querySelector('.message-input');
        const sendButton = document.querySelector('.message-input-send');
        const backToTrainingBtn = document.querySelector('.back-to-training');
        const testPage = document.getElementById('testPage');
        const testCompleteScreen = document.getElementById('testCompleteScreen');
        const testReviewTestBtn = document.getElementById('testReviewTestBtn');
        const testBackToTrainingBtn = document.getElementById('testBackToTrainingBtn');
        const mainContainer = document.getElementById('mainContainer');
        
        // Message input handling
        if (messageInput) {
            messageInput.addEventListener('input', function() {
                this.style.height = 'auto';
                const newHeight = Math.min(this.scrollHeight, 200);
                this.style.height = newHeight + 'px';
                
                if (sendButton) {
                    sendButton.disabled = this.value.trim() === '';
                }
            });
            
            messageInput.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (!sendButton.disabled) {
                        sendTestMessage();
                    }
                }
            });
        }
        
        if (sendButton) {
            sendButton.addEventListener('click', sendTestMessage);
        }
        
        // Back to training button
        if (backToTrainingBtn) {
            backToTrainingBtn.addEventListener('click', function() {
                if (testPage) testPage.style.display = 'none';
                if (mainContainer) mainContainer.style.display = 'block';
                resetTest();
            });
        }
        
        // Test review button
        if (testReviewTestBtn) {
            testReviewTestBtn.addEventListener('click', function() {
                if (testCompleteScreen) testCompleteScreen.classList.remove('active');
                resetTest();
                setTimeout(() => {
                    startDiscordTest();
                }, 500);
            });
        }
        
        // Back to training from results
        if (testBackToTrainingBtn) {
            testBackToTrainingBtn.addEventListener('click', function() {
                if (testCompleteScreen) testCompleteScreen.classList.remove('active');
                if (testPage) testPage.style.display = 'none';
                if (mainContainer) mainContainer.style.display = 'block';
                resetTest();
            });
        }
        
        // Update UI with Discord username if available
        const discordUsernameDisplay = document.getElementById('discordUsernameDisplay');
        const discordUserTag = document.getElementById('discordUserTag');
        const userAvatarInitial = document.getElementById('userAvatarInitial');
        const userAvatarInitialText = document.getElementById('userAvatarInitialText');
        
        if (window.userDiscordUsername) {
            if (discordUsernameDisplay) discordUsernameDisplay.textContent = window.userDiscordUsername;
            if (discordUserTag) discordUserTag.textContent = "#" + (window.userDiscordId.slice(-4) || "0000");
            if (userAvatarInitialText) userAvatarInitialText.textContent = window.userDiscordUsername.charAt(0).toUpperCase();
        }
        
        // Fix for Font Awesome icons
        setTimeout(() => {
            const icons = document.querySelectorAll('.fa, .fas, .fab');
            icons.forEach(icon => {
                icon.style.fontFamily = "'Font Awesome 6 Free', 'Font Awesome 6 Brands', 'FontAwesome'";
            });
        }, 100);
        
        // Start test automatically if we have user data
        if (window.userDiscordUsername && window.userDiscordUsername !== 'User') {
            console.log("🚀 Auto-starting test for:", window.userDiscordUsername);
            setTimeout(() => {
                startDiscordTest();
            }, 1500);
        }
    }
    
    // Add message to chat (PC)
    function addMessage(username, content, color, isBot = false) {
        const messagesContainer = document.querySelector('.messages-container');
        if (!messagesContainer) return;
        
        addToTranscript(username, content);
        
        const messageGroup = document.createElement('div');
        messageGroup.className = 'message-group';
        
        const now = new Date();
        const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        
        let avatarInitials = username.charAt(0).toUpperCase();
        if (username === "Nicks Cold") avatarInitials = "N";
        if (username === "Void Bot") avatarInitials = "V";
        if (username === "You") avatarInitials = window.userDiscordUsername ? window.userDiscordUsername.charAt(0).toUpperCase() : "U";
        
        messageGroup.innerHTML = `
            <div class="message-header">
                <div class="message-avatar" style="background-color: ${color}">
                    ${avatarInitials}
                </div>
                <div>
                    <span class="message-author">${username}</span>
                    ${isBot ? '<span class="bot-tag">BOT</span>' : ''}
                    <span class="message-timestamp">Today at ${timeString}</span>
                </div>
            </div>
            <div class="message-content">
                <div class="message">${content.replace(/\n/g, '<br>')}</div>
            </div>
        `;
        
        messagesContainer.appendChild(messageGroup);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    // Add to transcript (PC)
    function addToTranscript(speaker, message) {
        sessionTranscript.push({
            speaker: speaker,
            message: message,
            timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})
        });
    }
    
    // Send test message (PC)
    function sendTestMessage() {
        const messageInput = document.querySelector('.message-input');
        const sendButton = document.querySelector('.message-input-send');
        
        if (!messageInput || !testActive) return;
        
        const userMessage = messageInput.value.trim();
        if (!userMessage) return;
        
        addMessage("You", userMessage, "#7289da", false);
        userAnswers.push(userMessage);
        
        messageInput.value = '';
        messageInput.style.height = 'auto';
        if (sendButton) sendButton.disabled = true;
        
        const isCorrect = checkTestAnswer(userMessage);
        correctAnswers.push(isCorrect);
        
        messageInput.disabled = true;
        
        setTimeout(() => {
            testCurrentQuestion++;
            if (testCurrentQuestion < testTotalQuestions) {
                showNextTestQuestion();
            } else {
                endTest();
            }
        }, 1500);
    }
    
    // Check test answer (PC)
    function checkTestAnswer(userAnswer) {
        if (testCurrentQuestion >= testQuestions.length) return false;
        
        const question = testQuestions[testCurrentQuestion];
        const userAnswerLower = userAnswer.toLowerCase();
        
        let matchCount = 0;
        for (let keyword of question.correctKeywords) {
            if (userAnswerLower.includes(keyword.toLowerCase())) {
                matchCount++;
            }
        }
        
        const isCorrect = matchCount >= question.requiredMatches;
        
        if (isCorrect) {
            testScore++;
            updateDiscordScore();
            
            const messagesContainer = document.querySelector('.messages-container');
            if (messagesContainer) {
                const lastMessage = messagesContainer.querySelector('.message-group:last-child');
                if (lastMessage) {
                    const messageText = lastMessage.querySelector('.message');
                    if (messageText) {
                        const badge = document.createElement('span');
                        badge.className = 'bot-tag';
                        badge.style.backgroundColor = '#3ba55c';
                        badge.textContent = 'Correct';
                        badge.style.marginLeft = '10px';
                        badge.style.fontFamily = "'Font Awesome 6 Free', 'Font Awesome 6 Brands', 'FontAwesome'";
                        messageText.appendChild(badge);
                    }
                }
            }
            
            // Show correct feedback
            setTimeout(() => {
                addMessage("Void Bot", `✅ Correct! ${question.explanation}`, "#5865f2", true);
            }, 500);
        } else {
            const messagesContainer = document.querySelector('.messages-container');
            if (messagesContainer) {
                const lastMessage = messagesContainer.querySelector('.message-group:last-child');
                if (lastMessage) {
                    const messageText = lastMessage.querySelector('.message');
                    if (messageText) {
                        const badge = document.createElement('span');
                        badge.className = 'bot-tag';
                        badge.style.backgroundColor = '#ed4245';
                        badge.textContent = 'Incorrect';
                        badge.style.marginLeft = '10px';
                        badge.style.fontFamily = "'Font Awesome 6 Free', 'Font Awesome 6 Brands', 'FontAwesome'";
                        messageText.appendChild(badge);
                    }
                }
            }
            
            // Show incorrect feedback
            setTimeout(() => {
                addMessage("Void Bot", `❌ Not quite right. ${question.explanation}`, "#5865f2", true);
            }, 500);
        }
        
        return isCorrect;
    }
    
    // Update Discord score display (PC)
    function updateDiscordScore() {
        const discordScoreValue = document.getElementById('discordScoreValue');
        const discordProgressFill = document.getElementById('discordProgressFill');
        
        if (discordScoreValue) discordScoreValue.textContent = testScore;
        
        const percentage = Math.round((testCurrentQuestion / testTotalQuestions) * 100);
        if (discordProgressFill) {
            discordProgressFill.style.width = `${percentage}%`;
        }
    }
    
    // Start Discord test (PC)
    function startDiscordTest() {
        console.log("🚀 Starting Discord test...");
        console.log("👤 User info:", window.userDiscordUsername, window.userDiscordId);
        
        usedQuestionIds.clear();
        testQuestions = getRandomTestQuestions();
        testTotalQuestions = testQuestions.length;
        testStartTime = Date.now();
        
        testActive = true;
        testCurrentQuestion = 0;
        testScore = 0;
        userAnswers = [];
        correctAnswers = [];
        sessionTranscript = [];
        addToTranscript("System", "Test session started at " + new Date().toLocaleString());
        
        // Clear existing messages except first two
        const messagesContainer = document.querySelector('.messages-container');
        if (messagesContainer) {
            const allMessages = messagesContainer.querySelectorAll('.message-group');
            for (let i = 2; i < allMessages.length; i++) {
                allMessages[i].remove();
            }
        }
        
        updateDiscordScore();
        
        const messageInput = document.querySelector('.message-input');
        if (messageInput) {
            messageInput.value = '';
            messageInput.style.height = 'auto';
            messageInput.disabled = false;
            messageInput.focus();
        }
        
        const sendButton = document.querySelector('.message-input-send');
        if (sendButton) sendButton.disabled = true;
        
        // Show welcome message
        setTimeout(() => {
            addMessage("Void Bot", `👋 Welcome to the Void Esports Moderator Certification Test, ${window.userDiscordUsername}!`, "#5865f2", true);
            
            setTimeout(() => {
                addMessage("Void Bot", `📝 You'll be presented with ${testTotalQuestions} simulated scenarios. Respond as you would as a real moderator. Good luck!`, "#5865f2", true);
                
                // Start question sequence
                setTimeout(() => {
                    showNextTestQuestion();
                }, 2000);
            }, 1000);
        }, 1000);
    }
    
    // Show next test question (PC)
    function showNextTestQuestion() {
        if (testCurrentQuestion >= testTotalQuestions) {
            endTest();
            return;
        }
        
        setTimeout(() => {
            const question = testQuestions[testCurrentQuestion];
            addMessage(question.user, question.userMessage, question.avatarColor, false);
            
            const messageInput = document.querySelector('.message-input');
            if (messageInput) {
                messageInput.disabled = false;
                messageInput.focus();
            }
        }, 1500 + Math.random() * 1000);
    }
    
    // End test (PC) - BULLETPROOF SUBMISSION
    async function endTest() {
        console.log("🏁 End test called - Starting BULLETPROOF submission...");
        
        testActive = false;
        addToTranscript("System", "Test session ended at " + new Date().toLocaleString());
        
        setTimeout(() => {
            addMessage("Void Bot", "📊 Test complete! Processing your results...", "#5865f2", true);
            
            setTimeout(async () => {
                const passingScore = Math.ceil(testTotalQuestions * 0.75);
                const passed = testScore >= passingScore;
                
                // Build conversation log
                let conversationLog = "=== VOID ESPORTS MOD TEST TRANSCRIPT ===\n";
                sessionTranscript.forEach((entry, idx) => {
                    conversationLog += `[${entry.timestamp}] ${entry.speaker}: ${entry.message}\n`;
                });
                conversationLog += "=====================================\n";
                
                // Show results screen
                const testCompleteScreen = document.getElementById('testCompleteScreen');
                if (testCompleteScreen) {
                    testCompleteScreen.classList.add('active');
                    
                    const testResultScore = document.getElementById('testResultScore');
                    const testResultTitle = document.getElementById('testResultTitle');
                    const testResultMessage = document.getElementById('testResultMessage');
                    const testResultIcon = document.getElementById('testResultIcon');
                    const submissionStatus = document.getElementById('submissionStatus');
                    
                    if (testResultScore) {
                        testResultScore.textContent = `Score: ${testScore}/${testTotalQuestions}`;
                    }
                    
                    if (testResultTitle) {
                        testResultTitle.textContent = passed ? "🎉 Test Passed!" : "❌ Test Failed";
                    }
                    
                    if (testResultMessage) {
                        testResultMessage.textContent = passed 
                            ? `Congratulations! You passed with a score of ${testScore}/${testTotalQuestions}. Minimum passing score is ${passingScore}.` 
                            : `You scored ${testScore}/${testTotalQuestions}. Minimum passing score is ${passingScore}.`;
                    }
                    
                    if (testResultIcon) {
                        if (passed) {
                            testResultIcon.className = "test-result-icon pass";
                            testResultIcon.innerHTML = '<i class="fas fa-trophy"></i>';
                        } else {
                            testResultIcon.className = "test-result-icon fail";
                            testResultIcon.innerHTML = '<i class="fas fa-times-circle"></i>';
                        }
                    }
                    
                    if (submissionStatus) {
                        submissionStatus.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting results...';
                        submissionStatus.className = "submission-status";
                    }
                    
                    // ===== ULTRA-RELIABLE SUBMISSION PROCESS =====
                    console.log("🔄 Starting multi-stage submission process...");
                    
                    // Prepare submission data
                    const submissionData = {
                        discordId: window.userDiscordId,
                        discordUsername: window.userDiscordUsername,
                        score: `${testScore}/${testTotalQuestions}`,
                        answers: conversationLog.substring(0, 10000), // Limit size
                        correctAnswers: testScore,
                        totalQuestions: testTotalQuestions,
                        passed: passed,
                        timestamp: new Date().toISOString()
                    };
                    
                    console.log("📦 Submission data prepared:", {
                        user: submissionData.discordUsername,
                        score: submissionData.score
                    });
                    
                    // Save locally first (always)
                    saveResultsLocally();
                    
                    // ===== STAGE 1: SIMPLE SUBMIT ENDPOINT =====
                    console.log("1️⃣ Stage 1: Trying /submit endpoint...");
                    let stage1Success = false;
                    
                    try {
                        const response1 = await fetchWithTimeout("https://mod-application-backend.onrender.com/submit", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "Accept": "application/json"
                            },
                            body: JSON.stringify(submissionData)
                        }, 10000);
                        
                        console.log("Stage 1 response status:", response1.status);
                        
                        if (response1.ok) {
                            const result = await response1.json();
                            console.log("✅ Stage 1 SUCCESS:", result);
                            stage1Success = true;
                            
                            if (submissionStatus) {
                                submissionStatus.innerHTML = '<i class="fas fa-check-circle"></i> Results submitted successfully!';
                                submissionStatus.className = "submission-status submission-success";
                            }
                            
                            // Redirect to success
                            setTimeout(() => {
                                window.location.href = `success.html?discord_username=${encodeURIComponent(window.userDiscordUsername)}&final_score=${testScore}/${testTotalQuestions}&pass_fail=${passed ? 'PASS' : 'FAIL'}&user_id=${window.userDiscordId}`;
                            }, 2000);
                            return;
                        } else {
                            console.log("❌ Stage 1 failed with status:", response1.status);
                        }
                    } catch (error1) {
                        console.log("❌ Stage 1 error:", error1.message);
                    }
                    
                    // ===== STAGE 2: LOG TEST ENDPOINT =====
                    console.log("2️⃣ Stage 2: Trying /log-test endpoint...");
                    
                    try {
                        const response2 = await fetchWithTimeout("https://mod-application-backend.onrender.com/log-test", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                action: "test_submission",
                                user: window.userDiscordUsername,
                                userId: window.userDiscordId,
                                score: `${testScore}/${testTotalQuestions}`,
                                timestamp: new Date().toISOString(),
                                passed: passed
                            })
                        }, 5000);
                        
                        console.log("Stage 2 response:", response2.status);
                        
                        if (response2.ok) {
                            console.log("✅ Stage 2 logged successfully");
                            
                            if (submissionStatus) {
                                submissionStatus.innerHTML = '<i class="fas fa-check-circle"></i> Results logged successfully!';
                                submissionStatus.className = "submission-status submission-success";
                            }
                            
                            setTimeout(() => {
                                window.location.href = `success.html?discord_username=${encodeURIComponent(window.userDiscordUsername)}&final_score=${testScore}/${testTotalQuestions}&pass_fail=${passed ? 'PASS' : 'FAIL'}`;
                            }, 2000);
                            return;
                        }
                    } catch (error2) {
                        console.log("❌ Stage 2 error:", error2.message);
                    }
                    
                    // ===== STAGE 3: DIRECT DISCORD WEBHOOK =====
                    console.log("3️⃣ Stage 3: Trying direct Discord webhook...");
                    
                    try {
                        await sendDirectToDiscord();
                        
                        if (submissionStatus) {
                            submissionStatus.innerHTML = '<i class="fas fa-check-circle"></i> Results sent to Discord!';
                            submissionStatus.className = "submission-status submission-success";
                        }
                        
                        setTimeout(() => {
                            window.location.href = `success.html?discord_username=${encodeURIComponent(window.userDiscordUsername)}&final_score=${testScore}/${testTotalQuestions}&pass_fail=${passed ? 'PASS' : 'FAIL'}`;
                        }, 2000);
                        return;
                    } catch (error3) {
                        console.log("❌ Stage 3 error:", error3.message);
                    }
                    
                    // ===== STAGE 4: LOCAL SAVED - SHOW MANUAL OPTION =====
                    console.log("💾 All stages failed, using local backup...");
                    
                    if (submissionStatus) {
                        submissionStatus.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Results saved locally. Please contact staff with your score.';
                        submissionStatus.className = "submission-status submission-error";
                    }
                    
                    // Show manual submission option
                    setTimeout(() => {
                        showManualSubmissionOption(testScore, testTotalQuestions);
                        
                        // Auto-redirect after 5 seconds anyway
                        setTimeout(() => {
                            window.location.href = `success.html?discord_username=${encodeURIComponent(window.userDiscordUsername)}&final_score=${testScore}/${testTotalQuestions}&pass_fail=${passed ? 'PASS' : 'FAIL'}`;
                        }, 5000);
                    }, 2000);
                }
            }, 1000);
        }, 1000);
    }
    
    function resetTest() {
        testActive = false;
        testCurrentQuestion = 0;
        testScore = 0;
        userAnswers = [];
        correctAnswers = [];
        sessionTranscript = [];
        usedQuestionIds.clear();
        
        const discordScoreValue = document.getElementById('discordScoreValue');
        const discordProgressFill = document.getElementById('discordProgressFill');
        
        if (discordScoreValue) discordScoreValue.textContent = "0";
        if (discordProgressFill) discordProgressFill.style.width = "0%";
        
        const messageInput = document.querySelector('.message-input');
        if (messageInput) {
            messageInput.value = '';
            messageInput.disabled = true;
        }
        const sendButton = document.querySelector('.message-input-send');
        if (sendButton) sendButton.disabled = true;
    }
    
    // ==================== EXPORT FUNCTIONS ====================
    
    // Switch channel function
    window.switchChannel = function(channelName) {
        console.log("Switching to channel:", channelName);
        const channelItems = document.querySelectorAll('.channel-item');
        channelItems.forEach(item => item.classList.remove('active'));
        
        const chatHeader = document.querySelector('.chat-header');
        const channelTitle = document.querySelector('.channel-title');
        
        if (channelTitle && chatHeader) {
            switch(channelName) {
                case 'mod-tickets':
                    channelTitle.textContent = '🎫・mod-tickets';
                    document.querySelector('.channel-topic').textContent = 'Test your moderator skills in simulated scenarios';
                    break;
                case 'roster-tickets':
                    channelTitle.textContent = '👥・roster-tickets';
                    document.querySelector('.channel-topic').textContent = 'Practice handling roster applications';
                    break;
                case 'rules':
                    channelTitle.textContent = '📜・rules';
                    document.querySelector('.channel-topic').textContent = 'Read the server rules and guidelines';
                    break;
            }
        }
        
        // Activate the clicked channel
        document.querySelector(`.channel-item[onclick*="${channelName}"]`)?.classList.add('active');
    }
    
    // Toggle score panel
    window.toggleScorePanel = function() {
        const testInfoPanel = document.querySelector('.test-info-panel');
        if (testInfoPanel) {
            testInfoPanel.style.display = testInfoPanel.style.display === 'none' ? 'flex' : 'none';
        }
    }
    
    // Toggle server dropdown
    window.toggleServerDropdown = function() {
        console.log("Server dropdown toggled");
    }
    
    // Exit test function
    window.exitTest = function() {
        const testPage = document.getElementById('testPage');
        const mainContainer = document.getElementById('mainContainer');
        
        if (testPage) testPage.style.display = 'none';
        if (mainContainer) mainContainer.style.display = 'block';
        resetTest();
    };
    
    // Export main functions
    window.initializeDiscordInterface = initializeDiscordInterface;
    window.startDiscordTest = startDiscordTest;
    window.resetTest = resetTest;
    
    // Initialize on load
    if (document.getElementById('testPage')) {
        setTimeout(initializeDiscordInterface, 1000);
    }
});
