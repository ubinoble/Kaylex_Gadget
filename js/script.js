const toggle = document.querySelector('.toggle');
const navigation = document.querySelector('.navigation');

toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    navigation.classList.toggle('active');
});

// Initialize local reviews array from localStorage or default to empty array
let reviews = JSON.parse(localStorage.getItem('reviews')) || [];

// Handle form submission for reviews
document.getElementById('reviewForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const rating = parseInt(document.getElementById('rating').value);
    const comment = document.getElementById('comment').value;

    const review = {
        rating: rating,
        comment: comment
    };

    // Send review data to the backend (API)
    fetch('http://localhost:5000/api/reviews', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(review)
    })
    .then(response => response.json())
    .then(data => {
        console.log("Review submitted:", data);
        document.getElementById('feedbackMessage').innerText = "Thank you for your review!";
        displayTopReviews();  // Refresh reviews from API
    })
    .catch(error => {
        console.error('Error submitting review:', error);

        // If API fails, fallback to saving in localStorage
        review.id = new Date().getTime();  // Unique ID for each review
        reviews.push(review);
        localStorage.setItem('reviews', JSON.stringify(reviews));

        // Provide feedback and refresh reviews
        document.getElementById('feedbackMessage').innerText = "Review saved locally!";
        displayTopReviews();
    });
});

// Function to display the top reviews from either the API or localStorage
function displayTopReviews() {
    // First, fetch reviews from the API
    fetch('http://localhost:5000/api/reviews')
        .then(response => response.json())
        .then(reviewsFromAPI => {
            // Use reviews from the API, or fallback to localStorage if API fails
            const allReviews = reviewsFromAPI || reviews;

            // Sort reviews by rating in descending order
            const sortedReviews = allReviews.sort((a, b) => b.rating - a.rating);

            // Get the top 3 highest-rated reviews
            const topReviews = sortedReviews.slice(0, 3);

            // Clear previous list
            const topReviewsList = document.getElementById('topReviewsList');
            topReviewsList.innerHTML = '';

            // Display top reviews
            topReviews.forEach(review => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <strong>${review.rating} Stars</strong>
                    <p>${review.comment}</p>
                    <button class="delete-btn" data-id="${review.id || 'temp'}">Delete</button>
                `;
                topReviewsList.appendChild(li);
            });

            // Add event listeners for delete buttons
            const deleteButtons = document.querySelectorAll('.delete-btn');
            deleteButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const reviewId = this.getAttribute('data-id');
                    deleteReview(reviewId);
                });
            });
        })
        .catch(error => {
            console.error('Error fetching reviews from API:', error);
            // Fallback to localStorage if the API fails
            displayTopReviewsFromLocalStorage();
        });
}

// Function to display reviews from localStorage if API fails
function displayTopReviewsFromLocalStorage() {
    const topReviewsList = document.getElementById('topReviewsList');
    topReviewsList.innerHTML = '';

    const sortedReviews = reviews.sort((a, b) => b.rating - a.rating);
    const topReviews = sortedReviews.slice(0, 3);

    topReviews.forEach(review => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${review.rating} Stars</strong>
            <p>${review.comment}</p>
            <button class="delete-btn" data-id="${review.id}">Delete</button>
        `;
        topReviewsList.appendChild(li);
    });

    // Add event listeners for delete buttons
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const reviewId = parseInt(this.getAttribute('data-id'));
            deleteReview(reviewId);
        });
    });
}

// Function to delete a review (from localStorage or backend)
function deleteReview(reviewId) {
    // Try deleting from the backend API
    fetch(`http://localhost:5000/api/reviews/${reviewId}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(() => {
        console.log("Review deleted from backend!");
        // Remove from localStorage if it was also stored there
        reviews = reviews.filter(review => review.id !== reviewId);
        localStorage.setItem('reviews', JSON.stringify(reviews));
        displayTopReviews();  // Refresh reviews after deletion
    })
    .catch(error => {
        console.error('Error deleting review from API:', error);
        // If deleting from API fails, delete from localStorage
        reviews = reviews.filter(review => review.id !== reviewId);
        localStorage.setItem('reviews', JSON.stringify(reviews));
        displayTopReviews();  // Refresh reviews after deletion
    });
}

// On page load, display the reviews from the API or localStorage
window.onload = function() {
    displayTopReviews();
};
