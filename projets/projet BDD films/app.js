// MOVIE DB API

// Vous aller coder une app permettant de rechercher, filtrer et liker les films/series
// L'API est la suivante : https://www.omdbapi.com/

// 1 - Vous allez d'abord vérifier le bon fonctionnement de l'API (vous aurez besoin d'une clé API)
// 2 - Vous coderez ensuite les éléments HTML du front (input de recherche, boutons de filtres etc)
// 3 - Vous reliez ensuite le HTML au JS 
// 4 - Dans la requete API il faudra afficher les bons films selon la recherche
// 5 - Ensuite il faudra faire fonctionner les boutons de filtres (ex: le genre de films/séries, la notation, la date de sortie en année)
// 6 - Enfin il faudra sauvegarder en LS (local storage) les favoris et avoir accès à une partie favoris 
// 7 - On doit pouvoir supprimer les éléments des favoris (et donc aussi en LS)
 
let apiKey = "dddbee8f";
let searchBtn = document.getElementById("search-btn");
let searchInput = document.getElementById("search-input");
let genreFilter = document.getElementById("genre-filter");
let ratingFilter = document.getElementById("rating-filter");
let yearFilter = document.getElementById("year-filter");
let typeFilter = document.getElementById("type-filter");
let resultsDiv = document.getElementById("results");
let favBtn = document.getElementById("fav-btn");
let favSection = document.getElementById("fav-section");
let favMoviesDiv = document.getElementById("fav-movies-results");
let favSeriesDiv = document.getElementById("fav-series-results");

// Récupérer les favoris depuis localStorage
function getFavorites() {
    return JSON.parse(localStorage.getItem("favorites")) || [];
}

// Sauvegarder les favoris
function saveFavorites(favorites) {
    localStorage.setItem("favorites", JSON.stringify(favorites));
}

// Ajouter ou retirer un favori
function toggleFavorite(movie) {
    let favorites = getFavorites();
    let index = favorites.findIndex(fav => fav.imdbID === movie.imdbID);

    if (index === -1) {
        fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${movie.imdbID}`)
            .then(response => response.json())
            .then(details => {
                favorites.push(details);
                saveFavorites(favorites);
                updateLikeButtons();
                displayFavorites();
            });
    } else {
        favorites.splice(index, 1);
        saveFavorites(favorites);
        updateLikeButtons();
        displayFavorites();
    }
}

// Vérifier si un film/série est favori
function isFavorite(imdbID) {
    let favorites = getFavorites();
    return favorites.some(fav => fav.imdbID === imdbID);
}

// Mettre à jour les boutons "Like"
function updateLikeButtons() {
    document.querySelectorAll(".like-btn").forEach(button => {
        let imdbID = button.getAttribute("data-imdbid");
        button.innerText = isFavorite(imdbID) ? "Retirer du favori" : "Like";
        button.classList.toggle("liked", isFavorite(imdbID));
    });
}

// Afficher les résultats de recherche
function displayResults(movies) {
    resultsDiv.innerHTML = '';
    if (movies.length > 0) {
        movies.forEach(movie => {
            let movieDiv = document.createElement("div");
            movieDiv.classList.add("movie-card");
            let isLiked = isFavorite(movie.imdbID);

            movieDiv.innerHTML = `
                <h3>${movie.Title} (${movie.Year})</h3>
                <img src="${movie.Poster}" alt="${movie.Title}" />
                <p>Type: ${movie.Type} | Genre: ${movie.Genre || 'N/A'} | Rating: ${movie.imdbRating || 'N/A'}</p>
                <button class="like-btn ${isLiked ? 'liked' : ''}" data-imdbid="${movie.imdbID}">
                    ${isLiked ? 'Retirer du favori' : 'Like'}
                </button>
            `;

            movieDiv.querySelector(".like-btn").addEventListener("click", () => toggleFavorite(movie));
            resultsDiv.appendChild(movieDiv);
        });
    } else {
        resultsDiv.innerHTML = "<p>Aucun résultat trouvé.</p>";
    }
    updateLikeButtons();
}

// Afficher les favoris
function displayFavorites() {
    let favorites = getFavorites();
    favMoviesDiv.innerHTML = '';
    favSeriesDiv.innerHTML = '';

    favorites.forEach(movie => {
        let movieDiv = document.createElement("div");
        movieDiv.classList.add("movie-card");
        movieDiv.innerHTML = `
            <h3>${movie.Title} (${movie.Year})</h3>
            <img src="${movie.Poster}" alt="${movie.Title}" />
            <button class="like-btn" data-imdbid="${movie.imdbID}">Retirer du favori</button>
        `;

        movieDiv.querySelector(".like-btn").addEventListener("click", () => toggleFavorite(movie));
        if (movie.Type === "movie") {
            favMoviesDiv.appendChild(movieDiv);
        } else {
            favSeriesDiv.appendChild(movieDiv);
        }
    });
}

// Fonction de recherche avec filtres
function searchMovies() {
    let searchTerm = searchInput.value.trim().toLowerCase();
    let genre = genreFilter.value.toLowerCase();
    let rating = parseFloat(ratingFilter.value);
    let year = yearFilter.value;
    let type = typeFilter.value;

    if (searchTerm.length === 0) {
        alert("Veuillez entrer un titre de film ou de série.");
        return;
    }

    let url = `https://www.omdbapi.com/?apikey=${apiKey}&s=${searchTerm}&type=${type || ""}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.Response === "True") {
                let movies = data.Search;
                let filteredMovies = [];

                let fetchDetailsPromises = movies.map(movie => {
                    return fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${movie.imdbID}`)
                        .then(response => response.json())
                        .then(details => {
                            let isGenreValid = genre ? details.Genre.toLowerCase().includes(genre) : true;
                            let isRatingValid = !isNaN(rating) ? parseFloat(details.imdbRating) >= rating : true;
                            let isYearValid = year ? parseInt(details.Year) >= parseInt(year) : true;

                            if (isGenreValid && isRatingValid && isYearValid) {
                                filteredMovies.push(details);
                            }
                        });
                });

                Promise.all(fetchDetailsPromises).then(() => {
                    displayResults(filteredMovies);
                });
            } else {
                resultsDiv.innerHTML = "<p>Aucun résultat trouvé.</p>";
            }
        })
        .catch(error => console.log("Erreur de recherche: ", error));
}

// Écouteurs d'événements pour les filtres
searchBtn.addEventListener("click", searchMovies);
genreFilter.addEventListener("change", searchMovies);
ratingFilter.addEventListener("change", searchMovies);
yearFilter.addEventListener("input", searchMovies);
typeFilter.addEventListener("change", searchMovies);
let closeFavBtn = document.getElementById("close-fav-btn");

favBtn.addEventListener("click", () => {
    if (favSection.style.display === "none" || favSection.style.display === "") {
        favSection.style.display = "block";
    } else {
        favSection.style.display = "none";
    }
    displayFavorites();
});

// Fermer l'onglet favoris quand on clique sur "Fermer"
closeFavBtn.addEventListener("click", () => {
    favSection.style.display = "none";
});



// Mettre à jour les boutons "Like" au chargement
window.addEventListener("load", updateLikeButtons);
