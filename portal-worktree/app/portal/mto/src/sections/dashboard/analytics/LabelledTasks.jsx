// material-ui
import CardMedia from '@mui/material/CardMedia';

// third-party
import { FormattedMessage, useIntl } from 'react-intl';
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

export default function LabelledTasks() {
  const intl = useIntl();
  return (
    <Grid size={12}>
      <MainCard sx={{ width: '100%' }}>
        <Grid container spacing={1.25}>
          <Grid size={6}>
            <Typography>
              <FormattedMessage id="dashboard.tasks.published" />
            </Typography>
          </Grid>
          <Grid size={6}>
            <LinearWithLabel value={30} color="primary" />
          </Grid>
          <Grid size={6}>
            <Typography>
              <FormattedMessage id="dashboard.tasks.completed" />
            </Typography>
          </Grid>
          <Grid size={6}>
            <LinearWithLabel value={90} color="success" />
          </Grid>
          <Grid size={6}>
            <Typography>
              <FormattedMessage id="dashboard.tasks.pending" />
            </Typography>
          </Grid>
          <Grid size={6}>
            <LinearWithLabel value={50} color="error" />
          </Grid>
          <Grid size={6}>
            <Typography>
              <FormattedMessage id="dashboard.tasks.issues" />
            </Typography>
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
                    <CardMedia component="img" alt={intl.formatMessage({ id: 'dashboard.tasks.targetAlt' })} src={Target} />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={<FormattedMessage id="dashboard.tasks.budget.title" />}
                  secondary={<FormattedMessage id="dashboard.tasks.budget.body" />}
                />
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </MainCard>
    </Grid>
  );
}
