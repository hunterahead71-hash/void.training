// Main Application Logic
document.addEventListener('DOMContentLoaded', function() {
    // Initialize utilities
    if (typeof utils !== 'undefined') {
        utils.initAOS();
        utils.checkUrlParams();
    }
    
    // Navigation sidebar functionality
    const navItems = document.querySelectorAll('.nav-item');
    const sections = {
        'header': document.getElementById('header'),
        'ticket-types': document.getElementById('ticket-types'),
        'roster-categories': document.getElementById('roster-categories'),
        'mod-requirements': document.getElementById('mod-requirements'),
        'quiz': document.getElementById('quiz')
    };
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            if (sections[target]) {
                sections[target].scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Global variables
    window.currentQuestion = 1;
    window.totalQuestions = 7;
    
    // Update progress bar
    function updateProgressBar() {
        const progressFill = document.getElementById('progressFill');
        if (progressFill && window.currentQuestion) {
            const progressPercentage = (window.currentQuestion / window.totalQuestions) * 100;
            progressFill.style.width = `${progressPercentage}%`;
        }
    }
    
    // Navigation between sections
    function setupNavigation() {
        const progressSteps = document.querySelectorAll('.progress-step');
        const stepIcons = document.querySelectorAll('.step-icon');
        
        // Update progress steps
        if (window.currentQuestion === 1) {
            progressSteps[0].classList.add('active');
            stepIcons[0].classList.add('active');
            progressSteps[1].classList.remove('active');
            stepIcons[1].classList.remove('active');
            progressSteps[2].classList.remove('active');
            stepIcons[2].classList.remove('active');
        }
    }
    
    // Initialize
    updateProgressBar();
    setupNavigation();
    
    // Export functions to window
    window.updateProgressBar = updateProgressBar;
});
