import React from "react";

import DetailCourse from "@/app/location/courses/[uid]/detail-course";

/**
 * Le détail d'une course.
 *
 * La page lit son `uid` côté serveur et laisse le corps au composant client,
 * qui relit l'état de la réservation, bat le compte à rebours et suit le
 * chauffeur sur la carte.
 */
export default async function Page({params}: {params: Promise<{uid: string}>}) {
    const {uid} = await params;

    return <DetailCourse uid={uid} />;
}
