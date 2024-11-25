document.addEventListener("DOMContentLoaded", () => {
    // Retrieve user data from localStorage
    const userRegistrationData = JSON.parse(localStorage.getItem('loggedInUser')) || {};

    // Extract profile details
    const {
        username = "User",
        email = "Not provided",
        gender = "Not specified"
    } = userRegistrationData;

    // Update profile details
    document.getElementById('profileUsername').textContent = username;
    document.getElementById('detailUsername').textContent = username;
    document.getElementById('detailEmail').textContent = email;
    document.getElementById('detailGender').textContent = gender;

    // Set profile image based on gender
    const profileImage = document.getElementById('profileImage');
    if (gender === "Male") {
        profileImage.src = "images/man.png";
    } else if (gender === "Female") {
        profileImage.src = "images/woman.png";
    } else {
        profileImage.src = "images/default.png";
    }

    // Logout functionality
    document.getElementById("logoutButton").addEventListener("click", function () {
        // Redirect to the login page or home page
        window.location.href = 'index.html'; // You can change this to your login page URL
    });

    document.querySelector('#logoutButton').addEventListener('click', () => {
        localStorage.removeItem('loggedInUser');
        alert("You have been logged out.");
        window.location.href = 'index.html'; // Redirect to login page
    });

    // Clear Local Storage functionality
    document.getElementById("clearStorageButton").addEventListener("click", () => {
        if (confirm("Are you sure you want to clear all data from local storage?")) {
            localStorage.clear();
            alert("Local storage has been cleared.");
            window.location.href = 'index.html'; // Redirect to login page or home
        }
    });
});
