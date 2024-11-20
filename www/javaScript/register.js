// Toggle Password Visibility
const togglePassword = document.querySelector('#togglePassword');
const passwordInput = document.querySelector('#password');

togglePassword.addEventListener('click', function () {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);

    // Toggle icon and update aria-label
    this.classList.toggle('bi-eye');
    this.classList.toggle('bi-eye-slash');
    this.setAttribute('aria-label', type === 'password' ? 'Show Password' : 'Hide Password');
});

const form = document.getElementById('registerForm');
form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Collect input values
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const username = document.getElementById('username').value.trim();
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();

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
        password, // For security, use a hashed password in production
        transactions: [],
        hasSeenWelcome: false
    };

    localStorage.setItem('users', JSON.stringify(users));

    alert('Registration successful! You can now log in.');
    window.location.href = 'index.html'; // Redirect to login page
});
