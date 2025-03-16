import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetSpecificMovieQuery,
  useAddMovieReviewMutation,
} from "../../redux/api/movies";
import MovieTabs from "./MovieTabs";

// Star Rating Component
const StarRating = ({ rating, setRating }) => {
  return (
    <div className="flex items-center space-x-1 mb-4">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          type="button"
          key={star}
          onClick={() => setRating(star)}
          className={`text-2xl ${
            star <= rating ? "text-yellow-400" : "text-gray-400"
          }`}
        >
          ★
        </button>
      ))}
    </div>
  );
};

const MovieDetails = () => {
  const navigate = useNavigate();
  const { id: movieId } = useParams();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const { data: movie, refetch, isLoading, error } = useGetSpecificMovieQuery(movieId);
  const { userInfo } = useSelector((state) => state.auth);
  const [createReview, { isLoading: loadingMovieReview }] = useAddMovieReviewMutation();

  // Handle review submission
  const submitHandler = async (e) => {
    e.preventDefault();

    if (!rating) {
      toast.error("Please select a rating");
      return;
    }

    try {
      await createReview({
        id: movieId,
        rating,
        comment,
      }).unwrap();

      // Reset form and refetch movie data
      setRating(0);
      setComment("");
      refetch();

      toast.success("Review submitted successfully");
    } catch (error) {
      toast.error(error.data || error.message);
    }
  };

  // Loading and error states
  if (isLoading) return <div className="text-center py-8">Loading movie details...</div>;
  if (error) return <div className="text-red-500 text-center py-8">Error: {error.data?.message || 'Failed to load movie'}</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8 lg:p-12">
      {/* Back Button */}
      <Link to="/" className="text-teal-500 font-semibold hover:underline">
        &larr; Go Back
      </Link>

      {/* Movie Details */}
      <div className="mt-8 flex flex-col lg:flex-row items-center lg:items-start gap-8">
        {/* Movie Poster */}
        <div className="lg:w-1/2 flex justify-center lg:justify-start">
          <img
            src={movie?.image}
            alt={movie?.name}
            className="w-full max-w-lg rounded-lg shadow-2xl"
          />
        </div>

        {/* Movie Information */}
        <div className="lg:w-1/2 space-y-6">
          <h1 className="text-4xl font-bold">{movie?.name}</h1>
          <p className="text-xl text-gray-400">{movie?.detail}</p>

          {/* Release Date */}
          <p className="text-2xl font-semibold">
            Release Date: <span className="text-gray-400">{movie?.year}</span>
          </p>

          {/* Cast */}
          <div>
            <h2 className="text-2xl font-semibold mb-2">Cast</h2>
            <ul className="text-lg text-gray-400">
              {movie?.cast[0]?.split(',').map((c, index) => (
                <li key={index} className="mb-1">
                  {c.trim()}
                </li>
              ))}
            </ul>
          </div>

          {/* Watch Now Button */}
          {movie?.streamingLink && (
            <div className="mb-8">
              <a
                href={movie.streamingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-teal-500 text-white px-8 py-3 rounded-lg font-bold hover:bg-teal-600 transition duration-300"
              >
                Watch Now ▶️
              </a>
            </div>
          )}

          {/* Reviews Section */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Reviews</h2>

            {/* Review Form (Visible to Logged-in Users) */}
            {userInfo ? (
              <form onSubmit={submitHandler} className="mb-8">
                <div className="mb-4">
                  <label className="block text-lg mb-2">Your Rating</label>
                  <StarRating rating={rating} setRating={setRating} />
                </div>

                <div className="mb-4">
                  <label className="block text-lg mb-2">Your Review</label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full p-2 rounded bg-gray-800 text-white"
                    rows="3"
                    placeholder="Write your review here..."
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="bg-teal-600 text-white px-6 py-2 rounded hover:bg-teal-700 transition"
                  disabled={!rating || loadingMovieReview}
                >
                  {loadingMovieReview ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            ) : (
              <div className="mb-8 text-gray-400">
                Please <Link to="/login" className="text-teal-400">login</Link> to leave a review
              </div>
            )}

            {/* Existing Reviews */}
            <div className="space-y-4">
              {movie?.reviews?.length === 0 && (
                <p className="text-gray-400">No reviews yet. Be the first to review!</p>
              )}

              {movie?.reviews?.map((review) => (
                <div key={review._id} className="bg-gray-800 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">{review.name}</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-xl ${
                            i < review.rating ? "text-yellow-400" : "text-gray-400"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-300">{review.comment}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;