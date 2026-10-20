"use client";

import {useState} from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import CarteAuth from "@/components/auth/CarteAuth";
import Turnstile, {DEFI_ACTIF} from "@/components/auth/Turnstile";
import {estValide, pourLeCompte} from "@/helpers/telephone";
import ChampTexte from "@/components/auth/ChampTexte";
import PhoneNumber from "@/components/forms/phone-number";
import Spinner from "@/components/Loader/Spinner";
import Notify from "@/components/toastify/Notify";
import {FetchData} from "@/helpers/FetchData";
import {Route} from "@/helpers/Route";

const CHAMPS_VIDES = {
    name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
};

/**
 * Les étapes, décalquées du mobile.
 *
 * Le propriétaire, le 20 octobre : « sur le web tu le mets en multistep ».
 * `register-screen.tsx` du mobile découpe exactement ce formulaire en trois,
 * avec ces libellés : le même parcours ne peut pas se raconter autrement d'un
 * appareil à l'autre.
 *
 * `champs` porte les noms de l'API, pas ceux de l'écran — voir l'inversion
 * expliquée plus bas.
 */
const ETAPES = [
    {
        libelle: "Identité",
        titre: "Créer un compte",
        detail: "Commençons par faire connaissance.",
    },
    {
        libelle: "Contact",
        titre: "Comment vous joindre ?",
        detail: "Votre e-mail confirme la commande, votre numéro permet au livreur de vous trouver.",
    },
    {
        libelle: "Sécurité",
        titre: "Protégez votre compte",
        detail: "Dernière étape : choisissez un mot de passe.",
    },
];

/**
 * Inscription.
 *
 * Trois defauts corriges a l'origine :
 *
 * - le champ telephone declarait `type="phone"`, qui n'existe pas : le
 *   navigateur retombait sur du texte, et le telephone n'ouvrait donc pas le
 *   clavier numerique. Le type valide est `tel`.
 * - la comparaison des deux mots de passe etait ecrite deux fois de suite,
 *   a l'identique.
 * - apres une inscription reussie, la page vidait le formulaire et s'arretait
 *   la : aucune redirection, aucun pas suivant. On restait devant un
 *   formulaire vierge sans savoir si le compte existait.
 *
 * Elle mene desormais a la CONFIRMATION, et non a la connexion : depuis
 * T146 l'adresse doit etre confirmee pour utiliser le compte, et renvoyer
 * vers un ecran de connexion qui refusera est un cul-de-sac.
 *
 * Le defi anti-robot n'apparait que si la cle est configuree. Sans elle, le
 * formulaire se comporte exactement comme avant.
 *
 * T168 : le telephone passe au composant du depot, et le formulaire se
 * decoupe en trois etapes comme sur le mobile.
 *
 * PRENOM ET NOM ETAIENT INVERSES. Le serveur compose partout
 * `full_name = last_name + ' ' + name` (`UserResource:29`, `AuthController:124`,
 * `:224`, `:351`), donc `last_name` porte le PRENOM. Le mobile le fait ainsi ;
 * le web, lui, envoyait le prenom dans `name`. Tout compte cree depuis le site
 * s'affichait donc « Mbala Eva » au lieu de « Eva Mbala », jusque dans le
 * courriel de bienvenue. Les comptes deja crees restent inverses en base :
 * c'est une reprise de donnees, pas un changement d'ecran.
 */
