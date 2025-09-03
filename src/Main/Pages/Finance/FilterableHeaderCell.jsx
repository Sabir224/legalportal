import { alpha, Box, IconButton, TableCell } from '@mui/material';
import { FilterList } from '@mui/icons-material';
import { styled } from '@mui/system';

const lightTheme = {
  background: '#f8f9fa',
  accentColor: '#d4af37',
  textPrimary: '#2c3e50',
  textSecondary: '#7f8c8d',
  cardBackground: '#ffffff',
  tableHeaderBg: alpha('#d4af37', 0.08),
  borderColor: '#e9ecef',
};

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: `1px solid ${alpha('#d4af37', 0.1)}`,
  backgroundColor: lightTheme.textPrimary, // background set to textPrimary
  color: lightTheme.background, // optional: make text readable on dark background
}));

export default function FilterableHeaderCell({ label, minWidth = 120, isActive = false, onClick }) {
  return (
    <StyledTableCell sx={{ whiteSpace: 'nowrap', minWidth }}>
      <Box display="flex" alignItems="center">
        {label}
        <IconButton
          size="small"
          sx={{
            color: isActive ? lightTheme.accentColor : '#fff',
            ml: 0.5,
            p: 0.5,
          }}
          onClick={onClick}
        >
          <FilterList fontSize="small" />
        </IconButton>
      </Box>
    </StyledTableCell>
  );
}
