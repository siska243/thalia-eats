import useReferentialData from './useQueryTanStack'
import { Route } from '@/helpers/Route'

/** La commande en cours du client, s'il en a une. */
export default function useCurrentCommande() {
    return useReferentialData({ url: Route.current_commande, queryKey: 'current-commande' })
}
