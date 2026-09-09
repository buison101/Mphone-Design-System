import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import ExperimentOutlined from '@ant-design/icons/ExperimentOutlined';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import MainCard from 'components/MainCard';

export default function PendingMigrationPage({ titleId }) {
  return (
    <MainCard>
      <Stack sx={{ alignItems: 'center', textAlign: 'center', py: 8, gap: 2 }}>
        <Avatar variant="rounded" sx={{ width: 56, height: 56, color: 'primary.main', bgcolor: 'primary.lighter' }}>
          <ExperimentOutlined />
        </Avatar>
        <Typography variant="h3">
          <FormattedMessage id={titleId} />
        </Typography>
        <Typography color="text.secondary" sx={{ maxWidth: 560 }}>
          <FormattedMessage id="mphoneUi.pending.description" />
        </Typography>
      </Stack>
    </MainCard>
  );
}

PendingMigrationPage.propTypes = { titleId: PropTypes.string.isRequired };