export default function PageInscription() {
    const [champs, setChamps] = useState(CHAMPS_VIDES);
    const [loading, setLoading] = useState(false);
    const [jetonAntiRobot, setJetonAntiRobot] = useState(null);
    const [etape, setEtape] = useState(0);
    const [erreur, setErreur] = useState(null);
    const router = useRouter();

    const derniere = etape === ETAPES.length - 1;
    const courante = ETAPES[etape];

    const modifier = (cle) => (e) => {
        setErreur(null);
        setChamps((precedent) => ({...precedent, [cle]: e.target.value}));
    };

    /**
     * Ce qui manque à l'étape courante, ou rien.
     *
     * Un garde qui arrête doit toujours poser un message : un bouton muet se
     * lit comme une panne. Même doctrine que `continuer()` du tunnel de
     * réservation.
     *
     * Les seuils sont ceux du serveur, pas des valeurs choisies ici :
     * `min:3` sur le nom et le prénom (`RegistrationRequest`).
     */
    const manqueALEtape = () => {
        if (etape === 0) {
            if (champs.last_name.trim().length < 3 || champs.name.trim().length < 3) {
                return "Indiquez votre prénom et votre nom, trois lettres au minimum.";
            }

            return null;
        }

        if (etape === 1) {
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(champs.email.trim())) {
                return "Indiquez une adresse e-mail valide : c'est là que part votre code.";
            }

            if (!champs.phone.trim()) {
                return "Indiquez le numéro sur lequel le livreur vous appellera.";
            }

            if (!estValide(champs.phone)) {
                return "Ce numéro de téléphone n’est pas valide. Exemple : 0810000000.";
            }

            return null;
        }

        if (champs.password.length < 8) {
            return "Votre mot de passe doit contenir au moins 8 caractères.";
        }

        if (champs.password !== champs.confirmPassword) {
            return "Les deux mots de passe ne correspondent pas.";
        }

        return null;
    };

    const continuer = () => {
        const manquant = manqueALEtape();

        if (manquant) {
            setErreur(manquant);

            return;
        }

        setErreur(null);
        setEtape((rang) => rang + 1);
    };

    const handlerSubmit = async (e) => {
        e.preventDefault();

        const manquant = manqueALEtape();

        if (manquant) {
            setErreur(manquant);

            return;
        }

        setLoading(true);

        try {
            const donnees = {
                name: champs.name.trim(),
                last_name: champs.last_name.trim(),
                email: champs.email.trim(),
                /*
                 * Le compte stocke le format local, « 0810000001 » : c'est ce
                 * que le mobile analyse et ce que l'administration affiche.
                 * Le composant, lui, rend « 243810000001 ». La conversion vit
                 * dans `helpers/telephone`, une seule fois.
                 */
                phone: pourLeCompte(champs.phone),
                password: champs.password,
                /*
                 * Le serveur porte `same:password` depuis toujours, mais le
                 * site ne transmettait pas ce champ : la règle ne s'appliquait
                 * donc jamais. Le mobile l'envoie déjà sous ce nom.
                 */
                confirm_password: champs.confirmPassword,
            };

            // Absent quand le defi n'est pas configure : le serveur ne le
            // reclame que si sa propre cle est posee.
            if (jetonAntiRobot) donnees.turnstile_token = jetonAntiRobot;

            const response = await FetchData.sendData(Route.register, donnees);

            if (response?.name === "AxiosError") {
                const message =
                    response.response?.data?.message ?? "Inscription impossible";

                /*
                 * Le refus se montre DANS l'écran, pas seulement en toast : un
                 * message qui disparaît tout seul laisse le visiteur devant un
                 * formulaire qui semble correct. Même raison qu'au mobile, qui
                 * revient à l'étape du contact sur une erreur serveur.
                 */
                setErreur(message);
                Notify(message, "error");

                return;
            }

            const adresse = champs.email.trim();

            setChamps(CHAMPS_VIDES);
            Notify("Compte créé. Saisissez le code reçu par e-mail.", "success");
            router.push(`/confirmation?email=${encodeURIComponent(adresse)}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <CarteAuth
            titre={courante.titre}
            sousTitre={courante.detail}
            bas={
                etape === 0 ? (
                    <>
                        Vous avez déjà un compte ?{" "}
                        <Link
                            href="/login"
                            className="font-semibold text-brand-600 underline-offset-4 hover:underline"
                        >
                            Connectez-vous
                        </Link>
                    </>
                ) : null
            }
        >
            <form
                className="flex flex-col gap-5"
                onSubmit={derniere ? handlerSubmit : (e) => e.preventDefault()}
            >
                {/*
                  * L'en-tête d'étape, écrit ici comme dans les deux autres
                  * tunnels du site. Un composant partagé attendra qu'il y en
                  * ait un quatrième : les trois se factoriseront alors d'un
                  * coup, au lieu d'une abstraction taillée pour un seul.
                  */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-baseline justify-between gap-3">
                        <p className="text-caption font-semibold uppercase tracking-wide text-brand-600">
                            Étape {etape + 1} sur {ETAPES.length}
                        </p>
                        <p className="text-caption text-ink-muted">{courante.libelle}</p>
                    </div>

                    <div className="flex gap-1.5" aria-hidden>
                        {ETAPES.map((pas, rang) => (
                            <span
                                key={pas.libelle}
                                className={`h-1.5 flex-1 rounded-pill transition-colors duration-200 ${
                                    rang <= etape ? "bg-brand-500" : "bg-surface-border"
                                }`}
                            />
                        ))}
                    </div>
                </div>

                {erreur ? (
                    <p
                        role="alert"
                        className="rounded-control bg-danger-surface px-4 py-3 text-caption font-semibold text-danger"
                    >
                        {erreur}
                    </p>
                ) : null}

                {etape === 0 ? (
                    <div className="flex flex-col gap-5">
                        {/*
                          * Prénom dans `last_name`, nom dans `name` : c'est le
                          * contrat de l'API, que le serveur et le mobile
                          * partagent déjà. L'écran s'y plie, on ne le
                          * « corrige » pas.
                          */}
                        <ChampTexte
                            label="Prénom"
                            placeholder="Votre prénom"
                            autoComplete="given-name"
                            value={champs.last_name}
                            onChange={modifier("last_name")}
                            required
                        />

                        <ChampTexte
                            label="Nom"
                            placeholder="Votre nom"
                            autoComplete="family-name"
                            value={champs.name}
                            onChange={modifier("name")}
                            required
                        />
                    </div>
                ) : null}

                {etape === 1 ? (
                    <div className="flex flex-col gap-5">
                        <ChampTexte
                            label="Email"
                            type="email"
                            placeholder="exemple@email.com"
                            autoComplete="email"
                            aide="Vous y recevrez le code d'activation."
                            value={champs.email}
                            onChange={modifier("email")}
                            required
                        />

                        {/*
                          * Le composant du dépôt, et non un champ texte : il
                          * porte l'indicatif, le drapeau et le format du pays.
                          * C'est celui qu'utilisent déjà la réservation de
                          * course, la précommande et la fenêtre mobile money ;
                          * deux saisies différentes pour un numéro, sur le même
                          * site, finissent par accepter des formes
                          * différentes.
                          */}
                        <PhoneNumber
                            className="w-full"
                            country="cd"
                            preferredCountries={["cd"]}
                            label={
                                <>
                                    Téléphone
                                    <span className="text-danger" aria-hidden>
                                        {" *"}
                                    </span>
                                </>
                            }
                            helperText="Le livreur vous appelle sur ce numéro à son arrivée."
                            value={champs.phone}
                            onChange={(valeur) => {
                                setErreur(null);
                                setChamps((precedent) => ({...precedent, phone: valeur}));
                            }}
                            inputProps={{name: "phone", required: true}}
                        />
                    </div>
                ) : null}

                {etape === 2 ? (
                    <div className="flex flex-col gap-5">
                        <ChampTexte
                            label="Mot de passe"
                            motDePasse
                            placeholder="••••••••"
                            autoComplete="new-password"
                            minLength={8}
                            aide="8 caractères minimum"
                            value={champs.password}
                            onChange={modifier("password")}
                            required
                        />

                        <ChampTexte
                            label="Confirmer le mot de passe"
                            motDePasse
                            placeholder="••••••••"
                            autoComplete="new-password"
                            value={champs.confirmPassword}
                            onChange={modifier("confirmPassword")}
                            required
                        />
                    </div>
                ) : null}

                {/*
                  * Le défi sur la DERNIÈRE étape, celle qui envoie. Posé à la
                  * première, son jeton — qui vaut cinq minutes — aurait expiré
                  * pendant que le visiteur remplit les deux autres.
                  */}
                {derniere ? <Turnstile onJeton={setJetonAntiRobot} /> : null}

                <div className="mt-2 flex items-center gap-3">
                    {etape > 0 ? (
                        <button
                            type="button"
                            onClick={() => {
                                setErreur(null);
                                setEtape((rang) => rang - 1);
                            }}
                            className="inline-flex min-h-12 items-center justify-center rounded-pill border border-surface-border bg-surface px-6 text-body font-semibold text-ink transition-colors duration-150 hover:bg-surface-sunken"
                        >
                            Retour
                        </button>
                    ) : null}

                    {/*
                      * Tant que le défi n'est pas passé, on n'envoie pas.
                      *
                      * Le formulaire partait sans jeton quand le widget
                      * échouait, et le client recevait « Vérification
                      * impossible » sans avoir jamais vu de bouton bloqué.
                      * `DEFI_ACTIF` garde le bouton vivant sur un site sans
                      * clé, où aucun jeton n'arrivera jamais.
                      */}
                    <button
                        type={derniere ? "submit" : "button"}
                        onClick={derniere ? undefined : continuer}
                        disabled={loading || (derniere && DEFI_ACTIF && !jetonAntiRobot)}
                        className="flex min-h-12 flex-1 items-center justify-center rounded-pill bg-secondaryColor px-6 py-3.5 text-body font-semibold text-white transition-opacity duration-150 hover:opacity-90 disabled:opacity-60"
                    >
                        {loading ? <Spinner /> : derniere ? "Créer mon compte" : "Continuer"}
                    </button>
                </div>
            </form>
        </CarteAuth>
    );
}
