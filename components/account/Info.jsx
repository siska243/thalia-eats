import React from "react";

export default function Info({ titre, content }) {
  return (
    <div className="flex flex-col gap-1 border-b border-gray-800 pb-3 mb-10">
      <p className=" text-sm text-gray-500">{titre}</p>
      <p className="text-base font-medium text-primaryColor">{content}</p>
    </div>
  );
}
