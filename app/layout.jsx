import "./globals.css";
import Footer from "@/components/commons/Footer";
import Header from "@/components/commons/Header";
import {Analytics} from "@vercel/analytics/react";
import AosInit from "@/components/commons/AosInit";
import GlobalProvider from "@/providers/global-provider";


export const metadata = {
    title: "Livraison de repas sains et rapides à Kinshasa | Thalia Eats",
    description: "Commandez vos repas équilibrés et savoureux en ligne avec Thalia Eats, livraison rapide à Kinshasa. Découvrez notre menu varié et nos options de plats healthy.",
    openGraph: {
        title: "Livraison de repas sains et rapides à Kinshasa | Thalia Eats",
        description: "Commandez vos repas équilibrés et savoureux en ligne avec Thalia Eats, livraison rapide à Kinshasa.",
        url: "https://thaliaeats.com",
        siteName: "Thalia Eats",
        images: [
            {
                url: "https://thaliaeats.com/apple-touch-icon.png",
                width: 1200,
                height: 630,
            },
        ],
        locale: "fr_CD",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Livraison de repas sains et rapides à Kinshasa | Thalia Eats",
        description: "Commandez vos repas équilibrés et savoureux en ligne avec Thalia Eats, livraison rapide à Kinshasa.",
        images: ["https://thaliaeats.com/apple-touch-icon.png"],
    },
};

export default function RootLayout({children}) {
    return (
        <html lang="en">
        <link rel="icon" href="/favicon.ico"/>
        <link rel="apple-touch-icon" href="/apple-touch-icon.png"/>
        <link rel="manifest" href="/site.webmanifest"/>
        <body className="scrollbar-thin scrollbar-thumb scrollbar-custom overflow-y-scroll"
              cz-shortcut-listen="true"
        >

        <GlobalProvider>
            <AosInit/>
            <Header/>
            <main className="min-h-screen bg-white">{children}</main>
            <Footer/>
            <Analytics/>
        </GlobalProvider>
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "Organization",
                    name: "Thalia Eats",
                    url: "https://thaliaeats.com",
                    logo: "https://thaliaeats.com/assets/logo-thalia.png",
                    sameAs: [
                        "https://www.facebook.com/thaliaeats",
                        "https://www.instagram.com/thaliaeats"
                    ],
                    description:
                        "Commandez vos repas équilibrés et savoureux en ligne avec Thalia Eats, livraison rapide à Kinshasa."
                }),
            }}
        />
        </body>
        </html>
    );
}
