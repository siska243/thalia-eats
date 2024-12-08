import EditAccount from "@/components/account/EditAccount";
import Information from "@/components/account/Informations";
export default function page() {
  return (

    <div className="h-full pt-[220px] md:pt-[230px]">
      <div className="max-w-[1300px] mx-auto px-3 md:px-5  grid md:grid-cols-2 lg:grid-cols-3 gap-10 pb-10 pt-3">
        <div className="rounded-xl bg-secondaryColor box-shadow-custom">
          <Information />
        </div>
        <div className="lg:col-span-2 box-shadow-custom">
          <EditAccount />
        </div>
      </div>
    </div>
  );
}
