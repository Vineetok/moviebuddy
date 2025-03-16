import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import WishlistButton from "../../component/WishlistButton.jsx";

const MovieCard = ({ movie }) => {
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <div className="relative group m-[2rem]">
      <Link to={`/movies/${movie._id}`}>
        <img
          src={movie.image}
          alt={movie.name}
          className="w-[20rem] h-[20rem] rounded transition duration-300 ease-in-out transform group-hover:opacity-50"
        />
      </Link>

      <div className="absolute bottom-4 left-0 w-full flex flex-col items-center opacity-0 group-hover:opacity-100 transition duration-300 ease-in-out">
        <p className="text-lg font-bold">{movie.name}</p>
        {/* Only render Watch Now and WishlistButton if user is not an admin */}
        {!userInfo?.isAdmin && (
          <>
            {movie.streamingLink && (
              <a
                href={movie.streamingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm uppercase text-teal-400 hover:underline mt-1"
              >
                Watch Now
              </a>
            )}
            <WishlistButton movieId={movie._id} />
          </>
        )}
      </div>
    </div>
  );
};

export default MovieCard;
