import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaUserPlus } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { registerNewUser } from "../../store/actions";
import toast from "react-hot-toast";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const registerHandler = (data) => {
    setLoading(true);
    dispatch(registerNewUser(data, toast, navigate, setLoading));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">

      <form
        onSubmit={handleSubmit(registerHandler)}
        className="w-[380px] bg-white shadow-lg rounded-lg p-8"
      >

        {/* HEADER */}
        <div className="flex flex-col items-center mb-6">
          <FaUserPlus className="text-4xl text-gray-700 mb-2" />
          <h2 className="text-2xl font-semibold">Create Account</h2>
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

        {/* EMAIL */}
        <div className="mb-4">
          <label className="text-sm font-medium">Email</label>
          <input
            type="email"
            {...register("email", { required: true })}
            placeholder="Enter email"
            className="w-full border rounded-md p-2 mt-1"
          />
          {errors.email && (
            <p className="text-red-500 text-xs">Email is required</p>
          )}
        </div>

        {/* PASSWORD */}
        <div className="mb-4">
          <label className="text-sm font-medium">Password</label>
          <input
            type="password"
            {...register("password", { required: true, minLength: 6 })}
            placeholder="Enter password"
            className="w-full border rounded-md p-2 mt-1"
          />
          {errors.password && (
            <p className="text-red-500 text-xs">
              Password must be at least 6 characters
            </p>
          )}
        </div>

        {/* BUTTON */}
        <button
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          {loading ? "Creating account..." : "Register"}
        </button>

        {/* LOGIN LINK */}
        <p className="text-center text-sm mt-5">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-medium">
            Login
          </Link>
        </p>

      </form>

    </div>
  );
};

export default Register;