import useSWR from 'swr';

import { DASHBOARD_REFRESH_INTERVAL } from '../config';
import { useMphoneDataProvider } from '../contexts/DataProviderContext';

export default function useDashboardData(hours = 24, direction = '') {
  const provider = useMphoneDataProvider();
  const key = ['mphone-ui-dashboard', provider.mode, hours, direction];
  const { data, error, isLoading, isValidating, mutate } = useSWR(key, () => provider.getDashboard({ hours, direction }), {
    refreshInterval: DASHBOARD_REFRESH_INTERVAL,
    revalidateOnFocus: true,
    keepPreviousData: true
  });

  return { data, loading: isLoading && !data, refreshing: isValidating && Boolean(data), error, refresh: mutate };
}
