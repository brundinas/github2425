
async function registerResult(game, result) {
    //Man kan eventuelt legge inn logikk for tap = -1, og uavghort = 0
    let win = 0
    if (result === false) {
        win = 0
    }
    else if (result === true) {
        win = 1
    }
    else win = result
    
    try {
        const response = await fetch('/postresult', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ game, win })
        });

        if (response.ok) {
            console.log('Response:', response);
            window.location.href = response.url; // Uncomment if redirection is needed
        } else {
            alert('Failed to register result');
        }
    } catch (error) {
        console.error('Failed to register result:', error);
    }

}
