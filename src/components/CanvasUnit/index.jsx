import { forwardRef, useRef, useEffect, useState } from "react";
import updateSvgData from "../../utils/updateSvgData";
import { Z_INDEX } from "../../constants";

const CanvasUnit = forwardRef((props, ref) => {
  const [startDrag, setStartDrag] = useState(null);
  const [resizing, setResizing] = useState(false);
  const resizeDirection = useRef(null);

  const {
    svgData,
    fillColor,
    unitType,
    parentWidth,
    parentHeight,
    location,
    onChangeLocation,
    isSelected,
    onClick,
  } = props;

  const handleMouseDown = (event) => {
    onClick(event);
    const rect = ref.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // 클릭이 크기 조절을 위해 가장자리 근처에 있는지 확인.
    const edgeThreshold = 10;
    const onLeftEdge = x <= edgeThreshold;
    const onRightEdge = x >= location.width - edgeThreshold;
    const onTopEdge = y <= edgeThreshold;
    const onBottomEdge = y >= location.height - edgeThreshold;

    if (onLeftEdge || onRightEdge || onTopEdge || onBottomEdge) {
      setResizing(true);
      resizeDirection.current = {
        onLeftEdge,
        onRightEdge,
        onTopEdge,
        onBottomEdge,
      };
      setStartDrag({ x: event.clientX, y: event.clientY });
    } else {
      setStartDrag({ x: event.clientX, y: event.clientY });
    }
  };

  const handleMouseUp = () => {
    setStartDrag(null);
    setResizing(false);
    resizeDirection.current = null;
  };

  const handleMouseMove = (event) => {
    if (startDrag && isSelected) {
      const offsetX = event.clientX - startDrag.x;
      const offsetY = event.clientY - startDrag.y;

      if (resizing && resizeDirection.current) {
        onChangeLocation((prevLocation) => {
          let newWidth = prevLocation.width;
          let newHeight = prevLocation.height;
          let newX = prevLocation.x;
          let newY = prevLocation.y;

          if (resizeDirection.current.onRightEdge) {
            newWidth = Math.max(50, prevLocation.width + offsetX);
          } else if (resizeDirection.current.onLeftEdge) {
            newWidth = Math.max(50, prevLocation.width - offsetX);
            newX = prevLocation.x + offsetX;
          }

          if (resizeDirection.current.onBottomEdge) {
            newHeight = Math.max(50, prevLocation.height + offsetY);
          } else if (resizeDirection.current.onTopEdge) {
            newHeight = Math.max(50, prevLocation.height - offsetY);
            newY = prevLocation.y + offsetY;
          }

          // CanvasUnit이 부모 경계 내에 있도록 보장.
          if (newX < 0) {
            newWidth += newX;
            newX = 0;
          }
          if (newY < 0) {
            newHeight += newY;
            newY = 0;
          }
          if (newX + newWidth > parentWidth) {
            newWidth = parentWidth - newX;
          }
          if (newY + newHeight > parentHeight) {
            newHeight = parentHeight - newY;
          }

          return {
            ...prevLocation,
            width: newWidth,
            height: newHeight,
            x: newX,
            y: newY,
          };
        });
      } else {
        onChangeLocation((prevLocation) => ({
          ...prevLocation,
          x: Math.min(
            Math.max(0, prevLocation.x + offsetX),
            parentWidth - prevLocation.width,
          ),
          y: Math.min(
            Math.max(0, prevLocation.y + offsetY),
            parentHeight - prevLocation.height,
          ),
        }));
      }
      setStartDrag({ x: event.clientX, y: event.clientY });
    }
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

      if (isSelected) {
        context.strokeStyle = "red";
        context.lineWidth = 2;
        context.strokeRect(0, 0, location.width, location.height);
      }
    };

    img.src = dataUrl;
  }, [location.width, location.height, svgData, fillColor, isSelected]);

  return (
    <div
      style={{
        position: "absolute",
        top: `${location.y}px`,
        left: `${location.x}px`,
        width: location.width,
        height: location.height,
        cursor: resizing ? "nwse-resize" : "move", // 크기 조절 중인지 확인하여 커서 변경
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <canvas
        data-testid="canvas"
        ref={ref}
        width={location.width}
        height={location.height}
        style={{ position: "absolute", zIndex: Z_INDEX[unitType] }}
      />
    </div>
  );
});

export default CanvasUnit;
