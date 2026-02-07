
// Discord Test Interface Logic - ULTIMATE VERSION
document.addEventListener('DOMContentLoaded', function() {
    console.log("🎮 Discord test.js loaded - Ultimate version");
    
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
                    if (sendButton && !sendButton.disabled) sendTestMessage();
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
        
        // Clear messages and add welcome
        const messagesContainer = document.querySelector('.messages-container');
        if (messagesContainer) {
            messagesContainer.innerHTML = '';
            
            // Add welcome messages
            setTimeout(() => {
                addMessage("Void Bot", "Welcome to the Void Esports Moderator Certification Test. This is a simulated Discord environment.", "#5865f2", true);
                
                setTimeout(() => {
                    addMessage("Void Bot", `Hello ${window.userDiscordUsername}! You'll receive ${testTotalQuestions} scenarios. Respond as you would as a real moderator.`, "#5865f2", true);
                    
                    setTimeout(() => {
                        addMessage("Void Bot", "Good luck! The test begins now...", "#5865f2", true);
                        
                        // Start first question
                        setTimeout(() => {
                            showNextTestQuestion();
                        }, 1000);
                    }, 1500);
                }, 1500);
            }, 500);
        }
        
        updateDiscordScore();
        
        // Enable input
        const messageInput = document.querySelector('.message-input');
        if (messageInput) {
            messageInput.disabled = false;
            messageInput.focus();
        }
    }
    
    // Show next question
    function showNextTestQuestion() {
        if (testCurrentQuestion >= testTotalQuestions) {
            endTest();
            return;
        }
        
        setTimeout(() => {
            const question = testQuestions[testCurrentQuestion];
            console.log(`Question ${testCurrentQuestion + 1}: ${question.userMessage}`);
            addMessage(question.user, question.userMessage, question.avatarColor, false);
        }, 1000);
    }
    
    // Send message
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
    
    // Check answer
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
            
            // Show correct badge
            setTimeout(() => {
                addMessage("Void Bot", `✅ Correct! ${question.explanation}`, "#5865f2", true);
            }, 500);
        } else {
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
        
        const percentage = Math.round((testCurrentQuestion / testTotalQuestions) * 100);
        if (discordProgressFill) {
            discordProgressFill.style.width = `${percentage}%`;
        }
    }
    
    // Add message to chat
    function addMessage(username, content, color, isBot = false) {
        const messagesContainer = document.querySelector('.messages-container');
        if (!messagesContainer) return;
        
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
    
    // End test - ULTIMATE SUBMISSION
    async function endTest() {
        testActive = false;
        
        setTimeout(() => {
            addMessage("Void Bot", "Test complete! Evaluating your responses...", "#5865f2", true);
            
            setTimeout(() => {
                const passingScore = Math.ceil(testTotalQuestions * 0.75);
                const passed = testScore >= passingScore;
                
                // Build transcript
                let conversationLog = `VOID ESPORTS MOD TEST - ${window.userDiscordUsername}\n`;
                conversationLog += `Date: ${new Date().toLocaleString()}\n`;
                conversationLog += `Score: ${testScore}/${testTotalQuestions}\n`;
                conversationLog += `Status: ${passed ? 'PASS' : 'FAIL'}\n\n`;
                conversationLog += "Test Transcript:\n";
                
                // Simple transcript (in real app, you'd log actual conversation)
                conversationLog += "User completed 8 scenario questions.\n";
                conversationLog += `Final score: ${testScore}/${testTotalQuestions}\n`;
                
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
                    
                    // SUBMIT RESULTS - ULTIMATE METHOD
                    setTimeout(async () => {
                        if (submissionStatus) {
                            submissionStatus.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting results...';
                        }
                        
                        try {
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
                                    date: new Date().toISOString()
                                })
                            };
                            
                            console.log("Submitting data:", submissionData);
                            
                            // TRY ULTIMATE ENDPOINT FIRST
                            const response = await fetch('https://mod-application-backend.onrender.com/submit-test-results', {
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
                                }
                                
                                // Show admin panel link
                                const adminLink = document.createElement('div');
                                adminLink.style.marginTop = '20px';
                                adminLink.innerHTML = `<a href="https://mod-application-backend.onrender.com/admin" target="_blank" style="color: #00ffea; text-decoration: none;">
                                    <i class="fas fa-external-link-alt"></i> View in Admin Panel
                                </a>`;
                                if (submissionStatus) submissionStatus.appendChild(adminLink);
                                
                                // Redirect to success page
                                setTimeout(() => {
                                    const successUrl = `success.html?discord_username=${encodeURIComponent(window.userDiscordUsername)}&final_score=${testScore}/${testTotalQuestions}&pass_fail=${passed ? 'PASS' : 'FAIL'}&test_date=${encodeURIComponent(new Date().toLocaleString())}&user_id=${window.userDiscordId}`;
                                    window.location.href = successUrl;
                                }, 3000);
                                
                            } else {
                                // Try simple endpoint as backup
                                console.log("Trying simple endpoint...");
                                const simpleResponse = await fetch('https://mod-application-backend.onrender.com/api/submit', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Accept': 'application/json'
                                    },
                                    body: JSON.stringify({
                                        discordId: window.userDiscordId,
                                        discordUsername: window.userDiscordUsername,
                                        score: `${testScore}/${testTotalQuestions}`,
                                        answers: conversationLog.substring(0, 1000)
                                    })
                                });
                                
                                const simpleResult = await simpleResponse.json();
                                console.log("Simple submission result:", simpleResult);
                                
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
                                submissionStatus.innerHTML = `<i class="fas fa-exclamation-triangle"></i> Submission error. Please contact staff with your score: ${testScore}/${testTotalQuestions}`;
                                submissionStatus.className = "submission-status submission-error";
                            }
                        }
                    }, 1000);
                }
            }, 1500);
        }, 1000);
    }
    
    // Export functions
    window.initializeDiscordInterface = initializeDiscordInterface;
    window.startDiscordTest = startDiscordTest;
    
    // Initialize when page is ready
    if (document.getElementById('testPage')) {
        setTimeout(initializeDiscordInterface, 1000);
    }
});
