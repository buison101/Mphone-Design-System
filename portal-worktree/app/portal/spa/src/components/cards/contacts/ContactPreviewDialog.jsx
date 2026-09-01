import PropTypes from 'prop-types';

// material-ui
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// third-party
import { useIntl } from 'react-intl';

// project imports
import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';
import DetailList from 'components/patterns/DetailList';
import { contactInitials, contactName, phoneLabel, typeLabel } from './contactFields';

// ==============================|| CONTACT PREVIEW DIALOG ||============================== //
//
// Mantis's customer preview: the same 8/4 split, the same stack of cards, the
// same close in the corner of the footer. The sections are the ones this record
// can fill — every number the directory holds, and the four facts beside it —
// rather than Mantis's About me / Education / Employment, which have no field
// behind them here.
//
// The dialog is where calling belongs. A card in a grid of twenty has room for
// one action; a contact with a desk line, a mobile and a hotline needs the
// choice made explicitly, so every number gets its own button and the source
// extension is picked in the same view rather than remembered from a toolbar
// the reader has scrolled past.
//
// When click-to-call is not permitted the buttons are absent, not disabled with
// a tooltip: the reason is a permission the reader cannot change from here, and
// the sentence beside the list says so once.

export default function ContactPreviewDialog({
  open,
  contact,
  extensions = [],
  source,
  onSourceChange,
  onCall,
  onClose,
  callable = false,
  scope
}) {
  const intl = useIntl();
  if (!contact) return null;

  const name = contactName(contact, intl.formatMessage({ id: 'customer.card.unnamed' }));
  const type = typeLabel(intl, contact.type);
  const phones = contact.phones ?? [];

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" aria-labelledby="contact-preview-title">
      <DialogTitle id="contact-preview-title" sx={{ p: 2.5 }}>
        <Stack direction="row" sx={{ gap: 2, alignItems: 'center' }}>
          <Avatar alt={name} color="primary" sx={{ color: 'primary.darker' }}>
            {contactInitials(contact)}
          </Avatar>
          <Stack sx={{ minWidth: 0 }}>
            <Typography variant="h5">{name}</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {contact.title || contact.organization || type || intl.formatMessage({ id: 'customer.card.none' })}
            </Typography>
          </Stack>
        </Stack>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 2.5 }}>
        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Stack sx={{ gap: 2.5 }}>
              <MainCard title={intl.formatMessage({ id: 'customer.preview.phones' })} content={false}>
                {phones.length === 0 ? (
                  <Typography variant="body2" sx={{ color: 'text.secondary', p: 2.5 }}>
                    {intl.formatMessage({ id: 'customer.preview.noPhones' })}
                  </Typography>
                ) : (
                  <List disablePadding>
                    {phones.map((phone, index) => (
                      <ListItem
                        key={`${phone.number}-${index}`}
                        divider={index < phones.length - 1}
                        sx={{ px: 2.5, py: 1.5, gap: 1 }}
                        secondaryAction={
                          callable ? (
                            <Button size="small" variant="outlined" disabled={!source} onClick={() => onCall?.(phone.number)}>
                              {intl.formatMessage({ id: 'customer.action.call' })}
                            </Button>
                          ) : null
                        }
                      >
                        <ListItemText
                          primary={
                            <Stack direction="row" sx={{ gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                              <Typography variant="subtitle1" sx={{ fontVariantNumeric: 'tabular-nums' }}>
                                {phone.number}
                              </Typography>
                              {phone.primary && (
                                <Chip
                                  size="small"
                                  variant="outlined"
                                  color="primary"
                                  label={intl.formatMessage({ id: 'customer.phone.primary' })}
                                />
                              )}
                            </Stack>
                          }
                          secondary={
                            [
                              phoneLabel(intl, phone.label),
                              phone.extension && `${intl.formatMessage({ id: 'customer.field.extension' })} ${phone.extension}`
                            ]
                              .filter(Boolean)
                              .join(' · ') || intl.formatMessage({ id: 'customer.card.none' })
                          }
                          slotProps={{ secondary: { variant: 'caption', color: 'text.secondary' } }}
                          sx={{ my: 0, pr: 8 }}
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </MainCard>

              <MainCard title={intl.formatMessage({ id: 'customer.preview.details' })}>
                <DetailList
                  items={[
                    { id: 'title', label: intl.formatMessage({ id: 'customer.field.title' }), value: contact.title || '' },
                    {
                      id: 'organization',
                      label: intl.formatMessage({ id: 'customer.field.organization' }),
                      value: contact.organization || ''
                    },
                    { id: 'type', label: intl.formatMessage({ id: 'customer.field.type' }), value: type || '' },
                    {
                      id: 'scope',
                      label: intl.formatMessage({ id: 'customer.field.scope' }),
                      value: intl.formatMessage({ id: scope === 'domain' ? 'customer.scope.domain' : 'customer.scope.assigned' })
                    }
                  ]}
                />
              </MainCard>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <MainCard title={intl.formatMessage({ id: 'customer.preview.callFrom' })}>
              <Stack sx={{ gap: 1.5 }}>
                {callable ? (
                  <>
                    <TextField
                      select
                      size="small"
                      fullWidth
                      label={intl.formatMessage({ id: 'customer.field.source' })}
                      value={source ?? ''}
                      onChange={(event) => onSourceChange?.(event.target.value)}
                    >
                      {extensions.map((extension) => (
                        <MenuItem key={extension.extension_uuid} value={extension.extension_uuid}>
                          {extension.extension}
                          {extension.effective_caller_id_name ? ` · ${extension.effective_caller_id_name}` : ''}
                        </MenuItem>
                      ))}
                    </TextField>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {intl.formatMessage({ id: 'customer.preview.callNote' })}
                    </Typography>
                  </>
                ) : (
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {intl.formatMessage({ id: 'customer.preview.callForbidden' })}
                  </Typography>
                )}
              </Stack>
            </MainCard>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button color="secondary" onClick={onClose}>
          {intl.formatMessage({ id: 'action.close' })}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ContactPreviewDialog.propTypes = {
  open: PropTypes.bool,
  contact: PropTypes.object,
  extensions: PropTypes.array,
  source: PropTypes.string,
  onSourceChange: PropTypes.func,
  onCall: PropTypes.func,
  onClose: PropTypes.func,
  callable: PropTypes.bool,
  scope: PropTypes.string
};
