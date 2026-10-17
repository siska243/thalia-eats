import {describe, expect, it} from 'vitest';

import {etatVehicule} from '@/helpers/etatVehicule';
import {RentalVehicleType} from '@/types/rental';

const vehicule = (extra: Partial<RentalVehicleType> = {}) =>
    ({name: 'Toyota Corolla', hourly_rate: 20, ...extra}) as unknown as RentalVehicleType;

describe('etatVehicule', () => {
    it('annonce « Libre » quand rien ne s\'y oppose', () => {
        expect(etatVehicule(vehicule())).toEqual({libre: true, libelle: 'Libre'});
    });

    it('annonce « En course » quand le vehicule est pris', () => {
        expect(etatVehicule(vehicule({available: false}))).toEqual({
            libre: false,
            libelle: 'En course',
        });
    });

    /*
     * Hors secteur, le libelle NOMME la ville : « Lubumbashi seulement » dit
     * au client quoi faire, « indisponible » le laisse devant une impasse.
     */
    it('nomme la ville quand le vehicule n\'opere pas ici', () => {
        const etat = etatVehicule(
            vehicule({reservable: false, city: {title: 'Lubumbashi', slug: 'lubumbashi'}}),
        );

        expect(etat).toEqual({libre: false, libelle: 'Lubumbashi seulement'});
    });

    it('reste lisible quand le vehicule hors secteur n\'a pas de ville', () => {
        expect(etatVehicule(vehicule({reservable: false})).libelle).toBe('Autre secteur');
    });

    /* Hors secteur prime : il ne se liberera jamais ici. */
    it('dit le secteur avant la course quand les deux s\'appliquent', () => {
        const etat = etatVehicule(
            vehicule({available: false, reservable: false, city: {title: 'Kinshasa', slug: 'kin'}}),
        );

        expect(etat.libelle).toBe('Kinshasa seulement');
    });

    /** Sans ces champs — un serveur qui ne les connait pas — rien ne change. */
    it('ne change rien quand le serveur n\'envoie pas ces champs', () => {
        expect(etatVehicule(vehicule()).libre).toBe(true);
    });
});
