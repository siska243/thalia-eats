class Route{
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
    static send_commande =`${this.user}/commande/add`
    static current_commande =`${this.user}/commande/current`
    static valide_commande = `${this.user}/commande/valide`
    static logout = "logout"
    static check_paiement =`${this.user}/commande/check-paiement`
    static traitement_commande =`${this.user}/commande/traitement`
}

export {Route}