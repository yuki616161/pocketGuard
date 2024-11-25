document.addEventListener("DOMContentLoaded", () => {
    // Show loading animation
    const loadingElement = document.getElementById("loading");
    loadingElement.style.display = "block";

    // Retrieve user data from localStorage
    const userRegistrationData = JSON.parse(localStorage.getItem('loggedInUser')) || {};
    const username = userRegistrationData.username || "User";
    const gender = userRegistrationData.gender || "default";

    const profileImage = document.getElementById("profileImage");
    const usernameElement = document.getElementById("username");
    const greetingMessage = document.getElementById("greetingMessage");

    // Set personalized welcome message
    usernameElement.textContent = username;

    // Update greeting based on time of day
    const hours = new Date().getHours();
    let greeting = "Hello";
    if (hours < 12) {
        greeting = "Good Morning";
    } else if (hours < 18) {
        greeting = "Good Afternoon";
    } else {
        greeting = "Good Evening";
    }
    greetingMessage.textContent = `${greeting}!`;

    // Set profile image based on gender
    if (gender === "Male") {
        profileImage.src = "images/man.png";
    } else if (gender === "Female") {
        profileImage.src = "images/woman.png";
    } else {
        profileImage.src = "images/default.png";
    }

    // Hide loading animation after data is set
    loadingElement.style.display = "none";
});

document.addEventListener('DOMContentLoaded', () => {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (!loggedInUser) {
        alert("User is not logged in. Please log in first.");
        return;
    }

    const userTransactionsKey = `transactions_${loggedInUser}`;
    const transactions = JSON.parse(localStorage.getItem(userTransactionsKey)) || [];

    if (transactions.length === 0) {
        alert("No transactions found for the logged-in user.");
        return;
    }

    // Prepare data for the list (Category Data)
    function prepareCategoryData(transactions) {
        return transactions.reduce((acc, transaction) => {
            acc[transaction.category] = (acc[transaction.category] || 0) + parseFloat(transaction.amount);
            return acc;
        }, {});
    }

    // Assigning an icon for each category
    function getCategoryIcon(category) {
        const icons = {
            "Food": "images/food.png",
            "Transportation": "images/transportation.png",
            "Entertainment": "images/entertainment.png",
            "Bonus": "images/bonus.png",
            "Shopping": "images/shopping.png",
            "Health": "images/health.png",
            "Other": "images/others.png",
            "Allowance": "images/allowance.png",
            "Salary": "images/salary.png",
            "Pretty Cash": "images/pretty cash.png",
            "Others": "images/others1.png",
            "Utilities": "images/utilities.png",
            "Beauty": "images/beauty.png",
            "Pets": "images/pets.png",
            "Culture": "images/culture.png",
            "Apparel": "images/apparel.png",
            "Education": "images/education.png",
            "Gift": "images/gift.png",
            "Social Life": "images/social life.png",
            "Household": "images/household.png"
        };
        
        return icons[category] || "images/default.png"; // Default icon if not found
    }    

    // Generate the category cards
    function generateCategoryCards(transactions) {
        const categoryData = prepareCategoryData(transactions);
        const categoryListContainer = document.getElementById('categoryListContainer');
        categoryListContainer.innerHTML = ''; // Clear previous list
    
        Object.keys(categoryData).forEach(category => {
            const card = document.createElement('div');
            card.classList.add('categoryCard');
    
            // Icon for each category (using image)
            const categoryIcon = document.createElement('div');
            categoryIcon.classList.add('categoryIcon');
            const iconPath = getCategoryIcon(category);
            categoryIcon.innerHTML = `<img src="${iconPath}" alt="${category} Icon" class="category-icon">`;
    
            const categoryName = document.createElement('span');
            categoryName.textContent = category;
    
            const categoryAmount = document.createElement('div');
            categoryAmount.classList.add('categoryAmount');
            categoryAmount.textContent = `RM ${categoryData[category].toFixed(2)}`;
    
            card.appendChild(categoryIcon);
            card.appendChild(categoryName);
            card.appendChild(categoryAmount);
            categoryListContainer.appendChild(card);
        });
    }    

    // Generate the category cards when the page loads
    generateCategoryCards(transactions);
});

function displayRecentTransactions() {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (!loggedInUser) return;

    const userTransactionsKey = `transactions_${loggedInUser}`;
    const transactions = JSON.parse(localStorage.getItem(userTransactionsKey)) || [];

    // Sort by date (most recent first)
    const sortedTransactions = transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Limit to 5 recent transactions
    const recentTransactions = sortedTransactions.slice(0, 5);

    const recentTransactionsContainer = document.getElementById('recentTransactions');
    recentTransactionsContainer.innerHTML = ''; // Clear existing content

    if (recentTransactions.length === 0) {
        recentTransactionsContainer.innerHTML = '<p>No recent transactions.</p>';
        return;
    }

    // Populate recent transactions
    recentTransactions.forEach(transaction => {
        const transactionItem = document.createElement('div');
        transactionItem.classList.add('transaction-item');

        // Determine icon path based on the category
        const iconPath = `images/${transaction.category.toLowerCase()}.png`;

        transactionItem.innerHTML = `
            <div class="transaction-icon">
                <img src="${iconPath}" alt="${transaction.category}" class="category-icon">
            </div>
            <div class="transaction-details">
                <div class="transaction-category">${transaction.category}</div>
                <div class="transaction-description">${transaction.description}</div>
            </div>
            <div class="transaction-amount ${transaction.type === 'income' ? 'income' : 'expense'}">
                ${transaction.type === 'income' ? '+' : '-'} RM${transaction.amount}
            </div>
        `;

        recentTransactionsContainer.appendChild(transactionItem);
    });
}

// Call on page load
document.addEventListener('DOMContentLoaded', displayRecentTransactions);
