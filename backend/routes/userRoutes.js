import express from "express";
import { addToWishlist, removeFromWishlist, getWishlist } from "../controllers/userController.js";

// controllers
import {
  createUser,
  loginUser,
  logoutCurrentUser,
  getAllUsers,
  getCurrentUserProfile,
  updateCurrentUserProfile,
} from "../controllers/userController.js";

// middlewares
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.post("/wishlist", authenticate, addToWishlist);
router.delete("/wishlist/:movieId", authenticate, removeFromWishlist);
router.get("/wishlist", authenticate, getWishlist);
router
  .route("/")
  .post(createUser)
  .get(authenticate, authorizeAdmin, getAllUsers);

router.post("/auth", loginUser);
router.post("/logout", logoutCurrentUser);

router
  .route("/profile")
  .get(authenticate, getCurrentUserProfile)
  .put(authenticate, updateCurrentUserProfile);

export default router;
