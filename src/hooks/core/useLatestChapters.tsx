import { AppApi } from "@/api";
import useSWR from "swr";

export const useLatestChapters = (limit: number = 50, page: number = 0) => {
  return useSWR(["latest-chapters", limit, page], () =>
    AppApi.Series.getLatestChapters(limit, page),
  );
};
