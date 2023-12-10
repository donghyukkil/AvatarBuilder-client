import { render, screen } from "@testing-library/react";
import UnitSelectorContainer from "./index";

const mockElements = {
  head: ["head1", "head2"],
  face: ["face1", "face2"],
  body: ["body1", "body2"],
};

const mockOnElementChange = vi.fn();

const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

describe("UnitSelectorContainer", () => {
  test("should render three UnitSelector components", () => {
    render(
      <UnitSelectorContainer
        style="unit-selector-container"
        elements={mockElements}
        onElementChange={mockOnElementChange}
      />,
    );

    const titles = ["Head", "Face", "Body"];
    titles.forEach((title) => {
      const element = screen.getByText(title);
      expect(element).toBeInTheDocument();
    });
  });

  test("should confirm that .unit-selector-container class wraps three UnitSelector components", () => {
    const { container } = render(
      <UnitSelectorContainer
        style="unit-selector-container"
        elements={mockElements}
        onElementChange={mockOnElementChange}
      />,
    );

    const selectors = container.querySelectorAll(
      ".unit-selector-container > div",
    );

    expect(selectors.length).toBe(3);
  });
});
