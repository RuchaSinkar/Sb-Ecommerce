import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { Autoplay, Pagination, EffectFade, Navigation } from "swiper/modules";

import { bannerLists } from "../../utils";
import { Link } from "react-router-dom";

const colors = ["bg-banner-color1", "bg-banner-color2", "bg-banner-color3"];

const HeroBanner = () => {
  return (
    <div className="py-2 rounded-md">
      <Swiper
        grabCursor={true}
        slidesPerView={1}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        navigation
        pagination={{ clickable: true }}
        modules={[Pagination, EffectFade, Navigation, Autoplay]}
      >
        {bannerLists.map((item, index) => (
          <SwiperSlide key={item.id}>
            <div
              className={`rounded-md sm:h-[500px] h-96 ${colors[index % colors.length]}`}
            >
              <div className="flex items-center justify-center h-full">

                {/* TEXT SECTION */}
                <div className="hidden lg:flex justify-center w-1/2 p-8">
                  <div className="text-center">
                    <h3 className="text-3xl text-white font-bold">
                      {item.title}
                    </h3>

                    <h1 className="text-5xl text-white font-bold mt-2">
                      {item.subtitle}
                    </h1>

                    <p className="text-white font-bold mt-4">
                      {item.description}
                    </p>

                    <Link
                      to="/products"
                      className="mt-6 inline-block bg-black text-white py-2 px-4 rounded-sm hover:bg-gray-800 transition"
                    >
                      Shop
                    </Link>
                  </div>
                </div>

                {/* IMAGE SECTION */}
                <div className="w-full lg:w-1/2 flex justify-center p-4">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="max-h-[400px] object-contain"
                  />
                </div>

              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HeroBanner;