
document.addEventListener('DOMContentLoaded', () => {
    // Check if the user is logged in
    if (sessionStorage.getItem('loggedIn') === 'true') {
        fetchData();
    } 
});

const activityHTMLTable = document.getElementById('tableactivity');

async function fetchData() {

    const rooms = await fetchRooms();
    populateRooms(rooms);
    const subcjects = await fetchSubjects()
    populateSubjects(subcjects)
    const activities = await fetchActivities()
    showActivities(activities)

}

function showActivities(activities) {
    
    activities.forEach(activity => {
        appendActivity(activity)
        
    });
}

function appendActivity(activity) {
    
    const row = document.createElement('tr');
    activityHTMLTable.appendChild(row);
   
    const startTimeCell = document.createElement('td');
    startTimeCell.textContent = activity.startTime;
    row.appendChild(startTimeCell);
    
    const roomCell = document.createElement('td');
    roomCell.textContent = activity.rom;
    row.appendChild(roomCell);
    
    const subjectCell = document.createElement('td');
    subjectCell.textContent = activity.fag;
    row.appendChild(subjectCell);
    
    const statusCell = document.createElement('td');
    statusCell.textContent = activity.status;
    row.appendChild(statusCell);
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

function populateSubjects(subjects) {
    const select = document.getElementById('subjectSelect');
    subjects.forEach(subject => {
        const option = document.createElement('option');
        option.value = subject.id;
        option.textContent = subject.name;
        select.appendChild(option);
    });
}



async function fetchActivities() {
    try {
        // Fetch API brukes for å hente data fra URLen
        let response = await fetch('/getactivities/'); // Hente brukere fra studietidDB
        let data = await response.json(); // Konverterer responsen til JSON
        console.log('fetchActivities');
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
regForm.addEventListener('submit', addActivity)
 async function addActivity(event) {
    event.preventDefault();

    const activity = {
        idUser: 1,
        idSubject: regForm.subjectSelect.value,
        idRoom: regForm.roomSelect.value
    };

    try {
        const response = await fetch('/addactivity', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(activity)
        });

        const data = await response.json();

        if (data.error) {
            document.getElementById('error').innerText = data.error;
            document.getElementById('success').innerText = '';
        } else {
                appendActivity(data)
        }
    } catch (error) {
        document.getElementById('error').innerText = 'En feil oppstod. Vennligst prøv igjen.';
        console.error('Error:', error);
    }
}



