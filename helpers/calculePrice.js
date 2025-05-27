import * as dayjs from 'dayjs'
import 'dayjs/locale/fr'
dayjs.locale('fr')
export const calcul_price = (products = []) => {

    let sum=0
    if(products && products.length>0){

        products?.forEach(item=>{
            sum+=item.quantity*item.price
        })

    }

    return parseFloat(sum.toFixed(2));

}

export const dateTimeFormat=(date)=>{
    if(!date){
        return date
    }

    return dayjs(new Date(date)).format('DD/MM/YYYY H:m:s')

}

export const dateFormat=(date)=>{
    if(!date){
        return date
    }

    return dayjs(new Date(date)).format('DD/MM/YYYY')

}

export const calcul_quantity = (products = []) => {

    let sum=0
    if(products && products.length>0){

        products?.forEach(item=>{
            sum+=item.quantity
        })

    }

    return sum;

}

export const price_delivrery = (current_price, town_pricings = [], town) => {

    const filterPricing=town_pricings?.filter(item=>item.town.slug===town?.slug)

    if(filterPricing?.length>0){
        const findPricing = filterPricing.find(
            item => current_price >= item.interval_pricing && current_price <= item.interval_max_price
        );

        return {
            frais_livraison:findPricing?.frais_livraison ?? 0,
            service_price:findPricing.service_price ?? 0,
            currency:findPricing?.currency ?? null
        }
    }

    return null

}

export const total = (sous_price, service, livraison) => {

    return sous_price + (service ? service : 0) + (livraison ? livraison : 0)
}
// fonction pour recuperer le frais de livraison

export const customProduct = (ordering = []) => {
    const tabs = [];
    ordering.forEach(item => {
        tabs.push({ uid: item.product.uid, quantity: item.quantity })
    })

    return tabs;
}

export const smoothScroll=(targetId,timeout=200)=>{
    setTimeout(() => {
        document.getElementById(targetId)?.scrollIntoView({behavior: 'smooth'});
    }, timeout)
}
