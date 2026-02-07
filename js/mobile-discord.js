// Mobile Discord Interface Logic
document.addEventListener('DOMContentLoaded', function() {
    // Mobile test state variables
    let mobileTestCurrentQuestion = 0;
    let mobileTestScore = 0;
    let mobileTestActive = false;
    let mobileTestTotalQuestions = 8;
    let mobileUserAnswers = [];
    let mobileCorrectAnswers = [];
    let mobileTestQuestions = [];
    let mobileSessionTranscript = [];
    
    // Get random test questions (same as desktop)
    function getRandomMobileTestQuestions() {
        const allTestQuestions = [
            {
                id: 1,
                userMessage: "Hi i want to join void",
                correctKeywords: ["age", "how old", "years old", "roster", "channel", "requirement", "fit", "category"],
                requiredMatches: 2,
                user: "Nicks Cold",
                avatarColor: "#ed4245"
            },
            // ... (same questions as desktop)
        ];
        
        const shuffled = [...allTestQuestions].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 8);
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
        
        // Send button
        if (mobileSendBtn && mobileMessageInput) {
            mobileMessageInput.addEventListener('input', function() {
                mobileSendBtn.disabled = this.value.trim() === '';
            });
            
            mobileMessageInput.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMobileMessage();
                }
            });
            
            mobileSendBtn.addEventListener('click', sendMobileMessage);
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
        
        // Start mobile test automatically
        if (window.userDiscordUsername && window.userDiscordUsername !== 'User') {
            console.log("Auto-starting mobile test for:", window.userDiscordUsername);
            setTimeout(() => {
                startMobileTest();
            }, 1000);
        }
    }
    
    // Start mobile test
    function startMobileTest() {
        console.log("Starting mobile test");
        
        mobileTestQuestions = getRandomMobileTestQuestions();
        mobileTestTotalQuestions = mobileTestQuestions.length;
        
        mobileTestActive = true;
        mobileTestCurrentQuestion = 0;
        mobileTestScore = 0;
        mobileUserAnswers = [];
        mobileCorrectAnswers = [];
        mobileSessionTranscript = [];
        
        // Clear existing messages
        const mobileMessagesContainer = document.getElementById('mobileMessagesContainer');
        if (mobileMessagesContainer) {
            mobileMessagesContainer.innerHTML = '';
        }
        
        updateMobileScore();
        
        const mobileMessageInput = document.getElementById('mobileMessageInput');
        if (mobileMessageInput) {
            mobileMessageInput.value = '';
            mobileMessageInput.disabled = false;
            mobileMessageInput.focus();
        }
        
        const mobileSendBtn = document.getElementById('mobileSendBtn');
        if (mobileSendBtn) mobileSendBtn.disabled = true;
        
        // Show welcome message
        setTimeout(() => {
            addMobileMessage("Void Bot", `Welcome to the Void Esports Moderator Certification Test, ${window.userDiscordUsername}!`, "#5865f2");
            
            setTimeout(() => {
                addMobileMessage("Void Bot", "You'll be presented with 8 simulated scenarios. Respond as you would as a moderator. Good luck!", "#5865f2");
                
                // Start question sequence
                setTimeout(() => {
                    showNextMobileQuestion();
                }, 2000);
            }, 1000);
        }, 500);
    }
    
    // Send mobile message
    function sendMobileMessage() {
        const mobileMessageInput = document.getElementById('mobileMessageInput');
        const mobileSendBtn = document.getElementById('mobileSendBtn');
        
        if (!mobileMessageInput || !mobileTestActive) return;
        
        const message = mobileMessageInput.value.trim();
        if (!message) return;
        
        // Add message to mobile chat
        addMobileMessage("You", message, "#7289da");
        mobileUserAnswers.push(message);
        
        mobileMessageInput.value = '';
        mobileMessageInput.style.height = 'auto';
        if (mobileSendBtn) mobileSendBtn.disabled = true;
        
        // Check answer
        const isCorrect = checkMobileAnswer(message);
        mobileCorrectAnswers.push(isCorrect);
        
        mobileMessageInput.disabled = true;
        
        setTimeout(() => {
            mobileTestCurrentQuestion++;
            if (mobileTestCurrentQuestion < mobileTestTotalQuestions) {
                showNextMobileQuestion();
            } else {
                endMobileTest();
            }
        }, 1000);
    }
    
    // Check mobile answer
    function checkMobileAnswer(userAnswer) {
        const question = mobileTestQuestions[mobileTestCurrentQuestion];
        const userAnswerLower = userAnswer.toLowerCase();
        
        let matchCount = 0;
        for (let keyword of question.correctKeywords) {
            if (userAnswerLower.includes(keyword.toLowerCase())) {
                matchCount++;
            }
        }
        
        const isCorrect = matchCount >= question.requiredMatches;
        
        if (isCorrect) {
            mobileTestScore++;
            updateMobileScore();
            
            // Add correct badge
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
                    lastMessage.querySelector('.mobile-message-content').appendChild(badge);
                }
            }
        } else {
            // Add incorrect badge
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
                    lastMessage.querySelector('.mobile-message-content').appendChild(badge);
                }
            }
        }
        
        return isCorrect;
    }
    
    // Update mobile score
    function updateMobileScore() {
        const mobileScoreValue = document.getElementById('mobileScoreValue');
        const mobileProgressFill = document.getElementById('mobileProgressFill');
        
        if (mobileScoreValue) mobileScoreValue.textContent = mobileTestScore;
        
        const percentage = Math.round((mobileTestCurrentQuestion / mobileTestTotalQuestions) * 100);
        if (mobileProgressFill) {
            mobileProgressFill.style.width = `${percentage}%`;
        }
    }
    
    // Add message to mobile chat
    function addMobileMessage(username, content, color) {
        const mobileMessagesContainer = document.getElementById('mobileMessagesContainer');
        if (!mobileMessagesContainer) return;
        
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
        if (username === "Nicks Cold") avatarInitials = "N";
        if (username === "Void Bot") avatarInitials = "V";
        
        messageGroup.innerHTML = `
            <div class="mobile-message-header">
                <div class="mobile-message-avatar" style="background-color: ${color}">
                    ${avatarInitials}
                </div>
                <div>
                    <span class="mobile-message-author">${username}</span>
                    ${username === "Void Bot" ? '<span class="mobile-bot-tag">BOT</span>' : ''}
                    <span class="mobile-message-timestamp">${timeString}</span>
                </div>
            </div>
            <div class="mobile-message-content">
                ${content}
            </div>
        `;
        
        mobileMessagesContainer.appendChild(messageGroup);
        mobileMessagesContainer.scrollTop = mobileMessagesContainer.scrollHeight;
    }
    
    // Show next mobile question
    function showNextMobileQuestion() {
        if (mobileTestCurrentQuestion >= mobileTestTotalQuestions) {
            endMobileTest();
            return;
        }
        
        setTimeout(() => {
            const question = mobileTestQuestions[mobileTestCurrentQuestion];
            addMobileMessage(question.user, question.userMessage, question.avatarColor);
            
            const mobileMessageInput = document.getElementById('mobileMessageInput');
            if (mobileMessageInput) {
                mobileMessageInput.disabled = false;
                mobileMessageInput.focus();
            }
        }, 1500);
    }
    
    // End mobile test
    async function endMobileTest() {
        mobileTestActive = false;
        
        setTimeout(() => {
            addMobileMessage("Void Bot", "Test complete! Your responses have been evaluated.", "#5865f2");
            
            setTimeout(() => {
                const passingScore = Math.ceil(mobileTestTotalQuestions * 0.75);
                const passed = mobileTestScore >= passingScore;
                
                // Show results screen
                const mobileTestComplete = document.getElementById('mobileTestComplete');
                if (mobileTestComplete) {
                    mobileTestComplete.classList.add('active');
                    
                    const mobileTestResultScore = document.getElementById('mobileTestResultScore');
                    const mobileTestResultTitle = document.getElementById('mobileTestResultTitle');
                    const mobileTestResultMessage = document.getElementById('mobileTestResultMessage');
                    const mobileTestResultIcon = document.getElementById('mobileTestResultIcon');
                    const mobileSubmissionStatus = document.getElementById('mobileSubmissionStatus');
                    
                    if (mobileTestResultScore) {
                        mobileTestResultScore.textContent = `Score: ${mobileTestScore}/${mobileTestTotalQuestions}`;
                    }
                    
                    if (mobileTestResultTitle) {
                        mobileTestResultTitle.textContent = passed ? "Test Passed!" : "Test Failed";
                    }
                    
                    if (mobileTestResultMessage) {
                        mobileTestResultMessage.textContent = passed 
                            ? `Congratulations! You passed with a score of ${mobileTestScore}/${mobileTestTotalQuestions}.` 
                            : `You scored ${mobileTestScore}/${mobileTestTotalQuestions}. Minimum passing score is ${passingScore}.`;
                    }
                    
                    if (mobileTestResultIcon) {
                        if (passed) {
                            mobileTestResultIcon.className = "mobile-test-result-icon pass";
                            mobileTestResultIcon.innerHTML = '<i class="fas fa-trophy"></i>';
                        } else {
                            mobileTestResultIcon.className = "mobile-test-result-icon fail";
                            mobileTestResultIcon.innerHTML = '<i class="fas fa-times-circle"></i>';
                        }
                    }
                    
                    // Submit results
                    setTimeout(async () => {
                        try {
                            if (mobileSubmissionStatus) {
                                mobileSubmissionStatus.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
                            }
                            
                            // Build conversation log
                            let conversationLog = "";
                            mobileSessionTranscript.forEach((entry, idx) => {
                                conversationLog += `[${entry.timestamp}] ${entry.speaker}: ${entry.message}\n`;
                            });
                            
                            // Send to backend
                            const applicationData = {
                                answers: conversationLog,
                                score: `${mobileTestScore}/${mobileTestTotalQuestions}`,
                                discordUsername: window.userDiscordUsername,
                                totalQuestions: mobileTestTotalQuestions,
                                correctAnswers: mobileTestScore,
                                wrongAnswers: mobileTestTotalQuestions - mobileTestScore,
                                testResults: JSON.stringify({
                                    transcript: conversationLog,
                                    userAnswers: mobileUserAnswers,
                                    correctAnswers: mobileCorrectAnswers
                                })
                            };
                            
                            const backendResponse = await fetch("https://mod-application-backend.onrender.com/apply", {
                                method: "POST",
                                credentials: "include",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify(applicationData)
                            });
                            
                            if (backendResponse.ok) {
                                if (mobileSubmissionStatus) {
                                    mobileSubmissionStatus.innerHTML = '<i class="fas fa-check-circle"></i> Submitted!';
                                    mobileSubmissionStatus.className = "mobile-submission-status submission-success";
                                }
                                
                                // Redirect to success page
                                setTimeout(() => {
                                    const successUrl = `success.html?discord_username=${encodeURIComponent(window.userDiscordUsername)}&final_score=${mobileTestScore}/${mobileTestTotalQuestions}&pass_fail=${passed ? 'PASS' : 'FAIL'}&test_date=${encodeURIComponent(new Date().toLocaleString())}&user_id=${window.userDiscordId}`;
                                    window.location.href = successUrl;
                                }, 3000);
                                
                            } else {
                                throw new Error("Submission failed");
                            }
                        } catch (error) {
                            console.error('Submission error:', error);
                            
                            if (mobileSubmissionStatus) {
                                mobileSubmissionStatus.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Failed';
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
        mobileTestActive = false;
        mobileTestCurrentQuestion = 0;
        mobileTestScore = 0;
        mobileUserAnswers = [];
        mobileCorrectAnswers = [];
        mobileSessionTranscript = [];
        
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
});
