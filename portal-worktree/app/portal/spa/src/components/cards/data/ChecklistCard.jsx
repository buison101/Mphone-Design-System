import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'components/MainCard';
import IconButton from 'components/@extended/IconButton';
import ContentState from 'components/states/ContentState';

// assets
import PlusCircleOutlined from '@ant-design/icons/PlusCircleOutlined';

// ==============================|| DATA CARDS - CHECKLIST ||============================== //
//
// A short list of things to do, each one crossed out as it is done. Mantis draws
// the same card with a plus in the header, and the plus is kept - but it opens a
// field that actually adds a line, because a control that cannot do its own job
// is worse than a missing one. Everything this card changes lives in the caller's
// state, which is the only thing a checklist on a widget page owns.
//
// The done state is a line-through *and* a step down in text colour, never
// colour alone: a strikethrough survives a monochrome screenshot and a checkbox
// that has lost its tint.

export default function ChecklistCard({ title, items = [], onToggle, onAdd, addLabel, state, emptyTitle, emptyDetail }) {
  const [draft, setDraft] = useState('');
  const [adding, setAdding] = useState(false);
  const empty = !items || items.length === 0;

  const submit = (event) => {
    event.preventDefault();
    const value = draft.trim();
    if (!value) return;
    onAdd(value);
    setDraft('');
    setAdding(false);
  };

  return (
    <MainCard
      title={title}
      secondary={
        onAdd ? (
          <IconButton color="secondary" aria-label={addLabel} aria-expanded={adding} onClick={() => setAdding((open) => !open)}>
            <PlusCircleOutlined />
          </IconButton>
        ) : null
      }
    >
      {state === 'loading' && <ContentState state="loading" title={emptyTitle} compact />}

      {state !== 'loading' && (
        <Stack sx={{ gap: 0.5 }}>
          {onAdd && adding && (
            <form onSubmit={submit}>
              <TextField
                autoFocus
                fullWidth
                size="small"
                value={draft}
                label={addLabel}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => event.key === 'Escape' && setAdding(false)}
                sx={{ mb: 1 }}
              />
            </form>
          )}

          {empty && <ContentState state="empty" title={emptyTitle} detail={emptyDetail} compact />}

          {items.map((item) => (
            <FormControlLabel
              key={item.id}
              control={<Checkbox checked={!!item.done} onChange={() => onToggle?.(item.id)} size="small" />}
              label={
                <Typography
                  variant="body2"
                  sx={{ textDecoration: item.done ? 'line-through' : 'none', color: item.done ? 'text.secondary' : 'text.primary' }}
                >
                  {item.label}
                </Typography>
              }
              sx={{ mx: 0, gap: 0.5, alignItems: 'center' }}
            />
          ))}
        </Stack>
      )}
    </MainCard>
  );
}

ChecklistCard.propTypes = {
  title: PropTypes.node,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      label: PropTypes.node,
      done: PropTypes.bool
    })
  ),
  onToggle: PropTypes.func,
  onAdd: PropTypes.func,
  addLabel: PropTypes.string,
  state: PropTypes.oneOf(['loading', 'empty', 'error', 'ready']),
  emptyTitle: PropTypes.node,
  emptyDetail: PropTypes.node
};
