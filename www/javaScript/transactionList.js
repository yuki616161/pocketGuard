document.addEventListener("DOMContentLoaded", () => {
const transactionList = document.getElementById("transactionList");

// Function to get the transactions of the logged-in user
function getTransactionsForUser() {
    const loggedInUser = localStorage.getItem('loggedInUser');
        if (!loggedInUser) {
            alert("User is not logged in. Please log in first.");
            return [];
        }
        const userTransactionsKey = `transactions_${loggedInUser}`;
        return JSON.parse(localStorage.getItem(userTransactionsKey)) || [];
}

// Function to render transactions
function renderTransactions(filteredTransactions) {
    transactionList.innerHTML = ""; // Clear the list
        if (filteredTransactions.length === 0) {
            transactionList.innerHTML = "<p>No transactions found.</p>";
            return;
        }

// Group transactions by date
const groupedTransactions = filteredTransactions.reduce((acc, transaction) => {
    if (!acc[transaction.date]) {
        acc[transaction.date] = [];
        }
        acc[transaction.date].push(transaction);
        return acc;
}, {});

// Sort the dates in descending order
const sortedDates = Object.keys(groupedTransactions).sort(
    (a, b) => new Date(b) - new Date(a)
);

// Render grouped transactions by sorted dates
sortedDates.forEach(date => {
    const dateCard = document.createElement("div");
    dateCard.classList.add("date-card");

    const dateHeader = document.createElement("div");
    dateHeader.classList.add("date-header");
    dateHeader.textContent = date;

    dateCard.appendChild(dateHeader);

    groupedTransactions[date].forEach(transaction => {
        const transactionItem = document.createElement("div");
        transactionItem.classList.add("transaction-item");
        transactionItem.dataset.id = transaction.id; // Set the ID as a data attribute

        transactionItem.innerHTML = `
            <div class="category-section">${transaction.category}</div>
                <div class="details-section">
                    <div class="transaction-account">${transaction.account}</div>
                        <div class="transaction-description">${transaction.description}</div>
            </div>
            <div class="transaction-actions">
                <span class="transaction-amount ${transaction.type === 'income' ? 'income' : 'expense'}">
                    <span class="sign">${transaction.type === 'income' ? '+' : '-'}</span> 
                    <span class="amount">RM${transaction.amount}</span>
                </span>
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </div>
                `;
                dateCard.appendChild(transactionItem);
            });

            transactionList.appendChild(dateCard);
});
    }

// Filter transactions for the current month
function filterByMonth() {
    const currentMonth = new Date().getMonth(); // Current month (0-11)
    const currentYear = new Date().getFullYear();

// Re-fetch transactions from localStorage
    const transactions = getTransactionsForUser();

    return transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return (
            transactionDate.getMonth() === currentMonth &&
            transactionDate.getFullYear() === currentYear
        );
    });
}

// "All" filter
function showAllTransactions() {
    // Re-fetch transactions from localStorage
    const transactions = getTransactionsForUser();
    renderTransactions(transactions); // Render all transactions
}

// Attach event listeners to filter buttons
document.getElementById("filter-month").addEventListener("click", () => {
    const filteredTransactions = filterByMonth(); // Get latest transactions filtered by month
    renderTransactions(filteredTransactions);
});

document.getElementById("filter-all").addEventListener("click", () => {
    showAllTransactions(); // Fetch and render all transactions
});

// Attach event listeners to edit and delete buttons dynamically
transactionList.addEventListener("click", (e) => {
    if (e.target.classList.contains("edit-btn")) {
        const transactionId = e.target.closest('.transaction-item').dataset.id; // Get transaction ID
        editTransaction(transactionId);
    } else if (e.target.classList.contains("delete-btn")) {
        const transactionId = e.target.closest('.transaction-item').dataset.id; // Get transaction ID
        deleteTransaction(transactionId, e.target.closest('.transaction-item'));
    }
});

function editTransaction(transactionId) {
    const transactions = getTransactionsForUser();
    const transaction = transactions.find(t => String(t.id) === String(transactionId));
    
    if (transaction) {
        localStorage.setItem('transactionToEdit', JSON.stringify(transaction)); // Store transaction in localStorage
    
        // Redirect to the appropriate page
        if (transaction.type === 'expense') {
            window.location.href = 'addExpenses.html';
        } else if (transaction.type === 'income') {
            window.location.href = 'addIncome.html';
        }
    } else {
        alert("Transaction not found!");
    }
    }
    
// Delete transaction function
function deleteTransaction(transactionId, transactionElement) {
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (!loggedInUser) {
        alert("User is not logged in. Please log in first.");
        return;
    }
    
const userTransactionsKey = `transactions_${loggedInUser}`;
let storedTransactions = JSON.parse(localStorage.getItem(userTransactionsKey)) || [];
    
// Find the transaction by ID and remove it
const index = storedTransactions.findIndex(
    transaction => String(transaction.id) === String(transactionId)
        );
        if (index !== -1) {
            // Remove the transaction
            storedTransactions.splice(index, 1);
    
            // Update localStorage
            localStorage.setItem(userTransactionsKey, JSON.stringify(storedTransactions));
    
            // Remove the DOM element (optional since we re-render)
            transactionElement.remove();
    
            // Re-render the transactions list to reflect the changes
            renderTransactions(getTransactionsForUser());
        } else {
            alert("Transaction not found!");
        }
    }

    // Initial render (default to "All")
    showAllTransactions();
});
