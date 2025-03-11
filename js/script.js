const toggle = document.querySelector('.toggle')
const navigation = document.querySelector('.navigation')

toggle.addEventListener('click', () => {
    toggle.classList.toggle('active')
    navigation.classList.toggle('active')
})

// Store reviews in an array (you can use a database for real-world applications)
let reviews = [];

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
  };

  // Save the review to the reviews array
  reviews.push(review);

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
    li.innerHTML = `<strong>${review.rating} Stars</strong><p>${review.comment}</p>`;
    topReviewsList.appendChild(li);
  });
}

<script>
// Function to handle form submission
document.getElementById("reviewForm").addEventListener("submit", function(event) {
  event.preventDefault();

  // Get the form values
  const rating = document.getElementById("rating").value;
  const comment = document.getElementById("comment").value;

  // Create a new review object
  const newReview = {
    rating: rating,
    comment: comment
  };

  // Get current reviews from localStorage or create an empty array if none exist
  let reviews = JSON.parse(localStorage.getItem("reviews")) || [];

  // Add the new review to the reviews array
  reviews.push(newReview);

  // Save the updated reviews array back to localStorage
  localStorage.setItem("reviews", JSON.stringify(reviews));

  // Clear the form
  document.getElementById("reviewForm").reset();

  // Update the review list
  displayReviews();
});

// Function to display reviews
function displayReviews() {
  const reviews = JSON.parse(localStorage.getItem("reviews")) || [];
  const reviewsList = document.getElementById("topReviewsList");
  reviewsList.innerHTML = ""; // Clear the current list

  // Loop through the reviews and add them to the page
  reviews.forEach((review, index) => {
    const reviewItem = document.createElement("li");
    reviewItem.innerHTML = `
      <strong>${review.rating} Stars</strong>
      <p>${review.comment}</p>
      <button class="delete-btn" onclick="deleteReview(${index})">Delete</button>
    `;
    reviewsList.appendChild(reviewItem);
  });
}

// Function to delete a review
function deleteReview(index) {
  // Get the current reviews from localStorage
  let reviews = JSON.parse(localStorage.getItem("reviews")) || [];

  // Remove the review at the specified index
  reviews.splice(index, 1);

  // Save the updated reviews array back to localStorage
  localStorage.setItem("reviews", JSON.stringify(reviews));

  // Update the review list
  displayReviews();
}

// Display reviews on page load
displayReviews();
</script>

