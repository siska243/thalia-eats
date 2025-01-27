import CardOffers from "./CardOffers";
import food from "@/public/assets/images/food.png";
export default function SectionOffers({ products }) {
  console.log("Les produits", products);

  return (
    <section className=" max-w-[1300px] mx-auto px-3 md:px-5 py-5 md:py-10 cc">
      <div className="w-full bg-white rounded-xl">
        <div className="grid sm:grid-cols-2 grid-cols-1 md:grid-cols-3 gap-5">
          {products[0]?.map((product) => {
            return (
              <CardOffers
                key={product.uid}
                product={product}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
