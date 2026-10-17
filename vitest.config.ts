import {resolve} from 'node:path';

import {defineConfig} from 'vitest/config';

/*
 * Le filet de tests du web.
 *
 * Ce depot n'en avait aucun, alors que `next.config.mjs` met
 * `ignoreDuringBuilds` ET `ignoreBuildErrors` a true : le build ne detecte ni
 * type ni lint, et rien ne verifiait le comportement. Trois corrections de
 * logique y sont parties sans filet.
 *
 * Environnement `node` par defaut : les helpers testes ici sont du calcul pur.
 * Un test de composant demandera jsdom et @testing-library/react — a ajouter
 * le jour ou il y en aura un, pas avant.
 */
export default defineConfig({
    test: {
        environment: 'node',
        include: ['**/__tests__/**/*.test.ts', '**/*.test.ts'],
        exclude: ['node_modules/**', '.next/**'],
    },
    resolve: {
        // Meme alias que tsconfig.json, sinon les imports `@/...` ne resolvent pas.
        alias: {'@': resolve(__dirname, './')},
    },
});
