import { useState } from 'react';
import PropTypes from 'prop-types';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { FormattedMessage, useIntl } from 'react-intl';

import MainCard from 'components/MainCard';
import StatCard from 'components/cards/statistics/StatCard';
import ConfirmActionDialog from 'components/patterns/ConfirmActionDialog';
import DataPagination from 'components/patterns/DataPagination';
import DataTableContainer from 'components/patterns/DataTableContainer';
import FilterBar from 'components/patterns/FilterBar';
import PageHeader from 'components/patterns/PageHeader';
import ContentState from 'components/states/ContentState';

const SECTIONS = ['foundations', 'components', 'patterns', 'templates', 'governance', 'ai'];
const SWATCHES = [
  { id: 'primary', color: 'primary.main' },
  { id: 'success', color: 'success.main' },
  { id: 'warning', color: 'warning.main' },
  { id: 'error', color: 'error.main' },
  { id: 'info', color: 'info.main' },
  { id: 'surface', color: 'background.paper' }
];

function SectionTitle({ title, description }) {
  return (
    <Stack sx={{ gap: 0.5 }}>
      <Typography component="h2" variant="h4">
        {title}
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 760 }}>
        {description}
      </Typography>
    </Stack>
  );
}

SectionTitle.propTypes = { title: PropTypes.node.isRequired, description: PropTypes.node.isRequired };

function Foundations() {
  return (
    <Stack sx={{ gap: 3 }}>
      <SectionTitle title={<FormattedMessage id="ds.color.title" />} description={<FormattedMessage id="ds.color.description" />} />
      <Grid container spacing={2}>
        {SWATCHES.map((swatch) => (
          <Grid key={swatch.id} size={{ xs: 6, md: 4, lg: 2 }}>
            <MainCard contentSX={{ p: 1.5 }}>
              <Box sx={{ height: 72, borderRadius: 1.5, bgcolor: swatch.color, border: 1, borderColor: 'divider' }} />
              <Typography variant="subtitle2" sx={{ mt: 1.25 }}>
                <FormattedMessage id={`ds.color.${swatch.id}`} />
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {swatch.color}
              </Typography>
            </MainCard>
          </Grid>
        ))}
      </Grid>

      <Divider />
      <SectionTitle title={<FormattedMessage id="ds.type.title" />} description={<FormattedMessage id="ds.type.description" />} />
      <MainCard>
        <Stack sx={{ gap: 2 }}>
          {['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'subtitle1', 'body1', 'body2', 'caption'].map((variant) => (
            <Stack key={variant} direction={{ xs: 'column', sm: 'row' }} sx={{ gap: 1, alignItems: { sm: 'baseline' } }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', width: 80, flexShrink: 0 }}>
                {variant}
              </Typography>
              <Typography variant={variant}>
                <FormattedMessage id="ds.type.sample" />
              </Typography>
            </Stack>
          ))}
        </Stack>
      </MainCard>

      <Divider />
      <SectionTitle title={<FormattedMessage id="ds.space.title" />} description={<FormattedMessage id="ds.space.description" />} />
      <MainCard>
        <Stack sx={{ gap: 1.5 }}>
          {[4, 8, 12, 16, 24, 32].map((space) => (
            <Stack key={space} direction="row" sx={{ alignItems: 'center', gap: 2 }}>
              <Typography variant="caption" sx={{ width: 56, color: 'text.secondary' }}>
                {space}px
              </Typography>
              <Box sx={{ width: space * 4, maxWidth: '70%', height: 12, borderRadius: 99, bgcolor: 'primary.main' }} />
            </Stack>
          ))}
        </Stack>
      </MainCard>
    </Stack>
  );
}

