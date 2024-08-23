import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  signOut,
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";

import { CONFIG } from "../../constants/config";
import Button from "../Button";
import UploadIcon from "../../assets/upload-01.svg";
import DownloadIcon from "../../assets/download.svg";
import ProfileIcon from "../../assets/profile.svg";

const NavBar = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const provider = new GoogleAuthProvider();
  const [toShowDropDownMenu, setToShowDropDownMenu] = useState(false);
  const dropdownRef = useRef(null);

  const navigateToMySketches = () => {
    setToShowDropDownMenu(false);
    navigate("/my-sketches");
  };

  const signInwithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (user) {
        const token = await user.getIdToken();

        sessionStorage.setItem("accessToken", token);
        sessionStorage.setItem("userPhotoURL", user.photoURL);
        sessionStorage.setItem("userEmail", user.email);

        const fetchData = async () => {
          try {
            const response = await fetch(`${CONFIG.BACKEND_SERVER_URL}/login`, {
              method: "POST",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ email: user.email }),
            });

            if (response.ok) {
              navigate("/");
            } else {
              throw new Error("요청이 실패했습니다");
            }
          } catch (error) {
            console.log("Error");
          }
        };

        await fetchData();
      }
    } catch (error) {
      console.error("Error");
    }
  };

  const logoutUser = async () => {
    try {
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

  const userPhotoURL = sessionStorage.getItem("userPhotoURL") || ProfileIcon;
  const email = sessionStorage.getItem("userEmail");
  const username = email ? email.split("@")[0] : "";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setToShowDropDownMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div
      className="bg-[#2c2c2c] flex items-center justify-between px-20"
      style={{ height: "8%" }}
    >
      <span
        className="text-white text-xl font-bold"
        style={{
          fontFamily: "Jua, sans-serif",
          lineHeight: "2",
        }}
      >
        GenAvatar
      </span>
      <div className="flex justify-around items-center w-1/3">
        <Button>
          <img
            src={DownloadIcon}
            alt="Download Icon"
            className="w-8 h-8 mr-2"
          />
        </Button>
        <Button>
          <img src={UploadIcon} alt="Upload Icon" className="w-10 h-10 mr-2" />
        </Button>
        <div className="relative" ref={dropdownRef}>
          <Button
            className="flex rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800"
            onClick={() =>
              setToShowDropDownMenu(
                (prevToShowDropDownMenu) => !prevToShowDropDownMenu,
              )
            }
          >
            <img
              className="w-8 h-8 rounded-full"
              src={userPhotoURL}
              alt="userImage"
            />
          </Button>
          {toShowDropDownMenu && (
            <div
              className="absolute w-56 rounded-lg bg-[#333] text-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
              style={{ zIndex: 1000, top: "4rem", right: "-6rem" }}
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="user-menu-button"
              tabIndex="-1"
            >
              <div
                className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[8px] border-b-[#333]"
                style={{ zIndex: 1001 }}
              />
              <div className="px-4 py-2">
                <img
                  className="w-8 h-8 rounded-full inline-block mr-3"
                  src={userPhotoURL}
                  alt="userImage"
                />
                <span>{username}</span>
                <span className="text-gray-400 block text-sm">You</span>
              </div>
              <div className="py-1">
                <Button
                  className="block px-4 py-2 text-sm text-white rounded-lg hover:bg-blue-700 w-full text-left"
                  onClick={navigateToMySketches}
                >
                  My Avartars
                </Button>
              </div>
              <div className="py-1">
                <Button
                  className="block px-4 py-2 text-sm text-white hover:bg-gray-800 w-full text-left"
                  onClick={signInwithGoogle}
                >
                  Login
                </Button>
              </div>
              <div className="py-1">
                <Button
                  className="block px-4 py-2 text-sm text-white hover:bg-gray-800 w-full text-left"
                  onClick={logoutUser}
                >
                  Logout
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
