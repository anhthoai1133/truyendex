"use client";

import { useFeaturedSeries } from "@/hooks/core/useFeaturedSeries";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import MangaTile from "@/components/nettrom/manga-tile";
import Iconify from "@/components/iconify";
import { FaFire } from "react-icons/fa";

export default function FeaturedTitles() {
  const {
    data,
    isLoading,
    error,
    mutate,
  } = useFeaturedSeries();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <p className="text-red-500">Không thể tải dữ liệu</p>
      </div>
    );
  }

  const featuredTitles = data.data;

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-4">
        <h2 className="my-0 flex items-center gap-3 text-[20px] text-web-title">
          <FaFire />
          <span>Truyện đề cử</span>
        </h2>
      </div>

      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation={{
          nextEl: ".swiper-button-next-custom",
          prevEl: ".swiper-button-prev-custom",
        }}
        pagination={false}
        autoplay={{ delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true }}
        loop
        spaceBetween={20}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
          1280: { slidesPerView: 5 },
        }}
        className="featured-swiper"
      >
        {featuredTitles.map((manga: any) => (
          <SwiperSlide key={manga.id}>
            <MangaTile
              id={manga.id}
              title={manga.title}
              thumbnail={manga.coverImage}
              chapters={manga.chapters?.map((c: any) => ({
                id: c.uuid,
                title: c.title,
                subTitle: new Date(c.updatedAt).toLocaleDateString('vi-VN'),
              })) || []}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
