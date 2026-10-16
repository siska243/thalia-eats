import {describe, expect, it} from 'vitest';

import {tarifApplique} from '@/helpers/tarifApplique';
import {RentalVehicleType} from '@/types/rental';

const vehicule = (extra: Partial<RentalVehicleType> = {}) =>
    ({hourly_rate: 20, daily_rate: 150, ...extra}) as unknown as RentalVehicleType;

describe('tarifApplique', () => {
    it('prend le tarif du type quand le serveur l\'envoie', () => {
        const v = vehicule({applied_rates: {hourly: 35, daily: 300}});

        expect(tarifApplique(v, 'hourly')).toBe(35);
        expect(tarifApplique(v, 'daily')).toBe(300);
    });

    /*
     * Le cas qui causait la confusion : un type n'a qu'un tarif journalier, et
     * l'horaire doit rester celui du vehicule — pas zero, pas vide.
     */
    it('retombe sur le tarif du vehicule mode par mode', () => {
        const v = vehicule({applied_rates: {hourly: 20, daily: 225}});

        expect(tarifApplique(v, 'hourly')).toBe(20);
        expect(tarifApplique(v, 'daily')).toBe(225);
    });

    /** Un serveur qui ne connait pas encore ce champ : rien ne change. */
    it('garde le prix habituel quand le serveur ne dit rien', () => {
        expect(tarifApplique(vehicule(), 'hourly')).toBe(20);
        expect(tarifApplique(vehicule(), 'daily')).toBe(150);
    });

    it('ne tombe pas sur un vehicule absent', () => {
        expect(tarifApplique(null, 'hourly')).toBeUndefined();
    });
});
