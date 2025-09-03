// import React from 'react';

// import { FilterList } from '@mui/icons-material';
// import { Checkbox, FormControlLabel, IconButton, Popover } from '@mui/material';
// import { Button } from 'react-bootstrap';

// export function ColumnFilter({ label, options, selectedValues, onChange, onClear }) {
//   const [anchorEl, setAnchorEl] = React.useState(null);

//   const handleOpen = (event) => setAnchorEl(event.currentTarget);
//   const handleClose = () => setAnchorEl(null);
//   const open = Boolean(anchorEl);

//   const handleToggle = (value) => {
//     if (selectedValues.includes(value)) {
//       onChange(selectedValues.filter((v) => v !== value));
//     } else {
//       onChange([...selectedValues, value]);
//     }
//   };

//   return (
//     <>
//       <Box display="flex" alignItems="center" gap={1}>
//         {label}
//         <IconButton size="small" onClick={handleOpen}>
//           <FilterList fontSize="small" />
//         </IconButton>
//         {selectedValues.length > 0 && (
//           <Button size="small" onClick={onClear}>
//             Clear
//           </Button>
//         )}
//       </Box>

//       <Popover
//         open={open}
//         anchorEl={anchorEl}
//         onClose={handleClose}
//         anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
//       >
//         <Box sx={{ p: 2, maxHeight: 250, overflowY: 'auto' }}>
//           {options.map((opt) => (
//             <FormControlLabel
//               key={opt}
//               control={<Checkbox checked={selectedValues.includes(opt)} onChange={() => handleToggle(opt)} />}
//               label={opt}
//             />
//           ))}
//         </Box>
//       </Popover>
//     </>
//   );
// }
