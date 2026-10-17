"use client";

import React, {useState} from "react";
import {FaMinus, FaPlus} from "react-icons/fa6";

import {
    BORNES_PAR_DEFAUT,
    BornesDuree,
    bornesDuMode,
    departLePlusTot,
    departTropProche,
    dureeChoisie,
    formatDMY,
    formatTime,
    ModeTarifaire,
    uniteDuMode,
} from "@/helpers/rental";

interface Props {
    startsAt: Date;
    hours: number;
    /**
     * Le mode de tarification choisi. À la journée, la durée se compte en
     * journées : proposer « 3 h » alors que le véhicule est facturé 149 $ la
     * journée ferait payer une journée pleine sans le dire.
     */
    mode?: ModeTarifaire;
    /**
     * Le véhicule porte-t-il un tarif journalier ? Sans lui, il n'y a nulle
     * part où basculer : la durée s'arrête au plafond horaire.
     */
    peutBasculer?: boolean;
    /**
     * L'heure à partir de laquelle la journée revient moins chère, et le prix
     * de cette journée, déjà mis en forme. Sert à prévenir le client AVANT
     * qu'il paie plus cher pour moins de voiture. Le propriétaire a choisi de
     * garder le plafond horaire et de seulement prévenir, plutôt que de
     * basculer sous les doigts du client.
     */
    seuilJournee?: number | null;
    prixJournee?: string;
    /**
     * Les bornes réglées en administration, délai de prévenance compris. Le
     * bouton qui se grise, la saisie au clavier et le calcul de la durée les
     * lisent au même endroit : sans cela le plus pourrait rester actif sur une
     * valeur que la saisie refuse.
     */
    bornes?: BornesDuree;
    /** Le nom commercial du service, pour la phrase des longues durées. */
    nomService: string;
    onChange: (startsAt: Date, hours: number) => void;
}

/** « 2026-10-11 », tel que `<input type="date">` l'attend, en heure locale. */
const valeurDate = (date: Date): string =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
        date.getDate(),
    ).padStart(2, "0")}`;

/** « 14:30 », tel que `<input type="time">` l'attend. */
const valeurHeure = (date: Date): string =>
    `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;

interface PropsPas {
    signe: "moins" | "plus";
    actif: boolean;
    onClick: () => void;
    libelle: string;
}

/**
 * Un pas de durée. 44 px de côté : on y tape vite et plusieurs fois.
 *
 * Inactif, il reste visible et grisé plutôt que retiré — un bouton qui
 * disparaît déplace l'autre sous le doigt au moment où on appuie.
 */
