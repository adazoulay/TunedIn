import { useState, useEffect, useCallback, useMemo } from "react";

const calculateMaxPages = (total, size) => {
  return Math.ceil(total / size);
};

export const isValidNotEmptyArray = (array) => {
  return !!(array && array.length && array.length > 0);
};

const useInfiniteScroll = (useGetDataListQuery, { size = 10, ...queryParameters }) => {
  const [localPage, setLocalPage] = useState(1);
  const [combinedData, setCombinedData] = useState([]);
  const queryResponse = useGetDataListQuery({
    page: localPage,
    size,
    ...queryParameters,
  });

  const {
    items: fetchData = [],
    page: remotePage = 1,
    total: remoteTotal = 0,
    size: remoteSize = 10,
  } = queryResponse?.data;

  useEffect(() => {
    if (isValidNotEmptyArray(fetchData)) {
      if (localPage === 1) setCombinedData(fetchData);
      else if (localPage === remotePage) {
        setCombinedData((previousData) => [...previousData, ...fetchData]);
      }
    }
  }, [fetchData]);

  const maxPages = useMemo(() => {
    return calculateMaxPages(remoteTotal, remoteSize);
  }, [remoteTotal, remoteSize]);

  const refresh = useCallback(() => {
    setLocalPage(1);
  }, []);

  const readMore = () => {
    if (localPage < maxPages && localPage === remotePage) {
      setLocalPage((page) => page + 1);
    }
  };

  return {
    combinedData,
    localPage,
    readMore,
    refresh,
    isLoading: queryResponse?.isLoading,
    isFetching: queryResponse?.isFetching,
  };
};

export default useInfiniteScroll;
