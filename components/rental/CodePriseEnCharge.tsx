"use client";

import React from "react";
import {QRCodeSVG} from "qrcode.react";

interface Props {
    /** Le code à quatre chiffres, généré au paiement de l'acompte. */
    code: string;
    /** La référence de la réservation, lue par le chauffeur dans le QR. */
    reference: string;
}

/**
 * Le code de prise en charge, en chiffres et en QR.
 *
 * Deux formes pour un seul secret : le chauffeur scanne quand il le peut, et
 * saisit les quatre chiffres sinon. Un QR seul rendrait la course impossible à
 * démarrer dès qu'un téléphone n'a plus de batterie ou que l'écran est
 * illisible au soleil.
 *
 * Le QR porte la référence ET le code, et dans cette forme exacte : c'est elle
 * que le lecteur du chauffeur attend. Sans la référence, il saurait que le
 * code est valide mais pas pour quelle course.
 *
 * Il n'apparaît qu'une fois l'acompte payé. Avant, il n'y a rien à prouver, et
 * un code qui circule tôt est un code de plus à protéger.
 *
 * `react-native-qrcode-svg` n'existe pas sur le web : le rendu passe par
 * `qrcode.react`, en SVG comme sur le mobile, donc net à l'impression et sur
 * un écran dense.
 */
export default function CodePriseEnCharge({code, reference}: Props) {
    return (
        <section className="flex flex-col items-center gap-3 rounded-card bg-surface p-5 shadow-card">
            <h2 className="text-caption font-semibold text-ink-muted">À présenter au chauffeur</h2>

            <div className="rounded-control bg-white p-3">
                <QRCodeSVG value={`thalia-rental:${reference}:${code}`} size={148} level="M" />
            </div>

            <div className="flex flex-col items-center gap-0.5">
                <span className="text-caption text-ink-muted">ou dictez ce code</span>
                <strong className="text-display font-bold tracking-[8px] text-ink">{code}</strong>
            </div>

            <p className="text-center text-caption text-ink-subtle">
                Ne le communiquez qu’au moment de monter.
            </p>
        </section>
    );
}
