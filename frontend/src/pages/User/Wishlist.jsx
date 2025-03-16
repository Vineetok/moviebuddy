import React from "react";
import { useGetWishlistQuery } from "../../redux/api/users";  // up two levels from pages/User to src
import MovieCard from "../Movies/MovieCard.jsx";


const Wishlist = () => {
  const { data: wishlist, isLoading, error } = useGetWishlistQuery();

  if (isLoading) return <div>Loading wishlist...</div>;
  if (error) return <div>Error loading wishlist</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <h2 className="text-2xl font-bold mb-4">My Wishlist</h2>
      <div className="flex flex-wrap">
        {wishlist?.length === 0 ? (
          <p>You have not added any movies to your wishlist.</p>
        ) : (
          wishlist.map((movie) => (
            <div key={movie._id} className="m-4">
              <MovieCard movie={movie} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Wishlist;
