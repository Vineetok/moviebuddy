import mongoose from "mongoose";

const reviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true }, // Reviewer's name
    rating: { 
      type: Number, 
      required: true,
      min: 1, // Minimum rating value
      max: 5, // Maximum rating value
    },
    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", // Reference to the user who wrote the review
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

const movieSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String },
    year: { type: Number, required: true },
    genre: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Genre", 
      required: true 
    },
    detail: { type: String, required: true },
    cast: [{ type: String }],
    reviews: [reviewSchema], // Array of reviews
    numReviews: { 
      type: Number, 
      required: true, 
      default: 0 
    },
    rating: { 
      type: Number, 
      required: true, 
      default: 0 
    },
    streamingLink: { type: String },
  },
  { timestamps: true }
);

const Movie = mongoose.model("Movie", movieSchema);
export default Movie;