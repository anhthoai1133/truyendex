"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";

import { useLatestChapters } from "@/hooks/core/useLatestChapters";
import { useMangadex } from "@/contexts/mangadex";

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
  const { mangas, mangaStatistics, updateMangas, updateMangaStatistics } =
    useMangadex();
  const updates: Record<string, any[]> = {};

  if (data?.data) {
    for (const chapter of data.data) {
      const mangaId = chapter.series?.id;
      if (!mangaId) continue;
      if (!updates[mangaId]) {
        updates[mangaId] = [];
      }
      updates[mangaId].push(chapter);
    }
  }

  useEffect(() => {
    if (data?.data?.length > 0) {
      updateMangas({
        ids: data.data.filter((c: any) => !!c?.series?.id).map((c: any) => c.series.id),
      });
    }
  }, [data]);

  useEffect(() => {
    if (data?.data?.length > 0) {
      updateMangaStatistics({
        manga: data.data.filter((c: any) => !!c?.series?.id).map((c: any) => c.series.id),
      });
    }
  }, [data]);

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
              {Object.entries(updates).map(([mangaId, chapterList]) => {
                const coverArt = Utils.Mangadex.getCoverArt(mangas[mangaId]);
                const mangaTitle = Utils.Mangadex.getMangaTitle(
                  mangas[mangaId],
                );
                const readedChapters = history.find((h: any) => h.mangaId === mangaId);
                return (
                  <MangaTile
                    id={mangaId}
                    key={mangaId}
                    thumbnail={coverArt}
                    title={mangaTitle}
                    chapters={chapterList.slice(0, 3).map((chapter) => ({
                      id: chapter.id,
                      title: chapter.title,
                      subTitle: Utils.Date.formatNowDistance(
                        new Date(chapter.updatedAt),
                      ),
                    }))}
                    readedChapters={readedChapters}
                    mangaStatistic={mangaStatistics[mangaId]}
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
