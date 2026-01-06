'use client';

import React, { FC, useCallback } from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';

import { OrderSortBy, OrderSortOrder } from '../../types/types';
import { SORT_OPTIONS, ORDER_OPTIONS } from '../../utils/constants';
import { makeSxStyles } from '../../styles/styles';

const styles = makeSxStyles({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 2,
  },
  formControl: {
    minWidth: 120,
  },
  button: {
    minWidth: 100,
  },
});

/**
 * Props for SortControls.
 */
interface SortControlsProps {
  sortBy: OrderSortBy;
  order: OrderSortOrder;
  onChange: (sortBy: OrderSortBy, order: OrderSortOrder) => void;
}

/**
 * Sorting controls for the order list.
 */
const SortControls: FC<SortControlsProps> = ({ sortBy, order, onChange }) => {
  const handleSortChange = useCallback(
    (event: SelectChangeEvent<OrderSortBy>) => {
      onChange(event.target.value as OrderSortBy, order);
    },
    [onChange, order]
  );

  const handleOrderChange = useCallback(
    (event: SelectChangeEvent<OrderSortOrder>) => {
      onChange(sortBy, event.target.value as OrderSortOrder);
    },
    [onChange, sortBy]
  );

  return (
    <Box sx={styles.container}>
      <FormControl variant="outlined" size="small" sx={styles.formControl}>
        <InputLabel id="sort-by-label">Sort by</InputLabel>
        <Select
          labelId="sort-by-label"
          value={sortBy}
          onChange={handleSortChange}
          label="Sort by"
        >
          {SORT_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl variant="outlined" size="small" sx={styles.formControl}>
        <InputLabel id="order-label">Order</InputLabel>
        <Select
          labelId="order-label"
          value={order}
          onChange={handleOrderChange}
          label="Order"
        >
          {ORDER_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default SortControls;
