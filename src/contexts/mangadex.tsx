"use client";

import React, { createContext, useCallback, useContext, useState } from "react";
import { uniq } from "lodash";

import {
  ExtendManga,
  GetMangasStatisticResponse,
  MangaList,
  MangaResponse,
  MangaStatistic,
} from "@/types/mangadex";
// import { MangadexApi } from "@/api";
import { Utils } from "@/utils";

export type Mangas = { [k: string]: ExtendManga };
export type MangaStatistics = Record<string, MangaStatistic>;

export const MangadexContext = createContext<{
  mangas: Mangas;
  mangaStatistics: MangaStatistics;
  updateMangas: (options: { ids?: string[] }) => Promise<void>;
  updateMangaStatistics: (options: { manga: string[] }) => Promise<void>;
  addMangas: (mangaList: ExtendManga[]) => void;
}>({
  mangas: {},
  mangaStatistics: {},
  updateMangas: () => new Promise(() => null),
  updateMangaStatistics: () => new Promise(() => null),
  addMangas: ([]) => null,
});

export const MangadexContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [mangas, setMangas] = useState<Mangas>({});
  const [mangaStatistics, setMangaStatistics] = useState<MangaStatistics>({});

  const updateMangas = useCallback(async (_options: { ids?: string[] }) => {
    // No-op: dữ liệu manga đã lấy từ backend ở page level
    return;
  }, []);

  const addMangas = useCallback(
    (mangaList: ExtendManga[]) => {
      setMangas((prevMangas) => {
        for (const manga of mangaList) {
          prevMangas[manga.id] = Utils.Mangadex.extendRelationship(
            manga,
          ) as ExtendManga;
        }
        return { ...prevMangas };
      });
    },
    [setMangas],
  );

  const updateMangaStatistics = useCallback(async (_options: { manga: string[] }) => {
    // No-op for now: thống kê lấy từ backend qua series.info
    return;
  }, []);

  return (
    <MangadexContext.Provider
      value={{
        mangas,
        updateMangas,
        mangaStatistics,
        updateMangaStatistics,
        addMangas,
      }}
    >
      {children}
    </MangadexContext.Provider>
  );
};

export const useMangadex = () => useContext(MangadexContext);
