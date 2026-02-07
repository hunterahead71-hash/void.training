
// Discord Test Interface Logic - FIXED VERSION
document.addEventListener('DOMContentLoaded', function() {
    console.log("🎮 Discord test.js loaded - Fixed version");
    
    // Test state
    let testCurrentQuestion = 0;
    let testScore = 0;
    let testActive = false;
    let testTotalQuestions = 8;
    let userAnswers = [];
    let correctAnswers = [];
    let testQuestions = [];
    let sessionTranscript = [];
    let usedQuestionIds = new Set();
    
    // Ensure global variables
    window.userDiscordUsername = window.userDiscordUsername || 'User';
    window.userDiscordId = window.userDiscordId || '0000';
    
    // Enhanced test questions
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
        }
    ];
    
    // Get random questions
    function getRandomTestQuestions() {
        const available = allTestQuestions.filter(q => !usedQuestionIds.has(q.id));
        const shuffled = [...available].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 8);
        
        if (available.length < 8) {
            usedQuestionIds.clear();
            const allShuffled = [...allTestQuestions].sort(() => 0.5 - Math.random());
            const newSelected = allShuffled.slice(0, 8);
            newSelected.forEach(q => usedQuestionIds.add(q.id));
            return newSelected;
        }
        
        selected.forEach(q => usedQuestionIds.add(q.id));
        return selected;
    }
    
    // Initialize interface
    function initializeDiscordInterface() {
        console.log("Initializing Discord interface...");
        
        // Setup message input
        const messageInput = document.querySelector('.message-input');
        const sendButton = document.querySelector('.message-input-send');
        
        if (messageInput) {
            messageInput.addEventListener('input', function() {
                this.style.height = 'auto';
                this.style.height = Math.min(this.scrollHeight, 200) + 'px';
                if (sendButton) sendButton.disabled = this.value.trim() === '';
            });
            
            messageInput.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (sendButton && !sendButton.disabled && testActive) {
                        sendTestMessage();
                    }
                }
            });
        }
        
        if (sendButton) {
            sendButton.addEventListener('click', sendTestMessage);
        }
        
        // Update UI with Discord info
        const discordUsernameDisplay = document.getElementById('discordUsernameDisplay');
        const discordUserTag = document.getElementById('discordUserTag');
        const userAvatarInitialText = document.getElementById('userAvatarInitialText');
        
        if (discordUsernameDisplay) discordUsernameDisplay.textContent = window.userDiscordUsername;
        if (discordUserTag) discordUserTag.textContent = "#" + (window.userDiscordId.slice(-4) || "0000");
        if (userAvatarInitialText) userAvatarInitialText.textContent = window.userDiscordUsername.charAt(0).toUpperCase();
        
        // Auto-start test if user data exists
        if (window.userDiscordUsername && window.userDiscordUsername !== 'User') {
            console.log("Auto-starting test for:", window.userDiscordUsername);
            setTimeout(() => {
                startDiscordTest();
            }, 1500);
        }
    }
    
    // Start test
    function startDiscordTest() {
        console.log("🚀 STARTING DISCORD TEST");
        
        usedQuestionIds.clear();
        testQuestions = getRandomTestQuestions();
        testTotalQuestions = testQuestions.length;
        
        testActive = true;
        testCurrentQuestion = 0;
        testScore = 0;
        userAnswers = [];
        correctAnswers = [];
        sessionTranscript = [];
        
        // Enable input immediately
        const messageInput = document.querySelector('.message-input');
        const sendButton = document.querySelector('.message-input-send');
        
        if (messageInput) {
            messageInput.disabled = false;
            messageInput.value = '';
            messageInput.placeholder = "Type your response here...";
        }
        
        if (sendButton) {
            sendButton.disabled = true;
        }
        
        updateDiscordScore();
        
        // Clear messages and add welcome
        const messagesContainer = document.querySelector('.messages-container');
        if (messagesContainer) {
            messagesContainer.innerHTML = '';
            
            // Add welcome messages
            setTimeout(() => {
                addMessage("Void Bot", "Welcome to the Void Esports Moderator Certification Test.", "#5865f2", true);
                
                setTimeout(() => {
                    addMessage("Void Bot", `Hello ${window.userDiscordUsername}! You'll receive ${testTotalQuestions} scenarios.`, "#5865f2", true);
                    
                    setTimeout(() => {
                        addMessage("Void Bot", "Respond as you would as a real moderator. Good luck!", "#5865f2", true);
                        
                        // Start first question
                        setTimeout(() => {
                            showNextTestQuestion();
                        }, 1000);
                    }, 1500);
                }, 1500);
            }, 500);
        }
    }
    
    // Show next question
    function showNextTestQuestion() {
        console.log(`showNextTestQuestion called. Current: ${testCurrentQuestion}, Total: ${testTotalQuestions}`);
        
        if (testCurrentQuestion >= testTotalQuestions) {
            console.log("All questions completed, ending test");
            endTest();
            return;
        }
        
        setTimeout(() => {
            const question = testQuestions[testCurrentQuestion];
            console.log(`Question ${testCurrentQuestion + 1}: ${question.userMessage}`);
            addMessage(question.user, question.userMessage, question.avatarColor, false);
            
            // RE-ENABLE INPUT FOR NEW QUESTION - CRITICAL FIX
            const messageInput = document.querySelector('.message-input');
            const sendButton = document.querySelector('.message-input-send');
            
            if (messageInput) {
                messageInput.disabled = false;
                messageInput.value = '';
                messageInput.style.height = 'auto';
                setTimeout(() => {
                    messageInput.focus();
                }, 100);
            }
            
            if (sendButton) {
                sendButton.disabled = true;
            }
            
        }, 1500);
    }
    
    // Send message
    function sendTestMessage() {
        console.log("sendTestMessage called");
        
        const messageInput = document.querySelector('.message-input');
        const sendButton = document.querySelector('.message-input-send');
        
        if (!messageInput || !testActive) {
            console.log("Message input not found or test not active");
            return;
        }
        
        const userMessage = messageInput.value.trim();
        if (!userMessage) {
            console.log("Empty message");
            return;
        }
        
        console.log(`User answer: ${userMessage.substring(0, 50)}...`);
        
        addMessage("You", userMessage, "#7289da", false);
        userAnswers.push(userMessage);
        
        // Clear input but keep it enabled for feedback period
        messageInput.value = '';
        messageInput.style.height = 'auto';
        if (sendButton) sendButton.disabled = true;
        
        const isCorrect = checkTestAnswer(userMessage);
        correctAnswers.push(isCorrect);
        
        // TEMPORARILY disable input while showing feedback
        if (messageInput) {
            messageInput.disabled = true;
            messageInput.placeholder = "Processing your answer...";
        }
        
        // Wait for feedback, then move to next question
        setTimeout(() => {
            testCurrentQuestion++;
            
            // RE-ENABLE INPUT FOR NEXT QUESTION
            if (testCurrentQuestion < testTotalQuestions) {
                if (messageInput) {
                    messageInput.disabled = false;
                    messageInput.placeholder = "Type your response here...";
                }
                
                setTimeout(() => {
                    showNextTestQuestion();
                }, 1000);
            } else {
                endTest();
            }
        }, 2000); // Longer delay to read feedback
    }
    
    // Check answer
    function checkTestAnswer(userAnswer) {
        console.log("checkTestAnswer called");
        
        if (testCurrentQuestion >= testQuestions.length) {
            console.log("No question available");
            return false;
        }
        
        const question = testQuestions[testCurrentQuestion];
        const userAnswerLower = userAnswer.toLowerCase();
        
        let matchCount = 0;
        for (let keyword of question.correctKeywords) {
            if (userAnswerLower.includes(keyword.toLowerCase())) {
                matchCount++;
            }
        }
        
        const isCorrect = matchCount >= question.requiredMatches;
        console.log(`Answer check: ${matchCount} matches, required: ${question.requiredMatches}, correct: ${isCorrect}`);
        
        if (isCorrect) {
            testScore++;
            updateDiscordScore();
            
            // Show correct feedback
            setTimeout(() => {
                addMessage("Void Bot", `✅ Correct! ${question.explanation}`, "#5865f2", true);
            }, 500);
        } else {
            // Show incorrect feedback
            setTimeout(() => {
                addMessage("Void Bot", `❌ Not quite right. ${question.explanation}`, "#5865f2", true);
            }, 500);
        }
        
        return isCorrect;
    }
    
    // Update score display
    function updateDiscordScore() {
        const discordScoreValue = document.getElementById('discordScoreValue');
        const discordProgressFill = document.getElementById('discordProgressFill');
        
        if (discordScoreValue) discordScoreValue.textContent = testScore;
        
        const percentage = Math.round((testCurrentQuestion + 1) / testTotalQuestions * 100);
        if (discordProgressFill) {
            discordProgressFill.style.width = `${percentage}%`;
        }
    }
    
    // Add message to chat
    function addMessage(username, content, color, isBot = false) {
        const messagesContainer = document.querySelector('.messages-container');
        if (!messagesContainer) {
            console.log("Messages container not found!");
            return;
        }
        
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
    
    // End test
    async function endTest() {
        console.log("Ending test...");
        testActive = false;
        
        // Disable input
        const messageInput = document.querySelector('.message-input');
        const sendButton = document.querySelector('.message-input-send');
        
        if (messageInput) {
            messageInput.disabled = true;
            messageInput.value = '';
            messageInput.placeholder = "Test complete!";
        }
        
        if (sendButton) {
            sendButton.disabled = true;
        }
        
        setTimeout(() => {
            addMessage("Void Bot", "Test complete! Evaluating your responses...", "#5865f2", true);
            
            setTimeout(() => {
                const passingScore = Math.ceil(testTotalQuestions * 0.75);
                const passed = testScore >= passingScore;
                
                // Show results screen
                const testCompleteScreen = document.getElementById('testCompleteScreen');
                if (testCompleteScreen) {
                    testCompleteScreen.classList.add('active');
                    
                    const testResultScore = document.getElementById('testResultScore');
                    const testResultTitle = document.getElementById('testResultTitle');
                    const testResultMessage = document.getElementById('testResultMessage');
                    const testResultIcon = document.getElementById('testResultIcon');
                    const submissionStatus = document.getElementById('submissionStatus');
                    
                    if (testResultScore) testResultScore.textContent = `Score: ${testScore}/${testTotalQuestions}`;
                    if (testResultTitle) testResultTitle.textContent = passed ? "Test Passed!" : "Test Failed";
                    if (testResultMessage) {
                        testResultMessage.textContent = passed 
                            ? `Congratulations! You passed with ${testScore}/${testTotalQuestions}.` 
                            : `You scored ${testScore}/${testTotalQuestions}. Minimum passing score is ${passingScore}.`;
                    }
                    if (testResultIcon) {
                        testResultIcon.className = passed ? "test-result-icon pass" : "test-result-icon fail";
                        testResultIcon.innerHTML = passed ? '<i class="fas fa-trophy"></i>' : '<i class="fas fa-times-circle"></i>';
                    }
                    
                    // SUBMIT RESULTS
                    setTimeout(async () => {
                        if (submissionStatus) {
                            submissionStatus.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting results...';
                        }
                        
                        try {
                            // Build transcript
                            let conversationLog = `VOID ESPORTS MOD TEST - ${window.userDiscordUsername}\n`;
                            conversationLog += `Date: ${new Date().toLocaleString()}\n`;
                            conversationLog += `Score: ${testScore}/${testTotalQuestions}\n`;
                            conversationLog += `Status: ${passed ? 'PASS' : 'FAIL'}\n\n`;
                            conversationLog += "Questions answered correctly: " + testScore + "/" + testTotalQuestions + "\n";
                            
                            // Prepare data
                            const submissionData = {
                                discordId: window.userDiscordId,
                                discordUsername: window.userDiscordUsername,
                                answers: conversationLog,
                                score: `${testScore}/${testTotalQuestions}`,
                                totalQuestions: testTotalQuestions,
                                correctAnswers: testScore,
                                wrongAnswers: testTotalQuestions - testScore,
                                testResults: JSON.stringify({
                                    score: testScore,
                                    total: testTotalQuestions,
                                    passed: passed,
                                    date: new Date().toISOString(),
                                    userAnswers: userAnswers
                                })
                            };
                            
                            console.log("Submitting data...");
                            
                            // Use the simple endpoint (more reliable)
                            const response = await fetch('https://mod-application-backend.onrender.com/api/submit', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Accept': 'application/json'
                                },
                                body: JSON.stringify(submissionData)
                            });
                            
                            const result = await response.json();
                            console.log("Submission result:", result);
                            
                            if (response.ok && result.success) {
                                // SUCCESS
                                if (submissionStatus) {
                                    submissionStatus.innerHTML = '<i class="fas fa-check-circle"></i> Results submitted to Discord & Admin Panel!';
                                    submissionStatus.className = "submission-status submission-success";
                                    
                                    // Add admin panel link
                                    const adminLink = document.createElement('div');
                                    adminLink.style.marginTop = '10px';
                                    adminLink.style.fontSize = '14px';
                                    adminLink.innerHTML = `<a href="https://mod-application-backend.onrender.com/admin" target="_blank" style="color: #00ffea; text-decoration: underline;">
                                        <i class="fas fa-external-link-alt"></i> View in Admin Panel
                                    </a>`;
                                    submissionStatus.appendChild(adminLink);
                                }
                                
                                // Redirect to success page after delay
                                setTimeout(() => {
                                    const successUrl = `success.html?discord_username=${encodeURIComponent(window.userDiscordUsername)}&final_score=${testScore}/${testTotalQuestions}&pass_fail=${passed ? 'PASS' : 'FAIL'}&test_date=${encodeURIComponent(new Date().toLocaleString())}&user_id=${window.userDiscordId}`;
                                    window.location.href = successUrl;
                                }, 4000);
                                
                            } else {
                                // Fallback to ultimate endpoint
                                console.log("Trying ultimate endpoint...");
                                const ultimateResponse = await fetch('https://mod-application-backend.onrender.com/submit-test-results', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Accept': 'application/json'
                                    },
                                    body: JSON.stringify(submissionData)
                                });
                                
                                const ultimateResult = await ultimateResponse.json();
                                console.log("Ultimate endpoint result:", ultimateResult);
                                
                                if (submissionStatus) {
                                    submissionStatus.innerHTML = '<i class="fas fa-check-circle"></i> Results submitted!';
                                    submissionStatus.className = "submission-status submission-success";
                                    
                                    setTimeout(() => {
                                        const successUrl = `success.html?discord_username=${encodeURIComponent(window.userDiscordUsername)}&final_score=${testScore}/${testTotalQuestions}&pass_fail=${passed ? 'PASS' : 'FAIL'}&test_date=${encodeURIComponent(new Date().toLocaleString())}&user_id=${window.userDiscordId}`;
                                        window.location.href = successUrl;
                                    }, 3000);
                                }
                            }
                            
                        } catch (error) {
                            console.error("Submission error:", error);
                            
                            if (submissionStatus) {
                                submissionStatus.innerHTML = `<i class="fas fa-exclamation-triangle"></i> Network error. Your score: ${testScore}/${testTotalQuestions}`;
                                submissionStatus.className = "submission-status submission-error";
                                
                                // Show manual option
                                const manualDiv = document.createElement('div');
                                manualDiv.style.marginTop = '10px';
                                manualDiv.innerHTML = `
                                    <p style="font-size: 14px; margin: 5px 0;">Please contact staff with:</p>
                                    <p style="background: rgba(0,0,0,0.3); padding: 10px; border-radius: 5px; font-family: monospace;">
                                        Username: ${window.userDiscordUsername}<br>
                                        Score: ${testScore}/${testTotalQuestions}<br>
                                        ID: ${window.userDiscordId}
                                    </p>
                                `;
                                submissionStatus.appendChild(manualDiv);
                            }
                        }
                    }, 1000);
                }
            }, 1500);
        }, 1000);
    }
    
    // Reset function
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
    
    // Export functions
    window.initializeDiscordInterface = initializeDiscordInterface;
    window.startDiscordTest = startDiscordTest;
    window.resetTest = resetTest;
    
    // Initialize when page is ready
    if (document.getElementById('testPage')) {
        setTimeout(initializeDiscordInterface, 1000);
    }
});
