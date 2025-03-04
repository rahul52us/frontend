import { useRouter } from 'next/router';

export function useQueryParams() {
  const router = useRouter();

  // Function to get the query parameter
  const getQueryParam = (param: string, defaultValue = null) => {
    const value = router.query[param];

    if (param === 'page' || param === 'limit') {
      const numericValue = Number(value);
      if (!value || isNaN(numericValue) || numericValue <= 0) {
        return param === 'page' ? 1 : 10;
      }
      return numericValue;
    }

    return value || defaultValue;
  };

  // Function to set the query parameter
  const setQueryParam = (param: string, value: string) => {
    const query = { ...router.query }; // Copy current query params
    if (value) {
      query[param] = value;
    } else {
      delete query[param];
    }

    router.push({
      pathname: router.pathname,
      query: query,
    }, undefined, { shallow: true });
  };

  return { getQueryParam, setQueryParam };
}

// If you need to directly use URLSearchParams, you can use this as a custom hook too:
const useQuery = () => {
  return new URLSearchParams(window.location.search);
};

export default useQuery;
