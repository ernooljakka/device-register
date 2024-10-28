import React from 'react';
import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
const Form_container = ({children,
                          onSubmit,
                          sx = {},
                          childrenSx = {} }) => {

    return (
      <Card sx = {{ ...defaultSx, ...sx}}>
      {/*defaultCardSx is overwritten by sx if that is provided*/}
        <CardContent>
          <form onSubmit = {onSubmit} style={{ ...defaultChildrenSx, ...childrenSx  }}>
            {children}
          </form>
        </CardContent>
      </Card>
    );
  };



const defaultSx = {
  maxWidth: 500,
  padding: 1
}

const defaultChildrenSx = {
  display: 'flex',
  flexDirection: 'column',
  gap: 50
}

Form_container.propTypes = {
  children: PropTypes.node.isRequired, //mandatory
  onSubmit: PropTypes.func,
  sx: PropTypes.object,
  childrenSx: PropTypes.object
}
  
export default Form_container;