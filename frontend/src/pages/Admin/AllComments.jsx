import { useState } from "react";
import {
  useDeleteCommentMutation,
  useGetAllMoviesQuery,
} from "../../redux/api/movies";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const AllComments = () => {
  const { data: movies, refetch } = useGetAllMoviesQuery();

  const [deleteComment] = useDeleteCommentMutation();

  const handleDeleteComment = async (movieId, reviewId) => {
    try {
      await deleteComment({ movieId, reviewId }).unwrap();
      toast.success("Comment Deleted");
      refetch();
    } catch (error) {
      console.error("Error deleting comment: ", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center py-10">
      {movies?.map((movie) => (
        <motion.section
          key={movie._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center w-full mb-8"
        >
          {movie?.reviews.map((review) => (
            <motion.div
              key={review._id}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              className="bg-gray-800 p-6 rounded-lg shadow-lg w-11/12 md:w-2/3 lg:w-1/2"
            >
              <div className="flex justify-between items-center mb-4">
                <strong className="text-gray-300">{review.name}</strong>
                <p className="text-gray-400">
                  {review.createdAt.substring(0, 10)}
                </p>
              </div>
              <p className="text-gray-300 mb-6">{review.comment}</p>
              <button
                className="text-red-500 hover:text-red-600 transition duration-200"
                onClick={() => handleDeleteComment(movie._id, review._id)}
              >
                Delete
              </button>
            </motion.div>
          ))}
        </motion.section>
      ))}
    </div>
  );
};

export default AllComments;
