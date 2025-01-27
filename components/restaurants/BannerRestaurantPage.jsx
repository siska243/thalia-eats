import Image from "next/image";
import restoImg3 from "@/public/assets/images/restoImg3.png";
import restoImg4 from "@/public/assets/images/restoImg4.png";
import logo from "@/public/assets/logo-thalia.png";

export default function BannerRestaurantPage() {
    return (
        <section className="max-w-[1300px] mx-auto px-3 md:px-5 mb-5">
            <div
                className="relative w-full lg:h-[450px] rounded-xl md:p-16 p-10 box-shadow-custom bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: `linear-gradient(rgba(3, 8, 31, 0.9), rgba(3, 8, 31, 0.9)), url(${logo.src})`
                }}
            >
                <div className="w-full flex lg:flex-row flex-col-reverse gap-5 justify-between items-end h-full">
                    <div className="w-full lg:w-[60%]">
                        <h6 className="lg:text-left text-center text-base font-extralight mb-3 text-white">
                            Description de thalia-eats
                        </h6>
                        <h2 className="text-center lg:text-left text-white font-semibold text-xl md:text-3xl lg:text-4xl md:mb-10 mb-5">
                            Thalia-Eats
                        </h2>
                        <div className="flex gap-3 items-center justify-center lg:items-start lg:justify-start flex-col md:flex-row">
                            <p className="flex items-center gap-2 text-sm font-normal text-white border border-white py-2 px-6 rounded-full">
                                <Image src={restoImg3} width={30} alt="order" /> Commande minimum :
                                5 $
                            </p>
                            <p className="flex items-center text-sm gap-2 font-normal text-white border border-white py-2 px-6 rounded-full">
                                <Image src={restoImg4} width={30} alt="order" /> Livraison :
                                20-30 Minutes
                            </p>
                        </div>
                    </div>
                    {/* Image */}
                    <div className="w-[70%] text-center md:w-[60%] lg:w-[40%] overflow-hidden rounded-xl mx-auto h-full">
                        <Image
                            src={logo}
                            className="w-full h-full object-scale-down rounded-xl"
                            alt="Thalia-Eats logo"
                            width={800}
                            height={800}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}