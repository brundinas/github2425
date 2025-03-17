console.log('Running blackjac')
const btnPlay = document.getElementById('btnPlay');
btnPlay.addEventListener("click", play)

async function  play() {
    const result = await registerResult("BlackJack", 1)
    console.log("regresult", result)
}