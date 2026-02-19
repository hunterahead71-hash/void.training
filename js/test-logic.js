// Core Test Logic
const testLogic = {
    // Start the test
    async start(isMobile) {
        console.log('🚀 Starting test...');
        
        // Load questions from API if not already loaded
        if (!testState.questions || testState.questions.length === 0) {
            try {
                const apiBase = CONFIG.API_BASE_URL || 'https://mod-application-backend.onrender.com';
                const response = await fetch(`${apiBase}/api/test-questions/active`, {
                    credentials: 'include',
                    cache: 'no-store'
                });
                const data = await response.json();
                
                if (data.success && data.questions && data.questions.length > 0) {
                    testState.questions = data.questions.map(q => ({
                        id: q.id,
                        username: q.username || 'User',
                        avatarColor: q.avatar_color || '#5865f2',
                        message: q.user_message,
                        keywords: Array.isArray(q.keywords) ? q.keywords : [],
                        required: q.required_matches || 2,
                        feedback: q.explanation || 'Follow protocol',
                        order: q.order ?? q.id ?? 0
                    }));
                    testState.questions.sort((a, b) => (a.order || 0) - (b.order || 0));
                    console.log('Loaded', testState.questions.length, 'question(s) from API');
                } else {
                    testState.questions = [];
                }
            } catch (error) {
                console.error('Error loading questions:', error);
                testState.questions = window.TEST_QUESTIONS ? [...window.TEST_QUESTIONS] : [];
            }
        }
        
        const totalQuestions = testState.questions?.length || 0;
        if (totalQuestions === 0) {
            console.error('No questions available!');
            const ui = isMobile ? mobile : desktop;
            ui.clearMessages();
            ui.addMessage('Void Bot', 'There are no questions available at this time. Contact staff for help.', '#ed4245', true);
            return;
        }
        
        testState.active = true;
        testState.currentQuestion = 0;
        testState.score = 0;
        testState.userAnswers = [];
        testState.conversationLog = [];
        testState.questionsWithAnswers = [];
        testState.startTime = new Date().toISOString();

        const ui = isMobile ? mobile : desktop;
        
        ui.clearMessages();
        ui.updateScore();
        ui.disableInput(true);
        
        // Welcome sequence
        await ui.showTyping('Void Bot', 1000);
        const welcomeMsg = 'Welcome to the **Void Esports Moderator Certification Test**.';
        ui.addMessage('Void Bot', welcomeMsg, '#5865f2', true);
        testState.addToLog('Void Bot', welcomeMsg, true);
        
        await delay(800);
        await ui.showTyping('Void Bot', 1200);
        const totalQuestions = testState.questions?.length || CONFIG.TOTAL_QUESTIONS;
        const infoMsg = `You'll be presented with **${totalQuestions}** scenario${totalQuestions !== 1 ? 's' : ''}.`;
        ui.addMessage('Void Bot', infoMsg, '#5865f2', true);
        testState.addToLog('Void Bot', infoMsg, true);
        
        await delay(800);
        await ui.showTyping('Void Bot', 800);
        const finalMsg = 'Respond as you would as a real moderator. Good luck!';
        ui.addMessage('Void Bot', finalMsg, '#5865f2', true);
        testState.addToLog('Void Bot', finalMsg, true);
        
        await delay(1500);
        
        this.showNextQuestion(isMobile);
    },
    
    // Show next question
    async showNextQuestion(isMobile) {
        const ui = isMobile ? mobile : desktop;
        
        const totalQuestions = testState.questions?.length || CONFIG.TOTAL_QUESTIONS;
        if (testState.currentQuestion >= totalQuestions) {
            this.endTest(isMobile);
            return;
        }

        const question = testState.questions[testState.currentQuestion];
        
        await ui.showTyping(question.username, 1200);
        ui.addMessage(question.username, question.message, question.avatarColor, false);
        testState.addToLog(question.username, question.message, false);
        
        ui.disableInput(false);
        ui.updateScore();
    },
    
    // Send message
    async sendMessage(isMobile) {
        const ui = isMobile ? mobile : desktop;
        
        if (!ui.input || !testState.active) return;

        const userMessage = ui.input.value.trim();
        if (!userMessage) return;

        await this.processUserMessage(userMessage, isMobile);
    },
    
    // Process user message
    async processUserMessage(userMessage, isMobile) {
        const ui = isMobile ? mobile : desktop;
        
        ui.disableInput(true);
        
        // Add user message
        ui.addMessage('You', userMessage, '#7289da', false);
        testState.addToLog(testState.userInfo.username, userMessage, false, true);
        
        testState.userAnswers.push(userMessage);
        ui.clearInput();
        
        await ui.showTyping('Void Bot', 1000);
        
        const question = testState.questions[testState.currentQuestion];
        const result = this.evaluateAnswer(userMessage, question);
        
        // Store for log
        testState.questionsWithAnswers.push({
            question: question.message,
            answer: userMessage,
            correct: result.correct,
            matchCount: result.matches,
            requiredMatches: question.required,
            matchedKeywords: result.matchedKeywords || [],
            feedback: question.feedback
        });
        
        // Add feedback message
        let feedbackMsg = result.correct 
            ? `✅ **Correct!** ${question.feedback}`
            : `❌ **Not quite right.** ${question.feedback}`;
        
        ui.addMessage('Void Bot', feedbackMsg, '#5865f2', true);
        testState.addToLog('Void Bot', feedbackMsg, true);
        
        if (result.correct) {
            testState.score++;
        }
        
        testState.currentQuestion++;
        ui.updateScore();
        
        const totalQuestions = testState.questions?.length || CONFIG.TOTAL_QUESTIONS;
        if (testState.currentQuestion < totalQuestions) {
            await delay(1500);
            this.showNextQuestion(isMobile);
        } else {
            await delay(2000);
            this.endTest(isMobile);
        }
    },
    
    // Evaluate answer
    evaluateAnswer(answer, question) {
        const answerLower = answer.toLowerCase();
        let matches = 0;
        let matchedKeywords = [];

        for (const keyword of question.keywords) {
            if (answerLower.includes(keyword.toLowerCase())) {
                matches++;
                matchedKeywords.push(keyword);
            }
        }

        return {
            correct: matches >= question.required,
            matches: matches,
            matchedKeywords: matchedKeywords
        };
    },
    
    // End test
    async endTest(isMobile) {
        console.log('📝 Test complete!');
        
        const ui = isMobile ? mobile : desktop;
        
        testState.active = false;
        testState.endTime = new Date().toISOString();
        ui.disableInput(true);
        
        await ui.showTyping('Void Bot', 1000);
        
        const totalQuestions = testState.questions?.length || CONFIG.TOTAL_QUESTIONS;
        const passingScore = Math.ceil(totalQuestions * 0.75); // 75% passing score
        const passed = testState.score >= passingScore;
        const finalMsg = `**Test Complete!**\nFinal Score: **${testState.score}/${totalQuestions}**\nResult: **${passed ? 'PASSED ✅' : 'FAILED ❌'}**`;
        
        ui.addMessage('Void Bot', finalMsg, '#5865f2', true);
        testState.addToLog('Void Bot', finalMsg, true);
        
        const submissionData = testState.getSubmissionData();

        ui.showModal(passed);
        await this.submitTestResults(submissionData, isMobile);
    },
    
    // Submit test results
    async submitTestResults(data, isMobile) {
        const ui = isMobile ? mobile : desktop;
        
        ui.setModalStatus('<i class="fas fa-spinner fa-spin"></i> Submitting results...');

        try {
            console.log('Submitting test results...', data);
            
            const response = await fetch(`${CONFIG.API_BASE_URL}/submit-test-results`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            console.log('Submission response:', result);

            if (response.ok && result.success) {
                ui.setModalStatus('<i class="fas fa-check-circle"></i> Results submitted successfully!');
            } else {
                throw new Error('Submission failed');
            }

        } catch (error) {
            console.error('Submission error:', error);
            
            // Try fallback endpoint
            try {
                const fallbackResponse = await fetch(`${CONFIG.API_BASE_URL}/api/submit`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                
                if (fallbackResponse.ok) {
                    ui.setModalStatus('<i class="fas fa-check-circle"></i> Results submitted!');
                    return;
                }
            } catch (fallbackError) {
                console.error('Fallback also failed:', fallbackError);
            }
            
            ui.setModalStatus('<i class="fas fa-exclamation-triangle"></i> Results saved locally');
        }
    },
    
    // Reset test
    reset() {
        testState.reset();
        
        const isMobile = window.innerWidth <= 768;
        const ui = isMobile ? mobile : desktop;
        
        ui.clearMessages();
        ui.updateScore();
        ui.disableInput(true);
    },
    
    // Exit test
    exit() {
        this.reset();
        
        const isMobile = window.innerWidth <= 768;
        const ui = isMobile ? mobile : desktop;
        
        ui.hide();
        window.history.replaceState({}, document.title, window.location.pathname);
    }
};

// Utility: delay
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Make testLogic globally available
window.testLogic = testLogic;
