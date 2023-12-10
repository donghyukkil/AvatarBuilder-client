import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from "@testing-library/react";

import { describe, vi } from "vitest";

import UnitSelector from "./";

vi.mock("../../utils/getSvgDataArray");

describe("UnitSelector", () => {
  let fakeProps;

  beforeEach(() => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ units: { list: [], totalPages: 1 } }),
      }),
    );

    fakeProps = {
      elements: {
        example: {
          fillColor: "#FFFFFF",
        },
      },
      onElementChange: vi.fn(),
      unitType: "example",
      title: "Test title",
    };
  });

  test("should render the UnitSelector component and displays the provided title", () => {
    render(<UnitSelector {...fakeProps} />);

    expect(screen.getByText("Test title")).toBeInTheDocument();
  });

  test("should invoke onElementChange when the colorpicker value changes", async () => {
    render(<UnitSelector {...fakeProps} />);

    fireEvent.change(screen.getByTestId("colorpicker"), {
      target: { value: "#000000" },
    });

    expect(fakeProps.onElementChange).toHaveBeenCalledTimes(1);
  });

  test("should reflect user input by changing the color value in the UI", async () => {
    const props = {
      elements: { unitType: { fillColor: "#000000" } },
      onElementChange: fakeProps.onElementChange,
    };

    const { getByTestId, rerender } = render(<UnitSelector {...props} />);

    const colorPicker = getByTestId("colorpicker");

    fireEvent.change(colorPicker, { target: { value: "#ff0000" } });

    expect(fakeProps.onElementChange).toHaveBeenCalled();

    const changedElement = fakeProps.onElementChange.mock.calls[0][1];

    const newProps = {
      ...props,
      elements: { unitType: { fillColor: changedElement } },
    };

    rerender(<UnitSelector {...newProps} />);

    await waitFor(() => {
      expect(colorPicker.value).toBe("#ff0000");
    });
  });

  test("should handle fetch success correctly in fetchUnits", async () => {
    render(
      <UnitSelector
        elements={{}}
        onElementChange={() => {}}
        unitType="someType"
        title="Some Title"
      />,
    );

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("units?unitType=someType"),
    );
  });

  test("should handle fetch error correctly in fetchUnits", async () => {
    global.fetch = vi.fn(() => Promise.reject(new Error("fetch error")));

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(<UnitSelector {...fakeProps} />);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(consoleSpy).toHaveBeenCalledWith("Error");

    consoleSpy.mockRestore();
  });
});
