import React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Function_button from './function_button';
const Form_container = ({children,
                          onSubmit,
                          sx = {},
                          cardSx = {},
                          childrenSx = {} }) => {

    return (
      <Box sx={{ ...defaultSx, ...sx}}>
      {/*defaultSx is overwritten by sx if that is provided*/}
        <Card sx = {{ ...defaultCardSx, ...cardSx}}>
          <CardContent>
            <form onSubmit = {onSubmit} style={{ ...defaultChildrenSx, ...childrenSx  }}>
              {children}
            </form>
          </CardContent>
        </Card>
      </Box>
    );
  };

const defaultSx = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',   
  padding: 1

}

const defaultCardSx = {
  width: '100%',
  maxWidth: 500,
  padding: 1
}

const defaultChildrenSx = {
  display: 'flex',
  flexDirection: 'column',
  gap: 50,
  width: '100%'
}

Function_button.propTypes = {
  children: PropTypes.node.isRequired, //mandatory
  onSubmit: PropTypes.func.isRequired, //mandatory
  sx: PropTypes.object,
  cardSx: PropTypes.object
}
  
export default Form_container;