import {React, useState} from "react";
import Function_button from "./function_button";

const SignoutButton = () => {

  const [isAuthenticated] = useState(() => {
    const token = localStorage.getItem("access_token");
    return token !== null;
  });

  const handleSignout = () => {
    localStorage.removeItem("access_token");
    const isAdminView = window.location.pathname.startsWith("/admin") 
                    || window.location.pathname.startsWith("/events"); 

    if (isAdminView) {
      window.location.href = "/";
    } else {
      window.location.reload();
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: 5,
        right: 17,
      }}
    >
      <Function_button
        text="Sign Out"
        onClick={handleSignout}
        color="primary"
        variant="contained"
        size="small"
      />
    </div>
  );
};

export default SignoutButton;
