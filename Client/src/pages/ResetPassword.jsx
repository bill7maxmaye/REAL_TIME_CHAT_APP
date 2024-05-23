import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Avatar from "../components/Avatar";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { DotLoader } from "react-spinners";
const ResetPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { resetToken } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    const URL = `${
      import.meta.env.VITE_BACKEND_URL
    }/api/resetpassword/${resetToken}`;

    try {
      const response = await axios.put(URL, { password });
      setLoading(false);
      toast.success(response.data.message);
      navigate("/email");
    } catch (error) {
      setLoading(false);
      toast.error(error?.response?.data?.message);
    }
  };

  //paswword toggler
  const toggleShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <div className="mt-5">
      <div className="bg-white w-full max-w-md rounded overflow-hidden p-4 mx-auto">
        <div className="w-fit mx-auto mb-2 flex justify-center items-center flex-col gap-y-10">
          <Avatar width={70} height={70} />
        </div>

        {/* //Spinner component */}
        <div className="mt-3 flex items-center justify-center">
          {loading ? <DotLoader className="" color="#00adb5" size={50} /> : ""}
        </div>

        <form className="grid gap-4 mt-3" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1 relative">
            <label htmlFor="password">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              placeholder="Enter your password"
              className="bg-slate-100 px-2 py-1 focus:outline-primary"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={toggleShowPassword}
              className="absolute right-2   top-9 text-primary "
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <div className="flex flex-col gap-1 relative">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type={showPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm your password"
              className="bg-slate-100 px-2 py-1 focus:outline-primary"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={toggleShowPassword}
              className="absolute right-2   top-9 text-primary "
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <button className="bg-primary text-lg px-4 py-1 hover:bg-secondary rounded mt-2 font-bold text-white leading-relaxed tracking-wide">
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;

// import React, { useState } from "react";
// import axios from "axios";

// const ForgotPassword = () => {
//   const [email, setEmail] = useState("");
//   const [message, setMessage] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const URL = `${import.meta.env.VITE_BACKEND_URL}/api/forgotpassword`;
//     try {
//       const res = await axios.post(URL, { email });
//       setMessage(res.data.message);
//     } catch (error) {
//       setMessage(error.response.data.message);
//     }
//   };

//   return (
//     <div>
//       <h1>Forgot Password</h1>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           placeholder="Enter your email"
//         />
//         <button type="submit">Submit</button>
//       </form>
//       {message && <p>{message}</p>}
//     </div>
//   );
// };

// export default ForgotPassword;
