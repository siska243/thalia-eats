import EditCompte from "@/components/account/EditCompte";
import Information from "@/components/account/Informations";
import logo from "@/public/assets/logo-thalia.png";

export default function page() {
  return (

    <div className="min-h-screen bg-[#F3F4F6] h-full pt-[220px] md:pt-[200px] "
      // style={{
      //   backgroundImage: `linear-gradient(rgba(3, 8, 31, 0.92), rgba(3, 8, 31, 0.92)), url(${logo.src})`,
      //   backgroundSize: 'cover',
      //   backgroundPosition: 'center',
      //   backgroundRepeat: 'no-repeat',
      // }}
      >
      <div className="max-w-[1300px] mx-auto px-4 md:px-5  gap-8 pb-10 pt-3 flex flex-col">
        <div className="rounded-xl bg-white box-shadow-custom shadow-2xl h-full">
          <Information />
        </div>
        <div className="h-full">
          <EditCompte />
        </div>
      </div>
    </div>
  );
}
