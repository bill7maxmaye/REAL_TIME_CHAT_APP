import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Avatar from "../components/Avatar";
import { DotLoader } from "react-spinners";
const Forgotpassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const URL = `${import.meta.env.VITE_BACKEND_URL}/api/forgotpassword`;

    try {
      setLoading(true);
      const response = await axios({
        method: "post",
        url: URL,
        data: { email },
        withCredentials: true,
      });

      setLoading(false);
      console.log(response.data);
      toast.success(response.data.message);
    } catch (error) {
      setLoading(false);
      console.log(error.response.data.message);
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <div className="mt-5">
      <div className="bg-white w-full max-w-md rounded overflow-hidden p-4 mx-auto">
        <div className="w-fit  mx-auto mb-2 flex justify-center items-center flex-col gap-y-10">
          <Avatar width={70} height={70} />
        </div>

        {/* //Spinner component */}
        <div className="mt-3 flex items-center justify-center">
          {loading ? <DotLoader className="" color="#00adb5" size={50} /> : ""}
        </div>

        <form className="grid gap-4 mt-3" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1 relative">
            <label htmlFor="email">Forgot Password </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              className="bg-slate-100 px-2 py-1 focus:outline-primary"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button className="bg-primary text-lg px-4 py-1 hover:bg-secondary rounded mt-2 font-bold text-white leading-relaxed tracking-wide">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Forgotpassword;
