
import axios, { AxiosError } from "axios";
import { getToken as token } from "@/server/manageToken";
class FetchData {
    BASE_URL = () => process.env.NODE_ENV === 'production' ? 'https://thalia.cooceckivu.org/api' : "https://thalia.cooceckivu.org/api";
    //BASE_URL = () => "https://admin.rdvmonde.com/api/v1";

    async getToken() {
        return await token();
    }


    instance = (contentType) => {
        const http = axios.create({
            baseURL: this.BASE_URL(),
            headers: {
                "X-API-KEY": "2-34x5-s-w9yh5iv7---",
                Accept: "*/*",
                "Content-Type": contentType || 'application/json',
            },
            timeout: 600000,
        });

        http.interceptors.request.use(
            async (config) => {
                const token = await new FetchData().getToken()

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
        } catch (error) {

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
        } catch (error) {
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
        } catch (error) {
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
        } catch (error) { }
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
        } catch (error) { }
    }
}


export { FetchData };