"use client";
import Info from "./Info";
import useGetCurrentUser from "@/hooks/useGetCurrentUser";

export default function Information() {
  const { user } = useGetCurrentUser();
  return (

    <div className="p-5 lg:p-10" >
      {
        user && user.user ? (
          <>
            <Info titre="Nom complet" content={user.user.full_name} />
            <Info titre="Email" content={user.user.email} />
            <Info titre="Téléphone" content={user.user.phone} />
            <Info titre="Adresse" content={user.user.principal_adresse} />
          </>
        ) : (<p className="text-gray-500">Veuillez vous connecter pour voir ces informations.</p>)
      }
    </div >
  );
}
