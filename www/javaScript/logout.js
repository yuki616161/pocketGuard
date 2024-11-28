$(document).ready(() => {
    // Retrieve user data from localStorage
    const userRegistrationData = JSON.parse(localStorage.getItem('loggedInUser')) || {};

    // Extract profile details
    const {
        username = "User",
        email = "Not provided",
        gender = "Not specified"
    } = userRegistrationData;

    // Update profile details
    $('#profileUsername').text(username);
    $('#detailUsername').text(username);
    $('#detailEmail').text(email);
    $('#detailGender').text(gender);

    // Set profile image based on gender
    const $profileImage = $('#profileImage');
    if (gender === "Male") {
        $profileImage.attr("src", "images/man.png");
    } else if (gender === "Female") {
        $profileImage.attr("src", "images/woman.png");
    } else {
        $profileImage.attr("src", "images/default.png");
    }

    // Logout functionality
    $("#logoutButton").on("click", () => {
        localStorage.removeItem('loggedInUser');
        alert("You have been logged out.");
        window.location.href = 'index.html'; // Redirect to login page
    });


});
