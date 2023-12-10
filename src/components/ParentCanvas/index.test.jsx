import { render, screen } from "@testing-library/react";
import ParentCanvas from "./index";

describe("ParentCanvas", () => {
  beforeEach(() => {
    const ctx = {
      fillRect: vi.fn(),
      fillStyle: null,
    };
    HTMLCanvasElement.prototype.getContext = vi.fn(() => ctx);
  });

  const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

  test("should render the canvas element with specified width and height attributes", () => {
    render(<ParentCanvas width={300} height={200} />);

    const canvas = screen.getByTestId("child-canvas");

    expect(canvas).toBeInTheDocument();
    expect(canvas).toHaveAttribute("width", "300");
    expect(canvas).toHaveAttribute("height", "200");
  });

  test("should fill the canvas with white on mount", () => {
    render(<ParentCanvas width={300} height={200} />);

    const canvas = screen.getByTestId("child-canvas");
    const context = canvas.getContext("2d");

    expect(context.fillStyle).toBe("white");
    expect(context.fillRect).toHaveBeenCalledWith(0, 0, 300, 200);
  });

  test("should render children correctly", () => {
    render(
      <ParentCanvas width={300} height={200}>
        <div data-testid="child">Child</div>
      </ParentCanvas>,
    );

    const child = screen.getByTestId("child");

    expect(child).toBeInTheDocument();
    expect(child).toHaveTextContent("Child");
  });
});
