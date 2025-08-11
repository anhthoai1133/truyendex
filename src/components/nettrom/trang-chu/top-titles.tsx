"use client";

import Link from "next/link";
import { useEffect, useMemo } from "react";
import { twMerge } from "tailwind-merge";
import Skeleton from "react-loading-skeleton";

import { FaClock, FaHeart, FaStar, FaTrophy } from "react-icons/fa";
import { AspectRatio } from "@/components/shadcn/aspect-ratio";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/shadcn/tabs";
import { Utils } from "@/utils";
import { Constants } from "@/constants";
import { ErrorDisplay } from "../error-display";
import { useTopSeries, BackendSeries } from "@/hooks/core/useTopSeries";

const MangaTile = (props: {
  series: BackendSeries;
  title: string;
  order: number;
  hideCounter?: boolean;
  counter?: number;
  icon?: React.ReactNode;
}) => {
  const inTop3 = useMemo(() => {
    return props.order < 3;
  }, [props.order]);

  return (
    <li className="relative flex w-full gap-[8px] py-2" key={props.series.uuid}>
      <div className="absolute left-4 top-0 flex h-[64px] w-8 items-center justify-center text-right">
        <span
          className={twMerge(
            `fn-order text-[64px] font-black leading-none text-muted-foreground/30 pos${props.order + 1}`,
            inTop3 && "text-muted-foreground",
          )}
        >
          {props.order + 1}
        </span>
      </div>
      <div className="flex grow items-start gap-4 pl-12">
        <Link
          className="relative w-[64px] shrink-0 rounded shadow-[-5px_0_20px_rgba(0,0,0,0.5)]"
          title={props.title}
          href={Constants.Routes.nettrom.manga(props.series.uuid)}
        >
          <AspectRatio ratio={1} className="overflow-hidden rounded">
            <img
              className="lazy h-full w-full object-cover"
              src={props.series.coverImage || '/images/placeholder.jpg'}
              alt={props.title}
            />
          </AspectRatio>
        </Link>
        <div className="grow">
          <h3>
            <Link
              href={Constants.Routes.nettrom.manga(props.series.uuid)}
              className="line-clamp-2 font-semibold !text-white transition hover:no-underline"
            >
              {props.title}
            </Link>
          </h3>
          {!props.hideCounter && (
            <span className="mt-1 flex shrink-0 items-center gap-2 text-muted-foreground">
              {props.icon}
              {Utils.Number.formatViews(props.counter || 0)}
            </span>
          )}
        </div>
      </div>
    </li>
  );
};

const MangaTileSkeleton = (props: {
  order: number;
  hideCounter?: boolean;
  icon?: React.ReactNode;
  counter?: number;
}) => {
  const inTop3 = useMemo(() => {
    return props.order < 3;
  }, [props.order]);

  return (
    <li className="relative flex w-full gap-[8px] py-2" key={props.order}>
      <div className="absolute left-4 top-0 flex h-[64px] w-8 items-center justify-center text-right">
        <span
          className={twMerge(
            `fn-order text-[64px] font-black leading-none text-muted-foreground/30 pos${props.order + 1}`,
            inTop3 && "text-muted-foreground",
          )}
        >
          {props.order + 1}
        </span>
      </div>
      <div className="flex grow items-start gap-4 pl-12">
        <div className="relative w-[64px] shrink-0 rounded shadow-[-5px_0_20px_rgba(0,0,0,0.5)]">
          <AspectRatio ratio={1} className="overflow-hidden rounded">
            <div className="h-full w-full">
              <Skeleton height="100%" width="100%" />
            </div>
          </AspectRatio>
        </div>
        <div className="grow">
          <h3>
            <div className="line-clamp-2 font-semibold !text-white transition hover:no-underline">
              <Skeleton />
            </div>
          </h3>
          {!props.hideCounter && (
            <span className="mt-1 flex shrink-0 items-center gap-2 text-muted-foreground">
              {props.icon}
              <Skeleton width={20} />
            </span>
          )}
        </div>
      </div>
    </li>
  );
};

