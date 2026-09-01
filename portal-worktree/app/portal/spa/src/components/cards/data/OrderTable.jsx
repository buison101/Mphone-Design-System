import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';

// project imports
import MainCard from 'components/MainCard';
import IconButton from 'components/@extended/IconButton';
import DataTableContainer from 'components/patterns/DataTableContainer';
import ContentState from 'components/states/ContentState';
import ToneChip from './ToneChip';

// assets
import CheckOutlined from '@ant-design/icons/CheckOutlined';
import CloseOutlined from '@ant-design/icons/CloseOutlined';
import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import EditOutlined from '@ant-design/icons/EditOutlined';

// ==============================|| DATA CARDS - ORDER TABLE ||============================== //
//
// The wide table at the bottom of the screen: one row per order, status as a
// chip, and an action column at the end.
//
// Both actions do their job. Mantis draws a pencil and a bin that go nowhere,
// and a control that cannot act is a promise the interface breaks the first
// time somebody trusts it - so the pencil opens the quantity cell for editing
// and the bin removes the row, both against the list the caller owns. A caller
// with nothing to hand them passes no handler and the column is not drawn.
//
// Editing happens in the cell rather than in a dialog. One number, already on
// screen, in a row the reader has just found: a modal would hide the row it is
// editing behind itself.
//
// Escape cancels and Enter commits, because a text field that can only be left
// by clicking a tick is a trap for anyone working from the keyboard.

export default function OrderTable({
  title,
  action,
  headers = {},
  rows = [],
  labels = {},
  onEditQuantity,
  onDelete,
  ariaLabel,
  state,
  emptyTitle,
  emptyDetail
}) {
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState('');
  const empty = !rows || rows.length === 0;
  const editable = typeof onEditQuantity === 'function';
  const removable = typeof onDelete === 'function';
  const showActions = editable || removable;

  const startEdit = (row) => {
    setEditingId(row.id);
    setDraft(String(row.quantity ?? ''));
  };

  const commit = () => {
    const value = Number.parseInt(draft, 10);
    if (Number.isFinite(value) && value >= 0) onEditQuantity(editingId, value);
    setEditingId(null);
  };

  return (
    <MainCard title={title} secondary={action} content={false}>
      {state === 'loading' && <ContentState state="loading" title={emptyTitle} compact />}

      {state !== 'loading' && empty && <ContentState state="empty" title={emptyTitle} detail={emptyDetail} compact />}

      {state !== 'loading' && !empty && (
        <DataTableContainer ariaLabel={ariaLabel}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>{headers.customer}</TableCell>
                <TableCell>{headers.reference}</TableCell>
                <TableCell align="center">{headers.item}</TableCell>
                <TableCell>{headers.product}</TableCell>
                <TableCell align="right">{headers.quantity}</TableCell>
                <TableCell>{headers.date}</TableCell>
                <TableCell align="center">{headers.status}</TableCell>
                {showActions && <TableCell align="center">{headers.actions}</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => {
                const Icon = row.icon;
                const editing = editingId === row.id;

                return (
                  <TableRow key={row.id} hover>
                    <TableCell>{row.customer}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.reference}</TableCell>
                    <TableCell align="center">
                      <Box
                        aria-hidden="true"
                        sx={{
                          width: 36,
                          height: 36,
                          mx: 'auto',
                          borderRadius: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: `${row.color || 'primary'}.lighter`,
                          color: `${row.color || 'primary'}.dark`
                        }}
                      >
                        {Icon ? <Icon /> : null}
                      </Box>
                    </TableCell>
                    <TableCell>{row.product}</TableCell>
                    <TableCell align="right" sx={{ fontVariantNumeric: 'tabular-nums' }}>
                      {editing ? (
                        <TextField
                          autoFocus
                          size="small"
                          type="number"
                          value={draft}
                          label={labels.quantity}
                          onChange={(event) => setDraft(event.target.value)}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter') commit();
                            if (event.key === 'Escape') setEditingId(null);
                          }}
                          sx={{ width: 96 }}
                        />
                      ) : (
                        row.quantity
                      )}
                    </TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.date}</TableCell>
                    <TableCell align="center">
                      <ToneChip tone={row.statusTone} label={row.statusLabel} />
                    </TableCell>
                    {showActions && (
                      <TableCell align="center">
                        <Stack direction="row" sx={{ gap: 0.5, justifyContent: 'center' }}>
                          {editing ? (
                            <>
                              <IconButton color="success" aria-label={labels.save} onClick={commit}>
                                <CheckOutlined />
                              </IconButton>
                              <IconButton color="secondary" aria-label={labels.cancel} onClick={() => setEditingId(null)}>
                                <CloseOutlined />
                              </IconButton>
                            </>
                          ) : (
                            <>
                              {editable && (
                                <IconButton color="primary" aria-label={labels.edit} onClick={() => startEdit(row)}>
                                  <EditOutlined />
                                </IconButton>
                              )}
                              {removable && (
                                <IconButton color="error" aria-label={labels.remove} onClick={() => onDelete(row.id)}>
                                  <DeleteOutlined />
                                </IconButton>
                              )}
                            </>
                          )}
                        </Stack>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </DataTableContainer>
      )}
    </MainCard>
  );
}

OrderTable.propTypes = {
  title: PropTypes.node,
  action: PropTypes.node,
  headers: PropTypes.object,
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      customer: PropTypes.node,
      reference: PropTypes.node,
      icon: PropTypes.elementType,
      color: PropTypes.string,
      product: PropTypes.node,
      quantity: PropTypes.number,
      date: PropTypes.node,
      statusLabel: PropTypes.node,
      statusTone: PropTypes.string
    })
  ),
  labels: PropTypes.object,
  onEditQuantity: PropTypes.func,
  onDelete: PropTypes.func,
  ariaLabel: PropTypes.string,
  state: PropTypes.oneOf(['loading', 'empty', 'error', 'ready']),
  emptyTitle: PropTypes.node,
  emptyDetail: PropTypes.node
};
