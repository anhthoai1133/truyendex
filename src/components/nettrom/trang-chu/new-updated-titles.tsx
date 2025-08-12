"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";

import { useLatestChapters } from "@/hooks/core/useLatestChapters";
// import { useMangadex } from "@/contexts/mangadex"; // Removed - using local backend

import { Constants } from "@/constants";
import { FaClock } from "react-icons/fa";
import { DataLoader } from "@/components/DataLoader";
import { Utils } from "@/utils";
import { useReadingHistory } from "@/hooks/core/useReadingHistory";
import { useSettingsContext } from "@/contexts/settings";

import Pagination from "../Pagination";
import MangaTile from "../manga-tile";

export default function LastestChapters({
  title,
  groupId,
}: {
  title?: string;
  groupId?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const page = Number(params.get("page")) || 0;
  const [totalPage, setTotalPage] = useState(0);
  const { data: historyData } = useReadingHistory();
  const { filteredLanguages, filteredContent, originLanguages } =
    useSettingsContext();
  const { data, isLoading, error } = useLatestChapters(50, page);
  // const { mangas, mangaStatistics, updateMangas, updateMangaStatistics } =
  //   useMangadex(); // Removed - using local backend
  // const updates: Record<string, any[]> = {};

  // if (data?.data) {
  //   for (const chapter of data.data) {
  //     const mangaId = chapter.series?.id;
  //     if (!mangaId) continue;
  //     if (!updates[mangaId]) {
  //       updates[mangaId] = [];
  //     }
  //     updates[mangaId].push(chapter);
  //   }
  // } // Removed - using direct backend data

  // useEffect(() => {
  //   if (data?.data?.length > 0) {
  //     updateMangas({
  //       ids: data.data.filter((c: any) => !!c?.series?.id).map((c: any) => c.series.id),
  //     });
  //   }
  // }, [data]); // Removed - using local backend

  // useEffect(() => {
  //   if (data?.data?.length > 0) {
  //     updateMangaStatistics({
  //       manga: data.data.filter((c: any) => !!c?.series?.id).map((c: any) => c.series.id),
  //     });
  //   }
  // }, [data]); // Removed - using local backend

  useEffect(() => {
    if (!data?.total) return;
    setTotalPage(Math.floor(data.total / 50));
  }, [data]);

  const history = historyData?.data || [];

  return (
    <div className="Module Module-163" id="new-updates">
      <div className="ModuleContent">
        <div className="items">
          {title && (
            <div className="relative">
              <h1 className="my-0 mb-5 flex items-center gap-3 text-[20px] text-web-title">
                <FaClock />
                <span>{title}</span>
              </h1>
            </div>
          )}
          <DataLoader isLoading={isLoading} error={error}>
            <div className={`grid grid-cols-2 gap-[20px] lg:grid-cols-4`}>
              {data?.data?.slice(0, 12).map((chapter: any) => {
                if (!chapter.series) return null;
                
                const series = chapter.series;
                const seriesTitle = typeof series.title === 'string' 
                  ? series.title 
                  : series.title?.vi || series.title?.en || 'Untitled';
                
                return (
                  <MangaTile
                    id={series.uuid}
                    key={`${series.uuid}-${chapter.id}`}
                    thumbnail={series.coverImage || '/images/placeholder.jpg'}
                    title={seriesTitle}
                    chapters={[{
                      id: chapter.id,
                      title: chapter.title || 'Chapter',
                      subTitle: Utils.Date.formatNowDistance(chapter.updatedAt),
                    }]}
                    readedChapters={undefined}
                    mangaStatistic={undefined}
                  />
                );
              })}
            </div>
          </DataLoader>
        </div>
        <Pagination
          onPageChange={(event) => {
            router.push(`${pathname}?page=${event.selected}#new-updates`);
          }}
          pageCount={totalPage}
          forcePage={page}
          marginPagesDisplayed={1}
          pageRangeDisplayed={2}
        />
      </div>
    </div>
  );
}
