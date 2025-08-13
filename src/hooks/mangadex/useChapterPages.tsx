import useSWR from "swr/immutable";
import { axios } from "@/api/core/axios";

export default function useChapterPages(chapterId: string | null) {
  const { data, isLoading, error } = useSWR(
    chapterId ? ["chapter-pages", chapterId] : null,
    async () => {
      const res = await axios({
        method: "GET",
        url: `/api/series/chapter/${chapterId}/pages`,
      });
      return res.data as { data: Array<{ imageUrl: string }>; total: number };
    },
  );
  const pages = data?.data?.map((p) => p.imageUrl) || [];
  return { pages, isLoading, error };
}
