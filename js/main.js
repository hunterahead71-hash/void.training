// Main Application Logic
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM loaded - Initializing main application...");
    
    // Initialize homepage navigation
    initHomepageNavigation();
    
    // Initialize quiz functionality
    initQuiz();
    
    // Set up event listeners for buttons
    setupEventListeners();
    
    // Handle window resize
    window.addEventListener('resize', handleResize);
});

// Initialize homepage navigation
function initHomepageNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = [
        document.getElementById('header'),
        document.getElementById('ticket-types'),
        document.getElementById('roster-categories'),
        document.getElementById('mod-requirements'),
        document.getElementById('quiz')
    ];
    
    function updateActiveNav() {
        const scrollPosition = window.scrollY + 200;
        
        for (let i = sections.length - 1; i >= 0; i--) {
            const section = sections[i];
            if (section && scrollPosition >= section.offsetTop) {
                navItems.forEach(item => item.classList.remove('active'));
                if (navItems[i]) navItems[i].classList.add('active');
                break;
            }
        }
        
        if (window.scrollY < 100) {
            navItems.forEach(item => item.classList.remove('active'));
            if (navItems[0]) navItems[0].classList.add('active');
        }
    }
    
    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav();
    
    navItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            if (sections[index]) {
                sections[index].scrollIntoView({ behavior: 'smooth' });
                navItems.forEach(n => n.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
}

// Initialize quiz functionality
function initQuiz() {
    // Start quiz button
    document.getElementById('startQuizBtn')?.addEventListener('click', function() {
        document.getElementById('quizSection').style.display = 'block';
        this.style.display = 'none';
        document.querySelectorAll('.question-card').forEach(q => q.classList.remove('active'));
        document.getElementById('question1').classList.add('active');
        document.getElementById('quizSection').scrollIntoView({ behavior: 'smooth' });
    });

    // Skip all buttons
    document.querySelectorAll('#skipAllQuizBtn, #skipAllQuestionsBtn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.getElementById('quizSection').style.display = 'none';
            document.getElementById('completionScreen').classList.add('active');
            document.getElementById('completionScreen').scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Check answer buttons
    document.querySelectorAll('.check-answer-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const num = this.getAttribute('data-question');
            document.getElementById(`feedback${num}`)?.classList.add('show');
        });
    });

    // Next question buttons
    document.querySelectorAll('.next-question-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const next = this.getAttribute('data-next');
            document.querySelectorAll('.question-card').forEach(q => q.classList.remove('active'));
            document.getElementById(`question${next}`)?.classList.add('active');
        });
    });

    // Skip buttons for each question
    for (let i = 1; i <= 7; i++) {
        document.getElementById(`skipBtn${i}`)?.addEventListener('click', function() {
            let next = i < 7 ? i + 1 : 1;
            document.querySelectorAll('.question-card').forEach(q => q.classList.remove('active'));
            document.getElementById(`question${next}`)?.classList.add('active');
        });
    }

    // Complete quiz button
    document.getElementById('completeQuizBtn')?.addEventListener('click', function() {
        document.getElementById('quizSection').style.display = 'none';
        document.getElementById('completionScreen').classList.add('active');
    });

    // Restart quiz button
    document.getElementById('restartQuizBtn')?.addEventListener('click', function() {
        document.getElementById('completionScreen').classList.remove('active');
        document.getElementById('quizSection').style.display = 'block';
        document.querySelectorAll('.question-card').forEach(q => q.classList.remove('active'));
        document.getElementById('question1').classList.add('active');
        document.getElementById('startQuizBtn').style.display = 'inline-flex';
        
        for (let i = 1; i <= 7; i++) {
            const answer = document.getElementById(`answer${i}`);
            if (answer) answer.value = '';
        }
    });
}

// Setup event listeners for main buttons
function setupEventListeners() {
    // Take Test button
    document.getElementById('takeTestBtn')?.addEventListener('click', function(e) {
        e.preventDefault();
        window.authManager.startTest();
    });

    // Admin Login button
    document.getElementById('adminLoginBtn')?.addEventListener('click', function(e) {
        e.preventDefault();
        window.authManager.startAdminLogin();
    });
}

// Handle window resize
function handleResize() {
    // If test is active and window crosses mobile threshold, reload the appropriate interface
    if (testState.active) {
        const wasMobile = window.innerWidth <= 768;
        const currentlyMobile = window.innerWidth <= 768;
        
        if (wasMobile !== currentlyMobile) {
            // Reload the interface
            testState.active = false;
            
            const ui = wasMobile ? mobile : desktop;
            ui.hide();
            
            const newUi = currentlyMobile ? mobile : desktop;
            newUi.init();
            newUi.show();
            newUi.updateUserDisplay();
            
            setTimeout(() => {
                testLogic.start(currentlyMobile);
            }, 1000);
        }
    }
}
