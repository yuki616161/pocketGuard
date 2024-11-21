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

    // Prepare data for the pie chart
    const categoryData = transactions.reduce((acc, transaction) => {
        acc[transaction.category] = (acc[transaction.category] || 0) + parseFloat(transaction.amount);
        return acc;
    }, {});

    const categoryLabels = Object.keys(categoryData);
    const categoryValues = Object.values(categoryData);

    // Create Pie Chart
    const categoryPieChartCtx = document.getElementById('categoryPieChart').getContext('2d');
    new Chart(categoryPieChartCtx, {
        type: 'pie',
        data: {
            labels: categoryLabels,
            datasets: [{
                data: categoryValues,
                backgroundColor: ['#5A6FE0', '#B7D5F0', '#F6D7F9', '#F9D4D2', '#D49A73', '#191717']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                    labels: { font: { size: 12 } }
                }
            }
        }
    });

    // Prepare data for the bar chart
    const groupedByDate = transactions.reduce((acc, transaction) => {
        const date = transaction.date;
        acc[date] = (acc[date] || 0) + parseFloat(transaction.amount);
        return acc;
    }, {});

    const sortedDates = Object.keys(groupedByDate).sort((a, b) => new Date(a) - new Date(b));
    const barChartValues = sortedDates.map(date => groupedByDate[date]);

    // Create Bar Chart
    const userBarChartCtx = document.getElementById('userBarChart').getContext('2d');
    new Chart(userBarChartCtx, {
        type: 'bar',
        data: {
            labels: sortedDates,
            datasets: [{
                label: 'Transaction Amount',
                data: barChartValues,
                backgroundColor: '##5A6FE0',
                borderColor: '#5A6FE0',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: { title: { display: true, text: 'Date' } },
                y: { title: { display: true, text: 'Amount (RM)' } }
            },
            plugins: { legend: { display: false } }
        }
    });

    // Populate expense and income lists
    const expenseList = document.getElementById('expenses');
    const incomeList = document.getElementById('income');

    transactions.forEach(transaction => {
        const listItem = document.createElement('div');
        listItem.classList.add('transaction-item');

        const label = document.createElement('div');
        label.classList.add('transaction-label');
        label.innerHTML = `
            <div class="transaction-dot" style="background: ${transaction.color || '#F9D4D2'};"></div>
            <span>${transaction.category}</span>
        `;

        const amount = document.createElement('div');
        amount.classList.add('transaction-amount');
        amount.textContent = `${transaction.type === 'income' ? '+' : '-'} ${transaction.amount}`;

        listItem.appendChild(label);
        listItem.appendChild(amount);

        if (transaction.type === 'expense') {
            expenseList.appendChild(listItem);
        } else if (transaction.type === 'income') {
            incomeList.appendChild(listItem);
        }
    });

    // Tab toggle functionality
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            if (tab.dataset.tab === 'expenses') {
                expenseList.style.display = 'block';
                incomeList.style.display = 'none';
            } else {
                expenseList.style.display = 'none';
                incomeList.style.display = 'block';
            }
        });
    });
});