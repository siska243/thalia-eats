"use client"
import { useEffect, useState } from "react";
import { GoogleMap, Marker, useLoadScript, DirectionsRenderer } from "@react-google-maps/api";
import useReferentialData from "@/hooks/useQueryTanStack";
import {Route} from "@/helpers/Route";
import useHookAddressToLnAndLat from "@/hooks/useHookAdressToLnAndLat";

const containerStyle = {width: "100%", height: "100%"};

/**
 * Le centre par defaut : le centre de Kinshasa.
 *
 * Sans lui, `center` valait `null` tant qu'aucune position n'etait connue, et
 * Google Maps affichait le planisphere entier — une carte du monde a la place
 * du suivi de livraison.
 */
const KINSHASA = {lat: -4.3217, lng: 15.3125};

type PositionType = {lat: number; lng: number};

type TrackType = {
    location_customer?: PositionType;
    location_delivery?: PositionType;
};


type CommandeSuivieType = {
    uid?: string;
    reference?: string;
    user_delivery_complet_adress?: string;
};

export default function TrackingPage({currentOrder}: {currentOrder?: CommandeSuivieType | null}) {

    const {data} = useReferentialData<TrackType>({
        url: Route.get_track_uid(currentOrder?.uid ?? ""),
        queryKey:"get-tracking-by-uuid",
        params:{uid:currentOrder?.uid},
        enabled:!!currentOrder?.uid,
        refetchInterval: currentOrder?.uid ? 5000 : false,
        staleTime: 0,
    })

    const {converterAddressToLatLng}=useHookAddressToLnAndLat()

    /*
     * La position du livreur n'est pas un etat : c'est ce que renvoie le suivi,
     * interroge toutes les cinq secondes. La recopier dans un `useState` via un
     * effet ajoutait un rendu supplementaire a chaque sondage, et une image de
     * retard sur la position affichee.
     */
    const driverPosition = data?.location_delivery ?? null;
    const [clientPosition, setClientPosition] = useState<{ lat: number; lng: number } | null>(null);

    const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);

    const [distance, setDistance] = useState<string | null>(null);
    const [duration, setDuration] = useState<string | null>(null);

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!,
        libraries: ['places'],
    });
    

    useEffect(()=>{

        if(currentOrder?.user_delivery_complet_adress){
            converterAddressToLatLng(currentOrder?.user_delivery_complet_adress).then((res) => {
                if (res?.lat != null && res?.lng != null) {
                    setClientPosition({lat: res.lat, lng: res.lng});
                }
            })
        }
        // `converterAddressToLatLng` est recree a chaque rendu du hook : l'ajouter
        // aux dependances relancerait le geocodage en boucle.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[currentOrder])




    useEffect(() => {
        if (!driverPosition || !isLoaded) return;
        const directionsService = new window.google.maps.DirectionsService();

        directionsService.route(
            {
                origin: driverPosition,
                destination: data?.location_customer ?? clientPosition ?? KINSHASA,
                travelMode: window.google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
                if (status === window.google.maps.DirectionsStatus.OK && result) {
                    setDirections(result);

                    const leg = result.routes[0]?.legs[0];
                    setDistance(leg?.distance?.text || null);
                    setDuration(leg?.duration?.text || null);
                }
            }
        );
    }, [driverPosition, isLoaded, currentOrder, data, clientPosition]);


    return (
        <div className="p-4 sm:p-5">
            {!isLoaded ? (
                <div className="flex h-[320px] items-center justify-center rounded-card bg-surface-sunken text-body text-ink-muted">
                    Chargement de la carte…
                </div>
            ) : (
                <>
                    {distance && duration ? (
                        <p className="mb-4 text-caption text-ink-muted">
                            Commande{" "}
                            <span className="font-bold text-secondaryColor">
                                #{currentOrder?.reference}
                            </span>{" "}
                            · {distance} restants · environ {duration}
                        </p>
                    ) : null}

                    <div className="h-[320px] overflow-hidden rounded-card sm:h-[420px] lg:h-[500px]">
                    <GoogleMap
                        mapContainerStyle={containerStyle}
                        center={driverPosition ?? clientPosition ?? KINSHASA}
                        zoom={driverPosition ? 14 : 12}
                    >
                        {driverPosition && (
                            <Marker
                                position={driverPosition}
                                icon={{
                                    url: "/assets/delivery-ride.png",
                                    scaledSize: new window.google.maps.Size(80, 80),
                                }}
                            />
                        )}
                        {data?.location_customer ?? clientPosition ? (
                            <Marker position={(data?.location_customer ?? clientPosition)!} />
                        ) : null}
                        {directions && (
                            <DirectionsRenderer
                                directions={directions}
                                options={{
                                    suppressMarkers: true,
                                    //polylineOptions: { strokeColor: "#00b300", strokeWeight: 5 }
                                }}
                            />
                        )}
                    </GoogleMap>
                    </div>
                </>

            )}
        </div>
    );
}
