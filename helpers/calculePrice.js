import { MdOutlineBorderVertical } from "react-icons/md"

// export const calcul_price = (products = []) => {
//     const sum = products.reduce((accumulator, object) => {
//         return accumulator + (object.quantity * object.product.price)
//     }, 0)

//     return sum
// }
export const calcul_price = (products = []) => {
    const sum = products.reduce((accumulator, object) => {
        return accumulator + (object.quantity * object.product.price);
    }, 0);

    return parseFloat(sum.toFixed(2));
}

export const price_delivrery = (valeurRecherchee, tableauObjets = [], town) => {

    let valeurLaPlusProcheInferieure = null;

    const findPricing = tableauObjets?.filter((e) => e?.town?.slug == town);

    if (findPricing) {
        findPricing.forEach((objet) => {
            const valeurObjet = objet?.interval_pricing;

            if (valeurObjet < valeurRecherchee) {
                if (
                    valeurLaPlusProcheInferieure === null ||
                    valeurRecherchee - valeurObjet <
                    valeurRecherchee - valeurLaPlusProcheInferieure
                ) {
                    valeurLaPlusProcheInferieure = valeurObjet;
                }
            }
        });
    }

    const princing = tableauObjets.find(
        (e) => e.interval_pricing == valeurLaPlusProcheInferieure
    );

    return princing ? princing : null;
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
