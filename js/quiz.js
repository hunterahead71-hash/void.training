// Quiz Functionality
let currentQuestion = 1;
const totalQuestions = 7;

function initializeQuiz() {
    console.log("Initializing quiz...");
    
    // Set CSS for quiz
    const style = document.createElement('style');
    style.textContent = `
        .question-card { display: none; }
        .answer-feedback { display: none; }
        #question1 { display: block; }
    `;
    document.head.appendChild(style);
    
    // Show first question
    showQuestion(1);
    
    // Setup event listeners
    setupEventListeners();
}

function setupEventListeners() {
    console.log("Setting up quiz event listeners...");
    
    // Start quiz button
    const startQuizBtn = document.getElementById('startQuizBtn');
    if (startQuizBtn) {
        startQuizBtn.addEventListener('click', function() {
            console.log("Start quiz clicked");
            const quizSection = document.getElementById('quizSection');
            if (quizSection) {
                quizSection.style.display = 'block';
                startQuizBtn.style.display = 'none';
                showQuestion(1);
                quizSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    // Check answer buttons (using event delegation)
    document.addEventListener('click', function(e) {
        if (e.target.closest('.check-answer-btn')) {
            const btn = e.target.closest('.check-answer-btn');
            const questionNum = btn.getAttribute('data-question');
            console.log(`Check answer ${questionNum} clicked`);
            
            const feedback = document.getElementById(`feedback${questionNum}`);
            if (feedback) {
                feedback.style.display = 'block';
                feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }
        
        // Next question buttons
        if (e.target.closest('.next-question-btn')) {
            const btn = e.target.closest('.next-question-btn');
            const nextNum = btn.getAttribute('data-next');
            console.log(`Next to question ${nextNum}`);
            showQuestion(parseInt(nextNum));
        }
        
        // Previous question buttons
        if (e.target.closest('.prev-question-btn')) {
            const btn = e.target.closest('.prev-question-btn');
            const prevNum = btn.getAttribute('data-prev');
            console.log(`Previous to question ${prevNum}`);
            showQuestion(parseInt(prevNum));
        }
    });
    
    // Skip button
    const skipBtn = document.getElementById('skipBtn');
    if (skipBtn) {
        skipBtn.addEventListener('click', function() {
            console.log("Skip clicked");
            if (currentQuestion < totalQuestions) {
                showQuestion(currentQuestion + 1);
            } else {
                showQuestion(1);
            }
        });
    }
    
    // Complete quiz button
    const completeQuizBtn = document.getElementById('completeQuizBtn');
    if (completeQuizBtn) {
        completeQuizBtn.addEventListener('click', function() {
            console.log("Complete quiz clicked");
            
            const quizSection = document.getElementById('quizSection');
            const completionScreen = document.getElementById('completion-screen');
            
            if (quizSection) {
                quizSection.style.display = 'none';
            }
            
            if (completionScreen) {
                completionScreen.style.display = 'block';
                completionScreen.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    // Restart quiz button (in completion screen)
    document.addEventListener('click', function(e) {
        if (e.target.closest('#restartQuizBtn')) {
            console.log("Restart quiz clicked");
            
            // Hide all questions except first
            for (let i = 1; i <= totalQuestions; i++) {
                const question = document.getElementById(`question${i}`);
                if (question) {
                    question.style.display = 'none';
                }
            }
            
            // Show first question
            showQuestion(1);
            
            // Hide all feedback
            for (let i = 1; i <= totalQuestions; i++) {
                const feedback = document.getElementById(`feedback${i}`);
                if (feedback) {
                    feedback.style.display = 'none';
                }
            }
            
            // Clear answer boxes
            document.querySelectorAll('.answer-box').forEach(box => {
                box.value = '';
            });
            
            // Hide completion screen
            const completionScreen = document.getElementById('completion-screen');
            if (completionScreen) {
                completionScreen.style.display = 'none';
            }
            
            // Show quiz section
            const quizSection = document.getElementById('quizSection');
            if (quizSection) {
                quizSection.style.display = 'block';
                quizSection.scrollIntoView({ behavior: 'smooth' });
            }
            
            // Show start button again
            if (startQuizBtn) {
                startQuizBtn.style.display = 'inline-flex';
            }
        }
    });
    
    // Take test button → Discord Auth
    const takeTestBtn = document.getElementById('takeTestBtn');
    if (takeTestBtn) {
        takeTestBtn.addEventListener("click", async function(e) {
            e.preventDefault();
            console.log("Take test button clicked");
            
            // Show loading state
            const originalText = takeTestBtn.innerHTML;
            takeTestBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Starting test...';
            takeTestBtn.disabled = true;
            
            try {
                // Set test intent in backend session
                const response = await fetch("https://mod-application-backend.onrender.com/set-intent/test", {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                
                if (!response.ok) {
                    throw new Error("Failed to set test intent");
                }
                
                // Redirect to Discord OAuth
                window.location.href = "https://mod-application-backend.onrender.com/auth/discord";
                
            } catch (error) {
                console.error("Auth setup error:", error);
                alert("Failed to start authentication. Please try again.");
                takeTestBtn.innerHTML = originalText;
                takeTestBtn.disabled = false;
            }
        });
    }
}

function showQuestion(questionNum) {
    console.log(`Showing question ${questionNum}`);
    
    // Validate question number
    if (questionNum < 1) questionNum = 1;
    if (questionNum > totalQuestions) questionNum = totalQuestions;
    
    // Update current question
    currentQuestion = questionNum;
    
    // Hide all questions
    for (let i = 1; i <= totalQuestions; i++) {
        const question = document.getElementById(`question${i}`);
        if (question) {
            question.style.display = 'none';
        }
    }
    
    // Show target question
    const targetQuestion = document.getElementById(`question${questionNum}`);
    if (targetQuestion) {
        targetQuestion.style.display = 'block';
        targetQuestion.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Export function to window
window.initializeQuiz = initializeQuiz;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if quiz is already loaded
    if (document.getElementById('question1')) {
        initializeQuiz();
    }
});
