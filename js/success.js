(function() {
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('discord_username') || localStorage.getItem('last_test_user') || 'User';
    const score = urlParams.get('final_score') || localStorage.getItem('last_test_score') || '0/8';
    const passFail = urlParams.get('pass_fail') || 'UNKNOWN';
    const testDate = urlParams.get('test_date') || localStorage.getItem('last_test_date') || new Date().toLocaleString();

    document.getElementById('username').textContent = username;
    document.getElementById('scoreDisplay').textContent = score;
    document.getElementById('date').textContent = testDate;

    if (passFail === 'PASS') {
        document.getElementById('title').textContent = 'Test Passed!';
        document.getElementById('message').textContent = 'Congratulations! You passed the mod test. The admin team will review your results.';
        document.querySelector('.success-icon').innerHTML = '<i class="fas fa-trophy"></i>';
        document.querySelector('.success-icon').style.color = '#3ba55c';
    } else if (passFail === 'FAIL') {
        document.getElementById('title').textContent = 'Test Failed';
        document.getElementById('message').textContent = 'You did not pass this time. You can retake the test after reviewing the training material.';
        document.querySelector('.success-icon').innerHTML = '<i class="fas fa-times-circle"></i>';
        document.querySelector('.success-icon').style.color = '#ed4245';
    }

    const scoreDisplay = document.getElementById('scoreDisplay');
    if (passFail === 'PASS') {
        scoreDisplay.style.color = '#3ba55c';
    } else if (passFail === 'FAIL') {
        scoreDisplay.style.color = '#ed4245';
    }

    window.history.replaceState({}, document.title, window.location.pathname);
    console.log('Success page loaded with:', { username, score, passFail });
})();
