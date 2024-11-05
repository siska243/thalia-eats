import aboutImg from "@/public/assets/images/aboutImg.png";
import CardAbout from "./CardAbout";

export default function SectionAbout() {
  const about = [
    {
      imageSrc: `${aboutImg}`, // Les chemins réels de tes images
      title: "Place an Order!",
      content: "Place order through our website or Mobile app",
    },
    {
      imageSrc: `${aboutImg}`, // Les chemins réels de tes images
      title: "Track Progress",
      content: "Your can track your or derstatus with delivery time",
    },
    {
      imageSrc: `${aboutImg}`, // Les chemins réels de tes images
      title: "Track Progress",
      content: "Receive your order at alighting fast speed!",
    },
  ];
  return (
    <section className="max-w-[1300px] mx-auto px-5 bg-[#f4f4f4] rounded-xl shadow-md">
      <div className="py-20 px-14">
        <div className="flex items-center justify-between">
          <p className=" text-xl font-semibold">Know more about us!</p>
          {/* bouton */}
          <div className="flex gap-4">
            <button className="transition-all duration-300 hover:border-primaryColor hover:font-medium text-black font-normal py-2 px-6 border border-transparent rounded-full text-base">
              Frequent Questions
            </button>
            <button className="transition-all duration-300 hover:border-primaryColor hover:font-medium text-black font-normal py-2 px-6 border border-transparent rounded-full">
              Who we are?
            </button>
            <button className="transition-all duration-300 hover:border-primaryColor hover:font-medium text-black font-normal py-2 px-6 border border-transparent rounded-full">
              Partner Program
            </button>
            <button className="transition-all duration-300 hover:border-primaryColor hover:font-medium text-black font-normal py-2 px-6 border border-transparent rounded-full">
              Help & Support
            </button>
          </div>
        </div>

        {/* ********* about contents *************** */}

        <div className="bg-white p-10 mt-10 rounded-lg shadow-xl">
          {/* frequents questions starts */}
          <div className="flex gap-4 justify-between">
            {/* ** left colonne *** */}
            <div className="flex flex-col w-[30%] gap-3">
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
            <div className="flex gap-3 w-[60%]">
              <div>
                <div className="flex gap-3">
                  {about.map(({ title, content }, index) => {
                    return (
                      <CardAbout key={index} title={title} content={content} />
                    );
                  })}
                </div>
                <p className="text-center mt-6 text-base font-normal">
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
