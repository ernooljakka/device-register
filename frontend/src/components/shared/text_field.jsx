import TextField from '@mui/material/TextField';

const Text_field = ({
  label = 'Enter',
  value,
  onChange,
  variant = 'outlined',
  required = false
}) => {


    return (
      <TextField
        label={label}
        value={value}
        onChange={onChange}
        variant={variant}
        required = {required}
      
      />
          
    );
  };
  
  export default Text_field;