document.addEventListener('DOMContentLoaded', () => {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (!loggedInUser) {
        alert("User is not logged in. Please log in first.");
        return;
    }

    const userTransactionsKey = `transactions_${loggedInUser}`;
    const transactions = JSON.parse(localStorage.getItem(userTransactionsKey)) || [];


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
                    backgroundColor: [
                        '#6BA0D6', '#A7D8C2', '#C8A7D4', '#F7B79D', '#F1A7B1', '#B0B0B0',
                        '#D8A1B2', '#B5E6D6', '#D4A1C5', '#F7A6A3', '#A0D8B1', '#6CCB5A',
                        '#F5E17D', '#E1E1E1', '#C9A6D3', '#B8BFA4', '#F2A38C', '#D1C8B3',
                        '#F0E4D7', '#6A7C8B'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false // Hide default legend to create custom legend
                    }
                }
            }
        });

        // Remove any existing legend before creating a new one
        const existingLegend = document.querySelector('.chart-legend');
        if (existingLegend) {
            existingLegend.remove();
        }

        // Custom legend generation
        const legendContainer = document.createElement('div');
        legendContainer.classList.add('chart-legend');

        // Loop through each label and color to create custom legend items
        categoryLabels.forEach((label, index) => {
            const legendItem = document.createElement('div');
            legendItem.classList.add('legend-item');

            const colorBox = document.createElement('div');
            colorBox.classList.add('legend-color');
            colorBox.style.backgroundColor = pieChart.data.datasets[0].backgroundColor[index];

            const labelText = document.createElement('span');
            labelText.textContent = label;

            legendItem.appendChild(colorBox);
            legendItem.appendChild(labelText);
            legendContainer.appendChild(legendItem);
        });

        // Append the custom legend below the chart
        document.querySelector('.chart-container').appendChild(legendContainer);


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

            // Create label with category and color dot
            const label = document.createElement('div');
            label.classList.add('transaction-label');
            label.innerHTML = `
                <div class="transaction-dot" style="background: ${transaction.color || '#F9D4D2'};"></div>
                <span>${transaction.category}</span>
            `;

            // Create amount element
            const amount = document.createElement('div');
            amount.classList.add('transaction-amount');

            // Dynamically apply color based on transaction type
            if (transaction.type === 'expense') {
                amount.classList.add('expense'); // Apply red color for expenses
            } else {
                amount.classList.add('income'); // Apply green color for income
            }

            amount.textContent = `${transaction.type === 'income' ? '+' : '-'} RM${transaction.amount}`;

            // Append label and amount to list item
            listItem.appendChild(label);
            listItem.appendChild(amount);

            // Append list item to the correct list
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
