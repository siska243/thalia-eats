import React from "react";

export default function Total() {
  return (
    <div className="border-b border-gray-300">
      <div className="p-5 flex gap-3 flex-col">
        <p className="flex items-center justify-between">
          <span className="text-lg font-semibold text-secondaryColor">
            Sub Total:
          </span>
          <span>€127.90</span>
        </p>
        <p className="flex items-center justify-between">
          <span className="text-lg font-semibold text-secondaryColor">
            Discounts:
          </span>
          <span>€127.90</span>
        </p>
        <p className="flex items-center justify-between">
          <span className="text-lg font-semibold text-secondaryColor">
            Delivery Fee:
          </span>
          <span>€127.90</span>
        </p>
      </div>
    </div>
  );
}
