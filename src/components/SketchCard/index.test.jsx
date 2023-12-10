import { render, screen, fireEvent } from "@testing-library/react";

import { describe } from "vitest";

import SketchCard from "./index";

describe("SketchCard Component", () => {
  let mockSketch;

  beforeEach(() => {
    mockSketch = {
      url: "https://example.com/image.png",
      title: "Test Sketch",
      createdAt: "2023-01-01T00:00:00Z",
      updatedAt: "2023-01-01T00:00:00Z",
    };
  });

  test("renders correctly with sketch data", () => {
    render(<SketchCard sketch={mockSketch} />);

    expect(screen.getByRole("img")).toHaveAttribute("src", mockSketch.url);
    expect(
      screen.getByText(
        `Created: ${new Date(mockSketch.createdAt).toLocaleString()}`,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        `Updated: ${new Date(mockSketch.updatedAt).toLocaleString()}`,
      ),
    ).toBeInTheDocument();
    expect(screen.getByText(/Test Sketch/)).toBeInTheDocument();
  });

  test("renders correctly without sketch data", () => {
    render(<SketchCard />);

    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  test("calls onClick when clicked", () => {
    const mockOnClick = vi.fn();

    render(<SketchCard sketch={mockSketch} onClick={mockOnClick} />);

    fireEvent.click(screen.getByRole("img"));

    expect(mockOnClick).toHaveBeenCalled();
  });
});
