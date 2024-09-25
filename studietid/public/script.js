
fetchData();

async function fetchData() {

    const rooms = await fetchRooms();
    populateRooms(rooms);
    const subcject = await fetchSubjects()
    const activities = await fetchActivity()


}


function populateRooms(rooms) {
    const select = document.getElementById('roomSelect');
    rooms.forEach(room => {
        const option = document.createElement('option');
        option.value = room.id;
        option.textContent = room.name;
        select.appendChild(option);
    });
}



async function fetchActivity() {
    try {
        // Fetch API brukes for å hente data fra URLen
        let response = await fetch('/getactivites/'); // Hente brukere fra studietidDB
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

async function fetchRooms() {
    try {
        // Fetch API brukes for å hente data fra URLen
        let response = await fetch('/getrooms/'); // Hente brukere fra studietidDB
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

async function fetchSubjects() {
    try {
        // Fetch API brukes for å hente data fra URLen
        let response = await fetch('/getsubjects/'); // Hente brukere fra studietidDB
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


const regForm = document.getElementById('registerForm')
//regForm.addEventListener('submit', adduser)
 async function adduser(event) {
    event.preventDefault();

    const user = {
        firstName: regForm.firstName.value,
        lastName: regForm.lastName.value,
        idRole: 2,
        isAdmin: 0,
        email: regForm.email.value
    };

    try {
        const response = await fetch('/adduser', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(user)
        });

        const data = await response.json();

        if (data.error) {
            document.getElementById('error').innerText = data.error;
            document.getElementById('success').innerText = '';
        } else {
            document.getElementById('error').innerText = '';
            document.getElementById('success').innerText = 'Bruker registrert.';
        }
    } catch (error) {
        document.getElementById('error').innerText = 'En feil oppstod. Vennligst prøv igjen.';
        console.error('Error:', error);
    }
}



