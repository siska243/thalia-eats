import { FetchData } from '@/helpers/FetchData';
import { useQuery, UseQueryResult as ReactQueryResult } from '@tanstack/react-query';


interface Props {
    url: string;
    queryKey: string;
    params?: string;
}

interface UseQueryResult {
    data?: any;
    error: any;
    isLoading: boolean;
}

// Define `T` as a generic parameter for fetchData and useReferentialData
const fetchData = async <T>(url: string): Promise<T> => {
    const response = await FetchData.getData(url);

    if (response.name === 'AxiosError') {
        return Promise.reject(new Error(response.response?.data.message || 'An error occurred'));
    }

    return response;
};

/**
 * Hook pour récupérer des données avec react-query
 * @param url - URL de l'API à appeler
 * @param queryKey - Clé de cache pour react-query
 * @param params - Paramètres supplémentaires pour la requête
 * @returns Un objet avec les données, l'erreur et l'état de chargement
 */
const useReferentialData = <T,>({ url, queryKey, params,...rest }: Props): ReactQueryResult<T,Error> => {
    return useQuery<T, Error>({
        queryKey: [queryKey, params],
        queryFn: () => fetchData<T>(url),
        ...rest
    });

};

export default useReferentialData;