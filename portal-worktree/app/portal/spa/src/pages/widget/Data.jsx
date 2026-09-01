import { useState } from 'react';

// material-ui
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

// third-party
import { FormattedMessage, useIntl } from 'react-intl';
import { Link as RouterLink } from 'react-router-dom';

// project imports
import MainCard from 'components/MainCard';
import PageHeader from 'components/patterns/PageHeader';
import ProgressListCard from 'components/cards/ProgressListCard';
import AssignmentTable from 'components/cards/data/AssignmentTable';
import ChecklistCard from 'components/cards/data/ChecklistCard';
import DeltaListCard from 'components/cards/data/DeltaListCard';
import FeedListCard from 'components/cards/data/FeedListCard';
import MediaListCard from 'components/cards/data/MediaListCard';
import MetricTable from 'components/cards/data/MetricTable';
import NotificationListCard from 'components/cards/data/NotificationListCard';
import OrderTable from 'components/cards/data/OrderTable';
import PeopleListCard from 'components/cards/data/PeopleListCard';
import StatusTable from 'components/cards/data/StatusTable';
import SummaryTableCard from 'components/cards/data/SummaryTableCard';
import TaskTimelineCard from 'components/cards/data/TaskTimelineCard';
import TicketQueueTable from 'components/cards/data/TicketQueueTable';

import {
  ACTIVITY_ROWS,
  ASSIGNMENT_ROWS,
  CHARGE_ROWS,
  CHARGE_TOTALS,
  CONTACT_ROWS,
  FEED_ROWS,
  GUIDE_ROWS,
  MESSAGE_ROWS,
  ORDER_ROWS,
  PLAN_ROWS,
  REGION_ROWS,
  REQUEST_ROWS,
  TASK_ROWS,
  TEAM_ROWS,
  TICKET_QUEUE_ROWS,
  TICKET_STATUS_ROWS,
  TODO_ITEMS,
  TRAFFIC_ROWS,
  USAGE_ROWS
} from 'sections/widget/dataSample';

// assets
import ApiOutlined from '@ant-design/icons/ApiOutlined';
import ClockCircleOutlined from '@ant-design/icons/ClockCircleOutlined';
import ContactsOutlined from '@ant-design/icons/ContactsOutlined';
import CustomerServiceOutlined from '@ant-design/icons/CustomerServiceOutlined';
import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined';
import DisconnectOutlined from '@ant-design/icons/DisconnectOutlined';
import EditOutlined from '@ant-design/icons/EditOutlined';
import FileTextOutlined from '@ant-design/icons/FileTextOutlined';
import LineChartOutlined from '@ant-design/icons/LineChartOutlined';
import MessageOutlined from '@ant-design/icons/MessageOutlined';
import MobileOutlined from '@ant-design/icons/MobileOutlined';
import PhoneOutlined from '@ant-design/icons/PhoneOutlined';
import PlayCircleOutlined from '@ant-design/icons/PlayCircleOutlined';
import ShoppingCartOutlined from '@ant-design/icons/ShoppingCartOutlined';
import StopOutlined from '@ant-design/icons/StopOutlined';
import TeamOutlined from '@ant-design/icons/TeamOutlined';
import UserOutlined from '@ant-design/icons/UserOutlined';
import WifiOutlined from '@ant-design/icons/WifiOutlined';

// ==============================|| PAGE - WIDGET DATA ||============================== //
//
// Mantis's Widget > Data screen, rebuilt card for card on the Mphone foundation:
// the same eighteen cards, in the same grid, at the same breakpoints, with the
// same fills. What changed is the content, which is a PBX tenant's, and three
// things that were measured rather than copied.
//
// 1. Ink. Mantis writes white on all five chip fills; three of them measure
//    under 3:1. dataInk.js carries the table and picks the ink per colour
//    scheme, because this theme's grey ramp inverts in dark mode and an ink
//    named from it would flip to near-white on an amber chip.
// 2. Priority. Mantis paints its highest priority green and its lowest red. The
//    five fills are kept and the scale is turned the right way up.
// 3. Links. "View all" is drawn only where this portal has a destination for it.
//    A link that goes nowhere is worse than no link, and this page is a rack -
//    six of these cards have somewhere real to point, and the rest do not.
//
// The figures are sample data and the page says so in its own header. They still
// reconcile with each other: the eight charges sum to the week's total, the plan
// rows multiply out, and the region shares sum to 100.

