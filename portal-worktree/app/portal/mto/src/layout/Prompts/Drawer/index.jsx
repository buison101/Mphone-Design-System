import PropTypes from 'prop-types';

// third-party
import { useIntl } from 'react-intl';
import { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// material-ui
import useMediaQuery from '@mui/material/useMediaQuery';
import Chip from '@mui/material/Chip';
import MuiDrawer from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

// project imports
import DrawerContent from './DrawerContent';
import MainCard from 'components/MainCard';
import { DRAWER_WIDTH } from 'config';

// assets
import SearchOutlined from '@ant-design/icons/SearchOutlined';

// ==============================|| PROMPTS DRAWER ||============================== //

export default function PromptsDrawer({ open, onClose }) {
  const intl = useIntl();
  const downMD = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { filter } = useParams();

  const [search, setSearch] = useState('');

  const filterType = useMemo(() => {
    if (filter === 'free' || filter === 'pro') {
      return filter;
    }
    return 'all';
  }, [filter]);

  const handleSearchValue = (event) => {
    setSearch(event.target.value);
  };

  const handleFilterChange = (newFilter) => {
    if (newFilter === 'all') {
      navigate('/prompts-overview');
    } else {
      navigate(`/prompts-overview/${newFilter}`);
    }
  };

  const isOpen = downMD ? open : true;

  return (
    <MuiDrawer
      sx={{
        display: { xs: 'block' },
        width: DRAWER_WIDTH,
        flexShrink: 0,
        position: { xs: 'fixed', md: 'sticky' },
        top: { xs: 0, md: 84, xl: 90 },
        height: { xs: 'auto', md: 'calc(100vh - 140px)', xl: 'calc(100vh - 176px)' }
      }}
      variant={downMD ? 'temporary' : 'persistent'}
      anchor="left"
      open={isOpen}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      slotProps={{ paper: { sx: { position: 'relative', border: 'none' } } }}
    >
      <MainCard sx={{ height: '100%' }} content={false}>
        <Box sx={{ p: 2 }}>
          <Stack direction="row" sx={{ gap: 1, mb: 2 }}>
            <Chip
              label={intl.formatMessage({ id: 'prompts.filter.all' })}
              onClick={() => handleFilterChange('all')}
              variant={filterType === 'all' ? 'filled' : 'outlined'}
              size="small"
              sx={{
                cursor: 'pointer',
                flex: 1,
                justifyContent: 'center',
                backgroundColor: filterType === 'all' ? 'primary.main' : 'transparent',
                color: filterType === 'all' ? 'primary.contrastText' : 'text.primary'
              }}
            />
            <Chip
              label={intl.formatMessage({ id: 'prompts.filter.free' })}
              onClick={() => handleFilterChange('free')}
              variant={filterType === 'free' ? 'filled' : 'outlined'}
              size="small"
              sx={{
                cursor: 'pointer',
                flex: 1,
                justifyContent: 'center',
                backgroundColor: filterType === 'free' ? 'success.main' : 'transparent',
                color: filterType === 'free' ? 'success.contrastText' : 'text.primary'
              }}
            />
            <Chip
              label={intl.formatMessage({ id: 'prompts.filter.pro' })}
              onClick={() => handleFilterChange('pro')}
              variant={filterType === 'pro' ? 'filled' : 'outlined'}
              size="small"
              sx={{
                cursor: 'pointer',
                flex: 1,
                justifyContent: 'center',
                backgroundColor: filterType === 'pro' ? 'warning.main' : 'transparent',
                color: filterType === 'pro' ? 'warning.contrastText' : 'text.primary'
              }}
            />
          </Stack>
          <TextField
            fullWidth
            sx={(theme) => ({
              borderRadius: '4px',
              bgcolor: 'background.paper',
              boxShadow: theme.vars.customShadows.primary,
              border: '1px solid',
              borderColor: 'primary.main'
            })}
            slotProps={{
              input: { startAdornment: <SearchOutlined />, placeholder: 'Search prompts', type: 'search' }
            }}
            value={search}
            onChange={handleSearchValue}
          />
        </Box>
        <DrawerContent search={search} filterType={filterType} />
      </MainCard>
    </MuiDrawer>
  );
}

PromptsDrawer.propTypes = { open: PropTypes.bool, onClose: PropTypes.func };
