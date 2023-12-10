import { useEffect, useRef } from "react";

const ParentCanvas = ({ width, height, children }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);
  }, [width, height]);

  return (
    <div className="flex flex-col items-center mt-8">
      <div style={{ position: "relative" }}>
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          style={{ position: "relative", marginBottom: "20px" }}
          data-testid="child-canvas"
        />
        {children}
      </div>
    </div>
  );
};

export default ParentCanvas;
