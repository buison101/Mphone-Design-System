import { useRef, useState } from 'react';

// material-ui
import Box from '@mui/material/Box';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Tooltip from '@mui/material/Tooltip';

// third-party
import { FormattedMessage, useIntl } from 'react-intl';

// project imports
import IconButton from 'components/@extended/IconButton';
import MainCard from 'components/MainCard';
import Transitions from 'components/@extended/Transitions';
import useConfig from 'hooks/useConfig';

// assets
import ColumnWidthOutlined from '@ant-design/icons/ColumnWidthOutlined';
import CompressOutlined from '@ant-design/icons/CompressOutlined';
import ExpandOutlined from '@ant-design/icons/ExpandOutlined';

const OPTIONS = [
  { value: 'fluid', labelId: 'header.layout.fluid', icon: <ExpandOutlined /> },
  { value: 'container', labelId: 'header.layout.container', icon: <CompressOutlined /> }
];

// ==============================|| HEADER CONTENT - LAYOUT WIDTH ||============================== //

export default function LayoutWidthToggle() {
  const { state, setField } = useConfig();
  const intl = useIntl();
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const layoutWidth = state.layoutWidth || 'fluid';

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) return;
    setOpen(false);
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <Tooltip title={intl.formatMessage({ id: 'header.layout.label' })} disableInteractive>
        <IconButton
          ref={anchorRef}
          color="secondary"
          variant="light"
          aria-label={intl.formatMessage({ id: 'header.layout.label' })}
          aria-haspopup="true"
          aria-expanded={open}
          onClick={() => setOpen((previous) => !previous)}
          sx={{ color: 'text.primary' }}
        >
          <ColumnWidthOutlined />
        </IconButton>
      </Tooltip>
      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        transition
        disablePortal
        popperOptions={{ modifiers: [{ name: 'offset', options: { offset: [0, 9] } }] }}
      >
        {({ TransitionProps }) => (
          <Transitions type="grow" position="top-right" in={open} {...TransitionProps}>
            <Paper sx={(theme) => ({ boxShadow: theme.vars.customShadows.z1, minWidth: 190 })}>
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard elevation={0} border={false} content={false}>
                  <List sx={{ p: 0.5, '& .MuiListItemButton-root': { borderRadius: 1, py: 1 } }}>
                    {OPTIONS.map((option) => (
                      <ListItemButton
                        key={option.value}
                        selected={layoutWidth === option.value}
                        onClick={() => {
                          setField('layoutWidth', option.value);
                          setOpen(false);
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 32 }}>{option.icon}</ListItemIcon>
                        <ListItemText primary={<FormattedMessage id={option.labelId} />} />
                      </ListItemButton>
                    ))}
                  </List>
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </Box>
  );
}
