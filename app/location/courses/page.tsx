import {redirect} from "next/navigation";

/**
 * Les courses ont rejoint « Commandes ».
 *
 * Le proprietaire : « dans commande on doit avoir pour thalia eat et thalia
 * trans ». Cette adresse existait avant la fusion, elle a ete partagee et mise
 * en favori : elle redirige plutot que de disparaitre.
 */
export default function Page() {
    redirect("/tracking?univers=location");
}
