import { useState, useEffect } from 'react';
import './Movies.css';
import starIcon from '../../assets/star.svg';

const Movies = () => {
    const [popularMovies, setPopularMovies] = useState([]);
    const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
    const [upcomingMovies, setUpcomingMovies] = useState([]);
    const [topRatedMovies, setTopRatedMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const apiKey = import.meta.env.VITE_TMDB_API_KEY;

                const popularResponse = await fetch(
                    `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`
                );

                const nowPlayingResponse = await fetch(
                    `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=en-US&page=1`
                );

                const upcomingResponse = await fetch(
                    `https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}&language=en-US&page=1`
                );

                const topRatedResponse = await fetch(
                    `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&language=en-US&page=1`
                );

                if (!popularResponse.ok || !nowPlayingResponse.ok || !upcomingResponse.ok || !topRatedResponse.ok) {
                    throw new Error('Failed to fetch movies');
                }
                
                const popularData = await popularResponse.json();
                const nowPlayingData = await nowPlayingResponse.json();
                const upcomingData = await upcomingResponse.json();
                const topRatedData = await topRatedResponse.json();
                
                setPopularMovies(popularData.results);
                setNowPlayingMovies(nowPlayingData.results);
                setUpcomingMovies(upcomingData.results);
                setTopRatedMovies(topRatedData.results);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchMovies();
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

            {/* Popular Movies Cards */}
            <div className='movies-section'>
                <h2 className='section-title'>Popular Movies</h2>
                <div className='movies-row'>
                    {popularMovies.map((movie) => (
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

            {/* Now Playing Movies Cards */}
            <div className='movies-section'>
                <h2 className='section-title'>Now Playing Movies</h2>
                <div className='movies-row'>
                    {nowPlayingMovies.map((movie) => (
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

            {/* Upcoming Movies Cards */}
            <div className='movies-section'>
                <h2 className='section-title'>Upcoming Movies</h2>
                <div className='movies-row'>
                    {upcomingMovies.map((movie) => (
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
            
            {/* Top Rated Movies Cards */}
            <div className='movies-section'>
                <h2 className='section-title'>Top Rated Movies</h2>
                <div className='movies-row'>
                    {topRatedMovies.map((movie) => (
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
                                    />
                                    {movie.vote_average.toFixed(1)}
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