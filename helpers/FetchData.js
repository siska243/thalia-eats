import axios, { AxiosError } from "axios";
import { getToken } from "@/server/manageToken";

/**
 * L'adresse de l'API.
 *
 * Elle etait figee sur la production dans les deux branches d'un ternaire —
 * `NODE_ENV === 'production' ? prod : prod` — donc le site en developpement
 * lisait et ecrivait dans la base de production. On comparait alors l'ecran web
 * (production) au mobile (backend local via ngrok) en croyant regarder les
 * memes commandes.
 *
 * Elle etait aussi recopiee ailleurs : le callback FlexPay de la page panier la
 * reecrivait en dur, et pointait encore sur `thalia.cooceckivu.org`, l'ancien
 * domaine. Un webhook de paiement envoye a la mauvaise machine ne revient
 * jamais : la commande reste en attente de reglement pour toujours.
 *
 * `NEXT_PUBLIC_API_BASE_URL` a le dernier mot, pour viser un tunnel ngrok ou un
 * autre port sans toucher au code — c'est la variable a poser dans `.env.local`
 * quand `php artisan serve` ecoute ailleurs que sur 8000.
 */
const API_LOCALE = "http://127.0.0.1:8000/api";
const API_PRODUCTION = "https://app.thaliaeats.com/api";

export const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    (process.env.NODE_ENV === "development" ? API_LOCALE : API_PRODUCTION);

class FetchData {

    BASE_URL = () => API_BASE_URL;

    instance = (contentType) => {
        const http = axios.create({
            baseURL: this.BASE_URL(),
            headers: {
                "X-API-KEY": "2-34x5-s-w9yh5iv7---",
                Accept: "application/json",
                "Content-Type": contentType || 'application/json',
            },
            timeout: 600000,
        });

        http.interceptors.request.use(
            async (config) => {
                const token = await getToken()

                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        return http
    };

    static encodeData = (data) => JSON.stringify(btoa(process.env.encode_data + data))

    static async sendData(url, data) {
        try {
            let $req = new FetchData().instance("application/json");
            const response = await $req
                .post(url, data)
                .then((e) => {
                    return e
                })
                .catch((e) => {

                    return e;

                });

            if (response instanceof AxiosError) {
                if (process.env.NODE_ENV !== "development") console.clear();
                return response;
            }

            return response.data;
        } catch {

            return error;

        }
    }
    static async formData(url, data) {
        try {
            let $req = new FetchData().instance();
            const response = await $req
                .post(url, data)
                .then((e) => {
                    return e;
                })
                .catch((e) => {
                    return e;
                });
            if (response instanceof AxiosError) {
                if (process.env.NODE_ENV !== "development") console.clear();
                return response;
            }
            return response.data;
        } catch {
            return error;
        }
    }
    static async getData(url) {
        try {
            let $req = new FetchData().instance("application/json");
            const response = await $req
                .get(url)
                .then((e) => e)
                .catch((e) => e);
            if (response.name === 'AxiosError') {
                //if (process.env.NODE_ENV != "development") 
                return response;
            }
            return response.data;
        } catch {
            return error
        }
    }
    static async deleteData(url, data, $token) {
        try {
            let $req = new FetchData().instance($token, "application/json");
            const response = await $req
                .delete(url, { data })
                .then((e) => e)
                .catch((e) => e);
            if (response instanceof AxiosError) {
                if (process.env.NODE_ENV !== "development") console.clear();
                return response;
            }
            return response.data;
        } catch { }
    }
    static async putData(url, data, $token) {
        try {
            let $req = new FetchData().instance($token, "application/json");
            const response = await $req
                .put(url, { data })
                .then((e) => e)
                .catch((e) => e);
            if (response instanceof AxiosError) {
                if (process.env.NODE_ENV !== "development") console.clear();
                return response;
            }
            return response.data;
        } catch { }
    }
}


export { FetchData };