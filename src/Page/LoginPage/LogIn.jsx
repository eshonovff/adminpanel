import { Button } from "antd";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Login } from "../../Api/Login";

const LogIn = () => {
  const [email, setEmail] = useState("admin123");
  const [password, setPassword] = useState("Qwerty123!");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLoginSuccess = () => {
    const login = {
      username: email,
      password: password,
    };

    dispatch(Login({ login, navigate }));
    console.log(login);
    // setEmail("")
    // setPassword("")
  };


  console.log("API URL:", import.meta.env.VITE_APP_API_URL);
  
  return (
    <div className="w-[50%] flex justify-center items-center">
      <div className="flex flex-col text-base w-[400px]">
        {/* Title */}
        <h2 className="text-2xl font-bold leading-none text-gray-900">
          Log in
        </h2>

        {/* Input Fields */}
        <div className="flex flex-col mt-5 w-full whitespace-nowrap text-neutral-500">
          {/* Email Input */}
          <div className="flex flex-col w-full">
            <label className="text-sm text-gray-700 mb-1">Email</label>
            <input
              type="text"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-4 w-full bg-white rounded border border-neutral-200 outline-none focus:border-blue-500 transition-all"
            />
          </div>

          {/* Password Input */}
          <div className="flex flex-col mt-5 w-full">
            <label className="text-sm text-gray-700 mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-4 w-full bg-white rounded border border-neutral-200 outline-none focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col mt-5 w-full font-medium text-center">
          <Link to="/forgotps" className="text-blue-600 hover:underline">
            Forgot password?
          </Link>
          <Button
            onClick={handleLoginSuccess}
            className="px-5 py-3.5 mt-2 w-full text-white bg-blue-600 rounded hover:bg-blue-700 transition-all"
          >
            Log in
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LogIn;
