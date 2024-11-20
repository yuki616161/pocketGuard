document.querySelector('#logoutButton').addEventListener('click', () => {
    localStorage.removeItem('loggedInUser');
    alert("You have been logged out.");
    window.location.href = 'index.html'; // Redirect to login page
});
