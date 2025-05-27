"use client"
import { useEffect, useState } from "react";
import { GoogleMap, Marker, useLoadScript, DirectionsRenderer } from "@react-google-maps/api";
import {useQuery} from "@tanstack/react-query";
import useReferentialData from "@/hooks/useQueryTanStack";
import {Route} from "@/helpers/Route";
import {Badge} from "rizzui";

const containerStyle = { width: "100%", height: "500px" };


const CLIENT_POSITION = { lat: 48.858370, lng: 2.294481 };

const DRIVER_POSITION = { lat: 49.868370, lng: 2.294481 };

export default function TrackingPage({currentOrder}:{currentOrder:any}) {

    const {data,isLoading}=useReferentialData({
        url:Route.get_track_uid(currentOrder?.uid),
        queryKey:"get-tracking-by-uuid",
        params:{uid:currentOrder?.uid},
        enabled:!!currentOrder?.uid,
        refetchInterval: currentOrder?.uid ? 5000 : false,
        staleTime: 0,
    })


    const [driverPosition, setDriverPosition] = useState<{ lat: number; lng: number } | null>(null);

    const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);

    const [distance, setDistance] = useState<string | null>(null);
    const [duration, setDuration] = useState<string | null>(null);

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!,
        libraries: ['places'],
    });


    useEffect(() => {
        if (!driverPosition || !isLoaded) return;
        const directionsService = new window.google.maps.DirectionsService();

        directionsService.route(
            {
                origin: driverPosition,
                destination: data?.location_customer,
                travelMode: window.google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
                if (status === window.google.maps.DirectionsStatus.OK) {
                    setDirections(result);

                    const leg = result.routes[0]?.legs[0];
                    setDistance(leg?.distance?.text || null);
                    setDuration(leg?.duration?.text || null);
                }
            }
        );
    }, [driverPosition, isLoaded,currentOrder]);



    useEffect(() => {

        if(data?.location_delivery){
            setDriverPosition(data.location_delivery)
        }
    }, [data]);


    return (
        <div>
            {!isLoaded ? (
                <div>Chargement de la carte…</div>
            ) : (
                <>
                    <div style={{marginBottom: 16, fontWeight: "bold"}}>
                        {distance && duration && (
                            <span>
                           Commande : <span className={"font-semibold text-[#e24713]"}>#{currentOrder?.reference} </span> Distance restante : {distance} | Temps estimé : {duration}
                        </span>
                        )}
                    </div>
                    <GoogleMap
                        mapContainerStyle={containerStyle}
                        center={driverPosition || CLIENT_POSITION}
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
                        <Marker
                            position={CLIENT_POSITION}
                        />
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
                </>

            )}
        </div>
    );
}