const BoutonPas = ({signe, actif, onClick, libelle}: PropsPas) => (
    <button
        type="button"
        onClick={onClick}
        disabled={!actif}
        aria-label={libelle}
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-control transition-colors duration-150 ${
            actif ? "bg-surface text-ink shadow-card hover:bg-brand-50" : "text-ink-subtle opacity-40"
        }`}
    >
        {signe === "moins" ? <FaMinus aria-hidden /> : <FaPlus aria-hidden />}
    </button>
);

/**
 * Le créneau : un départ et une durée.
 *
 * Décalque de `slot-picker.tsx` du mobile. Deux dates à saisir seraient plus
 * souples et beaucoup plus faciles à rater — une fin avant le début, ou un
 * créneau de dix minutes. Une durée bornée rend ces deux erreurs impossibles à
 * produire, et la durée est de toute façon ce que le client a en tête.
 *
 * Le départ passe par les champs natifs `date` et `time` : le navigateur
 * fournit déjà le calendrier et l'horloge du système, dans la langue et le
 * format de l'appareil, et ils sont utilisables au clavier.
 *
 * La durée NE CHANGE PAS le mode. Au plafond horaire le bouton « plus » se
 * grise, et c'est la bascule heure/journée qui change de tarif, explicitement :
 * un arbitrage du propriétaire, parce qu'une bascule automatique faisait
 * BAISSER le prix en appuyant sur « plus ».
 */
export default function SelecteurCreneau({
    startsAt,
    hours,
    mode = "hourly",
    peutBasculer = false,
    seuilJournee = null,
    prixJournee,
    bornes = BORNES_PAR_DEFAUT,
    nomService,
    onChange,
}: Props) {
    const journee = mode === "daily";
    const valeur = uniteDuMode(mode, hours);

    const {min, max} = bornesDuMode(mode, bornes);

    const fin = new Date(startsAt.getTime() + hours * 3600 * 1000);

    /*
     * Le premier départ que le serveur acceptera : le délai de prévenance se
     * règle en administration et arrive par `/rental/config`. Il est relu à
     * chaque rendu, parce qu'il court avec l'horloge : figé au montage, il
     * aurait laissé composer un départ devenu trop proche pendant que la page
     * était ouverte.
     */
    const plusTot = departLePlusTot(bornes);
    const memeJourQuePlusTot = valeurDate(startsAt) === valeurDate(plusTot);

    /**
     * Un départ trop proche est REFUSÉ, il n'est plus déplacé.
     *
     * Le champ ramenait silencieusement la saisie au premier créneau
     * possible. Le propriétaire a tranché : « 00h07 ça ne peut pas passer » —
     * on le dit, on ne le déplace pas. Voir son heure changer toute seule
     * est plus déroutant qu'un refus expliqué.
     *
     * Le navigateur refuse déjà une partie de ces saisies par `min`, mais pas
     * toutes : un champ `time` ne connaît pas la date qui l'accompagne, et
     * laisse donc composer une heure déjà passée du jour même.
     */
    const [refuse, setRefuse] = useState(false);

    /** N'accepte un départ que s'il respecte le délai de prévenance. */
    const poserLeDepart = (depart: Date) => {
        if (departTropProche(depart, bornes)) {
            setRefuse(true);

            return;
        }

        setRefuse(false);
        onChange(depart, hours);
    };

    const changerDate = (texte: string) => {
        const [annee, mois, jour] = texte.split("-").map(Number);

        if (!annee || !mois || !jour) return;

        const depart = new Date(startsAt);
        depart.setFullYear(annee, mois - 1, jour);

        poserLeDepart(depart);
    };

    const changerHeure = (texte: string) => {
        const [heure, minute] = texte.split(":").map(Number);

        if (Number.isNaN(heure) || Number.isNaN(minute)) return;

        const depart = new Date(startsAt);
        depart.setHours(heure, minute, 0, 0);

        poserLeDepart(depart);
    };

    const appliquer = (demande: number) => {
        const choisi = dureeChoisie(mode, demande, bornes);

        onChange(startsAt, choisi.heures);
    };

    /*
     * Le champ garde sa propre chaîne le temps de la frappe seulement : borner
     * à chaque caractère empêcherait d'effacer « 12 » pour taper « 5 », le
     * champ repassant à 1 dès le vide. Au repos il vaut `null` et affiche la
     * durée en vigueur, ce qui évite de resynchroniser deux états.
     */
    const [saisie, setSaisie] = useState<string | null>(null);

    /*
     * Un chiffre de trop n'est pas corrigé, il est refusé : taper « 2 » puis
     * « 3 » donne 23, et le « 3 » suivant ne rentre pas. Ramener 233 à 23 après
     * coup ferait clignoter le champ sous le doigt.
     */
    const frapper = (texte: string) => {
        const chiffres = texte.replace(/[^0-9]/g, "");

        if (chiffres === "") return setSaisie("");
        if (Number(chiffres) > max) return;

        setSaisie(chiffres);
    };

    const validerSaisie = () => {
        if (saisie === null) return;

        appliquer(saisie === "" ? valeur : Number(saisie));
        setSaisie(null);
    };

    const plus = valeur < max;
    const moins = valeur > min;

    return (
        <div className="flex flex-col gap-3">
            <div className="grid gap-3 sm:grid-cols-2">
                <label className="flex flex-col gap-1">
                    <span className="text-caption font-semibold text-ink-muted">Départ</span>
                    <input
                        type="date"
                        value={valeurDate(startsAt)}
                        min={valeurDate(plusTot)}
                        onChange={(e) => changerDate(e.target.value)}
                        className="min-h-11 w-full rounded-control border border-surface-border bg-surface px-3 py-2.5 text-body text-ink outline-none transition-colors duration-150 focus:border-brand-500"
                    />
                </label>

                <label className="flex flex-col gap-1">
                    <span className="text-caption font-semibold text-ink-muted">Heure</span>
                    <input
                        type="time"
                        value={valeurHeure(startsAt)}
                        /* `min` ne vaut que le jour même : le lendemain, toutes
                           les heures sont ouvertes, et le poser sans condition
                           interdirait de partir à 6 h demain matin. */
                        min={memeJourQuePlusTot ? valeurHeure(plusTot) : undefined}
                        onChange={(e) => changerHeure(e.target.value)}
                        className="min-h-11 w-full rounded-control border border-surface-border bg-surface px-3 py-2.5 text-body text-ink outline-none transition-colors duration-150 focus:border-brand-500"
                    />
                </label>
            </div>

            {refuse ? (
                <p role="alert" className="text-caption text-warning">
                    Ce départ est trop proche : la course se commande au moins{" "}
                    {bornes.lead_time_minutes} minutes à l’avance. Le plus tôt possible est le{" "}
                    {formatDMY(plusTot)} à {formatTime(plusTot)}.
                </p>
            ) : null}

            <div className="flex flex-col gap-2">
                <span className="text-caption font-semibold text-ink-muted">Durée</span>

                <div className="flex items-center justify-between gap-2 rounded-control bg-surface-sunken p-1.5">
                    <BoutonPas
                        signe="moins"
                        actif={moins}
                        onClick={() => appliquer(valeur - 1)}
                        libelle="Diminuer la durée"
                    />

                    <span className="flex flex-1 items-baseline justify-center gap-1.5">
                        <input
                            type="text"
                            inputMode="numeric"
                            value={saisie ?? String(valeur)}
                            onChange={(e) => frapper(e.target.value)}
                            onBlur={validerSaisie}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") validerSaisie();
                            }}
                            maxLength={String(max).length}
                            aria-label={journee ? "Nombre de journées" : "Nombre d'heures"}
                            className="w-14 bg-transparent text-center text-title font-bold text-ink outline-none"
                        />

                        <span className="text-body font-semibold text-ink-muted">
                            {journee
                                ? `jour${valeur > 1 ? "s" : ""}`
                                : `heure${valeur > 1 ? "s" : ""}`}
                        </span>
                    </span>

                    <BoutonPas
                        signe="plus"
                        actif={plus}
                        onClick={() => appliquer(valeur + 1)}
                        libelle="Augmenter la durée"
                    />
                </div>

                {/*
                 * Annoncer la bascule AVANT de la subir. Sans cette ligne, le
                 * client butte sur un bouton grisé sans savoir où aller.
                 */}
                {!journee && peutBasculer && valeur === max ? (
                    <p className="text-caption text-ink-subtle">
                        Durée maximale à l’heure. Pour plus long, passez à la journée.
                    </p>
                ) : null}

                {!journee &&
                peutBasculer &&
                valeur < max &&
                seuilJournee !== null &&
                valeur >= seuilJournee ? (
                    <p className="text-caption text-brand-700">
                        À partir de {seuilJournee} h, la journée revient moins cher
                        {prixJournee ? ` : ${prixJournee} pour 24 h.` : "."}
                    </p>
                ) : null}

                {!journee && !peutBasculer && valeur === max ? (
                    <p className="text-caption text-ink-subtle">
                        Durée maximale pour ce véhicule, qui ne se loue qu’à l’heure.
                    </p>
                ) : null}

                {journee && valeur === max ? (
                    <p className="text-caption text-ink-subtle">
                        Au-delà de {max} jours, la réservation se négocie avec {nomService}.
                    </p>
                ) : null}
            </div>

            <p className="text-caption text-ink-subtle">
                Retour prévu le {formatDMY(fin)} à {formatTime(fin)}
            </p>
        </div>
    );
}
