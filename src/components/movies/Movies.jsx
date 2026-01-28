import { useState, useEffect } from 'react';
import './Movies.css';
import starIcon from '../../assets/star.svg';

const MovieCard = ({ movie }) => (
  <div className="movie-card">
    {movie.poster_path && (
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={`${movie.title} poster`}
        className="movie-poster"
      />
    )}
    <div className="movie-info">
      <h3 className="movie-title">{movie.title}</h3>
      <p className="movie-date">
        {movie.release_date
          ? new Date(movie.release_date).getFullYear()
          : 'N/A'}
      </p>
      <p className="movie-rating">
        <img
          src={starIcon}
          alt=""
          className="star-icon"
          aria-hidden="true"
        />
        {movie.vote_average?.toFixed(1)}
      </p>
    </div>
  </div>
);

const MovieSection = ({ title, movies }) => (
  <div className="movies-section">
    <h2 className="section-title">{title}</h2>
    <div className="movies-row">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  </div>
);

const Movies = () => {
  const [movies, setMovies] = useState({
    popular: [],
    nowPlaying: [],
    upcoming: [],
    topRated: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const fetchMovies = async () => {
      try {
        const apiKey = import.meta.env.VITE_TMDB_API_KEY;
        if (!apiKey) {
          setError('API key not configured');
          setLoading(false);
          return;
        }
        const baseUrl = 'https://api.themoviedb.org/3/movie';
        const params = 'language=en-US&page=1';

        const [popularData, nowPlayingData, upcomingData, topRatedData] =
          await Promise.all([
            fetch(
              `${baseUrl}/popular?api_key=${apiKey}&${params}`,
              { signal: controller.signal }
            ).then((res) => {
              if (!res.ok) throw new Error('Failed to fetch movies');
              return res.json();
            }),
            fetch(
              `${baseUrl}/now_playing?api_key=${apiKey}&${params}`,
              { signal: controller.signal }
            ).then((res) => {
              if (!res.ok) throw new Error('Failed to fetch movies');
              return res.json();
            }),
            fetch(
              `${baseUrl}/upcoming?api_key=${apiKey}&${params}`,
              { signal: controller.signal }
            ).then((res) => {
              if (!res.ok) throw new Error('Failed to fetch movies');
              return res.json();
            }),
            fetch(
              `${baseUrl}/top_rated?api_key=${apiKey}&${params}`,
              { signal: controller.signal }
            ).then((res) => {
              if (!res.ok) throw new Error('Failed to fetch movies');
              return res.json();
            }),
          ]);

        setMovies({
          popular: popularData.results,
          nowPlaying: nowPlayingData.results,
          upcoming: upcomingData.results,
          topRated: topRatedData.results,
        });
      } catch (err) {
        if (err.name !== 'AbortError') setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
    return () => controller.abort();
  }, []);

  const sections = [
    { title: 'Popular Movies', key: 'popular' },
    { title: 'Now Playing Movies', key: 'nowPlaying' },
    { title: 'Upcoming Movies', key: 'upcoming' },
    { title: 'Top Rated Movies', key: 'topRated' },
  ];

  if (loading) {
    return (
      <div className="movies">
        <div className="movies-header">
          <h1>Movies</h1>
        </div>
        <p className="loading">Loading movies...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="movies">
        <div className="movies-header">
          <h1>Movies</h1>
        </div>
        <p className="error">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="movies">
      <div className="movies-header">
        <h1>Movies</h1>
      </div>
      {sections.map(({ title, key }) => (
        <MovieSection key={key} title={title} movies={movies[key]} />
      ))}
    </div>
  );
};

export default Movies;