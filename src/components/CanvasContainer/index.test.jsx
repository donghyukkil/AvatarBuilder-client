import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, vi } from "vitest";

import CanvasContainer from "./index";

vi.mock("react-router-dom", () => ({
  useNavigate: vi.fn(),
}));

beforeEach(() => {
  HTMLCanvasElement.prototype.getContext = () => {
    return {
      fillStyle: vi.fn(),
      fillRect: vi.fn(),
    };
  };
});

describe("CanvasContainer Component", () => {
  const mockStyle = "";
  const mockElements = {
    head: { svgData: "<svg></svg>", fillColor: "red" },
    face: { svgData: "<svg></svg>", fillColor: "blue" },
    body: { svgData: "<svg></svg>", fillColor: "yellow" },
  };

  beforeEach(() => {
    render(<CanvasContainer style={mockStyle} elements={mockElements} />);
  });

  test("should render expected child components and elements", () => {
    expect(screen.getByPlaceholderText("Title")).toBeInTheDocument();
    expect(screen.getByText("Public")).toBeInTheDocument();
  });

  test("should change title in input field", () => {
    const input = screen.getByPlaceholderText("Title");

    fireEvent.change(input, { target: { value: "New Title" } });

    expect(input.value).toBe("New Title");
  });

  test("should toggle between public and private", async () => {
    const publicText = screen.getByText(/Public/i);

    expect(publicText).toBeInTheDocument();

    const toggleButton = screen.getByTestId(/toggleButton/i);
    fireEvent.click(toggleButton);
    const privateText = await screen.findByText(/Private/i);

    expect(privateText).toBeInTheDocument();
  });
});
