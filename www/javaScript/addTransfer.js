// Calculator Functions
const calculator = document.getElementById("calculator");

function inputKeypad(value) {
    const amountField = document.getElementById('amountTransfer');
    amountField.value += value;
}

function clearKeypad() {
    document.getElementById('amountTransfer').value = '';
}

function calculateKeypad() {
    const amountField = document.getElementById('amountTransfer');
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


// General Click Event for Outside Click Handling
window.addEventListener("click", function (event) {
    if (!event.target.closest("#calculator") && !event.target.closest("#amountTransfer")) {
        hideCalculator();
    }
});



// JQuery for Account Grid
$(document).ready(function () {
    // Show account grid when the input is clicked
    $("#transferFromAccount").on("click", function () {
        $("#accountGrid").fadeIn();
    });

    // Select an account and update the input
    $(".account-item").on("click", function () {
        const account = $(this).data("account");
        $("#transferFromAccount").val(account); // Set selected account
        $("#accountGrid").fadeOut(); // Hide the grid
    });

    // Hide the account grid when clicking outside
    $(document).on("click", function (e) {
        if (!$(e.target).closest("#accountGrid, #transferFromAccount").length) {
            $("#accountGrid").fadeOut();
        }
    });
});

// JQuery for Account Grid
$(document).ready(function () {
    // Show account grid when the input is clicked
    $("#transferToAccount").on("click", function () {
        $("#accountGrid").fadeIn();
    });

    // Select an account and update the input
    $(".account-item").on("click", function () {
        const account = $(this).data("account");
        $("#transferToAccount").val(account); // Set selected account
        $("#accountGrid").fadeOut(); // Hide the grid
    });

    // Hide the account grid when clicking outside
    $(document).on("click", function (e) {
        if (!$(e.target).closest("#accountGrid, #transferToAccount").length) {
            $("#accountGrid").fadeOut();
        }
    });
});


// Save Transfer Data
function saveTransferData() {
    const transferData = {
        date: document.getElementById('date').value,
        amount: document.getElementById('amountTransfer').value,
        fromAccount: document.getElementById('transferFromAccount').value,
        toAccount: document.getElementById('transferToAccount').value,
        description: document.getElementById('transferDescription').value || "", // Default to empty string
        type: "transfer" // Differentiates transfer from other transaction types
    };

    if (!validateTransaction(transferData)) {
        alert('Please fill in all required fields.');
        return;
    }

    saveTransaction(transferData); // Save the transfer data
    alert('Transfer data saved!'); // Show success message
    clearInputs(); // Clear input fields after saving
}

// Validate Input Fields
function validateTransaction(data) {
    return data.date && data.amount  && data.fromAccount && data.toAccount ; // Basic validation for required fields
}

// Save Transaction to LocalStorage
function saveTransaction(transaction) {
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    transactions.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Clear input fields
function clearInputs() {
    document.getElementById('date').value = '';
    document.getElementById('amountTransfer').value = '';
    document.getElementById('transferFromAccount').value = '';
    document.getElementById('transferToAccount').value = '';
    document.getElementById('transferDescription').value = '';
}
