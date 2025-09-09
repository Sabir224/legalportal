import {
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  FormGroup,
  FormControlLabel,
  Checkbox,
  alpha,
} from '@mui/material';

const lightTheme = {
  background: '#f8f9fa',
  accentColor: '#d4af37',
  textPrimary: '#2c3e50',
  textSecondary: '#7f8c8d',
  cardBackground: '#ffffff',
  tableHeaderBg: alpha('#d4af37', 0.08),
  borderColor: '#e9ecef',
};

export default function FilterSection({
  title,
  filterKey,
  filterData,
  searchTerm,
  onSearchChange,
  onSelectAll,
  onClearAll,
  onToggle,
  selectedValues,
  isCurrentFilter,
  getLabel = (v) => v, // default label renderer
}) {
  // Helper to handle object vs string
  const getValueKey = (val) => (val && typeof val === 'object' && val._id ? val._id : val);

  // Separate available and unavailable options
  const availableOptions = filterData.filter((item) => item.available);
  const unavailableOptions = filterData.filter((item) => !item.available);
  // Utility function
  const normalize = (str, type = 'text') => {
    if (!str) return '';

    if (type === 'phone') {
      // keep only digits
      return str.replace(/\D/g, '');
    }

    // for text
    return str
      .normalize('NFD') // split accents (é → e +  ́)
      .replace(/[\u0300-\u036f]/g, '') // remove diacritics
      .toLocaleLowerCase()
      .replace(/[-_]/g, ' ') // treat - and _ as spaces
      .replace(/\s+/g, ' ') // collapse multiple spaces
      .trim();
  };

  return (
    <>
      <Typography variant="subtitle2" gutterBottom sx={{ color: '#d4af37', fontWeight: 600, mb: 2 }}>
        {title} Filter
      </Typography>

      {/* Search Input */}
      <TextField
        size="small"
        placeholder={`Search ${filterKey}...`}
        value={searchTerm}
        onChange={(e) => onSearchChange(filterKey, e.target.value)}
        sx={{
          width: '100%',
          mb: 2,
          '& .MuiInputBase-root': { background: '#f9fafb' },
          '& .MuiOutlinedInput-notchedOutline': { borderColor: '#d1d5db' },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#d4af37' },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#d4af37' },
        }}
      />

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <Button
          size="small"
          variant="outlined"
          onClick={() => onSelectAll(availableOptions.map((item) => getValueKey(item.value)))}
          sx={{
            fontSize: '0.75rem',
            textTransform: 'none',
            borderColor: '#d4af37',
            color: '#d4af37',
            '&:hover': { borderColor: '#b8941f', backgroundColor: '#fef3c7' },
          }}
        >
          Select All Available
        </Button>
        <Button
          size="small"
          variant="outlined"
          onClick={onClearAll}
          sx={{
            fontSize: '0.75rem',
            textTransform: 'none',
            borderColor: '#9ca3af',
            color: '#9ca3af',
            '&:hover': { borderColor: '#6b7280', backgroundColor: '#f3f4f6' },
          }}
        >
          Clear All
        </Button>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Options */}
      <FormGroup sx={{ maxHeight: '200px', overflowY: 'auto' }}>
        {[...availableOptions, ...(isCurrentFilter ? unavailableOptions : [])]
          .filter((item) => {
            const rawLabel = getLabel(item.value) || '';
            const label = normalize(rawLabel, 'text');
            const search = normalize(searchTerm, /^\d+$/.test(searchTerm) ? 'phone' : 'text');

            // Debug log
            console.log('DEBUG FILTER:', {
              rawLabel,
              normalizedLabel: label,
              rawSearch: searchTerm,
              normalizedSearch: search,
            });

            return search === '' || label.includes(search);
          })

          .map((item) => {
            const valueKey = getValueKey(item.value);
            return (
              <FormControlLabel
                key={valueKey}
                control={
                  <Checkbox
                    checked={item.selected}
                    onChange={() => onToggle(valueKey)}
                    sx={{
                      color: item.selected ? '#d4af37' : '#9ca3af',
                      '&.Mui-checked': { color: '#d4af37' },
                      opacity: item.available ? 1 : item.selected ? 1 : 0.5,
                    }}
                  />
                }
                label={
                  <Typography
                    sx={{
                      color: item.selected ? '#374151' : '#9ca3af',
                      fontSize: '0.9rem',
                      fontWeight: item.selected ? 600 : 400,
                      opacity: item.available ? 1 : item.selected ? 1 : 0.6,
                      fontStyle: item.available ? 'normal' : item.selected ? 'normal' : 'italic',
                    }}
                  >
                    {(() => {
                      const raw = getLabel(item.value) || '';
                      return raw.charAt(0).toUpperCase() + raw.slice(1);
                    })()}
                    {!item.available && !item.selected && isCurrentFilter && (
                      <Typography component="span" sx={{ fontSize: '0.75rem', color: '#9ca3af', ml: 1 }}>
                        (no results)
                      </Typography>
                    )}
                  </Typography>
                }
              />
            );
          })}
      </FormGroup>
    </>
  );
}
