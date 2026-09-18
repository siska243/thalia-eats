import {useEffect, useState} from "react";

const useHookAddressToLnAndLat = () => {

    const [lat, setLat] = useState<number | null>(null);
    const [lng, setLng] = useState<number | null>(null);

    const converterAddressToLatLng = async (address: string) => {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;

        const response = await fetch(url, {
            headers: {
                "User-Agent": "TonApp/1.0"
            }
        });
        const data = await response.json();

        if (data.length > 0) {
            return {
                lat: parseFloat(data[0].lat),
                lng: parseFloat(data[0].lon)
            };
        } else {

            return {
                lat,
                lng
            };
           // throw new Error("Adresse introuvable");
        }
    }


    function getCurrentLocation(): Promise<{lat: number; lng: number}> {
        return new Promise((resolve, reject) => {
            if (!("geolocation" in navigator)) {
                return reject(new Error("La géolocalisation n'est pas supportée."));
            }

            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    resolve({
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude
                    });
                },
                (err) => reject(err)
            );
        });
    }

    useEffect(() => {
        (async () => {
            try {
                const coords = await getCurrentLocation();

                setLat(coords.lat)
                setLng(coords.lng)
            } catch (e) {
                console.error("Position indisponible", e);
            }
        })();
    }, []);

    return {
        converterAddressToLatLng
    }
}

export default useHookAddressToLnAndLat