const express = require('express');
const app = express();
app.use(express.static('public'));
app.use(express.json());

let prizeDoor = Math.floor(Math.random() * 3);

app.post('/reveal', (req, res) => {
  const { chosenDoor } = req.body;
  let options = [0, 1, 2].filter(d => d !== chosenDoor && d !== prizeDoor);
  let revealedDoor = options[Math.floor(Math.random() * options.length)];
  res.json({ revealedDoor });
});

app.post('/result', (req, res) => {
  const { chosenDoor, revealedDoor, switchDoor } = req.body;
  let finalChoice = switchDoor
    ? [0, 1, 2].find(d => d !== chosenDoor && d !== revealedDoor)
    : chosenDoor;
  let won = finalChoice === prizeDoor;
  prizeDoor = Math.floor(Math.random() * 3); // reset for neste runde
  res.json({ finalChoice, won });
});

app.listen(3000, () => console.log('Serveren kjører på http://localhost:3000'));
