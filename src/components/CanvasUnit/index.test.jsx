import { render, fireEvent, waitFor } from "@testing-library/react";

import CanvasUnit from "./index";

const mockProps = {
  svgData: '<svg><circle cx="50" cy="50" r="40" /></svg>',
  fillColor: "red",
  unitType: "SampleUnit",
  parentWidth: 500,
  parentHeight: 500,
  location: {
    x: 0,
    y: 0,
    width: 100,
    height: 100,
  },
  onChangeLocation: vi.fn(),
};

const mockRef = {
  current: {
    getContext: vi.fn().mockReturnValue({
      clearRect: vi.fn(),
      drawImage: vi.fn(),
    }),
  },
};

HTMLCanvasElement.prototype.getContext = vi.fn();

describe("CanvasUnit", () => {
  test("should initialize with the correct size", () => {
    const { getByTestId } = render(<CanvasUnit ref={mockRef} {...mockProps} />);
    const canvas = getByTestId("canvas");

    expect(canvas).toBeInTheDocument();
    expect(canvas).toHaveAttribute("width", `${mockProps.location.width}`);
    expect(canvas).toHaveAttribute("height", `${mockProps.location.height}`);
  });

  test("should render a canvas and interact with mouse events", async () => {
    const { getByTestId } = render(<CanvasUnit ref={mockRef} {...mockProps} />);
    const canvas = getByTestId("canvas");

    expect(canvas).toBeInTheDocument();

    fireEvent.mouseDown(canvas, { clientX: 0, clientY: 0 });

    fireEvent.mouseMove(canvas, { clientX: 10, clientY: 10 });

    await waitFor(() => expect(mockProps.onChangeLocation).toHaveBeenCalled());

    fireEvent.mouseUp(canvas);
  });

  test("should resize canvas on range input change", async () => {
    const { getByLabelText } = render(
      <CanvasUnit ref={mockRef} {...mockProps} />,
    );

    const widthSlider = getByLabelText(`${mockProps.unitType} width:`);

    fireEvent.change(widthSlider, { target: { value: 200 } });

    await waitFor(() =>
      expect(mockProps.onChangeLocation).toHaveBeenCalledWith({
        ...mockProps.location,
        width: 200,
      }),
    );

    const heightSlider = getByLabelText(`${mockProps.unitType} height:`);

    fireEvent.change(heightSlider, { target: { value: 200 } });

    await waitFor(() =>
      expect(mockProps.onChangeLocation).toHaveBeenCalledWith({
        ...mockProps.location,
        height: 200,
      }),
    );
  });
});
