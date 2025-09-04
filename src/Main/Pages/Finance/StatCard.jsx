import { CardContent, Typography, Box, Card } from '@mui/material';
import { alpha, styled } from '@mui/system';
const ElegantCard = styled(Card)(({ theme }) => ({
  background: '#ffffff',
  borderRadius: 12,
  border: `1px solid ${alpha('#d4af37', 0.3)}`,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  color: '#2c3e50',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
  },
}));
const lightTheme = {
  background: '#f8f9fa',
  accentColor: '#d4af37',
  textPrimary: '#2c3e50',
  textSecondary: '#7f8c8d',
  cardBackground: '#ffffff',
  tableHeaderBg: alpha('#d4af37', 0.08),
  borderColor: '#e9ecef',
};

const filterInputSx = {
  color: lightTheme.textPrimary,
  backgroundColor: '#ffffff',
  borderRadius: 2,
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: alpha(lightTheme.accentColor, 0.3),
    borderWidth: 1,
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: lightTheme.accentColor,
    borderWidth: 1,
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: lightTheme.accentColor,
    borderWidth: 1,
    boxShadow: `0 0 0 2px ${alpha(lightTheme.accentColor, 0.1)}`,
  },
  '& .MuiSvgIcon-root': {
    color: lightTheme.accentColor,
  },
};
const StatCard = ({ title, value, subtitle, icon: Icon, isCurrency = false }) => {
  return (
    <ElegantCard>
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography
            variant="body2"
            sx={{
              color: lightTheme.textSecondary,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              fontSize: { xs: '0.7rem', sm: '0.75rem' },
            }}
          >
            {title}
          </Typography>
          <Icon
            sx={{
              color: lightTheme.accentColor,
              fontSize: { xs: 24, sm: 28 },
            }}
          />
        </Box>

        <Typography
          variant="h4"
          component="div"
          fontWeight="bold"
          sx={{
            color: lightTheme.textPrimary,
            mb: 1,
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
          }}
        >
          {isCurrency ? `$${value.toLocaleString()}` : value}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: lightTheme.textSecondary,
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
          }}
        >
          {subtitle}
        </Typography>
      </CardContent>
    </ElegantCard>
  );
};

export default StatCard;
