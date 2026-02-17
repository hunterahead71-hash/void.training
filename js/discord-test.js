// Discord Test Interface Logic - ENHANCED WITH CONVERSATION LOGGING
document.addEventListener('DOMContentLoaded', function() {
    console.log("🎮 Discord test.js loaded - Enhanced with conversation logs");
    
    // Test state
    let testCurrentQuestion = 0;
    let testScore = 0;
    let testActive = false;
    let testTotalQuestions = 8;
    let userAnswers = [];
    let correctAnswers = [];
    let testQuestions = [];
    let sessionTranscript = [];
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
            userMessage: "im 14 is that old enough?",
            user: "YoungPlayer14",
            avatarColor: "#9146ff",
            correctKeywords: ["chief", "trapped", "ping", "minimum age", "13", "allowed", "yes", "verify", "parental", "consent"],
            requiredMatches: 2,
            explanation: "14 is acceptable. Ask for parental consent if available, then proceed with normal application process."
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
            correctKeywords: ["chief", "trapped", "ping", "threat", "dangerous", "ban", "immediately", "security", "unacceptable", "report", "admin", "warning"],
            requiredMatches: 2,
            explanation: "This is a threat. Immediately ping @cheif, warn the user, and document for potential ban."
        },
        {
            id: 8,
            userMessage: "i make youtube videos, can i join content team?",
            user: "ContentCreatorYT",
            avatarColor: "#ff0000",
            correctKeywords: ["social", "social media", "links", "send", "contentdep", "ping", "wait", "followers", "content", "review", "youtube", "subscribers"],
            requiredMatches: 2,
            explanation: "Ask for YouTube/Twitch/TikTok links with subscriber counts, then ping @contentdep for review."
        }
    ];
    
    // Format conversation log for Discord webhook
    function formatConversationForDiscord(log) {
        if (!log || log.length === 0) return "No conversation log";
        
        const maxLength = 1900;
        if (log.length <= maxLength) return log;
        
        const firstPart = log.substring(0, 1000);
        const lastPart = log.substring(log.length - 900);
        return `${firstPart}\n\n...[Log truncated due to length]...\n\n${lastPart}`;
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
        conversationLog = `═══════════════════════════════════════════════════════════════════\n`;
        conversationLog += `                     VOID ESPORTS MOD TEST CONVERSATION LOG\n`;
        conversationLog += `═══════════════════════════════════════════════════════════════════\n\n`;
        conversationLog += `Test Started: ${new Date().toLocaleString()}\n`;
        conversationLog += `User: ${window.userDiscordUsername || 'Unknown'} (${window.userDiscordId || 'N/A'})\n`;
        conversationLog += `Test ID: test_${Date.now()}\n`;
        conversationLog += `═══════════════════════════════════════════════════════════════════\n\n`;
        
        addToConversationLog('SYSTEM', 'Test initialized');
        addToConversationLog('VOID BOT', 'Welcome to the Void Esports Moderator Certification Test.');
        addToConversationLog('VOID BOT', `Hello ${window.userDiscordUsername}! You'll receive 8 different scenarios.`);
        addToConversationLog('VOID BOT', 'Respond as you would as a real moderator. Good luck!');
    }
    
    // Add to conversation log
    function addToConversationLog(speaker, message, timestamp = null) {
        const time = timestamp || new Date();
        const timeStr = `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}:${time.getSeconds().toString().padStart(2, '0')}`;
        
        conversationLog += `[${timeStr}] ${speaker}: ${message}\n`;
        
        if (speaker === 'VOID BOT') {
            conversationLog += `─`.repeat(60) + `\n`;
        }
        
        if (conversationLog.length > 10000) {
            conversationLog = conversationLog.substring(0, 9500) + "\n...[Log truncated due to length]...\n";
        }
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
        console.log("Initializing Discord interface with conversation logging...");
        
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
        console.log("🚀 STARTING DISCORD TEST WITH CONVERSATION LOGGING");
        
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
            
            addToConversationLog(`USER (${question.user})`, question.userMessage);
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
        
        addToConversationLog('MODERATOR (You)', userMessage);
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
        
        addToConversationLog('SYSTEM', `Answer checked: ${isCorrect ? 'CORRECT' : 'INCORRECT'} (${matchCount}/${question.requiredMatches} matches)`);
        if (matchedKeywords.length > 0) {
            addToConversationLog('SYSTEM', `Matched keywords: ${matchedKeywords.join(', ')}`);
        }
        
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
                addToConversationLog('VOID BOT', `✅ Correct! ${question.explanation}`);
            }, 500);
        } else {
            setTimeout(() => {
                addMessage("Void Bot", `❌ Not quite right. ${question.explanation}`, "#5865f2", true);
                addToConversationLog('VOID BOT', `❌ Not quite right. ${question.explanation}`);
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
        console.log("Ending test with conversation logs...");
        testActive = false;
        
        addToConversationLog('SYSTEM', 'Test completed');
        conversationLog += `\n═══════════════════════════════════════════════════════════════════\n`;
        conversationLog += `Test Completed: ${new Date().toLocaleString()}\n`;
        conversationLog += `Final Score: ${testScore}/${testTotalQuestions}\n`;
        conversationLog += `Percentage: ${Math.round((testScore/testTotalQuestions)*100)}%\n`;
        conversationLog += `Status: ${testScore >= 6 ? 'PASS' : 'FAIL'}\n`;
        conversationLog += `User ID: ${window.userDiscordId}\n`;
        conversationLog += `═══════════════════════════════════════════════════════════════════\n`;
        
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
            addToConversationLog('VOID BOT', 'Test complete! Evaluating your responses...');
            
            setTimeout(() => {
                const passingScore = Math.ceil(testTotalQuestions * 0.75);
                const passed = testScore >= passingScore;
                
                const submissionData = {
                    discordId: window.userDiscordId,
                    discordUsername: window.userDiscordUsername,
                    answers: formatConversationForDiscord(conversationLog),
                    score: `${testScore}/${testTotalQuestions}`,
                    totalQuestions: testTotalQuestions,
                    correctAnswers: testScore,
                    wrongAnswers: testTotalQuestions - testScore,
                    testResults: JSON.stringify({
                        score: testScore,
                        total: testTotalQuestions,
                        passed: passed,
                        percentage: Math.round((testScore/testTotalQuestions)*100),
                        date: new Date().toISOString(),
                        userAnswers: userAnswers,
                        correctAnswers: correctAnswers,
                        questions: testQuestions.map(q => q.userMessage),
                        passingScore: passingScore,
                        conversationLogLength: conversationLog.length,
                        conversationLogPreview: conversationLog.substring(0, 500) + "..."
                    }),
                    conversationLog: conversationLog,
                    questionsWithAnswers: JSON.stringify(questionsWithAnswers),
                    fullConversationTranscript: formatConversationForDiscord(conversationLog)
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
                            submissionStatus.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting results with conversation logs...';
                        }
                        
                        try {
                            console.log("Submitting enhanced data with conversation logs...");
                            
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
                                    submissionStatus.innerHTML = '<i class="fas fa-check-circle"></i> Results submitted with conversation logs!';
                                    submissionStatus.className = "submission-status submission-success";
                                    
                                    const adminLink = document.createElement('div');
                                    adminLink.style.marginTop = '10px';
                                    adminLink.style.fontSize = '14px';
                                    adminLink.innerHTML = `<a href="https://mod-application-backend.onrender.com/admin?view=conversations&user=${encodeURIComponent(window.userDiscordUsername)}" target="_blank" style="color: #00ffea; text-decoration: underline;">
                                        <i class="fas fa-external-link-alt"></i> View Conversation Log in Admin Panel
                                    </a>`;
                                    submissionStatus.appendChild(adminLink);
                                    
                                    const discordLink = document.createElement('div');
                                    discordLink.style.marginTop = '5px';
                                    discordLink.style.fontSize = '14px';
                                    discordLink.innerHTML = `<a href="https://discord.gg/dqHF9HPucf" target="_blank" style="color: #5865f2; text-decoration: underline;">
                                        <i class="fab fa-discord"></i> Join Void Esports Discord
                                    </a>`;
                                    submissionStatus.appendChild(discordLink);
                                    
                                    const logNote = document.createElement('div');
                                    logNote.style.marginTop = '10px';
                                    logNote.style.fontSize = '12px';
                                    logNote.style.color = '#888';
                                    logNote.innerHTML = `<i class="fas fa-info-circle"></i> Full conversation log (${conversationLog.length} characters) has been saved to admin panel.`;
                                    submissionStatus.appendChild(logNote);
                                }
                                
                                setTimeout(() => {
                                    const successUrl = `success.html?discord_username=${encodeURIComponent(window.userDiscordUsername)}&final_score=${testScore}/${testTotalQuestions}&pass_fail=${passed ? 'PASS' : 'FAIL'}&test_date=${encodeURIComponent(new Date().toLocaleString())}&user_id=${window.userDiscordId}&conversation_log=yes`;
                                    window.location.href = successUrl;
                                }, 4000);
                                
                            } else {
                                console.log("Trying simple endpoint with conversation logs...");
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
                                    submissionStatus.innerHTML = '<i class="fas fa-check-circle"></i> Results submitted with conversation logs!';
                                    submissionStatus.className = "submission-status submission-success";
                                    
                                    setTimeout(() => {
                                        const successUrl = `success.html?discord_username=${encodeURIComponent(window.userDiscordUsername)}&final_score=${testScore}/${testTotalQuestions}&pass_fail=${passed ? 'PASS' : 'FAIL'}&test_date=${encodeURIComponent(new Date().toLocaleString())}&user_id=${window.userDiscordId}&conversation_log=yes`;
                                        window.location.href = successUrl;
                                    }, 3000);
                                }
                            }
                            
                        } catch (error) {
                            console.error("Submission error:", error);
                            
                            if (submissionStatus) {
                                submissionStatus.innerHTML = `<i class="fas fa-exclamation-triangle"></i> Network error. Your score: ${testScore}/${testTotalQuestions}`;
                                submissionStatus.className = "submission-status submission-error";
                                
                                const manualDiv = document.createElement('div');
                                manualDiv.style.marginTop = '10px';
                                manualDiv.innerHTML = `
                                    <p style="font-size: 14px; margin: 5px 0;">Please contact staff with this conversation log:</p>
                                    <div style="background: rgba(0,0,0,0.3); padding: 10px; border-radius: 5px; font-family: monospace; font-size: 12px; max-height: 200px; overflow-y: auto; white-space: pre-wrap;">
                                        Username: ${window.userDiscordUsername}<br>
                                        Discord ID: ${window.userDiscordId}<br>
                                        Score: ${testScore}/${testTotalQuestions}<br>
                                        Status: ${testScore >= 6 ? 'PASS' : 'FAIL'}<br>
                                        Conversation Log Length: ${conversationLog.length} characters<br><br>
                                        <strong>First 1000 chars of log:</strong><br>
                                        ${conversationLog.substring(0, 1000)}...
                                    </div>
                                    <div style="margin-top: 10px;">
                                        <button onclick="saveConversationLog()" style="padding: 8px 16px; background: #5865f2; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 10px;">
                                            <i class="fas fa-download"></i> Save Full Conversation Log
                                        </button>
                                        <button onclick="copyConversationSummary()" style="padding: 8px 16px; background: #3ba55c; color: white; border: none; border-radius: 4px; cursor: pointer;">
                                            <i class="fas fa-copy"></i> Copy Summary
                                        </button>
                                    </div>
                                `;
                                submissionStatus.appendChild(manualDiv);
                            }
                        }
                    }, 1000);
                }
            }, 1500);
        }, 1000);
    }
    
    // Save conversation log locally
    function saveConversationLog() {
        const blob = new Blob([conversationLog], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `void_mod_test_${window.userDiscordUsername}_${Date.now()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        alert('Conversation log saved! Please send this file to staff.');
    }
    
    // Copy conversation summary
    function copyConversationSummary() {
        const summary = `
Void Esports Mod Test Summary
User: ${window.userDiscordUsername}
Discord ID: ${window.userDiscordId}
Score: ${testScore}/${testTotalQuestions}
Status: ${testScore >= 6 ? 'PASS' : 'FAIL'}
Date: ${new Date().toLocaleString()}
Conversation Log Length: ${conversationLog.length} characters
        `.trim();
        
        navigator.clipboard.writeText(summary).then(() => {
            alert('Summary copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy:', err);
            alert('Failed to copy summary');
        });
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
    window.saveConversationLog = saveConversationLog;
    window.copyConversationSummary = copyConversationSummary;
    
    if (document.getElementById('testPage')) {
        setTimeout(initializeDiscordInterface, 1000);
    }
});
