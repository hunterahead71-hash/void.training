// Discord Test Interface Logic (PC)
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
    
    // Test questions pool
    const allTestQuestions = [
        {
            id: 1,
            userMessage: "Hi i want to join void",
            correctKeywords: ["age", "how old", "years old", "roster", "channel", "requirement", "fit", "category", "join", "hello", "hi", "help", "assist", "requirements", "first", "initial"],
            requiredMatches: 2,
            user: "Nicks Cold",
            avatarColor: "#ed4245",
            explanation: "Your response should ask for their age and direct them to #how-to-join-roster to read requirements."
        },
        {
            id: 2,
            userMessage: "i want to join as a pro",
            correctKeywords: ["tracker", "fortnite tracker", "stats", "ranking", "pr", "send", "trapped", "cheif", "ping", "earnings", "wait", "pro", "information"],
            requiredMatches: 2,
            user: "Nicks Cold",
            avatarColor: "#ed4245",
            explanation: "Ask for their Fortnite tracker and ping @trapped or @cheif for pro applications."
        },
        {
            id: 3,
            userMessage: "i want to join as creative roster",
            correctKeywords: ["clip", "video", "footage", "freebuilding", "send", "creativedepartment", "ping", "wait", "at least 2", "freebuild", "review"],
            requiredMatches: 2,
            user: "Nicks Cold",
            avatarColor: "#ed4245",
            explanation: "Ask for at least 2 clips of freebuilding and ping @creativedepartment."
        },
        {
            id: 4,
            userMessage: "i want to join as academy player",
            correctKeywords: ["tracker", "fortnite tracker", "send", "verify", "username", "name change", "add void", "team.void", "proof", "academy", "requirements"],
            requiredMatches: 2,
            user: "Nicks Cold",
            avatarColor: "#ed4245",
            explanation: "Ask for their Fortnite tracker, verify PR meets requirements, ask for username change and team.void proof."
        },
        {
            id: 5,
            userMessage: "im 12 years old is that okay?",
            correctKeywords: ["cheif", "trapped", "ping", "underage", "minimum age", "13", "not allowed", "ban", "sorry", "violation"],
            requiredMatches: 2,
            user: "Nicks Cold",
            avatarColor: "#ed4245",
            explanation: "Underage users (under 13) should be pinged to @cheif or informed about age requirements."
        },
        {
            id: 6,
            userMessage: "i want to join as void grinder",
            correctKeywords: ["username", "discord name", "add void", "team.void", "proof", "change", "grinder", "represent"],
            requiredMatches: 2,
            user: "Nicks Cold",
            avatarColor: "#ed4245",
            explanation: "Ask them to change Discord/Fortnite username to include 'Void' and use team.void with proof."
        },
        {
            id: 7,
            userMessage: "i will nuke this server",
            correctKeywords: ["cheif", "trapped", "ping", "threat", "dangerous", "ban", "immediately", "security", "nuke", "unacceptable"],
            requiredMatches: 2,
            user: "Nicks Cold",
            avatarColor: "#ed4245",
            explanation: "Threats should result in immediate ping to @cheif and mention of potential ban."
        },
        {
            id: 8,
            userMessage: "i wanna join as a content creator",
            correctKeywords: ["social", "social media", "links", "send", "contentdep", "ping", "wait", "followers", "content", "review"],
            requiredMatches: 2,
            user: "Nicks Cold",
            avatarColor: "#ed4245",
            explanation: "Ask for social media links and ping @contentdep for content creator applications."
        }
    ];
    
    // Get random test questions
    function getRandomTestQuestions() {
        const shuffled = [...allTestQuestions].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 8);
    }
    
    // Initialize Discord interface (PC)
    function initializeDiscordInterface() {
        // DOM elements
        const messageInput = document.querySelector('.message-input');
        const sendButton = document.querySelector('.message-input-send');
        const backToTrainingBtn = document.getElementById('backToTraining');
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
                    sendTestMessage();
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
                <div class="message">${content}</div>
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
        if (!messageInput || !testActive) return;
        
        const userMessage = messageInput.value.trim();
        if (!userMessage) return;
        
        addMessage("You", userMessage, "#7289da", false);
        userAnswers.push(userMessage);
        
        messageInput.value = '';
        messageInput.style.height = 'auto';
        const sendButton = document.querySelector('.message-input-send');
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
        }, 1000);
    }
    
    // Check test answer (PC)
    function checkTestAnswer(userAnswer) {
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
                        messageText.appendChild(badge);
                    }
                }
            }
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
                        messageText.appendChild(badge);
                    }
                }
            }
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
        
        // Start question sequence
        setTimeout(() => {
            showNextTestQuestion();
        }, 2000);
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
                const passingScore = testTotalQuestions - 2;
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
                            ? `Congratulations! You passed with a score of ${testScore}/${testTotalQuestions}.` 
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
                            }
                            
                            // 1. Send to Discord webhook
                            const discordSuccess = await sendResultsToDiscord(
                                window.userDiscordUsername, 
                                testScore, 
                                testTotalQuestions, 
                                passed, 
                                conversationLog
                            );
                            
                            // 2. Send to your backend API
                            try {
                                const applicationData = {
                                    answers: conversationLog,
                                    score: `${testScore}/${testTotalQuestions}`,
                                    discordUsername: window.userDiscordUsername
                                };
                                
                                const backendResponse = await fetch("https://mod-application-backend.onrender.com/apply", {
                                    method: "POST",
                                    credentials: "include",
                                    headers: {
                                        "Content-Type": "application/json"
                                    },
                                    body: JSON.stringify(applicationData)
                                });
                                
                                const backendResult = await backendResponse.json();
                                
                                if (backendResponse.ok) {
                                    if (submissionStatus) {
                                        submissionStatus.innerHTML = '<i class="fas fa-check-circle"></i> Results submitted successfully!';
                                        submissionStatus.className = "submission-status submission-success";
                                    }
                                    
                                    // Redirect to success page after 3 seconds
                                    setTimeout(() => {
                                        window.location.href = `success.html?discord_username=${encodeURIComponent(window.userDiscordUsername)}&final_score=${testScore}/${testTotalQuestions}&pass_fail=${passed ? 'PASS' : 'FAIL'}&test_date=${encodeURIComponent(new Date().toLocaleString())}`;
                                    }, 3000);
                                    
                                } else {
                                    throw new Error("Backend submission failed");
                                }
                            } catch (backendError) {
                                console.error("Backend submission error:", backendError);
                                
                                if (submissionStatus) {
                                    submissionStatus.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Results logged but backend submission failed.';
                                    submissionStatus.className = "submission-status submission-error";
                                }
                                
                                // Still redirect to success page
                                setTimeout(() => {
                                    window.location.href = `success.html?discord_username=${encodeURIComponent(window.userDiscordUsername)}&final_score=${testScore}/${testTotalQuestions}&pass_fail=${passed ? 'PASS' : 'FAIL'}&test_date=${encodeURIComponent(new Date().toLocaleString())}`;
                                }, 3000);
                            }
                            
                        } catch (error) {
                            console.error('Submission error:', error);
                            
                            if (submissionStatus) {
                                submissionStatus.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Submission failed. Please contact staff.';
                                submissionStatus.className = "submission-status submission-error";
                            }
                        }
                    }, 1000);
                }
            }, 1500);
        }, 1000);
    }
    
    // DISCORD WEBHOOK FUNCTION
    async function sendResultsToDiscord(discordUsername, score, totalQuestions, passed, conversationLog) {
        try {
            const webhookURL = "https://discord.com/api/webhooks/1469220699183906857/ekA7UCwtF0-2Gph76yGOgHRItTgpUfc_IjwygayTvjCP6OUdkpLwZPDZ2z1LD5B3zWry";
            
            let formattedConversation = "```\n";
            const lines = conversationLog.split('\n');
            for (let i = 0; i < Math.min(lines.length, 30); i++) {
                formattedConversation += lines[i] + '\n';
            }
            if (lines.length > 30) {
                formattedConversation += `... and ${lines.length - 30} more lines\n`;
            }
            formattedConversation += "```";
            
            const mainEmbed = {
                title: "📬 VOID MOD CERTIFICATION TEST RESULTS",
                color: passed ? 0x00ff00 : 0xff0000,
                timestamp: new Date().toISOString(),
                fields: [
                    {
                        name: "👤 CANDIDATE",
                        value: `**Username:** \`${discordUsername}\``,
                        inline: false
                    },
                    {
                        name: "📊 SCORE",
                        value: `**Score:** \`${score}/${totalQuestions}\`\n**Percentage:** \`${Math.round((score/totalQuestions)*100)}%\`\n**Result:** ${passed ? "✅ PASS" : "❌ FAIL"}`,
                        inline: false
                    },
                    {
                        name: "💬 CONVERSATION LOG",
                        value: formattedConversation,
                        inline: false
                    }
                ],
                footer: {
                    text: "Void Esports • Mod Certification System",
                    icon_url: "https://cdn.discordapp.com/embed/avatars/0.png"
                }
            };
            
            const payload = { 
                embeds: [mainEmbed],
                username: "Void Mod Certification",
                avatar_url: "https://cdn.discordapp.com/embed/avatars/0.png",
                content: `📊 **MOD CERTIFICATION TEST COMPLETE**\n👤 **Candidate:** ${discordUsername}\n📝 **Score:** ${score}/${totalQuestions} ${passed ? '✅ **PASS**' : '❌ **FAIL**'}`
            };
            
            const response = await fetch(webhookURL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            
            return response.ok;
        } catch (error) {
            console.error("Discord webhook error:", error);
            return false;
        }
    }
    
    function resetTest() {
        testActive = false;
        testCurrentQuestion = 0;
        testScore = 0;
        userAnswers = [];
        correctAnswers = [];
        sessionTranscript = [];
        
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
});
