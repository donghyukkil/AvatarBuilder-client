import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ParentCanvas from "../ParentCanvas";
import CanvasUnit from "../CanvasUnit";
import Button from "../Button";
import { CONFIG } from "../../constants/config";

const CanvasContainer = ({ style, elements }) => {
  const navigate = useNavigate();

  const canvasSize = {
    width: 700,
    height: 500,
  };

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

  const [selectedUnit, setSelectedUnit] = useState(null);
  const [sketchForm, setSketchForm] = useState({
    title: "",
    type: "cartoon",
    image: null,
    isPublic: true,
  });

  const handleCanvasUnitClick = (unitType) => {
    setSelectedUnit(unitType);
  };

  const handleParentCanvasClick = () => {
    setSelectedUnit(null);
  };

  // Canvas들을 병합하여 하나의 이미지로 생성
  const mergeCanvas = () => {
    const headCanvas = canvasRefs.headCanvas.current;
    const faceCanvas = canvasRefs.faceCanvas.current;
    const bodyCanvas = canvasRefs.bodyCanvas.current;

    const mergedCanvas = document.createElement("canvas");
    mergedCanvas.width = canvasSize.width;
    mergedCanvas.height = canvasSize.height;

    const mergedContext = mergedCanvas.getContext("2d");
    mergedContext.fillStyle = "white";
    mergedContext.fillRect(0, 0, mergedCanvas.width, mergedCanvas.height);

    mergedContext.drawImage(bodyCanvas, bodyUnit.x, bodyUnit.y);
    mergedContext.drawImage(headCanvas, headUnit.x, headUnit.y);
    mergedContext.drawImage(faceCanvas, faceUnit.x, faceUnit.y);

    const mergedDataURL = mergedCanvas.toDataURL("image/png");

    return mergedDataURL;
  };

  // 이미지 다운로드 기능
  const handleImageDownload = () => {
    const mergedDataURL = mergeCanvas();
    downloadImage(mergedDataURL);
  };

  // 이미지를 로컬에 다운로드하는 함수
  const downloadImage = (dataURL) => {
    const link = document.createElement("a");
    link.download = "merged_image.png";
    link.href = dataURL;
    link.click();
  };

  // Sketch를 서버에 저장하는 함수
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
      <div className="flex justify-around my-6">
        <Button
          onClick={handleImageDownload}
          style={
            "flex items-center justify-center bg-blue-500 hover:bg-blue-700 text-white rounded-md px-3 py-2 text-md"
          }
        >
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
        </Button>
      </div>
      <ParentCanvas
        width={canvasSize.width}
        height={canvasSize.height}
        onCanvasClick={handleParentCanvasClick}
      >
        <CanvasUnit
          ref={canvasRefs.headCanvas}
          location={headUnit}
          onChangeLocation={setHeadUnit}
          svgData={elements.head?.svgData}
          fillColor={elements.head?.fillColor}
          unitType={"head"}
          parentWidth={canvasSize.width}
          parentHeight={canvasSize.height}
          isSelected={selectedUnit === "head"}
          onClick={(e) => {
            e.stopPropagation();
            handleCanvasUnitClick("head");
          }}
        />
        <CanvasUnit
          ref={canvasRefs.faceCanvas}
          location={faceUnit}
          onChangeLocation={setFaceUnit}
          svgData={elements.face?.svgData}
          fillColor={elements.face?.fillColor}
          unitType={"face"}
          parentWidth={canvasSize.width}
          parentHeight={canvasSize.height}
          isSelected={selectedUnit === "face"}
          onClick={(e) => {
            e.stopPropagation();
            handleCanvasUnitClick("face");
          }}
        />
        <CanvasUnit
          ref={canvasRefs.bodyCanvas}
          location={bodyUnit}
          onChangeLocation={setBodyUnit}
          svgData={elements.body?.svgData}
          fillColor={elements.body?.fillColor}
          unitType={"body"}
          parentWidth={canvasSize.width}
          parentHeight={canvasSize.height}
          isSelected={selectedUnit === "body"}
          onClick={(e) => {
            e.stopPropagation();
            handleCanvasUnitClick("body");
          }}
        />
      </ParentCanvas>
    </div>
  );
};

export default CanvasContainer;
