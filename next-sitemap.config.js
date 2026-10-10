/**
 * Le plan du site et le `robots.txt`, regeneres a chaque build (postbuild).
 *
 * `robots.txt` autorisait tout : les pages de compte, le suivi de commande,
 * l'historique et surtout le lien de paiement d'une pre-commande, dont l'URL
 * porte sa signature, se retrouvaient indexables. Une signature valant douze
 * heures et suffisant a elle seule a declencher un debit, la laisser atterrir
 * dans un index public est une cle de paiement rendue publique.
 *
 * `exclude` retire ces chemins du plan du site ET, via `robotsTxtOptions`, les
 * interdit aux robots. Editer `public/robots.txt` a la main n'aurait servi a
 * rien : le postbuild le reecrit.
 */
const PRIVE = [
    "/reglages",
    "/reglages/*",
    "/historique",
    "/tracking",
    "/checkout",
    "/paiement/*",
    "/payement/*",
    "/location/courses",
    "/location/courses/*",
    "/location/reservation",
    "/api/*",
    // Le tunnel du SDK Sentry, pose par `tunnelRoute` dans next.config.mjs.
    "/monitoring",
];

module.exports = {
    siteUrl: "https://thaliaeats.com",
    generateRobotsTxt: true,
    exclude: PRIVE,
    robotsTxtOptions: {
        policies: [{userAgent: "*", allow: "/", disallow: PRIVE}],
    },
};
