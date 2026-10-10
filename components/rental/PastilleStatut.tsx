import React from "react";

import {RentalBookingStatus} from "@/types/rental";
import {apparenceDuStatut} from "@/components/rental/statutCourse";

/** Pastille de statut d'une réservation. */
export default function PastilleStatut({status}: {status?: RentalBookingStatus | null}) {
    const apparence = apparenceDuStatut(status);

    return (
        <span
            className={`shrink-0 rounded-pill px-2.5 py-1 text-caption font-bold ${apparence.fond} ${apparence.texte}`}
        >
            {apparence.label}
        </span>
    );
}
