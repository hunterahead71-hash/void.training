// Desktop Interface Elements
const desktop = {
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
    userName: null,
    userTag: null,
    userAvatar: null,
    memberAvatar: null,
    memberName: null,
    
    // Initialize desktop elements
    init() {
        console.log('Initializing desktop interface...');
        
        this.testPage = document.getElementById('testPage');
        this.mainContainer = document.getElementById('mainContainer');
        this.messages = document.getElementById('discordMessages');
        this.input = document.getElementById('discordMessageInput');
        this.sendBtn = document.getElementById('discordSendBtn');
        this.typing = document.getElementById('discordTyping');
        this.typingText = document.getElementById('discordTypingText');
        this.score = document.getElementById('discordScore');
        this.progress = document.getElementById('discordProgress');
        this.ticketCounter = document.getElementById('discordTicketCounter');
        this.modal = document.getElementById('discordModal');
        this.modalIcon = document.getElementById('discordModalIcon');
        this.modalTitle = document.getElementById('discordModalTitle');
        this.modalScore = document.getElementById('discordModalScore');
        this.modalMessage = document.getElementById('discordModalMessage');
        this.modalStatus = document.getElementById('discordModalStatus');
        this.reviewBtn = document.getElementById('discordReviewBtn');
        this.backBtn = document.getElementById('discordBackBtn');
        this.userName = document.getElementById('discordUserName');
        this.userTag = document.getElementById('discordUserTag');
        this.userAvatar = document.getElementById('discordUserAvatar');
        this.memberAvatar = document.getElementById('discordMemberAvatar');
        this.memberName = document.getElementById('discordMemberName');
        
        this.setupEvents();
        this.loadHTML();
    },
    
    // Load desktop HTML template
    loadHTML() {
        if (!this.testPage) return;
        
        this.testPage.innerHTML = `
            <div class="discord-app">
                <!-- Server Bar -->
                <div class="discord-servers">
                    <div class="discord-server-icon active">
                        <i class="fab fa-discord"></i>
                    </div>
                    <div class="discord-server-divider"></div>
                    <div class="discord-server-icon">
                        <span>V</span>
                    </div>
                </div>

                <!-- Channels Sidebar -->
                <div class="discord-channels">
                    <div class="discord-guild-header">
                        <span>Void Esports</span>
                        <i class="fas fa-chevron-down"></i>
                    </div>

                    <div class="discord-channels-scroll">
                        <div class="discord-category">
                            <div class="discord-category-header">
                                <span>INFORMATION</span>
                            </div>
                            <div class="discord-channel">
                                <i class="fas fa-bullhorn"></i>
                                <span class="discord-channel-name">announcements</span>
                            </div>
                            <div class="discord-channel">
                                <i class="fas fa-book"></i>
                                <span class="discord-channel-name">rules</span>
                            </div>
                        </div>

                        <div class="discord-category">
                            <div class="discord-category-header">
                                <span>TICKET SYSTEM</span>
                            </div>
                            <div class="discord-channel active">
                                <i class="fas fa-hashtag"></i>
                                <span class="discord-channel-name">🎫・mod-tickets</span>
                                <div class="discord-channel-unread"></div>
                            </div>
                        </div>
                    </div>

                    <!-- User Panel -->
                    <div class="discord-user-panel">
                        <div class="discord-avatar-wrapper">
                            <div class="discord-avatar" id="discordUserAvatar">U</div>
                            <div class="discord-status"></div>
                        </div>
                        <div class="discord-user-info">
                            <div class="discord-user-name" id="discordUserName">Loading...</div>
                            <div class="discord-user-tag" id="discordUserTag">#0000</div>
                        </div>
                        <div class="discord-user-controls">
                            <div class="discord-control-btn"><i class="fas fa-microphone"></i></div>
                            <div class="discord-control-btn"><i class="fas fa-headphones"></i></div>
                            <div class="discord-control-btn"><i class="fas fa-cog"></i></div>
                        </div>
                    </div>
                </div>

                <!-- Main Chat Area -->
                <div class="discord-chat">
                    <div class="discord-chat-header">
                        <i class="fas fa-hashtag"></i>
                        <span class="discord-chat-title">🎫・mod-tickets</span>
                        <span class="discord-chat-topic" id="discordTicketCounter">Ticket #1 of 8</span>
                        <div class="discord-chat-header-actions">
                            <div class="discord-header-btn"><i class="fas fa-phone"></i></div>
                            <div class="discord-header-btn"><i class="fas fa-video"></i></div>
                            <div class="discord-header-btn"><i class="fas fa-user-plus"></i></div>
                        </div>
                    </div>

                    <!-- Messages Container -->
                    <div class="discord-messages" id="discordMessages"></div>

                    <!-- Typing Indicator -->
                    <div class="discord-typing" id="discordTyping" style="display: none;">
                        <div class="discord-typing-dots">
                            <div class="discord-typing-dot"></div>
                            <div class="discord-typing-dot"></div>
                            <div class="discord-typing-dot"></div>
                        </div>
                        <span id="discordTypingText">Someone is typing...</span>
                    </div>

                    <!-- Message Input -->
                    <div class="discord-input-area">
                        <div class="discord-input-container">
                            <textarea class="discord-input" id="discordMessageInput" placeholder="Message #mod-tickets" rows="1"></textarea>
                            <button class="discord-send-btn" id="discordSendBtn" disabled>
                                <i class="fas fa-paper-plane"></i>
                                <span>Send</span>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Members Sidebar -->
                <div class="discord-members">
                    <div class="discord-members-header">
                        <span>Members — <span id="discordMemberCount">3</span></span>
                    </div>
                    <div class="discord-members-scroll">
                        <div class="discord-member-group">
                            <div class="discord-member-group-title">ONLINE — 2</div>
                            <div class="discord-member">
                                <div class="discord-member-avatar">
                                    V
                                    <div class="discord-member-status"></div>
                                </div>
                                <span class="discord-member-name">Void Bot</span>
                            </div>
                            <div class="discord-member">
                                <div class="discord-member-avatar" id="discordMemberAvatar">
                                    U
                                    <div class="discord-member-status"></div>
                                </div>
                                <span class="discord-member-name" id="discordMemberName">You</span>
                            </div>
                        </div>

                        <!-- Score Display -->
                        <div class="discord-score">
                            <div class="discord-score-label">TEST SCORE</div>
                            <div class="discord-score-value" id="discordScore">0</div>
                            <div class="discord-progress">
                                <div class="discord-progress-fill" id="discordProgress" style="width: 0%"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Test Complete Modal -->
            <div class="discord-modal" id="discordModal">
                <div class="discord-modal-content">
                    <div class="discord-modal-icon" id="discordModalIcon">
                        <i class="fas fa-trophy"></i>
                    </div>
                    <h2 class="discord-modal-title" id="discordModalTitle">Test Complete!</h2>
                    <div class="discord-modal-score" id="discordModalScore">0/8</div>
                    <div class="discord-modal-message" id="discordModalMessage">
                        Your responses have been recorded.
                    </div>
                    <div class="discord-modal-status" id="discordModalStatus">
                        <i class="fas fa-spinner fa-spin"></i> Submitting...
                    </div>
                    <div class="discord-modal-buttons">
                        <button class="discord-modal-btn secondary" id="discordReviewBtn">Review</button>
                        <button class="discord-modal-btn primary" id="discordBackBtn">Back to Training</button>
                    </div>
                </div>
            </div>
        `;
        
        // Re-initialize element references after loading HTML
        this.testPage = document.getElementById('testPage');
        this.messages = document.getElementById('discordMessages');
        this.input = document.getElementById('discordMessageInput');
        this.sendBtn = document.getElementById('discordSendBtn');
        this.typing = document.getElementById('discordTyping');
        this.typingText = document.getElementById('discordTypingText');
        this.score = document.getElementById('discordScore');
        this.progress = document.getElementById('discordProgress');
        this.ticketCounter = document.getElementById('discordTicketCounter');
        this.modal = document.getElementById('discordModal');
        this.modalIcon = document.getElementById('discordModalIcon');
        this.modalTitle = document.getElementById('discordModalTitle');
        this.modalScore = document.getElementById('discordModalScore');
        this.modalMessage = document.getElementById('discordModalMessage');
        this.modalStatus = document.getElementById('discordModalStatus');
        this.reviewBtn = document.getElementById('discordReviewBtn');
        this.backBtn = document.getElementById('discordBackBtn');
        this.userName = document.getElementById('discordUserName');
        this.userTag = document.getElementById('discordUserTag');
        this.userAvatar = document.getElementById('discordUserAvatar');
        this.memberAvatar = document.getElementById('discordMemberAvatar');
        this.memberName = document.getElementById('discordMemberName');
        
        this.setupEvents(); // Re-setup events after loading
    },
    
    // Setup event listeners
    setupEvents() {
        if (this.input) {
            this.input.addEventListener('input', () => {
                this.input.style.height = 'auto';
                this.input.style.height = Math.min(this.input.scrollHeight, 144) + 'px';
                if (this.sendBtn) {
                    this.sendBtn.disabled = !this.input.value.trim() || !testState.active;
                }
            });

            this.input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (this.sendBtn && !this.sendBtn.disabled && testState.active) {
                        window.testLogic.sendMessage(false);
                    }
                }
            });
        }

        if (this.sendBtn) {
            this.sendBtn.addEventListener('click', () => {
                window.testLogic.sendMessage(false);
            });
        }

        if (this.reviewBtn) {
            this.reviewBtn.addEventListener('click', () => {
                this.hideModal();
                window.testLogic.reset();
                setTimeout(() => window.testLogic.start(false), 500);
            });
        }

        if (this.backBtn) {
            this.backBtn.addEventListener('click', () => {
                this.hideModal();
                window.testLogic.exit();
            });
        }
    },
    
    // Update user display
    updateUserDisplay() {
        if (this.userName) this.userName.textContent = testState.userInfo.username;
        if (this.userTag) this.userTag.textContent = '#' + testState.userInfo.userId.slice(-4);
        if (this.userAvatar) this.userAvatar.textContent = testState.userInfo.username.charAt(0).toUpperCase();
        if (this.memberAvatar) this.memberAvatar.textContent = testState.userInfo.username.charAt(0).toUpperCase();
        if (this.memberName) this.memberName.textContent = testState.userInfo.username;
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
        messageGroup.className = 'discord-message-group';
        
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        
        let avatarInitial = username.charAt(0).toUpperCase();
        if (username === 'Void Bot') avatarInitial = 'V';
        if (username === 'You') avatarInitial = testState.userInfo.username.charAt(0).toUpperCase();

        messageGroup.innerHTML = `
            <div class="discord-message-avatar" style="background-color: ${color}">
                ${avatarInitial}
            </div>
            <div class="discord-message-content">
                <div class="discord-message-header">
                    <span class="discord-message-author">${username}</span>
                    ${isBot ? '<span class="discord-message-badge">BOT</span>' : ''}
                    <span class="discord-message-timestamp">Today at ${timeString}</span>
                </div>
                <div class="discord-message-text">${content}</div>
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
            this.modalIcon.className = `discord-modal-icon ${passed ? 'pass' : 'fail'}`;
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

// Make desktop globally available
window.desktop = desktop;
