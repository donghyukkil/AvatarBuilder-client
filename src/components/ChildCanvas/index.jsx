import { useRef, useEffect } from "react";
import updateSvgData from "../../utils/updateSvgData";
import { Z_INDEX } from "../../constants";

const ChildCanvas = ({
  svgData,
  fillColor,
  elements,
  onElementChange,
  unitType,
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const updateCanvasSize = () => {
      const parent = canvas.parentElement;
      const parentWidth = parent.clientWidth;
      const parentHeight = parent.clientHeight;

      canvas.width = parentWidth;
      canvas.height = parentHeight;

      const img = new Image();

      const updatedSvgData = updateSvgData(svgData, fillColor);
      const encodedSvgData = encodeURIComponent(updatedSvgData);
      const dataUrl = `data:image/svg+xml;charset=utf-8,${encodedSvgData}`;

      img.onload = () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, 0, 0, canvas.width, canvas.height);
      };

      img.src = dataUrl;
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    // cleanup
    return () => {
      window.removeEventListener("resize", updateCanvasSize);
    };
  }, [svgData, fillColor]);

  return (
    <div
      style={{
        position: "absolute",
        width: "7%",
        height: "10%",
        padding: "20px", // 패딩 적용
        boxSizing: "border-box", // 패딩을 포함하여 크기 계산
        backgroundColor: "#e4e7eb",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          zIndex: Z_INDEX[unitType],
          width: "100%", // 부모 요소의 크기에 맞춤
          height: "100%", // 부모 요소의 크기에 맞춤
        }}
        onClick={() => {
          onElementChange(unitType, { ...elements[unitType], svgData });
        }}
        data-testid="child-canvas"
      />
    </div>
  );
};

export default ChildCanvas;
