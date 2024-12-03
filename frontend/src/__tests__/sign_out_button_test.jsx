import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SignoutButton from "../components/shared/sign_out_button";
import "@testing-library/jest-dom";

describe("SignoutButton", () => {
  beforeEach(() => {
    Storage.prototype.getItem = jest.fn();  // eslint-disable-line no-undef
    Storage.prototype.removeItem = jest.fn();  // eslint-disable-line no-undef

    delete window.location;
    window.location = {
      href: "",
      pathname: "/admin",
      reload: jest.fn(),
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("renders the SignoutButton if access token exists", () => {
    localStorage.getItem.mockReturnValue("fake_token"); 
    render(<SignoutButton />);
    const button = screen.getByText("Sign Out");
    expect(button).toBeInTheDocument();
  });

  test("does not render the SignoutButton if no access token exists", () => {
    localStorage.getItem.mockReturnValue(null); 
    render(<SignoutButton />);
    const button = screen.queryByText("Sign Out");
    expect(button).not.toBeInTheDocument();
  });

  test("removes the access token and reloads on non-admin pages", () => {
    localStorage.getItem.mockReturnValue("fake_token");
    window.location.pathname = "/not_admin";
    render(<SignoutButton />);
    const button = screen.getByText("Sign Out");

    fireEvent.click(button);

    expect(localStorage.removeItem).toHaveBeenCalledWith("access_token");
    expect(window.location.reload).toHaveBeenCalled();
  });

  test("removes the access token and redirects to home on admin pages", () => {
    localStorage.getItem.mockReturnValue("fake_token");
    window.location.pathname = "/admin";
    render(<SignoutButton />);
    const button = screen.getByText("Sign Out");

    fireEvent.click(button);

    expect(localStorage.removeItem).toHaveBeenCalledWith("access_token");
    expect(window.location.href).toBe("/");
  });

  test("does not render if there is no access token and ensures no errors occur", () => {
    localStorage.getItem.mockReturnValue(null);
    render(<SignoutButton />);
    const button = screen.queryByText("Sign Out");
    expect(button).not.toBeInTheDocument();
  });
});
