export type OrderType = {
    products: {
        uid: string, quantity: number
    }[],
    adresse?: string,
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
    "image": string
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