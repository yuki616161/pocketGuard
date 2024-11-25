document.addEventListener('DOMContentLoaded', () => {
    const togglePassword = document.querySelector('#togglePassword');
    const passwordInput = document.querySelector('#password');
});

togglePassword.addEventListener('click', function () {
    // Toggle between text and password type
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);

    // Toggle icon class for eye visibility
    this.classList.toggle('bi-eye');
    this.classList.toggle('bi-eye-slash');
});

// Form Validation
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

// Email and Password Regex Patterns
const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
// Optional: Simplified password regex for validation, but real authentication should use hashed passwords
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

loginForm.addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent form from submitting

    let isValid = true;

    // Validate Email
    if (!emailPattern.test(emailInput.value)) {
        emailInput.classList.add('is-invalid');
        displayErrorMessage(emailInput, 'Invalid email format.');
        isValid = false;
    } else {
        emailInput.classList.remove('is-invalid');
        emailInput.classList.add('is-valid');
    }

    // Validate Password
    if (!passwordPattern.test(passwordInput.value)) {
        passwordInput.classList.add('is-invalid');
        displayErrorMessage(passwordInput, 'Password must be at least 8 characters with an uppercase letter and a number.');
        isValid = false;
    } else {
        passwordInput.classList.remove('is-invalid');
        passwordInput.classList.add('is-valid');
    }

    // If the form is valid, proceed to check credentials
    if (isValid) {
        authenticateUser(emailInput.value, passwordInput.value);
    }
});

// Function to display error messages
function displayErrorMessage(inputElement, message) {
    let errorElement = inputElement.nextElementSibling;
    if (!errorElement || !errorElement.classList.contains('error-message')) {
        errorElement = document.createElement('div');
        errorElement.classList.add('error-message', 'text-danger');
        inputElement.parentNode.appendChild(errorElement);
    }
    errorElement.textContent = message;
}

// Function to authenticate user
function authenticateUser(email, password) {
    const users = JSON.parse(localStorage.getItem('users'));

    if (users && users[email]) {
        const user = users[email];

        if (user.password === password) {
            alert("Login successful!");

            // Store the logged-in user's data in localStorage
            localStorage.setItem('loggedInUser', JSON.stringify(user));

            // Redirect based on whether the welcome page has been seen
            if (!user.hasSeenWelcome) {
                user.hasSeenWelcome = true;
                localStorage.setItem('loggedInUser', JSON.stringify(user)); // Save logged-in user
                users[email] = user; // Update all users
                localStorage.setItem('users', JSON.stringify(users)); // Save all users

                window.location.href = 'welcome.html';
            } else {
                window.location.href = 'home.html';
            }
        } else {
            alert("Incorrect email or password. Please try again.");
        }
    } else {
        alert("No user data found. Please register first.");
    }
}
