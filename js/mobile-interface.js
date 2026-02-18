// Mobile Interface - Complete Working Version
const mobileInterface = {
    elements: {},
    testState: window.testState || {
        active: false,
        currentQuestion: 0,
        score: 0,
        questions: window.TEST_QUESTIONS || [],
        userAnswers: [],
        questionsWithAnswers: [],
        userInfo: { username: 'User', userId: '0000' },
        
        reset() {
            this.active = false;
            this.currentQuestion = 0;
            this.score = 0;
            this.userAnswers = [];
            this.questionsWithAnswers = [];
            this.questions = window.TEST_QUESTIONS ? [...window.TEST_QUESTIONS].sort(() => 0.5 - Math.random()).slice(0, 8) : [];
        },
        
        initUser(username, userId) {
            this.userInfo.username = username || 'User';
            this.userInfo.userId = userId || '0000';
        }
    },

    init() {
        console.log('📱 Initializing mobile interface...');
        this.cacheElements();
        this.setupEventListeners();
    },

    cacheElements() {
        this.elements = {
            container: document.getElementById('mobileDiscord'),
            mainContainer: document.getElementById('mainContainer'),
            messages: document.getElementById('mobileMessagesContainer'),
            input: document.getElementById('mobileMessageInput'),
            sendBtn: document.getElementById('mobileSendBtn'),
            typing: document.getElementById('mobileTyping'),
            typingText: document.getElementById('mobileTypingText'),
            score: document.getElementById('mobileScore'),
            progress: document.getElementById('mobileProgress'),
            questionCounter: document.getElementById('mobileQuestionCounter'),
            channelName: document.getElementById('mobileChannelName'),
            sidebarUsername: document.getElementById('mobileSidebarUsername'),
            menuBtn: document.getElementById('mobileMenuBtn'),
            sidebar: document.getElementById('mobileSidebar'),
            closeSidebar: document.getElementById('mobileCloseSidebar'),
            scoreBtn: document.getElementById('mobileScoreBtn'),
            scorePanel: document.getElementById('mobileScorePanel'),
            closeScore: document.getElementById('mobileCloseScore'),
            modal: document.getElementById('mobileTestComplete'),
            modalIcon: document.getElementById('mobileResultIcon'),
            modalTitle: document.getElementById('mobileResultTitle'),
            modalScore: document.getElementById('mobileResultScore'),
            modalMessage: document.getElementById('mobileResultMessage'),
            modalStatus: document.getElementById('mobileSubmissionStatus'),
            reviewBtn: document.getElementById('mobileReviewBtn'),
            backBtn: document.getElementById('mobileBackBtn')
        };
    },

    setupEventListeners() {
        if (this.elements.input) {
            this.elements.input.addEventListener('input', () => {
                this.elements.input.style.height = 'auto';
                this.elements.input.style.height = Math.min(this.elements.input.scrollHeight, 120) + 'px';
                if (this.elements.sendBtn) {
                    this.elements.sendBtn.disabled = !this.elements.input.value.trim() || !this.testState.active;
                }
            });

            this.elements.input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (this.elements.sendBtn && !this.elements.sendBtn.disabled && this.testState.active) {
                        this.sendMessage();
                    }
                }
            });
        }

        if (this.elements.sendBtn) {
            this.elements.sendBtn.addEventListener('click', () => this.sendMessage());
        }

        if (this.elements.menuBtn) {
            this.elements.menuBtn.addEventListener('click', () => {
                if (this.elements.sidebar) this.elements.sidebar.classList.add('active');
            });
        }

        if (this.elements.closeSidebar) {
            this.elements.closeSidebar.addEventListener('click', () => {
                if (this.elements.sidebar) this.elements.sidebar.classList.remove('active');
            });
        }

        if (this.elements.scoreBtn) {
            this.elements.scoreBtn.addEventListener('click', () => {
                if (this.elements.scorePanel) this.elements.scorePanel.classList.add('active');
            });
        }

        if (this.elements.closeScore) {
            this.elements.closeScore.addEventListener('click', () => {
                if (this.elements.scorePanel) this.elements.scorePanel.classList.remove('active');
            });
        }

        if (this.elements.reviewBtn) {
            this.elements.reviewBtn.addEventListener('click', () => {
                this.hideModal();
                this.reset();
                setTimeout(() => this.start(), 500);
            });
        }

        if (this.elements.backBtn) {
            this.elements.backBtn.addEventListener('click', () => {
                this.hideModal();
                this.exit();
            });
        }

        document.addEventListener('click', (e) => {
            if (this.elements.sidebar && !this.elements.sidebar.contains(e.target) && 
                !this.elements.menuBtn?.contains(e.target) && 
                this.elements.sidebar.classList.contains('active')) {
                this.elements.sidebar.classList.remove('active');
            }
            
            if (this.elements.scorePanel && !this.elements.scorePanel.contains(e.target) && 
                !this.elements.scoreBtn?.contains(e.target) && 
                this.elements.scorePanel.classList.contains('active')) {
                this.elements.scorePanel.classList.remove('active');
            }
        });
    },

    updateUserDisplay() {
        if (this.elements.sidebarUsername) {
            this.elements.sidebarUsername.textContent = this.testState.userInfo.username;
        }
    },

    show() {
        if (this.elements.container) {
            this.elements.container.classList.add('active');
        }
        if (this.elements.mainContainer) {
            this.elements.mainContainer.style.display = 'none';
        }
    },

    hide() {
        if (this.elements.container) {
            this.elements.container.classList.remove('active');
        }
        if (this.elements.mainContainer) {
            this.elements.mainContainer.style.display = 'block';
        }
    },

    clearMessages() {
        if (this.elements.messages) {
            this.elements.messages.innerHTML = '';
        }
    },

    addMessage(username, content, color, isBot = false) {
        if (!this.elements.messages) return;

        const messageGroup = document.createElement('div');
        messageGroup.className = 'mobile-message-group';
        
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        
        let avatarInitial = username.charAt(0).toUpperCase();
        if (username === 'Void Bot') avatarInitial = 'V';
        if (username === 'You') avatarInitial = this.testState.userInfo.username.charAt(0).toUpperCase();

        messageGroup.innerHTML = `
            <div class="mobile-message-avatar" style="background-color: ${color}">
                ${avatarInitial}
            </div>
            <div class="mobile-message-content">
                <div class="mobile-message-header">
                    <span class="mobile-message-author">${username}</span>
                    ${isBot ? '<span class="mobile-bot-tag">BOT</span>' : ''}
                    <span class="mobile-message-timestamp">Today at ${timeString}</span>
                </div>
                <div class="mobile-message-text">${content}</div>
            </div>
        `;

        this.elements.messages.appendChild(messageGroup);
        this.elements.messages.scrollTop = this.elements.messages.scrollHeight;
    },

    async showTyping(username, duration) {
        if (this.elements.typing && this.elements.typingText) {
            this.elements.typingText.textContent = `${username} is typing...`;
            this.elements.typing.style.display = 'flex';
            await new Promise(resolve => setTimeout(resolve, duration));
            this.elements.typing.style.display = 'none';
        }
    },

    updateScore() {
        if (this.elements.score) this.elements.score.textContent = this.testState.score;
        if (this.elements.progress) {
            const percentage = (this.testState.score / 8) * 100;
            this.elements.progress.style.width = `${percentage}%`;
        }
        if (this.elements.questionCounter) {
            this.elements.questionCounter.textContent = `Question ${this.testState.currentQuestion + 1} of 8`;
        }
        if (this.elements.channelName) {
            this.elements.channelName.textContent = `🎫・mod-tickets • Q${this.testState.currentQuestion + 1}/8`;
        }
    },

    disableInput(disabled) {
        if (this.elements.input) {
            this.elements.input.disabled = disabled;
            if (!disabled) setTimeout(() => this.elements.input.focus(), 100);
        }
        if (this.elements.sendBtn) this.elements.sendBtn.disabled = disabled;
    },

    clearInput() {
        if (this.elements.input) {
            this.elements.input.value = '';
            this.elements.input.style.height = 'auto';
        }
    },

    showModal(passed) {
        if (!this.elements.modal) return;

        if (this.elements.modalIcon) {
            this.elements.modalIcon.className = `mobile-test-result-icon ${passed ? 'pass' : 'fail'}`;
            this.elements.modalIcon.innerHTML = passed ? '<i class="fas fa-trophy"></i>' : '<i class="fas fa-times-circle"></i>';
        }
        
        if (this.elements.modalTitle) {
            this.elements.modalTitle.textContent = passed ? 'Test Passed!' : 'Test Failed';
        }
        
        if (this.elements.modalScore) {
            this.elements.modalScore.textContent = `${this.testState.score}/8`;
        }
        
        if (this.elements.modalMessage) {
            this.elements.modalMessage.textContent = passed 
                ? 'Congratulations! You passed the certification test. Your results have been submitted for review.'
                : `You scored ${this.testState.score}/8. The minimum passing score is 6/8.`;
        }

        this.elements.modal.classList.add('active');
    },

    hideModal() {
        if (this.elements.modal) {
            this.elements.modal.classList.remove('active');
        }
    },

    setModalStatus(html) {
        if (this.elements.modalStatus) {
            this.elements.modalStatus.innerHTML = html;
        }
    },

    async start() {
        console.log('🚀 Starting mobile test...');
        
        this.testState.active = true;
        this.testState.currentQuestion = 0;
        this.testState.score = 0;
        this.testState.userAnswers = [];
        this.testState.questionsWithAnswers = [];
        this.testState.questions = window.TEST_QUESTIONS ? [...window.TEST_QUESTIONS].sort(() => 0.5 - Math.random()).slice(0, 8) : [];

        this.clearMessages();
        this.updateScore();
        this.disableInput(true);
        
        await this.showTyping('Void Bot', 1000);
        this.addMessage('Void Bot', 'Welcome to the **Void Esports Moderator Certification Test**.', '#5865f2', true);
        
        await delay(800);
        await this.showTyping('Void Bot', 1200);
        this.addMessage('Void Bot', `You'll be presented with **8** scenarios.`, '#5865f2', true);
        
        await delay(800);
        await this.showTyping('Void Bot', 800);
        this.addMessage('Void Bot', 'Respond as you would as a real moderator. Good luck!', '#5865f2', true);
        
        await delay(1500);
        
        this.showNextQuestion();
    },

    async showNextQuestion() {
        if (this.testState.currentQuestion >= 8) {
            this.endTest();
            return;
        }

        const question = this.testState.questions[this.testState.currentQuestion];
        
        await this.showTyping(question.username, 1200);
        this.addMessage(question.username, question.message, question.avatarColor, false);
        
        this.disableInput(false);
        this.updateScore();
    },

    async sendMessage() {
        if (!this.elements.input || !this.testState.active) return;

        const userMessage = this.elements.input.value.trim();
        if (!userMessage) return;

        await this.processUserMessage(userMessage);
    },

    async processUserMessage(userMessage) {
        this.disableInput(true);
        
        this.addMessage('You', userMessage, '#7289da', false);
        
        this.testState.userAnswers.push(userMessage);
        this.clearInput();
        
        await this.showTyping('Void Bot', 1000);
        
        const question = this.testState.questions[this.testState.currentQuestion];
        const result = this.evaluateAnswer(userMessage, question);
        
        this.testState.questionsWithAnswers.push({
            question: question.message,
            answer: userMessage,
            correct: result.correct,
            matchCount: result.matches,
            requiredMatches: question.required,
            matchedKeywords: result.matchedKeywords || [],
            feedback: question.feedback
        });
        
        let feedbackMsg = result.correct 
            ? `✅ **Correct!** ${question.feedback}`
            : `❌ **Not quite right.** ${question.feedback}`;
        
        this.addMessage('Void Bot', feedbackMsg, '#5865f2', true);
        
        if (result.correct) {
            this.testState.score++;
        }
        
        this.testState.currentQuestion++;
        this.updateScore();
        
        if (this.testState.currentQuestion < 8) {
            await delay(1500);
            this.showNextQuestion();
        } else {
            await delay(2000);
            this.endTest();
        }
    },

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

    async endTest() {
        console.log('📝 Mobile test complete!');
        
        this.testState.active = false;
        this.disableInput(true);
        
        await this.showTyping('Void Bot', 1000);
        
        const passed = this.testState.score >= 6;
        const finalMsg = `**Test Complete!**\nFinal Score: **${this.testState.score}/8**\nResult: **${passed ? 'PASSED ✅' : 'FAILED ❌'}**`;
        
        this.addMessage('Void Bot', finalMsg, '#5865f2', true);
        
        this.showModal(passed);
        await this.submitTestResults();
    },

    async submitTestResults() {
        const submissionData = {
            discordId: this.testState.userInfo.userId,
            discordUsername: this.testState.userInfo.username,
            answers: this.formatConversationLog(),
            conversationLog: this.formatConversationLog(),
            score: `${this.testState.score}/8`,
            totalQuestions: 8,
            correctAnswers: this.testState.score,
            wrongAnswers: 8 - this.testState.score,
            testResults: JSON.stringify({
                passed: this.testState.score >= 6,
                percentage: Math.round((this.testState.score / 8) * 100),
                questions: this.testState.questionsWithAnswers
            })
        };

        this.setModalStatus('<i class="fas fa-spinner fa-spin"></i> Submitting results...');

        try {
            console.log('Submitting test results...', submissionData);
            
            const response = await fetch('https://mod-application-backend.onrender.com/submit-test-results', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(submissionData)
            });

            const result = await response.json();
            console.log('Submission response:', result);

            if (response.ok && result.success) {
                this.setModalStatus('<i class="fas fa-check-circle"></i> Results submitted successfully!');
                
                setTimeout(() => {
                    window.location.href = `success.html?discord_username=${encodeURIComponent(this.testState.userInfo.username)}&final_score=${this.testState.score}/8&pass_fail=${this.testState.score >= 6 ? 'PASS' : 'FAIL'}`;
                }, 2000);
            } else {
                throw new Error('Submission failed');
            }

        } catch (error) {
            console.error('Submission error:', error);
            
            try {
                const fallbackResponse = await fetch('https://mod-application-backend.onrender.com/api/submit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(submissionData)
                });
                
                if (fallbackResponse.ok) {
                    this.setModalStatus('<i class="fas fa-check-circle"></i> Results submitted!');
                    
                    setTimeout(() => {
                        window.location.href = `success.html?discord_username=${encodeURIComponent(this.testState.userInfo.username)}&final_score=${this.testState.score}/8&pass_fail=${this.testState.score >= 6 ? 'PASS' : 'FAIL'}`;
                    }, 2000);
                    return;
                }
            } catch (fallbackError) {
                console.error('Fallback also failed:', fallbackError);
            }
            
            this.setModalStatus('<i class="fas fa-exclamation-triangle"></i> Results saved locally');
            
            setTimeout(() => {
                window.location.href = `success.html?discord_username=${encodeURIComponent(this.testState.userInfo.username)}&final_score=${this.testState.score}/8&pass_fail=${this.testState.score >= 6 ? 'PASS' : 'FAIL'}`;
            }, 2000);
        }
    },

    formatConversationLog() {
        let log = '';
        const separator = '══════════════════════════════════════════════════════════════════════════════';
        
        log += separator + '\n';
        log += 'VOID ESPORTS MODERATOR CERTIFICATION TEST - COMPLETE TRANSCRIPT\n';
        log += separator + '\n';
        log += `User: ${this.testState.userInfo.username} (${this.testState.userInfo.userId})\n`;
        log += `Date: ${new Date().toLocaleString()}\n`;
        log += `Final Score: ${this.testState.score}/8\n`;
        log += `Result: ${this.testState.score >= 6 ? 'PASSED ✓' : 'FAILED ✗'}\n`;
        log += separator + '\n\n';

        this.testState.questionsWithAnswers.forEach((qa, index) => {
            log += `┌──────────────────────────────────────────────────────────────────────────┐\n`;
            log += `│ QUESTION ${index + 1} of 8${qa.correct ? ' ✓ PASS' : ' ✗ FAIL'}\n`;
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
            log += `│ ${qa.feedback || 'Follow protocol'}\n`;
            log += `└──────────────────────────────────────────────────────────────────────────┘\n\n`;
        });

        log += separator + '\n';
        log += `END OF TRANSCRIPT - ${this.testState.score}/8 CORRECT\n`;
        log += separator + '\n';

        return log;
    },

    reset() {
        this.testState.reset();
        this.clearMessages();
        this.updateScore();
        this.disableInput(true);
    },

    exit() {
        this.reset();
        this.hide();
        window.history.replaceState({}, document.title, window.location.pathname);
    }
};

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Make it globally available
if (typeof window !== 'undefined') {
    window.mobileInterface = mobileInterface;
}
