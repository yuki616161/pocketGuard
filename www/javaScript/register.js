const form = document.getElementById('registerForm');
form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Collect input values
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const username = document.getElementById('username').value.trim();
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();

    // Get selected gender
    const gender = document.querySelector('input[name="gender"]:checked')?.value;

    // Check if gender is selected
    if (!gender) {
        alert('Please select your gender.');
        return;
    }

    // Get existing users
    const users = JSON.parse(localStorage.getItem('users')) || {};

    // Check if email already exists
    if (users[email]) {
        alert("This email is already registered.");
        return;
    }

    // Add new user with `hasSeenWelcome: false`
    users[email] = {
        username,
        firstName,
        lastName,
        email,
        gender, // Save gender
        password, // For security, use a hashed password in production
        transactions: [],
        hasSeenWelcome: false
    };

    localStorage.setItem('users', JSON.stringify(users));

    // Store the registered user as the logged-in user
    localStorage.setItem('loggedInUser', JSON.stringify(users[email]));
    
    alert('Registration successful! You can now log in.');
    window.location.href = 'index.html'; // Redirect to login page
    
});

// Select the toggle password icon and the password input field
const togglePassword = document.getElementById('togglePassword');
const passwordField = document.getElementById('password');

// Add a click event listener to the toggle button
togglePassword.addEventListener('click', () => {
    // Check the current type of the password field and toggle it
    const type = passwordField.type === 'password' ? 'text' : 'password';
    passwordField.type = type;

    // Change the icon based on the current type (eye or eye-slash)
    togglePassword.classList.toggle('bi-eye');
    togglePassword.classList.toggle('bi-eye-slash');
});

