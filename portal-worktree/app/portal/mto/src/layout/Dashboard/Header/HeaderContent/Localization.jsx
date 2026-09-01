import { useRef, useState } from 'react';

// third-party
import { FormattedMessage, useIntl } from 'react-intl';

// material-ui
import useMediaQuery from '@mui/material/useMediaQuery';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import IconButton from 'components/@extended/IconButton';
import Transitions from 'components/@extended/Transitions';

import useConfig from 'hooks/useConfig';

// assets
import TranslationOutlined from '@ant-design/icons/TranslationOutlined';

// The Portal ships two complete languages. Neither is a fallback for the other,
// so the switcher lists exactly what the catalogs cover.
const LANGUAGES = [
  { code: 'vi', name: 'Tiếng Việt', label: 'header.language.vi' },
  { code: 'en', name: 'English', label: 'header.language.en' }
];

// ==============================|| HEADER CONTENT - LOCALIZATION ||============================== //

export default function Localization() {
  const downMD = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const intl = useIntl();

  const { state, setField } = useConfig();

  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const handleListItemClick = (lang) => {
    setField('i18n', lang);
    setOpen(false);
  };

  return (
    <Box sx={{ flexShrink: 0 }}>
      <Tooltip title={intl.formatMessage({ id: 'header.language.label' })} disableInteractive>
        <IconButton
          color="secondary"
          variant="light"
          sx={(theme) => ({
            color: 'text.primary',
            bgcolor: open ? 'grey.100' : 'transparent',
            ...theme.applyStyles('dark', { bgcolor: open ? 'background.default' : 'transparent' })
          })}
          aria-label={intl.formatMessage({ id: 'header.language.label' })}
          ref={anchorRef}
          aria-controls={open ? 'localization-grow' : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
        >
          <TranslationOutlined />
        </IconButton>
      </Tooltip>
      <Popper
        placement={downMD ? 'bottom-start' : 'bottom'}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{ modifiers: [{ name: 'offset', options: { offset: [downMD ? 0 : 0, 9] } }] }}
      >
        {({ TransitionProps }) => (
          <Transitions type="grow" position={downMD ? 'top-right' : 'top'} in={open} {...TransitionProps}>
            <Paper sx={(theme) => ({ boxShadow: theme.vars.customShadows.z1 })}>
              <ClickAwayListener onClickAway={handleClose}>
                <List
                  component="nav"
                  sx={{
                    p: 0,
                    width: '100%',
                    minWidth: 200,
                    maxWidth: { xs: 250, md: 290 },
                    bgcolor: 'background.paper',
                    borderRadius: 0.5
                  }}
                >
                  {LANGUAGES.map((language) => (
                    <ListItemButton
                      key={language.code}
                      selected={state.i18n === language.code}
                      onClick={() => handleListItemClick(language.code)}
                    >
                      <ListItemText
                        primary={
                          <Grid container>
                            <Typography sx={{ color: 'text.primary' }}>{language.name}</Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary', ml: '8px' }}>
                              <FormattedMessage id={language.label} />
                            </Typography>
                          </Grid>
                        }
                      />
                    </ListItemButton>
                  ))}
                </List>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </Box>
  );
}
