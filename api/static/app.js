let attended = 0;
let skipped = 0;
let goal = 75;

function increaseAttended() {
    attended++;
    updateAttendance();
}

function decreaseAttended() {
    attended = Math.max(0, attended - 1);
    updateAttendance();
}

function increaseSkipped() {
    skipped++;
    updateAttendance();
}

function decreaseSkipped() {
    skipped = Math.max(0, skipped - 1);
    updateAttendance();
}

function goalChange() {
    goal = document.getElementById('goalRange').value;
    document.getElementById('goalPercentage').innerText = goal;
    updateAttendance();
}

function calculateAttendance() {
    const totalClasses = attended + skipped;
    const currentPercentage = totalClasses > 0 ? (attended / totalClasses) * 100 : 0;
    const classesNeeded = currentPercentage < goal ? Math.ceil(((goal - currentPercentage) * totalClasses) / (100 - goal)) : 0;
    const classesCanSkip = currentPercentage > goal ? Math.floor(((currentPercentage - goal) * totalClasses) / goal) : 0;

    // update hmtl elements
    document.getElementById('totalClasses').innerText = totalClasses;
    document.getElementById('currentPercentage').innerText = currentPercentage.toFixed(2);
    
    if (currentPercentage < goal) {
        document.getElementById('message').innerText = `You need to attend ${classesNeeded} more classes to reach your goal.`;
    } else {
        document.getElementById('message').innerText = `You can skip up to ${classesCanSkip} classes and still meet your goal.`;
    }
}

function updateAttendance() {
    document.getElementById('attendedClasses').innerText = attended;
    document.getElementById('skippedClasses').innerText = skipped;
    calculateAttendance();
}

function saveAttendance() {
    const data = {
        attended: attended,
        skipped: skipped,
        goal: goal
    };

    fetch('/save-attendance', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .catch(error => {
        console.error('Error:', error);
    });
}


document.getElementById('goalPercentage').innerText = goal;

// event listeners
document.getElementById('increaseAttendedBtn').addEventListener('click', increaseAttended);
document.getElementById('decreaseAttendedBtn').addEventListener('click', decreaseAttended);
document.getElementById('increaseSkippedBtn').addEventListener('click', increaseSkipped);
document.getElementById('decreaseSkippedBtn').addEventListener('click', decreaseSkipped);
document.getElementById('goalRange').addEventListener('input', goalChange);
document.getElementById('calculateBtn').addEventListener('click', calculateAttendance);
document.getElementById('saveBtn').addEventListener('click', saveAttendance);
document.getElementById('').addEventListener('click', increaseSkipped);
document.getElementById('decreaseSkippedBtn').addEventListener('click', decreaseSkipped);

// Initialize attendance data and calculate attendance on page load
updateAttendance();
