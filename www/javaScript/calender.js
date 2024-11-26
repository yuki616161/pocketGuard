document.addEventListener('DOMContentLoaded', function () {
    const calendarEl = document.getElementById('calendar');
    const goals = JSON.parse(localStorage.getItem('goals')) || [];
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    if (!loggedInUser) {
        alert('Please log in first');
        window.location.href = "login.html"; // Redirect to login if not authenticated
        return;
    }

    // Filter goals by the logged-in user
    const userGoals = goals.filter(goal => goal.userId === loggedInUser.username);

    // Map goals to calendar events
    const events = userGoals.map(goal => ({
        title: goal.name,
        start: goal.deadline,
        description: `Target: MYR ${goal.targetAmount.toFixed(2)}\nCurrent: MYR ${goal.currentAmount.toFixed(2)}`,
        className: goal.currentAmount >= goal.targetAmount ? 'achieved' : 'pending', // Use class for styling
    }));

    // Initialize FullCalendar
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek',
        },
        events: events,
        eventClick: function (info) {
            alert(`Goal: ${info.event.title}\n${info.event.extendedProps.description}`);
        },
        eventDidMount: function (info) {
            // Add a custom tooltip for events
            const eventElement = info.el;
            eventElement.setAttribute('title', info.event.extendedProps.description);
            eventElement.style.cursor = 'pointer';
        },
    });

    calendar.render();
});
