import CardRestaurants from "./CardResturants";
import defaultImage from "@/public/assets/images/food.png";
export default function SectionOffers({ data = [], isLoading }) {
  if (isLoading) {
    return <p>Loading ...</p>;
  }
  return (
    <section className=" max-w-[1300px] mx-auto px-3 md:px-5 py-5 md:py-10">
      <div className="w-full bg-white rounded-xl">
        <p className="text-primaryColor text-2xl mb-5 font-semibold uppercase">Tous nos restaurants</p>
        <div className="grid sm:grid-cols-2 grid-cols-1 md:grid-cols-3 gap-5">
          {data?.data?.map((restaurant, index) => {
            return (
              <CardRestaurants
                key={index}
                restaurant={restaurant}
                dafaultImage={defaultImage}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
