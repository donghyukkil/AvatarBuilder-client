import { render, fireEvent } from "@testing-library/react";

import ChildCanvas from "./index";

import updateSvgData from "../../utils/updateSvgData";

vi.mock("../../utils/updateSvgData");

beforeEach(() => {
  HTMLCanvasElement.prototype.getContext = () => {
    return {
      fillStyle: vi.fn(),
      fillRect: vi.fn(),
    };
  };
});

describe("<ChildCanvas />", () => {
  const initialProps = {
    svgData: "<svg></svg>",
    width: 200,
    height: 100,
    fillColor: "red",
    elements: {
      rect: { id: "1", type: "rect" },
    },
    onElementChange: vi.fn(),
    unitType: "rect",
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("should render the canvas with the correct width and height", () => {
    const { getByTestId } = render(<ChildCanvas {...initialProps} />);

    const canvas = getByTestId("child-canvas");

    expect(canvas).toHaveAttribute("width", initialProps.width.toString());
    expect(canvas).toHaveAttribute("height", initialProps.height.toString());
  });

  test("should call updateSvgData with the correct arguments on mount", () => {
    render(<ChildCanvas {...initialProps} />);

    expect(updateSvgData).toHaveBeenCalledWith(
      initialProps.svgData,
      initialProps.fillColor,
    );
  });

  test("should call onElementChange with the correct arguments when the canvas is clicked", () => {
    const { getByTestId } = render(<ChildCanvas {...initialProps} />);
    const canvas = getByTestId("child-canvas");

    fireEvent.click(canvas);

    expect(initialProps.onElementChange).toHaveBeenCalledWith(
      initialProps.unitType,
      {
        ...initialProps.elements[initialProps.unitType],
        svgData: initialProps.svgData,
      },
    );
  });

  test("should update the canvas when the fillColor prop changes", () => {
    const { rerender } = render(<ChildCanvas {...initialProps} />);
    const newFillColor = "blue";

    rerender(<ChildCanvas {...initialProps} fillColor={newFillColor} />);

    expect(updateSvgData).toHaveBeenLastCalledWith(
      initialProps.svgData,
      newFillColor,
    );
  });
});
