// Discord Test Interface Logic - ENHANCED WITH CONVERSATION LOGS
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
    
    // Initialize conversation log
    function initConversationLog() {
        conversationLog = `═══════════════════════════════════════════════════════════════════\n`;
        conversationLog += `                     VOID ESPORTS MOD TEST CONVERSATION LOG\n`;
        conversationLog += `═══════════════════════════════════════════════════════════════════\n\n`;
        conversationLog += `Test Started: ${new Date().toLocaleString()}\n`;
        conversationLog += `User: ${window.userDiscordUsername || 'Unknown'} (${window.userDiscordId || 'N/A'})\n`;
        conversationLog += `Test ID: test_${Date.now()}\n`;
        conversationLog += `═══════════════════════════════════════════════════════════════════\n\n`;
    }
    
    // Add to conversation log
    function addToConversationLog(speaker, message, timestamp = null) {
        const time = timestamp || new Date();
        const timeStr = `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}:${time.getSeconds().toString().padStart(2, '0')}`;
        
        conversationLog += `[${timeStr}] ${speaker}: ${message}\n`;
        
        // Add separator for bot responses
        if (speaker === 'VOID BOT') {
            conversationLog += `${'-'.repeat(60)}\n`;
        }
        
        // Keep log manageable
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
            explanation: q.explanation
        }));
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
        
        // Initialize conversation log
        initConversationLog();
        
        // Add initial conversation
        addToConversationLog('SYSTEM', 'Test initialized');
        addToConversationLog('VOID BOT', 'Welcome to the Void Esports Moderator Certification Test.');
        
        // ... [rest of start test function remains similar] ...
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
        
        // Add to conversation log
        addToConversationLog('USER', userAnswer);
        
        // ... [rest of check answer logic] ...
        
        // Add to questionsWithAnswers
        questionsWithAnswers.push({
            question: `User (${question.user}): ${question.userMessage}`,
            answer: userAnswer,
            correct: isCorrect,
            explanation: question.explanation
        });
        
        return isCorrect;
    }
    
    // End test with enhanced submission
    async function endTest() {
        console.log("Ending test with conversation logs...");
        testActive = false;
        
        // Finalize conversation log
        addToConversationLog('SYSTEM', 'Test completed');
        conversationLog += `\n═══════════════════════════════════════════════════════════════════\n`;
        conversationLog += `Test Completed: ${new Date().toLocaleString()}\n`;
        conversationLog += `Final Score: ${testScore}/${testTotalQuestions}\n`;
        conversationLog += `Status: ${testScore >= 6 ? 'PASS' : 'FAIL'}\n`;
        conversationLog += `═══════════════════════════════════════════════════════════════════\n`;
        
        // Prepare enhanced submission data
        const submissionData = {
            discordId: window.userDiscordId,
            discordUsername: window.userDiscordUsername,
            answers: conversationLog, // Use conversation log as answers
            score: `${testScore}/${testTotalQuestions}`,
            totalQuestions: testTotalQuestions,
            correctAnswers: testScore,
            wrongAnswers: testTotalQuestions - testScore,
            testResults: JSON.stringify({
                score: testScore,
                total: testTotalQuestions,
                passed: testScore >= 6,
                date: new Date().toISOString(),
                questions: testQuestions.map(q => q.userMessage),
                userAnswers: userAnswers,
                correctAnswers: correctAnswers
            }),
            conversationLog: conversationLog,
            questionsWithAnswers: formatQuestionsWithAnswers()
        };
        
        console.log("Submitting enhanced data with conversation logs...");
        
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
