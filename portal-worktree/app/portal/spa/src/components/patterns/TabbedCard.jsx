import PropTypes from 'prop-types';

// material-ui
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

// project imports
import MainCard from 'components/MainCard';

// ==============================|| PATTERN - TABBED CARD ||============================== //
//
// One subject, several facets, one card. Tabs are right when the panels are
// alternative views of the same record and the reader needs only one at a time;
// they are wrong for a sequence of steps, and wrong when the reader has to
// compare two panels side by side.
//
// The tab strip scrolls rather than wraps, so a narrow screen never turns the
// header into three stacked rows and pushes the content off the fold.
//
// Only the selected panel is mounted. That keeps a table or chart in a hidden
// tab from fetching and rendering behind the reader's back — and it is why each
// panel is passed as a function rather than an element.

export default function TabbedCard({ tabs, value, onChange, ariaLabel, contentSX }) {
  const active = tabs.find((tab) => tab.value === value) ?? tabs[0];

  return (
    <MainCard content={false}>
      <Tabs
        value={active.value}
        onChange={(event, next) => onChange(next)}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        aria-label={ariaLabel}
        sx={{ px: 1.5, pt: 0.5 }}
      >
        {tabs.map((tab) => (
          <Tab
            key={tab.value}
            value={tab.value}
            label={tab.label}
            icon={tab.icon ? <tab.icon /> : undefined}
            iconPosition="start"
            id={`tab-${tab.value}`}
            aria-controls={`panel-${tab.value}`}
            sx={{ minHeight: 48 }}
          />
        ))}
      </Tabs>

      <Divider />

      <Box role="tabpanel" id={`panel-${active.value}`} aria-labelledby={`tab-${active.value}`} sx={{ p: 2.5, ...contentSX }}>
        {active.content()}
      </Box>
    </MainCard>
  );
}

TabbedCard.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.node.isRequired,
      icon: PropTypes.elementType,
      content: PropTypes.func.isRequired
    })
  ).isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  ariaLabel: PropTypes.string,
  contentSX: PropTypes.object
};
