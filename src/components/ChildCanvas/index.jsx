import { useRef, useEffect } from "react";

import updateSvgData from "../../utils/updateSvgData";

import { Z_INDEX } from "../../constants";

const ChildCanvas = ({
  svgData,
  width,
  height,
  fillColor,
  elements,
  onElementChange,
  unitType,
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const img = new Image();

    const updatedSvgData = updateSvgData(svgData, fillColor);
    const encodedSvgData = encodeURIComponent(updatedSvgData);
    const dataUrl = `data:image/svg+xml;charset=utf-8,${encodedSvgData}`;

    img.onload = () => {
      context.clearRect(0, 0, width, height);
      context.drawImage(img, 0, 0, width, height);
    };

    img.src = dataUrl;
  }, [width, height, svgData, fillColor]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ position: "absolute", zIndex: Z_INDEX[unitType] }}
      onClick={() => {
        onElementChange(unitType, { ...elements[unitType], svgData });
      }}
      data-testid="child-canvas"
    />
  );
};

export default ChildCanvas;
