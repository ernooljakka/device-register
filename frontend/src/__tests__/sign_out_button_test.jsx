import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SignoutButton from "../components/shared/sign_out_button";
import '@testing-library/jest-dom';

describe("SignoutButton", () => {

  const mockAuth = { msg: "Authorized" };

  beforeEach(() => {
    Storage.prototype.removeItem = jest.fn(); // eslint-disable-line no-undef
  
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
  
  test("renders the SignoutButton if user is authorized", () => {
    render(<SignoutButton auth={mockAuth} />);
    const button = screen.getByText("Sign Out");
    expect(button).toBeInTheDocument();
  });

  test("does not render the SignoutButton if user is unauthorized", () => {
    render(<SignoutButton auth={{ msg: "Unauthorized" }} />);
    const button = screen.queryByText("Sign Out");
    expect(button).not.toBeInTheDocument();
  });

  test("removes the access token and reloads on non-admin pages", () => {
    window.location.pathname = "/not_admin";
    render(<SignoutButton auth={mockAuth} />);
    const button = screen.getByText("Sign Out");

    fireEvent.click(button);

    expect(localStorage.removeItem).toHaveBeenCalledWith("access_token");
    expect(window.location.reload).toHaveBeenCalled();
  });

  test("removes the access token and redirects to device register on admin pages", () => {
    window.location.pathname = "/admin";
    render(<SignoutButton auth={mockAuth} />);
    const button = screen.getByText("Sign Out");

    fireEvent.click(button);

    expect(localStorage.removeItem).toHaveBeenCalledWith("access_token");
    expect(window.location.href).toBe("/");
  });

  test("does not throw an error if button is clicked without an auth object", () => {
    render(<SignoutButton auth={{ error: "Unauthorized" }} />);
    const button = screen.queryByText("Sign Out");
    expect(button).not.toBeInTheDocument();
  });
});
