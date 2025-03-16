import React, { useState } from "react";
import { AiOutlineHome, AiOutlineLogin, AiOutlineUserAdd } from "react-icons/ai";
import { MdOutlineLocalMovies } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../redux/api/users";
import { logout } from "../../redux/features/auth/authSlice";

const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 bg-[#0f0f0f] border w-11/12 sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/4 px-6 py-4 rounded-lg shadow-lg">
      <section className="flex justify-between items-center">
        {/* Section 1: Home & Movies Links */}
        <div className="flex space-x-6">
          <Link
            to="/"
            className="flex flex-col items-center transition-transform transform hover:-translate-y-1 hover:text-gray-300"
            aria-label="Home"
          >
            <AiOutlineHome size={26} className="mb-1 text-white" />
            <span className="text-white text-sm">Home</span>
          </Link>

          <Link
            to="/movies"
            className="flex flex-col items-center transition-transform transform hover:-translate-y-1 hover:text-gray-300"
            aria-label="Movies"
          >
            <MdOutlineLocalMovies size={26} className="mb-1 text-white" />
            <span className="text-white text-sm">Movies</span>
          </Link>
        </div>

        {/* Section 2: User Menu */}
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="text-white focus:outline-none flex items-center"
            aria-label="User Menu"
          >
            {userInfo ? <span className="mr-2">{userInfo.username}</span> : null}
            {userInfo && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-4 w-4 transition-transform ${dropdownOpen ? "transform rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={dropdownOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
                />
              </svg>
            )}
          </button>

          {dropdownOpen && userInfo && (
            <ul
              className={`absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-md ${
                !userInfo.isAdmin ? "top-full" : "top-12"
              }`}
            >
              {userInfo.isAdmin && (
                <li>
                  <Link
                    to="/admin/movies/dashboard"
                    className="block px-4 py-2 hover:bg-gray-100 transition-colors"
                  >
                    Dashboard
                  </Link>
                </li>
              )}

              <li>
                <Link
                  to="/profile"
                  className="block px-4 py-2 hover:bg-gray-100 transition-colors"
                >
                  Profile
                </Link>
              </li>

              {/* Only display Wishlist link for non-admin users */}
              {!userInfo.isAdmin && (
                <li>
                  <Link
                    to="/wishlist"
                    className="block px-4 py-2 hover:bg-gray-100 transition-colors"
                  >
                    My Wishlist
                  </Link>
                </li>
              )}

              <li>
                <button
                  onClick={logoutHandler}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors"
                >
                  Logout
                </button>
              </li>
            </ul>
          )}

          {!userInfo && (
            <ul className="flex space-x-6">
              <li>
                <Link
                  to="/login"
                  className="flex flex-col items-center transition-transform transform hover:-translate-y-1 hover:text-gray-300"
                  aria-label="Login"
                >
                  <AiOutlineLogin size={26} className="mb-1 text-white" />
                  <span className="text-white text-sm">Login</span>
                </Link>
              </li>

              <li>
                <Link
                  to="/register"
                  className="flex flex-col items-center transition-transform transform hover:-translate-y-1 hover:text-gray-300"
                  aria-label="Register"
                >
                  <AiOutlineUserAdd size={26} className="mb-1 text-white" />
                  <span className="text-white text-sm">Register</span>
                </Link>
              </li>
            </ul>
          )}
        </div>
      </section>
    </div>
  );
};

export default Navigation;
