import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { BsDownload, BsToggleOn, BsToggleOff } from "react-icons/bs";

import ParentCanvas from "../ParentCanvas";
import CanvasUnit from "../CanvasUnit";
import Button from "../Button";

import { CONFIG } from "../../constants/config";

const CanvasContainer = ({ style, elements }) => {
  const navigate = useNavigate();

  const canvasRefs = {
    headCanvas: useRef(null),
    faceCanvas: useRef(null),
    bodyCanvas: useRef(null),
  };

  const [headUnit, setHeadUnit] = useState({
    width: 200,
    height: 200,
    y: 150,
    x: 250,
  });

  const [faceUnit, setFaceUnit] = useState({
    width: 150,
    height: 90,
    y: 250,
    x: 275,
  });

  const [bodyUnit, setBodyUnit] = useState({
    width: 200,
    height: 200,
    y: 325,
    x: 250,
  });

  const [sketchForm, setSketchForm] = useState({
    title: "",
    type: "cartoon",
    image: null,
    isPublic: true,
  });

  const mergeCanvas = () => {
    const headCanvas = canvasRefs.headCanvas.current;
    const faceCanvas = canvasRefs.faceCanvas.current;
    const bodyCanvas = canvasRefs.bodyCanvas.current;

    const mergedCanvas = document.createElement("canvas");
    mergedCanvas.width = 700;
    mergedCanvas.height = 700;

    const mergedContext = mergedCanvas.getContext("2d");
    mergedContext.fillStyle = "white";
    mergedContext.fillRect(0, 0, mergedCanvas.width, mergedCanvas.height);

    mergedContext.drawImage(bodyCanvas, bodyUnit.x, bodyUnit.y);
    mergedContext.drawImage(headCanvas, headUnit.x, headUnit.y);
    mergedContext.drawImage(faceCanvas, faceUnit.x, faceUnit.y);

    const mergedDataURL = mergedCanvas.toDataURL("image/png");

    return mergedDataURL;
  };

  const handleImageDownload = () => {
    const mergedDataURL = mergeCanvas();
    downloadImage(mergedDataURL);
  };

  const downloadImage = (dataURL) => {
    const link = document.createElement("a");
    link.download = "merged_image.png";
    link.href = dataURL;
    link.click();
  };

  const handleSketchSave = async () => {
    const mergedDataURL = mergeCanvas();

    const requestBody = {
      title: sketchForm.title,
      image: mergedDataURL,
      isPublic: sketchForm.isPublic,
      type: sketchForm.type,
    };

    const userId = sessionStorage.getItem("userEmail");

    try {
      const response = await fetch(
        `${CONFIG.BACKEND_SERVER_URL}/users/${userId}/sketches`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(requestBody),
        },
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      navigate("/my-sketches");

      console.log("Server response:", data.sketch.imageUrl);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  return (
    <div className={style}>
      {/* <div className="flex justify-center">
        <input
          className="placeholder:text-slate-400 w-3/5 block bg-white border border-slate-300 rounded-md py-2 pl-9 pr-3 sm:text-sm"
          placeholder="Title"
          type="text"
          name="title"
          value={sketchForm.title}
          onChange={(event) =>
            setSketchForm({ ...sketchForm, title: event.target.value })
          }
        />
      </div> */}
      <div className="flex justify-around my-6">
        {/* <div className="flex items-center">
          {sketchForm.isPublic ? "Public" : "Private"}
          <Button
            onClick={() => {
              setSketchForm({ ...sketchForm, isPublic: !sketchForm.isPublic });
            }}
            data-testid="toggleButton"
          >
            {sketchForm.isPublic ? (
              <BsToggleOn size={25} />
            ) : (
              <BsToggleOff size={25} />
            )}
          </Button>
          &nbsp;&nbsp;&nbsp;&nbsp;
        </div>
        <Button
          onClick={handleImageDownload}
          style={
            "flex items-center justify-center bg-blue-500 hover:bg-blue-700 text-white rounded-md px-3 py-2 text-md"
          }
        >
          <BsDownload className="mr-2" />
          Download
        </Button>
        <Button
          onClick={handleSketchSave}
          style={`
                  flex items-center
                  justify-center bg-blue-500
                  hover:bg-blue-700
                  text-white
                  rounded-md
                  px-3 py-2
                  text-md`}
        >
          Save
        </Button> */}
      </div>
      <ParentCanvas width={700} height={500}>
        <CanvasUnit
          ref={canvasRefs.headCanvas}
          location={headUnit}
          onChangeLocation={setHeadUnit}
          svgData={elements.head?.svgData}
          fillColor={elements.head?.fillColor}
          unitType={"head"}
          parentWidth={700}
          parentHeight={700}
        />
        <CanvasUnit
          ref={canvasRefs.faceCanvas}
          location={faceUnit}
          onChangeLocation={setFaceUnit}
          svgData={elements.face?.svgData}
          fillColor={elements.face?.fillColor}
          unitType={"face"}
          parentWidth={700}
          parentHeight={700}
        />
        <CanvasUnit
          ref={canvasRefs.bodyCanvas}
          location={bodyUnit}
          onChangeLocation={setBodyUnit}
          svgData={elements.body?.svgData}
          fillColor={elements.body?.fillColor}
          unitType={"body"}
          parentWidth={700}
          parentHeight={700}
        />
      </ParentCanvas>
    </div>
  );
};

export default CanvasContainer;
