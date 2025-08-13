import useSWR from "swr";
import { ExtendChapter } from "@/types/mangadex";
import { Constants } from "@/constants";
import { Utils } from "@/utils";
import { axios } from "@/api/core/axios";

export const chaptersPerPage = Constants.Mangadex.CHAPTER_LIST_LIMIT;

export default function useChapterList(
  mangaId: string,
  options: { offset?: number } = {},
) {
  const limit = chaptersPerPage;
  const page = Math.floor((options.offset || 0) / limit);

  const { data, isLoading, error } = useSWR(
    [mangaId, page, limit],
    async () => {
      const res = await axios({
        method: "GET",
        url: `/api/series/${mangaId}/chapters`,
        params: { page, limit },
      });
      return res.data as {
        data: Array<{
          id: number;
          uuid: string;
          title: string | null;
          volume: string | null;
          chapterNo: string | null;
          translatedLanguage: string;
          publishAt: string | null;
          readableAt: string | null;
          updatedAt: string;
          mdUpdatedAt: string | null;
          groups: Array<{ uuid: string; name: string | null }>;
        }>;
        total: number;
        limit: number;
        offset: number;
      };
    },
    { revalidateOnFocus: false, refreshInterval: 0 },
  );

  const mapped: ExtendChapter[] = (data?.data || []).map((c) =>
    Utils.Mangadex.extendRelationship({
      id: c.uuid,
      type: "chapter",
      attributes: {
        title: c.title,
        volume: c.volume,
        chapter: c.chapterNo,
        translatedLanguage: c.translatedLanguage,
        publishAt: c.publishAt,
        readableAt: c.readableAt,
        updatedAt: c.updatedAt,
      },
      relationships: [
        ...(c.groups?.[0]
          ? [
              {
                id: c.groups[0].uuid,
                type: "scanlation_group",
                attributes: { name: c.groups[0].name },
              },
            ]
          : []),
      ],
    }) as unknown as ExtendChapter,
  );

  return { chapters: mapped, data, isLoading, error };
}
