import { useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// third-party
import { useIntl } from 'react-intl';

// project imports
import navigation from 'menu-items/navigation';

// assets
import SearchOutlined from '@ant-design/icons/SearchOutlined';

function collectSearchOptions(items, intl, trail = [], inheritedIcon = null) {
  return items.flatMap((item) => {
    const label = item.title ? intl.formatMessage({ id: item.title, defaultMessage: item.title }) : null;
    const nextTrail = label ? [...trail, label] : trail;
    const Icon = item.icon || inheritedIcon;

    if (item.url) {
      return {
        id: item.id,
        url: item.url,
        label,
        group: trail.join(' / ') || intl.formatMessage({ id: 'app.brand' }),
        Icon
      };
    }

    return collectSearchOptions(item.children || [], intl, nextTrail, Icon);
  });
}

// ==============================|| HEADER CONTENT - PORTAL SEARCH ||============================== //

export default function HeaderSearch() {
  const intl = useIntl();
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const options = useMemo(() => collectSearchOptions(navigation, intl), [intl]);

  useEffect(() => {
    const focusSearch = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', focusSearch);
    return () => window.removeEventListener('keydown', focusSearch);
  }, []);

  return (
    <Box sx={{ display: { xs: 'none', md: 'block' }, width: { md: 240, xl: 320 }, ml: 1 }}>
      <Autocomplete
        options={options}
        getOptionLabel={(option) => option.label}
        groupBy={(option) => option.group}
        blurOnSelect
        clearOnEscape
        forcePopupIcon={false}
        noOptionsText={intl.formatMessage({ id: 'header.search.empty' })}
        onChange={(_event, option) => {
          if (option) navigate(option.url);
        }}
        renderOption={(props, option) => {
          const { key, ...optionProps } = props;
          const Icon = option.Icon;

          return (
            <Box component="li" key={key} {...optionProps}>
              <ListItemIcon sx={{ minWidth: 32 }}>{Icon && <Icon />}</ListItemIcon>
              <ListItemText primary={option.label} />
            </Box>
          );
        }}
        renderGroup={(params) => (
          <Box component="li" key={params.key}>
            <Typography component="div" variant="caption" sx={{ px: 2, py: 1, color: 'text.secondary' }}>
              {params.group}
            </Typography>
            <Box component="ul" sx={{ p: 0 }}>
              {params.children}
            </Box>
          </Box>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            inputRef={inputRef}
            size="small"
            placeholder={intl.formatMessage({ id: 'header.search.placeholder' })}
            slotProps={{
              htmlInput: {
                ...params.slotProps?.htmlInput,
                'aria-label': intl.formatMessage({ id: 'header.search.label' })
              },
              input: {
                ...params.slotProps?.input,
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchOutlined />
                  </InputAdornment>
                )
              }
            }}
          />
        )}
        sx={{
          '& .MuiOutlinedInput-root': { py: 0 },
          '& .MuiAutocomplete-endAdornment': { top: 'calc(50% - 14px)' }
        }}
      />
    </Box>
  );
}
