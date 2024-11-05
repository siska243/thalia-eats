import CardDeals from "./CardDeals";

export default function SectionDeals() {
  const dealsData = [
    {
      imageSrc: "@/public/assets/images/food.png", // Les chemins réels de tes images
      title: "Titre 1",
      percent: "-40%",
    },
    {
      imageSrc: "@/public/assets/images/food.png", // Les chemins réels de tes images
      title: "Titre 2",
      percent: "-20%",
    },
    {
      imageSrc: "@/public/assets/images/food.png", // Les chemins réels de tes images
      title: "Titre 3",
      percent: "-17%",
    },
  ];
  return (
    <section className=" max-w-[1300px] mx-auto px-5">
      <div className="w-full bg-white rounded-xl">
        {/* top exclusive deals */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <p className="text-2xl font-semibold text-secondaryColor">
              Up to -40% 🎊 Order.uk exclusive deals
            </p>
          </div>
          <div className="flex gap-6">
            <button className="transition-all duration-300 hover:border-primaryColor hover:text-primaryColor text-secondaryColor py-2 px-6 border-2 border-transparent rounded-full">
              Vegan
            </button>
            <button className="transition-all duration-300 hover:border-primaryColor hover:text-primaryColor text-secondaryColor py-2 px-6 border-2 border-transparent rounded-full">
              Sushi
            </button>
            <button className="transition-all duration-300 hover:border-primaryColor hover:text-primaryColor text-secondaryColor py-2 px-6 border-2 border-transparent rounded-full">
              Pizza & Fast food
            </button>
            <button className="transition-all duration-300 hover:border-primaryColor hover:text-primaryColor text-secondaryColor py-2 px-6 border-2 border-transparent rounded-full">
              others
            </button>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-5">
          {dealsData.map(({ imageSrc, title, percent }, index) => {
            return (
              <CardDeals
                key={index}
                imageSrc={imageSrc}
                title={title}
                percent={percent}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
