document.addEventListener("DOMContentLoaded", () => {
    // Show loading animation
    const loadingElement = document.getElementById("loading");
    loadingElement.style.display = "block";

    // Retrieve user data from localStorage
    const userRegistrationData = JSON.parse(localStorage.getItem('userRegistrationData')) || {};
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

// Initialize income, expenses, and categories with image paths
let totalIncome = 0;
let totalExpenses = 0;
let categories = {
    food: { icon: 'images/burger.png', amount: 0, label: 'Food' },
    transportation: { icon: 'images/car.png', amount: 0, label: 'Transportation' },
    shopping: { icon: 'images/shopping-cart.png', amount: 0, label: 'Shopping' },
    health: { icon: 'images/healthcare.png', amount: 0, label: 'Health' },
    entertainment: { icon: 'images/entertainmentIcon.png', amount: 0, label: 'Entertainment' },
    utilities: { icon: 'images/utilities.png', amount: 0, label: 'Utilities' },
    beauty: { icon: 'images/cosmetics.png', amount: 0, label: 'Beauty' },
    pets: { icon: 'images/pet-food.png', amount: 0, label: 'Pets' },
    culture: { icon: 'images/painting.png', amount: 0, label: 'Culture' },
    apparel: { icon: 'images/laundry.png', amount: 0, label: 'Apparel' },
    education: { icon: 'images/book.png', amount: 0, label: 'Education' },
    gift: { icon: 'images/gift.png', amount: 0, label: 'Gift' },
    social_life: { icon: 'images/socialLifeIcon.png', amount: 0, label: 'Social Life' },
    household: { icon: 'images/household.png', amount: 0, label: 'Household' },
    others: { icon: 'images/boxes.png', amount: 0, label: 'Others' }
};

// Show/hide category selection based on transaction type
$('#type').change(function () {
    if ($(this).val() === 'expense') {
        $('#categoryGroup').show();
    } else {
        $('#categoryGroup').hide();
    }
});

function updateBalance() {
    const totalBalance = totalIncome - totalExpenses;

    $('#totalBalance').text('RM' + totalBalance.toFixed(2)); // Display currency in RM
    $('#incomeAmount').text('RM' + totalIncome.toFixed(2));
    $('#expenseAmount').text('RM' + totalExpenses.toFixed(2));

    updateCategories();
}

function updateCategories() {
    const categoryList = $('#categoryList');
    categoryList.empty();

    // Only show categories with amounts > 0
    Object.entries(categories)
        .filter(([_, data]) => data.amount > 0)
        .sort((a, b) => b[1].amount - a[1].amount)
        .forEach(([category, data]) => {
            const percentage = (data.amount / totalExpenses * 100).toFixed(1);

            const categoryHtml = `
                <div class="category-item">
                    <div class="category-info">
                        <div class="category-icon">${data.icon}</div>
                        <div class="category-detail">
                            <div class="category-name">${category.charAt(0).toUpperCase() + category.slice(1)}</div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${percentage}%; background: ${data.color}"></div>
                            </div>
                        </div>
                    </div>
                    <div class="category-amount">RM${data.amount.toFixed(2)}</div>
                </div>
            `;
            categoryList.append(categoryHtml);
        });
}

function addTransaction() {
    const amount = parseFloat($('#amount').val());
    const type = $('#type').val();
    const category = $('#category').val();

    if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount');
        return;
    }

    if (type === 'income') {
        totalIncome += amount;
    } else {
        totalExpenses += amount;
        categories[category].amount += amount;
    }

    updateBalance();

    // Clear form
    $('#amount').val('');
    $('#type').val('income');
    $('#categoryGroup').hide();

    // Switch to home section
    showSection('home', document.querySelector('.nav-item'));
}

function showSection(sectionId, navItem) {
    $('.content-section').removeClass('active');
    $('.nav-item').removeClass('active');
    $('#' + sectionId).addClass('active');
    $(navItem).addClass('active');
}

// Initialize
updateBalance();
