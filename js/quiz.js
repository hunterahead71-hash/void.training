// Quiz Functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log("Quiz.js loaded");
    
    // Start quiz button
    const startQuizBtn = document.getElementById('startQuizBtn');
    if (startQuizBtn) {
        startQuizBtn.addEventListener('click', function() {
            console.log("Start quiz clicked");
            const quizSection = document.getElementById('quizSection');
            if (quizSection) {
                quizSection.style.display = 'block';
                startQuizBtn.style.display = 'none';
                quizSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    // Check answer buttons
    for (let i = 1; i <= 7; i++) {
        const checkBtn = document.getElementById(`checkAnswer${i}`);
        if (checkBtn) {
            checkBtn.addEventListener('click', function() {
                console.log(`Check answer ${i} clicked`);
                const feedback = document.getElementById(`feedback${i}`);
                if (feedback) {
                    feedback.style.display = 'block';
                }
            });
        }
    }
    
    // Next question buttons
    document.querySelectorAll('.next-question').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const nextNum = this.getAttribute('data-next');
            console.log(`Next to question ${nextNum}`);
            
            // Hide current question
            const currentId = `question${nextNum - 1}`;
            const currentQuestion = document.getElementById(currentId);
            if (currentQuestion) {
                currentQuestion.style.display = 'none';
            }
            
            // Show next question
            const nextId = `question${nextNum}`;
            const nextQuestion = document.getElementById(nextId);
            if (nextQuestion) {
                nextQuestion.style.display = 'block';
                nextQuestion.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // Previous question buttons
    document.querySelectorAll('.prev-question').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const prevNum = this.getAttribute('data-prev');
            console.log(`Previous to question ${prevNum}`);
            
            // Hide current question
            const currentId = `question${parseInt(prevNum) + 1}`;
            const currentQuestion = document.getElementById(currentId);
            if (currentQuestion) {
                currentQuestion.style.display = 'none';
            }
            
            // Show previous question
            const prevId = `question${prevNum}`;
            const prevQuestion = document.getElementById(prevId);
            if (prevQuestion) {
                prevQuestion.style.display = 'block';
                prevQuestion.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // Skip button
    const skipBtn = document.getElementById('skipBtn');
    if (skipBtn) {
        skipBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log("Skip clicked");
            
            // Find current visible question
            let currentQuestion = 1;
            for (let i = 1; i <= 7; i++) {
                const question = document.getElementById(`question${i}`);
                if (question && question.style.display === 'block') {
                    currentQuestion = i;
                    break;
                }
            }
            
            // Hide current
            const currentId = `question${currentQuestion}`;
            const currentElement = document.getElementById(currentId);
            if (currentElement) {
                currentElement.style.display = 'none';
            }
            
            // Show next
            const nextId = `question${currentQuestion + 1}`;
            const nextElement = document.getElementById(nextId);
            if (nextElement) {
                nextElement.style.display = 'block';
                nextElement.scrollIntoView({ behavior: 'smooth' });
            } else {
                // If no more questions, complete quiz
                completeQuizBtn.click();
            }
        });
    }
    
    // Complete quiz button
    const completeQuizBtn = document.getElementById('completeQuizBtn');
    if (completeQuizBtn) {
        completeQuizBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log("Complete quiz clicked");
            
            const quizSection = document.getElementById('quizSection');
            const completionScreen = document.getElementById('completionScreen');
            
            if (quizSection) {
                quizSection.style.display = 'none';
            }
            
            if (completionScreen) {
                completionScreen.style.display = 'block';
                completionScreen.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    // Restart quiz button
    const restartQuizBtn = document.getElementById('restartQuizBtn');
    if (restartQuizBtn) {
        restartQuizBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log("Restart quiz clicked");
            
            // Hide all questions except first
            for (let i = 2; i <= 7; i++) {
                const question = document.getElementById(`question${i}`);
                if (question) {
                    question.style.display = 'none';
                }
            }
            
            // Show first question
            const firstQuestion = document.getElementById('question1');
            if (firstQuestion) {
                firstQuestion.style.display = 'block';
            }
            
            // Hide all feedback
            for (let i = 1; i <= 7; i++) {
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
            const completionScreen = document.getElementById('completionScreen');
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
        });
    }
    
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
});
