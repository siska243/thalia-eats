import aboutImg from "@/public/assets/images/aboutImg.png";
import CardAbout from "./CardAbout";

export default function SectionAbout() {
  const about = [
    {
      imageSrc: aboutImg, // Les chemins réels de tes images
      title: "Place an Order!",
      content: "Place order through our website or Mobile app",
    },
    {
      imageSrc: aboutImg, // Les chemins réels de tes images
      title: "Track Progress",
      content: "Your can track your or derstatus with delivery time",
    },
    {
      imageSrc: aboutImg, // Les chemins réels de tes images
      title: "Track Progress",
      content: "Receive your order at alighting fast speed!",
    },
  ];
  return (
    <section className="max-w-[1300px] mx-auto px-3 md:px-5 ">
      <div className="py-10 lg:py-20 lg:px-14 bg-[#f4f4f4] rounded-xl shadow-md">
        <div className="flex items-center justify-between  flex-col gap-6 ">
          <p className="text-base  md:text-lg xl:text-2xl font-semibold text-primaryColor">
            En savoir plus sur nous !
          </p>
          {/* bouton */}
          <div className="flex gap-2 lg:gap-4 flex-wrap md:flex-nowrap">
            <button className="transition-all duration-300 hover:border-primaryColor hover:font-medium text-black font-normal py-2 px-4 lg:px-6 border border-transparent rounded-full text-base">
              Questions fréquentes
            </button>
            <button className="transition-all duration-300 hover:border-primaryColor hover:font-medium text-black font-normal py-2 px-4 lg:px-6border border-transparent rounded-full">
              Qui sommes-nous ?
            </button>
            <button className="transition-all duration-300 hover:border-primaryColor hover:font-medium text-black font-normal py-2 px-4 lg:px-6 border border-transparent rounded-full">
              Programme partenaire
            </button>
            <button className="transition-all duration-300 hover:border-primaryColor hover:font-medium text-black font-normal py-2 px-4 lg:px-6border border-transparent rounded-full">
              Aide & support
            </button>
          </div>
        </div>

        {/* ********* about contents *************** */}

        <div className="bg-white p-4 lg:p-10 mt-5 lg:mt-10 rounded-lg box-shadow-custom">
          {/* frequents questions starts */}
          <div className="flex lg:flex-row flex-col gap-4 justify-between">
            {/* ** left colonne *** */}
            <div className="flex flex-col w-full lg:w-[30%] gap-3">
              <button className="text-sm transition-all duration-300 hover:border-primaryColor hover:bg-primaryColor hover:font-medium text-black font-normal py-3 px-6 border border-transparent rounded-full text-center">
                How does ThaliaEats work?
              </button>
              <button className="text-sm transition-all duration-300 hover:border-primaryColor hover:bg-primaryColor hover:font-medium text-black font-normal py-3 px-6 border border-transparent rounded-full text-center">
                What payment methods are accepted?
              </button>
              <button className="text-sm transition-all duration-300 hover:border-primaryColor hover:bg-primaryColor hover:font-medium text-black font-normal py-3 px-6 border border-transparent rounded-full text-center">
                Can I track my order in real-time?
              </button>
              <button className="text-sm transition-all duration-300 hover:border-primaryColor hover:bg-primaryColor hover:font-medium text-black font-normal py-3 px-6 border border-transparent rounded-full text-center">
                Are there any special discounts or promotions available?
              </button>
              <button className="text-sm transition-all duration-300 hover:border-primaryColor hover:bg-primaryColor hover:font-medium text-black font-normal py-3 px-6 border border-transparent rounded-full text-center">
                Is Order.UK available in my area?
              </button>
            </div>
            {/* ** right colonne *** */}
            <div className="flex gap-3 w-full lg:w-[60%]">
              <div>
                <div className="flex gap-3 sm:flex-row flex-col">
                  {about.map(({ title, content, imageSrc }, index) => {
                    return (
                      <CardAbout
                        key={index}
                        title={title}
                        content={content}
                        imageSrc={imageSrc}
                      />
                    );
                  })}
                </div>
                <p className="text-center mt-3 md:mt-6 text-sm md:text-base font-normal">
                  Order.UK simplifies the food ordering process. Browse through
                  our diverse menu, select your favorite dishes, and proceed to
                  checkout. Your delicious meal will be on its way to your
                  doorstep in no time!
                </p>
              </div>
            </div>
          </div>
          {/* frequents questions end */}
        </div>
      </div>
    </section>
  );
}
