import useSWR from "swr/immutable";
import { useEffect, useState } from "react";

import { Chapter, ExtendChapter } from "@/types/mangadex";
import { Utils } from "@/utils";
import { axios } from "@/api/core/axios";

export default function useChapter(
  chapterId: string | null,
  prefectchedChapter: Chapter,
) {
  const { data, isLoading, error } = useSWR(
    chapterId ? ["chapter", chapterId] : null,
    async () => {
      const res = await axios({
        method: "GET",
        url: `/api/series/chapter/${chapterId}`,
      });
      return res.data;
    },
  );

  const [chapter, setChapter] = useState<ExtendChapter | null>(
    prefectchedChapter,
  );

  useEffect(() => {
    if (!data) return;
    // Map backend chapter to ExtendChapter minimal shape for UI
    setChapter(
      Utils.Mangadex.extendRelationship({
        id: data.uuid,
        type: "chapter",
        attributes: {
          title: data.title,
          volume: data.volume,
          chapter: data.chapterNo,
          translatedLanguage: data.translatedLanguage,
          publishAt: data.publishAt,
          readableAt: data.readableAt,
          updatedAt: data.updatedAt,
        },
        relationships: [
          data.series
            ? {
                id: data.series.uuid,
                type: "manga",
                attributes: {
                  title: data.series.title,
                  coverImage: data.series.coverImage,
                },
              }
            : undefined,
          data.group
            ? {
                id: data.group.uuid,
                type: "scanlation_group",
                attributes: { name: data.group.name },
              }
            : undefined,
        ].filter(Boolean) as any,
      }) as ExtendChapter,
    );
  }, [data]);

  return { chapter, data, isLoading, error };
}
