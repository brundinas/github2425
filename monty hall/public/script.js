let chosenDoor = null;
let revealedDoor = null;

document.querySelectorAll('.door').forEach(button => {
  button.addEventListener('click', () => {
    chosenDoor = parseInt(button.dataset.door);
    fetch('/reveal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chosenDoor })
    })
    .then(res => res.json())
    .then(data => {
      revealedDoor = data.revealedDoor;
      document.getElementById('message').innerHTML = 
        `Monty åpner dør ${revealedDoor + 1} og viser en geit.<br>
         Vil du bytte dør? 
         <button onclick="decide(true)">Bytt</button> 
         <button onclick="decide(false)">Behold</button>`;
    });
  });
});

function decide(switchDoor) {
  fetch('/result', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chosenDoor, revealedDoor, switchDoor })
  })
  .then(res => res.json())
  .then(data => {
    document.getElementById('message').innerHTML = 
      `Du valgte dør ${data.finalChoice + 1}.<br>
       Bak døren var det ${data.won ? 'en BIL 🎉' : 'en geit 🐐'}`;
  });
}
