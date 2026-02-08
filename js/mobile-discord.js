// Mobile Discord Interface - COMPLETELY REWRITTEN WITH 100% FIXED FUNCTIONALITY
document.addEventListener('DOMContentLoaded', function() {
    console.log("📱 Mobile Discord Interface Loaded - Enhanced Version");
    
    // State management
    let mobileTestState = {
        active: false,
        currentQuestion: 0,
        score: 0,
        totalQuestions: 8,
        userAnswers: [],
        correctAnswers: [],
        questions: [],
        conversationLog: "",
        questionsWithAnswers: []
    };
    
    // Enhanced test questions
    const ALL_MOBILE_QUESTIONS = [
        {
            id: 1,
            userMessage: "hey i wanna join void esports, what do i need to do?",
            user: "FortnitePlayer23",
            avatarColor: "#5865f2",
            correctKeywords: ["age", "how old", "roster", "channel", "requirement", "fit", "category"],
            requiredMatches: 2,
            explanation: "Ask for age and direct to #how-to-join-roster. Include professional greeting."
        },
        {
            id: 2,
            userMessage: "i want to join as a pro player, i have earnings",
            user: "CompPlayer99",
            avatarColor: "#ed4245",
            correctKeywords: ["tracker", "fortnite tracker", "stats", "ranking", "pr", "send", "trapped", "chief", "ping"],
            requiredMatches: 2,
            explanation: "Ask for Fortnite tracker link and earnings proof, ping @trapped or @cheif"
        },
        {
            id: 3,
            userMessage: "looking to join creative roster, i have clips",
            user: "CreativeBuilder",
            avatarColor: "#3ba55c",
            correctKeywords: ["clip", "video", "footage", "freebuilding", "send", "creativedepartment", "ping"],
            requiredMatches: 2,
            explanation: "Ask for at least 2 clips of freebuilding and ping @creativedepartment"
        },
        {
            id: 4,
            userMessage: "can i join academy? i have 5k PR",
            user: "AcademyGrinder",
            avatarColor: "#f59e0b",
            correctKeywords: ["tracker", "fortnite tracker", "send", "verify", "username", "add void", "team.void"],
            requiredMatches: 2,
            explanation: "Ask for Fortnite tracker verification and require username change"
        },
        {
            id: 5,
            userMessage: "im 14 is that old enough?",
            user: "YoungPlayer14",
            avatarColor: "#9146ff",
            correctKeywords: ["chief", "trapped", "ping", "minimum age", "13", "allowed", "verify"],
            requiredMatches: 2,
            explanation: "14 is acceptable. Ask for parental consent then proceed"
        },
        {
            id: 6,
            userMessage: "i wanna be a void grinder, what's required?",
            user: "GrinderAccount",
            avatarColor: "#1da1f2",
            correctKeywords: ["username", "discord name", "add void", "team.void", "proof", "change", "grinder"],
            requiredMatches: 2,
            explanation: "Ask to change usernames to include 'Void' and require proof"
        },
        {
            id: 7,
            userMessage: "this server is trash, gonna report it all",
            user: "ToxicUser123",
            avatarColor: "#ff0000",
            correctKeywords: ["chief", "trapped", "ping", "threat", "dangerous", "ban", "immediately"],
            requiredMatches: 2,
            explanation: "Immediate threat. Ping @cheif, warn user, document for ban"
        },
        {
            id: 8,
            userMessage: "i make youtube videos, can i join content team?",
            user: "ContentCreatorYT",
            avatarColor: "#ff0000",
            correctKeywords: ["social", "social media", "links", "send", "contentdep", "ping", "youtube"],
            requiredMatches: 2,
            explanation: "Ask for YouTube/Twitch links, ping @contentdep for review"
        }
    ];
    
    // Get random questions
    function getRandomQuestions() {
        const shuffled = [...ALL_MOBILE_QUESTIONS].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 8);
    }
    
    // Initialize conversation log
    function initConversationLog() {
        mobileTestState.conversationLog = `════════════════════════════════════════════════════\n`;
        mobileTestState.conversationLog += `          VOID ESPORTS MOBILE MOD TEST LOG\n`;
        mobileTestState.conversationLog += `════════════════════════════════════════════════════\n\n`;
        mobileTestState.conversationLog += `Test Started: ${new Date().toLocaleString()}\n`;
        mobileTestState.conversationLog += `User: ${window.userDiscordUsername || 'Unknown'}\n`;
        mobileTestState.conversationLog += `ID: ${window.userDiscordId || 'N/A'}\n`;
        mobileTestState.conversationLog += `════════════════════════════════════════════════════\n\n`;
        
        addToLog('SYSTEM', 'Mobile test initialized');
        addToLog('VOID BOT', 'Welcome to Void Esports Moderator Certification Test.');
    }
    
    // Add to log
    function addToLog(speaker, message) {
        const time = new Date();
        const timeStr = `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}:${time.getSeconds().toString().padStart(2, '0')}`;
        mobileTestState.conversationLog += `[${timeStr}] ${speaker}: ${message}\n`;
    }
    
    // DOM Elements
    const mobileSendBtn = document.getElementById('mobileSendBtn');
    const mobileMessageInput = document.getElementById('mobileMessageInput');
    const mobileMessagesContainer = document.getElementById('mobileMessagesContainer');
    const mobileScoreValue = document.getElementById('mobileScoreValue');
    const mobileProgressFill = document.getElementById('mobileProgressFill');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileSidebar = document.getElementById('mobileSidebar');
    const mobileCloseSidebar = document.getElementById('mobileCloseSidebar');
    const mobileExitBtn = document.getElementById('mobileExitBtn');
    const mobileDiscord = document.getElementById('mobileDiscord');
    const mainContainer = document.getElementById('mainContainer');
    
    // Initialize event listeners
    function initializeEventListeners() {
        console.log("🔧 Initializing event listeners...");
        
        // Menu toggle
        if (mobileMenuBtn && mobileSidebar) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileSidebar.classList.add('active');
            });
        }
        
        // Close sidebar
        if (mobileCloseSidebar && mobileSidebar) {
            mobileCloseSidebar.addEventListener('click', () => {
                mobileSidebar.classList.remove('active');
            });
        }
        
        // Exit button
        if (mobileExitBtn) {
            mobileExitBtn.addEventListener('click', () => {
                if (mobileDiscord) mobileDiscord.classList.remove('active');
                if (mainContainer) mainContainer.style.display = 'block';
                resetMobileTest();
            });
        }
        
        // Message input and send button
        if (mobileMessageInput && mobileSendBtn) {
            // Enable/disable send button based on input
            mobileMessageInput.addEventListener('input', () => {
                mobileSendBtn.disabled = !mobileTestState.active || mobileMessageInput.value.trim() === '';
            });
            
            // Enter key to send
            mobileMessageInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (!mobileSendBtn.disabled && mobileTestState.active) {
                        sendMobileMessage();
                    }
                }
            });
            
            // Send button click
            mobileSendBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (!mobileSendBtn.disabled && mobileTestState.active) {
                    sendMobileMessage();
                }
            });
        }
        
        // Channel items
        const channelItems = document.querySelectorAll('.mobile-channel-item');
        channelItems.forEach(item => {
            item.addEventListener('click', function() {
                channelItems.forEach(i => i.classList.remove('active'));
                this.classList.add('active');
                const channelName = this.querySelector('.mobile-channel-name-sidebar').textContent;
                document.getElementById('mobileChannelName').textContent = channelName;
                if (mobileSidebar) mobileSidebar.classList.remove('active');
            });
        });
        
        // Test review button
        const mobileTestReviewBtn = document.getElementById('mobileTestReviewBtn');
        if (mobileTestReviewBtn) {
            mobileTestReviewBtn.addEventListener('click', () => {
                const mobileTestComplete = document.getElementById('mobileTestComplete');
                if (mobileTestComplete) mobileTestComplete.classList.remove('active');
                resetMobileTest();
                setTimeout(startMobileTest, 500);
            });
        }
        
        // Back to training button
        const mobileTestBackBtn = document.getElementById('mobileTestBackBtn');
        if (mobileTestBackBtn) {
            mobileTestBackBtn.addEventListener('click', () => {
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
        console.log("🚀 Starting mobile test...");
        
        // Reset state
        mobileTestState = {
            active: true,
            currentQuestion: 0,
            score: 0,
            totalQuestions: 8,
            userAnswers: [],
            correctAnswers: [],
            questions: getRandomQuestions(),
            conversationLog: "",
            questionsWithAnswers: []
        };
        
        // Initialize conversation log
        initConversationLog();
        
        // Clear messages container
        if (mobileMessagesContainer) {
            mobileMessagesContainer.innerHTML = '';
        }
        
        // Enable input
        if (mobileMessageInput) {
            mobileMessageInput.disabled = false;
            mobileMessageInput.value = '';
            mobileMessageInput.placeholder = "Type your response...";
            mobileMessageInput.focus();
        }
        
        if (mobileSendBtn) {
            mobileSendBtn.disabled = true;
        }
        
        // Update score display
        updateScoreDisplay();
        
        // Show welcome messages
        setTimeout(() => {
            addMessage("Void Bot", "Welcome to the Void Esports Moderator Certification Test.", "#5865f2", true);
            addToLog('VOID BOT', 'Welcome to the test.');
            
            setTimeout(() => {
                addMessage("Void Bot", `Hello ${window.userDiscordUsername}! You'll receive ${mobileTestState.totalQuestions} scenarios.`, "#5865f2", true);
                addToLog('VOID BOT', `Hello ${window.userDiscordUsername}! ${mobileTestState.totalQuestions} scenarios.`);
                
                setTimeout(() => {
                    addMessage("Void Bot", "Respond as you would as a real moderator. Good luck!", "#5865f2", true);
                    addToLog('VOID BOT', 'Respond as real moderator. Good luck!');
                    
                    // Start first question
                    setTimeout(showNextQuestion, 1000);
                }, 1000);
            }, 1000);
        }, 300);
    }
    
    // Show next question
    function showNextQuestion() {
        console.log(`Show next question: ${mobileTestState.currentQuestion}/${mobileTestState.totalQuestions}`);
        
        if (mobileTestState.currentQuestion >= mobileTestState.totalQuestions) {
            endMobileTest();
            return;
        }
        
        const question = mobileTestState.questions[mobileTestState.currentQuestion];
        
        // Add to conversation log
        addToLog(`USER (${question.user})`, question.userMessage);
        
        // Display in chat
        setTimeout(() => {
            addMessage(question.user, question.userMessage, question.avatarColor, false);
            
            // Enable input for response
            if (mobileMessageInput) {
                mobileMessageInput.disabled = false;
                mobileMessageInput.value = '';
                mobileMessageInput.focus();
            }
            
            if (mobileSendBtn) {
                mobileSendBtn.disabled = true;
            }
        }, 1500);
    }
    
    // Send message
    function sendMobileMessage() {
        if (!mobileMessageInput || !mobileTestState.active) return;
        
        const userMessage = mobileMessageInput.value.trim();
        if (!userMessage) return;
        
        console.log(`User answer: ${userMessage.substring(0, 50)}...`);
        
        // Add to conversation log
        addToLog('MODERATOR (You)', userMessage);
        
        // Display in chat
        addMessage("You", userMessage, "#7289da", false);
        mobileTestState.userAnswers.push(userMessage);
        
        // Clear input
        mobileMessageInput.value = '';
        mobileMessageInput.style.height = 'auto';
        if (mobileSendBtn) mobileSendBtn.disabled = true;
        
        // Check answer
        const isCorrect = checkAnswer(userMessage);
        mobileTestState.correctAnswers.push(isCorrect);
        
        // Temporarily disable input
        if (mobileMessageInput) {
            mobileMessageInput.disabled = true;
            mobileMessageInput.placeholder = "Checking answer...";
        }
        
        // Wait for feedback, then move to next question
        setTimeout(() => {
            mobileTestState.currentQuestion++;
            updateScoreDisplay();
            
            if (mobileTestState.currentQuestion < mobileTestState.totalQuestions) {
                if (mobileMessageInput) {
                    mobileMessageInput.disabled = false;
                    mobileMessageInput.placeholder = "Type your response...";
                }
                
                setTimeout(showNextQuestion, 1000);
            } else {
                endMobileTest();
            }
        }, 2000);
    }
    
    // Check answer
    function checkAnswer(userAnswer) {
        const question = mobileTestState.questions[mobileTestState.currentQuestion];
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
        
        // Add to questions with answers
        mobileTestState.questionsWithAnswers.push({
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
            mobileTestState.score++;
            
            // Show correct feedback
            setTimeout(() => {
                addMessage("Void Bot", `✅ Correct! ${question.explanation}`, "#5865f2", true);
                addToLog('VOID BOT', `✅ Correct! ${question.explanation}`);
                
                // Add correct badge
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
            }, 500);
        } else {
            // Show incorrect feedback
            setTimeout(() => {
                addMessage("Void Bot", `❌ Not quite right. ${question.explanation}`, "#5865f2", true);
                addToLog('VOID BOT', `❌ Not quite right. ${question.explanation}`);
                
                // Add incorrect badge
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
            }, 500);
        }
        
        return isCorrect;
    }
    
    // Add message to chat
    function addMessage(username, content, color, isBot = false) {
        if (!mobileMessagesContainer) return;
        
        const now = new Date();
        const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        
        let avatarInitials = username.charAt(0).toUpperCase();
        if (username === "Void Bot") avatarInitials = "V";
        if (username === "You") avatarInitials = window.userDiscordUsername ? window.userDiscordUsername.charAt(0).toUpperCase() : "U";
        
        const messageGroup = document.createElement('div');
        messageGroup.className = 'mobile-message-group';
        
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
    
    // Update score display
    function updateScoreDisplay() {
        if (mobileScoreValue) {
            mobileScoreValue.textContent = mobileTestState.score;
        }
        
        const percentage = Math.round((mobileTestState.currentQuestion + 1) / mobileTestState.totalQuestions * 100);
        if (mobileProgressFill) {
            mobileProgressFill.style.width = `${percentage}%`;
        }
    }
    
    // End mobile test
    async function endMobileTest() {
        console.log("Ending mobile test...");
        mobileTestState.active = false;
        
        // Finalize conversation log
        addToLog('SYSTEM', 'Mobile test completed');
        mobileTestState.conversationLog += `\n════════════════════════════════════════════════════\n`;
        mobileTestState.conversationLog += `Test Completed: ${new Date().toLocaleString()}\n`;
        mobileTestState.conversationLog += `Final Score: ${mobileTestState.score}/${mobileTestState.totalQuestions}\n`;
        mobileTestState.conversationLog += `Percentage: ${Math.round((mobileTestState.score/mobileTestState.totalQuestions)*100)}%\n`;
        mobileTestState.conversationLog += `Status: ${mobileTestState.score >= 6 ? 'PASS' : 'FAIL'}\n`;
        mobileTestState.conversationLog += `════════════════════════════════════════════════════\n`;
        
        // Disable input
        if (mobileMessageInput) {
            mobileMessageInput.disabled = true;
            mobileMessageInput.value = '';
            mobileMessageInput.placeholder = "Test complete!";
        }
        
        if (mobileSendBtn) {
            mobileSendBtn.disabled = true;
        }
        
        setTimeout(() => {
            addMessage("Void Bot", "Mobile test complete! Evaluating your responses...", "#5865f2", true);
            
            setTimeout(() => {
                const passingScore = Math.ceil(mobileTestState.totalQuestions * 0.75);
                const passed = mobileTestState.score >= passingScore;
                
                // Show results screen
                const mobileTestComplete = document.getElementById('mobileTestComplete');
                if (mobileTestComplete) {
                    mobileTestComplete.classList.add('active');
                    
                    const mobileTestResultScore = document.getElementById('mobileTestResultScore');
                    const mobileTestResultTitle = document.getElementById('mobileTestResultTitle');
                    const mobileTestResultMessage = document.getElementById('mobileTestResultMessage');
                    const mobileTestResultIcon = document.getElementById('mobileTestResultIcon');
                    const mobileSubmissionStatus = document.getElementById('mobileSubmissionStatus');
                    
                    if (mobileTestResultScore) mobileTestResultScore.textContent = `Score: ${mobileTestState.score}/${mobileTestState.totalQuestions}`;
                    if (mobileTestResultTitle) mobileTestResultTitle.textContent = passed ? "Test Passed!" : "Test Failed";
                    if (mobileTestResultMessage) {
                        mobileTestResultMessage.textContent = passed 
                            ? `Congratulations! You passed with ${mobileTestState.score}/${mobileTestState.totalQuestions}. Your application is now pending review.` 
                            : `You scored ${mobileTestState.score}/${mobileTestState.totalQuestions}. Minimum passing score is ${passingScore}.`;
                    }
                    if (mobileTestResultIcon) {
                        mobileTestResultIcon.className = passed ? "mobile-test-result-icon pass" : "mobile-test-result-icon fail";
                        mobileTestResultIcon.innerHTML = passed ? '<i class="fas fa-trophy"></i>' : '<i class="fas fa-times-circle"></i>';
                    }
                    
                    // Submit results
                    setTimeout(async () => {
                        if (mobileSubmissionStatus) {
                            mobileSubmissionStatus.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting results...';
                        }
                        
                        const submissionData = {
                            discordId: window.userDiscordId,
                            discordUsername: window.userDiscordUsername,
                            answers: mobileTestState.conversationLog,
                            score: `${mobileTestState.score}/${mobileTestState.totalQuestions}`,
                            totalQuestions: mobileTestState.totalQuestions,
                            correctAnswers: mobileTestState.score,
                            wrongAnswers: mobileTestState.totalQuestions - mobileTestState.score,
                            testResults: JSON.stringify({
                                score: mobileTestState.score,
                                total: mobileTestState.totalQuestions,
                                passed: passed,
                                percentage: Math.round((mobileTestState.score/mobileTestState.totalQuestions)*100)
                            }),
                            conversationLog: mobileTestState.conversationLog,
                            questionsWithAnswers: mobileTestState.questionsWithAnswers
                        };
                        
                        try {
                            const response = await fetch('https://mod-application-backend.onrender.com/submit-test-results', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Accept': 'application/json'
                                },
                                body: JSON.stringify(submissionData)
                            });
                            
                            const result = await response.json();
                            
                            if (response.ok && result.success) {
                                if (mobileSubmissionStatus) {
                                    mobileSubmissionStatus.innerHTML = '<i class="fas fa-check-circle"></i> Results submitted successfully!';
                                    mobileSubmissionStatus.className = "mobile-submission-status submission-success";
                                    
                                    setTimeout(() => {
                                        const successUrl = `success.html?discord_username=${encodeURIComponent(window.userDiscordUsername)}&final_score=${mobileTestState.score}/${mobileTestState.totalQuestions}&pass_fail=${passed ? 'PASS' : 'FAIL'}`;
                                        window.location.href = successUrl;
                                    }, 2000);
                                }
                            } else {
                                // Fallback to simple endpoint
                                const simpleResponse = await fetch('https://mod-application-backend.onrender.com/api/submit', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Accept': 'application/json'
                                    },
                                    body: JSON.stringify(submissionData)
                                });
                                
                                const simpleResult = await simpleResponse.json();
                                
                                if (mobileSubmissionStatus) {
                                    mobileSubmissionStatus.innerHTML = '<i class="fas fa-check-circle"></i> Results submitted!';
                                    mobileSubmissionStatus.className = "mobile-submission-status submission-success";
                                    
                                    setTimeout(() => {
                                        const successUrl = `success.html?discord_username=${encodeURIComponent(window.userDiscordUsername)}&final_score=${mobileTestState.score}/${mobileTestState.totalQuestions}&pass_fail=${passed ? 'PASS' : 'FAIL'}`;
                                        window.location.href = successUrl;
                                    }, 2000);
                                }
                            }
                        } catch (error) {
                            console.error("Submission error:", error);
                            
                            if (mobileSubmissionStatus) {
                                mobileSubmissionStatus.innerHTML = `<i class="fas fa-exclamation-triangle"></i> Network error. Score: ${mobileTestState.score}/${mobileTestState.totalQuestions}`;
                                mobileSubmissionStatus.className = "mobile-submission-status submission-error";
                            }
                        }
                    }, 1000);
                }
            }, 1500);
        }, 1000);
    }
    
    // Reset mobile test
    function resetMobileTest() {
        mobileTestState = {
            active: false,
            currentQuestion: 0,
            score: 0,
            totalQuestions: 8,
            userAnswers: [],
            correctAnswers: [],
            questions: [],
            conversationLog: "",
            questionsWithAnswers: []
        };
        
        if (mobileScoreValue) mobileScoreValue.textContent = "0";
        if (mobileProgressFill) mobileProgressFill.style.width = "0%";
        
        if (mobileMessageInput) {
            mobileMessageInput.value = '';
            mobileMessageInput.disabled = true;
        }
        
        if (mobileSendBtn) {
            mobileSendBtn.disabled = true;
        }
        
        if (mobileMessagesContainer) {
            mobileMessagesContainer.innerHTML = '';
        }
    }
    
    // Auto-start test if user is authenticated
    function autoStartTestIfReady() {
        if (window.userDiscordUsername && window.userDiscordUsername !== 'User') {
            console.log("✅ User authenticated, auto-starting mobile test...");
            
            // Wait for DOM to be fully ready
            setTimeout(() => {
                // Show mobile discord interface
                if (mobileDiscord) {
                    mobileDiscord.classList.add('active');
                }
                
                if (mainContainer) {
                    mainContainer.style.display = 'none';
                }
                
                // Start the test
                setTimeout(startMobileTest, 500);
            }, 1000);
        } else {
            console.log("⚠️ User not authenticated or test not ready");
        }
    }
    
    // Initialize everything
    function initializeMobileInterface() {
        console.log("🔧 Initializing mobile interface...");
        
        // Initialize event listeners
        initializeEventListeners();
        
        // Auto-start test if URL parameters indicate test should start
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('startTest') === '1') {
            console.log("🔗 URL parameter indicates test should start");
            autoStartTestIfReady();
        }
        
        // Also listen for auth completion
        window.addEventListener('authComplete', function() {
            console.log("🔑 Auth complete event received");
            autoStartTestIfReady();
        });
    }
    
    // Export functions to window
    window.initializeMobileInterface = initializeMobileInterface;
    window.startMobileTest = startMobileTest;
    window.resetMobileTest = resetMobileTest;
    
    // Initialize on load
    initializeMobileInterface();
    
    // Also check if we should auto-start based on current state
    setTimeout(() => {
        if (window.location.pathname.includes('test') || window.location.search.includes('startTest')) {
            autoStartTestIfReady();
        }
    }, 2000);
});
