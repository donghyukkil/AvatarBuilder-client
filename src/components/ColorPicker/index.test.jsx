import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";

import ColorPicker from "./index";
import { useState } from "react";

describe("ColorPicker Component", () => {
  test("should render color input when to Show is true", () => {
    render(
      <ColorPicker color="#ffffff" onColorChange={() => {}} toShow={true} />,
    );

    const colorInput = screen.getByTestId("colorpicker");

    expect(colorInput).toBeInTheDocument();
  });

  test("renders the correct input type and value", () => {
    render(
      <ColorPicker color="#ffffff" onColorChange={() => {}} toShow={true} />,
    );

    const input = screen.getByTestId("colorpicker");

    expect(input.type).toBe("color");
    expect(input.value).toBe("#ffffff");
  });

  test("does not render when toShow is false", () => {
    render(
      <ColorPicker color="#ffffff" onColorChange={() => {}} toShow={false} />,
    );

    const input = screen.queryByTestId("colorpicker");

    expect(input).not.toBeInTheDocument();
  });

  test("calls onColorChange when color changes", () => {
    const mockOnChange = vi.fn();

    render(
      <ColorPicker
        color="#ffffff"
        onColorChange={mockOnChange}
        toShow={true}
      />,
    );

    const input = screen.getByTestId("colorpicker");

    fireEvent.change(input, { target: { value: "#000000" } });

    expect(mockOnChange).toHaveBeenCalled();
  });

  test("calls onColorChange and updates UI when color changes", () => {
    const TestComponent = () => {
      const [color, setColor] = useState("#ffffff");

      return (
        <ColorPicker
          color={color}
          onColorChange={(e) => {
            setColor(e.target.value);
          }}
          toShow={true}
        />
      );
    };

    render(<TestComponent />);

    const input = screen.getByTestId("colorpicker");

    fireEvent.change(input, { target: { value: "#000000" } });

    expect(input.value).toBe("#000000");
  });
});
