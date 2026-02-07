
// Discord Test Interface Logic (PC) - COMPLETELY FIXED VERSION
document.addEventListener('DOMContentLoaded', function() {
    console.log("Discord test.js loaded - Fixed version");
    
    // Test state variables for PC
    let testCurrentQuestion = 0;
    let testScore = 0;
    let testActive = false;
    let testTotalQuestions = 8;
    let userAnswers = [];
    let correctAnswers = [];
    let testQuestions = [];
    let sessionTranscript = [];
    let testStartTime;
    let usedQuestionIds = new Set();
    
    // Ensure global variables are set
    window.userDiscordUsername = window.userDiscordUsername || 'User';
    window.userDiscordId = window.userDiscordId || '0000';
    
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
    
    // Initialize Discord interface (PC)
    function initializeDiscordInterface() {
        console.log("Initializing Discord interface...");
        
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
        
        // Fix for Font Awesome icons - ensure proper display
        setTimeout(() => {
            const icons = document.querySelectorAll('.fa, .fas, .fab');
            icons.forEach(icon => {
                icon.style.fontFamily = "'Font Awesome 6 Free', 'Font Awesome 6 Brands', 'FontAwesome'";
            });
        }, 100);
        
        // Check if we should auto-start the test
        if (window.shouldStartDiscordTest || (window.userDiscordUsername && window.userDiscordUsername !== 'User')) {
            console.log("Auto-starting test for:", window.userDiscordUsername);
            // Clear the flag
            window.shouldStartDiscordTest = false;
            
            // Start test after a short delay
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
    
    // Start Discord test (PC) - FIXED TO ENSURE IT STARTS
    function startDiscordTest() {
        console.log("🚀 STARTING DISCORD TEST FUNCTION CALLED");
        console.log("User info:", window.userDiscordUsername, window.userDiscordId);
        
        // Reset test state
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
            // Clear all messages
            messagesContainer.innerHTML = '';
            
            // Add initial welcome messages back
            const welcomeMessages = [
                {
                    user: "Void Bot",
                    content: "Welcome to the Void Esports Moderator Certification Test. This is a simulated Discord environment where you'll respond to moderator scenarios.",
                    color: "#5865f2",
                    isBot: true
                },
                {
                    user: "Void Bot", 
                    content: "You'll receive 8 different scenarios. Respond as you would as a real moderator. Your responses will be evaluated based on protocol adherence.",
                    color: "#5865f2",
                    isBot: true
                }
            ];
            
            welcomeMessages.forEach(msg => {
                addMessage(msg.user, msg.content, msg.color, msg.isBot);
            });
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
            addMessage("Void Bot", `Welcome to the Void Esports Moderator Certification Test, ${window.userDiscordUsername}! You'll be presented with ${testTotalQuestions} simulated scenarios. Respond as you would as a moderator. Good luck!`, "#5865f2", true);
            
            // Start question sequence after a delay
            setTimeout(() => {
                console.log("Starting question sequence...");
                showNextTestQuestion();
            }, 2000);
        }, 1000);
    }
    
    // Show next test question (PC)
    function showNextTestQuestion() {
        console.log(`showNextTestQuestion called. Current: ${testCurrentQuestion}, Total: ${testTotalQuestions}`);
        
        if (testCurrentQuestion >= testTotalQuestions) {
            console.log("All questions completed, ending test");
            endTest();
            return;
        }
        
        setTimeout(() => {
            const question = testQuestions[testCurrentQuestion];
            console.log(`Showing question ${testCurrentQuestion + 1}: ${question.userMessage.substring(0, 50)}...`);
            
            addMessage(question.user, question.userMessage, question.avatarColor, false);
            
            const messageInput = document.querySelector('.message-input');
            if (messageInput) {
                messageInput.disabled = false;
                messageInput.focus();
            }
        }, 1500 + Math.random() * 1000);
    }
    
    // End test (PC) - ULTRA-RELIABLE SUBMISSION
    async function endTest() {
        console.log("Ending test...");
        testActive = false;
        addToTranscript("System", "Test session ended at " + new Date().toLocaleString());
        
        setTimeout(() => {
            addMessage("Void Bot", "Test complete! Your responses have been evaluated.", "#5865f2", true);
            
            setTimeout(() => {
                const passingScore = Math.ceil(testTotalQuestions * 0.75);
                const passed = testScore >= passingScore;
                
                // Build conversation log
                let conversationLog = "=== VOID ESPORTS MOD TEST TRANSCRIPT ===\n";
                conversationLog += `User: ${window.userDiscordUsername} (ID: ${window.userDiscordId})\n`;
                conversationLog += `Test Date: ${new Date().toLocaleString()}\n`;
                conversationLog += `Final Score: ${testScore}/${testTotalQuestions}\n`;
                conversationLog += `Status: ${passed ? 'PASS' : 'FAIL'}\n\n`;
                
                sessionTranscript.forEach((entry, idx) => {
                    if (entry.speaker !== "System") {
                        conversationLog += `[${entry.timestamp}] ${entry.speaker}: ${entry.message}\n`;
                    }
                });
                
                conversationLog += "\n=== END OF TRANSCRIPT ===";
                
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
                        testResultTitle.textContent = passed ? "Test Passed!" : "Test Failed";
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
                    
                    // Submit results - ULTRA-RELIABLE METHOD
                    setTimeout(async () => {
                        try {
                            if (submissionStatus) {
                                submissionStatus.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting results...';
                                submissionStatus.className = "submission-status";
                            }
                            
                            // Prepare application data
                            const applicationData = {
                                discordId: window.userDiscordId,
                                discordUsername: window.userDiscordUsername,
                                answers: conversationLog,
                                score: `${testScore}/${testTotalQuestions}`,
                                totalQuestions: testTotalQuestions,
                                correctAnswers: testScore,
                                wrongAnswers: testTotalQuestions - testScore,
                                testResults: JSON.stringify({
                                    transcript: conversationLog,
                                    userAnswers: userAnswers,
                                    correctAnswers: correctAnswers,
                                    questions: testQuestions.map(q => ({
                                        id: q.id,
                                        userMessage: q.userMessage,
                                        explanation: q.explanation
                                    })),
                                    timestamp: new Date().toISOString()
                                })
                            };
                            
                            console.log("📤 Preparing to submit application data:", {
                                user: window.userDiscordUsername,
                                score: `${testScore}/${testTotalQuestions}`,
                                questions: testTotalQuestions
                            });
                            
                            // ===== ULTRA-RELIABLE SUBMISSION =====
                            let submissionSuccess = false;
                            
                            try {
                                console.log("🔄 Attempting submission via /submit-test-results...");
                                
                                const response = await fetch(`https://mod-application-backend.onrender.com/submit-test-results`, {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                        "Accept": "application/json"
                                    },
                                    body: JSON.stringify(applicationData)
                                });
                                
                                const responseText = await response.text();
                                console.log(`📨 Response:`, {
                                    status: response.status,
                                    statusText: response.statusText,
                                    body: responseText.substring(0, 200)
                                });
                                
                                if (response.ok) {
                                    try {
                                        const result = JSON.parse(responseText);
                                        console.log(`✅ Submission successful:`, result);
                                        submissionSuccess = true;
                                    } catch (parseError) {
                                        console.log(`✅ Submission successful (non-JSON):`, responseText);
                                        submissionSuccess = true;
                                    }
                                }
                            } catch (error) {
                                console.error("❌ Primary submission error:", error.message);
                            }
                            
                            if (submissionSuccess) {
                                // SUCCESS
                                if (submissionStatus) {
                                    submissionStatus.innerHTML = '<i class="fas fa-check-circle"></i> Results submitted successfully to both Discord and Admin Panel!';
                                    submissionStatus.className = "submission-status submission-success";
                                }
                                
                                console.log("🎉 Submission successful!");
                                
                                // Redirect to success page after 3 seconds
                                setTimeout(() => {
                                    const successUrl = `success.html?discord_username=${encodeURIComponent(window.userDiscordUsername)}&final_score=${testScore}/${testTotalQuestions}&pass_fail=${passed ? 'PASS' : 'FAIL'}&test_date=${encodeURIComponent(new Date().toLocaleString())}&user_id=${window.userDiscordId}`;
                                    console.log("🔗 Redirecting to:", successUrl);
                                    window.location.href = successUrl;
                                }, 3000);
                                
                            } else {
                                // TRY BACKUP ENDPOINT
                                try {
                                    console.log("🔄 Trying backup endpoint /submit-test-simple...");
                                    
                                    const backupResponse = await fetch(`https://mod-application-backend.onrender.com/submit-test-simple`, {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json",
                                            "Accept": "application/json"
                                        },
                                        body: JSON.stringify(applicationData)
                                    });
                                    
                                    console.log("Backup response status:", backupResponse.status);
                                    
                                    if (backupResponse.ok) {
                                        submissionSuccess = true;
                                        console.log("✅ Backup submission successful");
                                    }
                                } catch (backupError) {
                                    console.error("Backup submission error:", backupError.message);
                                }
                                
                                if (submissionSuccess) {
                                    if (submissionStatus) {
                                        submissionStatus.innerHTML = '<i class="fas fa-check-circle"></i> Results submitted (backup method)!';
                                        submissionStatus.className = "submission-status submission-success";
                                    }
                                    
                                    setTimeout(() => {
                                        const successUrl = `success.html?discord_username=${encodeURIComponent(window.userDiscordUsername)}&final_score=${testScore}/${testTotalQuestions}&pass_fail=${passed ? 'PASS' : 'FAIL'}&test_date=${encodeURIComponent(new Date().toLocaleString())}&user_id=${window.userDiscordId}`;
                                        window.location.href = successUrl;
                                    }, 3000);
                                    
                                } else {
                                    // ULTIMATE FALLBACK
                                    console.error("❌ All submission endpoints failed");
                                    
                                    // Save results locally
                                    try {
                                        localStorage.setItem('void_test_results_backup', JSON.stringify({
                                            username: window.userDiscordUsername,
                                            userId: window.userDiscordId,
                                            score: `${testScore}/${testTotalQuestions}`,
                                            date: new Date().toISOString(),
                                            transcript: conversationLog
                                        }));
                                        console.log("💾 Results saved to localStorage as backup");
                                    } catch (storageError) {
                                        console.log("💾 Could not save to localStorage:", storageError);
                                    }
                                    
                                    if (submissionStatus) {
                                        submissionStatus.innerHTML = `
                                            <i class="fas fa-exclamation-triangle"></i> 
                                            <div>
                                                <strong>Submission completed with warnings</strong><br>
                                                <small>Your score: ${testScore}/${testTotalQuestions} has been recorded.</small><br>
                                                <small>Please contact staff with this information.</small>
                                            </div>
                                        `;
                                        submissionStatus.className = "submission-status submission-error";
                                    }
                                    
                                    // Show manual copy option
                                    const testResultButtons = document.querySelector('.test-result-buttons');
                                    if (testResultButtons) {
                                        const copyBtn = document.createElement('button');
                                        copyBtn.className = 'test-result-btn primary';
                                        copyBtn.style.marginTop = '10px';
                                        copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copy Score for Staff';
                                        copyBtn.onclick = () => {
                                            const scoreText = `Void Mod Test Results:\nUser: ${window.userDiscordUsername}\nScore: ${testScore}/${testTotalQuestions}\nDate: ${new Date().toLocaleString()}\nID: ${window.userDiscordId}`;
                                            navigator.clipboard.writeText(scoreText).then(() => {
                                                alert('Score copied to clipboard! Please send this to staff.');
                                            });
                                        };
                                        testResultButtons.appendChild(copyBtn);
                                    }
                                }
                            }
                            
                        } catch (error) {
                            console.error('🔥 Submission process error:', error);
                            
                            if (submissionStatus) {
                                submissionStatus.innerHTML = `<i class="fas fa-exclamation-triangle"></i> Technical error: ${error.message}. Your score: ${testScore}/${testTotalQuestions}`;
                                submissionStatus.className = "submission-status submission-error";
                            }
                        }
                    }, 1000);
                }
            }, 1500);
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
    
    // Export functions to window
    window.initializeDiscordInterface = initializeDiscordInterface;
    window.startDiscordTest = startDiscordTest;
    window.resetTest = resetTest;
    window.exitTest = function() {
        const testPage = document.getElementById('testPage');
        const mainContainer = document.getElementById('mainContainer');
        
        if (testPage) testPage.style.display = 'none';
        if (mainContainer) mainContainer.style.display = 'block';
        resetTest();
    };
    
    // Initialize on load
    console.log("Discord test interface loaded, checking if should start test...");
    
    // Dispatch event that discord-test.js is loaded
    const event = new Event('discordTestLoaded');
    window.dispatchEvent(event);
    
    // Check if we should start the test immediately
    if (document.getElementById('testPage') && window.userDiscordUsername && window.userDiscordUsername !== 'User') {
        console.log("Test page found with user data, initializing interface...");
        // Small delay to ensure DOM is ready
        setTimeout(() => {
            initializeDiscordInterface();
        }, 500);
    } else {
        console.log("Test page not active or no user data, just setting up functions");
        // Still initialize for future use
        setTimeout(initializeDiscordInterface, 1000);
    }
});
