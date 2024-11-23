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

    let pieChart, barChart; // Store chart instances for updates

    // Prepare initial data for charts
    function prepareCategoryData(transactions) {
        return transactions.reduce((acc, transaction) => {
            acc[transaction.category] = (acc[transaction.category] || 0) + parseFloat(transaction.amount);
            return acc;
        }, {});
    }

    function prepareDateData(transactions) {
        return transactions.reduce((acc, transaction) => {
            const date = transaction.date;
            acc[date] = (acc[date] || 0) + parseFloat(transaction.amount);
            return acc;
        }, {});
    }

    function drawCharts(transactions) {
        // Pie Chart
        const categoryData = prepareCategoryData(transactions);
        const categoryLabels = Object.keys(categoryData);
        const categoryValues = Object.values(categoryData);

        if (pieChart) pieChart.destroy();
        const categoryPieChartCtx = document.getElementById('categoryPieChart').getContext('2d');
        pieChart = new Chart(categoryPieChartCtx, {
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

        // Bar Chart
        const groupedByDate = prepareDateData(transactions);
        const sortedDates = Object.keys(groupedByDate).sort((a, b) => new Date(a) - new Date(b));
        const barChartValues = sortedDates.map(date => groupedByDate[date]);

        if (barChart) barChart.destroy();
        const userBarChartCtx = document.getElementById('userBarChart').getContext('2d');
        barChart = new Chart(userBarChartCtx, {
            type: 'bar',
            data: {
                labels: sortedDates,
                datasets: [{
                    label: 'Transaction Amount',
                    data: barChartValues,
                    backgroundColor: '#5A6FE0',
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
    }

    function updateLists(transactions) {
        const expenseList = document.getElementById('expenses');
        const incomeList = document.getElementById('income');

        expenseList.innerHTML = '';
        incomeList.innerHTML = '';

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
            } else {
                incomeList.appendChild(listItem);
            }
        });
    }

    function filterTransactions(period) {
        if (period === 'all') {
            return transactions; // Return all transactions without filtering
        }
    
        const now = new Date();
        const startOfPeriod = new Date();
    
        if (period === 'week') {
            startOfPeriod.setDate(now.getDate() - 7);
        } else if (period === 'month') {
            startOfPeriod.setMonth(now.getMonth() - 1);
        } else if (period === 'year') {
            startOfPeriod.setFullYear(now.getFullYear() - 1);
        }
    
        return transactions.filter(transaction => {
            const transactionDate = new Date(transaction.date);
            return transactionDate >= startOfPeriod;
        });
    }
    

    // Tabs functionality
    const tabs = document.querySelectorAll('.tabs .tab');
    const expenseList = document.getElementById('expenses');
    const incomeList = document.getElementById('income');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove the 'active' class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            // Add the 'active' class to the clicked tab
            tab.classList.add('active');

            // Show or hide the transaction lists based on the selected tab
            if (tab.dataset.tab === 'expenses') {
                expenseList.style.display = 'block';
                incomeList.style.display = 'none';
            } else if (tab.dataset.tab === 'income') {
                expenseList.style.display = 'none';
                incomeList.style.display = 'block';
            }
        });
    });

    // Initial Render
    drawCharts(transactions);
    updateLists(transactions);

    // Period Selector
    const periodSelector = document.getElementById('periodSelector');
    periodSelector.addEventListener('change', () => {
        const selectedPeriod = periodSelector.value;
        const filteredTransactions = filterTransactions(selectedPeriod);

        drawCharts(filteredTransactions);
        updateLists(filteredTransactions);
    });
});
