import { useState, useEffect } from "react";

import { BsDownload } from "react-icons/bs";

import NavBar from "../../components/NavBar";
import SketchCard from "../../components/SketchCard";
import Button from "../../components/Button";

import { CONFIG } from "../../constants/config";

const MySketches = () => {
  const [sketches, setSketches] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState("");

  const userId = sessionStorage.getItem("userEmail");

  const onImageClick = (imageUrl) => {
    setModalImageUrl(imageUrl);
    setModalOpen(true);
  };

  const onPrevButtonClick = () => {
    setCurrentPage((currentPage) => currentPage - 1);
  };

  const onNextButtonClick = () => {
    setCurrentPage((currentPage) => currentPage + 1);
  };

  const fetchSketches = async () => {
    try {
      const response = await fetch(
        `${CONFIG.BACKEND_SERVER_URL}/users/${userId}/sketches?per_page=6&page=${currentPage}`,
      );
      const sketchesData = await response.json();

      setTotalPages(sketchesData.sketches.totalPages);
      setSketches(sketchesData.sketches.list);
    } catch (error) {
      console.error("Failed to fetch sketches", error.message);
    }
  };

  const handleImageDownload = async (s3Url) => {
    try {
      const response = await fetch(s3Url);
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "downloaded_file.png";

      link.click();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading the file:", error);
    }
  };

  useEffect(() => {
    fetchSketches();
  }, [currentPage]);

  return (
    <div className="h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow grid grid-cols-3 grid-rows-2 gap-4 p-4">
        {sketches.length !== 0
          ? sketches.map((sketch) => (
              <SketchCard
                key={sketch.url}
                sketch={sketch}
                onClick={() => onImageClick(sketch.url)}
              />
            ))
          : null}
      </main>
      {isModalOpen && (
        <div
          className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-70"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-white p-4 rounded flex flex-col items-center"
            onClick={(event) => event.stopPropagation()}
          >
            <img src={modalImageUrl} alt="Sketch" />
            <div className="flex mt-4">
              <Button
                style={
                  "flex items-center mr-20 rounded-md bg-blue-500 hover:bg-blue-700 px-3 py-2 text-md font-semibold text-white mb-10"
                }
                onClick={() => handleImageDownload(modalImageUrl)}
              >
                <BsDownload className="mr-2" />
                Download
              </Button>
              <Button
                style={
                  "rounded-md bg-gray-500 hover:bg-gray-700 px-5 py-2 text-md font-semibold text-white mb-10"
                }
                onClick={() => setModalOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* <nav className="flex justify-center">
        <ul className="list-style-none flex">
          <li>
            <Button
              style={
                "relative block rounded bg-transparent px-3 py-1.5 text-sm text-neutral-500 transition-all duration-300 dark:text-neutral-400"
              }
              onClick={onPrevButtonClick}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
          </li>
          {[...Array(totalPages).keys()].map((pageNumber) => (
            <li key={pageNumber} aria-current={pageNumber + 1 === currentPage}>
              <Button
                style={`relative block rounded bg-transparent px-3 py-1.5 text-sm transition-all duration-300 dark:text-neutral-400 ${
                  pageNumber + 1 === currentPage
                    ? "text-neutral-700 shadow-lg"
                    : "text-neutral-500"
                }`}
                onClick={() => setCurrentPage(pageNumber + 1)}
              >
                {pageNumber + 1}
              </Button>
            </li>
          ))}
          <li>
            <Button
              style={
                "relative block rounded bg-transparent px-3 py-1.5 text-sm text-neutral-500 transition-all duration-300 dark:text-neutral-400"
              }
              onClick={onNextButtonClick}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </li>
        </ul>
      </nav> */}
    </div>
  );
};

export default MySketches;
