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
    // chiffrage serveur : plat + livraison + service
    static quote="quote"
    static products_search="products/search"
    static budget_suggestions="budget-suggestions"
    static send_expo_token=`${this.user}/update/expo/token`

    // Assistants connectes (Claude, ChatGPT...). Le client les liste et les
    // revoque depuis son compte : un acces qu'on ne peut pas retirer n'est pas
    // un acces qu'on accorde volontiers.
    static assistants=`${this.user}/assistants`
    static assistant_delete=(uid:string):string=>`${this.user}/assistants/${uid}`
  
    /*
     * La confirmation d'adresse, apres l'inscription.
     *
     * Les deux routes existaient depuis l'origine cote serveur et n'etaient
     * appelees que par le mobile : le site inscrivait puis renvoyait vers la
     * connexion, sans jamais demander le code. Depuis T146 l'adresse doit
     * etre confirmee, et le site avait donc un cul-de-sac.
     */
    static activation = "activation-account"
    static resend_activation = "resend-activation"

    /*
     * La seconde etape de la connexion, pour les comptes qui ont active la
     * double authentification.
     */
    static login_double_authentification = "login/double-authentification"

    /* La double authentification, reglee depuis le compte. */
    static double_authentification = `${this.me}/double-authentification`
    static double_auth_preparer = `${this.me}/double-authentification/application/preparer`
    static double_auth_activer = `${this.me}/double-authentification/application/activer`
    static double_auth_desactiver = `${this.me}/double-authentification/application/desactiver`
    static double_auth_courriel = `${this.me}/double-authentification/courriel`

    static logout = "auth/logout"
    // mise à jour des informations de l'utilisateur
    /**
     * Les informations du compte : nom, prenom, telephone.
     *
     * C'est le telephone du COMPTE que le chauffeur et le livreur lisent —
     * aucune commande ni reservation n'en porte un. Le corriger ici est donc
     * le seul moyen d'etre joignable.
     */
    static update_user = `${this.me}/update`

    static update_adresse =`${this.me}/update/adresse`
    static update_password =`${this.me}/update/password`
    // traitement commande

    static send_commande =`${this.user}/commande/add`
    static current_commande =`${this.user}/commande/current`
    static valide_commande = `${this.user}/commande/valide`
    static check_paiement =`${this.user}/commande/check-paiement`
    static cancel_commande=`${this.user}/commande/cancel`
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

    // Le lien de paiement d'une pre-commande, remis au client par son
    // assistant. La chaine de requete porte `expires` et `signature` : elle
    // vient du lien lui-meme et doit etre repassee telle quelle, sinon le
    // backend ne peut pas verifier la signature — elle a ete calculee sur
    // CETTE URL d'API, hote compris.
    static lien_paiement_precommande=(uid:string,query:string):string=>
        `precommandes/${encodeURIComponent(uid)}/lien-paiement${query ? `?${query}` : ""}`

    /**
     * Une demande de partenariat, restaurant ou livreur.
     *
     * Ce n'est pas une inscription : rien n'est cree, aucun compte n'est
     * ouvert. La demande arrive dans le back-office et la societe rappelle.
     * Elle se fait donc sans compte, comme le catalogue.
     */
    /**
     * Le carnet d'adresses du client.
     *
     * Il existait cote serveur et cote mobile, et nulle part ici : le site
     * faisait ressaisir l'adresse a chaque commande. Les trois routes sont
     * celles du mobile, aucune n'a ete ajoutee.
     */
    static addresses = `${this.user}/addresses`

    static address_delete = (slug: string): string => `${this.user}/addresses/${slug}`

    static prospect_partenaire = `prospects`

    static update_address_delivery=`${this.user}/commande/update-address-delivery`
    static swr_check_paiement =(params:string)=>`${this.user}/commande/swr-check-paiement/${params}`
    
}

/**
 * Thalia Trans : la location de vehicule avec chauffeur.
 *
 * Decalque de la classe `RouteRental` du mobile (`helpers/Route.ts`), parce
 * que les deux clients parlent a la meme API sur la meme reservation : deux
 * listes d'adresses finiraient par diverger, et c'est deja le defaut connu
 * des deux `Route.ts` de ce produit.
 *
 * Les routes du chauffeur ne sont pas reprises : il n'a pas d'application web,
 * sa fiche est tenue en administration. Les ajouter ici serait du contrat mort
 * a maintenir.
 */
/** Ce que le catalogue de location sait filtrer, cote serveur. */
export interface FiltresCatalogue {
    cityId?: number | null
    townIds?: number[]
    courseTypeId?: number | null
    proposes?: "hourly" | "daily" | null
}

class RouteRental
{
    private static prefix = "rental"

