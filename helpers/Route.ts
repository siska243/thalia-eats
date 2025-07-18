class Route
{
    static user="user"
    static me=`${this.user}/account`
    static login="login"
    static register="register"
    static list_restaurant="list-restaurant";
    static slug_restaurant=(slug:string):string=>`${this.list_restaurant}/${slug}`
    static categorie="categorie"
    static categorie_restaurant =(slug:string):string=>`categorie-restaurant/${slug}`
    // static menu_product_restaurant=(slugRestaurant:string,slugProduct:string)=>`menu/${slugRestaurant}/${slugProduct}`
    static default="default"
    static produits_a_la_une="default/preview"
    static send_expo_token=`${this.user}/update/expo/token`
  
    static logout = "auth/logout"
    // mise à jour des informations de l'utilisateur
    static update_adresse =`${this.me}/update/adresse`
    static update_password =`${this.me}/update/password`
    // traitement commande

    static send_commande =`${this.user}/commande/add`
    static current_commande =`${this.user}/commande/current`
    static valide_commande = `${this.user}/commande/valide`
    static check_paiement =`${this.user}/commande/check-paiement`
    static cancel_paiement=`${this.user}/commande/cancel`
    // pour suivre mes commandes
    static traitement_commande =`${this.user}/commande/traitement`

    //
    static get_track_uid=(uid:string)=>`${this.user}/commande/get-track/${uid}`

    // pour supprimer un produit dans la commande
    static delete_produit_commande =`${this.user}/commande/delete-product`
    static add_produit_commande =`${this.user}/commande/add-product`
    // pour voir l'historique de mes commandes
    static historique_commande =`${this.user}/commande/past`
    // pour suivre ma commande
    static tracking_commande =`${this.user}/commande/tracking`
    static cart_checkout_commande = `${this.user}/commande/valide`

    static update_address_delivery=`${this.user}/commande/update-address-delivery`
    static swr_check_paiement =(params:string)=>`${this.user}/commande/swr-check-paiement/${params}`
    
}

export {Route}