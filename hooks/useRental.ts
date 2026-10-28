"use client";

import {useCallback, useMemo, useState} from "react";
import {
    keepPreviousData,
    useInfiniteQuery,
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import {FetchData} from "@/helpers/FetchData";
import {FiltresCatalogue, RouteRental} from "@/helpers/Route";
import {
    BORNES_PAR_DEFAUT,
    BornesDuree,
    compterParPlaces,
    contenuRental,
    filtrerVehicules,
    MetaPagination,
    ModeTarifaire,
    pageSuivante,
} from "@/helpers/rental";
import {RentalBookingType, RentalSuiviType, RentalVehicleType, TypeCourse} from "@/types/rental";

const CATALOGUE_KEY = "rental:vehicles";
const BOOKINGS_KEY = "rental:bookings";

/**
 * Thalia Trans, cote donnees.
 *
 * Decalque de `hooks/use-rental.tsx` du mobile : memes cles de cache, memes
 * regles de fraicheur, meme deballage. Les erreurs axios sont RETOURNEES par
 * `FetchData`, pas levees : `contenuRental` les transforme en vraie erreur
 * pour que TanStack Query les voie.
 */

/**
 * Les reglages publics de la location.
 *
 * Noms commerciaux, contact hors zone, communes desservies, bornes de duree et
 * delai de prevenance : autant de regles commerciales que le proprietaire
 * regle en administration. Le site ne les reecrit pas, il les lit.
 *
 * Elle se lit sans compte, comme le catalogue, et change rarement : une heure
 * de fraicheur evite de la redemander a chaque fiche ouverte.
 */
export type {TypeCourse} from "@/types/rental";

export interface RentalConfig {
    brand_food?: string;
    brand_rental?: string;
    whatsapp_number?: string;
    out_of_zone_message?: string;
    deposit_percentage?: number;
    towns?: {id: number; slug: string; title: string}[];
    duree?: Partial<BornesDuree>;
    course_types?: TypeCourse[];
}

export const useRentalConfig = () =>
    useQuery({
        queryKey: ["rental:config"],
        queryFn: async () => {
            const reponse = await FetchData.getData(RouteRental.config);

            return contenuRental<RentalConfig>(reponse) ?? {};
        },
        staleTime: 60 * 60 * 1000,
    });

/**
 * Les types de course proposes.
 *
 * Vide tant que la configuration n'est pas arrivee, ou si le referentiel n'en
 * contient aucun : l'ecran n'affiche alors rien de nouveau et la reservation
 * part sans type, comme avant.
 */
export const useTypesCourse = (): TypeCourse[] => useRentalConfig().data?.course_types ?? [];

/** Les bornes en vigueur, repli compris : un seul endroit les derive. */
export const useBornesDuree = (): BornesDuree => {
    const {data} = useRentalConfig();

    return {...BORNES_PAR_DEFAUT, ...(data?.duree ?? {})};
};

/**
 * Les noms commerciaux des deux univers.
 *
 * Ils sont reglables en administration : les ecrire en dur rendrait le reglage
 * du back-office sans effet visible. Le repli vaut les noms actuels, de sorte
 * que rien ne s'affiche vide le temps que la configuration arrive.
 */
export const NOMS_PAR_DEFAUT = {food: "Thalia Eats", rental: "Thalia Trans"};

/**
 * La part payée à la réservation, et le solde qui s'en déduit.
 *
 * Décalque de `useAcompte` du mobile. Le taux vient de l'administration : il
 * était écrit en dur, et annonçait un chiffre quand le réglage en disait un
 * autre. Le repli vaut 20 %, la règle commerciale courante, pour que la
 * phrase reste juste tant que la configuration n'a pas répondu.
 *
 * Le solde n'est jamais une seconde valeur à tenir d'accord : il se déduit.
 */
export const ACOMPTE_PAR_DEFAUT = 20;

export const useAcompte = (): {acompte: number; solde: number} => {
    const {data} = useRentalConfig();
    const brut = data?.deposit_percentage;
    const acompte = typeof brut === "number" && brut > 0 ? brut : ACOMPTE_PAR_DEFAUT;

    return {acompte, solde: 100 - acompte};
};

export const useNomsCommerciaux = () => {
    const {data} = useRentalConfig();

    return {
        food: data?.brand_food?.trim() || NOMS_PAR_DEFAUT.food,
        rental: data?.brand_rental?.trim() || NOMS_PAR_DEFAUT.rental,
    };
};

/**
 * La fiche d'un vehicule.
 *
 * Le creneau fait basculer la reponse : sans lui la fiche se lit, avec lui
 * elle porte le prix et la disponibilite sur ces heures. Il entre dans la cle
 * de cache, sinon changer d'horaire reafficherait le prix du precedent. Le
 * mode y entre pour la meme raison.
 *
 * `keepPreviousData` garde la fiche precedente affichee pendant que la
 * nouvelle cotation arrive : sans lui, chaque appui sur « plus » repassait la
 * page a son squelette et le champ de duree perdait le clavier. Les montants,
 * eux, viennent toujours du serveur.
 */
export const useRentalVehicle = (
    slug?: string,
    debut?: string,
    fin?: string,
    mode: ModeTarifaire = "hourly",
    courseTypeId?: number,
    parking?: boolean,
) =>
    useQuery({
        // Le type et le parking entrent dans la cle pour la meme raison que le
        // mode : ils changent le prix, et sans eux la fiche servirait le devis
        // du type precedent.
        queryKey: ["rental:vehicle", slug, debut, fin, mode, courseTypeId, parking],
        queryFn: async () => {
            const reponse = await FetchData.getData(
                RouteRental.vehicle(slug!, debut, fin, mode, courseTypeId, parking),
            );

            return contenuRental<RentalVehicleType>(reponse);
        },
        enabled: !!slug,
        staleTime: 0,
        placeholderData: keepPreviousData,
    });

export const useRentalBookings = (enabled = true) =>
    useQuery({
        queryKey: [BOOKINGS_KEY],
        queryFn: async () => {
            const reponse = await FetchData.getData(RouteRental.bookings);

            return contenuRental<RentalBookingType[]>(reponse) ?? [];
        },
        enabled,
    });

/**
 * Une reservation precise.
 *
 * `poll` fait relire l'etat toutes les cinq secondes : apres le paiement de
 * l'acompte, c'est le webhook qui tranche, et le site ne peut l'apprendre
 * qu'en relisant. Le sondage s'arrete de lui-meme des que le statut n'est plus
 * `pending_payment`.
 */
/**
 * L'etat de l'acompte, demande a la passerelle.
 *
 * Le webhook ne revient pas toujours : une instance de developpement n'est
 * pas joignable, un reseau le perd. L'ecran d'attente restait alors a tourner
 * sur une reservation que FlexPay savait deja reglee, ou deja perdue.
 *
 * Le serveur interroge FlexPay, confronte reference et montant, puis confirme
 * ou echoue — la meme regle que le webhook, par l'autre porte. Le sondage
 * s'arrete de lui-meme des que le statut n'est plus `pending_payment`.
 */
export const useRentalDepositStatus = (uid?: string, poll = false) =>
    useQuery({
        queryKey: [BOOKINGS_KEY, uid, 'deposit-status'],
        queryFn: async () => {
            const reponse = await FetchData.getData(RouteRental.booking_deposit_status(uid!));

            return contenuRental<RentalBookingType>(reponse);
        },
        enabled: !!uid && poll,
        refetchInterval: (query) =>
            query.state.data?.status === "pending_payment" ? 5000 : false,
    });

export const useRentalBooking = (uid?: string, poll = false) =>
    useQuery({
        queryKey: [BOOKINGS_KEY, uid],
        queryFn: async () => {
            const reponse = await FetchData.getData(RouteRental.booking(uid!));

            return contenuRental<RentalBookingType>(reponse);
        },
        enabled: !!uid,
        refetchInterval: (query) =>
            poll && query.state.data?.status === "pending_payment" ? 5000 : false,
    });

export interface NouvelleReservation {
    vehicle: string;
    starts_at: string;
    ends_at: string;
    /*
     * Le mode choisi, et rien d'autre : jamais un montant. Le serveur le nomme
     * `pricing_mode` et recalcule le prix a partir de lui.
     */
    pricing_mode?: ModeTarifaire;
    pickup_location: string;
    /**
     * La commune de prise en charge, quand on la connait. Le serveur la
     * confronte a la zone desservie et refuse avec `hors_zone`.
     */
    pickup_town_id?: number;
    dropoff_location?: string | null;
    /**
     * Le type de course, son commentaire et l'option parking.
     *
     * Les trois sont facultatifs : sans type, le serveur chiffre et accepte
     * exactement comme avant. Le commentaire devient obligatoire quand LE TYPE
     * le demande — et c'est le serveur qui le refuse, l'ecran ne fait que
     * l'eviter au client.
     */
    course_type_id?: number;
    course_note?: string;
    parking?: boolean;
}

export const useRentalActions = () => {
    const queryClient = useQueryClient();

    const invalider = useCallback(
        () => queryClient.invalidateQueries({queryKey: [BOOKINGS_KEY]}),
        [queryClient],
    );

    /**
     * Le montant n'est jamais envoye : le serveur le recalcule. Le site ne
     * fait que demander un vehicule sur un creneau.
     */
    const reserver = useMutation({
        mutationFn: async (reservation: NouvelleReservation) => {
            const reponse = await FetchData.sendData(RouteRental.bookings, reservation);

            if (reponse?.name === "AxiosError") {
                throw new Error(
                    reponse?.response?.data?.message ??
                        "La réservation n'a pas pu être enregistrée.",
                );
            }

            return contenuRental<RentalBookingType>(reponse)!;
        },
        onSuccess: invalider,
    });

    /**
     * Engage l'acompte. Le retour ne confirme rien : la passerelle debite sur
     * le combine, et c'est le serveur qui tranchera si le creneau est encore
     * libre. La page relit ensuite la reservation.
     */
    const payerAcompte = useMutation({
        mutationFn: async ({
            uid,
            phone,
            method = "mobile",
            ...retours
        }: {
            uid: string;
            phone: string;
            method?: "mobile" | "cart";
            /*
             * Les adresses de retour apres la page de saisie de la carte.
             * Absentes, la passerelle depose le client sur l'accueil du site,
             * et non sur sa course.
             */
            success_url?: string;
            error_url?: string;
            cancel_url?: string;
        }) => {
            const reponse = await FetchData.sendData(RouteRental.booking_deposit(uid), {
                method,
                phone,
                ...retours,
            });

            if (reponse?.name === "AxiosError") {
                throw new Error(
                    reponse?.response?.data?.message ?? "Le paiement n'a pas pu être engagé.",
                );
            }

            return contenuRental<{order_number?: string; url?: string}>(reponse);
        },
    });

    const annuler = useMutation({
        mutationFn: async ({uid, reason}: {uid: string; reason?: string}) => {
            const reponse = await FetchData.sendData(RouteRental.booking_cancel(uid), {reason});

            if (reponse?.name === "AxiosError") {
                throw new Error(
                    reponse?.response?.data?.message ?? "L'annulation n'a pas pu être enregistrée.",
                );
            }

            return contenuRental<RentalBookingType>(reponse)!;
        },
        onSuccess: invalider,
    });

    return {reserver, payerAcompte, annuler, invalider};
};

/**
 * La position du chauffeur et le point de rendez-vous.
 *
 * Separee de la reservation : la position change toutes les dix secondes quand
 * la course roule, la reservation ne bouge pas. Les fondre aurait fait
 * retelecharger le vehicule, les montants et le code de depart a chaque
 * releve.
 *
 * Le rythme suit l'etat. Une course confirmee mais pas commencee n'a aucune
 * raison d'etre interrogee en boucle : le chauffeur n'est pas parti, une
 * lecture a l'ouverture suffit.
 *
 * Aucun garde de premier plan n'est ecrit ici, contrairement au mobile :
 * TanStack Query suspend deja ses intervalles quand l'onglet n'est pas au
 * premier plan (`refetchIntervalInBackground` vaut false par defaut). En
 * ajouter un second serait deux regles a tenir d'accord pour le meme effet.
 */
export const RYTHME_SUIVI = 12000;

export const useRentalSuivi = (uid?: string, actif = false, enCourse = false) =>
    useQuery({
        queryKey: [BOOKINGS_KEY, uid, "suivi"],
        queryFn: async () => {
            const reponse = await FetchData.getData(RouteRental.booking_suivi(uid!));

            return contenuRental<RentalSuiviType>(reponse);
        },
        enabled: !!uid && actif,
        staleTime: 0,
        refetchInterval: enCourse ? RYTHME_SUIVI : false,
    });

/**
 * Recherche, filtrage et pagination du catalogue.
 *
 * Decalque de `use-vehicle-list` du mobile : la recherche est deleguee au
 * serveur, qui accepte `search` comme `/list-restaurant`, et les trois filtres
 * s'appliquent cote client sur le resultat.
 *
 * Le terme fait partie de la cle : changer de recherche repart de la page 1
 * sans qu'on ait a vider quoi que ce soit.
 */
export const useVehicleList = (term: string) => {
    const [dispoOnly, setDispoOnly] = useState(false);
    const [sortPrice, setSortPrice] = useState(false);
    /** Nombre de places minimum, ou null pour tous. */
    const [places, setPlaces] = useState<number | null>(null);

    /*
     * Ces filtres-la partent au SERVEUR : ils entrent donc dans la cle de
     * requete, sans quoi changer de commune rendrait la page deja en cache.
     * Les trois au-dessus restent locaux — ils trient et masquent ce qui est
     * deja descendu, sans rien redemander.
     */
    const [filtres, setFiltres] = useState<FiltresCatalogue>({});

    const query = useInfiniteQuery({
        queryKey: [CATALOGUE_KEY, term, filtres],
        queryFn: async ({pageParam}) => {
            const reponse = await FetchData.getData(
                RouteRental.catalogue(term || undefined, pageParam, filtres),
            );

            // Les erreurs axios sont retournees : `contenuRental` les leve,
            // mais c'est la page entiere qu'il faut ici, `meta` comprise.
            if (reponse?.name === "AxiosError") {
                throw new Error(
                    reponse?.response?.data?.message ?? "Le catalogue n'a pas pu être chargé.",
                );
            }

            return reponse as {data?: RentalVehicleType[]; meta?: Partial<MetaPagination>};
        },
        initialPageParam: 1,
        getNextPageParam: (derniere) => pageSuivante(derniere?.meta),
        // Un vehicule libre il y a une minute peut ne plus l'etre : personne ne
        // le retient tant que l'acompte n'est pas paye.
        staleTime: 0,
    });

    /** Toutes les pages chargees, mises bout a bout. */
    const source: RentalVehicleType[] = useMemo(
        () => (query.data?.pages ?? []).flatMap((page) => page?.data ?? []),
        [query.data],
    );

    const vehicles = useMemo(
        () => filtrerVehicules(source, {dispoOnly, places, sortPrice}),
        [dispoOnly, places, sortPrice, source],
    );

    const placesCounts = useMemo(() => compterParPlaces(source), [source]);

    /*
     * Le compteur vient du serveur, pas de la liste chargee : avec la
     * pagination, `source.length` ne compte que ce qui est descendu jusqu'ici
     * et afficherait « 20 sur 20 » sur un parc de deux cents vehicules.
     */
    const pages = query.data?.pages ?? [];
    const total = pages[pages.length - 1]?.meta?.total ?? source.length;

    const filtreServeurPose = Boolean(
        filtres.cityId || filtres.townIds?.length || filtres.courseTypeId || filtres.proposes,
    );

    const hasActiveFilter = dispoOnly || places !== null || sortPrice || filtreServeurPose;

    const resetFilters = useCallback(() => {
        setDispoOnly(false);
        setPlaces(null);
        setSortPrice(false);
        setFiltres({});
    }, []);

    return {
        vehicles,
        /** Nombre total annonce par le serveur, toutes pages confondues. */
        sourceCount: total,
        /** Nombre de vehicules effectivement charges, pour les compteurs locaux. */
        loadedCount: source.length,
        isLoading: query.isLoading,
        error: query.error,
        refetch: query.refetch,
        fetchNextPage: query.fetchNextPage,
        hasNextPage: query.hasNextPage,
        isFetchingNextPage: query.isFetchingNextPage,
        dispoOnly,
        setDispoOnly,
        sortPrice,
        setSortPrice,
        places,
        setPlaces,
        placesCounts,
        filtres,
        setFiltres,
        hasActiveFilter,
        resetFilters,
    };
};
