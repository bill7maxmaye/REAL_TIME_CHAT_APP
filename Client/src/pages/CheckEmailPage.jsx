import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { PiUserCircle } from "react-icons/pi";
import { DotLoader } from "react-spinners";

const CheckEmailPage = () => {
  const [data, setData] = useState({
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState(""); // State to manage email error
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address.";
    } else {
      return "";
    }
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setData((preve) => {
      return {
        ...preve,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const error = validateEmail(data.email);
    setEmailError(error);

    if (error) {
      toast.error(error);
      return;
    }
    setLoading(true);
    const URL = `${import.meta.env.VITE_BACKEND_URL}/api/email`;

    try {
      const response = await axios.post(URL, data);
      setLoading(false);
      toast.success(response.data.message);

      if (response.data.success) {
        setData({
          email: "",
        });

        navigate("/password", {
          state: response?.data?.data,
        });
      }
    } catch (error) {
      setLoading(false);
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <div className="mt-5 ">
      <div className="bg-white w-full max-w-md rounded overflow-hidden p-4 mx-auto">
        <div className="w-fit mx-auto mb-2">
          <PiUserCircle size={80} className="text-primary" />
        </div>

        {/* //Spinner component */}
        <div className="mt-3 flex items-center justify-center">
          {loading ? <DotLoader className="" color="#00adb5" size={50} /> : ""}
        </div>

        <h3>Welcome to Chat app!</h3>

        <form className="grid gap-4 mt-3" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              className="bg-slate-100 px-2 py-1 focus:outline-primary"
              value={data.email}
              onChange={handleOnChange}
              required
            />
            {emailError && (
              <p className="text-red-500 text-sm mt-1">{emailError}</p>
            )}
          </div>
          {/* spinner component */}

          <button className="bg-primary text-lg px-4 py-1 hover:bg-secondary rounded mt-2 font-bold text-white leading-relaxed tracking-wide">
            Let's Go
          </button>
        </form>

        <p className="my-3 text-center">
          New User?{" "}
          <Link to={"/register"} className="hover:text-primary font-semibold">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CheckEmailPage;
