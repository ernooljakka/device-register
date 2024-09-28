import Button from '@mui/material/Button';
import PropTypes from 'prop-types';

const Function_button = ({
  text=' ',
  variant='contained',
  onClick,
  size = 'medium',
  color,
  startIcon, //if icons are needed
  endIcon,
}) => {
  

  return (
    <Button
      variant={variant}
      onClick={onClick}
      size = {size}
      color={color}
      startIcon={startIcon}
      endIcon={endIcon}
    >
      {text}
    </Button>
  );
};

Function_button.propTypes = {
  text: PropTypes.string.isRequired, //mandatory
  onClick: PropTypes.func.isRequired, //mandatory
  variant: PropTypes.oneOf(["text", "outlined", "contained"]),
  size: PropTypes.oneOf(["small", "medium", "large"]),
  color: PropTypes.oneOf(
    ["primary", "secondary", "error", "info", "success", "warning"]),
  startIcon: PropTypes.node,
  endIcon: PropTypes.node
};

export default Function_button;