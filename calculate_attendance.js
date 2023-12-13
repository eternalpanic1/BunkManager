function calculateAttendance() {
    var totalClasses = parseInt(document.getElementById('total-classes').value);
    var attendedClasses = parseInt(document.getElementById('attended-classes').value);
    var goalPercentage = parseInt(document.getElementById('goal-percentage').value);

    // Update the output element with the current slider value
    document.getElementById('output').textContent = goalPercentage + '%';

    var currentPercentage = (attendedClasses / totalClasses) * 100;
    var classesSkipped = totalClasses - attendedClasses;

    var classesNeeded = 0;
    var classesCanSkip = 0;

    if (currentPercentage < goalPercentage) {
        var remainingPercentage = goalPercentage - currentPercentage;
        classesNeeded = Math.ceil((remainingPercentage * totalClasses) / (100 - goalPercentage));
    } else {
        var excessPercentage = currentPercentage - goalPercentage;
        classesCanSkip = Math.floor((excessPercentage * totalClasses) / goalPercentage);
    }

    var summaryDiv = document.getElementById('attendance-summary');
    summaryDiv.innerHTML = `
        <p>Classes Attended: ${attendedClasses}</p>
        <p>Classes Skipped: ${classesSkipped}</p>
        <p>Current Attendance Percentage: ${currentPercentage.toFixed(2)}%</p>
        <p>${classesNeeded > 0 ? `You need to attend ${classesNeeded} more classes to reach your goal.` : `You can skip up to ${classesCanSkip} classes and still meet your goal.`}</p>
    `;
}

// Add event listener to dynamically update the output when the slider changes
document.getElementById('goal-percentage').addEventListener('input', calculateAttendance);
