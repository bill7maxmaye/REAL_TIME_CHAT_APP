import React, { useState } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Avatar from "../components/Avatar";
// import { useDispatch } from "react-redux";
// import { setToken } from "../redux/userSlice";

const Forgotpassword = () => {
  const [email, setEmail] = useState("");

  //const navigate = useNavigate();
  //const location = useLocation();
  //const dispatch = useDispatch();

  //this line makes  sure the checkpassword page not get rendered if the user name is not found
  // useEffect(() => {
  //   if (!location?.state?.name) {
  //     navigate("/email");
  //   }
  // }, []);

  // const handleOnChange = (e) => {
  //   const { name, value } = e.target;

  //   setEmail((preve) => {
  //     return {
  //       ...preve,
  //       [name]: value,
  //     };
  //   });
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const URL = `${import.meta.env.VITE_BACKEND_URL}/api/forgotpassword`;

    try {
      const response = await axios({
        method: "post",
        url: URL,
        data: { email },
        //withCredentials: true,
      });
      console.log(response.data);
      toast.success(response.data.message);
    } catch (error) {
      console.log(error.response.data.message);
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <div className="mt-5">
      <div className="bg-white w-full max-w-md rounded overflow-hidden p-4 mx-auto">
        <div className="w-fit mx-auto mb-2 flex justify-center items-center flex-col gap-y-10">
          <Avatar
            width={70}
            height={70}
            // name={location?.state?.name}
            // imageUrl={location?.state?.profile_pic}
          />
        </div>

        <form className="grid gap-4 mt-3" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1 relative">
            <label htmlFor="email">Forgot Password </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="enter your email"
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
