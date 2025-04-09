class Route
{
    static user="user"
    static me=`${this.user}/account`
    static login="auth/login"
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
    // pour suivre mes commandes
    static traitement_commande =`${this.user}/commande/traitement`

    // pour supprimer un produit dans la commande
    static delete_produit_commande =`${this.user}/commande/delete-product`
    // pour voir l'historique de mes commandes
    static historique_commande =`${this.user}/commande/tracking`
    // pour suivre ma commande
    static tracking_commande =`${this.user}/commande/tracking`
    static cart_checkout_commande = `${this.user}/commande/valide`
    static swr_check_paiement =(params:string)=>`${this.user}/commande/swr-check-paiement/${params}`
    
}

export {Route}