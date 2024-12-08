import { MdAccountCircle } from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";
import Settings from "./Settings";
import { useState } from "react";

export default function account({ account, isMobile }) {
  const [isSettingOpen, setIsSettingOpen] = useState(false);
  const { user } = account;
  const handlerSetting = () => {
    setIsSettingOpen(!isSettingOpen);
  };
  if (isMobile) {
    return (
      <div
        className="relative flex justify-center items-center mt-5 md:px-5 mx-auto  max-w-[90%]"
        onClick={handlerSetting}
      >
        {/* account */}
        <button className="flex items-center gap-4 shadow-xl py-3 px-6 rounded-full bg-secondaryColor">
          <MdAccountCircle className="text-2xl font-bold text-primaryColor" />
          <div className="flex items-center gap-2">
            <h4 className="text-white font-light text-sm tracking-wider">
              {user?.full_name}
            </h4>
            <IoIosArrowDown className="text-primaryColor" />
          </div>
        </button>
        {/* settings */}
        <Settings
          isSettingOpen={isSettingOpen}
          isMobile={true}
          className="mx-auto w-[90%] max-w-sm"
        />
      </div>
    )
  }

  return (

    <div className="relative" onClick={handlerSetting} >
      {/* account */}
      <button className="flex items-center gap-4 shadow-xl py-3 px-6 rounded-full bg-secondaryColor">
        <MdAccountCircle className="text-2xl font-bold text-primaryColor" />
        <div className="flex items-center gap-2">
          <h4 className="text-white font-light text-sm tracking-wider">
            {user?.full_name}
          </h4>
          <IoIosArrowDown className="text-primaryColor" />
        </div>
      </button>
      {/* settings */}
      <Settings isSettingOpen={isSettingOpen} />
    </div>
  );
}
