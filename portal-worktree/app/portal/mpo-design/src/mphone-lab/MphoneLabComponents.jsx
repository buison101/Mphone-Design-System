import { useState } from 'react';
import { useIntl } from 'react-intl';

import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';

import Breadcrumbs from 'components/@extended/Breadcrumbs';
import MainCard from 'components/MainCard';

export default function MphoneLabComponents() {
  const intl = useIntl();
  const message = (id) => intl.formatMessage({ id });
  const [originalActive, setOriginalActive] = useState('one');
  const [neutralActive, setNeutralActive] = useState('one');
  const [textActive, setTextActive] = useState('three');
  const [variantActive, setVariantActive] = useState('web');

  return (
    <>
      <Breadcrumbs
        custom
        heading="mphoneLab.components.title"
        links={[{ title: 'mphoneLab.components.breadcrumb.home', to: '/mphone' }, { title: 'mphoneLab.components.title' }]}
      />
      <MainCard title={message('mphoneLab.components.toggleButton')} border={false}>
        <Stack sx={{ gap: 3 }}>
          <Stack sx={{ gap: 1, alignItems: 'flex-start' }}>
            <Typography variant="h6">{message('mphoneLab.components.original')}</Typography>
            <ToggleButtonGroup
              value={originalActive}
              exclusive
              onChange={(_event, value) => value && setOriginalActive(value)}
              aria-label={message('mphoneLab.components.outlinedGroup')}
              sx={{
                '& .MuiToggleButton-root': { minWidth: 64, px: 2, py: 0.75, fontSize: '0.875rem', lineHeight: 1.75 },
                '& .MuiToggleButton-root:hover': {
                  color: 'primary.dark',
                  bgcolor: 'primary.lighter',
                  borderColor: 'primary.main'
                },
                '& .MuiToggleButton-root.Mui-selected, & .MuiToggleButton-root.Mui-selected:hover': {
                  color: 'primary.contrastText',
                  bgcolor: 'primary.main',
                  borderColor: 'primary.main'
                }
              }}
            >
              <ToggleButton value="one">{message('mphoneLab.components.one')}</ToggleButton>
              <ToggleButton value="two">{message('mphoneLab.components.two')}</ToggleButton>
              <ToggleButton value="three">{message('mphoneLab.components.three')}</ToggleButton>
            </ToggleButtonGroup>
          </Stack>

          <Stack sx={{ gap: 1, alignItems: 'flex-start' }}>
            <Typography variant="h6">{message('mphoneLab.components.neutral')}</Typography>
            <ToggleButtonGroup
              value={neutralActive}
              exclusive
              onChange={(_event, value) => value && setNeutralActive(value)}
              color="secondary"
              aria-label={message('mphoneLab.components.neutralOutlinedGroup')}
              sx={{
                '& .MuiToggleButton-root': { minWidth: 64, px: 2, py: 0.75, fontSize: '0.875rem', lineHeight: 1.75 },
                '& .MuiToggleButton-root:hover': {
                  color: 'secondary.dark',
                  bgcolor: 'secondary.lighter',
                  borderColor: 'secondary.main'
                },
                '& .MuiToggleButton-root.Mui-selected, & .MuiToggleButton-root.Mui-selected:hover': {
                  color: 'secondary.contrastText',
                  bgcolor: 'secondary.main',
                  borderColor: 'secondary.main'
                }
              }}
            >
              <ToggleButton value="one">{message('mphoneLab.components.one')}</ToggleButton>
              <ToggleButton value="two">{message('mphoneLab.components.two')}</ToggleButton>
              <ToggleButton value="three">{message('mphoneLab.components.three')}</ToggleButton>
            </ToggleButtonGroup>
          </Stack>

          <Stack sx={{ gap: 1, alignItems: 'flex-start' }}>
            <Typography variant="h6">{message('mphoneLab.components.text')}</Typography>
            <ToggleButtonGroup
              value={textActive}
              exclusive
              onChange={(_event, value) => value && setTextActive(value)}
              aria-label={message('mphoneLab.components.textGroup')}
              sx={{ '& .MuiToggleButton-root': { minWidth: 64, px: 2, py: 0.75, fontSize: '0.875rem', lineHeight: 1.75 } }}
            >
              <ToggleButton value="one">{message('mphoneLab.components.one')}</ToggleButton>
              <ToggleButton value="two">{message('mphoneLab.components.two')}</ToggleButton>
              <ToggleButton value="three">{message('mphoneLab.components.three')}</ToggleButton>
              <ToggleButton value="four">{message('mphoneLab.components.four')}</ToggleButton>
            </ToggleButtonGroup>
          </Stack>

          <Stack sx={{ gap: 1, alignItems: 'flex-start' }}>
            <Typography variant="h6">{message('mphoneLab.components.variant')}</Typography>
            <ToggleButtonGroup
              value={variantActive}
              color="primary"
              exclusive
              onChange={(_event, value) => value && setVariantActive(value)}
              aria-label={message('mphoneLab.components.variantGroup')}
              sx={(theme) => ({
                '& .MuiToggleButton-root': {
                  minWidth: 64,
                  px: 2,
                  py: 0.75,
                  fontSize: '0.875rem',
                  lineHeight: 1.75,
                  '&:not(.Mui-selected)': { borderTopColor: 'transparent', borderBottomColor: 'transparent' },
                  '&:first-of-type': { borderLeftColor: 'transparent' },
                  '&:last-of-type': { borderRightColor: 'transparent' },
                  '&.Mui-selected': {
                    borderColor: 'inherit',
                    borderLeftColor: `${theme.vars.palette.primary.main} !important`,
                    '&:hover': { bgcolor: 'primary.lighter' }
                  },
                  '&:hover': {
                    bgcolor: 'transparent',
                    borderColor: 'primary.main',
                    borderLeftColor: `${theme.vars.palette.primary.main} !important`,
                    zIndex: 2
                  }
                }
              })}
            >
              <ToggleButton value="web">Web</ToggleButton>
              <ToggleButton value="android">Android</ToggleButton>
              <ToggleButton value="ios">iOS</ToggleButton>
              <ToggleButton value="all">All</ToggleButton>
            </ToggleButtonGroup>
          </Stack>
        </Stack>
      </MainCard>
    </>
  );
}
