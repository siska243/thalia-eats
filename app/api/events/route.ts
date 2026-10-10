// app/api/events/route.ts
import { NextRequest } from "next/server";

/**
 * Le canal de notification de paiement, pousse par le webhook du backend.
 *
 * Le GET a ete RETIRE. Il ouvrait un flux SSE a n'importe quel visiteur, sans
 * jeton ni verification, et le POST diffusait la charge utile recue a TOUS les
 * flux ouverts : le resultat de paiement d'un client partait chez tous les
 * autres, numero de commande compris. Chaque connexion gardait en plus son
 * controleur dans un tableau de module, que rien ne bornait.
 *
 * Personne ne l'ecoutait : le seul composant qui ouvrait un `EventSource`
 * (`components/commons/SSEClient.jsx`) n'etait monte dans aucune page, et le
 * suivi de paiement se fait par `providers/usswr-polling.tsx`, qui interroge
 * l'API authentifiee. Le retirer ne coupe donc aucun ecran.
 *
 * Le POST est conserve et repond 200 : `SSE_WEBHOOK_URL` peut encore pointer
 * ici en production, et un webhook de paiement qui recevrait un 404 ferait
 * remonter une alerte pour rien. Il ne retransmet plus rien a personne.
 */
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
    // La charge utile est lue puis jetee : la consommer evite que l'appelant
    // voie sa connexion coupee avant la fin de l'envoi.
    try {
        await request.text();
    } catch {
        // Un corps illisible ne change rien a la reponse.
    }

    return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}
