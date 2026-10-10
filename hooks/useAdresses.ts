"use client";

import {useCallback} from "react";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";

import {FetchData} from "@/helpers/FetchData";
import {Route} from "@/helpers/Route";
import type {AdresseEnregistree} from "@/types/adresse";

const CLE = "user:addresses";

export interface NouvelleAdresse {
    adresse: string;
    town: string;
    label?: string | null;
    street?: string | null;
    number_street?: string | null;
    reference?: string | null;
    lat?: number | null;
    long?: number | null;
    is_main?: boolean;
}

/**
 * Le carnet d'adresses du client, porté du mobile.
 *
 * Le site faisait ressaisir l'adresse à chaque commande, en relisant
 * seulement celle de la commande en cours. Les trois routes existaient
 * pourtant déjà côté serveur, et le téléphone s'en servait : c'est le même
 * client, sur le même compte, qui voyait ses adresses d'un côté et rien de
 * l'autre.
 *
 * Les erreurs axios sont retournées par `FetchData`, jamais levées : on les
 * convertit ici, une fois, pour que les écrans n'aient pas à y penser.
 */
const useAdresses = (actif = true) => {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: [CLE],
        queryFn: async () => {
            const reponse = await FetchData.getData(Route.addresses);

            if (reponse?.name === "AxiosError") {
                throw new Error(reponse?.response?.data?.message ?? "Chargement impossible");
            }

            return (reponse?.data ?? []) as AdresseEnregistree[];
        },
        enabled: actif,
    });

    const invalider = useCallback(
        () => queryClient.invalidateQueries({queryKey: [CLE]}),
        [queryClient],
    );

    const enregistrer = useMutation({
        mutationFn: async (adresse: NouvelleAdresse) => {
            const reponse = await FetchData.sendData(Route.addresses, adresse);

            if (reponse?.name === "AxiosError") {
                throw new Error(
                    reponse?.response?.data?.message ?? "L'adresse n'a pas pu être enregistrée.",
                );
            }

            return reponse?.data as AdresseEnregistree;
        },
        onSuccess: invalider,
    });

    const supprimer = useMutation({
        mutationFn: async (slug: string) => {
            const reponse = await FetchData.deleteData(Route.address_delete(slug), null);

            if (reponse?.name === "AxiosError") {
                throw new Error(
                    reponse?.response?.data?.message ?? "L'adresse n'a pas pu être supprimée.",
                );
            }

            return true;
        },
        onSuccess: invalider,
    });

    return {
        adresses: query.data ?? [],
        isLoading: query.isLoading,
        error: query.error,
        invalider,
        enregistrer,
        supprimer,
    };
};

export default useAdresses;
