import useSWR from 'swr';

import { useMphoneDataProvider } from '../contexts/DataProviderContext';

export default function useMissedCallsData(parameters) {
  const provider = useMphoneDataProvider();
  const key = ['mphone-ui-missed-calls', provider.mode, parameters];
  const { data, error, isLoading, isValidating, mutate } = useSWR(key, () => provider.getMissedCalls(parameters), {
    revalidateOnFocus: true,
    keepPreviousData: true
  });
  return { data, loading: isLoading && !data, refreshing: isValidating && Boolean(data), error, refresh: mutate };
}
