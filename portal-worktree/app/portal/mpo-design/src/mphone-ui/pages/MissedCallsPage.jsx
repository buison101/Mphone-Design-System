import { useMemo } from 'react';
import { useIntl } from 'react-intl';

import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined';
import ClockCircleOutlined from '@ant-design/icons/ClockCircleOutlined';
import RedoOutlined from '@ant-design/icons/RedoOutlined';
import WarningOutlined from '@ant-design/icons/WarningOutlined';
import Grid from '@mui/material/Grid';

import RoundIconCard from 'components/cards/statistics/RoundIconCard';
import useMissedCallsData from '../hooks/useMissedCallsData';

function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

export default function MissedCallsPage() {
  const intl = useIntl();
  const parameters = useMemo(() => {
    const to = new Date();
    const from = new Date(to.getTime() - 29 * 86400000);
    return { from: formatDate(from), to: formatDate(to), page: 1, page_size: 20 };
  }, []);
  const { data } = useMissedCallsData(parameters);
  const kpis = data?.kpis ?? {};
  const cards = [
    {
      title: 'open',
      value: kpis.open,
      caption: 'openCaption',
      icon: ClockCircleOutlined,
      color: 'warning.main',
      bgcolor: 'warning.lighter'
    },
    {
      title: 'overdue',
      value: kpis.overdue,
      caption: 'overdueCaption',
      icon: WarningOutlined,
      color: 'error.main',
      bgcolor: 'error.lighter'
    },
    {
      title: 'calledBack',
      value: kpis.called_back,
      caption: 'calledBackCaption',
      icon: RedoOutlined,
      color: 'primary.main',
      bgcolor: 'primary.lighter'
    },
    {
      title: 'resolved',
      value: kpis.resolved,
      caption: 'resolvedCaption',
      icon: CheckCircleOutlined,
      color: 'success.main',
      bgcolor: 'success.lighter'
    }
  ];

  return (
    <Grid container rowSpacing={4.5} columnSpacing={3}>
      {cards.map((card) => (
        <Grid key={card.title} size={{ xs: 12, sm: 6, lg: 3 }}>
          <RoundIconCard
            primary={intl.formatMessage({ id: `mphoneUi.missedCalls.${card.title}` })}
            secondary={card.value == null ? '—' : String(card.value)}
            content={intl.formatMessage({ id: `mphoneUi.missedCalls.${card.caption}` })}
            iconPrimary={card.icon}
            color={card.color}
            bgcolor={card.bgcolor}
          />
        </Grid>
      ))}
    </Grid>
  );
}
