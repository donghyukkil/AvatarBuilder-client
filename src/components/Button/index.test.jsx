import { vi } from "vitest";

import { fireEvent, render, screen } from "@testing-library/react";

import Button from "./";

describe("Button Component", () => {
  test("should render with correct text", () => {
    const { getByText, rerender } = render(<Button>Home</Button>);

    expect(getByText("Home")).toBeInTheDocument();

    rerender(<Button>Login</Button>);

    expect(getByText("Login")).toBeInTheDocument();
  });

  test("should click events correctly", () => {
    const onClickMock = vi.fn();

    render(<Button onClick={onClickMock}>Home</Button>);

    const button = screen.getByText("Home");

    fireEvent.click(button);

    expect(onClickMock).toHaveBeenCalledTimes(1);
  });

  test("should be disabled when 'disabled' props is true", () => {
    const onClickMock = vi.fn();

    render(
      <Button onClick={onClickMock} disabled>
        Home
      </Button>,
    );

    const button = screen.getByText("Home");

    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();

    fireEvent.click(button);

    expect(onClickMock).not.toHaveBeenCalled();
  });
});
