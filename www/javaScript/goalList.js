document.addEventListener('DOMContentLoaded', function () {
    const goalsList = document.getElementById('goalsList');
    const goals = JSON.parse(localStorage.getItem('goals')) || [];

    // Get logged-in user data
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!loggedInUser) {
        alert('Please log in first');
        return;
    }

    // Filter goals by the logged-in user
    const userGoals = goals.filter(goal => goal.userId === loggedInUser.username);

    // Function to calculate the progress percentage
    function calculateProgress(currentAmount, targetAmount) {
        return targetAmount > 0 ? Math.min((currentAmount / targetAmount) * 100, 100).toFixed(1) : 0;
    }

    function getTimeRemaining(deadline) {
        const now = new Date();
        const total = Date.parse(deadline) - now.getTime(); // Both in milliseconds
        const days = Math.floor(total / (1000 * 60 * 60 * 24));
        const hours = Math.floor((total / (1000 * 60 * 60)) % 24);

        return {
            total,
            days,
            hours,
            isExpired: total < 0
        };
    }

    // Function to format amount as currency (changed from USD to MYR)
    function formatMoney(amount) {
        return new Intl.NumberFormat('en-MY', {
            style: 'currency',
            currency: 'MYR'
        }).format(amount);
    }

    // Function to format the deadline with time remaining
    function formatDeadline(deadline, timeRemaining) {
        if (timeRemaining.isExpired) {
            return `<span class="countdown" style="color: #e74c3c;">Expired</span>`;
        }
        if (timeRemaining.days === 1) {
            return `<span class="countdown">Due today!</span>`;
        }
        if (timeRemaining.days === 2) {
            return `<span class="countdown">Due tomorrow</span>`;
        }
        return `<span class="countdown">${timeRemaining.days} days ${timeRemaining.hours} hours left</span>`;
    }

    // Function to determine the color of the progress bar based on the percentage
    function getProgressColor(progress) {
        if (progress >= 90) return '#2ecc71'; // Emerald Green - High achievement
        if (progress >= 70) return '#27ae60'; // Strong Green - Good progress
        if (progress >= 50) return '#f39c12'; // Golden Yellow - Average progress
        if (progress >= 30) return '#f39c12'; // Warm Amber - Need attention
        return '#e74c3c'; // Red - Critical, below expectations
    }

    // Function to render the goals in the list
    function renderGoals() {
        goalsList.innerHTML = '';

        if (userGoals.length === 0) {
            goalsList.innerHTML = `
                <div class="no-goals">
                    <h2>No goals added yet</h2>
                    <p>Start by adding your first financial goal!</p>
                </div>
            `;
            return;
        }

        userGoals.forEach(goal => {
            const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
            const timeRemaining = getTimeRemaining(goal.deadline);
            const remaining = goal.targetAmount - goal.currentAmount;

            const goalCard = `
                <div class="goal-card">
                    <div class="goal-header">
                        <h2 class="goal-name">${goal.name}</h2>
                        <span class="category-badge ${goal.category.toLowerCase()}">${goal.category}</span>
                    </div>

                    <div class="progress-container">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${progress}%; background: linear-gradient(45deg, ${getProgressColor(progress)}, ${getProgressColor(progress)}88)">
                                <div class="progress-text">${progress}%</div>
                            </div>
                        </div>
                    </div>

                    <div class="goal-details">
                        <div class="detail-item">
                            <span class="detail-label">Current Amount:</span>
                            <span class="detail-value">${formatMoney(goal.currentAmount)}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Target Amount:</span>
                            <span class="detail-value">${formatMoney(goal.targetAmount)}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Remaining:</span>
                            <span class="detail-value">${formatMoney(remaining)}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Time Remaining:</span>
                            <span class="detail-value">${formatDeadline(goal.deadline, timeRemaining)}</span>
                        </div>
                    </div>

                    <div class="goal-actions">
                        <button class="edit-btn" data-id="${goal.id}">Edit Goal</button>
                        <button class="delete-btn" data-id="${goal.id}">Delete Goal</button>
                    </div>
                </div>
            `;
            goalsList.insertAdjacentHTML('beforeend', goalCard);
        });
    }

    // Event listener for editing and deleting goals
    goalsList.addEventListener('click', function (e) {
        const button = e.target.closest('button');
        if (!button) return;

        const goalId = button.getAttribute('data-id');

        if (button.classList.contains('delete-btn')) {
            if (confirm('Are you sure you want to delete this goal?')) {
                const index = userGoals.findIndex(g => g.id === goalId);
                if (index > -1) {
                    userGoals.splice(index, 1);
                    localStorage.setItem('goals', JSON.stringify(goals)); // Update the full goals list in localStorage
                    renderGoals(); // Re-render goals
                }
            }
        } else if (button.classList.contains('edit-btn')) {
            window.location.href = `addGoal.html?id=${goalId}`;
        }
    });

    // Update countdown timer every minute
    setInterval(() => {
        renderGoals();
    }, 60000);

    // Initial render of the goals
    renderGoals();
});
