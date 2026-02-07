// Quiz Functionality - SIMPLE WORKING VERSION
function initializeQuiz() {
    console.log("Initializing quiz...");
    
    // Show only first question
    const questions = document.querySelectorAll('.question-card');
    questions.forEach(q => q.style.display = 'none');
    if (document.getElementById('question1')) {
        document.getElementById('question1').style.display = 'block';
    }
    
    // Hide all feedback
    const feedbacks = document.querySelectorAll('.answer-feedback');
    feedbacks.forEach(f => f.style.display = 'none');
    
    // Setup event listeners
    setupQuizEventListeners();
    setupNavigationHighlight();
}

function setupQuizEventListeners() {
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
                
                // Show first question
                document.querySelectorAll('.question-card').forEach(q => q.style.display = 'none');
                document.getElementById('question1').style.display = 'block';
                
                quizSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    // Check answer buttons
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
    });
    
    // Next question buttons
    document.addEventListener('click', function(e) {
        if (e.target.closest('.next-question-btn')) {
            e.preventDefault();
            const btn = e.target.closest('.next-question-btn');
            const nextNum = btn.getAttribute('data-next');
            console.log(`Next to question ${nextNum}`);
            
            // Hide current question
            const currentQuestion = document.querySelector('.question-card[style*="display: block"]');
            if (currentQuestion) {
                currentQuestion.style.display = 'none';
            }
            
            // Show next question
            const nextQuestion = document.getElementById(`question${nextNum}`);
            if (nextQuestion) {
                nextQuestion.style.display = 'block';
                nextQuestion.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });
    
    // Previous question buttons
    document.addEventListener('click', function(e) {
        if (e.target.closest('.prev-question-btn')) {
            e.preventDefault();
            const btn = e.target.closest('.prev-question-btn');
            const prevNum = btn.getAttribute('data-prev');
            console.log(`Previous to question ${prevNum}`);
            
            // Hide current question
            const currentQuestion = document.querySelector('.question-card[style*="display: block"]');
            if (currentQuestion) {
                currentQuestion.style.display = 'none';
            }
            
            // Show previous question
            const prevQuestion = document.getElementById(`question${prevNum}`);
            if (prevQuestion) {
                prevQuestion.style.display = 'block';
                prevQuestion.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });
    
    // Skip button
    const skipBtn = document.getElementById('skipBtn');
    if (skipBtn) {
        skipBtn.addEventListener('click', function() {
            console.log("Skip clicked");
            
            // Find current question
            let currentNum = 1;
            for (let i = 1; i <= 7; i++) {
                const q = document.getElementById(`question${i}`);
                if (q && q.style.display === 'block') {
                    currentNum = i;
                    break;
                }
            }
            
            // Hide current
            const currentQuestion = document.getElementById(`question${currentNum}`);
            if (currentQuestion) {
                currentQuestion.style.display = 'none';
            }
            
            // Show next (or loop to first)
            const nextNum = currentNum < 7 ? currentNum + 1 : 1;
            const nextQuestion = document.getElementById(`question${nextNum}`);
            if (nextQuestion) {
                nextQuestion.style.display = 'block';
                nextQuestion.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }
    
    // Complete quiz button (IN QUESTION 7)
    document.addEventListener('click', function(e) {
        if (e.target.closest('#completeQuizBtn')) {
            e.preventDefault();
            console.log("Complete Assessment button clicked!");
            
            // Hide quiz section
            const quizSection = document.getElementById('quizSection');
            if (quizSection) {
                quizSection.style.display = 'none';
            }
            
            // Show completion screen
            const completionScreen = document.getElementById('completion-screen');
            if (completionScreen) {
                completionScreen.style.display = 'block';
                completionScreen.scrollIntoView({ behavior: 'smooth' });
                
                // Make sure completion screen has content
                if (completionScreen.innerHTML.trim() === '' || !completionScreen.querySelector('.completion-screen')) {
                    console.log("Loading completion screen content...");
                    loadCompletionScreen();
                }
            }
        }
    });
    
    // Load completion screen function
    async function loadCompletionScreen() {
        try {
            const response = await fetch('partials/completion.html');
            if (response.ok) {
                const html = await response.text();
                const completionScreen = document.getElementById('completion-screen');
                if (completionScreen) {
                    completionScreen.innerHTML = html;
                    
                    // Re-attach event listeners after loading
                    setTimeout(() => {
                        setupCompletionScreenListeners();
                    }, 100);
                }
            }
        } catch (error) {
            console.error("Error loading completion screen:", error);
        }
    }
    
    // Setup completion screen listeners
    function setupCompletionScreenListeners() {
        console.log("Setting up completion screen listeners...");
        
        // Restart quiz button
        const restartBtn = document.getElementById('restartQuizBtn');
        if (restartBtn) {
            restartBtn.addEventListener('click', function(e) {
                e.preventDefault();
                console.log("Restart quiz clicked");
                
                // Hide completion screen
                const completionScreen = document.getElementById('completion-screen');
                if (completionScreen) {
                    completionScreen.style.display = 'none';
                }
                
                // Reset quiz
                document.querySelectorAll('.question-card').forEach(q => q.style.display = 'none');
                document.querySelectorAll('.answer-feedback').forEach(f => f.style.display = 'none');
                document.querySelectorAll('.answer-box').forEach(box => box.value = '');
                
                // Show first question
                document.getElementById('question1').style.display = 'block';
                
                // Show quiz section
                const quizSection = document.getElementById('quizSection');
                if (quizSection) {
                    quizSection.style.display = 'block';
                    quizSection.scrollIntoView({ behavior: 'smooth' });
                }
                
                // Show start button again
                const startQuizBtn = document.getElementById('startQuizBtn');
                if (startQuizBtn) {
                    startQuizBtn.style.display = 'inline-flex';
                }
            });
        }
        
        // Take test button
        const takeTestBtn = document.getElementById('takeTestBtn');
        if (takeTestBtn) {
            takeTestBtn.addEventListener('click', function(e) {
                e.preventDefault();
                console.log("Take test button clicked");
                
                // Show loading state
                const originalText = takeTestBtn.innerHTML;
                takeTestBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Starting test...';
                takeTestBtn.disabled = true;
                
                // Set test intent and redirect
                fetch("https://mod-application-backend.onrender.com/set-intent/test", {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                .then(response => {
                    if (response.ok) {
                        console.log("Redirecting to Discord OAuth...");
                        // Redirect to Discord OAuth
                        window.location.href = "https://mod-application-backend.onrender.com/auth/discord";
                    } else {
                        throw new Error("Failed to set test intent");
                    }
                })
                .catch(error => {
                    console.error("Auth setup error:", error);
                    alert("Failed to start authentication. Please try again.");
                    takeTestBtn.innerHTML = originalText;
                    takeTestBtn.disabled = false;
                });
            });
        }
    }
    
    // Setup completion screen listeners on initial load
    setTimeout(setupCompletionScreenListeners, 500);
}

function setupNavigationHighlight() {
    const navItems = document.querySelectorAll('.nav-item');
    
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('.content-section, .training-quiz, #completion-screen');
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= (sectionTop - 200)) {
                current = section.id || '';
            }
        });
        
        // Special handling for quiz section
        if (document.getElementById('quizSection') && 
            document.getElementById('quizSection').style.display === 'block') {
            current = 'quizSection';
        }
        
        navItems.forEach(item => {
            item.classList.remove('active');
            const target = item.getAttribute('data-target');
            
            if (target === 'header' && current === 'header-section') {
                item.classList.add('active');
            } else if (target === 'ticket-types' && current === 'ticket-types-section') {
                item.classList.add('active');
            } else if (target === 'roster-categories' && current === 'roster-categories-section') {
                item.classList.add('active');
            } else if (target === 'quiz' && current === 'quizSection') {
                item.classList.add('active');
            } else if (target === 'mod-requirements' && current === 'roster-categories-section') {
                // mod-requirements is inside roster-categories-section
                item.classList.add('active');
            }
        });
        
        // Default to header if at top
        if (window.scrollY < 100) {
            navItems.forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('data-target') === 'header') {
                    item.classList.add('active');
                }
            });
        }
    });
    
    // Click navigation
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            let targetElement;
            
            if (targetId === 'header') {
                targetElement = document.getElementById('header-section');
            } else if (targetId === 'quiz') {
                targetElement = document.getElementById('quizSection');
                // If quiz is hidden, show it
                if (targetElement && targetElement.style.display === 'none') {
                    const startQuizBtn = document.getElementById('startQuizBtn');
                    if (startQuizBtn) {
                        startQuizBtn.click();
                    }
                }
            } else {
                targetElement = document.getElementById(targetId + '-section');
            }
            
            if (targetElement) {
                targetElement.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update active nav item
                navItems.forEach(nav => nav.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
}

// Export function
window.initializeQuiz = initializeQuiz;

// Initialize when DOM is ready
if (document.getElementById('question1')) {
    document.addEventListener('DOMContentLoaded', initializeQuiz);
}
