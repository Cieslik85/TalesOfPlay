import { useState } from 'react';

const usePagination = (initialPage = 1) => {
    const [page, setPage] = useState(initialPage);

    const nextPage = () => setPage((p) => p + 1);
    const prevPage = () => setPage((p) => Math.max(1, p - 1));
    const goToPage = (p) => setPage(p);
    const reset = () => setPage(initialPage);

    return { page, nextPage, prevPage, goToPage, reset, setPage };
};

export default usePagination;