/**
 * L'adresse de livraison choisie pour une commande.
 *
 * Elle etait declaree `adresse?: string` dans OrderType, alors que le code y
 * range un objet depuis toujours : `price_delivrery` lit `town?.slug`, et le
 * panier fait `JSON.parse` du contenu du stockage local. Le type mentait, et
 * chaque fichier qui le consommait devait le contourner — d'ou une partie des
 * erreurs de types accumulees.
 */
export type AdresseLivraisonType = {
    adresse?: string,
    town?: CommuneType,
    reference?: string,
    street?: string,
    number_street?: string
}

export type OrderType = {
    products: {
        uid: string, quantity: number
    }[],
    adresse?: AdresseLivraisonType,
    pricing: {
        frais_livraison?: number,
        service_price?: number,
        currency: CurrencyType
    },
    total_price: number
}


export type ShopType = {
    product: ProductType,
    quantity: number,
    price: number,
    restaurant: RestaurantType,
    currency?: CurrencyType
}
export type ProductType = {
    "uid": string,
    "title": string,
    "description": null | string,
    "price": number,
    "currency": CurrencyType,
    "promotionnalPrice": null | number,
    "slug": string,
    "picture": string,
    "is_promotional": number | boolean,
    "is_in_forward": number | boolean,
    /**
     * Le stock restant, quand le plat est suivi.
     *
     * `null` veut dire « non suivi » : ni compteur a afficher, ni limite a
     * opposer. C'est l'etat de tout le catalogue d'aujourd'hui, et l'ecran
     * doit alors se comporter exactement comme avant.
     */
    "stock_disponible"?: number | null,
    /** Calcule par le SERVEUR, jamais ici : la regle ne vit qu'a un endroit. */
    "epuise"?: boolean,
    "restaurant": RestaurantType
}

export type RestaurantType = {

    "name": string,
    "adresse": string,
    "slug": string,
    "description": null | string,
    "email": null | string,
    "opens": OpenType[],
    "reference": string,
    "phone": string,
    "whatsapp": string,
    "location": null,
    "commune": CommuneType,
    "image": string,
    /** Distance entre le restaurant et l'adresse de livraison. Null si inconnue. */
    "distance_km"?: number | null,
    /** Faux quand le restaurant est hors du rayon autorisé. Vrai par défaut. */
    "livrable"?: boolean,
    /** La phrase du serveur. Jamais recopiée ici. */
    "portee_message"?: string | null
}
export type OpenType = {
    "day": string,
    "Jour": string,
    "endAt": string,
    "startAt": string
}

export type CommuneType = {
    "uid": string,
    "slug": string,
    "title": string
}

export type CurrencyType = {
    "id": number,
    "title": string,
    "code": string,
    "icon": null | string,
    "slug": string,
    "is_active": number | string,

}
/** Ce que renvoie `GET /api/default` : communes et grille tarifaire. */
export type DefaultDataType = {
    town?: CommuneType[],
    delivrery_price?: {
        town: CommuneType,
        interval_pricing: number,
        interval_max_price: number,
        frais_livraison: number,
        service_price: number,
        currency: CurrencyType
    }[]
}
