// Mobile Discord Interface Logic - FIXED VERSION WITH PROPER INITIALIZATION
document.addEventListener('DOMContentLoaded', function() {
    console.log("📱 Mobile discord.js loaded - Enhanced");
    
    // Mobile test state variables
    let mobileTestCurrentQuestion = 0;
    let mobileTestScore = 0;
    let mobileTestActive = false;
    let mobileTestTotalQuestions = 8;
    let mobileUserAnswers = [];
    let mobileCorrectAnswers = [];
    let mobileTestQuestions = [];
    let mobileSessionTranscript = [];
    let mobileConversationLog = "";
    let mobileQuestionsWithAnswers = [];
    
    // Enhanced test questions with realistic scenarios
    const allMobileTestQuestions = [
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
    
    // Get random questions
    function getRandomMobileTestQuestions() {
        const shuffled = [...allMobileTestQuestions].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 8);
    }
    
    // Initialize conversation log
    function initMobileConversationLog() {
        console.log("📝 Initializing mobile conversation log");
        
        mobileConversationLog = `═══════════════════════════════════════════════════════════════════\n`;
        mobileConversationLog += `                     VOID ESPORTS MOBILE MOD TEST LOG\n`;
        mobileConversationLog += `═══════════════════════════════════════════════════════════════════\n\n`;
        mobileConversationLog += `Test Started: ${new Date().toLocaleString()}\n`;
        mobileConversationLog += `User: ${window.userDiscordUsername || 'Unknown'} (${window.userDiscordId || 'N/A'})\n`;
        mobileConversationLog += `Test ID: mobile_${Date.now()}\n`;
        mobileConversationLog += `═══════════════════════════════════════════════════════════════════\n\n`;
        
        addToMobileConversationLog('SYSTEM', 'Mobile test initialized');
        addToMobileConversationLog('VOID BOT', 'Welcome to the Void Esports Moderator Certification Test.');
        addToMobileConversationLog('VOID BOT', `Hello ${window.userDiscordUsername}! You'll receive 8 different scenarios.`);
    }
    
    // Add to conversation log
    function addToMobileConversationLog(speaker, message) {
        const time = new Date();
        const timeStr = `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}:${time.getSeconds().toString().padStart(2, '0')}`;
        
        mobileConversationLog += `[${timeStr}] ${speaker}: ${message}\n`;
        
        if (speaker === 'VOID BOT') {
            mobileConversationLog += `─`.repeat(60) + `\n`;
        }
        
        if (mobileConversationLog.length > 8000) {
            mobileConversationLog = mobileConversationLog.substring(0, 7500) + "\n...[Log truncated]...\n";
        }
    }
    
    // Initialize mobile interface
    function initializeMobileInterface() {
        console.log("Mobile interface initialized");
        
        // Mobile DOM elements
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
        const mobileDiscord = document.getElementById('mobileDiscord');
        const mobileMessagesContainer = document.getElementById('mobileMessagesContainer');
        
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
                updateMobileScore();
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
        
        // FIXED: Send button and message input functionality
        if (mobileSendBtn && mobileMessageInput) {
            // Enable/disable send button based on input
            mobileMessageInput.addEventListener('input', function() {
                mobileSendBtn.disabled = this.value.trim() === '';
            });
            
            // Handle enter key (send) and shift+enter (new line)
            mobileMessageInput.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (!mobileSendBtn.disabled && mobileTestActive) {
                        sendMobileMessage();
                    }
                }
            });
            
            // Handle send button click
            mobileSendBtn.addEventListener('click', function(e) {
                e.preventDefault();
                if (!mobileSendBtn.disabled && mobileTestActive) {
                    sendMobileMessage();
                }
            });
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
        
        // Channel switching
        const channelItems = document.querySelectorAll('.mobile-channel-item');
        channelItems.forEach(item => {
            item.addEventListener('click', function() {
                channelItems.forEach(i => i.classList.remove('active'));
                this.classList.add('active');
                const channelName = this.querySelector('.mobile-channel-name-sidebar').textContent;
                document.getElementById('mobileChannelName').textContent = channelName;
                mobileSidebar.classList.remove('active');
            });
        });
        
        // Clear messages container
        if (mobileMessagesContainer) {
            mobileMessagesContainer.innerHTML = '';
        }
        
        // CRITICAL FIX: Initialize test immediately when mobile interface is loaded
        if (window.userDiscordUsername && window.userDiscordUsername !== 'User') {
            console.log("Auto-starting mobile test for:", window.userDiscordUsername);
            setTimeout(() => {
                startMobileTest();
            }, 500);
        }
    }
    
    // Start mobile test - FIXED VERSION
    function startMobileTest() {
        console.log("🚀 STARTING MOBILE TEST - FIXED VERSION");
        
        mobileTestQuestions = getRandomMobileTestQuestions();
        mobileTestTotalQuestions = mobileTestQuestions.length;
        
        mobileTestActive = true;
        mobileTestCurrentQuestion = 0;
        mobileTestScore = 0;
        mobileUserAnswers = [];
        mobileCorrectAnswers = [];
        mobileSessionTranscript = [];
        mobileQuestionsWithAnswers = [];
        
        // Initialize conversation log
        initMobileConversationLog();
        
        // Clear existing messages
        const mobileMessagesContainer = document.getElementById('mobileMessagesContainer');
        if (mobileMessagesContainer) {
            mobileMessagesContainer.innerHTML = '';
        }
        
        // Enable input
        const mobileMessageInput = document.getElementById('mobileMessageInput');
        if (mobileMessageInput) {
            mobileMessageInput.disabled = false;
            mobileMessageInput.value = '';
            mobileMessageInput.placeholder = "Type your response...";
            setTimeout(() => {
                mobileMessageInput.focus();
            }, 500);
        }
        
        const mobileSendBtn = document.getElementById('mobileSendBtn');
        if (mobileSendBtn) mobileSendBtn.disabled = true;
        
        updateMobileScore();
        
        // CRITICAL FIX: Show welcome messages immediately
        setTimeout(() => {
            addMobileMessage("Void Bot", `Welcome to the Void Esports Moderator Certification Test.`, "#5865f2", true);
            addToMobileConversationLog('VOID BOT', 'Welcome to the Void Esports Moderator Certification Test.');
            
            setTimeout(() => {
                addMobileMessage("Void Bot", `Hello ${window.userDiscordUsername}! You'll receive ${mobileTestTotalQuestions} scenarios.`, "#5865f2", true);
                addToMobileConversationLog('VOID BOT', `Hello ${window.userDiscordUsername}! You'll receive ${mobileTestTotalQuestions} scenarios.`);
                
                setTimeout(() => {
                    addMobileMessage("Void Bot", "Respond as you would as a real moderator. Good luck!", "#5865f2", true);
                    addToMobileConversationLog('VOID BOT', 'Respond as you would as a real moderator. Good luck!');
                    
                    // CRITICAL FIX: Start first question immediately
                    showNextMobileQuestion();
                }, 1000);
            }, 1000);
        }, 300);
    }
    
    // Show next question - FIXED VERSION
    function showNextMobileQuestion() {
        console.log(`showNextMobileQuestion called. Current: ${mobileTestCurrentQuestion}, Total: ${mobileTestTotalQuestions}`);
        
        if (mobileTestCurrentQuestion >= mobileTestTotalQuestions) {
            console.log("All questions completed, ending test");
            endMobileTest();
            return;
        }
        
        setTimeout(() => {
            const question = mobileTestQuestions[mobileTestCurrentQuestion];
            console.log(`Mobile Question ${mobileTestCurrentQuestion + 1}: ${question.userMessage}`);
            
            // Add to conversation log
            addToMobileConversationLog(`USER (${question.user})`, question.userMessage);
            
            // Display in chat
            addMobileMessage(question.user, question.userMessage, question.avatarColor, false);
            
            // Enable input for response
            const mobileMessageInput = document.getElementById('mobileMessageInput');
            const mobileSendBtn = document.getElementById('mobileSendBtn');
            
            if (mobileMessageInput) {
                mobileMessageInput.disabled = false;
                mobileMessageInput.value = '';
                mobileMessageInput.style.height = 'auto';
                setTimeout(() => {
                    mobileMessageInput.focus();
                }, 300);
            }
            
            if (mobileSendBtn) {
                mobileSendBtn.disabled = true;
            }
            
        }, 1500);
    }
    
    // Send mobile message
    function sendMobileMessage() {
        console.log("sendMobileMessage called");
        
        const mobileMessageInput = document.getElementById('mobileMessageInput');
        const mobileSendBtn = document.getElementById('mobileSendBtn');
        
        if (!mobileMessageInput || !mobileTestActive) {
            console.log("Message input not found or test not active");
            return;
        }
        
        const userMessage = mobileMessageInput.value.trim();
        if (!userMessage) {
            console.log("Empty message");
            return;
        }
        
        console.log(`Mobile user answer: ${userMessage.substring(0, 50)}...`);
        
        // Add to conversation log
        addToMobileConversationLog('MODERATOR (You)', userMessage);
        
        // Display in chat
        addMobileMessage("You", userMessage, "#7289da", false);
        mobileUserAnswers.push(userMessage);
        
        // Clear input but keep it enabled for feedback period
        mobileMessageInput.value = '';
        mobileMessageInput.style.height = 'auto';
        if (mobileSendBtn) mobileSendBtn.disabled = true;
        
        const isCorrect = checkMobileAnswer(userMessage);
        mobileCorrectAnswers.push(isCorrect);
        
        // TEMPORARILY disable input while showing feedback
        if (mobileMessageInput) {
            mobileMessageInput.disabled = true;
            mobileMessageInput.placeholder = "Checking answer...";
        }
        
        // Wait for feedback, then move to next question
        setTimeout(() => {
            mobileTestCurrentQuestion++;
            updateMobileScore();
            
            // RE-ENABLE INPUT FOR NEXT QUESTION
            if (mobileTestCurrentQuestion < mobileTestTotalQuestions) {
                if (mobileMessageInput) {
                    mobileMessageInput.disabled = false;
                    mobileMessageInput.placeholder = "Type your response...";
                }
                
                setTimeout(() => {
                    showNextMobileQuestion();
                }, 1000);
            } else {
                endMobileTest();
            }
        }, 2000);
    }
    
    // Check mobile answer
    function checkMobileAnswer(userAnswer) {
        console.log("checkMobileAnswer called");
        
        if (mobileTestCurrentQuestion >= mobileTestQuestions.length) {
            console.log("No question available");
            return false;
        }
        
        const question = mobileTestQuestions[mobileTestCurrentQuestion];
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
        console.log(`Mobile answer check: ${matchCount} matches, required: ${question.requiredMatches}, correct: ${isCorrect}`);
        
        // Add to conversation log
        addToMobileConversationLog('SYSTEM', `Answer checked: ${isCorrect ? 'CORRECT' : 'INCORRECT'} (${matchCount}/${question.requiredMatches} matches)`);
        
        // Add to questionsWithAnswers
        mobileQuestionsWithAnswers.push({
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
            mobileTestScore++;
            
            // Show correct feedback
            setTimeout(() => {
                addMobileMessage("Void Bot", `✅ Correct! ${question.explanation}`, "#5865f2", true);
                addToMobileConversationLog('VOID BOT', `✅ Correct! ${question.explanation}`);
                
                // Add correct badge to user message
                const mobileMessagesContainer = document.getElementById('mobileMessagesContainer');
                if (mobileMessagesContainer) {
                    const lastMessage = mobileMessagesContainer.querySelector('.mobile-message-group:last-child');
                    if (lastMessage) {
                        const badge = document.createElement('span');
                        badge.className = 'mobile-bot-tag';
                        badge.style.backgroundColor = '#3ba55c';
                        badge.textContent = 'Correct';
                        badge.style.marginLeft = '10px';
                        badge.style.fontSize = '10px';
                        badge.style.padding = '2px 6px';
                        badge.style.borderRadius = '3px';
                        badge.style.fontWeight = 'bold';
                        lastMessage.querySelector('.mobile-message-content').appendChild(badge);
                    }
                }
            }, 500);
        } else {
            // Show incorrect feedback
            setTimeout(() => {
                addMobileMessage("Void Bot", `❌ Not quite right. ${question.explanation}`, "#5865f2", true);
                addToMobileConversationLog('VOID BOT', `❌ Not quite right. ${question.explanation}`);
                
                // Add incorrect badge to user message
                const mobileMessagesContainer = document.getElementById('mobileMessagesContainer');
                if (mobileMessagesContainer) {
                    const lastMessage = mobileMessagesContainer.querySelector('.mobile-message-group:last-child');
                    if (lastMessage) {
                        const badge = document.createElement('span');
                        badge.className = 'mobile-bot-tag';
                        badge.style.backgroundColor = '#ed4245';
                        badge.textContent = 'Incorrect';
                        badge.style.marginLeft = '10px';
                        badge.style.fontSize = '10px';
                        badge.style.padding = '2px 6px';
                        badge.style.borderRadius = '3px';
                        badge.style.fontWeight = 'bold';
                        lastMessage.querySelector('.mobile-message-content').appendChild(badge);
                    }
                }
            }, 500);
        }
        
        return isCorrect;
    }
    
    // Update mobile score
    function updateMobileScore() {
        const mobileScoreValue = document.getElementById('mobileScoreValue');
        const mobileProgressFill = document.getElementById('mobileProgressFill');
        
        if (mobileScoreValue) mobileScoreValue.textContent = mobileTestScore;
        
        const percentage = Math.round((mobileTestCurrentQuestion + 1) / mobileTestTotalQuestions * 100);
        if (mobileProgressFill) {
            mobileProgressFill.style.width = `${percentage}%`;
        }
    }
    
    // Add message to mobile chat - FIXED VERSION
    function addMobileMessage(username, content, color, isBot = false) {
        const mobileMessagesContainer = document.getElementById('mobileMessagesContainer');
        if (!mobileMessagesContainer) {
            console.log("Mobile messages container not found!");
            return;
        }
        
        mobileSessionTranscript.push({
            speaker: username,
            message: content,
            timestamp: new Date().toLocaleTimeString()
        });
        
        const messageGroup = document.createElement('div');
        messageGroup.className = 'mobile-message-group';
        
        const now = new Date();
        const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        
        let avatarInitials = username.charAt(0).toUpperCase();
        if (username === "Void Bot") avatarInitials = "V";
        if (username === "You") avatarInitials = window.userDiscordUsername ? window.userDiscordUsername.charAt(0).toUpperCase() : "U";
        
        messageGroup.innerHTML = `
            <div class="mobile-message-header">
                <div class="mobile-message-avatar" style="background-color: ${color}">
                    ${avatarInitials}
                </div>
                <div>
                    <span class="mobile-message-author">${username}</span>
                    ${isBot ? '<span class="mobile-bot-tag">BOT</span>' : ''}
                    <span class="mobile-message-timestamp">${timeString}</span>
                </div>
            </div>
            <div class="mobile-message-content">
                ${content.replace(/\n/g, '<br>')}
            </div>
        `;
        
        mobileMessagesContainer.appendChild(messageGroup);
        mobileMessagesContainer.scrollTop = mobileMessagesContainer.scrollHeight;
    }
    
    // End mobile test
    async function endMobileTest() {
        console.log("Ending mobile test with conversation logs...");
        mobileTestActive = false;
        
        // Finalize conversation log
        addToMobileConversationLog('SYSTEM', 'Mobile test completed');
        mobileConversationLog += `\n═══════════════════════════════════════════════════════════════════\n`;
        mobileConversationLog += `Mobile Test Completed: ${new Date().toLocaleString()}\n`;
        mobileConversationLog += `Final Score: ${mobileTestScore}/${mobileTestTotalQuestions}\n`;
        mobileConversationLog += `Percentage: ${Math.round((mobileTestScore/mobileTestTotalQuestions)*100)}%\n`;
        mobileConversationLog += `Status: ${mobileTestScore >= 6 ? 'PASS' : 'FAIL'}\n`;
        mobileConversationLog += `User ID: ${window.userDiscordId}\n`;
        mobileConversationLog += `═══════════════════════════════════════════════════════════════════\n`;
        
        // Disable input
        const mobileMessageInput = document.getElementById('mobileMessageInput');
        const mobileSendBtn = document.getElementById('mobileSendBtn');
        
        if (mobileMessageInput) {
            mobileMessageInput.disabled = true;
            mobileMessageInput.value = '';
            mobileMessageInput.placeholder = "Test complete!";
        }
        
        if (mobileSendBtn) {
            mobileSendBtn.disabled = true;
        }
        
        setTimeout(() => {
            addMobileMessage("Void Bot", "Mobile test complete! Evaluating your responses...", "#5865f2", true);
            addToMobileConversationLog('VOID BOT', 'Mobile test complete! Evaluating your responses...');
            
            setTimeout(() => {
                const passingScore = Math.ceil(mobileTestTotalQuestions * 0.75); // 6/8
                const passed = mobileTestScore >= passingScore;
                
                // Prepare enhanced submission data
                const submissionData = {
                    discordId: window.userDiscordId,
                    discordUsername: window.userDiscordUsername,
                    answers: mobileConversationLog,
                    score: `${mobileTestScore}/${mobileTestTotalQuestions}`,
                    totalQuestions: mobileTestTotalQuestions,
                    correctAnswers: mobileTestScore,
                    wrongAnswers: mobileTestTotalQuestions - mobileTestScore,
                    testResults: JSON.stringify({
                        score: mobileTestScore,
                        total: mobileTestTotalQuestions,
                        passed: passed,
                        percentage: Math.round((mobileTestScore/mobileTestTotalQuestions)*100),
                        date: new Date().toISOString(),
                        userAnswers: mobileUserAnswers,
                        correctAnswers: mobileCorrectAnswers,
                        questions: mobileTestQuestions.map(q => q.userMessage),
                        passingScore: passingScore
                    }),
                    conversationLog: mobileConversationLog,
                    questionsWithAnswers: mobileQuestionsWithAnswers
                };
                
                // Show results screen
                const mobileTestComplete = document.getElementById('mobileTestComplete');
                if (mobileTestComplete) {
                    mobileTestComplete.classList.add('active');
                    
                    const mobileTestResultScore = document.getElementById('mobileTestResultScore');
                    const mobileTestResultTitle = document.getElementById('mobileTestResultTitle');
                    const mobileTestResultMessage = document.getElementById('mobileTestResultMessage');
                    const mobileTestResultIcon = document.getElementById('mobileTestResultIcon');
                    const mobileSubmissionStatus = document.getElementById('mobileSubmissionStatus');
                    
                    if (mobileTestResultScore) mobileTestResultScore.textContent = `Score: ${mobileTestScore}/${mobileTestTotalQuestions}`;
                    if (mobileTestResultTitle) mobileTestResultTitle.textContent = passed ? "Test Passed!" : "Test Failed";
                    if (mobileTestResultMessage) {
                        mobileTestResultMessage.textContent = passed 
                            ? `Congratulations! You passed with ${mobileTestScore}/${mobileTestTotalQuestions}. Your application is now pending review by the admin team.` 
                            : `You scored ${mobileTestScore}/${mobileTestTotalQuestions}. Minimum passing score is ${passingScore}. You can retake the test after reviewing the training material.`;
                    }
                    if (mobileTestResultIcon) {
                        mobileTestResultIcon.className = passed ? "mobile-test-result-icon pass" : "mobile-test-result-icon fail";
                        mobileTestResultIcon.innerHTML = passed ? '<i class="fas fa-trophy"></i>' : '<i class="fas fa-times-circle"></i>';
                    }
                    
                    // SUBMIT RESULTS
                    setTimeout(async () => {
                        if (mobileSubmissionStatus) {
                            mobileSubmissionStatus.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting results...';
                        }
                        
                        try {
                            console.log("Submitting mobile test results...");
                            
                            // Use the enhanced endpoint
                            const response = await fetch('https://mod-application-backend.onrender.com/submit-test-results', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Accept': 'application/json'
                                },
                                body: JSON.stringify(submissionData)
                            });
                            
                            const result = await response.json();
                            console.log("Mobile submission result:", result);
                            
                            if (response.ok && result.success) {
                                // SUCCESS
                                if (mobileSubmissionStatus) {
                                    mobileSubmissionStatus.innerHTML = '<i class="fas fa-check-circle"></i> Results submitted successfully!';
                                    mobileSubmissionStatus.className = "mobile-submission-status submission-success";
                                    
                                    // Add admin panel link
                                    const adminLink = document.createElement('div');
                                    adminLink.style.marginTop = '10px';
                                    adminLink.style.fontSize = '14px';
                                    adminLink.innerHTML = `<a href="https://mod-application-backend.onrender.com/admin" target="_blank" style="color: #00ffea; text-decoration: underline;">
                                        <i class="fas fa-external-link-alt"></i> View in Admin Panel
                                    </a>`;
                                    mobileSubmissionStatus.appendChild(adminLink);
                                    
                                    // Add Discord link
                                    const discordLink = document.createElement('div');
                                    discordLink.style.marginTop = '5px';
                                    discordLink.style.fontSize = '14px';
                                    discordLink.innerHTML = `<a href="https://discord.gg/dqHF9HPucf" target="_blank" style="color: #5865f2; text-decoration: underline;">
                                        <i class="fab fa-discord"></i> Join Void Esports Discord
                                    </a>`;
                                    mobileSubmissionStatus.appendChild(discordLink);
                                }
                                
                                // Redirect to success page after delay
                                setTimeout(() => {
                                    const successUrl = `success.html?discord_username=${encodeURIComponent(window.userDiscordUsername)}&final_score=${mobileTestScore}/${mobileTestTotalQuestions}&pass_fail=${passed ? 'PASS' : 'FAIL'}&test_date=${encodeURIComponent(new Date().toLocaleString())}&user_id=${window.userDiscordId}`;
                                    window.location.href = successUrl;
                                }, 4000);
                                
                            } else {
                                // Fallback to simple endpoint
                                console.log("Trying simple endpoint for mobile...");
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
                                
                                if (mobileSubmissionStatus) {
                                    mobileSubmissionStatus.innerHTML = '<i class="fas fa-check-circle"></i> Results submitted!';
                                    mobileSubmissionStatus.className = "mobile-submission-status submission-success";
                                    
                                    setTimeout(() => {
                                        const successUrl = `success.html?discord_username=${encodeURIComponent(window.userDiscordUsername)}&final_score=${mobileTestScore}/${mobileTestTotalQuestions}&pass_fail=${passed ? 'PASS' : 'FAIL'}&test_date=${encodeURIComponent(new Date().toLocaleString())}&user_id=${window.userDiscordId}`;
                                        window.location.href = successUrl;
                                    }, 3000);
                                }
                            }
                            
                        } catch (error) {
                            console.error("Mobile submission error:", error);
                            
                            if (mobileSubmissionStatus) {
                                mobileSubmissionStatus.innerHTML = `<i class="fas fa-exclamation-triangle"></i> Network error. Score: ${mobileTestScore}/${mobileTestTotalQuestions}`;
                                mobileSubmissionStatus.className = "mobile-submission-status submission-error";
                                
                                // Show manual option
                                const manualDiv = document.createElement('div');
                                manualDiv.style.marginTop = '10px';
                                manualDiv.innerHTML = `
                                    <p style="font-size: 14px; margin: 5px 0;">Please contact staff with:</p>
                                    <div style="background: rgba(0,0,0,0.3); padding: 10px; border-radius: 5px; font-family: monospace; font-size: 12px;">
                                        Username: ${window.userDiscordUsername}<br>
                                        Score: ${mobileTestScore}/${mobileTestTotalQuestions}<br>
                                        ID: ${window.userDiscordId}<br>
                                        Mobile Test
                                    </div>
                                `;
                                mobileSubmissionStatus.appendChild(manualDiv);
                            }
                        }
                    }, 1000);
                }
            }, 1500);
        }, 1000);
    }
    
    // Reset mobile test
    function resetMobileTest() {
        mobileTestActive = false;
        mobileTestCurrentQuestion = 0;
        mobileTestScore = 0;
        mobileUserAnswers = [];
        mobileCorrectAnswers = [];
        mobileSessionTranscript = [];
        mobileConversationLog = "";
        mobileQuestionsWithAnswers = [];
        
        const mobileScoreValue = document.getElementById('mobileScoreValue');
        const mobileProgressFill = document.getElementById('mobileProgressFill');
        
        if (mobileScoreValue) mobileScoreValue.textContent = "0";
        if (mobileProgressFill) mobileProgressFill.style.width = "0%";
        
        const mobileMessageInput = document.getElementById('mobileMessageInput');
        if (mobileMessageInput) {
            mobileMessageInput.value = '';
            mobileMessageInput.disabled = true;
        }
        
        const mobileSendBtn = document.getElementById('mobileSendBtn');
        if (mobileSendBtn) mobileSendBtn.disabled = true;
        
        const mobileMessagesContainer = document.getElementById('mobileMessagesContainer');
        if (mobileMessagesContainer) {
            mobileMessagesContainer.innerHTML = '';
        }
    }
    
    // Export functions to window
    window.initializeMobileInterface = initializeMobileInterface;
    window.startMobileTest = startMobileTest;
    window.resetMobileTest = resetMobileTest;
});
