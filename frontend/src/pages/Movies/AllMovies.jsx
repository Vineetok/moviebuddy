import { useGetAllMoviesQuery } from "../../redux/api/movies";
import { useFetchGenresQuery } from "../../redux/api/genre";
import {
  useGetNewMoviesQuery,
  useGetTopMoviesQuery,
  useGetRandomMoviesQuery,
} from "../../redux/api/movies";
import MovieCard from "./MovieCard";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import banner from "../../assets/banner.webp";
import {
  setMoviesFilter,
  setFilteredMovies,
  setMovieYears,
  setUniqueYears,
} from "../../redux/features/movies/moviesSlice";

const AllMovies = () => {
  const dispatch = useDispatch();
  const { data } = useGetAllMoviesQuery();
  const { data: genres } = useFetchGenresQuery();
  const { data: newMovies } = useGetNewMoviesQuery();
  const { data: topMovies } = useGetTopMoviesQuery();
  const { data: randomMovies } = useGetRandomMoviesQuery();

  const { moviesFilter, filteredMovies } = useSelector((state) => state.movies);

  const movieYears = data?.map((movie) => movie.year);
  const uniqueYears = Array.from(new Set(movieYears));

  useEffect(() => {
    dispatch(setFilteredMovies(data || []));
    dispatch(setMovieYears(movieYears));
    dispatch(setUniqueYears(uniqueYears));
  }, [data, dispatch]);

  const handleSearchChange = (e) => {
    dispatch(setMoviesFilter({ searchTerm: e.target.value }));

    const filteredMovies = data.filter((movie) =>
      movie.name.toLowerCase().includes(e.target.value.toLowerCase())
    );

    dispatch(setFilteredMovies(filteredMovies));
  };

  const handleGenreClick = (genreId) => {
    const filterByGenre = data.filter((movie) => movie.genre === genreId);
    dispatch(setFilteredMovies(filterByGenre));
  };

  const handleYearChange = (year) => {
    const filterByYear = data.filter((movie) => movie.year === +year);
    dispatch(setFilteredMovies(filterByYear));
  };

  const handleSortChange = (sortOption) => {
    switch (sortOption) {
      case "new":
        dispatch(setFilteredMovies(newMovies));
        break;
      case "top":
        dispatch(setFilteredMovies(topMovies));
        break;
      case "random":
        dispatch(setFilteredMovies(randomMovies));
        break;

      default:
        dispatch(setFilteredMovies([]));
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Banner */}
      <section
        className="relative h-[40rem] w-full flex items-center justify-center"
        style={{
          backgroundImage: `url(${banner})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-black opacity-80"></div>
        <div className="relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white drop-shadow-lg">
            The Movies Hub
          </h1>
          <p className="text-lg md:text-2xl mt-4 text-gray-300">
            Cinematic Odyssey: Unveiling the Magic of Movies
          </p>
        </div>
      </section>

      {/* Search & Filters */}
      <div className="container mx-auto px-6 md:px-12 lg:px-20 mt-10">
        <div className="flex flex-col md:flex-row items-center justify-center md:justify-between space-y-4 md:space-y-0">
          {/* Search Input */}
          <input
            type="text"
            className="w-full md:w-1/2 h-14 border border-gray-600 bg-gray-800 px-5 rounded-lg text-white outline-none focus:ring-2 focus:ring-teal-500 transition-all"
            placeholder="🔍 Search Movies..."
            value={moviesFilter.searchTerm}
            onChange={handleSearchChange}
          />

          {/* Dropdowns */}
          <div className="flex space-x-4">
            <select
              className="border px-4 py-2 rounded-md bg-gray-800 text-white focus:ring-2 focus:ring-teal-500"
              value={moviesFilter.selectedGenre}
              onChange={(e) => handleGenreClick(e.target.value)}
            >
              <option value="">Genres</option>
              {genres?.map((genre) => (
                <option key={genre._id} value={genre._id}>
                  {genre.name}
                </option>
              ))}
            </select>

            <select
              className="border px-4 py-2 rounded-md bg-gray-800 text-white focus:ring-2 focus:ring-teal-500"
              value={moviesFilter.selectedYear}
              onChange={(e) => handleYearChange(e.target.value)}
            >
              <option value="">Year</option>
              {uniqueYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>

            <select
              className="border px-4 py-2 rounded-md bg-gray-800 text-white focus:ring-2 focus:ring-teal-500"
              value={moviesFilter.selectedSort}
              onChange={(e) => handleSortChange(e.target.value)}
            >
              <option value="">Sort By</option>
              <option value="new">New Movies</option>
              <option value="top">Top Movies</option>
              <option value="random">Random Movies</option>
            </select>
          </div>
        </div>
      </div>

      {/* Movies Grid */}
      <section className="container mx-auto px-6 md:px-12 lg:px-20 mt-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredMovies?.map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 mt-10 bg-gray-800">
        <p className="text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} The Movies Hub. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default AllMovies;
