import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCreateMovieMutation,
  useUploadImageMutation,
} from "../../redux/api/movies";
import { useFetchGenresQuery } from "../../redux/api/genre";
import { toast } from "react-toastify";

const CreateMovie = () => {
  const navigate = useNavigate();

  const [movieData, setMovieData] = useState({
    name: "",
    year: 0,
    releaseDate: "", // New field: release date provided by admin
    detail: "",
    cast: [],
    rating: 0,
    image: null,
    genre: "",
    streamingLink: "",
  });

  const [selectedImage, setSelectedImage] = useState(null);

  const [
    createMovie,
    { isLoading: isCreatingMovie, error: createMovieErrorDetail },
  ] = useCreateMovieMutation();

  const [
    uploadImage,
    { isLoading: isUploadingImage, error: uploadImageErrorDetails },
  ] = useUploadImageMutation();

  const { data: genres, isLoading: isLoadingGenres } = useFetchGenresQuery();

  useEffect(() => {
    if (genres) {
      setMovieData((prevData) => ({
        ...prevData,
        genre: genres[0]?._id || "",
      }));
    }
  }, [genres]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // For genre selection, we update as before
    if (name === "genre") {
      const selectedGenre = genres.find((genre) => genre.name === value);
      setMovieData((prevData) => ({
        ...prevData,
        genre: selectedGenre ? selectedGenre._id : "",
      }));
    } else {
      setMovieData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  const handleCreateMovie = async () => {
    // Validate required fields including the new releaseDate and cast
    if (
      !movieData.name ||
      !movieData.year ||
      !movieData.releaseDate ||
      !movieData.detail ||
      movieData.cast.length === 0 ||
      !selectedImage ||
      !movieData.streamingLink
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    let uploadedImagePath = null;

    if (selectedImage) {
      const formData = new FormData();
      formData.append("image", selectedImage);

      const uploadImageResponse = await uploadImage(formData);

      if (uploadImageResponse.data) {
        uploadedImagePath = uploadImageResponse.data.image;
      } else {
        console.error("Failed to upload image: ", uploadImageErrorDetails);
        toast.error("Failed to upload image");
        return;
      }
    }

    await createMovie({
      ...movieData,
      image: uploadedImagePath,
    });

    navigate("/admin/movies-list");
    setMovieData({
      name: "",
      year: 0,
      releaseDate: "",
      detail: "",
      cast: [],
      rating: 0,
      image: null,
      genre: "",
      streamingLink: "",
    });
    toast.success("Movie Added To Database");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="w-full max-w-4xl bg-[#1E1E1E] shadow-lg rounded-xl p-8">
        <h1 className="text-3xl font-bold text-teal-400 text-center mb-6">
          🎬 Add a New Movie
        </h1>

        {/* Grid Layout for Basic Info */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold mb-1">Movie Name</label>
            <input
              type="text"
              name="name"
              value={movieData.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-700 rounded-md bg-gray-800 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Release Year</label>
            <input
              type="number"
              name="year"
              value={movieData.year}
              onChange={handleChange}
              className="w-full p-2 border border-gray-700 rounded-md bg-gray-800 text-white"
            />
          </div>
        </div>

        {/* Additional Grid for Release Date & Genre */}
        <div className="grid grid-cols-2 gap-6 mt-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Release Date</label>
            <input
              type="date"
              name="releaseDate"
              value={movieData.releaseDate}
              onChange={handleChange}
              className="w-full p-2 border border-gray-700 rounded-md bg-gray-800 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Genre</label>
            <select
              name="genre"
              value={movieData.genre}
              onChange={handleChange}
              className="w-full p-2 border border-gray-700 rounded-md bg-gray-800 text-white"
            >
              {isLoadingGenres ? (
                <option>Loading...</option>
              ) : (
                genres.map((genre) => (
                  <option key={genre._id} value={genre._id}>
                    {genre.name}
                  </option>
                ))
              )}
            </select>
          </div>
        </div>

        {/* Streaming Link */}
        <div className="mt-4">
          <label className="block text-sm font-semibold mb-1">Streaming Link</label>
          <input
            type="text"
            name="streamingLink"
            value={movieData.streamingLink}
            onChange={handleChange}
            placeholder="Enter streaming platform link..."
            className="w-full p-2 border border-gray-700 rounded-md bg-gray-800 text-white"
          />
        </div>

        {/* Movie Details */}
        <div className="mt-4">
          <label className="block text-sm font-semibold mb-1">Movie Details</label>
          <textarea
            name="detail"
            value={movieData.detail}
            onChange={handleChange}
            rows="3"
            className="w-full p-2 border border-gray-700 rounded-md bg-gray-800 text-white"
          ></textarea>
        </div>

        {/* Cast Field */}
        <div className="mt-4">
          <label className="block text-sm font-semibold mb-1">Cast (comma-separated)</label>
          <input
            type="text"
            name="cast"
            value={movieData.cast.join(", ")}
            onChange={(e) =>
              setMovieData({
                ...movieData,
                cast: e.target.value.split(",").map((c) => c.trim()),
              })
            }
            className="w-full p-2 border border-gray-700 rounded-md bg-gray-800 text-white"
            placeholder="Actor 1, Actor 2, Actor 3"
          />
        </div>

        {/* Movie Poster Upload */}
        <div className="mt-4">
          <label className="block text-sm font-semibold mb-1">Movie Poster</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full text-gray-300"
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleCreateMovie}
          className="w-full mt-6 bg-gradient-to-r from-teal-500 to-lime-400 text-black font-semibold py-2 rounded-lg hover:opacity-90 transition"
          disabled={isCreatingMovie || isUploadingImage}
        >
          {isCreatingMovie || isUploadingImage ? "Adding..." : "Add Movie"}
        </button>
      </div>
    </div>
  );
};

export default CreateMovie;
