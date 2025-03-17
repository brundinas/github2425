

fetchGames()
fetchLeaderboard()



async function fetchLeaderboard() {
    try {
        // Fetch API brukes for å hente data fra URLen
        let response = await fetch('/getleaderboard/'); // Hente brukere fra studietidDB
        let data = await response.json(); // Konverterer responsen til JSON
        let leaderBoard = document.getElementById("leaderboard");
        // Nå må vi iterere gjennom data.results, ikke data direkte
        for (let i = 0; i < data.length; i++) {
            const row = document.createElement('tr')
            const playerTD = document.createElement('td')
            playerTD.innerHTML = data[i].username
            
            const scoreTD = document.createElement('td')
            scoreTD.innerHTML = data[i].score
            row.appendChild(playerTD)
            row.appendChild(scoreTD)
            leaderBoard.appendChild(row)

        }
    } catch (error) {
        console.error('Error:', error); // Håndterer eventuelle feil
    }
}

async function fetchGames() {
    try {
        // Fetch API brukes for å hente data fra URLen
        let response = await fetch('/getgames/'); // Hente brukere fra studietidDB
        let data = await response.json(); // Konverterer responsen til JSON

        // Nå må vi iterere gjennom data.results, ikke data direkte
        let menu = document.getElementById("game-menu");
        data.forEach(game => {
            let btn = document.createElement("button");
            btn.innerText = game.name;
            btn.onclick = () => window.location.href = "/playgame?game="+game.url
            menu.appendChild(btn);
          });
        
    } catch (error) {
        console.error('Error:', error); // Håndterer eventuelle feil
    }
}






