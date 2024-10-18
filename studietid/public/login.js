document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            sessionStorage.setItem('loggedIn', 'true');
            window.location.href = '/app.html';
        } else {
            alert('Login failed');
        }
    } catch (error) {
        console.error('Failed to login:', error);
    }
});