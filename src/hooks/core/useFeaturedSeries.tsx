import { AppApi } from "@/api";
import useSWR from "swr";

export const useFeaturedSeries = () => {
  return useSWR("featured-series", () =>
    AppApi.Series.getFeaturedSeries(),
  );
};
