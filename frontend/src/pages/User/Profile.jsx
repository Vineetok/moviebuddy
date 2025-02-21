import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../../component/Loader";
import { useProfileMutation } from "../../redux/api/users";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { motion } from "framer-motion";

const Profile = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { userInfo } = useSelector((state) => state.auth);

  const [updateProfile, { isLoading: loadingUpdateProfile }] = useProfileMutation();

  useEffect(() => {
    setUsername(userInfo.username);
    setEmail(userInfo.email);
  }, [userInfo.email, userInfo.username]);

  const dispatch = useDispatch();

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const res = await updateProfile({
          _id: userInfo._id,
          username,
          email,
          password,
        }).unwrap();
        dispatch(setCredentials({ ...res }));
        toast.success("Profile updated successfully");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <motion.section
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-wrap bg-gray-800 shadow-lg rounded-lg overflow-hidden max-w-4xl w-full"
      >
        <div className="w-full p-8">
          <h1 className="text-3xl font-semibold text-white mb-6">Update Profile</h1>

          <form onSubmit={submitHandler} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300">Name</label>
              <input
                type="text"
                id="username"
                className="mt-1 p-3 border border-gray-600 rounded-lg w-full bg-gray-700 text-white focus:ring-teal-500 focus:border-teal-500"
                placeholder="Enter name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email Address</label>
              <input
                type="email"
                id="email"
                className="mt-1 p-3 border border-gray-600 rounded-lg w-full bg-gray-700 text-white focus:ring-teal-500 focus:border-teal-500"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
              <input
                type="password"
                id="password"
                className="mt-1 p-3 border border-gray-600 rounded-lg w-full bg-gray-700 text-white focus:ring-teal-500 focus:border-teal-500"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                className="mt-1 p-3 border border-gray-600 rounded-lg w-full bg-gray-700 text-white focus:ring-teal-500 focus:border-teal-500"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-teal-500 text-white py-3 rounded-lg font-semibold text-lg hover:bg-teal-600 transition duration-300"
            >
              {loadingUpdateProfile ? "Updating ..." : "Update"}
            </button>
            {loadingUpdateProfile && <Loader />}
          </form>
        </div>
      </motion.section>
    </div>
  );
};

export default Profile;
