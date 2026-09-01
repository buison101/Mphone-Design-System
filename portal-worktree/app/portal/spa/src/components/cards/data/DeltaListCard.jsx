import PropTypes from 'prop-types';

// material-ui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'components/MainCard';
import ContentState from 'components/states/ContentState';

// assets
import CaretDownOutlined from '@ant-design/icons/CaretDownOutlined';
import CaretUpOutlined from '@ant-design/icons/CaretUpOutlined';

// ==============================|| DATA CARDS - DELTA LIST ||============================== //
//
// Several things that each went up or down, read against each other. The
// direction is carried three times over - by the caret, by the sign in front of
// the figure, and by the colour - because this is the card most likely to be
// skimmed, and a reader who takes only the colour is the reader this list is
// most likely to mislead.
//
// The coloured figure uses the ramp's `dark` step, not `main`. Ant's
// success.main #52c41a measures 2.27:1 on white paper, which is under the bar
// for text and even for a graphical object; success.dark #237804 measures 5.58.
// The step flips with the scheme - Ant's dark ramp runs light at the top end -
// so the same token reads 9.35:1 against #1e1e1e without a second value here.

export default function DeltaListCard({ title, action, items = [], maxHeight, state, emptyTitle, emptyDetail }) {
  const empty = !items || items.length === 0;

  return (
    <MainCard title={title} secondary={action}>
      {state === 'loading' && <ContentState state="loading" title={emptyTitle} compact />}

      {state !== 'loading' && empty && <ContentState state="empty" title={emptyTitle} detail={emptyDetail} compact />}

      {state !== 'loading' && !empty && (
        <Box sx={maxHeight ? { maxHeight, overflowY: 'auto', mr: -1, pr: 1 } : undefined}>
          <Stack sx={{ gap: 2 }}>
            {items.map((item, index) => {
              const up = item.direction !== 'down';
              const tone = up ? 'success' : 'error';
              const Caret = up ? CaretUpOutlined : CaretDownOutlined;

              return (
                <Stack key={item.id ?? index} direction="row" sx={{ gap: 1.5, alignItems: 'center' }}>
                  <Box aria-hidden="true" sx={{ color: `${tone}.dark`, display: 'flex', fontSize: '0.875rem' }}>
                    <Caret />
                  </Box>
                  <Typography variant="body2" sx={{ flexGrow: 1, minWidth: 0 }}>
                    {item.label}
                  </Typography>
                  <Typography variant="subtitle2" sx={{ color: `${tone}.dark`, whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>
                    {item.value}
                  </Typography>
                </Stack>
              );
            })}
          </Stack>
        </Box>
      )}
    </MainCard>
  );
}

DeltaListCard.propTypes = {
  title: PropTypes.node,
  action: PropTypes.node,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      label: PropTypes.node,
      value: PropTypes.node,
      direction: PropTypes.oneOf(['up', 'down'])
    })
  ),
  maxHeight: PropTypes.number,
  state: PropTypes.oneOf(['loading', 'empty', 'error', 'ready']),
  emptyTitle: PropTypes.node,
  emptyDetail: PropTypes.node
};
