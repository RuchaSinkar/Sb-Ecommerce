import { useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineLogin } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authenticateSignInUser } from "../../store/actions";
import toast from "react-hot-toast";

const LogIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const loginHandler = (data) => {
    setLoading(true);
    dispatch(authenticateSignInUser(data, toast, navigate, setLoading));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">

      <form
        onSubmit={handleSubmit(loginHandler)}
        className="w-[380px] bg-white shadow-lg rounded-lg p-8"
      >

        {/* HEADER */}
        <div className="flex flex-col items-center mb-6">
          <AiOutlineLogin className="text-4xl text-gray-700 mb-2" />
          <h2 className="text-2xl font-semibold">Login</h2>
        </div>

        {/* USERNAME */}
        <div className="mb-4">
          <label className="text-sm font-medium">Username</label>
          <input
            {...register("username", { required: true })}
            placeholder="Enter username"
            className="w-full border rounded-md p-2 mt-1"
          />
          {errors.username && (
            <p className="text-red-500 text-xs">Username is required</p>
          )}
        </div>

        {/* PASSWORD */}
        <div className="mb-4">
          <label className="text-sm font-medium">Password</label>
          <input
            type="password"
            {...register("password", { required: true })}
            placeholder="Enter password"
            className="w-full border rounded-md p-2 mt-1"
          />
          {errors.password && (
            <p className="text-red-500 text-xs">Password is required</p>
          )}
        </div>

        {/* BUTTON */}
        <button
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* SIGNUP LINK */}
        <p className="text-center text-sm mt-5">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600 font-medium">
            Sign up
          </Link>
        </p>

      </form>

    </div>
  );
};

export default LogIn;