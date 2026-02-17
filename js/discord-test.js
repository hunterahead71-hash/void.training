// Discord Test Interface Logic - SIMPLIFIED CONVERSATION LOGS
document.addEventListener('DOMContentLoaded', function() {
    console.log("🎮 Discord test.js loaded - Simplified conversation logs");
    
    // Test state
    let testCurrentQuestion = 0;
    let testScore = 0;
    let testActive = false;
    let testTotalQuestions = 8;
    let userAnswers = [];
    let correctAnswers = [];
    let testQuestions = [];
    let conversationLog = "";
    let questionsWithAnswers = [];
    let usedQuestionIds = new Set();
    
    // Ensure global variables
    window.userDiscordUsername = window.userDiscordUsername || 'User';
    window.userDiscordId = window.userDiscordId || '0000';
    
    // Enhanced test questions with realistic scenarios
    const allTestQuestions = [
        {
            id: 1,
            userMessage: "hey i wanna join void esports, what do i need to do?",
            user: "FortnitePlayer23",
            avatarColor: "#5865f2",
            correctKeywords: ["age", "how old", "roster", "channel", "requirement", "fit", "category", "hello", "hi", "help", "assist", "requirements", "first"],
            requiredMatches: 2,
            explanation: "Your response should ask for their age and direct them to #how-to-join-roster to read requirements. Include a professional greeting."
        },
        {
            id: 2,
            userMessage: "i want to join as a pro player, i have earnings",
            user: "CompPlayer99",
            avatarColor: "#ed4245",
            correctKeywords: ["tracker", "fortnite tracker", "stats", "ranking", "pr", "send", "trapped", "chief", "ping", "earnings", "verify", "proof", "power ranking"],
            requiredMatches: 2,
            explanation: "Ask for their Fortnite tracker link and earnings proof, then ping @trapped or @cheif for pro applications."
        },
        {
            id: 3,
            userMessage: "looking to join creative roster, i have clips",
            user: "CreativeBuilder",
            avatarColor: "#3ba55c",
            correctKeywords: ["clip", "video", "footage", "freebuilding", "send", "creativedepartment", "ping", "wait", "at least 2", "freebuild", "review", "creative"],
            requiredMatches: 2,
            explanation: "Ask for at least 2 clips of freebuilding and ping @creativedepartment. Specify clip requirements clearly."
        },
        {
            id: 4,
            userMessage: "can i join academy? i have 5k PR",
            user: "AcademyGrinder",
            avatarColor: "#f59e0b",
            correctKeywords: ["tracker", "fortnite tracker", "send", "verify", "username", "name change", "add void", "team.void", "proof", "academy", "requirements", "represent"],
            requiredMatches: 2,
            explanation: "Ask for Fortnite tracker verification, request username change to include 'Void', and require team.void proof."
        },
        {
            id: 5,
            userMessage: "im 11 is that old enough?",
            user: "YoungPlayer14",
            avatarColor: "#9146ff",
            correctKeywords: ["no", "nah", "ping", "minimum age", "13", "allowed", "yes", "verify", "sorry", "consent"],
            requiredMatches: 1,
            explanation: "Immediately blacklist the user for underage, ping a senior mod if you have doubt."
        },
        {
            id: 6,
            userMessage: "i wanna be a void grinder, what's required?",
            user: "GrinderAccount",
            avatarColor: "#1da1f2",
            correctKeywords: ["username", "discord name", "add void", "team.void", "proof", "change", "grinder", "represent", "name", "fortnite name"],
            requiredMatches: 2,
            explanation: "Ask them to change both Discord and Fortnite usernames to include 'Void' and require team.void proof."
        },
        {
            id: 7,
            userMessage: "this server is trash, gonna report it all",
            user: "ToxicUser123",
            avatarColor: "#ff0000",
            correctKeywords: ["alright", "sure", "ping", "okay", "ok", "ban", "immediately", "security", "unacceptable", "report", "admin", "warning"],
            requiredMatches: 1,
            explanation: "Its a threat but not that important, ask them to leave the server if they dont like it."
        },
        {
            id: 8,
            userMessage: "i make youtube videos, can i join content team?",
            user: "ContentCreatorYT",
            avatarColor: "#ff0000",
            correctKeywords: ["social", "social media", "links", "send", "contentdep", "ping", "wait", "followers", "content", "review", "youtube", "subscribers"],
            requiredMatches: 2,
            explanation: "Ask for YouTube/Twitch/TikTok links with subscriber counts, then ping @contentdep for review."
        },
        {
            id: 9,
            userMessage: "a guy from your server is scamming me",
            user: "Franks Kid",
            avatarColor: "#ff0000",
            correctKeywords: ["chief", "please", "ping", "threat", "proof", "ban", "immediately", "send", "will", "report", "warn", "warning"],
            requiredMatches: 1,
            explanation: "Ask them to send proof immediately, and ping a higher up."
        },
        {
            id: 10,
            userMessage: "i lost access to my discord account, how do i rejoin?",
            user: "HackedUser",
            avatarColor: "#f59e0b",
            correctKeywords: ["lost", "access", "discord", "account", "hacked", "rejoin", "new account", "reapply", "proof", "identity", "chief", "help"],
            requiredMatches: 2,
            explanation: "Advise them to create a new account. Ping an admin to verify their identity and provide a new invite."
        },
        {
            id: 11,
            userMessage: "do you have a mentoring program?",
            user: "NewPlayer",
            avatarColor: "#3ba55c",
            correctKeywords: ["mentor", "program", "coaching", "guide", "help", "learn", "improve", "experienced", "coach", "yes", "mentoring"],
            requiredMatches: 1,
            explanation: "Explain the mentoring program if available, or suggest they join Academy for guided improvement, let them know we provide free coaches."
        },
        {
            id: 12,
            userMessage: "whats the difference between void and other orgs?",
            user: "ComparisonShopper",
            avatarColor: "#3ba55c",
            correctKeywords: ["difference", "unique", "other orgs", "compare", "better", "why join", "benefits", "void vs", "community", "offers", "special"],
            requiredMatches: 1,
            explanation: "Highlight Void's unique selling points: coaching quality, community vibe, and opportunities for growth."
        },
        {
            id: 13,
            userMessage: "i have a 2k pr, is that enough for anything?",
            user: "LowPRPlayer",
            avatarColor: "#f59e0b",
            correctKeywords: ["pr", "low", "requirements", "academy", "grinder", "path", "improve", "coaching", "development", "start", "2k", "enough"],
            requiredMatches: 1,
            explanation: "Suggest the Grinder role or Academy pathway to improve. Mention coaching availability to help them grow."
        },
        {
            id: 14,
            userMessage: "i have a team, can we merge with void?",
            user: "TeamLeader",
            avatarColor: "#1da1f2",
            correctKeywords: ["team", "merge", "partnership", "clan", "join", "together", "please", "org", "void", "proposal", "management", "chief"],
            requiredMatches: 1,
            explanation: "This is a management proposal. Ping @chief and ask for details about the team (size, PR, etc.)."
        },
    ];
    
    // Format conversation log for Discord webhook - SIMPLIFIED
    function formatConversationForWebhook() {
        let log = "";
        
        questionsWithAnswers.forEach((qa, index) => {
            log += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
            log += `QUESTION ${index + 1}:\n`;
            log += `${qa.question}\n\n`;
            log += `ANSWER ${index + 1}:\n`;
            log += `${qa.answer}\n`;
            log += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
        });
        
        return log || "No questions answered";
    }
    
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
    
    // Initialize conversation log
    function initConversationLog() {
        conversationLog = `Test Started: ${new Date().toLocaleString()}\n`;
        conversationLog += `User: ${window.userDiscordUsername || 'Unknown'} (${window.userDiscordId || 'N/A'})\n`;
        conversationLog += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    }
    
    // Format questions with answers for submission
    function formatQuestionsWithAnswers() {
        return testQuestions.map((q, index) => ({
            question: `User (${q.user}): ${q.userMessage}`,
            answer: userAnswers[index] || 'No answer provided',
            correct: correctAnswers[index] || false,
            explanation: q.explanation,
            score: correctAnswers[index] ? 1 : 0
        }));
    }
    
    // Initialize interface
    function initializeDiscordInterface() {
        console.log("Initializing Discord interface...");
        
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
        
        const discordUsernameDisplay = document.getElementById('discordUsernameDisplay');
        const discordUserTag = document.getElementById('discordUserTag');
        const userAvatarInitialText = document.getElementById('userAvatarInitialText');
        
        if (discordUsernameDisplay) discordUsernameDisplay.textContent = window.userDiscordUsername;
        if (discordUserTag) discordUserTag.textContent = "#" + (window.userDiscordId.slice(-4) || "0000");
        if (userAvatarInitialText) userAvatarInitialText.textContent = window.userDiscordUsername.charAt(0).toUpperCase();
        
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
        questionsWithAnswers = [];
        
        initConversationLog();
        
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
        
        const messagesContainer = document.querySelector('.messages-container');
        if (messagesContainer) {
            messagesContainer.innerHTML = '';
            
            setTimeout(() => {
                addMessage("Void Bot", "Welcome to the Void Esports Moderator Certification Test.", "#5865f2", true);
                
                setTimeout(() => {
                    addMessage("Void Bot", `Hello ${window.userDiscordUsername}! You'll receive ${testTotalQuestions} scenarios.`, "#5865f2", true);
                    
                    setTimeout(() => {
                        addMessage("Void Bot", "Respond as you would as a real moderator. Good luck!", "#5865f2", true);
                        
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
        
        messageInput.value = '';
        messageInput.style.height = 'auto';
        if (sendButton) sendButton.disabled = true;
        
        const isCorrect = checkTestAnswer(userMessage);
        correctAnswers.push(isCorrect);
        
        if (messageInput) {
            messageInput.disabled = true;
            messageInput.placeholder = "Processing your answer...";
        }
        
        setTimeout(() => {
            testCurrentQuestion++;
            updateDiscordScore();
            
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
        }, 2000);
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
        let matchedKeywords = [];
        for (let keyword of question.correctKeywords) {
            if (userAnswerLower.includes(keyword.toLowerCase())) {
                matchCount++;
                matchedKeywords.push(keyword);
            }
        }
        
        const isCorrect = matchCount >= question.requiredMatches;
        console.log(`Answer check: ${matchCount} matches, required: ${question.requiredMatches}, correct: ${isCorrect}`);
        
        questionsWithAnswers.push({
            question: `User (${question.user}): ${question.userMessage}`,
            answer: userAnswer,
            correct: isCorrect,
            explanation: question.explanation,
            score: isCorrect ? 1 : 0,
            matchedKeywords: matchedKeywords,
            matchCount: matchCount,
            requiredMatches: question.requiredMatches
        });
        
        if (isCorrect) {
            testScore++;
            
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
        console.log("Ending test with simplified conversation logs...");
        testActive = false;
        
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
                
                // Create simplified conversation log
                const simpleConversationLog = formatConversationForWebhook();
                
                const submissionData = {
                    discordId: window.userDiscordId,
                    discordUsername: window.userDiscordUsername,
                    answers: simpleConversationLog,
                    score: `${testScore}/${testTotalQuestions}`,
                    totalQuestions: testTotalQuestions,
                    correctAnswers: testScore,
                    wrongAnswers: testTotalQuestions - testScore,
                    testResults: JSON.stringify({
                        score: testScore,
                        total: testTotalQuestions,
                        passed: passed,
                        percentage: Math.round((testScore/testTotalQuestions)*100),
                        date: new Date().toISOString()
                    }),
                    conversationLog: simpleConversationLog,
                    questionsWithAnswers: JSON.stringify(questionsWithAnswers)
                };
                
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
                            ? `Congratulations! You passed with ${testScore}/${testTotalQuestions}. Your application is now pending review by the admin team.` 
                            : `You scored ${testScore}/${testTotalQuestions}. Minimum passing score is ${passingScore}. You can retake the test after reviewing the training material.`;
                    }
                    if (testResultIcon) {
                        testResultIcon.className = passed ? "test-result-icon pass" : "test-result-icon fail";
                        testResultIcon.innerHTML = passed ? '<i class="fas fa-trophy"></i>' : '<i class="fas fa-times-circle"></i>';
                    }
                    
                    setTimeout(async () => {
                        if (submissionStatus) {
                            submissionStatus.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting results...';
                        }
                        
                        try {
                            console.log("Submitting data with simplified conversation logs...");
                            
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
                                if (submissionStatus) {
                                    submissionStatus.innerHTML = '<i class="fas fa-check-circle"></i> Results submitted successfully!';
                                    submissionStatus.className = "submission-status submission-success";
                                }
                                
                                setTimeout(() => {
                                    const successUrl = `success.html?discord_username=${encodeURIComponent(window.userDiscordUsername)}&final_score=${testScore}/${testTotalQuestions}&pass_fail=${passed ? 'PASS' : 'FAIL'}&test_date=${encodeURIComponent(new Date().toLocaleString())}&user_id=${window.userDiscordId}`;
                                    window.location.href = successUrl;
                                }, 2000);
                                
                            } else {
                                console.log("Trying simple endpoint...");
                                const simpleResponse = await fetch('https://mod-application-backend.onrender.com/api/submit', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Accept': 'application/json'
                                    },
                                    body: JSON.stringify(submissionData)
                                });
                                
                                const simpleResult = await simpleResponse.json();
                                console.log("Simple endpoint result:", simpleResult);
                                
                                if (submissionStatus) {
                                    submissionStatus.innerHTML = '<i class="fas fa-check-circle"></i> Results submitted!';
                                    submissionStatus.className = "submission-status submission-success";
                                    
                                    setTimeout(() => {
                                        const successUrl = `success.html?discord_username=${encodeURIComponent(window.userDiscordUsername)}&final_score=${testScore}/${testTotalQuestions}&pass_fail=${passed ? 'PASS' : 'FAIL'}`;
                                        window.location.href = successUrl;
                                    }, 2000);
                                }
                            }
                            
                        } catch (error) {
                            console.error("Submission error:", error);
                            
                            if (submissionStatus) {
                                submissionStatus.innerHTML = `<i class="fas fa-exclamation-triangle"></i> Network error. Your score: ${testScore}/${testTotalQuestions}`;
                                submissionStatus.className = "submission-status submission-error";
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
        questionsWithAnswers = [];
        conversationLog = "";
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
    
    if (document.getElementById('testPage')) {
        setTimeout(initializeDiscordInterface, 1000);
    }
});
