import React from "react";
import CardAll from "./CardAll";

export default function SectionAll() {
  const dealsData = [
    {
      imageSrc: "@/public/assets/images/food.png", // Les chemins réels de tes images
      title: "Royal Cheese Burger with extra Fries",
      other: "GBP 23.10",
      content: "1 McChicken™, 1 Big Mac™,  1 Royal Cheeseburger, 3 medium",
    },
    {
      imageSrc: "@/public/assets/images/food.png", // Les chemins réels de tes images
      title: "Royal Cheese Burger with extra Fries",
      other: "GBP 23.10",
      content: "1 McChicken™, 1 Big Mac™,  1 Royal Cheeseburger, 3 medium",
    },
    {
      imageSrc: "@/public/assets/images/food.png", // Les chemins réels de tes images
      title: "Royal Cheese Burger with extra Fries",
      other: "GBP 23.10",
      content: "1 McChicken™, 1 Big Mac™,  1 Royal Cheeseburger, 3 medium",
    },
    {
      imageSrc: "@/public/assets/images/food.png", // Les chemins réels de tes images
      title: "Royal Cheese Burger with extra Fries",
      other: "GBP 23.10",
      content: "1 McChicken™, 1 Big Mac™,  1 Royal Cheeseburger, 3 medium",
    },
    {
      imageSrc: "@/public/assets/images/food.png", // Les chemins réels de tes images
      title: "Royal Cheese Burger with extra Fries",
      other: "GBP 23.10",
      content: "1 McChicken™, 1 Big Mac™,  1 Royal Cheeseburger, 3 medium",
    },
    {
      imageSrc: "@/public/assets/images/food.png", // Les chemins réels de tes images
      title: "Royal Cheese Burger with extra Fries",
      other: "GBP 23.10",
      content: "1 McChicken™, 1 Big Mac™,  1 Royal Cheeseburger, 3 medium",
    },
  ];
  return (
    <div>
      <h5 className="text-primaryColor text-2xl font-bold mb-5">Burgers</h5>
      <div className="grid grid-cols-3 gap-5">
        {dealsData.map(({ imageSrc, title, other, content }, index) => {
          return (
            <CardAll
              key={index}
              imageSrc={imageSrc}
              title={title}
              other={other}
              content={content}
            />
          );
        })}
      </div>
    </div>
  );
}
