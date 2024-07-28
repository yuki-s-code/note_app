// usePagination.ts
import { useState } from 'react';

const usePagination = (initialPage: number) => {
  const [page, setPage] = useState(initialPage);

  const nextPage = () => {
    setPage(prevPage => prevPage + 5);
  };
  const resetPage = () => {
    setPage(initialPage);
  };

  return { page, nextPage, resetPage };
};

export default usePagination;