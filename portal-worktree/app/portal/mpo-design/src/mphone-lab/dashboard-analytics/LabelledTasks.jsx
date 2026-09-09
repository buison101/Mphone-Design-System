import PropTypes from 'prop-types';

// material-ui
import CardMedia from '@mui/material/CardMedia';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

// project imports
import Avatar from 'components/@extended/Avatar';
import LinearWithLabel from 'components/@extended/progress/LinearWithLabel';
import MainCard from 'components/MainCard';

// assets
import Target from 'assets/images/analytics/target.svg';

// ==============================|| LABELLED TASKS ||============================== //

export default function LabelledTasks({ content = {} }) {
  const labels = content.labels || ['Published Project', 'Completed Task', 'Pending Task', 'Issues'];

  return (
    <Grid size={12}>
      <MainCard border={false} sx={{ width: '100%' }}>
        <Grid container spacing={1.25}>
          <Grid size={6}>
            <Typography>{labels[0]}</Typography>
          </Grid>
          <Grid size={6}>
            <LinearWithLabel value={30} color="primary" />
          </Grid>
          <Grid size={6}>
            <Typography>{labels[1]}</Typography>
          </Grid>
          <Grid size={6}>
            <LinearWithLabel value={90} color="success" />
          </Grid>
          <Grid size={6}>
            <Typography>{labels[2]}</Typography>
          </Grid>
          <Grid size={6}>
            <LinearWithLabel value={50} color="error" />
          </Grid>
          <Grid size={6}>
            <Typography>{labels[3]}</Typography>
          </Grid>
          <Grid size={6}>
            <LinearWithLabel value={55} color="warning" />
          </Grid>
          <Grid size={12}>
            <Divider />
          </Grid>
          <Grid size={12}>
            <List sx={{ pb: 0 }}>
              <ListItem sx={{ p: 0 }}>
                <ListItemAvatar>
                  <Avatar sx={{ background: 'transparent' }}>
                    <CardMedia component="img" alt={content.imageAlt || 'target'} src={Target} />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={content.title || 'Income Salaries & Budget'}
                  secondary={content.description || 'All your income salaries and budget comes here, you can track them or manage them'}
                />
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </MainCard>
    </Grid>
  );
}

LabelledTasks.propTypes = { content: PropTypes.object };
