// Mobile Interface Elements
const mobile = {
    testPage: null,
    mainContainer: null,
    messages: null,
    input: null,
    sendBtn: null,
    typing: null,
    typingText: null,
    score: null,
    progress: null,
    ticketCounter: null,
    modal: null,
    modalIcon: null,
    modalTitle: null,
    modalScore: null,
    modalMessage: null,
    modalStatus: null,
    reviewBtn: null,
    backBtn: null,
    menuBtn: null,
    sidebar: null,
    closeSidebar: null,
    scoreBtn: null,
    scorePanel: null,
    closeScore: null,
    
    // Initialize mobile elements
    init() {
        console.log('Initializing mobile interface...');
        
        this.testPage = document.getElementById('mobileDiscord');
        this.mainContainer = document.getElementById('mainContainer');
        
        this.loadHTML();
    },
    
    // Load mobile HTML template
    loadHTML() {
        if (!this.testPage) return;
        
        this.testPage.innerHTML = `
            <!-- Mobile Header -->
            <div class="mobile-header">
                <div class="mobile-menu-btn" id="mobileMenuBtn">
                    <i class="fas fa-bars"></i>
                </div>
                <div class="mobile-server-icon">V</div>
                <div class="mobile-channel-name" id="mobileTicketCounter">Ticket #1 of 8</div>
                <div class="mobile-header-actions">
                    <div class="mobile-header-btn" id="mobileScoreBtn">
                        <i class="fas fa-chart-simple"></i>
                    </div>
                </div>
            </div>

            <!-- Mobile Messages Container -->
            <div class="mobile-messages-container" id="mobileMessages"></div>

            <!-- Mobile Typing Indicator -->
            <div class="mobile-typing" id="mobileTyping" style="display: none;">
                <div class="mobile-typing-dots">
                    <div class="mobile-typing-dot"></div>
                    <div class="mobile-typing-dot"></div>
                    <div class="mobile-typing-dot"></div>
                </div>
                <span id="mobileTypingText">Someone is typing...</span>
            </div>

            <!-- Mobile Input Area -->
            <div class="mobile-input-area">
                <textarea class="mobile-message-input" id="mobileMessageInput" placeholder="Message #mod-tickets" rows="1"></textarea>
                <button class="mobile-send-btn" id="mobileSendBtn" disabled>
                    <i class="fas fa-paper-plane"></i>
                </button>
            </div>

            <!-- Mobile Sidebar -->
            <div class="mobile-sidebar" id="mobileSidebar">
                <div class="mobile-sidebar-header">
                    <span class="mobile-sidebar-title">Void Esports</span>
                    <div class="mobile-close-sidebar" id="mobileCloseSidebar">
                        <i class="fas fa-times"></i>
                    </div>
                </div>
                <div class="mobile-scrollable-channels">
                    <div class="mobile-category-header">INFORMATION</div>
                    <div class="mobile-channel-item">
                        <i class="fas fa-bullhorn mobile-channel-icon"></i>
                        <span class="mobile-channel-name-sidebar">announcements</span>
                    </div>
                    <div class="mobile-channel-item">
                        <i class="fas fa-book mobile-channel-icon"></i>
                        <span class="mobile-channel-name-sidebar">rules</span>
                    </div>
                    <div class="mobile-category-header" style="margin-top: 16px;">TICKET SYSTEM</div>
                    <div class="mobile-channel-item active">
                        <i class="fas fa-hashtag mobile-channel-icon"></i>
                        <span class="mobile-channel-name-sidebar">🎫・mod-tickets</span>
                    </div>
                </div>
            </div>

            <!-- Mobile Score Panel -->
            <div class="mobile-score-panel" id="mobileScorePanel">
                <div class="mobile-score-header">
                    <span class="mobile-score-title">Test Score</span>
                    <div class="mobile-close-score" id="mobileCloseScore">
                        <i class="fas fa-times"></i>
                    </div>
                </div>
                <div class="mobile-score-display">
                    <div class="mobile-score-value" id="mobileScore">0</div>
                    <div class="mobile-score-total">/8</div>
                    <div class="mobile-progress-bar-container">
                        <div class="mobile-progress-fill-bar" id="mobileProgress" style="width: 0%"></div>
                    </div>
                </div>
                <div class="mobile-score-info">
                    <p style="color: #949ba4; text-align: center; font-size: 14px;">
                        Answer each ticket scenario correctly to earn points.
                    </p>
                </div>
            </div>

            <!-- Mobile Test Complete Modal -->
            <div class="mobile-test-complete" id="mobileTestComplete">
                <div class="mobile-test-result-container">
                    <div class="mobile-test-result-icon" id="mobileResultIcon">
                        <i class="fas fa-trophy"></i>
                    </div>
                    <h2 class="mobile-test-result-title" id="mobileResultTitle">Test Complete!</h2>
                    <div class="mobile-test-result-score" id="mobileResultScore">0/8</div>
                    <div class="mobile-test-result-message" id="mobileResultMessage">
                        Your responses have been recorded.
                    </div>
                    <div class="mobile-submission-status" id="mobileSubmissionStatus">
                        <i class="fas fa-spinner fa-spin"></i> Submitting...
                    </div>
                    <div class="mobile-test-result-buttons">
                        <button class="mobile-test-result-btn secondary" id="mobileReviewBtn">Review</button>
                        <button class="mobile-test-result-btn primary" id="mobileBackBtn">Back to Training</button>
                    </div>
                </div>
            </div>
        `;
        
        // Re-initialize element references after loading HTML
        this.testPage = document.getElementById('mobileDiscord');
        this.messages = document.getElementById('mobileMessages');
        this.input = document.getElementById('mobileMessageInput');
        this.sendBtn = document.getElementById('mobileSendBtn');
        this.typing = document.getElementById('mobileTyping');
        this.typingText = document.getElementById('mobileTypingText');
        this.score = document.getElementById('mobileScore');
        this.progress = document.getElementById('mobileProgress');
        this.ticketCounter = document.getElementById('mobileTicketCounter');
        this.modal = document.getElementById('mobileTestComplete');
        this.modalIcon = document.getElementById('mobileResultIcon');
        this.modalTitle = document.getElementById('mobileResultTitle');
        this.modalScore = document.getElementById('mobileResultScore');
        this.modalMessage = document.getElementById('mobileResultMessage');
        this.modalStatus = document.getElementById('mobileSubmissionStatus');
        this.reviewBtn = document.getElementById('mobileReviewBtn');
        this.backBtn = document.getElementById('mobileBackBtn');
        this.menuBtn = document.getElementById('mobileMenuBtn');
        this.sidebar = document.getElementById('mobileSidebar');
        this.closeSidebar = document.getElementById('mobileCloseSidebar');
        this.scoreBtn = document.getElementById('mobileScoreBtn');
        this.scorePanel = document.getElementById('mobileScorePanel');
        this.closeScore = document.getElementById('mobileCloseScore');
        
        this.setupEvents();
    },
    
    // Setup event listeners
    setupEvents() {
        if (this.input) {
            this.input.addEventListener('input', () => {
                this.input.style.height = 'auto';
                this.input.style.height = Math.min(this.input.scrollHeight, 120) + 'px';
                if (this.sendBtn) {
                    this.sendBtn.disabled = !this.input.value.trim() || !testState.active;
                }
            });

            this.input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (this.sendBtn && !this.sendBtn.disabled && testState.active) {
                        window.testLogic.sendMessage(true);
                    }
                }
            });
        }

        if (this.sendBtn) {
            this.sendBtn.addEventListener('click', () => {
                window.testLogic.sendMessage(true);
            });
        }

        if (this.reviewBtn) {
            this.reviewBtn.addEventListener('click', () => {
                this.hideModal();
                window.testLogic.reset();
                setTimeout(() => window.testLogic.start(true), 500);
            });
        }

        if (this.backBtn) {
            this.backBtn.addEventListener('click', () => {
                this.hideModal();
                window.testLogic.exit();
            });
        }

        // Mobile sidebar
        if (this.menuBtn) {
            this.menuBtn.addEventListener('click', () => {
                if (this.sidebar) this.sidebar.classList.add('active');
            });
        }

        if (this.closeSidebar) {
            this.closeSidebar.addEventListener('click', () => {
                if (this.sidebar) this.sidebar.classList.remove('active');
            });
        }

        // Mobile score panel
        if (this.scoreBtn) {
            this.scoreBtn.addEventListener('click', () => {
                if (this.scorePanel) this.scorePanel.classList.add('active');
            });
        }

        if (this.closeScore) {
            this.closeScore.addEventListener('click', () => {
                if (this.scorePanel) this.scorePanel.classList.remove('active');
            });
        }

        // Close panels when clicking outside
        document.addEventListener('click', (e) => {
            if (this.sidebar && !this.sidebar.contains(e.target) && 
                !this.menuBtn?.contains(e.target) && 
                this.sidebar.classList.contains('active')) {
                this.sidebar.classList.remove('active');
            }
            
            if (this.scorePanel && !this.scorePanel.contains(e.target) && 
                !this.scoreBtn?.contains(e.target) && 
                this.scorePanel.classList.contains('active')) {
                this.scorePanel.classList.remove('active');
            }
        });
    },
    
    // Show interface
    show() {
        if (this.testPage) {
            this.testPage.classList.add('active');
        }
        if (this.mainContainer) {
            this.mainContainer.style.display = 'none';
        }
    },
    
    // Hide interface
    hide() {
        if (this.testPage) {
            this.testPage.classList.remove('active');
        }
        if (this.mainContainer) {
            this.mainContainer.style.display = 'block';
        }
    },
    
    // Clear messages
    clearMessages() {
        if (this.messages) {
            this.messages.innerHTML = '';
        }
    },
    
    // Add message
    addMessage(username, content, color, isBot = false) {
        if (!this.messages) return;

        const messageGroup = document.createElement('div');
        messageGroup.className = 'mobile-message-group';
        
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        
        let avatarInitial = username.charAt(0).toUpperCase();
        if (username === 'Void Bot') avatarInitial = 'V';
        if (username === 'You') avatarInitial = testState.userInfo.username.charAt(0).toUpperCase();

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

        this.messages.appendChild(messageGroup);
        this.messages.scrollTop = this.messages.scrollHeight;
    },
    
    // Show typing indicator
    async showTyping(username, duration) {
        if (this.typing && this.typingText) {
            this.typingText.textContent = `${username} is typing...`;
            this.typing.style.display = 'flex';
            await new Promise(resolve => setTimeout(resolve, duration));
            this.typing.style.display = 'none';
        }
    },
    
    // Update score
    updateScore() {
        if (this.score) this.score.textContent = testState.score;
        if (this.progress) {
            const percentage = (testState.score / CONFIG.TOTAL_QUESTIONS) * 100;
            this.progress.style.width = `${percentage}%`;
        }
        if (this.ticketCounter) {
            this.ticketCounter.textContent = `Ticket #${testState.currentQuestion + 1} of ${CONFIG.TOTAL_QUESTIONS}`;
        }
    },
    
    // Disable/enable input
    disableInput(disabled) {
        if (this.input) {
            this.input.disabled = disabled;
            if (!disabled) this.input.focus();
        }
        if (this.sendBtn) this.sendBtn.disabled = disabled;
    },
    
    // Clear input
    clearInput() {
        if (this.input) {
            this.input.value = '';
            this.input.style.height = 'auto';
        }
    },
    
    // Show modal
    showModal(passed) {
        if (!this.modal) return;

        if (this.modalIcon) {
            this.modalIcon.className = `${passed ? 'pass' : 'fail'}`;
            this.modalIcon.innerHTML = passed ? '<i class="fas fa-trophy"></i>' : '<i class="fas fa-times-circle"></i>';
        }
        
        if (this.modalTitle) {
            this.modalTitle.textContent = passed ? 'Test Passed!' : 'Test Failed';
        }
        
        if (this.modalScore) {
            this.modalScore.textContent = `${testState.score}/${CONFIG.TOTAL_QUESTIONS}`;
        }
        
        if (this.modalMessage) {
            this.modalMessage.textContent = passed 
                ? 'Congratulations! You passed the certification test. Your results have been submitted for review.'
                : `You scored ${testState.score}/${CONFIG.TOTAL_QUESTIONS}. The minimum passing score is ${CONFIG.PASSING_SCORE}/${CONFIG.TOTAL_QUESTIONS}.`;
        }

        this.modal.classList.add('active');
    },
    
    // Hide modal
    hideModal() {
        if (this.modal) {
            this.modal.classList.remove('active');
        }
    },
    
    // Update modal status
    setModalStatus(html) {
        if (this.modalStatus) {
            this.modalStatus.innerHTML = html;
        }
    }
};

// Make mobile globally available
window.mobile = mobile;
