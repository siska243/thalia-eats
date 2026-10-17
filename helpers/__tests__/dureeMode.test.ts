import {describe, expect, it} from 'vitest';

import {BORNES_PAR_DEFAUT, heuresPourMode, uniteDuMode} from '@/helpers/rental';

const b = BORNES_PAR_DEFAUT;

/** Le nombre affiche apres la bascule, dans l'unite du nouveau mode. */
const apresBascule = (mode: 'hourly' | 'daily', heures: number) =>
    uniteDuMode(mode, heuresPourMode(mode, heures, b));

/**
 * Jumelle du test mobile, et pour le meme defaut.
 *
 * Le total en heures etait replafonne a 23 : 1 jour, 2 jours et 3 jours
 * donnaient TOUS « 23 heures » — un nombre que le client n'avait jamais tape,
 * et le meme quelle que soit sa demande.
 */
describe('bascule de duree', () => {
    it('garde le nombre en passant du jour a l\'heure', () => {
        expect(apresBascule('hourly', 1 * 24)).toBe(1);
        expect(apresBascule('hourly', 2 * 24)).toBe(2);
        expect(apresBascule('hourly', 3 * 24)).toBe(3);
    });

    /* L'autre sens garde sa regle : trois heures facturees a la journee, c'est
       une journee entiere, et le creneau doit le dire avant le total. */
    it('arrondit a la journee pleine en passant de l\'heure au jour', () => {
        expect(apresBascule('daily', 1)).toBe(1);
        expect(apresBascule('daily', 5)).toBe(1);
        expect(apresBascule('daily', 23)).toBe(1);
    });

    it('plafonne au maximum du nouveau mode', () => {
        expect(apresBascule('hourly', 30 * 24)).toBe(b.hours_max);
    });

    it('ne descend pas sous le minimum', () => {
        expect(apresBascule('hourly', 0)).toBe(b.hours_min);
        expect(apresBascule('daily', 0)).toBe(b.days_min);
    });
});
