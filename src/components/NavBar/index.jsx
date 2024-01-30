import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { signOut, getAuth } from "firebase/auth";

import { CONFIG } from "../../constants/config";

import Button from "../Button";

const NavBar = () => {
  const [toShowDropDownMenu, setToShowDropDownMenu] = useState(false);
  const navigate = useNavigate();

  const navigateToMySketches = () => {
    setToShowDropDownMenu(false);

    navigate("/my-sketches");
  };

  const navigateToHome = () => {
    setToShowDropDownMenu(false);

    navigate("/");
  };

  const logoutUser = async () => {
    try {
      const auth = getAuth();

      await signOut(auth);
      sessionStorage.clear();

      setToShowDropDownMenu(false);

      const response = await fetch(`${CONFIG.BACKEND_SERVER_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        console.log("로그아웃 성공");
      } else {
        console.error("로그아웃 실패");
      }

      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const userPhotoURL = sessionStorage.getItem("userPhotoURL");

  return (
    <nav className="bg-zinc-100">
      <div className="mx-auto">
        <div className="relative flex items-center justify-between">
          <Button
            onClick={navigateToHome}
            style={
              "bg-blue-500 hover:bg-blue-700 text-white rounded-md px-3 py-2 text-sm font-medium"
            }
          >
            Home
          </Button>
          <div>
            {!!sessionStorage.accessToken ? (
              <Button
                className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                onClick={() =>
                  setToShowDropDownMenu(
                    (prevToShowDropDownMenu) => !prevToShowDropDownMenu,
                  )
                }
              >
                <img
                  className="h-8 w-8 rounded-full"
                  src={userPhotoURL}
                  alt="userImage"
                />
              </Button>
            ) : null}
            {toShowDropDownMenu && (
              <div
                className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="user-menu-button"
                tabIndex="-1"
              >
                <Button
                  style={"block px-4 py-2 text-sm text-gray-700 mx-auto"}
                  onClick={navigateToMySketches}
                >
                  My Sketches
                </Button>
                <Button
                  style={"block px-4 py-2 text-sm text-gray-700 mx-auto"}
                  onClick={logoutUser}
                >
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
