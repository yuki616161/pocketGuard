document.addEventListener("DOMContentLoaded", () => {
    const transactionList = document.getElementById("transactionList");

    // Get the transactions for the logged-in user
    const transactions = getTransactionsForUser();

    if (transactions.length === 0) {
        transactionList.innerHTML = "<p>No transactions found for this user.</p>";
        return;
    }

    // Group transactions by date
    const groupedTransactions = transactions.reduce((acc, transaction) => {
        if (!acc[transaction.date]) {
            acc[transaction.date] = [];
        }
        acc[transaction.date].push(transaction);
        return acc;
    }, {});

    // Sort the dates in descending order
    const sortedDates = Object.keys(groupedTransactions).sort((a, b) => new Date(b) - new Date(a));

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
        const transaction = transactions.find(t => t.id === transactionId);
    
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
        const loggedInUser = localStorage.getItem('loggedInUser');
        if (!loggedInUser) {
            alert("User is not logged in. Please log in first.");
            return;
        }

        const userTransactionsKey = `transactions_${loggedInUser}`;
        let transactions = JSON.parse(localStorage.getItem(userTransactionsKey)) || [];

        // Find the transaction by ID and remove it
        const index = transactions.findIndex(transaction => transaction.id === transactionId);
        if (index !== -1) {
            transactions.splice(index, 1);
            localStorage.setItem(userTransactionsKey, JSON.stringify(transactions));

            // Remove the transaction from the DOM directly
            transactionElement.remove();
        } else {
            alert("Transaction not found!");
        }
    }
});

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
