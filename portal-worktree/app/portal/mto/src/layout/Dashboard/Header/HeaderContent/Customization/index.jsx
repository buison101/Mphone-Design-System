import { useMemo, useState } from 'react';

// third-party
import { FormattedMessage, useIntl } from 'react-intl';

// material-ui
import { useColorScheme } from '@mui/material/styles';
import Accordion from '@mui/material/Accordion';
import AccordionGroup from 'components/@extended/AccordionGroup';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Drawer from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import ThemeLayout from './ThemeLayout';
import DefaultThemeMode from './ThemeMode';
import ColorScheme from './ColorScheme';
import ThemeWidth from './ThemeWidth';
import ThemeFont from './ThemeFont';
import ThemeMenuDirection from './ThemeMenuDirection';

import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';
import IconButton from 'components/@extended/IconButton';
import SimpleBar from 'components/third-party/SimpleBar';

import { ThemeMode } from 'config';

// assets
import LayoutOutlined from '@ant-design/icons/LayoutOutlined';
import HighlightOutlined from '@ant-design/icons/HighlightOutlined';
import BorderInnerOutlined from '@ant-design/icons/BorderInnerOutlined';
import BgColorsOutlined from '@ant-design/icons/BgColorsOutlined';
import SettingOutlined from '@ant-design/icons/SettingOutlined';
import CloseCircleOutlined from '@ant-design/icons/CloseCircleOutlined';
import FontColorsOutlined from '@ant-design/icons/FontColorsOutlined';

// ==============================|| HEADER CONTENT - CUSTOMIZATION ||============================== //

