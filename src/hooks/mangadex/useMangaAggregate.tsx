import useSWR from "swr/immutable";
import { ChapterItem } from "@/types/mangadex";
import { axios } from "@/api/core/axios";

export default function useAggregate(id: string | null, _options: any) {
  const { data, isLoading, error } = useSWR(
    id ? [id, "aggregate"] : null,
    async () => {
      // Use new backend endpoint we added: series chapters listing
      const res = await axios({
        method: "GET",
        url: `/api/series/${id}/chapters`,
        params: { limit: 1000, page: 0 },
      });
      return res.data as {
        data: Array<{ uuid: string; volume: string | null; chapterNo: string | null }>;
      };
    },
  );

  let chapterList: ChapterItem[] = [];
  if (data?.data) {
    chapterList = data.data
      .map((c) => ({
        id: c.uuid,
        volume: c.volume || "none",
        chapter: c.chapterNo || "0",
      }))
      .sort((a, b) => {
        if (a.volume === b.volume) return parseFloat(a.chapter) - parseFloat(b.chapter);
        if (a.volume === "none") return 1;
        if (b.volume === "none") return -1;
        return parseFloat(a.volume) - parseFloat(b.volume);
      });
  }

  return { chapterList, aggregate: null, data, isLoading, error };
}
