import PropTypes from 'prop-types';

// material-ui
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'components/MainCard';

// ==============================|| PAGE VIEWS BY PAGE TITLE ||============================== //

const defaultRows = [
  { title: 'Admin Home', detail: '/demo/admin/index.html', value: '7755', change: '31.74% (-100.00%)' },
  { title: 'Form Elements', detail: '/demo/admin/forms.html', value: '5215', change: '28.53% (-100.00%)' },
  { title: 'Utilities', detail: '/demo/admin/util.html', value: '4848', change: '25.35% (-100.00%)' },
  { title: 'Form Validation', detail: '/demo/admin/validation.html', value: '3275', change: '23.17% (-100.00%)' },
  { title: 'Modals', detail: '/demo/admin/modals.html', value: '3003', change: '22.21% (-100.00%)' }
];

export default function PageViews({ content = {} }) {
  const rows = content.rows || defaultRows;

  return (
    <>
      <Typography variant="h5">{content.title || 'Page Views by Page Title'}</Typography>

      <MainCard border={false} sx={{ mt: 2 }} content={false}>
        <List sx={{ p: 0, '& .MuiListItemButton-root': { py: 2 } }}>
          {rows.map((row, index) => (
            <ListItemButton key={row.title} divider={index < rows.length - 1}>
              <ListItemText
                primary={row.title}
                secondary={row.detail}
                slotProps={{
                  primary: { variant: 'subtitle1' },
                  secondary: { variant: 'body1', sx: { display: 'inline', color: 'text.secondary' } }
                }}
              />
              <Stack sx={{ alignItems: 'flex-end' }}>
                <Typography variant="h5" sx={{ color: 'primary.main' }}>
                  {row.value}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', display: 'block' }}>
                  {row.change}
                </Typography>
              </Stack>
            </ListItemButton>
          ))}
        </List>
      </MainCard>
    </>
  );
}

PageViews.propTypes = { content: PropTypes.object };
