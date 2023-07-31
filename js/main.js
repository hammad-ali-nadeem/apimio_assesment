let allMovies = [];
$(document).ready(function () {
  let currentPage = 1;
  const itemsPerPage = 9;

  // Function to load some random movies on first-time load
  function loadRandomMovies() {
    const randomKeywords = ['action', 'comedy', 'drama', 'adventure', 'thriller'];
    const randomIndex = Math.floor(Math.random() * randomKeywords.length);
    const searchQuery = randomKeywords[randomIndex];
    searchMovies(searchQuery, currentPage, itemsPerPage); // Pass itemsPerPage as a parameter
  }

  loadRandomMovies(); // Load random movies on first-time load

  $('#search-form').on('submit', function (e) {
    e.preventDefault();
    currentPage = 1;
    const searchQuery = $('#search-input').val().trim();
    if (searchQuery === '') {
        loadRandomMovies(); // Load random movies if search query is empty
      return;
    }
    allMovies = []; // Reset the movie list when performing a new search
    searchMovies(searchQuery, currentPage, itemsPerPage); // Pass itemsPerPage as a parameter
  });

  $('#load-more-btn').on('click', function () {
    currentPage++;
    const searchQuery = $('#search-input').val().trim();
    if (searchQuery === '') {
        allMovies = []; // Reset the movie list when performing a new search
        loadRandomMovies();
      currentPage--;
      return;
    }
    searchMovies(searchQuery, currentPage, itemsPerPage); // Pass itemsPerPage as a parameter
  });
});

function searchMovies(query, page = 1, itemsPerPage) {
  const apiKey = '1cab68a0'; 
  const apiUrl = `http://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(query)}&page=${page}`;

  // Show the loader while fetching data
  $('#movies-container').html('<div class="loader"></div>');

  $.ajax({
    url: apiUrl,
    method: 'GET',
    success: function (data) {
      if (data.Response === 'True') {
        const movies = data.Search;
        const totalResults = parseInt(data.totalResults);

        // Store all movies in the allMovies array
        allMovies.push(...movies);

        // Calculate the starting and ending index of the movies to display
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, totalResults);

        // Prepare the movie cards for display
        let movieCards = '';
        for (let i = 0; i < endIndex; i++) {
          const movie = allMovies[i];
          if (movie && movie.Poster) { // Check if movie and poster data are available
            const movieCard = createMovieCard(movie);
            movieCards += movieCard;
          }
        }

        // Hide the loader and display the movie cards
        $('#movies-container').html(movieCards);

        if (endIndex >= totalResults) {
          $('#load-more-btn').hide();
        } else {
          $('#load-more-btn').show();
        }
      } else {
        $('#movies-container').html('<p>No movies found.</p>');
        $('#load-more-btn').hide();
      }
    },
    error: function (xhr, status, error) {
      $('#movies-container').html('<p>Error fetching data. Please try again later.</p>');
      $('#load-more-btn').hide();
      console.error('Error fetching movie data:', error);
    }
  });
}  
  function createMovieCard(movie) {
    // Default image URL when movie poster is not available
    const defaultImage = "https://motivatevalmorgan.com/wp-content/uploads/2016/06/default-movie.jpg";
  
    const movieCard = `
      <div class="movie-card">
        <img class="movie-poster" src="${movie.Poster !== 'N/A' ? movie.Poster : defaultImage}" alt="${movie.Title}">
        <div class="movie-title">${movie.Title}</div>
        <div class="movie-year">${movie.Year}</div>
        <div class="movie-rating">IMDb Rating: ${movie.imdbRating}</div>
      </div>
    `;
  
    return movieCard;
  }

  
