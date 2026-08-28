import PropTypes from 'prop-types';

// material-ui
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

// third-party
import { FormattedMessage, useIntl } from 'react-intl';

// project imports
import MainCard from 'components/MainCard';
import IconButton from 'components/@extended/IconButton';
import ContentState from 'components/states/ContentState';
import CallTrendChart from './CallTrendChart';

// assets
import DownloadOutlined from '@ant-design/icons/DownloadOutlined';

// ==============================|| ANALYTICS - CALL TREND ||============================== //
//
// The page's headline chart. The comparison line under the total is the point of
// the card: a volume figure on its own cannot say whether the week went well.
//
// Range and measure are two separate controls because they answer different
// questions — "over what period" and "of what" — and folding them into one
// select forces the reader to re-pick the period to change the measure.

export default function CallTrendCard({
  title,
  total,
  delta,
  isLoss = false,
  compareLabel,
  range = 'week',
  onRangeChange,
  ranges = [],
  measure,
  onMeasureChange,
  measures = [],
  onExport,
  state = 'ready',
  errorTitle,
  errorDetail,
  onRetry,
  emptyLabel,
  ...chart
}) {
  const intl = useIntl();

  const controls = (
    <Stack direction="row" sx={{ alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
      {ranges.length > 0 && (
        <ToggleButtonGroup
          exclusive
          size="small"
          value={range}
          onChange={(event, next) => next && onRangeChange?.(next)}
          aria-label={intl.formatMessage({ id: 'analytics.trend.rangeLabel' })}
        >
          {ranges.map((item) => (
            <ToggleButton key={item.value} value={item.value}>
              {item.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      )}

      {measures.length > 0 && (
        <TextField
          select
          size="small"
          value={measure}
          onChange={(event) => onMeasureChange?.(event.target.value)}
          label={intl.formatMessage({ id: 'analytics.trend.measureLabel' })}
          sx={{ minWidth: 160 }}
        >
          {measures.map((item) => (
            <MenuItem key={item.value} value={item.value}>
              {item.label}
            </MenuItem>
          ))}
        </TextField>
      )}

      {onExport && (
        <Tooltip title={intl.formatMessage({ id: 'analytics.trend.export' })}>
          <span>
            <IconButton
              color="secondary"
              variant="light"
              onClick={onExport}
              aria-label={intl.formatMessage({ id: 'analytics.trend.export' })}
            >
              <DownloadOutlined />
            </IconButton>
          </span>
        </Tooltip>
      )}
    </Stack>
  );

  return (
    <MainCard title={title} secondary={controls} content={false}>
      <Box sx={{ p: 2.5, pb: 1 }}>
        {state === 'error' ? (
          <ContentState
            state="error"
            title={errorTitle}
            detail={errorDetail}
            actionLabel={onRetry ? <FormattedMessage id="analytics.retry" /> : undefined}
            onAction={onRetry}
          />
        ) : state === 'loading' ? (
          <ContentState state="loading" title={<FormattedMessage id="analytics.loading" />} />
        ) : (
          <>
            <Stack sx={{ gap: 0.5, mb: 1 }}>
              <Stack direction="row" sx={{ alignItems: 'baseline', gap: 1, flexWrap: 'wrap' }}>
                <Typography variant="h3">{total}</Typography>
                {delta && (
                  <Typography variant="subtitle1" sx={{ color: isLoss ? 'error.main' : 'success.main' }}>
                    {delta}
                  </Typography>
                )}
              </Stack>
              {compareLabel && (
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {compareLabel}
                </Typography>
              )}
            </Stack>
            <CallTrendChart emptyLabel={emptyLabel} {...chart} />
          </>
        )}
      </Box>
    </MainCard>
  );
}

CallTrendCard.propTypes = {
  title: PropTypes.node,
  total: PropTypes.node,
  delta: PropTypes.node,
  isLoss: PropTypes.bool,
  compareLabel: PropTypes.node,
  range: PropTypes.string,
  onRangeChange: PropTypes.func,
  ranges: PropTypes.array,
  measure: PropTypes.string,
  onMeasureChange: PropTypes.func,
  measures: PropTypes.array,
  onExport: PropTypes.func,
  state: PropTypes.oneOf(['loading', 'error', 'ready']),
  errorTitle: PropTypes.node,
  errorDetail: PropTypes.node,
  onRetry: PropTypes.func,
  emptyLabel: PropTypes.node,
  chart: PropTypes.any
};
