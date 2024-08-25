import { useState, useRef, forwardRef, useImperativeHandle } from "react";
import ParentCanvas from "../ParentCanvas";
import CanvasUnit from "../CanvasUnit";
import { CONFIG } from "../../constants/config";

const CanvasContainer = forwardRef(({ style, elements }, ref) => {
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
      console.log("Server response:", data.sketch.imageUrl);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useImperativeHandle(ref, () => ({
    mergeCanvas,
    handleSketchSave,
  }));

  return (
    <div className={style}>
      <div className="flex justify-around my-6"></div>
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
});

export default CanvasContainer;
