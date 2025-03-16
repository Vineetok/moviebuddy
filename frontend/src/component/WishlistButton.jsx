// frontend/src/components/WishlistButton.jsx
import React from "react";
import { useSelector } from "react-redux";
import { useAddToWishlistMutation, useRemoveFromWishlistMutation, useGetWishlistQuery } from "../redux/api/users";

import { toast } from "react-toastify";

const WishlistButton = ({ movieId }) => {
  const { userInfo } = useSelector((state) => state.auth);
  // Fetch the wishlist (skip if user not logged in)
  const { data: wishlist } = useGetWishlistQuery(undefined, { skip: !userInfo });
  
  const [addToWishlist, { isLoading: adding }] = useAddToWishlistMutation();
  const [removeFromWishlist, { isLoading: removing }] = useRemoveFromWishlistMutation();

  // Check if the current movie is already in the wishlist
  const isInWishlist = wishlist?.find((movie) => movie._id === movieId);

  const handleWishlistClick = async () => {
    try {
      if (isInWishlist) {
        await removeFromWishlist(movieId).unwrap();
        toast.success("Removed from wishlist");
      } else {
        await addToWishlist(movieId).unwrap();
        toast.success("Added to wishlist");
      }
    } catch (error) {
      toast.error("Failed to update wishlist");
    }
  };

  return (
    <button
      onClick={handleWishlistClick}
      disabled={adding || removing}
      className="bg-teal-500 text-white px-3 py-1 rounded hover:bg-teal-600 transition"
    >
      {isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
    </button>
  );
};

export default WishlistButton;
