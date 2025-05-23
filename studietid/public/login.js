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
        console.log(response)
        if (response.ok) {
            console.log(response)
            sessionStorage.setItem('loggedIn', 'true');
            window.location.href = response.url;
        } else {
            alert('Login failed');
        }
    } catch (error) {
        console.error('Failed to login:', error);
    }
});