import { UserSpecialtyDto } from '../../models/models';
import { userSpecialtyService } from '../../../services/api';
import { ErrorHandler } from '../../../services/errorHandler';
import { useQuery } from '@tanstack/react-query';

export const useUserSpecialties = () => {
    const { data, isLoading, isFetching, refetch } = useQuery({
        queryKey: ['userSpecialties'],
        queryFn: () => fetchUserSpecialties(),
        placeholderData: []
    });

    const fetchUserSpecialties = async () => {
        try {
            const data = await userSpecialtyService.getAll();
            const mappedData = data.map((item: UserSpecialtyDto) => {
                return {
                    ...item,
                    label: item.name,
                };
            })
            return mappedData;
        } catch (err) {
            ErrorHandler.generic(err);
        }
    };

    return {
        userSpecialties: data,
        fetchUserSpecialties: refetch,
        loading: isLoading || isFetching
    };
};