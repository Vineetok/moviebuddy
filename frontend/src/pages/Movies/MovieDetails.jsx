import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetSpecificMovieQuery,
  useAddMovieReviewMutation,
} from "../../redux/api/movies";
import MovieTabs from "./MovieTabs";

const MovieDetails = () => {
  const { id: movieId } = useParams();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const { data: movie, refetch } = useGetSpecificMovieQuery(movieId);
  const { userInfo } = useSelector((state) => state.auth);
  const [createReview, { isLoading: loadingMovieReview }] =
    useAddMovieReviewMutation();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await createReview({
        id: movieId,
        rating,
        comment,
      }).unwrap();

      refetch();

      toast.success("Review created successfully");
    } catch (error) {
      toast.error(error.data || error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8 lg:p-12">
      <Link to="/" className="text-teal-500 font-semibold hover:underline">
        &larr; Go Back
      </Link>

      <div className="mt-8 flex flex-col lg:flex-row items-center lg:items-start">
        <div className="lg:w-1/2 flex justify-center lg:justify-start mb-8 lg:mb-0">
          <img
            src={movie?.image}
            alt={movie?.name}
            className="w-full max-w-lg rounded shadow-lg"
          />
        </div>

        <div className="lg:w-1/2 lg:pl-12">
          <h1 className="text-4xl font-bold mb-4">{movie?.name}</h1>
          <p className="text-xl text-gray-400 mb-6">{movie?.detail}</p>

          <p className="text-2xl font-semibold mb-4">
            Release Date: <span className="text-gray-400">{movie?.year}</span>
          </p>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-2">Cast</h2>
            <ul className="text-lg text-gray-400">
              {movie?.cast[0].split(',').map((c, index) => (
                <li key={index} className="mb-1">
                  {c}
                </li>
              ))}
            </ul>
          </div>

          {movie?.streamingLink && (
            <div className="mb-8">
              <a
                href={movie.streamingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-teal-500 text-white px-6 py-3 rounded font-semibold hover:bg-teal-600 transition duration-300"
              >
                Watch Now
              </a>
            </div>
          )}

          <MovieTabs
            loadingMovieReview={loadingMovieReview}
            userInfo={userInfo}
            submitHandler={submitHandler}
            rating={rating}
            setRating={setRating}
            comment={comment}
            setComment={setComment}
            movie={movie}
          />
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
