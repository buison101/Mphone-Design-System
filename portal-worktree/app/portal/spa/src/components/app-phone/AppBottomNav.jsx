import PropTypes from 'prop-types';

// material-ui
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Badge from '@mui/material/Badge';
import Divider from '@mui/material/Divider';

// ==============================|| APP PHONE - BOTTOM NAVIGATION ||============================== //
//
// Five destinations. The app's own audit flags six as a risk at narrow widths
// with Vietnamese labels and large type, and it is right: five is what fits with
// a 48dp touch target and no truncation.
//
// Labels always show. Icon-only navigation saves a row of pixels and costs every
// first-time user the meaning of the row.

export default function AppBottomNav({ items = [], value, onChange }) {
  return (
    <>
      <Divider />
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, next) => onChange?.(next)}
        sx={{ flexShrink: 0, height: 64, bgcolor: 'background.paper' }}
      >
        {items.map((item) => (
          <BottomNavigationAction
            key={item.value}
            value={item.value}
            label={item.label}
            icon={
              item.badge ? (
                <Badge color="error" badgeContent={item.badge}>
                  <item.icon />
                </Badge>
              ) : (
                <item.icon />
              )
            }
            sx={{ minWidth: 0, px: 0.5, '& .MuiBottomNavigationAction-label': { fontSize: 11 } }}
          />
        ))}
      </BottomNavigation>
    </>
  );
}

AppBottomNav.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.node,
      icon: PropTypes.elementType,
      badge: PropTypes.number
    })
  ),
  value: PropTypes.string,
  onChange: PropTypes.func
};
