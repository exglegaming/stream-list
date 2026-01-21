import { useState, useEffect } from 'react';
import './Movies.css';
import starIcon from '../../assets/star.svg';

const Movies = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPopularMovies = async () => {
            try {
                const apiKey = import.meta.env.VITE_TMDB_API_KEY;
                const response = await fetch(
                    `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch movies');
                }

                const data = await response.json();
                setMovies(data.results);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchPopularMovies();
    }, []);

    if (loading) {
        return (
            <div className='movies'>
                <div className='movies-header'>
                    <h1>Movies</h1>
                </div>
                <p className='loading'>Loading movies...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className='movies'>
                <div className='movies-header'>
                    <h1>Movies</h1>
                </div>
                <p className='error'>Error: {error}</p>
            </div>
        );
    }

    return (
        <div className='movies'>
            <div className='movies-header'>
                    <h1>Movies</h1>
                </div>

            <div className='movies-section'>
                <h2 className='section-title'>Popular Movies</h2>
                <div className='movies-row'>
                    {movies.map((movie) => (
                        <div key={movie.id} className='movie-card'>
                            <img
                                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                alt={movie.title}
                                className='movie-poster'
                            />
                            <div className='movie-info'>
                                <h3 className='movie-title'>{movie.title}</h3>
                                <p className='movie-date'>
                                    {new Date(movie.release_date).getFullYear()}
                                </p>
                                <p className='movie-rating'>
                                    <img
                                        src={starIcon}
                                        alt='star icon'
                                        className='star-icon'
                                    /> {movie.vote_average.toFixed(1)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Movies;