function Components() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  return (
    <Stack sx={{ gap: 3 }}>
      <SectionTitle title={<FormattedMessage id="ds.actions.title" />} description={<FormattedMessage id="ds.actions.description" />} />
      <MainCard>
        <Stack direction="row" sx={{ gap: 1.5, flexWrap: 'wrap' }}>
          <Button variant="contained">
            <FormattedMessage id="ds.action.primary" />
          </Button>
          <Button variant="outlined">
            <FormattedMessage id="ds.action.secondary" />
          </Button>
          <Button variant="text">
            <FormattedMessage id="ds.action.tertiary" />
          </Button>
          <Button variant="contained" disabled>
            <FormattedMessage id="ds.action.disabled" />
          </Button>
          <Button variant="contained" color="error" onClick={() => setConfirmOpen(true)}>
            <FormattedMessage id="ds.action.destructive" />
          </Button>
        </Stack>
      </MainCard>

      <SectionTitle title={<FormattedMessage id="ds.form.title" />} description={<FormattedMessage id="ds.form.description" />} />
      <MainCard>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField fullWidth label={<FormattedMessage id="ds.form.name" />} />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField select fullWidth defaultValue="active" label={<FormattedMessage id="ds.form.status" />}>
              <MenuItem value="active">
                <FormattedMessage id="ds.status.active" />
              </MenuItem>
              <MenuItem value="paused">
                <FormattedMessage id="ds.status.paused" />
              </MenuItem>
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              error
              helperText={<FormattedMessage id="ds.form.error" />}
              label={<FormattedMessage id="ds.form.destination" />}
            />
          </Grid>
        </Grid>
      </MainCard>

      <SectionTitle title={<FormattedMessage id="ds.status.title" />} description={<FormattedMessage id="ds.status.description" />} />
      <MainCard>
        <Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap' }}>
          <Chip color="success" label={<FormattedMessage id="ds.status.online" />} />
          <Chip color="warning" label={<FormattedMessage id="ds.status.ringing" />} />
          <Chip color="error" label={<FormattedMessage id="ds.status.failed" />} />
          <Chip color="info" label={<FormattedMessage id="ds.status.processing" />} />
          <Chip label={<FormattedMessage id="ds.status.neutral" />} />
        </Stack>
      </MainCard>

      <SectionTitle title={<FormattedMessage id="ds.feedback.title" />} description={<FormattedMessage id="ds.feedback.description" />} />
      <Stack sx={{ gap: 1 }}>
        <Alert severity="success">
          <FormattedMessage id="ds.feedback.success" />
        </Alert>
        <Alert severity="warning">
          <FormattedMessage id="ds.feedback.warning" />
        </Alert>
        <Alert severity="error">
          <FormattedMessage id="ds.feedback.error" />
        </Alert>
        <Alert severity="info">
          <FormattedMessage id="ds.feedback.info" />
        </Alert>
      </Stack>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <MainCard>
            <ContentState compact state="loading" title={<FormattedMessage id="table.loading" />} />
          </MainCard>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <MainCard>
            <ContentState
              compact
              state="empty"
              title={<FormattedMessage id="ds.empty.title" />}
              detail={<FormattedMessage id="ds.empty.detail" />}
            />
          </MainCard>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <MainCard>
            <ContentState
              compact
              state="error"
              title={<FormattedMessage id="ds.error.title" />}
              detail={<FormattedMessage id="ds.error.detail" />}
              actionLabel={<FormattedMessage id="action.retry" />}
              onAction={() => {}}
            />
          </MainCard>
        </Grid>
      </Grid>

      <ConfirmActionDialog
        open={confirmOpen}
        title={<FormattedMessage id="ds.confirm.title" />}
        description={<FormattedMessage id="ds.confirm.description" />}
        cancelLabel={<FormattedMessage id="action.cancel" />}
        confirmLabel={<FormattedMessage id="ds.action.destructive" />}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => setConfirmOpen(false)}
      />
    </Stack>
  );
}

