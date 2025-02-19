import React from "react";

export default function Info({ titre, content, street, user }) {
  return (
    <div className="flex flex-col gap-2 ">
      <p className=" text-sm text-gray-500">{titre}</p>
      {street ? (
        <p className="text-base font-medium text-secondaryColor">
          Av:{user?.street}, N°{user?.number_street}, C/ {user?.town_id.title}
        </p>
      ) : (
        <p className="text-base font-medium text-secondaryColor">{content}</p>
      )}
    </div>
  );
}
