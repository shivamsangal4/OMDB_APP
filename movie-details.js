const apiKey = "1571fc4f";
const baseUrl = "http://www.omdbapi.com/";
const movieTitleElement = document.getElementById("movieTitle");
const movieDetailsElement = document.getElementById("movieDetails");
const ratingSelect = document.getElementById("rating");
const commentTextarea = document.getElementById("comment");
const submitFeedbackBtn = document.getElementById("submitFeedback");
const userRatingDisplay = document.getElementById("userRatingDisplay");
const userCommentDisplay = document.getElementById("userCommentDisplay");

// Get the movieId from the query parameter in the URL
const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get("movieId");

function fetchMovieDetails(movieId) {
    const apiUrl = `${baseUrl}?apikey=${apiKey}&i=${movieId}`;
    fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
            if (data.Response === "True") {
                // Populate movie details on the movie details page
                movieTitleElement.innerText = data.Title;
                const movieDetailsHTML = `
                    <div class="movie-details">
                        <p>Year: ${data.Year}</p>
                        <p>Genre: ${data.Genre}</p>
                        <p>Plot: ${data.Plot}</p>
                        <!-- Add more details as needed -->
                    </div>
                `;
                movieDetailsElement.innerHTML = movieDetailsHTML;
                // Load user rating and comment
                const { rating, comment } = loadUserRatingAndComment(movieId);
                if (rating) {
                    ratingSelect.value = rating;
                    userRatingDisplay.textContent = rating;
                } else {
                    ratingSelect.selectedIndex = 0; // Default to 1 star if no rating exists
                    userRatingDisplay.textContent = "Not rated";
                }
                if (comment) {
                    commentTextarea.value = comment;
                    userCommentDisplay.textContent = comment;
                } else {
                    commentTextarea.value = ""; // Clear comment textarea if no comment exists
                    userCommentDisplay.textContent = "No comment";
                }
            } else {
                // Handle API error here
                console.error("API Error:", data.Error);
            }
        })
        .catch((error) => {
            // Handle fetch error here
            console.error("Fetch Error:", error);
        });
}

function saveUserRatingAndComment(movieId, rating, comment) {
    const movieData = JSON.parse(localStorage.getItem("movieData")) || {};
    movieData[movieId] = {
        rating,
        comment
    };
    localStorage.setItem("movieData", JSON.stringify(movieData));
}

function loadUserRatingAndComment(movieId) {
    const movieData = JSON.parse(localStorage.getItem("movieData")) || {};
    const movieInfo = movieData[movieId] || {};
    const rating = movieInfo.rating || null;
    const comment = movieInfo.comment || null;
    return { rating, comment };
}

function handleFeedbackSubmission() {
    const selectedRating = ratingSelect.value;
    const comment = commentTextarea.value;
    saveUserRatingAndComment(movieId, selectedRating, comment);
    userRatingDisplay.textContent = selectedRating;
    userCommentDisplay.textContent = comment || "No comment";
}

function handleBackToList() {
    // Hide the movie details page and show the movie list
    window.location.href = "index.html";
}

// Event listener for feedback submission
submitFeedbackBtn.addEventListener("click", handleFeedbackSubmission);
document.getElementById("backToList").addEventListener("click", handleBackToList);

// Fetch movie details when the page loads
fetchMovieDetails(movieId);
