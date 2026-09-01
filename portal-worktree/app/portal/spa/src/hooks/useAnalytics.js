import useSWR from 'swr';

async function fetcher(url) {
  const response = await fetch(url, { credentials: 'same-origin', headers: { Accept: 'application/json' } });
  if (response.status === 401) {
    window.location.reload();
    return null;
  }
  if (!response.ok) throw new Error(`analytics request failed (${response.status})`);
  return response.json();
}

// `enabled` exists for the one case a page knows in advance that the request
// cannot succeed - a screen the identity has no permission for. SWR skips a null
// key, so the page renders its forbidden state without also putting a 403 in the
// server log every time somebody opens it.
export default function useAnalytics(url, filters = {}, { enabled = true } = {}) {
  const parameters = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== '' && value !== null && value !== undefined) parameters.set(key, String(value));
  });
  const key = enabled ? `${url}?${parameters}` : null;
  const { data, error, isLoading, isValidating, mutate } = useSWR(key, fetcher, { keepPreviousData: true, revalidateOnFocus: false });
  return { data, error, isLoading, isValidating, refresh: mutate };
}
