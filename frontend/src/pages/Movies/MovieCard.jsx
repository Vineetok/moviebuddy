import { Link } from "react-router-dom";

const MovieCard = ({ movie }) => {
  return (
    <div key={movie._id} className="relative group m-[2rem]">
      <Link to={`/movies/${movie._id}`}>
        <img
          src={movie.image}
          alt={movie.name}
          className="w-[20rem] h-[20rem] rounded transition duration-300 ease-in-out transform group-hover:opacity-50"
        />
      </Link>

      <div className="absolute bottom-4 left-0 w-full flex flex-col items-center opacity-0 group-hover:opacity-100 transition duration-300 ease-in-out">
        <p className="text-lg font-bold">{movie.name}</p>
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
      </div>
    </div>
  );
};

export default MovieCard;
