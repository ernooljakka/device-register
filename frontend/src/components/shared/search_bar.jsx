import React from 'react';
import { OutlinedInput, InputAdornment } from '@mui/material';
import { FormControl, InputLabel } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PropTypes from 'prop-types';

const Search_bar = ({
    quickFilterText,
    setQuickFilterText,
    }) => {
        const handleQuickFilterChange = (e) => {
        const newQuickFilterText = e.target.value;
        setQuickFilterText(newQuickFilterText);
    };

    return (
      <FormControl sx={{ mb: 0.4 }} fullWidth size="small">
        <InputLabel htmlFor="search_bar">Search</InputLabel>
        <OutlinedInput
          id="search_bar"
          label="Search"
          value={quickFilterText}
          onChange={handleQuickFilterChange}
          endAdornment={
            <InputAdornment position="end">
              <SearchIcon color="primary" />
            </InputAdornment>
          }
        />
      </FormControl>
  );
};

Search_bar.propTypes = {
  quickFilterText: PropTypes.any.isRequired, // Allow any type for quickFilterText
  setQuickFilterText: PropTypes.any.isRequired, // Allow any type for setQuickFilterText
};

export default Search_bar;