export default function Customization() {
  const intl = useIntl();
  const { colorScheme } = useColorScheme();
  const themeLayout = useMemo(() => <ThemeLayout />, []);
  const themeMenuDirection = useMemo(() => <ThemeMenuDirection />, []);
  const themeMode = useMemo(() => <DefaultThemeMode />, []);
  const themeColor = useMemo(() => <ColorScheme />, []);
  const themeWidth = useMemo(() => <ThemeWidth />, []);
  const themeFont = useMemo(() => <ThemeFont />, []);

  const [open, setOpen] = useState(false);
  const handleToggle = () => {
    setOpen(!open);
  };

  const closeIcon = { color: colorScheme === ThemeMode.DARK ? 'text.primary' : 'background.paper' };

  return (
    <>
      <Box sx={{ flexShrink: 0 }}>
        <Tooltip title={intl.formatMessage({ id: 'header.customization.title' })}>
          <IconButton
            color="secondary"
            variant="light"
            sx={(theme) => ({
              color: 'text.primary',
              bgcolor: open ? 'grey.100' : 'transparent',
              ...theme.applyStyles('dark', { bgcolor: open ? 'background.default' : 'transparent' }),
              '& svg': {
                animation: 'spin 2s linear infinite',
                '@keyframes spin': {
                  from: { transform: 'rotate(0deg)' },
                  to: { transform: 'rotate(360deg)' }
                }
              }
            })}
            onClick={handleToggle}
            aria-label={intl.formatMessage({ id: 'header.customization.open' })}
          >
            <SettingOutlined />
          </IconButton>
        </Tooltip>
      </Box>
      <Drawer sx={{ zIndex: 2001 }} anchor="right" onClose={handleToggle} open={open} slotProps={{ paper: { sx: { width: 340 } } }}>
        {open && (
          <MainCard
            title={intl.formatMessage({ id: 'header.customization.title' })}
            sx={{
              border: 'none',
              borderRadius: 0,
              height: '100vh',
              '& .MuiCardHeader-root': { ...closeIcon, bgcolor: 'primary.main', '& .MuiTypography-root': { fontSize: '1rem' } }
            }}
            content={false}
            secondary={
              <IconButton
                color="secondary"
                shape="rounded"
                size="small"
                onClick={handleToggle}
                sx={{ ...closeIcon, '&:hover': { bgcolor: 'transparent', color: 'error.main' } }}
              >
                <CloseCircleOutlined style={{ fontSize: '1.15rem' }} />
              </IconButton>
            }
          >
            <SimpleBar sx={{ height: 'calc(100vh - 70px)', '& .simplebar-content': { display: 'flex', flexDirection: 'column' } }}>
              <AccordionGroup variant="settings">
                <Accordion defaultExpanded sx={{ borderTop: 'none' }}>
                  <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                    <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center' }}>
                      <Avatar alt="settings toggler" variant="rounded">
                        <LayoutOutlined />
                      </Avatar>
                      <Stack>
                        <Typography variant="subtitle1" sx={{ color: 'text.primary' }}>
                          <FormattedMessage id="header.customization.layout.title" />
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          <FormattedMessage id="header.customization.layout.hint" />
                        </Typography>
                      </Stack>
                    </Stack>
                  </AccordionSummary>
                  <AccordionDetails>{themeLayout}</AccordionDetails>
                </Accordion>
                <Accordion defaultExpanded>
                  <AccordionSummary aria-controls="panel4d-content" id="panel4d-header">
                    <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center' }}>
                      <Avatar alt="settings toggler" variant="rounded">
                        <BorderInnerOutlined />
                      </Avatar>
                      <Stack>
                        <Typography variant="subtitle1" sx={{ color: 'text.primary' }}>
                          <FormattedMessage id="header.customization.direction.title" />
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          <FormattedMessage id="header.customization.direction.hint" />
                        </Typography>
                      </Stack>
                    </Stack>
                  </AccordionSummary>
                  <AccordionDetails>{themeMenuDirection}</AccordionDetails>
                </Accordion>
                <Accordion defaultExpanded>
                  <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
                    <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center' }}>
                      <Avatar alt="settings toggler" variant="rounded">
                        <HighlightOutlined />
                      </Avatar>
                      <Stack>
                        <Typography variant="subtitle1" sx={{ color: 'text.primary' }}>
                          <FormattedMessage id="header.customization.mode.title" />
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          <FormattedMessage id="header.customization.mode.hint" />
                        </Typography>
                      </Stack>
                    </Stack>
                  </AccordionSummary>
                  <AccordionDetails>{themeMode}</AccordionDetails>
                </Accordion>
                <Accordion defaultExpanded>
                  <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
                    <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center' }}>
                      <Avatar alt="settings toggler" variant="rounded">
                        <BgColorsOutlined />
                      </Avatar>
                      <Stack>
                        <Typography variant="subtitle1" sx={{ color: 'text.primary' }}>
                          <FormattedMessage id="header.customization.color.title" />
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          <FormattedMessage id="header.customization.color.hint" />
                        </Typography>
                      </Stack>
                    </Stack>
                  </AccordionSummary>
                  <AccordionDetails>{themeColor}</AccordionDetails>
                </Accordion>
                <Accordion defaultExpanded>
                  <AccordionSummary aria-controls="panel4d-content" id="panel4d-header">
                    <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center' }}>
                      <Avatar alt="settings toggler" variant="rounded">
                        <BorderInnerOutlined />
                      </Avatar>
                      <Stack>
                        <Typography variant="subtitle1" sx={{ color: 'text.primary' }}>
                          <FormattedMessage id="header.customization.width.title" />
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          <FormattedMessage id="header.customization.width.hint" />
                        </Typography>
                      </Stack>
                    </Stack>
                  </AccordionSummary>
                  <AccordionDetails>{themeWidth}</AccordionDetails>
                </Accordion>
                <Accordion defaultExpanded sx={{ borderBottom: 'none' }}>
                  <AccordionSummary aria-controls="panel4d-content" id="panel4d-header">
                    <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center' }}>
                      <Avatar alt="settings toggler" variant="rounded">
                        <FontColorsOutlined />
                      </Avatar>
                      <Stack>
                        <Typography variant="subtitle1" sx={{ color: 'text.primary' }}>
                          <FormattedMessage id="header.customization.font.title" />
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          <FormattedMessage id="header.customization.font.hint" />
                        </Typography>
                      </Stack>
                    </Stack>
                  </AccordionSummary>
                  <AccordionDetails>{themeFont}</AccordionDetails>
                </Accordion>
              </AccordionGroup>
            </SimpleBar>
          </MainCard>
        )}
      </Drawer>
    </>
  );
}
