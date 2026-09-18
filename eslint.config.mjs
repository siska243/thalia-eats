import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

/**
 * Configuration ESLint, format « flat ».
 *
 * ESLint 9 n'accepte plus `.eslintrc.json`, et `eslint-config-next@16` exige
 * ESLint 9 : les deux migrations vont ensemble.
 *
 * `eslint-config-next@16` publie directement sa configuration au format flat,
 * on l'importe donc telle quelle. Passer par `FlatCompat`, comme le veut la
 * recette habituelle de migration, la fait echouer sur une structure circulaire
 * dans ses plugins : le pont n'a plus lieu d'etre quand la configuration est
 * deja native.
 *
 * Les dossiers generes sont exclus explicitement : `next lint` les ignorait
 * tout seul, l'appel direct a ESLint ne le fait pas, et sans ca la commande
 * analyse `.next/` et `node_modules/`.
 */
const eslintConfig = [
    {
        ignores: [
            ".next/**",
            "out/**",
            "build/**",
            "node_modules/**",
            "next-env.d.ts",
            "public/**",
        ],
    },
    ...coreWebVitals,
    ...typescript,
];

export default eslintConfig;
