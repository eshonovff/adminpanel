import { useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./Layout/Layout";
import Dashboard from "./Page/Dashboard/Dashboard";
import DesignPage from "./Page/DesignPage/DesignPage";
import Otzivi from "./Page/Otzivi/Otzivi";
import Zayavki from "./Page/Zayavki/Zayavki";

import Admin from "./Layout/admin";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from './Utils/ProtectedRoute'; // Инро илова кунед
import LogIn from "./Page/LoginPage/LogIn";

const App = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const router = createBrowserRouter([
    {
      path: "/admin",
      element: <Admin />,
      children: [
        {
          index: true,
          element: <LogIn />,
        },
      ],
    },
    {
      path: "/",
      element: <ProtectedRoute><Layout /></ProtectedRoute>,
      children: [
        {
          index: true,
          element: <Dashboard />,
        },
        {
          path: "/zayavki",
          element: <Zayavki />,
        },
        {
          path: "/Otzivi",
          element: <Otzivi />,
        },
        {
          path: "/DesignPage",
          element: <DesignPage />,
        },
      ],
    },
  ]);

  if (windowWidth < 1000) {
    return (
      <div className="bg-[#1a1a1a] h-screen w-screen flex justify-center items-center">
        <h1 className="text-white text-center px-4">
          Бо ягон манитори калонтар дароед. Андозаи экранатон аз 1000 пиксел хурд аст.
        </h1>
      </div>
    );
  }

  return (
    <div className="max-w-[1950px] m-auto no-copy">
      <Toaster position="top-right" />
      <RouterProvider router={router} />
    </div>
  );
};

export default App;