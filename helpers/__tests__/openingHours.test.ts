import {describe, expect, it} from 'vitest';

import {etatOuverture, libelleFermeture} from '@/helpers/openingHours';

const creneau = (day: string, startAt: string, endAt: string) => ({day, startAt, endAt});

// Le 12 mars 2025 est un mercredi, le 13 un jeudi.
const mercredi = (heure: string) => new Date(`2025-03-12T${heure}`);
const jeudi = (heure: string) => new Date(`2025-03-13T${heure}`);

describe('etatOuverture', () => {
    it('ouvre quand l\'heure courante est dans le creneau du jour', () => {
        const etat = etatOuverture([creneau('mercredi', '08:00:00', '22:00:00')], mercredi('14:30:00'));

        expect(etat.ouvert).toBe(true);
        expect(etat.creneau).toBe('08:00 – 22:00');
    });

    /*
     * Sans horaires saisis, on repond « ouvert ».
     *
     * Afficher « ferme » a tort empeche de commander chez un restaurateur qui
     * a simplement oublie de remplir ses horaires. C'est la meme regle que le
     * serveur et que le formulaire d'administration (T82).
     */
    it('n\'annonce pas « ferme » quand aucun horaire n\'est saisi', () => {
        expect(etatOuverture([], mercredi('14:30:00')).ouvert).toBe(true);
        expect(etatOuverture(null, mercredi('14:30:00')).ouvert).toBe(true);
    });

    it('ferme quand aucun creneau ne nomme ce jour', () => {
        expect(etatOuverture([creneau('lundi', '10:00:00', '22:00:00')], mercredi('12:00:00')).ouvert).toBe(false);
    });

    /*
     * « 23h - 2h, c'est-a-dire le lendemain. »
     *
     * Le creneau de la veille tient le restaurant ouvert apres minuit. Ne
     * regarder que le jour courant affichait « ferme » a une heure du matin
     * alors que le serveur, lui, acceptait la commande.
     */
    it('tient le creneau de la veille qui passe minuit', () => {
        const nuit = [creneau('mercredi', '23:00:00', '02:00:00')];

        expect(etatOuverture(nuit, mercredi('23:30:00')).ouvert).toBe(true);
        expect(etatOuverture(nuit, jeudi('01:00:00')).ouvert).toBe(true);
        expect(etatOuverture(nuit, jeudi('03:00:00')).ouvert).toBe(false);
    });

    it('ne fait pas deborder un creneau ordinaire sur le lendemain', () => {
        expect(etatOuverture([creneau('mercredi', '10:00:00', '22:00:00')], jeudi('01:00:00')).ouvert).toBe(false);
    });

    /*
     * La fermeture est exclue, comme sur le serveur.
     *
     * A 22:00 pile le site annonçait « ouvert » et le paiement etait refuse :
     * le client voyait un restaurant ouvert et se faisait renvoyer au moment
     * de payer.
     */
    it('ferme a l\'heure pile de fermeture, comme le serveur', () => {
        const jour = [creneau('mercredi', '08:00:00', '22:00:00')];

        expect(etatOuverture(jour, mercredi('22:00:00')).ouvert).toBe(false);
        expect(etatOuverture(jour, mercredi('21:59:00')).ouvert).toBe(true);
    });

    it('annonce l\'heure de reouverture quand elle est encore devant', () => {
        const etat = etatOuverture([creneau('mercredi', '18:00:00', '23:00:00')], mercredi('14:30:00'));

        expect(etat.ouvert).toBe(false);
        expect(etat.ouvreA).toBe('18:00');
        expect(libelleFermeture(etat)).toBe('Ouvre à 18:00');
    });

    it('n\'annonce aucune reouverture quand la journee est finie', () => {
        const etat = etatOuverture([creneau('mercredi', '08:00:00', '12:00:00')], mercredi('14:30:00'));

        expect(etat.ouvreA).toBeNull();
        expect(libelleFermeture(etat)).toBe('Fermé aujourd\'hui');
    });
});

describe('un creneau de nuit n\'empiete pas sur son propre matin', () => {
    /*
     * « Mercredi 23h - 2h » couvre la nuit du mercredi au jeudi, pas celle du
     * mardi au mercredi. Tant que le debordement etait traite dans le creneau
     * du jour courant, le mercredi a une heure du matin passait pour ouvert.
     */
    it('ferme le matin du jour que le creneau nomme', () => {
        expect(etatOuverture([creneau('mercredi', '23:00:00', '02:00:00')], mercredi('01:00:00')).ouvert).toBe(false);
    });

    it('enchaine deux nuits de suite sans les chevaucher', () => {
        const nuits = [creneau('mardi', '23:00:00', '02:00:00'), creneau('mercredi', '23:00:00', '02:00:00')];

        expect(etatOuverture(nuits, mercredi('01:00:00')).ouvert).toBe(true);
        expect(etatOuverture(nuits, jeudi('01:00:00')).ouvert).toBe(true);
        expect(etatOuverture(nuits, mercredi('03:00:00')).ouvert).toBe(false);
    });
});