const MESSAGE_ICONS = { calls: PhoneOutlined, extensions: TeamOutlined, backup: CheckCircleOutlined, requests: UserOutlined };
const TASK_ICONS = {
  traffic: LineChartOutlined,
  script: EditOutlined,
  assign: UserOutlined,
  contacts: ContactsOutlined,
  test: MobileOutlined
};
const FEED_ICONS = {
  pending: MessageOutlined,
  order: ShoppingCartOutlined,
  unregistered: DisconnectOutlined,
  invoice: FileTextOutlined,
  cancelled: StopOutlined
};
const ORDER_ICONS = { 81412314: PhoneOutlined, 68457898: CustomerServiceOutlined, 45457898: WifiOutlined, 62446232: ApiOutlined };

export default function WidgetData() {
  const intl = useIntl();
  const [todo, setTodo] = useState(TODO_ITEMS);
  const [orders, setOrders] = useState(ORDER_ROWS);

  const t = (id) => intl.formatMessage({ id });
  const number = (value) => intl.formatNumber(value);
  const money = (value) =>
    intl.formatNumber(value, { style: 'currency', currency: 'VND', currencyDisplay: 'narrowSymbol', maximumFractionDigits: 0 });
  const day = (iso) => intl.formatDate(new Date(iso), { day: '2-digit', month: 'short', timeZone: 'UTC' });
  const share = (value) => `${intl.formatNumber(value, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`;
  const minutes = (value) => `${value > 0 ? '+' : '−'}${intl.formatNumber(Math.abs(value))} ${t('widget.data.unit.minutes')}`;

  // A destination or nothing: every one of these routes exists in this portal.
  const viewAll = (to) => (
    <Link component={RouterLink} to={to} variant="body2" underline="hover">
      <FormattedMessage id="widget.data.viewAll" />
    </Link>
  );

  const toggleTodo = (id) => setTodo((items) => items.map((item) => (item.id === id ? { ...item, done: !item.done } : item)));
  const addTodo = (label) => setTodo((items) => [...items, { id: `todo-${items.length + 1}-${label.slice(0, 8)}`, label, done: false }]);
  const removeOrder = (id) => setOrders((rows) => rows.filter((row) => row.id !== id));
  const setQuantity = (id, quantity) => setOrders((rows) => rows.map((row) => (row.id === id ? { ...row, quantity } : row)));

  return (
    <Grid container spacing={2.5}>
      <Grid size={12}>
        <PageHeader title={<FormattedMessage id="widget.data.title" />} description={<FormattedMessage id="widget.data.description" />} />
      </Grid>

      {/* 1 - to do list */}
      <Grid size={{ xs: 12, md: 6, lg: 4 }}>
        <ChecklistCard
          title={<FormattedMessage id="widget.data.todo.title" />}
          items={todo.map((item) => ({ ...item, label: item.labelId ? t(item.labelId) : item.label }))}
          onToggle={toggleTodo}
          onAdd={addTodo}
          addLabel={t('widget.data.todo.add')}
          emptyTitle={<FormattedMessage id="widget.data.todo.empty" />}
        />
      </Grid>

      {/* 2 - resource usage */}
      <Grid size={{ xs: 12, md: 6, lg: 4 }}>
        <ProgressListCard
          layout="stacked"
          title={<FormattedMessage id="widget.data.usage.title" />}
          subheader={<FormattedMessage id="widget.data.usage.subtitle" />}
          items={USAGE_ROWS.map((row) => ({ ...row, label: t(row.labelId), ariaLabel: t(row.labelId) }))}
        />
      </Grid>

      {/* 3 - team members */}
      <Grid size={{ xs: 12, md: 12, lg: 4 }}>
        <PeopleListCard
          title={<FormattedMessage id="widget.data.team.title" />}
          action={viewAll('/contacts')}
          items={TEAM_ROWS.map((row) => ({
            id: row.id,
            name: row.name,
            secondary: t(row.roleId),
            meta: row.metaId ? t(row.metaId) : row.meta,
            color: row.color
          }))}
        />
      </Grid>

      {/* 4 - latest notifications */}
      <Grid size={{ xs: 12, md: 7, lg: 6 }}>
        <NotificationListCard
          title={<FormattedMessage id="widget.data.messages.title" />}
          items={MESSAGE_ROWS.map((row) => ({
            id: row.id,
            time: t(row.timeId),
            icon: MESSAGE_ICONS[row.id],
            color: row.color,
            primary: t(row.titleId),
            secondary: t(row.bodyId)
          }))}
        />
      </Grid>

      {/* 5 - user activity */}
      <Grid size={{ xs: 12, md: 5, lg: 6 }}>
        <PeopleListCard
          title={<FormattedMessage id="widget.data.activity.title" />}
          action={viewAll('/calls/history')}
          items={ACTIVITY_ROWS.map((row) => ({
            id: row.id,
            name: row.name,
            // the ring is never the whole message: the state is written out here too
            secondary: `${t(`chat.presence.${row.presence}`)} · ${t(row.textId)}`,
            meta: t(row.metaId),
            metaIcon: ClockCircleOutlined,
            presence: row.presence,
            presenceLabel: t(`chat.presence.${row.presence}`),
            color: row.color
          }))}
        />
      </Grid>

      {/* 6 - assigned work */}
      <Grid size={{ xs: 12, md: 6, lg: 6 }}>
        <AssignmentTable
          title={<FormattedMessage id="widget.data.assign.title" />}
          ariaLabel={t('widget.data.assign.title')}
          headers={{
            assignee: <FormattedMessage id="widget.data.assign.assignee" />,
            subject: <FormattedMessage id="widget.data.assign.subject" />,
            due: <FormattedMessage id="widget.data.assign.due" />,
            priority: <FormattedMessage id="widget.data.assign.priority" />
          }}
          rows={ASSIGNMENT_ROWS.map((row) => ({
            id: row.id,
            name: row.name,
            role: t(row.roleId),
            subject: t(row.subjectId),
            due: day(row.due),
            priorityLabel: t(row.priorityId),
            priorityTone: row.priorityTone
          }))}
        />
      </Grid>

      {/* 7 - service revenue */}
      <Grid size={{ xs: 12, md: 6, lg: 6 }}>
        <SummaryTableCard
          title={<FormattedMessage id="widget.data.revenue.title" />}
          ariaLabel={t('widget.data.revenue.title')}
          figures={[
            { id: 'month', label: t('widget.data.revenue.month'), value: money(CHARGE_TOTALS.month) },
            { id: 'yesterday', label: t('widget.data.revenue.yesterday'), value: money(CHARGE_TOTALS.yesterday) },
            { id: 'week', label: t('widget.data.revenue.week'), value: money(CHARGE_TOTALS.week) }
          ]}
          headers={[
            <FormattedMessage key="ref" id="widget.data.revenue.reference" />,
            <FormattedMessage key="service" id="widget.data.revenue.service" />,
            <FormattedMessage key="amount" id="widget.data.revenue.amount" />
          ]}
          rows={CHARGE_ROWS.map((row) => ({ id: row.id, cells: [row.id, t(row.nameId), money(row.amount)] }))}
        />
      </Grid>

      {/* 8 - task log */}
      <Grid size={{ xs: 12, md: 4 }}>
        <TaskTimelineCard
          title={<FormattedMessage id="widget.data.tasklog.title" />}
          items={TASK_ROWS.map((row) => ({
            id: row.id,
            time: row.timeId ? t(row.timeId) : row.time,
            icon: TASK_ICONS[row.id],
            color: row.color,
            primary: t(row.textId)
          }))}
        />
      </Grid>

      {/* 9 - revenue by plan */}
      <Grid size={{ xs: 12, md: 8 }}>
        <MetricTable
          title={<FormattedMessage id="widget.data.plans.title" />}
          action={viewAll('/billing')}
          ariaLabel={t('widget.data.plans.title')}
          columns={[
            { id: 'plan', label: <FormattedMessage id="widget.data.plans.plan" /> },
            { id: 'seats', label: <FormattedMessage id="widget.data.plans.seats" />, align: 'right' },
            { id: 'price', label: <FormattedMessage id="widget.data.plans.price" />, align: 'right' },
            { id: 'total', label: <FormattedMessage id="widget.data.plans.total" />, align: 'right' }
          ]}
          rows={PLAN_ROWS.map((row) => ({
            id: row.id,
            cells: [
              { primary: t(row.nameId), secondary: t(row.descriptionId) },
              number(row.seats),
              money(row.price),
              money(row.seats * row.price)
            ]
          }))}
        />
      </Grid>

      {/* 10 - open tickets */}
      <Grid size={{ xs: 12, md: 8 }}>
        <TicketQueueTable
          title={<FormattedMessage id="widget.data.tickets.title" />}
          ariaLabel={t('widget.data.tickets.title')}
          headers={{
            due: <FormattedMessage id="widget.data.tickets.due" />,
            owner: <FormattedMessage id="widget.data.tickets.owner" />,
            subject: <FormattedMessage id="widget.data.tickets.subject" />
          }}
          rows={TICKET_QUEUE_ROWS.map((row) => ({
            id: row.id,
            dueValue: number(row.dueValue),
            dueUnit: t('widget.data.unit.hours'),
            name: row.name,
            subject: `${row.reference} ${t(row.subjectId)}`,
            detail: t(row.detailId),
            color: row.color
          }))}
        />
      </Grid>

      {/* 11 - new guides */}
      <Grid size={{ xs: 12, md: 4 }}>
        <MediaListCard
          title={<FormattedMessage id="widget.data.guides.title" />}
          items={GUIDE_ROWS.map((row) => ({
            id: row.id,
            title: t(row.titleId),
            meta: `${t('widget.data.media.video')} · ${t(row.timeId)}`,
            icon: PlayCircleOutlined,
            color: row.color
          }))}
        />
      </Grid>

      {/* 12 - activity feed */}
      <Grid size={{ xs: 12, md: 5, lg: 4 }}>
        <FeedListCard
          title={<FormattedMessage id="widget.data.feed.title" />}
          items={FEED_ROWS.map((row) => ({
            id: row.id,
            icon: FEED_ICONS[row.id],
            color: row.color,
            primary: t(row.textId),
            meta: t(row.metaId)
          }))}
        />
      </Grid>

      {/* 13 - top calling regions */}
      <Grid size={{ xs: 12, md: 7, lg: 8 }}>
        <MetricTable
          title={<FormattedMessage id="widget.data.regions.title" />}
          action={viewAll('/reports')}
          ariaLabel={t('widget.data.regions.title')}
          maxHeight={290}
          columns={[
            { id: 'code', label: <FormattedMessage id="widget.data.regions.code" /> },
            { id: 'region', label: <FormattedMessage id="widget.data.regions.region" /> },
            { id: 'number', label: <FormattedMessage id="widget.data.regions.number" /> },
            { id: 'share', label: <FormattedMessage id="widget.data.regions.share" />, align: 'right' }
          ]}
          rows={REGION_ROWS.map((row) => ({
            id: row.id,
            cells: [{ avatar: { text: row.code, color: row.color, label: t(row.nameId) } }, t(row.nameId), row.number, share(row.share)]
          }))}
        />
      </Grid>

      {/* 14 - recent orders */}
      <Grid size={12}>
        <OrderTable
          title={<FormattedMessage id="widget.data.orders.title" />}
          action={viewAll('/billing')}
          ariaLabel={t('widget.data.orders.title')}
          headers={{
            customer: <FormattedMessage id="widget.data.orders.customer" />,
            reference: <FormattedMessage id="widget.data.orders.reference" />,
            item: <FormattedMessage id="widget.data.orders.item" />,
            product: <FormattedMessage id="widget.data.orders.product" />,
            quantity: <FormattedMessage id="widget.data.orders.quantity" />,
            date: <FormattedMessage id="widget.data.orders.date" />,
            status: <FormattedMessage id="widget.data.orders.status" />,
            actions: <FormattedMessage id="widget.data.orders.actions" />
          }}
          labels={{
            edit: t('widget.data.orders.edit'),
            remove: t('widget.data.orders.remove'),
            save: t('widget.data.orders.save'),
            cancel: t('widget.data.orders.cancel'),
            quantity: t('widget.data.orders.quantity')
          }}
          rows={orders.map((row) => ({
            id: row.id,
            customer: row.customer,
            reference: row.reference,
            icon: ORDER_ICONS[row.id],
            color: row.color,
            product: t(row.productId),
            quantity: row.quantity,
            date: day(row.date),
            statusLabel: t(row.statusId),
            statusTone: row.statusTone
          }))}
          onEditQuantity={setQuantity}
          onDelete={removeOrder}
          emptyTitle={<FormattedMessage id="widget.data.orders.empty" />}
        />
      </Grid>

      {/* 15 - incoming requests */}
      <Grid size={{ xs: 12, md: 6, lg: 4 }}>
        <FeedListCard
          marker="dot"
          maxHeight={334}
          title={<FormattedMessage id="widget.data.requests.title" />}
          items={REQUEST_ROWS.map((row) => ({ id: row.id, color: row.color, primary: t(row.textId) }))}
        />
      </Grid>

      {/* 16 - traffic change */}
      <Grid size={{ xs: 12, md: 6, lg: 4 }}>
        <DeltaListCard
          maxHeight={334}
          title={<FormattedMessage id="widget.data.traffic.title" />}
          items={TRAFFIC_ROWS.map((row) => ({
            id: row.id,
            label: t(row.labelId),
            value: minutes(row.minutes),
            direction: row.minutes >= 0 ? 'up' : 'down'
          }))}
        />
      </Grid>

      {/* 17 - new contacts */}
      <Grid size={{ xs: 12, md: 12, lg: 4 }}>
        <PeopleListCard
          maxHeight={334}
          title={<FormattedMessage id="widget.data.contacts.title" />}
          items={CONTACT_ROWS.map((row) => ({
            id: row.id,
            name: row.name,
            secondary: t(row.noteId),
            meta: row.presence ? t(`chat.presence.${row.presence}`) : t(row.metaId),
            metaIcon: row.presence ? undefined : ClockCircleOutlined,
            presence: row.presence,
            presenceLabel: row.presence ? t(`chat.presence.${row.presence}`) : undefined,
            color: row.color
          }))}
        />
      </Grid>

      {/* 18 - recent tickets */}
      <Grid size={{ xs: 12, md: 12, lg: 8 }}>
        <StatusTable
          title={<FormattedMessage id="widget.data.support.title" />}
          ariaLabel={t('widget.data.support.title')}
          headers={{
            subject: <FormattedMessage id="widget.data.support.subject" />,
            department: <FormattedMessage id="widget.data.support.department" />,
            date: <FormattedMessage id="widget.data.support.date" />,
            status: <FormattedMessage id="widget.data.support.status" />
          }}
          rows={TICKET_STATUS_ROWS.map((row) => ({
            id: row.id,
            subject: t(row.subjectId),
            department: t(row.deptId),
            date: t(row.timeId),
            statusLabel: t(row.statusId)
          }))}
        />
      </Grid>

      {/* which component draws which card */}
      <Grid size={12}>
        <MainCard title={<FormattedMessage id="widget.data.map.title" />} subheader={<FormattedMessage id="widget.data.map.note" />}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>
                  <FormattedMessage id="widget.data.map.component" />
                </TableCell>
                <TableCell>
                  <FormattedMessage id="widget.data.map.cards" />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {COMPONENT_MAP.map(([name, id]) => (
                <TableRow key={name}>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    <Typography variant="subtitle2" sx={{ fontFamily: 'monospace' }}>
                      {name}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ color: 'text.secondary' }}>
                    <FormattedMessage id={id} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </MainCard>
      </Grid>
    </Grid>
  );
}

// The point of the rack is to be shopped from, so the last card says which
// component draws which of Mantis's. Three of them are drawn twice: the same
// shape with different data is one component, and a copy made to match a card
// count is two components to keep in step forever.
const COMPONENT_MAP = [
  ['ChecklistCard', 'widget.data.map.checklist'],
  ['ProgressListCard', 'widget.data.map.progress'],
  ['PeopleListCard', 'widget.data.map.people'],
  ['NotificationListCard', 'widget.data.map.notification'],
  ['FeedListCard', 'widget.data.map.feed'],
  ['TaskTimelineCard', 'widget.data.map.timeline'],
  ['MediaListCard', 'widget.data.map.media'],
  ['DeltaListCard', 'widget.data.map.delta'],
  ['AssignmentTable', 'widget.data.map.assignment'],
  ['TicketQueueTable', 'widget.data.map.ticket'],
  ['SummaryTableCard', 'widget.data.map.summary'],
  ['MetricTable', 'widget.data.map.metric'],
  ['OrderTable', 'widget.data.map.order'],
  ['StatusTable', 'widget.data.map.status']
];
