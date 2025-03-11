const toggle = document.querySelector('.toggle');
const navigation = document.querySelector('.navigation');

toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    navigation.classList.toggle('active');
});

// Get reviews from Local Storage (if any)
let reviews = JSON.parse(localStorage.getItem('reviews')) || [];

// Function to handle the form submission
document.getElementById('reviewForm').addEventListener('submit', function(event) {
  event.preventDefault();

  // Get form values
  const rating = parseInt(document.getElementById('rating').value);
  const comment = document.getElementById('comment').value;

  // Create a review object
  const review = {
    rating: rating,
    comment: comment,
    id: new Date().getTime()  // Unique ID for each review
  };

  // Save the review to the reviews array
  reviews.push(review);

  // Save reviews to Local Storage
  localStorage.setItem('reviews', JSON.stringify(reviews));

  // Clear the form
  document.getElementById('reviewForm').reset();

  // Show feedback message
  document.getElementById('feedbackMessage').innerText = "Thank you for your review!";

  // Update the top reviews section
  displayTopReviews();
});

// Function to display the top reviews in "Most Loved Products"
function displayTopReviews() {
  // Sort reviews by rating in descending order
  const sortedReviews = reviews.sort((a, b) => b.rating - a.rating);

  // Get the top 3 highest-rated reviews
  const topReviews = sortedReviews.slice(0, 3);

  // Clear previous list
  const topReviewsList = document.getElementById('topReviewsList');
  topReviewsList.innerHTML = '';

  // Display top reviews
  topReviews.forEach(review => {
    const li = document.createElement('li');
    
    // Add review content and a delete button
    li.innerHTML = `
      <strong>${review.rating} Stars</strong>
      <p>${review.comment}</p>
      <button class="delete-btn" data-id="${review.id}">Delete</button>
    `;
    
    // Add the list item to the list
    topReviewsList.appendChild(li);
  });

  // Add event listeners for delete buttons
  const deleteButtons = document.querySelectorAll('.delete-btn');
  deleteButtons.forEach(button => {
    button.addEventListener('click', function() {
      const reviewId = parseInt(this.getAttribute('data-id'));  // Get the ID of the review to delete
      deleteReview(reviewId);
    });
  });
}

// Function to delete a review
function deleteReview(reviewId) {
  // Find the index of the review to delete
  const reviewIndex = reviews.findIndex(review => review.id === reviewId);
  
  if (reviewIndex !== -1) {
    // Remove the review from the array
    reviews.splice(reviewIndex, 1);

    // Save updated reviews to Local Storage
    localStorage.setItem('reviews', JSON.stringify(reviews));

    // Update the reviews display
    displayTopReviews();
  }
}

// On page load, display the reviews from Local Storage
window.onload = function() {
  displayTopReviews();
};
