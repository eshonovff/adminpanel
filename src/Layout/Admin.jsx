import { Button } from "antd";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Login } from "../Api/Login";
import logo from "../assets/kavsar.png";

const Admin = () => {
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
  };

  return (
    <div className="flex h-screen w-full">
      {/* Left side - Welcome section with background */}
      <div className="hidden md:flex flex-col text-2xl font-medium text-white bg-gradient-to-b from-[#1A3A4A] to-[#1E2A47] w-1/2">
        <div className="flex overflow-hidden relative justify-center items-center flex-col w-full h-full">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/11fe5e09757c4be31510f2e352251b5b4a3de5bd8dc36002730be755e633ac43?placeholderIfAbsent=true&apiKey=e940a6a49e084455a40af88cc6d38123"
            className="object-cover absolute inset-0 size-full opacity-20"
            alt="Background pattern"
          />
          <div className="flex relative flex-col items-center text-center z-10">
            <div className="mb-8">Welcome to admin panel</div>
            <img 
              loading="lazy" 
              src={logo} 
              className="w-[300px]" 
              alt="KАВСАР Академия"
            />
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full md:w-1/2 flex justify-center items-center px-6">
        <div className="flex flex-col text-base w-full max-w-md">
          {/* Mobile logo - only visible on small screens */}
          <div className="flex md:hidden justify-center mb-8">
            <img 
              loading="lazy" 
              src={logo} 
              className="w-[200px]" 
              alt="KАВСАР Академия"
            />
          </div>
          
          {/* Title */}
          <h2 className="text-2xl font-bold leading-none text-gray-900 mb-6">
            Log in
          </h2>

          {/* Input Fields */}
          <div className="flex flex-col w-full">
            {/* Email Input */}
            <div className="flex flex-col w-full mb-4">
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
            <div className="flex flex-col w-full mb-6">
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
          <div className="flex flex-col w-full">
            <div className="flex justify-end mb-4">
              <Link to="/forgotps" className="text-blue-600 hover:underline text-sm">
                Forgot password?
              </Link>
            </div>
            
            <Button
              onClick={handleLoginSuccess}
              className="h-12 w-full text-white bg-blue-600 rounded hover:bg-blue-700 transition-all text-base font-medium"
            >
              Log in
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;