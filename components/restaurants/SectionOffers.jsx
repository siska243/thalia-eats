import CardOffers from "./CardOffers";
export default function SectionOffers() {
  const dealsData = [
    {
      imageSrc: "@/public/assets/images/food.png", // Les chemins réels de tes images
      title: "First Order Discount",
      percent: "-40%",
      content: "McDonald’s East London",
    },
    {
      imageSrc: "@/public/assets/images/food.png", // Les chemins réels de tes images
      title: "Vegan Discount",
      percent: "-20%",
      content: "McDonald’s East London",
    },
    {
      imageSrc: "@/public/assets/images/food.png", // Les chemins réels de tes images
      title: "Free ice Cream Offer",
      percent: "-17%",
      content: "McDonald’s East London",
    },
  ];
  return (
    <section className=" max-w-[1300px] mx-auto px-5 py-16">
      <div className="w-full bg-white rounded-xl">
        <div className="grid grid-cols-3 gap-5">
          {dealsData.map(({ imageSrc, title, percent, content }, index) => {
            return (
              <CardOffers
                key={index}
                imageSrc={imageSrc}
                title={title}
                percent={percent}
                content={content}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
