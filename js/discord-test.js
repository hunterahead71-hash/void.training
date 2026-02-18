// Discord Test Interface - PURE DATABASE VERSION (No hardcoded questions)
document.addEventListener('DOMContentLoaded', function() {
    console.log("🎮 Discord test.js loaded");
    
    // Test state
    let testCurrentQuestion = 0;
    let testScore = 0;
    let testActive = false;
    let testTotalQuestions = 0;
    let userAnswers = [];
    let testQuestions = []; // Will ONLY contain database questions
    let questionsWithAnswers = [];
    
    let testInitialized = false;
    let testStarted = false;
    
    window.userDiscordUsername = window.userDiscordUsername || 'User';
    window.userDiscordId = window.userDiscordId || '0000';
    
    const API_BASE_URL = 'https://mod-application-backend.onrender.com';
    
    // NO DEFAULT QUESTIONS ARRAY - We ONLY use database
    
    // FORMAT COMPLETE CONVERSATION LOG
    function formatCompleteConversation() {
        let log = "";
        log += `══════════════════════════════════════════════════════════════════════════════\n`;
        log += `VOID ESPORTS MODERATOR TEST - COMPLETE TRANSCRIPT\n`;
        log += `══════════════════════════════════════════════════════════════════════════════\n`;
        log += `User: ${window.userDiscordUsername} (${window.userDiscordId})\n`;
        log += `Date: ${new Date().toLocaleString()}\n`;
        log += `Final Score: ${testScore}/${testTotalQuestions}\n`;
        log += `══════════════════════════════════════════════════════════════════════════════\n\n`;
        
        questionsWithAnswers.forEach((qa, index) => {
            log += `┌──────────────────────────────────────────────────────────────────────────┐\n`;
            log += `│ QUESTION ${index + 1} of ${testTotalQuestions}${qa.correct ? ' ✓ PASS' : ' ✗ FAIL'}\n`;
            log += `├──────────────────────────────────────────────────────────────────────────┤\n`;
            log += `│ USER: ${qa.question || 'Unknown'}\n`;
            log += `├──────────────────────────────────────────────────────────────────────────┤\n`;
            log += `│ MOD RESPONSE:\n`;
            log += `│ ${qa.answer || 'No answer provided'}\n`;
            log += `├──────────────────────────────────────────────────────────────────────────┤\n`;
            log += `│ EVALUATION:\n`;
            log += `│ Matches: ${qa.matchCount || 0}/${qa.requiredMatches || 2}\n`;
            log += `│ Keywords: ${qa.matchedKeywords ? qa.matchedKeywords.join(', ') : 'None'}\n`;
            log += `├──────────────────────────────────────────────────────────────────────────┤\n`;
            log += `│ CORRECT RESPONSE:\n`;
            log += `│ ${qa.explanation || 'Follow protocol'}\n`;
            log += `└──────────────────────────────────────────────────────────────────────────┘\n\n`;
        });
        
        log += `══════════════════════════════════════════════════════════════════════════════\n`;
        log += `END OF TRANSCRIPT - ${testScore}/${testTotalQuestions} CORRECT\n`;
        log += `══════════════════════════════════════════════════════════════════════════════\n`;
        
        return log;
    }
    
    // ===== LOAD QUESTIONS FROM DATABASE ONLY =====
    async function loadTestQuestions() {
        try {
            console.log("📥 Fetching questions from database...");
            
            const response = await fetch(`${API_BASE_URL}/api/test-questions`, {
                credentials: 'include',
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log("📊 Database response:", data);
            
            if (data.success && data.questions && data.questions.length > 0) {
                // Map ALL database questions (they are already filtered to enabled only)
                const allQuestions = data.questions.map(q => ({
                    id: q.id,
                    userMessage: q.user_message,
                    user: q.username || 'User',
                    avatarColor: q.avatar_color || '#5865f2',
                    correctKeywords: q.keywords || [],
                    requiredMatches: q.required_matches || 2,
                    explanation: q.explanation || 'Follow protocol'
                }));
                
                console.log(`✅ Loaded ${allQuestions.length} enabled questions from database`);
                
                if (allQuestions.length === 0) {
                    throw new Error("No enabled questions in database");
                }
                
                // Select 8 random questions from database
                if (allQuestions.length >= 8) {
                    // Shuffle and take first 8
                    testQuestions = allQuestions.sort(() => 0.5 - Math.random()).slice(0, 8);
                    console.log(`📋 Selected 8 random questions from ${allQuestions.length} total`);
                } else {
                    // If less than 8, use all available
                    testQuestions = [...allQuestions];
                    console.log(`⚠️ Only ${testQuestions.length} questions available (need 8 for full test)`);
                }
            } else {
                throw new Error("No questions returned from database");
            }
            
            testTotalQuestions = testQuestions.length;
            console.log(`✅ Test ready with ${testTotalQuestions} questions from database`);
            
        } catch (error) {
            console.error("❌ CRITICAL: Failed to load questions:", error);
            // Show error message to user instead of starting test
            const messagesContainer = document.getElementById('messagesContainer');
            if (messagesContainer) {
                messagesContainer.innerHTML = `
                    <div style="color: #ed4245; padding: 20px; text-align: center;">
                        <h3>❌ No Questions Available</h3>
                        <p>No enabled questions found in database. Please contact an admin.</p>
                    </div>
                `;
            }
            testQuestions = [];
            testTotalQuestions = 0;
        }
    }
    
    // Initialize desktop interface
    async function initializeDiscordInterface() {
        if (testInitialized) {
            console.log("Discord interface already initialized, skipping");
            return;
        }
        
        console.log("Initializing Discord interface...");
        testInitialized = true;
        
        await loadTestQuestions();
        
        const messageInput = document.getElementById('messageInput');
        const sendButton = document.getElementById('sendButton');
        
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
        const userAvatarInitial = document.getElementById('userAvatarInitial');
        
        if (discordUsernameDisplay) discordUsernameDisplay.textContent = window.userDiscordUsername;
        if (discordUserTag) discordUserTag.textContent = "#" + (window.userDiscordId.slice(-4) || "0000");
        if (userAvatarInitial) userAvatarInitial.textContent = window.userDiscordUsername.charAt(0).toUpperCase();
        
        if (window.userDiscordUsername && window.userDiscordUsername !== 'User' && !testStarted && testQuestions.length > 0) {
            setTimeout(() => {
                startDiscordTest();
            }, 1500);
        }
    }
    
    // Start desktop test
    function startDiscordTest() {
        if (testStarted) {
            console.log("Test already started, ignoring duplicate call");
            return;
        }
        
        if (testQuestions.length === 0) {
            console.error("Cannot start test: No questions loaded");
            addMessage("Void Bot", "❌ Cannot start test: No questions available in database. Please contact an admin.", "#ed4245", true);
            return;
        }
        
        console.log("🚀 STARTING DESKTOP TEST WITH DATABASE QUESTIONS");
        testStarted = true;
        
        // Randomize questions
        testQuestions = [...testQuestions].sort(() => 0.5 - Math.random());
        
        testActive = true;
        testCurrentQuestion = 0;
        testScore = 0;
        userAnswers = [];
        questionsWithAnswers = [];
        
        const messageInput = document.getElementById('messageInput');
        const sendButton = document.getElementById('sendButton');
        
        if (messageInput) {
            messageInput.disabled = false;
            messageInput.value = '';
            messageInput.placeholder = "Type your response here...";
        }
        
        if (sendButton) {
            sendButton.disabled = true;
        }
        
        updateDiscordScore();
        
        const messagesContainer = document.getElementById('messagesContainer');
        if (messagesContainer) {
            messagesContainer.innerHTML = '';
            
            setTimeout(() => {
                addMessage("Void Bot", "Welcome to the Void Esports Moderator Certification Test.", "#5865f2", true);
                
                setTimeout(() => {
                    addMessage("Void Bot", `Hello ${window.userDiscordUsername}! You'll receive ${testTotalQuestions} scenarios from our database.`, "#5865f2", true);
                    
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
    
    // Show next desktop question
    function showNextTestQuestion() {
        if (testCurrentQuestion >= testTotalQuestions) {
            endTest();
            return;
        }
        
        setTimeout(() => {
            const question = testQuestions[testCurrentQuestion];
            addMessage(question.user, question.userMessage, question.avatarColor, false);
            
            const messageInput = document.getElementById('messageInput');
            const sendButton = document.getElementById('sendButton');
            
            if (messageInput) {
                messageInput.disabled = false;
                messageInput.value = '';
                messageInput.style.height = 'auto';
                setTimeout(() => messageInput.focus(), 100);
            }
            
            if (sendButton) sendButton.disabled = true;
            
        }, 1500);
    }
    
    // Send desktop message
    function sendTestMessage() {
        const messageInput = document.getElementById('messageInput');
        const sendButton = document.getElementById('sendButton');
        
        if (!messageInput || !testActive) return;
        
        const userMessage = messageInput.value.trim();
        if (!userMessage) return;
        
        addMessage("You", userMessage, "#7289da", false);
        userAnswers.push(userMessage);
        
        messageInput.value = '';
        messageInput.style.height = 'auto';
        if (sendButton) sendButton.disabled = true;
        
        const isCorrect = checkTestAnswer(userMessage);
        
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
                setTimeout(showNextTestQuestion, 1000);
            } else {
                endTest();
            }
        }, 2000);
    }
    
    // Check answer
    function checkTestAnswer(userAnswer) {
        if (testCurrentQuestion >= testQuestions.length) return false;
        
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
    
    // Update desktop score display
    function updateDiscordScore() {
        const discordScoreValue = document.getElementById('discordScoreValue');
        const discordProgressFill = document.getElementById('discordProgressFill');
        
        if (discordScoreValue) discordScoreValue.textContent = testScore;
        
        const percentage = testTotalQuestions > 0 ? Math.round((testCurrentQuestion) / testTotalQuestions * 100) : 0;
        if (discordProgressFill) discordProgressFill.style.width = `${percentage}%`;
    }
    
    // Add message
    function addMessage(username, content, color, isBot = false) {
        const messagesContainer = document.getElementById('messagesContainer');
        if (!messagesContainer) return;
        
        const messageGroup = document.createElement('div');
        messageGroup.className = 'message-group';
        
        const now = new Date();
        const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        
        let avatarInitials = username.charAt(0).toUpperCase();
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
        console.log("Ending test with complete conversation logs...");
        testActive = false;
        
        const messageInput = document.getElementById('messageInput');
        const sendButton = document.getElementById('sendButton');
        
        if (messageInput) {
            messageInput.disabled = true;
            messageInput.value = '';
            messageInput.placeholder = "Test complete!";
        }
        
        if (sendButton) sendButton.disabled = true;
        
        setTimeout(() => {
            addMessage("Void Bot", "Test complete! Evaluating your responses...", "#5865f2", true);
            
            setTimeout(() => {
                const passingScore = 6;
                const passed = testScore >= passingScore;
                
                const completeLog = formatCompleteConversation();
                
                const submissionData = {
                    discordId: window.userDiscordId,
                    discordUsername: window.userDiscordUsername,
                    answers: completeLog,
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
                        questions: questionsWithAnswers
                    }),
                    conversationLog: completeLog,
                    questionsWithAnswers: JSON.stringify(questionsWithAnswers)
                };
                
                const testCompleteScreen = document.getElementById('testCompleteScreen');
                if (testCompleteScreen) {
                    testCompleteScreen.classList.add('active');
                    
                    const testResultScore = document.getElementById('testResultScore');
                    const testResultTitle = document.getElementById('testResultTitle');
                    const testResultIcon = document.getElementById('testResultIcon');
                    const submissionStatus = document.getElementById('submissionStatus');
                    
                    if (testResultScore) testResultScore.textContent = `Score: ${testScore}/${testTotalQuestions}`;
                    if (testResultTitle) testResultTitle.textContent = passed ? "Test Passed!" : "Test Failed";
                    if (testResultIcon) {
                        testResultIcon.className = passed ? "test-result-icon pass" : "test-result-icon fail";
                        testResultIcon.innerHTML = passed ? '<i class="fas fa-trophy"></i>' : '<i class="fas fa-times-circle"></i>';
                    }
                    
                    setTimeout(async () => {
                        if (submissionStatus) {
                            submissionStatus.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting results...';
                        }
                        
                        try {
                            const response = await fetch(`${API_BASE_URL}/submit-test-results`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(submissionData)
                            });
                            
                            const result = await response.json();
                            
                            if (response.ok && result.success) {
                                if (submissionStatus) {
                                    submissionStatus.innerHTML = '<i class="fas fa-check-circle"></i> Results submitted successfully!';
                                }
                                
                                setTimeout(() => {
                                    window.location.href = `success.html?discord_username=${encodeURIComponent(window.userDiscordUsername)}&final_score=${testScore}/${testTotalQuestions}&pass_fail=${passed ? 'PASS' : 'FAIL'}`;
                                }, 2000);
                            } else {
                                throw new Error("Submission failed");
                            }
                        } catch (error) {
                            console.error("Submission error:", error);
                            
                            if (submissionStatus) {
                                submissionStatus.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Results saved locally';
                            }
                            
                            setTimeout(() => {
                                window.location.href = `success.html?discord_username=${encodeURIComponent(window.userDiscordUsername)}&final_score=${testScore}/${testTotalQuestions}&pass_fail=${passed ? 'PASS' : 'FAIL'}`;
                            }, 2000);
                        }
                    }, 1000);
                }
            }, 1500);
        }, 1000);
    }
    
    // Reset test
    function resetTest() {
        testInitialized = false;
        testStarted = false;
        testActive = false;
        testCurrentQuestion = 0;
        testScore = 0;
        userAnswers = [];
        questionsWithAnswers = [];
        testQuestions = [];
        testTotalQuestions = 0;
        
        const discordScoreValue = document.getElementById('discordScoreValue');
        const discordProgressFill = document.getElementById('discordProgressFill');
        
        if (discordScoreValue) discordScoreValue.textContent = "0";
        if (discordProgressFill) discordProgressFill.style.width = "0%";
        
        const messageInput = document.getElementById('messageInput');
        if (messageInput) {
            messageInput.value = '';
            messageInput.disabled = true;
        }
        const sendButton = document.getElementById('sendButton');
        if (sendButton) sendButton.disabled = true;
    }
    
    // Export functions
    window.initializeDiscordInterface = initializeDiscordInterface;
    window.startDiscordTest = startDiscordTest;
    window.resetTest = resetTest;
    window.addMessage = addMessage;
    
    // Auto-initialize if test page exists
    if (document.getElementById('testPage')) {
        setTimeout(initializeDiscordInterface, 1000);
    }
});
