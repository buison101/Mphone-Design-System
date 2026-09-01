import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// third-party
import { useIntl } from 'react-intl';

// project imports
import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';
import IconButton from 'components/@extended/IconButton';
import { AVATAR_TONES, contactInitials, contactName, phoneLabel, primaryPhone, typeLabel } from './contactFields';

// assets
import ContactsOutlined from '@ant-design/icons/ContactsOutlined';
import MoreOutlined from '@ant-design/icons/MoreOutlined';
import NumberOutlined from '@ant-design/icons/NumberOutlined';
import PhoneOutlined from '@ant-design/icons/PhoneOutlined';
import TagOutlined from '@ant-design/icons/TagOutlined';

// ==============================|| CONTACT CARD ||============================== //
//
// Mantis's customer card, on the record this portal actually has. The anatomy is
// kept exactly - avatar and name over a rule, a body line, a two-by-two block of
// facts, chips, a footer with one action - because that shape is what makes a
// wall of these scannable. What is not kept is any slot with nothing behind it:
// `contacts.php` has no email, country, website, age or skills, and six dashes
// in a row would tell a reader the record is empty rather than that the field
// does not exist.
//
// The overflow menu carries only what works without an endpoint: place a call
// (click_to_call.php, a real POST) and copy the number to the clipboard. Mantis
// offers Export PDF, Edit and Delete there; contacts.php answers 405 to anything
// that is not a GET, so all three would be buttons that lie.
//
// Every number is rendered with its own label, because a directory row with
// three numbers and no labels makes the reader guess which one is the desk.

export default function ContactCard({ contact, index = 0, onPreview, onCall, onCopy, callable = false }) {
  const intl = useIntl();
  const [anchor, setAnchor] = useState(null);

  const phones = contact.phones ?? [];
  const primary = primaryPhone(contact);
  const others = phones.filter((phone) => phone !== primary);
  const tone = AVATAR_TONES[index % AVATAR_TONES.length];
  const name = contactName(contact, intl.formatMessage({ id: 'customer.card.unnamed' }));
  const type = typeLabel(intl, contact.type);
  const caption = contact.title || type;

  const close = () => setAnchor(null);

  const fact = (Icon, label, value) => (
    <Stack direction="row" sx={{ gap: 1, alignItems: 'center', minWidth: 0 }}>
      <Box aria-hidden="true" sx={{ display: 'flex', color: 'text.secondary', fontSize: '0.875rem' }}>
        <Icon />
      </Box>
      <Typography variant="body2" noWrap title={typeof value === 'string' ? value : undefined}>
        <Box component="span" sx={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>
          {label}:{' '}
        </Box>
        {value}
      </Typography>
    </Stack>
  );

  const dash = intl.formatMessage({ id: 'customer.card.none' });

  return (
    <MainCard sx={{ height: '100%' }} contentSX={{ p: 2.5, height: '100%' }}>
      <Stack sx={{ height: '100%', gap: 2 }}>
        <List disablePadding>
          <ListItem
            disableGutters
            sx={{ p: 0 }}
            secondaryAction={
              <>
                <IconButton
                  color="secondary"
                  aria-label={intl.formatMessage({ id: 'customer.card.menu' }, { name })}
                  aria-haspopup="menu"
                  onClick={(event) => setAnchor(event.currentTarget)}
                >
                  <MoreOutlined />
                </IconButton>
                <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={close}>
                  <MenuItem
                    disabled={!callable || !primary}
                    onClick={() => {
                      close();
                      if (primary) onCall?.(primary.number);
                    }}
                  >
                    {intl.formatMessage({ id: 'customer.action.call' })}
                  </MenuItem>
                  <MenuItem
                    disabled={!primary}
                    onClick={() => {
                      close();
                      if (primary) onCopy?.(primary.number);
                    }}
                  >
                    {intl.formatMessage({ id: 'customer.action.copy' })}
                  </MenuItem>
                </Menu>
              </>
            }
          >
            <ListItemAvatar>
              <Avatar alt={name} color={tone} sx={{ color: `${tone}.darker` }}>
                {contactInitials(contact)}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={<Typography variant="subtitle1">{name}</Typography>}
              secondary={caption || dash}
              slotProps={{ secondary: { variant: 'caption', color: 'text.secondary' } }}
              sx={{ my: 0, pr: 4 }}
            />
          </ListItem>
        </List>

        <Divider />

        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            minHeight: 40,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {contact.organization || intl.formatMessage({ id: 'customer.card.directoryLine' })}
        </Typography>

        {/* Four facts, none of them repeated elsewhere on the card: the
            organization is the body line above, the job title is the caption in
            the header, and printing either again would spend a quarter of the
            block on something the eye has already read. */}
        <Grid container spacing={1.5}>
          <Grid size={6}>{fact(PhoneOutlined, intl.formatMessage({ id: 'customer.field.primary' }), primary?.number || dash)}</Grid>
          <Grid size={6}>{fact(TagOutlined, intl.formatMessage({ id: 'customer.field.type' }), type || dash)}</Grid>
          <Grid size={6}>{fact(NumberOutlined, intl.formatMessage({ id: 'customer.field.extension' }), primary?.extension || dash)}</Grid>
          <Grid size={6}>
            {fact(
              ContactsOutlined,
              intl.formatMessage({ id: 'customer.card.phoneCountLabel' }),
              intl.formatMessage({ id: 'customer.card.phoneCount' }, { count: phones.length })
            )}
          </Grid>
        </Grid>

        {others.length > 0 && (
          <Stack direction="row" sx={{ gap: 0.75, flexWrap: 'wrap' }}>
            {others.map((phone) => (
              <Chip
                key={`${contact.uuid}-${phone.number}`}
                size="small"
                variant="outlined"
                color="secondary"
                label={phoneLabel(intl, phone.label) ? `${phoneLabel(intl, phone.label)} · ${phone.number}` : phone.number}
              />
            ))}
          </Stack>
        )}

        <Stack direction="row" sx={{ mt: 'auto', pt: 1, gap: 1, alignItems: 'center', justifyContent: 'space-between' }}>
          {/* the primary number's own label, which is the only thing the record
              says about *which* line this is — a desk, a mobile, a switchboard */}
          <Typography variant="caption" sx={{ color: 'text.secondary' }} noWrap>
            {phoneLabel(intl, primary?.label) || intl.formatMessage({ id: 'customer.card.directoryLine' })}
          </Typography>
          <Button size="small" variant="outlined" onClick={() => onPreview?.(contact)}>
            {intl.formatMessage({ id: 'customer.action.preview' })}
          </Button>
        </Stack>
      </Stack>
    </MainCard>
  );
}

ContactCard.propTypes = {
  contact: PropTypes.shape({
    uuid: PropTypes.string,
    name: PropTypes.string,
    title: PropTypes.string,
    organization: PropTypes.string,
    type: PropTypes.string,
    phones: PropTypes.array
  }).isRequired,
  index: PropTypes.number,
  onPreview: PropTypes.func,
  onCall: PropTypes.func,
  onCopy: PropTypes.func,
  callable: PropTypes.bool
};
