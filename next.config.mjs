import {withSentryConfig} from "@sentry/nextjs";
/** @type {import('next').NextConfig} */
const nextConfig = {
    images: { unoptimized: true },
    // `X-Powered-By: Next.js` sur chaque reponse annonce le cadre et sa
    // famille de versions a qui scanne. Rien ne le lit.
    poweredByHeader: false,
    /*
     * Le build voit de nouveau les erreurs.
     *
     * Les deux drapeaux etaient a `true` : une erreur de type ou une regle de
     * lint violee passait en production sans un mot, et le seul filet restant
     * etait de penser a lancer les deux commandes a la main. `npx tsc --noEmit`
     * et `npm run lint` sont tous deux propres a ce jour, donc les rallumer ne
     * bloque aucun build existant, et bloquera le premier qui regresse.
     */
    eslint: {
        ignoreDuringBuilds: false,
    },
    typescript: {
        ignoreBuildErrors: false,
    },
    env: {
        FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        FIREBASE_MESSAGING_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_APP_ID,
        FIREBASE_MESSAGING_VAPID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_VAPID
    },
    /**
     * Les en-tetes de securite, poses sur toutes les reponses.
     *
     * Aucun n'etait envoye : le site pouvait etre charge dans une iframe sur un
     * domaine tiers, de quoi faire cliquer un client sur « Payer » en croyant
     * cliquer ailleurs.
     *
     * `Referrer-Policy` compte doublement ici : le lien de paiement d'une
     * pre-commande porte sa `signature` dans la chaine de requete, et cette page
     * propose « Retour a l'accueil ». Sans cette regle, une navigation sortante
     * emporterait l'URL complete, signature comprise, chez le site suivant.
     *
     * Pas de `Content-Security-Policy` ici : la page charge Google Maps, Firebase,
     * Pusher, Sentry et Vercel Analytics, et une directive trop etroite couperait
     * la carte ou le suivi de paiement sans qu'un test le voie. Elle se pose en
     * mode `Report-Only` d'abord, sur une preproduction.
     */
    async headers() {
        return [
            {
                source: "/:chemin*",
                headers: [
                    // Le navigateur ne devine plus le type d'un fichier servi :
                    // une image televersee qui contient du HTML reste une image.
                    {key: "X-Content-Type-Options", value: "nosniff"},
                    // Deux formulations de la meme interdiction, parce que les
                    // navigateurs anciens ne lisent que la premiere.
                    {key: "X-Frame-Options", value: "DENY"},
                    {key: "Content-Security-Policy", value: "frame-ancestors 'none'"},
                    {key: "Referrer-Policy", value: "strict-origin-when-cross-origin"},
                    // Le site ne demande ni micro, ni camera, ni paiement natif.
                    // La geolocalisation reste ouverte a notre propre origine :
                    // la carte de livraison et le suivi de course s'en servent.
                    {
                        key: "Permissions-Policy",
                        value: "camera=(), microphone=(), payment=(), geolocation=(self)",
                    },
                ],
            },
        ];
    },

    async redirects() {
        return [
            {
                source: "/_not-found",
                destination: "/404",
                permanent: false,
            },
        ];
    },

};

export default withSentryConfig(nextConfig, {
// For all available options, see:
// https://www.npmjs.com/package/@sentry/webpack-plugin#options

org: "thalia-eats",
project: "thalia-eats-web",

// Only print logs for uploading source maps in CI
silent: !process.env.CI,

// For all available options, see:
// https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

// Upload a larger set of source maps for prettier stack traces (increases build time)
widenClientFileUpload: true,

// Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
// This can increase your server load as well as your hosting bill.
// Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
// side errors will fail.
tunnelRoute: "/monitoring",

// Automatically tree-shake Sentry logger statements to reduce bundle size
disableLogger: true,

// Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
// See the following for more information:
// https://docs.sentry.io/product/crons/
// https://vercel.com/docs/cron-jobs
automaticVercelMonitors: true,
});