// Helper function để get title từ backend data
const getSeriesTitle = (series: BackendSeries): string => {
  if (typeof series.title === 'string') return series.title;
  return series.title.vi || series.title.en || Object.values(series.title)[0] || 'Unknown Title';
};

export default function TopTitles({ groupId }: { groupId?: string }) {
  // Lấy dữ liệu từ backend thay vì MangaDx
  const {
    seriesList: topSeriesList,
    isLoading: topSeriesLoading,
    error: topSeriesError,
  } = useTopSeries('follows', 7);

  const {
    seriesList: newSeriesList,
    isLoading: newSeriesLoading,
    error: newSeriesError,
  } = useTopSeries('new', 7);

  const {
    seriesList: favoriteSeriesList,
    isLoading: favoriteSeriesLoading,
    error: favoriteSeriesError,
  } = useTopSeries('rating', 7);

  return (
    <div className="">
      <div className="">
        <div className="">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="flex items-center gap-4 text-[20px] font-medium text-web-title">
              <FaTrophy />
              Bảng xếp hạng tháng này
            </h2>
          </div>
          <Tabs defaultValue="top" className="w-full">
            <TabsList className="mb-4 grid h-[48px] grid-cols-3 bg-white/10 p-2">
              <TabsTrigger
                value="top"
                className="flex h-full items-center gap-3 rounded text-[12px]"
              >
                <FaStar />
                Top
              </TabsTrigger>
              <TabsTrigger
                value="favorite"
                className="flex h-full items-center gap-3 rounded text-[12px]"
              >
                <FaHeart />
                Yêu thích
              </TabsTrigger>
              <TabsTrigger
                value="new"
                className="flex h-full items-center gap-3 rounded text-[12px]"
              >
                <FaClock />
                Mới
              </TabsTrigger>
            </TabsList>
            <TabsContent value="top">
              <ul className="flex flex-col gap-4">
                {topSeriesLoading
                  ? [...Array(7)].map((_, index) => (
                      <MangaTileSkeleton
                        order={index}
                        key={index}
                        icon={<FaStar />}
                      />
                    ))
                  : topSeriesList.map((series: BackendSeries, index: number) => {
                      const title = getSeriesTitle(series);
                      return (
                        <MangaTile
                          order={index}
                          key={series.uuid}
                          title={title}
                          series={series}
                          icon={<FaStar />}
                          counter={series.followCount}
                        />
                      );
                    })}
                {topSeriesError && (
                  <ErrorDisplay error={topSeriesError} />
                )}
              </ul>
            </TabsContent>
            <TabsContent value="favorite">
              <ul className="flex flex-col gap-4">
                {favoriteSeriesLoading
                  ? [...Array(7)].map((_, index) => (
                      <MangaTileSkeleton
                        order={index}
                        key={index}
                        icon={<FaHeart />}
                      />
                    ))
                  : favoriteSeriesList.map((series: BackendSeries, index: number) => {
                      const title = getSeriesTitle(series);
                      return (
                        <MangaTile
                          order={index}
                          key={series.uuid}
                          title={title}
                          series={series}
                          icon={<FaHeart />}
                          counter={Math.round((series.rating || 0) * 10) / 10}
                        />
                      );
                    })}
                {favoriteSeriesError && (
                  <ErrorDisplay error={favoriteSeriesError} />
                )}
              </ul>
            </TabsContent>
            <TabsContent value="new">
              <ul className="flex flex-col gap-4">
                {newSeriesLoading
                  ? [...Array(7)].map((_, index) => (
                      <MangaTileSkeleton
                        order={index}
                        key={index}
                        icon={<FaClock />}
                      />
                    ))
                  : newSeriesList.map((series: BackendSeries, index: number) => {
                      const title = getSeriesTitle(series);
                      return (
                        <MangaTile
                          order={index}
                          key={series.uuid}
                          title={title}
                          series={series}
                          hideCounter
                        />
                      );
                    })}
                {newSeriesError && (
                  <ErrorDisplay error={newSeriesError} />
                )}
              </ul>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}