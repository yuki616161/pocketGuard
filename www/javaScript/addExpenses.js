const tabs = document.querySelectorAll('.tab');
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
    });
});

// Calculator Functions
const calculator = document.getElementById("calculator");

function inputKeypad(value) {
    const amountField = document.getElementById('amount');
    amountField.value += value;
}

function clearKeypad() {
    document.getElementById('amount').value = '';
}

function calculateKeypad() {
    const amountField = document.getElementById('amount');
    try {
        amountField.value = eval(amountField.value);
        hideCalculator();
    } catch {
        amountField.value = 'Error';
    }
}

function showCalculator() {
    calculator.style.display = "grid"; // Show the calculator
}

function hideCalculator() {
    calculator.style.display = "none"; // Hide the calculator
}

// Automatically calculate when the amount field loses focus
document.getElementById('amount').addEventListener('blur', function () {
    const amountField = document.getElementById('amount');
    try {
        // Check if the input contains a mathematical expression
        if (amountField.value.includes('+') || amountField.value.includes('-') || 
            amountField.value.includes('*') || amountField.value.includes('/')) {
            amountField.value = eval(amountField.value); // Calculate the result
        }
    } catch {
        amountField.value = 'Error'; // Set error if the expression is invalid
    }
});

// Category Grid Functions
function selectCategory(category) {
    const button = document.querySelector('.dropdown-btn');
    button.textContent = category;
}

// General Click Event for Outside Click Handling
window.addEventListener("click", function (event) {
    if (!event.target.closest("#calculator") && !event.target.closest("#amount")) {
        hideCalculator();
    }
    if (!event.target.closest("#categoryGrid") && !event.target.closest("#selectedCategory")) {
        hideCategoryGrid();
    }
});

function toggleCategoryDropdown() {
    var dropdown = document.getElementById("categoryDropdown");
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
  }
  
  function selectCategory(category) {
    // Update button text with selected category
    document.querySelector(".dropdown-btn").textContent = category;
  
    // Close dropdown after selection
    document.getElementById("categoryDropdown").style.display = "none";
  }   
  
//Account Grid
function toggleAccountGrid() {
    const accountGrid = document.getElementById('accountGrid');
    accountGrid.style.display = accountGrid.style.display === 'none' || accountGrid.style.display === ''
        ? 'block' : 'none';
}

function selectAccount(accountName, iconPath) {
    const selectedAccount = document.getElementById('selectedAccount');
    selectedAccount.value = accountName;
    document.getElementById('accountGrid').style.display = 'none';
}

// Close dropdown when clicking outside
window.onclick = function (event) {
    if (!event.target.matches('#selectedAccount')) {
        const accountGrid = document.getElementById('accountGrid');
        if (accountGrid.style.display === 'block') {
            accountGrid.style.display = 'none';
        }
    }
};
// Validate Input Fields
function validateTransaction(data) {
    let errorMessages = [];
    if (!data.date) {
        errorMessages.push("Date is required.");
    }
    if (!data.amount || isNaN(data.amount)) {
        errorMessages.push("A valid amount is required.");
    }
    if (!data.category || data.category === "Select Category") {
        errorMessages.push("Category is required.");
    }
    if (!data.account) {
        errorMessages.push("Account is required.");
    }
    return errorMessages; // Return an array of error messages
}

// Save Expense Data
function saveExpenseData() {
    const amountIncomeField = document.getElementById('amount');
    
    // Automatically evaluate the amount if it contains an expression
    try {
        if (amountIncomeField.value.includes('+') || amountIncomeField.value.includes('-') || 
            amountIncomeField.value.includes('*') || amountIncomeField.value.includes('/')) {
            amountIncomeField.value = eval(amountIncomeField.value); // Calculate the result
        }
    } catch {
        alert('Invalid mathematical expression in Income Amount field.');
        return; // Exit without saving if the expression is invalid
    }

    const loggedInUser = localStorage.getItem('loggedInUser');

    if (!loggedInUser) {
        alert("User is not logged in. Please log in first.");
        return; // Exit without saving if no user is logged in
    }

    const expenseData = {
        date: document.getElementById('date').value,
        amount: amountIncomeField.value,
        category: document.querySelector('.dropdown-btn').textContent,
        account: document.getElementById('selectedAccount').value,
        description: document.getElementById('Description').value || "", // Default to empty string
        type: "expense", // Differentiates expense from other transaction types
        username: loggedInUser // Store the username with the transaction
    };

    const validationErrors = validateTransaction(expenseData);

    if (validationErrors.length > 0) {
        alert(validationErrors.join("\n"));
        return;
    }

    const transactionToEdit = localStorage.getItem('transactionToEdit');

    if (transactionToEdit) {
        const transactions = getTransactionsForUser();
        const oldTransaction = JSON.parse(transactionToEdit);

        // Find the index of the transaction to edit
        const index = transactions.findIndex(t => t.id === oldTransaction.id);

        if (index !== -1) {
            // Replace the old transaction with the new data
            transactions[index] = { ...oldTransaction, ...expenseData };
            const userTransactionsKey = `transactions_${loggedInUser}`;
            localStorage.setItem(userTransactionsKey, JSON.stringify(transactions));

            alert("Transaction updated successfully!");
        }
    } else {
        saveTransaction(expenseData); // Handle as a new transaction if no edit data exists
    }

    localStorage.removeItem('transactionToEdit'); // Clear the edit flag
    window.location.href = 'home.html'; // Redirect to the home page
}


function saveTransaction(transaction) {
    const loggedInUser = localStorage.getItem('loggedInUser'); // Get the current logged-in user

    if (!loggedInUser) {
        alert("User is not logged in. Please log in first.");
        return;
    }

    const userTransactionsKey = `transactions_${loggedInUser}`; // Unique key per user
    let transactions = JSON.parse(localStorage.getItem(userTransactionsKey)) || []; // Retrieve existing transactions or initialize an empty array

    // Add a unique ID to the transaction
    transaction.id = Date.now().toString(); // Use the current timestamp as a unique ID

    transactions.push(transaction); // Add the new transaction
    localStorage.setItem(userTransactionsKey, JSON.stringify(transactions)); // Save the updated transactions list
}



function getTransactionsForUser() {
    const loggedInUser = localStorage.getItem('loggedInUser'); // Get the current logged-in user

    if (!loggedInUser) {
        alert("User is not logged in. Please log in first.");
        return []; // Return an empty array if no user is logged in
    }

    const userTransactionsKey = `transactions_${loggedInUser}`; // Unique key per user
    return JSON.parse(localStorage.getItem(userTransactionsKey)) || []; // Retrieve transactions for the logged-in user or an empty array if none
}


// Clear input fields
function clearInputs() {
    document.getElementById('date').value = '';
    document.getElementById('amount').value = '';
    document.querySelector('.dropdown-btn').textContent = 'Select Category'; // Reset category dropdown
    document.getElementById('selectedAccount').value = '';
    document.getElementById('Description').value = '';
}


document.addEventListener('DOMContentLoaded', () => {
    const transactionToEdit = localStorage.getItem('transactionToEdit');

    if (transactionToEdit) {
        const transaction = JSON.parse(transactionToEdit);

        // Pre-fill form fields
        document.getElementById('date').value = transaction.date;
        document.getElementById('amount').value = transaction.amount;
        document.querySelector('.dropdown-btn').textContent = transaction.category;
        document.getElementById('selectedAccount').value = transaction.account;
        document.getElementById('Description').value = transaction.description;

        // Update the button to indicate it's an edit operation
        document.getElementById('saveButton').textContent = 'Update';
    }
});



