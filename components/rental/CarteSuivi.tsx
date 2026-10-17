"use client";

import React from "react";
import CarteConsentie from "@/components/commons/CarteConsentie";
import {GoogleMap, Marker, useLoadScript} from "@react-google-maps/api";
import {FaRoute} from "react-icons/fa6";

import {distanceDuChauffeur, pointCarte} from "@/helpers/rental";
import {useRentalSuivi} from "@/hooks/useRental";
import {RentalBookingStatus} from "@/types/rental";

/** Assez serré pour reconnaître une rue, assez large pour voir arriver. */
const ZOOM = 14;

interface Props {
    uid: string;
    status?: RentalBookingStatus | null;
}

/**
 * Où en est la voiture.
 *
 * La carte apparaît dès que la course est payée : à ce moment-là le client a
 * un rendez-vous, et le point de prise en charge est l'information utile.
 * Pendant la course, la voiture s'y ajoute et avance, avec la distance qui la
 * sépare encore du point de rendez-vous.
 *
 * On n'invente jamais de voiture. Tant que le serveur ne renvoie pas de
 * position, aucun marqueur n'est posé : un véhicule immobile au mauvais
 * endroit est pire qu'un véhicule absent — le client l'attendrait là.
 *
 * Avant le départ, l'absence de position est normale et le bloc se tait. Une
 * fois la course commencée elle ne l'est plus, et il le dit.
 *
 * Pas d'écran « plan en plein écran » comme sur le mobile : dans un navigateur
 * la carte se manipule déjà sur place, elle ne vole aucun geste de défilement,
 * et un second écran n'apporterait rien.
 */
function CarteSuiviGoogle({uid, status}: Props) {
    const enCourse = status === "in_progress";

    const {data: suivi} = useRentalSuivi(uid, true, enCourse);

    const {isLoaded} = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!,
    });

    const pickup = pointCarte(suivi?.pickup);
    const chauffeur = pointCarte(suivi?.chauffeur);

    if (!pickup && !chauffeur) return null;

    // La carte suit ce qui bouge : la voiture quand elle est là, le point de
    // rendez-vous sinon.
    const centre = chauffeur ?? pickup!;
    const distance = distanceDuChauffeur(suivi);

    return (
        <section className="overflow-hidden rounded-card bg-surface shadow-card">
            <div className="h-[220px] w-full sm:h-[280px]">
                {isLoaded ? (
                    <GoogleMap
                        mapContainerStyle={{width: "100%", height: "100%"}}
                        center={centre}
                        zoom={ZOOM}
                        options={{streetViewControl: false, mapTypeControl: false}}
                    >
                        {pickup ? (
                            <Marker position={pickup} title="Point de prise en charge" />
                        ) : null}

                        {chauffeur ? (
                            <Marker
                                position={chauffeur}
                                title="Votre chauffeur"
                                icon={{
                                    path: google.maps.SymbolPath.CIRCLE,
                                    scale: 9,
                                    fillColor: "#F99D1C",
                                    fillOpacity: 1,
                                    strokeColor: "#FFFFFF",
                                    strokeWeight: 3,
                                }}
                            />
                        ) : null}
                    </GoogleMap>
                ) : (
                    <div className="flex h-full items-center justify-center bg-surface-sunken text-body text-ink-muted">
                        Chargement de la carte…
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-1 p-3.5">
                {chauffeur && distance ? (
                    <p className="flex items-center gap-2 text-body text-ink">
                        <FaRoute className="shrink-0 text-ink-muted" aria-hidden />
                        Votre chauffeur est à <strong className="font-bold">{distance}</strong> du
                        point de prise en charge.
                    </p>
                ) : enCourse ? (
                    /* En course, une position manquante n'est pas normale : on
                       le dit plutôt que de laisser le client guetter une
                       voiture que la carte ne montre pas. */
                    <p className="text-body text-ink-muted">
                        Position du chauffeur indisponible pour le moment.
                    </p>
                ) : (
                    /* Avant le départ, c'est normal : rien d'alarmant à dire. */
                    <p className="text-body text-ink-muted">Votre point de prise en charge.</p>
                )}

                {suivi?.pickup?.label ? (
                    <p className="line-clamp-2 text-caption text-ink-subtle">
                        {suivi.pickup.label}
                    </p>
                ) : null}
            </div>
        </section>
    );
}

/**
 * La carte de suivi d'une course, sous consentement.
 *
 * Même garde que la carte de livraison : le composant interne n'est monté
 * qu'avec l'accord, donc le script de Google n'est chargé qu'à ce
 * moment-là.
 */
export default function CarteSuivi(props: Props) {
    return (
        <CarteConsentie hauteur="h-80">
            <CarteSuiviGoogle {...props} />
        </CarteConsentie>
    );
}
