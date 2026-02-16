import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export type PaginationParams = {
    page: number;
    perPage: number;
    search: string;
};

export const usePaginatedQuery = ({
    queryKey,
    queryFn
}: {
    queryKey: any[],
    queryFn: (params: PaginationParams) => Promise<any>
}) => {

    const [currentPage, setCurrentPage] = useState(1);
    const [first, setFirst] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [search, setSearch] = useState<string>("");

    const {
        data,
        isLoading,
        isFetching,
        error,
        refetch
    } = useQuery({
        queryKey: [...queryKey, currentPage, perPage, search],
        queryFn: () => queryFn({
            page: currentPage,
            perPage,
            search
        }),
        staleTime: 5 * 60 * 1000, // 5 minutos - los datos se consideran frescos durante este tiempo
        gcTime: 10 * 60 * 1000, // 10 minutos - tiempo que los datos permanecen en caché sin usar
    });

    const handlePageChange = (pageEvent: any) => {
        const calculatedPage = Math.floor(pageEvent.first / pageEvent.rows) + 1;
        setFirst(pageEvent.first);
        setPerPage(pageEvent.rows);
        setCurrentPage(calculatedPage);
    };

    const handleSearchChange = (_search: string) => {
        setSearch(_search);
        setCurrentPage(1);
        setFirst(0);
    };

    return {
        data,
        isLoading,
        isFetching,
        error,
        refetch,
        handlePageChange,
        handleSearchChange,
        currentPage,
        search,
        first,
        perPage
    };
};