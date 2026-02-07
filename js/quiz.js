// Quiz Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Training quiz variables
    const totalQuestions = 7;
    let currentQuestion = 1;
    
    // DOM elements
    const startQuizBtn = document.getElementById('startQuizBtn');
    const quizSection = document.getElementById('quizSection');
    const progressFill = document.getElementById('progressFill');
    const progressSteps = document.querySelectorAll('.progress-step');
    const stepIcons = document.querySelectorAll('.step-icon');
    const completionScreen = document.getElementById('completionScreen');
    const restartQuizBtn = document.getElementById('restartQuizBtn');
    const skipBtn = document.getElementById('skipBtn');
    const takeTestBtn = document.getElementById('takeTestBtn');
    const completeQuizBtn = document.getElementById('completeQuizBtn');
    
    // Update progress bar
    function updateQuizProgress() {
        if (progressFill) {
            const progressPercentage = (currentQuestion / totalQuestions) * 100;
            progressFill.style.width = `${progressPercentage}%`;
        }
    }
    
    // Show specific question
    function showQuestion(questionNum) {
        questionNum = parseInt(questionNum);
        if (questionNum < 1) questionNum = 1;
        if (questionNum > totalQuestions) questionNum = totalQuestions;
        
        for (let i = 1; i <= totalQuestions; i++) {
            const question = document.getElementById(`question${i}`);
            if (question) question.classList.remove('active');
        }
        
        const targetQuestion = document.getElementById(`question${questionNum}`);
        if (targetQuestion) {
            targetQuestion.classList.add('active');
            currentQuestion = questionNum;
            updateQuizProgress();
            targetQuestion.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
    
    // Start quiz button
    if (startQuizBtn) {
        startQuizBtn.addEventListener('click', function() {
            if (quizSection) {
                quizSection.style.display = 'block';
                startQuizBtn.style.display = 'none';
                
                if (progressSteps.length > 1 && stepIcons.length > 1) {
                    progressSteps[0].classList.remove('active');
                    stepIcons[0].classList.remove('active');
                    progressSteps[1].classList.add('active');
                    stepIcons[1].classList.add('active');
                }
                
                quizSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    // Check answer buttons
    for (let i = 1; i <= totalQuestions; i++) {
        const checkBtn = document.getElementById(`checkAnswer${i}`);
        if (checkBtn) {
            checkBtn.addEventListener('click', function() {
                const feedback = document.getElementById(`feedback${i}`);
                if (feedback) {
                    feedback.classList.add('show');
                    updateQuizProgress();
                }
            });
        }
    }
    
    // Navigation between questions
    document.querySelectorAll('.next-question').forEach(button => {
        button.addEventListener('click', function() {
            const nextQuestion = this.getAttribute('data-next');
            showQuestion(nextQuestion);
        });
    });
    
    document.querySelectorAll('.prev-question').forEach(button => {
        button.addEventListener('click', function() {
            const prevQuestion = this.getAttribute('data-prev');
            showQuestion(prevQuestion);
        });
    });
    
    // Skip button
    if (skipBtn) {
        skipBtn.addEventListener('click', function() {
            showQuestion(currentQuestion + 1);
        });
    }
    
    // Complete quiz
    if (completeQuizBtn) {
        completeQuizBtn.addEventListener('click', function() {
            if (progressSteps.length > 2 && stepIcons.length > 2) {
                progressSteps[1].classList.remove('active');
                stepIcons[1].classList.remove('active');
                progressSteps[2].classList.add('active');
                stepIcons[2].classList.add('active');
            }
            
            if (quizSection) {
                quizSection.style.display = 'none';
            }
            
            if (completionScreen) {
                completionScreen.classList.add('active');
                completionScreen.scrollIntoView({ behavior: 'smooth' });
            }
            
            if (progressFill) progressFill.style.width = '100%';
        });
    }
    
    // Restart quiz
    if (restartQuizBtn) {
        restartQuizBtn.addEventListener('click', function() {
            showQuestion(1);
            
            for (let i = 1; i <= totalQuestions; i++) {
                const feedback = document.getElementById(`feedback${i}`);
                if (feedback) feedback.classList.remove('show');
            }
            
            document.querySelectorAll('.answer-box').forEach(box => {
                box.value = '';
            });
            
            if (completionScreen) completionScreen.classList.remove('active');
            if (quizSection) {
                quizSection.style.display = 'block';
                quizSection.scrollIntoView({ behavior: 'smooth' });
            }
            
            if (progressSteps.length > 0 && stepIcons.length > 0) {
                progressSteps[0].classList.add('active');
                stepIcons[0].classList.add('active');
                progressSteps[1].classList.remove('active');
                stepIcons[1].classList.remove('active');
                progressSteps[2].classList.remove('active');
                stepIcons[2].classList.remove('active');
            }
            
            currentQuestion = 1;
            updateQuizProgress();
        });
    }
    
    // Take test button → Discord Auth
    if (takeTestBtn) {
        takeTestBtn.addEventListener("click", async function() {
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
    
    // Export functions to window
    window.showQuestion = showQuestion;
    window.updateQuizProgress = updateQuizProgress;
});
