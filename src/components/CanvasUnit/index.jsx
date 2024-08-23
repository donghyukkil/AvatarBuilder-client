import { forwardRef, useRef, useEffect, useState } from "react";

import updateSvgData from "../../utils/updateSvgData";

import { Z_INDEX } from "../../constants";

const CanvasUnit = forwardRef((props, ref) => {
  const [startDrag, setStartDrag] = useState(null);

  const {
    svgData,
    fillColor,
    unitType,
    parentWidth,
    parentHeight,
    location,
    onChangeLocation,
  } = props;

  const handleMouseDown = (event) => {
    setStartDrag({ x: event.clientX, y: event.clientY });
  };

  const handleMouseUp = () => {
    setStartDrag(null);
  };

  const handleMouseMove = (event) => {
    if (!startDrag) {
      return;
    }

    const offsetX = event.clientX - startDrag.x;
    const offsetY = event.clientY - startDrag.y;

    onChangeLocation((prevLocation) => ({
      ...prevLocation,
      x: Math.min(
        Math.max(0, prevLocation.x + offsetX),
        parentWidth - location.width,
      ),
      y: Math.min(
        Math.max(0, prevLocation.y + offsetY),
        parentHeight - location.height,
      ),
    }));

    setStartDrag({ x: event.clientX, y: event.clientY });
  };

  const handleResize = (target, event) => {
    onChangeLocation({
      ...location,
      [target]: Math.min(Math.max(50, event.target.value), parentWidth),
    });
  };

  useEffect(() => {
    const canvas = ref.current;
    const context = canvas.getContext("2d");

    const img = new Image();

    const updatedSvgData = updateSvgData(svgData, fillColor);
    const encodedSvgData = encodeURIComponent(updatedSvgData);
    const dataUrl = `data:image/svg+xml;charset=utf-8,${encodedSvgData}`;

    img.onload = () => {
      context.clearRect(0, 0, location.width, location.height);
      context.drawImage(img, 0, 0, location.width, location.height);
    };

    img.src = dataUrl;
  }, [location.width, location.height, svgData, fillColor]);

  return (
    <>
      <div className="flex justify-center">
        <span className="px-5">
          <label>
            {unitType} width:
            <input
              type="range"
              min="50"
              max={parentWidth}
              value={location.width}
              onChange={(event) => handleResize("width", event)}
            />
          </label>
        </span>
        <span className="px-5">
          <label>
            {unitType} height:
            <input
              type="range"
              min="50"
              max={parentHeight}
              value={location.height}
              onChange={(event) => handleResize("height", event)}
            />
          </label>
        </span>
      </div>
      <div
        style={{
          position: "absolute",
          top: `${location.y}px`,
          left: `${location.x}px`,
        }}
      >
        <canvas
          data-testid="canvas"
          ref={ref}
          width={location.width}
          height={location.height}
          style={{ position: "absolute", zIndex: Z_INDEX[unitType] }}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        />
      </div>
    </>
  );
});

export default CanvasUnit;
