// Discord Test Interface Logic (PC) - FIXED VERSION
document.addEventListener('DOMContentLoaded', function() {
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
    let usedQuestionIds = new Set(); // Track used questions to prevent duplicates
    
    // Test questions pool - FIXED: Removed duplicates and enhanced questions
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
        }
    ];
    
    // Get random test questions WITHOUT duplicates
    function getRandomTestQuestions() {
        const availableQuestions = allTestQuestions.filter(q => !usedQuestionIds.has(q.id));
        const shuffled = [...availableQuestions].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 8);
        
        // Reset used IDs if we've used all questions
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
        
        if (window.userDiscordUsername) {
            if (discordUsernameDisplay) discordUsernameDisplay.textContent = window.userDiscordUsername;
            if (discordUserTag) discordUserTag.textContent = "#" + (window.userDiscordId.slice(-4) || "0000");
            if (userAvatarInitial) userAvatarInitial.textContent = window.userDiscordUsername.charAt(0).toUpperCase();
        }
        
        // Fix font issues for icons
        const style = document.createElement('style');
        style.textContent = `
            .test-page i,
            .test-page .fas,
            .test-page .fab,
            .test-page .fa {
                font-family: 'Font Awesome 6 Free', 'Font Awesome 6 Brands', 'FontAwesome' !important;
            }
            .user-controls .control-btn i,
            .chat-controls .header-btn i {
                font-family: 'Font Awesome 6 Free', 'FontAwesome' !important;
            }
        `;
        document.head.appendChild(style);
        
        // Start test automatically if we have user data
        if (window.userDiscordUsername && window.userDiscordUsername !== 'User') {
            console.log("Auto-starting test for:", window.userDiscordUsername);
            setTimeout(() => {
                startDiscordTest();
            }, 1000);
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
                        messageText.appendChild(badge);
                    }
                }
            }
            
            // Show correct feedback
            addMessage("Void Bot", `✅ Correct! ${question.explanation}`, "#5865f2", true);
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
                        messageText.appendChild(badge);
                    }
                }
            }
            
            // Show incorrect feedback
            addMessage("Void Bot", `❌ Not quite right. ${question.explanation}`, "#5865f2", true);
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
        console.log("Starting Discord test...");
        
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
            addMessage("Void Bot", `Welcome to the Void Esports Moderator Certification Test, ${window.userDiscordUsername}! You'll be presented with ${testTotalQuestions} simulated scenarios. Respond as you would as a moderator. Good luck!`, "#5865f2", true);
            
            // Start question sequence
            setTimeout(() => {
                showNextTestQuestion();
            }, 2000);
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
    
    // End test (PC)
    async function endTest() {
        testActive = false;
        addToTranscript("System", "Test session ended at " + new Date().toLocaleString());
        
        setTimeout(() => {
            addMessage("Void Bot", "Test complete! Your responses have been evaluated.", "#5865f2", true);
            
            setTimeout(() => {
                const passingScore = Math.ceil(testTotalQuestions * 0.75); // 75% to pass
                const passed = testScore >= passingScore;
                
                // Build conversation log
                let conversationLog = "";
                sessionTranscript.forEach((entry, idx) => {
                    conversationLog += `[${entry.timestamp}] ${entry.speaker}: ${entry.message}\n`;
                });
                
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
                    
                    // Submit results
                    setTimeout(async () => {
                        try {
                            if (submissionStatus) {
                                submissionStatus.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting results...';
                                submissionStatus.className = "submission-status";
                            }
                            
                            // Prepare application data
                            const applicationData = {
                                answers: conversationLog,
                                score: `${testScore}/${testTotalQuestions}`,
                                discordUsername: window.userDiscordUsername,
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
                                    }))
                                })
                            };
                            
                            console.log("Submitting application data:", applicationData);
                            
                            // Send to backend API
                            const backendResponse = await fetch("https://mod-application-backend.onrender.com/apply", {
                                method: "POST",
                                credentials: "include",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify(applicationData)
                            });
                            
                            console.log("Backend response status:", backendResponse.status);
                            
                            if (backendResponse.ok) {
                                const backendResult = await backendResponse.json();
                                console.log("Backend result:", backendResult);
                                
                                if (submissionStatus) {
                                    submissionStatus.innerHTML = '<i class="fas fa-check-circle"></i> Results submitted successfully!';
                                    submissionStatus.className = "submission-status submission-success";
                                }
                                
                                // Redirect to success page after 3 seconds
                                setTimeout(() => {
                                    const successUrl = `success.html?discord_username=${encodeURIComponent(window.userDiscordUsername)}&final_score=${testScore}/${testTotalQuestions}&pass_fail=${passed ? 'PASS' : 'FAIL'}&test_date=${encodeURIComponent(new Date().toLocaleString())}&user_id=${window.userDiscordId}`;
                                    console.log("Redirecting to:", successUrl);
                                    window.location.href = successUrl;
                                }, 3000);
                                
                            } else {
                                const errorText = await backendResponse.text();
                                console.error("Backend submission failed:", errorText);
                                throw new Error(`Backend submission failed: ${backendResponse.status} ${errorText}`);
                            }
                        } catch (error) {
                            console.error('Submission error:', error);
                            
                            if (submissionStatus) {
                                submissionStatus.innerHTML = `<i class="fas fa-exclamation-triangle"></i> Submission error: ${error.message}. Please contact staff.`;
                                submissionStatus.className = "submission-status submission-error";
                            }
                            
                            // Show retry button
                            const testResultButtons = document.querySelector('.test-result-buttons');
                            if (testResultButtons) {
                                const retryBtn = document.createElement('button');
                                retryBtn.className = 'test-result-btn primary';
                                retryBtn.style.marginTop = '10px';
                                retryBtn.innerHTML = '<i class="fas fa-redo"></i> Retry Submission';
                                retryBtn.onclick = async () => {
                                    retryBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Retrying...';
                                    retryBtn.disabled = true;
                                    await endTest(); // Recursively call endTest to retry
                                };
                                testResultButtons.appendChild(retryBtn);
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
    
    // Export functions to window
    window.initializeDiscordInterface = initializeDiscordInterface;
    window.startDiscordTest = startDiscordTest;
    window.resetTest = resetTest;
    
    // Initialize on load
    setTimeout(initializeDiscordInterface, 1000);
});
