import React from "react";
import {FaWhatsapp} from "react-icons/fa6";

interface Props {
    /** Le message du serveur, jamais une phrase recopiée ici. */
    message?: string | null;
    /** Le numéro du service, tel que l'administration le règle. */
    whatsapp?: string | null;
    /** Le nom commercial du service de location. */
    service: string;
}

/**
 * Prise en charge hors de la zone desservie.
 *
 * La location se fait avec chauffeur et uniquement dans Kinshasa. Pour une
 * commune hors liste, le site ne propose pas de réserver : il le dit et ouvre
 * WhatsApp sur le service, qui traitera la demande à la main.
 *
 * Le message vient du serveur. Le recopier ici aurait fait diverger ce que la
 * page annonce de ce que l'API refuse, alors que c'est la même règle.
 *
 * Sans numéro configuré, pas de bouton : un bouton qui n'ouvre rien est pire
 * qu'un bouton absent. Le message, lui, reste affiché — c'est lui qui explique
 * pourquoi la réservation n'avance pas.
 */
export default function HorsZone({message, whatsapp, service}: Props) {
    const numero = whatsapp?.trim().replace(/[^0-9]/g, "");

    return (
        <div role="alert" className="flex flex-col gap-3 rounded-card bg-warning-surface p-4">
            <p className="text-body text-warning">
                {message?.trim() ||
                    `Cette commune n’est pas desservie. Contactez ${service} pour organiser la course.`}
            </p>

            {numero ? (
                <a
                    href={`https://wa.me/${numero}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-control bg-surface px-4 py-3 text-body font-bold text-ink transition-colors duration-150 hover:bg-surface-sunken"
                >
                    <FaWhatsapp className="text-success" aria-hidden />
                    Écrire à {service}
                </a>
            ) : null}
        </div>
    );
}