    /**
     * Le catalogue, sans creneau, comme la liste des restaurants.
     *
     * On regarde les voitures d'abord et on choisit ses dates ensuite, sur la
     * fiche. La recherche est deleguee au serveur, exactement comme
     * `/list-restaurant?search=`.
     */
    static catalogue = (
        search?: string,
        page?: number,
        filtres?: FiltresCatalogue,
    ): string => {
        const parametres: string[] = []

        if (search) parametres.push(`search=${encodeURIComponent(search)}`)
        // La premiere page est implicite cote serveur : ne pas l'ecrire garde
        // l'URL identique a celle des clients deja installes.
        if (page && page > 1) parametres.push(`page=${page}`)

        /*
         * Les filtres partent au SERVEUR, qui pagine. Filtrer la page deja
         * descendue donnerait des pages a trous : on demanderait quinze
         * vehicules pour en afficher trois.
         *
         * Chacun n'est ecrit que s'il est pose : sans filtre, l'URL reste
         * celle que le site appelait avant.
         */
        if (filtres?.cityId) parametres.push(`city_id=${filtres.cityId}`)

        filtres?.townIds?.forEach((id) => parametres.push(`town_ids[]=${id}`))

        if (filtres?.courseTypeId) parametres.push(`course_type_id=${filtres.courseTypeId}`)

        // `proposes` et non `pricing_mode` : l'un dit ce qu'on CHERCHE,
        // l'autre comment CHIFFRER. Les confondre cacherait du catalogue un
        // vehicule qu'on sait encore chiffrer.
        if (filtres?.proposes) parametres.push(`proposes=${filtres.proposes}`)

        return parametres.length
            ? `${this.prefix}/vehicles?${parametres.join("&")}`
            : `${this.prefix}/vehicles`
    }

    /** Le meme catalogue restreint a un creneau : il porte alors le prix. */
    static vehicles = (startsAt: string, endsAt: string): string =>
        `${this.prefix}/vehicles?starts_at=${encodeURIComponent(startsAt)}&ends_at=${encodeURIComponent(endsAt)}`

    /**
     * La fiche d'un vehicule, comme `/list-restaurant/{slug}`.
     *
     * Le creneau est facultatif : sans lui la fiche se lit, avec lui elle
     * porte le prix et la disponibilite sur ces heures precises.
     */
    static vehicle = (
        slug: string,
        startsAt?: string,
        endsAt?: string,
        mode?: string,
        courseTypeId?: number,
        parking?: boolean,
    ): string => {
        const base = `${this.prefix}/vehicles/${encodeURIComponent(slug)}`

        if (!startsAt || !endsAt) return base

        const parametres = [
            `starts_at=${encodeURIComponent(startsAt)}`,
            `ends_at=${encodeURIComponent(endsAt)}`,
        ]

        // Le mode n'est ecrit que s'il sort de l'ordinaire : sans lui le
        // serveur chiffre a l'heure, et l'URL reste celle que les clients
        // deja installes appellent.
        if (mode && mode !== "hourly") parametres.push(`pricing_mode=${encodeURIComponent(mode)}`)

        /*
         * Le type de course et l'option parking changent le PRIX : sans eux,
         * la fiche annoncerait un montant que la reservation ne tiendrait pas.
         *
         * Ecrits seulement quand ils existent, pour la meme raison que le
         * mode : l'URL d'un appelant qui ne les connait pas reste la meme.
         */
        if (courseTypeId) parametres.push(`course_type_id=${courseTypeId}`)
        if (parking) parametres.push("parking=1")

        return `${base}?${parametres.join("&")}`
    }

    /**
     * Les reglages publics de la location : noms commerciaux, contact hors
     * zone, communes desservies, bornes de duree et delai de prevenance.
     * Publique comme le catalogue, elle se lit sans compte.
     */
    static config = `${this.prefix}/config`

    static bookings = `${this.prefix}/bookings`
    static booking = (uid: string): string => `${this.prefix}/bookings/${uid}`
    static booking_cancel = (uid: string): string => `${this.prefix}/bookings/${uid}/cancel`
    static booking_deposit = (uid: string): string => `${this.prefix}/bookings/${uid}/deposit`

    /**
     * La position du chauffeur et le point de rendez-vous d'une course.
     *
     * Separee de la reservation : elle change toutes les dix secondes quand la
     * course roule, alors que la reservation elle-meme ne bouge pas. Les
     * fondre aurait fait retelecharger le vehicule, les montants et le code de
     * depart a chaque releve de position.
     */
    static booking_suivi = (uid: string): string => `${this.prefix}/bookings/${uid}/suivi`
}

export {Route, RouteRental}