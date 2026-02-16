import { useQuery } from '@tanstack/react-query';
import { depositService } from '../../../../services/api';

export const useDeposits = () => {
    const { data, isLoading, isFetching, refetch } = useQuery({
        queryKey: ['deposits'],
        queryFn: () => depositService.getAll(),
        placeholderData: []
    })

    return {
        deposits: data?.data || [],
        refetch,
        loading: isLoading || isFetching
    };
};
