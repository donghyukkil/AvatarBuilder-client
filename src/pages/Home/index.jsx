import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";

import Button from "../../components/Button";
import Carousel from "../../components/Carousel";
import NavBar from "../../components/NavBar";

import { CONFIG } from "../../constants/config";

const Home = () => {
  const [sketches, setSketches] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);

  const navigate = useNavigate();

  const auth = getAuth();
  const provider = new GoogleAuthProvider();

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

  const fetchSketches = async () => {
    try {
      const response = await fetch(
        `${CONFIG.BACKEND_SERVER_URL}/sketches?per_page=3&page=${currentPage}`,
      );
      const sketchesData = await response.json();

      if (sketchesData && sketchesData.sketchesUrl) {
        const sketchImageUrls = sketchesData.sketchesUrl.list.map(
          (item) => item.imageUrl,
        );

        setTotalPages(sketchesData.sketchesUrl.totalPages);
        setSketches(sketchImageUrls);
      }
    } catch (error) {
      console.error("Failed to fetch sketches:", error.message);
    }
  };

  const onPrevButtonClick = () => {
    setCurrentPage((currentPage) => currentPage - 1);
  };

  const onNextButtonClick = () => {
    setCurrentPage((currentPage) => currentPage + 1);
  };

  useEffect(() => {
    fetchSketches();
  }, [currentPage]);

  return (
    <div className="flex flex-col space-y-20">
      <NavBar />
      <div>
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 bg-zinc-100 border-2 border-blue-800 mx-56">
          <div className="sm:mx-auto sm:w-full">
            <h1 className="text-center text-4xl font-bold mt-0">
              Welcome to Hello, sketch!
            </h1>
            <h2 className="my-8 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Illustration Toolbox for Everyone
            </h2>
            <Carousel
              items={sketches}
              onPrevButtonClick={onPrevButtonClick}
              onNextButtonClick={onNextButtonClick}
              currentPage={currentPage}
              totalPages={totalPages}
            />
          </div>
          <div className="mt-2.5 sm:mx-auto sm:w-full sm:max-w-sm">
            <div>
              {!!sessionStorage.accessToken ? (
                <div className="flex flex-col">
                  <Button
                    onClick={() => {
                      navigate("/sketch/new");
                    }}
                    style={
                      "flex w-full justify-center rounded-md bg-blue-500 hover:bg-blue-700 px-3 py-2 text-md font-semibold leading-6 text-white"
                    }
                  >
                    Create Sketch
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={signInwithGoogle}
                  style={
                    "flex w-full justify-center rounded-md bg-blue-500 hover:bg-blue-700 px-3 py-2 text-md font-semibold leading-6 text-white"
                  }
                >
                  Sign in with Google
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
