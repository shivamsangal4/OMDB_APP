const apiKey = "1571fc4f";
const baseUrl = "http://www.omdbapi.com/";
const movieListElement = document.getElementById("movieList");
const paginationElement = document.getElementById("pagination");

let currentPage = 1;
const moviesPerPage = 10;
let totalResults = 0;
let currentMovies = [];

function fetchMovies(searchTerm = "", page = 1) {
    const apiUrl = `${baseUrl}?apikey=${apiKey}&s=${encodeURIComponent(searchTerm)}&page=${page}`;
    fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
            if (data.Response === "True") {
                totalResults = parseInt(data.totalResults);
                currentMovies = data.Search;
                displayMovies();
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

function displayMovies() {
    let movieListHTML = "";
    currentMovies.forEach((movie) => {
        movieListHTML += `
            <div class="movie-item" data-movie-id="${movie.imdbID}">
                <img src="${movie.Poster}" alt="${movie.Title}">
                <p>${movie.Title}</p>
            </div>
        `;
    });
    movieListElement.innerHTML = movieListHTML;

    // Add event listener to movie items
    document.querySelectorAll(".movie-item").forEach((item) => {
        item.addEventListener("click", handleMovieClick);
    });

    // Display pagination
    displayPagination();
}

function handleMovieClick(event) {
    const movieId = event.currentTarget.getAttribute("data-movie-id");
    window.location.href = `movie-details.html?movieId=${movieId}`;
}

function displayPagination() {
    const totalPages = Math.ceil(totalResults / moviesPerPage);
    let paginationHTML = "";

    if (totalPages > 1) {
        paginationHTML += `
            <button ${currentPage === 1 ? "disabled" : ""} onclick="handlePagination('prev')">Previous</button>
        `;
        for (let i = 1; i <= totalPages; i++) {
            paginationHTML += `
                <button ${currentPage === i ? "disabled" : ""} onclick="handlePagination(${i})">${i}</button>
            `;
        }
        paginationHTML += `
            <button ${currentPage === totalPages ? "disabled" : ""} onclick="handlePagination('next')">Next</button>
        `;
    }

    paginationElement.innerHTML = paginationHTML;
}

function handlePagination(action) {
    if (action === "prev" && currentPage > 1) {
        currentPage--;
    } else if (action === "next" && currentPage < Math.ceil(totalResults / moviesPerPage)) {
        currentPage++;
    } else if (typeof action === "number" && action >= 1 && action <= Math.ceil(totalResults / moviesPerPage)) {
        currentPage = action;
    }

    fetchMovies(searchTerm, currentPage);
}

// Initial setup
let searchTerm = "";
fetchMovies();

// Event listener for search input
fetchMovies("aaa", 1);
document.getElementById("searchInput").addEventListener("input", (event) => {
    searchTerm = event.target.value;
    currentPage = 1;
    fetchMovies(searchTerm, currentPage);
});
