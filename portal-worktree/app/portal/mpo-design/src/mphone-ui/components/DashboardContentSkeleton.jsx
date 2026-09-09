import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

import MainCard from 'components/MainCard';

export default function DashboardContentSkeleton() {
  return (
    <Stack aria-busy="true" sx={{ gap: 2.5 }}>
      <Stack direction={{ xs: 'column', md: 'row' }} sx={{ justifyContent: 'space-between', gap: 2 }}>
        <Box sx={{ width: { xs: 1, md: 420 } }}>
          <Skeleton variant="text" width="42%" height={42} />
          <Skeleton variant="text" width="100%" />
        </Box>
        <Skeleton variant="rounded" width={320} height={40} />
      </Stack>
      <Grid container spacing={2.5}>
        {[0, 1, 2, 3].map((item) => (
          <Grid key={item} size={{ xs: 12, sm: 6, lg: 3 }}>
            <MainCard>
              <Skeleton variant="text" width="58%" />
              <Skeleton variant="text" width="34%" height={52} />
              <Skeleton variant="text" width="46%" />
            </MainCard>
          </Grid>
        ))}
      </Grid>
      <MainCard>
        <Skeleton variant="text" width={180} height={32} />
        {[0, 1, 2, 3].map((item) => (
          <Skeleton key={item} variant="rounded" height={38} sx={{ mt: 1 }} />
        ))}
      </MainCard>
    </Stack>
  );
}
