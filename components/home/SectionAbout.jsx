import { useState } from "react";
import { Collapse } from "react-collapse";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import CardAbout from "./CardAbout";
import aboutImg from "@/public/assets/images/aboutImg.png";

export default function SectionAbout() {
  const [activeTab, setActiveTab] = useState("about");
  const [openIndex, setOpenIndex] = useState(null);

  const faq = [
    {
      question: "Comment fonctionne ThaliaEats ?",
      answer:
        "ThaliaEats simplifie le processus de commande de nourriture. Parcourez notre menu, sélectionnez vos plats préférés et passez une commande. Nous la livrerons directement à votre porte.",
    },
    {
      question: "Quels modes de paiement sont acceptés ?",
      answer:
        "Nous acceptons toutes les principales cartes de crédit, PayPal et le paiement à la livraison dans certaines zones.",
    },
    {
      question: "Puis-je suivre ma commande en temps réel ?",
      answer:
        "Oui, une fois votre commande passée, vous pouvez suivre son progrès, de la préparation à la livraison.",
    },
    {
      question: "Y a-t-il des réductions ou des promotions disponibles ?",
      answer:
        "Oui ! Consultez notre section promotions ou abonnez-vous à notre newsletter pour connaître les dernières offres.",
    },
    {
      question: "ThaliaEats est-il disponible dans ma région ?",
      answer:
        "ThaliaEats est disponible dans plusieurs zones. Entrez votre code postal sur notre page d'accueil pour vérifier la disponibilité.",
    },
  ];

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const tabs = {
    about: (
      // <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      //   {about.map(({ title, content, imageSrc }, index) => (
      //     <CardAbout
      //       key={index}
      //       title={title}
      //       content={content}
      //       imageSrc={imageSrc}
      //     />
      //   ))}
      // </div>
      <p className="text-sm text-secondaryColor">
        Nous sommes une entreprise franco-congolaise et ainsi de suite...
      </p>
    ),
    faq: (
      <div className="">
        {faq.map((item, index) => (
          <div key={index} className="mb-4 ">
            <button
              onClick={() => toggleAccordion(index)}
              className={`w-full text-sm text-left font-medium px-3 py-5 flex justify-between items-center border-b-2 border-gray-300 ${openIndex === index
                ? " bg-secondaryColor text-white"
                : "bg-white text-gray-600 "
                } transition-all duration-300 rounded-md`}
            >
              {item.question}
              {openIndex === index ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            <Collapse isOpened={openIndex === index}>
              <div
                className={`transition-all text-sm duration-300 mt-2 px-3 py-5 rounded-md ${openIndex === index ? "bg-gray-300" : "bg-white"
                  }`}
              >
                {item.answer}
              </div>
            </Collapse>
          </div>
        ))}
      </div>
    ),

    partner: (
      <p className="text-sm text-secondaryColor">
        Rejoignez notre programme partenaire et développez votre entreprise avec nous. Accédez à une large gamme de clients, d'outils et d'informations pour maximiser votre potentiel.
      </p>
    ),
    support: (
      <p className="text-sm text-secondaryColor">
        Besoin d'assistance ? Notre équipe de support est là pour vous aider. Contactez-nous pour toute question concernant vos commandes, paiements ou autres demandes.
      </p>
    ),
  };

  return (
    <section className="max-w-[1300px] mx-auto px-3 md:px-5 mb-10">
      <div className="py-10 lg:py-20 lg:px-14 bg-[#f4f4f4] rounded-xl shadow-md px-5">
        <div className="flex items-center justify-between flex-col">
          <p className="text-lg lg:text-2xl font-semibold text-primaryColor mb-10">
            En savoir plus sur nous !
          </p>
          {/* Navigation des onglets */}
          <div className="flex gap-4 flex-wrap md:flex-nowrap justify-center">
            {["about", "faq", "partner", "support"].map((tab) => (
              <button
                key={tab}
                className={`transition-all duration-300 py-3 px-6 border-2 rounded-full text-sm font-medium ${activeTab === tab
                  ? "bg-primaryColor text-white border-primaryColor"
                  : "hover:bg-primaryColor hover:text-white hover:border-primaryColor"
                  }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === "about" && "Qui sommes-nous ?"}
                {tab === "faq" && "Questions fréquentes"}
                {tab === "partner" && "Programme partenaire"}
                {tab === "support" && "Aide & support"}
              </button>
            ))}
          </div>
        </div>

        {/* Contenu des onglets */}
        <div className="bg-white p-4 lg:p-10 mt-5 lg:mt-10 rounded-lg shadow-lg">
          {tabs[activeTab]}
        </div>
      </div>
    </section>
  );
}
