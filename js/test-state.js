// Test State Management
const testState = {
    active: false,
    currentQuestion: 0,
    score: 0,
    userAnswers: [],
    conversationLog: [],
    questionsWithAnswers: [],
    startTime: null,
    endTime: null,
    userInfo: {
        username: 'User',
        userId: '0000'
    },
    
    // Reset test state
    reset() {
        this.active = false;
        this.currentQuestion = 0;
        this.score = 0;
        this.userAnswers = [];
        this.conversationLog = [];
        this.questionsWithAnswers = [];
        this.startTime = null;
        this.endTime = null;
    },
    
    // Initialize with user data
    initUser(username, userId) {
        this.userInfo.username = username || 'User';
        this.userInfo.userId = userId || '0000';
    },
    
    // Add to conversation log
    addToLog(username, message, isBot = false, isUser = false) {
        const timestamp = new Date().toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
        });
        
        this.conversationLog.push({
            timestamp: timestamp,
            username: username,
            message: message,
            isBot: isBot,
            isUser: isUser
        });
    },
    
    // Format complete conversation log
    formatConversationLog() {
        let log = '';
        const separator = '══════════════════════════════════════════════════════════════════════════════';
        
        log += separator + '\n';
        log += 'VOID ESPORTS MODERATOR CERTIFICATION TEST - COMPLETE TRANSCRIPT\n';
        log += separator + '\n';
        log += `User: ${this.userInfo.username} (${this.userInfo.userId})\n`;
        log += `Date: ${new Date().toLocaleString()}\n`;
        log += `Final Score: ${this.score}/${CONFIG.TOTAL_QUESTIONS}\n`;
        log += `Result: ${this.score >= CONFIG.PASSING_SCORE ? 'PASSED ✓' : 'FAILED ✗'}\n`;
        log += separator + '\n\n';

        // Add each Q&A from questionsWithAnswers
        this.questionsWithAnswers.forEach((qa, index) => {
            log += `┌──────────────────────────────────────────────────────────────────────────┐\n`;
            log += `│ QUESTION ${index + 1} of ${CONFIG.TOTAL_QUESTIONS}${qa.correct ? ' ✓ PASS' : ' ✗ FAIL'}\n`;
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
        log += `END OF TRANSCRIPT - ${this.score}/${CONFIG.TOTAL_QUESTIONS} CORRECT\n`;
        log += separator + '\n';

        return log;
    },
    
    // Prepare submission data
    getSubmissionData() {
        const conversationLog = this.formatConversationLog();
        const passed = this.score >= CONFIG.PASSING_SCORE;
        
        return {
            discordId: this.userInfo.userId,
            discordUsername: this.userInfo.username,
            answers: conversationLog,
            conversationLog: conversationLog,
            score: `${this.score}/${CONFIG.TOTAL_QUESTIONS}`,
            totalQuestions: CONFIG.TOTAL_QUESTIONS,
            correctAnswers: this.score,
            wrongAnswers: CONFIG.TOTAL_QUESTIONS - this.score,
            testResults: JSON.stringify({
                passed: passed,
                percentage: Math.round((this.score / CONFIG.TOTAL_QUESTIONS) * 100),
                startTime: this.startTime,
                endTime: this.endTime,
                questions: this.questionsWithAnswers
            })
        };
    }
};

// Make testState globally available
window.testState = testState;
