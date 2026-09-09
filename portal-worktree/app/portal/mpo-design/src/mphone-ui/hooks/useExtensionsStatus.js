import useSWR from 'swr';

import { EXTENSIONS_REFRESH_INTERVAL } from '../config';
import { useMphoneDataProvider } from '../contexts/DataProviderContext';

export default function useExtensionsStatus() {
  const provider = useMphoneDataProvider();
  const { data, error, isLoading, isValidating, mutate } = useSWR(['mphone-ui-extensions', provider.mode], () => provider.getExtensions(), {
    refreshInterval: EXTENSIONS_REFRESH_INTERVAL,
    revalidateOnFocus: true,
    keepPreviousData: true
  });

  return { data, loading: isLoading && !data, refreshing: isValidating && Boolean(data), error, refresh: mutate };
}