function Patterns() {
  const intl = useIntl();
  const [demoFilters, setDemoFilters] = useState({ from: '2026-08-01', to: '2026-08-28', q: '' });
  const [demoAdvanced, setDemoAdvanced] = useState(false);
  const [demoPage, setDemoPage] = useState(2);
  const [demoPageSize, setDemoPageSize] = useState(20);
  const updateDemoFilter = (key) => (event) => setDemoFilters((current) => ({ ...current, [key]: event.target.value }));
  return (
    <Stack sx={{ gap: 3 }}>
      <SectionTitle title={<FormattedMessage id="ds.patterns.title" />} description={<FormattedMessage id="ds.patterns.description" />} />
      <Grid container spacing={2}>
        {['auth', 'filter', 'edit', 'permission', 'destructive', 'system'].map((pattern) => (
          <Grid key={pattern} size={{ xs: 12, md: 6 }}>
            <MainCard title={<FormattedMessage id={`ds.pattern.${pattern}.title`} />}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                <FormattedMessage id={`ds.pattern.${pattern}.description`} />
              </Typography>
            </MainCard>
          </Grid>
        ))}
      </Grid>
      <MainCard content={false} title="FilterBar">
        <Box sx={{ px: 2, pt: 2 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            <FormattedMessage id="ds.filterBar.description" />
          </Typography>
        </Box>
        <FilterBar
          ariaLabel={intl.formatMessage({ id: 'filter.label' })}
          resetLabel={<FormattedMessage id="action.resetFilters" />}
          resetDisabled={demoFilters.from === '2026-08-01' && demoFilters.to === '2026-08-28' && demoFilters.q === ''}
          onReset={() => setDemoFilters({ from: '2026-08-01', to: '2026-08-28', q: '' })}
        >
          <TextField
            size="small"
            type="date"
            label={intl.formatMessage({ id: 'filter.from' })}
            value={demoFilters.from}
            onChange={updateDemoFilter('from')}
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <TextField
            size="small"
            type="date"
            label={intl.formatMessage({ id: 'filter.to' })}
            value={demoFilters.to}
            onChange={updateDemoFilter('to')}
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <TextField
            size="small"
            label={intl.formatMessage({ id: 'history.search' })}
            value={demoFilters.q}
            onChange={updateDemoFilter('q')}
            sx={{ flexGrow: 1 }}
          />
          {demoAdvanced && (
            <TextField select size="small" defaultValue="" label={intl.formatMessage({ id: 'table.state' })}>
              <MenuItem value="">
                <FormattedMessage id="history.status.all" />
              </MenuItem>
              <MenuItem value="answered">
                <FormattedMessage id="callState.answered" />
              </MenuItem>
              <MenuItem value="missed">
                <FormattedMessage id="callState.missed" />
              </MenuItem>
            </TextField>
          )}
          <Button size="small" aria-expanded={demoAdvanced} onClick={() => setDemoAdvanced((value) => !value)}>
            <FormattedMessage id={demoAdvanced ? 'filter.hideAdvanced' : 'filter.showAdvanced'} values={{ count: 0 }} />
          </Button>
        </FilterBar>
      </MainCard>
      <MainCard content={false} title="DataPagination">
        <Box sx={{ px: 2, pt: 2 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            <FormattedMessage id="ds.dataPagination.description" />
          </Typography>
        </Box>
        <DataPagination
          page={demoPage}
          pageSize={demoPageSize}
          total={124}
          pageSizeOptions={[10, 20, 50]}
          onChange={(event, page) => setDemoPage(page)}
          onPageSizeChange={(value) => {
            setDemoPageSize(value);
            setDemoPage(1);
          }}
        />
      </MainCard>
      <MainCard content={false} title="DataTableContainer">
        <Box sx={{ px: 2, pt: 2 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            <FormattedMessage id="ds.dataTable.description" />
          </Typography>
        </Box>
        <DataTableContainer ariaLabel={intl.formatMessage({ id: 'ds.template.list' })}>
          <Table size="small" sx={{ minWidth: 640 }}>
            <TableHead>
              <TableRow>
                <TableCell>
                  <FormattedMessage id="table.caller" />
                </TableCell>
                <TableCell>
                  <FormattedMessage id="table.destination" />
                </TableCell>
                <TableCell>
                  <FormattedMessage id="table.state" />
                </TableCell>
                <TableCell align="right">
                  <FormattedMessage id="table.duration" />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow hover>
                <TableCell>
                  <FormattedMessage id="ds.sample.name" />
                </TableCell>
                <TableCell>
                  <FormattedMessage id="ds.sample.extension" />
                </TableCell>
                <TableCell>
                  <Chip size="small" color="success" label={<FormattedMessage id="callState.answered" />} />
                </TableCell>
                <TableCell align="right">03:42</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </DataTableContainer>
      </MainCard>
      <Alert severity="info">
        <FormattedMessage id="ds.patterns.rule" />
      </Alert>
    </Stack>
  );
}

function Templates() {
  const intl = useIntl();
  return (
    <Stack sx={{ gap: 3 }}>
      <SectionTitle title={<FormattedMessage id="ds.templates.title" />} description={<FormattedMessage id="ds.templates.description" />} />
      <MainCard title={<FormattedMessage id="ds.template.dashboard" />}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <StatCard title={intl.formatMessage({ id: 'overview.totalCalls' })} count="1,248" />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <StatCard title={intl.formatMessage({ id: 'overview.answerRate' })} count="92%" color="success" />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <StatCard title={intl.formatMessage({ id: 'overview.missed' })} count="18" color="error" />
          </Grid>
          <Grid size={12}>
            <Box sx={{ height: 120, borderRadius: 1.5, bgcolor: 'action.hover', display: 'grid', placeItems: 'center' }}>
              <Typography color="text.secondary">
                <FormattedMessage id="ds.template.chart" />
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </MainCard>

      <MainCard title={<FormattedMessage id="ds.template.list" />} content={false}>
        <DataTableContainer ariaLabel={intl.formatMessage({ id: 'ds.template.list' })}>
          <Table size="small" sx={{ minWidth: 640 }}>
            <TableHead>
              <TableRow>
                <TableCell>
                  <FormattedMessage id="table.caller" />
                </TableCell>
                <TableCell>
                  <FormattedMessage id="table.destination" />
                </TableCell>
                <TableCell>
                  <FormattedMessage id="table.state" />
                </TableCell>
                <TableCell align="right">
                  <FormattedMessage id="table.duration" />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow hover>
                <TableCell>
                  <FormattedMessage id="ds.sample.name" />
                </TableCell>
                <TableCell>
                  <FormattedMessage id="ds.sample.extension" />
                </TableCell>
                <TableCell>
                  <Chip size="small" color="success" label={<FormattedMessage id="callState.answered" />} />
                </TableCell>
                <TableCell align="right">03:42</TableCell>
              </TableRow>
              <TableRow hover>
                <TableCell>
                  <FormattedMessage id="ds.sample.phone" />
                </TableCell>
                <TableCell>
                  <FormattedMessage id="ds.sample.destination" />
                </TableCell>
                <TableCell>
                  <Chip size="small" color="error" label={<FormattedMessage id="callState.missed" />} />
                </TableCell>
                <TableCell align="right">00:00</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </DataTableContainer>
      </MainCard>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, lg: 5 }}>
          <MainCard title={<FormattedMessage id="ds.template.form" />}>
            <Stack sx={{ gap: 2 }}>
              <TextField label={<FormattedMessage id="ds.form.name" />} fullWidth />
              <TextField label={<FormattedMessage id="ds.form.destination" />} fullWidth />
              <Stack direction="row" sx={{ justifyContent: 'flex-end', gap: 1 }}>
                <Button color="inherit">
                  <FormattedMessage id="action.cancel" />
                </Button>
                <Button variant="contained">
                  <FormattedMessage id="settings.save" />
                </Button>
              </Stack>
            </Stack>
          </MainCard>
        </Grid>
        <Grid size={{ xs: 12, lg: 7 }}>
          <MainCard title={<FormattedMessage id="ds.template.detail" />}>
            <Stack sx={{ gap: 1.5 }}>
              <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                <Typography color="text.secondary">
                  <FormattedMessage id="table.caller" />
                </Typography>
                <Typography fontWeight={600}>
                  <FormattedMessage id="ds.sample.name" />
                </Typography>
              </Stack>
              <Divider />
              <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                <Typography color="text.secondary">
                  <FormattedMessage id="table.state" />
                </Typography>
                <Chip size="small" color="success" label={<FormattedMessage id="callState.answered" />} />
              </Stack>
              <Divider />
              <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                <Typography color="text.secondary">
                  <FormattedMessage id="table.duration" />
                </Typography>
                <Typography>03:42</Typography>
              </Stack>
            </Stack>
          </MainCard>
        </Grid>
      </Grid>
    </Stack>
  );
}

function AiContract() {
  return (
    <Stack sx={{ gap: 3 }}>
      <SectionTitle title={<FormattedMessage id="ds.ai.title" />} description={<FormattedMessage id="ds.ai.description" />} />
      <MainCard title={<FormattedMessage id="ds.ai.inputTitle" />}>
        <Stack component="ol" sx={{ m: 0, pl: 2.5, gap: 1 }}>
          {['goal', 'role', 'data', 'actions', 'states', 'responsive', 'locale'].map((item) => (
            <Typography component="li" variant="body2" key={item}>
              <FormattedMessage id={`ds.ai.input.${item}`} />
            </Typography>
          ))}
        </Stack>
      </MainCard>
      <MainCard title={<FormattedMessage id="ds.ai.reviewTitle" />}>
        <Grid container spacing={1.5}>
          {['tokens', 'hierarchy', 'states', 'accessibility', 'language', 'permissions', 'evidence'].map((item) => (
            <Grid key={item} size={{ xs: 12, md: 6 }}>
              <Alert icon={false} severity="success">
                <FormattedMessage id={`ds.ai.review.${item}`} />
              </Alert>
            </Grid>
          ))}
        </Grid>
      </MainCard>
    </Stack>
  );
}

function Governance() {
  return (
    <Stack sx={{ gap: 3 }}>
      <SectionTitle
        title={<FormattedMessage id="ds.governance.title" />}
        description={<FormattedMessage id="ds.governance.description" />}
      />
      <Grid container spacing={2}>
        {['registry', 'quality', 'release', 'deprecation'].map((item) => (
          <Grid key={item} size={{ xs: 12, md: 6 }}>
            <MainCard title={<FormattedMessage id={`ds.governance.${item}.title`} />}>
              <Typography variant="body2" color="text.secondary">
                <FormattedMessage id={`ds.governance.${item}.description`} />
              </Typography>
            </MainCard>
          </Grid>
        ))}
      </Grid>
      <Alert severity="success">
        <FormattedMessage id="ds.governance.status" />
      </Alert>
    </Stack>
  );
}

export default function DesignSystem() {
  const intl = useIntl();
  const [section, setSection] = useState('foundations');
  return (
    <Stack sx={{ gap: 2.5 }}>
      <PageHeader
        eyebrow={<FormattedMessage id="ds.eyebrow" />}
        title={<FormattedMessage id="ds.title" />}
        description={<FormattedMessage id="ds.description" />}
        actions={
          <Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap' }}>
            <Chip color="success" variant="outlined" label="Portal v1.4" />
            <Chip color="primary" variant="outlined" label="Design System v2.14" />
          </Stack>
        }
      />
      <MainCard content={false}>
        <Tabs
          value={section}
          onChange={(event, next) => setSection(next)}
          variant="scrollable"
          scrollButtons="auto"
          aria-label={intl.formatMessage({ id: 'ds.sections' })}
        >
          {SECTIONS.map((item) => (
            <Tab key={item} value={item} label={intl.formatMessage({ id: `ds.section.${item}` })} />
          ))}
        </Tabs>
      </MainCard>
      {section === 'foundations' && <Foundations />}
      {section === 'components' && <Components />}
      {section === 'patterns' && <Patterns />}
      {section === 'templates' && <Templates />}
      {section === 'governance' && <Governance />}
      {section === 'ai' && <AiContract />}
    </Stack>
  );
}
