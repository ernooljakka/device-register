import React from "react";
import PropTypes from "prop-types";
import Function_button from "./function_button";

const SignoutButton = ({ auth }) => {

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

  if (!auth || auth.msg !== "Authorized") return null;

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

SignoutButton.propTypes = {
  auth: PropTypes.shape({
    msg: PropTypes.string.isRequired,
  }).isRequired,
};

export default SignoutButton;
