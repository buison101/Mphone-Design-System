import PropTypes from 'prop-types';

// material-ui
import { useTheme, useColorScheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// third-party
import { axisClasses, barClasses } from '@mui/x-charts';
import { BarChart } from '@mui/x-charts/BarChart';

// project imports
import MainCard from 'components/MainCard';
import ContentState from 'components/states/ContentState';
import { seriesColors } from 'utils/chartSeries';

// ==============================|| ANALYTICS - CHANNEL MIX ||============================== //
//
// Where the calls came in, stacked so each column reads as one day's total and
// the segments as its composition. Stacking is right here and wrong on the cost
// card: this question is about the mix inside a total, not about which stream
// is bigger.
//
// The three channel colours come from the shared chart palette rather than the
// theme's semantic ramp — success/warning/error carry meaning about outcome, and
// a route is not an outcome.

export default function ChannelMixCard({
  title,
  action,
  labels = [],
  channels = [],
  highlights = [],
  state = 'ready',
  emptyTitle,
  height = 220
}) {
  const theme = useTheme();
  const { mode, systemMode } = useColorScheme();
  const palette = seriesColors(mode, systemMode);
  const tones = [palette.answered, palette.mobile, palette.internal];

  return (
    <MainCard title={title} secondary={action} content={false}>
      {state === 'loading' && <ContentState state="loading" title={emptyTitle} compact />}

      {state !== 'loading' && labels.length === 0 && <ContentState state="empty" title={emptyTitle} compact />}

      {state !== 'loading' && labels.length > 0 && (
        <>
          <Box sx={{ px: 1, pt: 1 }}>
            <BarChart
              height={height}
              xAxis={[
                {
                  data: labels,
                  scaleType: 'band',
                  disableLine: true,
                  tickSize: 7,
                  categoryGapRatio: 0.45,
                  tickLabelStyle: { fontSize: 11 }
                }
              ]}
              yAxis={[{ position: 'none' }]}
              series={channels.map((channel, index) => ({
                id: channel.id,
                data: channel.data,
                label: channel.label,
                stack: 'channels',
                color: channel.color || tones[index % tones.length]
              }))}
              slotProps={{
                bar: { rx: 3, ry: 3 },
                legend: {
                  direction: 'horizontal',
                  position: { vertical: 'bottom', horizontal: 'center' },
                  labelStyle: { fontSize: 12, fill: theme.vars.palette.text.secondary }
                }
              }}
              axisHighlight={{ x: 'none' }}
              margin={{ top: 12, left: 8, bottom: 8, right: 8 }}
              sx={{
                [`& .${barClasses.element}:hover`]: { opacity: 0.7 },
                [`& .${axisClasses.root} .${axisClasses.tick}`]: { stroke: 'transparent' },
                [`& .${axisClasses.tickLabel}`]: { fill: theme.vars.palette.text.secondary }
              }}
            />
          </Box>

          {highlights.length > 0 && (
            <>
              <Divider />
              <List sx={{ p: 0, '& .MuiListItem-root': { py: 1.5, px: 2.5 } }}>
                {highlights.map((item, index) => {
                  const Icon = item.icon;
                  const tone = item.color || 'primary';
                  return (
                    <ListItem
                      key={item.id ?? index}
                      divider={index < highlights.length - 1}
                      secondaryAction={
                        <Stack sx={{ alignItems: 'flex-end' }}>
                          <Typography variant="subtitle1" noWrap>
                            {item.value}
                          </Typography>
                          {item.meta && (
                            <Typography variant="caption" sx={{ color: 'text.secondary' }} noWrap>
                              {item.meta}
                            </Typography>
                          )}
                        </Stack>
                      }
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ width: 36, height: 36, color: `${tone}.main`, bgcolor: `${tone}.lighter` }}>
                          {Icon ? <Icon /> : null}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={<Typography variant="subtitle1">{item.primary}</Typography>}
                        secondary={item.secondary}
                        slotProps={{ secondary: { variant: 'caption', color: 'text.secondary' } }}
                      />
                    </ListItem>
                  );
                })}
              </List>
            </>
          )}
        </>
      )}
    </MainCard>
  );
}

ChannelMixCard.propTypes = {
  title: PropTypes.node,
  action: PropTypes.node,
  labels: PropTypes.array,
  channels: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      label: PropTypes.string,
      data: PropTypes.array,
      color: PropTypes.string
    })
  ),
  highlights: PropTypes.array,
  state: PropTypes.oneOf(['loading', 'empty', 'error', 'ready']),
  emptyTitle: PropTypes.node,
  height: PropTypes.number
};
