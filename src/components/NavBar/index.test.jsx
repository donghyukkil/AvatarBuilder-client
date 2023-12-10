import { render, fireEvent, screen, waitFor } from "@testing-library/react";

import { describe, expect, vi } from "vitest";

import NavBar from "./index";

import { signOut } from "firebase/auth";

window.alert = vi.fn();

vi.mock("firebase/auth", () => ({
  getAuth: vi.fn(() => ({})),
  signOut: vi.fn(() => Promise.resolve("Mock sign out")),
}));

const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  ...vi.importActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

beforeEach(() => {
  sessionStorage.setItem("accessToken", "mocked_access_token");
  window.sessionStorage.setItem("userPhotoURL", "url");
});

afterEach(() => {
  sessionStorage.clear();
});

const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

describe("<NavBar />", () => {
  test("should display the dropdown menu after clicking the user avatar", () => {
    render(<NavBar />);

    const userAvatarButton = screen.getByAltText("userImage");
    fireEvent.click(userAvatarButton);

    const dropdownMenu = screen.getByRole("menu");
    expect(dropdownMenu).toBeVisible();

    fireEvent.click(userAvatarButton);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  test("should not render dropdown buttons when there is no 'sessionStorage.accessToken'", () => {
    const { queryByText } = render(<NavBar />);

    expect(queryByText("My Sketches")).toBeNull();
  });

  test("should logout and clear session storage when logout is clicked", async () => {
    const { getByAltText, getByText } = render(<NavBar />);

    const userImage = getByAltText("userImage");
    fireEvent.click(userImage);

    const logoutButton = getByText("Logout");
    fireEvent.click(logoutButton);

    await waitFor(() => expect(signOut).toHaveBeenCalled());

    await waitFor(() => {
      expect(window.sessionStorage.getItem("accessToken")).toBeNull();
    });
  });

  test("should navigate to the '/my-sketches' page when 'My Sketches' button is clicked", () => {
    const { getByAltText, getByText } = render(<NavBar />);

    const userImageButton = getByAltText("userImage");
    fireEvent.click(userImageButton);

    const mySketchesButton = getByText("My Sketches");
    fireEvent.click(mySketchesButton);

    expect(mockNavigate).toHaveBeenCalledWith("/my-sketches");

    expect(screen.queryByText("My Sketches")).not.toBeInTheDocument();
  });
});
