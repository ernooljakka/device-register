import TextField from '@mui/material/TextField';
import PropTypes from 'prop-types';

const Text_field = ({
  label,
  name,
  value,
  onChange,
  required = false  //If we need to indicate that field is required
}) => {


    return (
      <TextField
        label={label}
        name={name}
        value={value}
        onChange={onChange}
        variant="outlined"
        required = {required} 
      
      />
          
    );
  };
  Text_field.propTypes = {
    label: PropTypes.string.isRequired,
    name: PropTypes.string,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    required: PropTypes.bool,
  };

  
  export default Text_field;