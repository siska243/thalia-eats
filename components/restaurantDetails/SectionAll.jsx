import CardAll from "./CardAll";

export default function SectionAll({ cat }) {
  return (
    <div>
      <h5 className="text-primaryColor text-xl md:text-2xl font-bold mb-5 uppercase">
        {cat.title}
      </h5>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cat?.product?.map((product) => {
          return (
            <CardAll
              key={product.uid}
              product={product}
            />
          );
        })}
      </div>
    </div>
  );
}
