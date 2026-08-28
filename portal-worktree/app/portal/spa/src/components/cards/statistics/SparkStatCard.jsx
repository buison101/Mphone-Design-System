import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// third-party
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';

// project imports
import MainCard from 'components/MainCard';
import getColors from 'utils/getColors';

// assets
import RiseOutlined from '@ant-design/icons/RiseOutlined';
import FallOutlined from '@ant-design/icons/FallOutlined';

// ==============================|| STATISTICS - SPARK STAT CARD ||============================== //
//
// StatCard with the shape of the number behind it. The sparkline answers the
// question a bare figure always provokes — "is that going anywhere?" — without
// spending a second card on it.
//
// The chart is decoration for the value, never the record: it carries no axis,
// no tick and no tooltip, and is hidden from assistive technology. Everything a
// screen reader needs is already in the title, the value and the delta chip.

const iconSX = {
  fontSize: '0.75rem',
  color: 'inherit',
  marginLeft: 0,
  marginRight: 0
};

export default function SparkStatCard({
  title,
  value,
  delta,
  isLoss = false,
  color = 'primary',
  data = [],
  variant = 'bar',
  caption,
  height = 72
}) {
  const theme = useTheme();
  const { main, light } = getColors(theme, color);

  // A line over a narrow range (an answer rate that never leaves the nineties)
  // would otherwise be drawn hard against the top edge of its box and read as
  // clipped. Padding the domain by a tenth of the range keeps the shape inside
  // the card without pretending the variation is bigger than it is.
  let domain;
  if (variant !== 'bar' && data.length > 0) {
    const low = Math.min(...data);
    const high = Math.max(...data);
    const pad = (high - low || Math.abs(high) || 1) * 0.15;
    domain = { min: low - pad, max: high + pad };
  }

  return (
    <MainCard contentSX={{ p: 2.25, pb: data.length ? 0 : 2.25 }}>
      <Stack sx={{ gap: 0.5 }}>
        <Typography variant="h6" sx={{ color: 'text.secondary' }}>
          {title}
        </Typography>
        <Stack direction="row" sx={{ alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
          <Typography variant="h4" sx={{ color: 'inherit' }}>
            {value}
          </Typography>
          {delta && (
            <Chip
              variant="combined"
              color={isLoss ? 'error' : color}
              icon={isLoss ? <FallOutlined style={iconSX} /> : <RiseOutlined style={iconSX} />}
              label={delta}
              size="small"
              sx={{ pl: 1 }}
            />
          )}
        </Stack>
        {caption && (
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {caption}
          </Typography>
        )}
      </Stack>

      {data.length > 0 && (
        <Box aria-hidden="true" sx={{ mt: 1.5, mx: -1 }}>
          <SparkLineChart
            data={data}
            height={height}
            plotType={variant === 'bar' ? 'bar' : 'line'}
            area={variant === 'area'}
            showHighlight={false}
            showTooltip={false}
            color={main}
            {...(domain ? { yAxis: domain } : {})}
            margin={{ top: 4, bottom: 0, left: 0, right: 0 }}
            slotProps={{ bar: { rx: 3, ry: 3 } }}
            sx={{
              '& .MuiAreaElement-root': { fill: light, opacity: 0.35 },
              '& .MuiLineElement-root': { strokeWidth: 2 }
            }}
          />
        </Box>
      )}
    </MainCard>
  );
}

SparkStatCard.propTypes = {
  title: PropTypes.node,
  value: PropTypes.node,
  delta: PropTypes.node,
  isLoss: PropTypes.bool,
  color: PropTypes.oneOf(['primary', 'secondary', 'success', 'warning', 'error', 'info']),
  data: PropTypes.arrayOf(PropTypes.number),
  variant: PropTypes.oneOf(['bar', 'line', 'area']),
  caption: PropTypes.node,
  height: PropTypes.number
};
