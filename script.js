
/**
 * 1. LOGIN HANDLER
 * Simple hardcoded check for demo purposes
 */
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;

    if (user === 'admin' && pass === 'admin123') {
        loginPage.classList.add('hidden');
        mainPage.classList.remove('hidden');
        fetchIssues();
    } else {
        alert("Invalid Credentials! Try admin / admin123");
    }
});

