

const games = fetchGames()



async function fetchLeaderboard() {
    try {
        // Fetch API brukes for å hente data fra URLen
        let response = await fetch('/getleaderboard/'); // Hente brukere fra studietidDB
        let data = await response.json(); // Konverterer responsen til JSON

        // Nå må vi iterere gjennom data.results, ikke data direkte
        for (let i = 0; i < data.length; i++) {
            console.log(data[i]);
        }
        return data
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
            btn.onclick = () => window.location.href = game.url
            menu.appendChild(btn);
          });
        
    } catch (error) {
        console.error('Error:', error); // Håndterer eventuelle feil
    }
}






