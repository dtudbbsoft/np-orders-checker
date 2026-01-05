import { SxProps, Theme } from '@mui/material';

/**
 * Utility function to create reusable styles for Material-UI components.
 * @param styles - An object containing style definitions.
 * @returns The styles object.
 */
export const makeSxStyles = <T extends Record<string, SxProps<Theme>>>(styles: T): T => styles;
