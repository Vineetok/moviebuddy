// src/pages/ErrorPage.jsx
import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">Oops! Something went wrong.</h1>
      <Link
        to="/"
        className="bg-teal-500 text-white px-6 py-3 rounded-lg hover:bg-teal-600"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default ErrorPage;