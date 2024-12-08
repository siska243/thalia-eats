/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'thalia.cooceckivu.org',
                port: '',
                pathname: '/**',
            },
        ],
    },
    env: {
        FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        FIREBASE_MESSAGING_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_APP_ID,
        FIREBASE_MESSAGING_VAPID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_VAPID
    }

};

export default nextConfig;
