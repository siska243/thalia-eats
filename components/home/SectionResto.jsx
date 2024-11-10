import CardResto from "./CardResto";

export default function SectionResto() {
  const restoData = [
    {
      imageSrc: "@/public/assets/images/food.png", // Les chemins réels de tes images
      title: "Titre 1",
      resto: "21 restaurants",
    },
    {
      imageSrc: "@/public/assets/images/food.png", // Les chemins réels de tes images
      title: "Titre 2",
      resto: "21 restaurants",
    },
    {
      imageSrc: "@/public/assets/images/food.png", // Les chemins réels de tes images
      title: "Titre 3",
      resto: "90 restaurants",
    },
    {
      imageSrc: "@/public/assets/images/food.png", // Les chemins réels de tes images
      title: "Titre 4",
      resto: "10 restaurants",
    },
    {
      imageSrc: "@/public/assets/images/food.png", // Les chemins réels de tes images
      title: "Titre 5",
      resto: "6 restaurants",
    },
    {
      imageSrc: "@/public/assets/images/food.png", // Les chemins réels de tes images
      title: "Titre 6",
      resto: "30 restaurants",
    },
  ];
  return (
    <section className="mt-6 lg:mt-12 max-w-[1300px] mx-auto px-3 md:px-5">
      <div>
        <p className="text-base  lg:text-lg xl:text-2xl font-semibold text-secondaryColor mb-6 md:mb-12">
          Order.uk Popular Categories 🤩
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {restoData.map(({ imageSrc, title, resto }, index) => {
            return (
              <CardResto
                key={index}
                imageSrc={imageSrc}
                title={title}
                resto={resto}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
