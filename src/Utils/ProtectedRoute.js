import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import toast from 'react-hot-toast';
import { getToken } from "./token";

// Функсияи checkToken барои санҷиши эътибори токен
const checkToken = () => {
  const token = localStorage.getItem("access_token");
  return !!token; // Агар токен мавҷуд бошад, true бармегардонад
};

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");
  const user = getToken();
  const isValidToken = checkToken();

  useEffect(() => {
    if (!token || !isValidToken) {
      localStorage.removeItem("access_token");
      toast.error("Лутфан барои дастрасӣ ба ин саҳифа ба система ворид шавед");
      navigate("/admin"); // Ин саҳифаи логини шумост
    }
  }, [navigate, token, isValidToken]);

  return isValidToken ? children : null;
};

export default ProtectedRoute;