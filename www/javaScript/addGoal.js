document.addEventListener('DOMContentLoaded', () => {
    // Dropdown functionality
    const dropdownBtn = document.querySelector('.dropdown-btn');
    const dropdownContent = document.querySelector('.dropdown-content');
    const categoryLinks = document.querySelectorAll('.dropdown-content a');

    dropdownBtn.addEventListener('click', function () {
        dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
        this.classList.toggle('active');
    });

    categoryLinks.forEach(option => {
        option.addEventListener('click', function (e) {
            e.preventDefault();
            const selectedCategory = this.textContent.trim();
            dropdownBtn.textContent = selectedCategory;
            dropdownContent.style.display = 'none';
        });
    });

    document.addEventListener('click', (e) => {
        if (!dropdownBtn.contains(e.target) && !dropdownContent.contains(e.target)) {
            dropdownContent.style.display = 'none';
        }
    });

    // Handle form submission for both adding and editing goals
    const goalForm = document.getElementById('goalForm');
    const urlParams = new URLSearchParams(window.location.search);
    const goalId = urlParams.get('id');

    if (goalId) {
        // Edit mode: fetch goal data and pre-populate the form
        const goals = JSON.parse(localStorage.getItem('goals')) || [];
        const goalToEdit = goals.find(goal => goal.id === goalId);

        if (goalToEdit) {
            document.getElementById('goalName').value = goalToEdit.name;
            dropdownBtn.textContent = goalToEdit.category; // Assuming you want to show the category in the dropdown
            document.getElementById('targetAmount').value = goalToEdit.targetAmount;
            document.getElementById('currentAmount').value = goalToEdit.currentAmount;
            document.getElementById('deadline').value = goalToEdit.deadline;
        } else {
            alert('Goal not found!');
            window.location.href = 'goalList.html'; // Redirect if goal is not found
        }
    }

    goalForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form values
        const goalName = document.getElementById('goalName').value;
        const goalCategory = dropdownBtn.textContent;
        const targetAmount = parseFloat(document.getElementById('targetAmount').value);
        const currentAmount = parseFloat(document.getElementById('currentAmount').value);
        const deadline = document.getElementById('deadline').value;

        // Validation
        if (!goalName || !goalCategory || isNaN(targetAmount) || isNaN(currentAmount) || !deadline) {
            alert('Please fill out all fields');
            return;
        }

        const goal = {
            id: goalId || Date.now().toString(), // Use existing goal ID if editing, otherwise generate new ID
            name: goalName,
            category: goalCategory,
            targetAmount,
            currentAmount,
            deadline
        };

        const goals = JSON.parse(localStorage.getItem('goals')) || [];

        if (goalId) {
            // Edit mode: update the existing goal
            const updatedGoals = goals.map(g => g.id === goalId ? goal : g);
            localStorage.setItem('goals', JSON.stringify(updatedGoals));
            alert('Goal updated successfully!');
        } else {
            // Add new goal
            goals.push(goal);
            localStorage.setItem('goals', JSON.stringify(goals));
            alert('Goal added successfully!');
        }

        // Redirect to the goals list page after adding/editing
        window.location.href = 'goalList.html';
    });
});
