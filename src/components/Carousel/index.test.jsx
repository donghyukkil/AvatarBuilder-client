import { screen, render, fireEvent } from "@testing-library/react";

import { describe, expect, vi, beforeEach } from "vitest";

import Carousel from "./index";

describe("Carousel", () => {
  let onPrevButtonClick;
  let onNextButtonClick;
  let items;

  beforeEach(() => {
    onPrevButtonClick = vi.fn();
    onNextButtonClick = vi.fn();

    items = ["item1", "item2", "item3"];
  });

  test("it renders without error", () => {
    const { getByTestId } = render(
      <Carousel items={[]} currentPage={1} totalPages={1} />,
    );

    expect(getByTestId("Prev")).toBeInTheDocument();
    expect(getByTestId("Next")).toBeInTheDocument();
  });

  test("it renders buttons", () => {
    const { getByTestId } = render(
      <Carousel items={[]} currentPage={1} totalPages={1} />,
    );

    expect(getByTestId("Prev")).toBeInTheDocument();
    expect(getByTestId("Next")).toBeInTheDocument();
  });

  test("it renders the carousel items", () => {
    render(<Carousel items={items} currentPage={1} totalPages={1} />);

    items.forEach((item, index) => {
      expect(screen.getByAltText(`Item ${index + 1}`)).toBeInTheDocument();
    });
  });

  test("disables the Prev button when currentPage is 1", () => {
    const { getByTestId } = render(
      <Carousel items={items} currentPage={1} totalPages={3} />,
    );

    expect(getByTestId("Prev")).toBeDisabled();
  });

  test("Next Button is disabled when currentPage is equal to totalPages", () => {
    const { getByTestId } = render(
      <Carousel items={items} currentPage={3} totalPages={3} />,
    );

    expect(getByTestId("Next")).toBeDisabled();
  });

  test("calls onPrevButtonClick when the Prev button is clicked", () => {
    render(
      <Carousel
        items={items}
        currentPage={2}
        totalPages={3}
        onPrevButtonClick={onPrevButtonClick}
        onNextButtonClick={onNextButtonClick}
      />,
    );

    fireEvent.click(screen.getByTestId("Prev"));

    expect(onPrevButtonClick).toHaveBeenCalled();
  });

  test("Both Prev and Next buttons are disabled when totalPages is 0", () => {
    const { getByTestId } = render(
      <Carousel items={items} currentPage={1} totalPages={1} />,
    );

    expect(getByTestId("Prev")).toBeDisabled();
    expect(getByTestId("Next")).toBeDisabled();
  });

  test("No items as rendered when totalPages is 0", () => {
    const { queryByAltText } = render(
      <Carousel items={items} currentPage={1} totalPages={0} />,
    );

    expect(queryByAltText("Item 1")).not.toBeInTheDocument();
    expect(queryByAltText("Item 2")).not.toBeInTheDocument();
    expect(queryByAltText("Item 3")).not.toBeInTheDocument();
  });

  test("does not print errors or warnings on render", () => {
    const consoleSpy = vi.spyOn(console, "error");

    render(<Carousel items={[]} currentPage={1} totalPages={1} />);

    expect(consoleSpy).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});
