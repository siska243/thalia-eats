"use client";
import Info from "./Info";
import useGetCurrentUser from "@/hooks/useGetCurrentUser";

export default function Information() {
  const { user } = useGetCurrentUser();

  console.log(user);
  
  return (

    <div className="p-4 lg:p-10" >
      {
        user && user.user ? (
          <div className="flex flex-col gap-5 md:flex-row md:gap-10">
            <Info titre="Nom complet" content={user.user.full_name} />
            <Info titre="Email" content={user.user.email} />
            <Info titre="Téléphone" content={user.user.phone} />
            <Info titre="Adresse" user={user.user} street={true}/>
          </div>
        ) : (<p className="text-gray-500">Veuillez vous connecter pour voir ces informations.</p>)
      }
    </div >
  );
}
