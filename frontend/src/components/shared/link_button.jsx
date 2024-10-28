import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@mui/material';

{/* Extending MUI Button to work as a link button.*/}
const Link_button = ({ href, text, icon, target = "_self", iconsx,
   variant = "contained", size = "medium", color = "primary", sx }) => {
  return (
    <Button
      component="a"
      href={href}
      target={target}
      rel="noopener noreferrer"
      startIcon={icon}
      iconsx={iconsx}
      variant={variant}
      size={size}
      color={color}
      role="button" // Ensure tests treat it as button.
      sx = {sx}
    >
      {text}
    </Button>
  );
};

Link_button.propTypes = {
  href: PropTypes.string.isRequired,
  text: PropTypes.string,
  icon: PropTypes.node,
  target: PropTypes.string,
  iconsx: PropTypes.object,
  variant: PropTypes.oneOf(["text", "outlined", "contained"]),
  size: PropTypes.oneOf(["small", "medium", "large"]),
  color: PropTypes.oneOf(
    ["primary", "secondary", "error", "info", "success", "warning"]),
  sx: PropTypes.any
};

export default Link_button;
