import * as SeriesApi from "@/api/core/series";
import CommentSection from "@/components/nettrom/binh-luan/comment-section";
import TopTitles from "@/components/nettrom/trang-chu/top-titles";
import Manga from "@/components/nettrom/truyen-tranh/manga";
import { ExtendManga } from "@/types/mangadex";
import { Utils } from "@/utils";

export default async function TruyenTranh({
  params,
}: {
  params: { mangaId: string };
}) {
  try {
    // Luôn lấy data từ backend thay vì MangaDex
    const backendSeries = await SeriesApi.getSeriesDetail(params.mangaId);
    
    // Convert backend data sang format MangaDex để tương thích với UI hiện tại
    const manga = Utils.Manga.convertBackendSeriesToMangaFormat(backendSeries) as unknown as ExtendManga;

    return (
      <div className="grid grid-cols-1 gap-[40px] lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Manga
            mangaId={params.mangaId}
            prefetchedManga={Utils.Mangadex.extendRelationship(manga) as ExtendManga}
          />
          <CommentSection typeId={params.mangaId} type="series" />
        </div>
        <div>
          <TopTitles />
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading series from backend:', error);
    
    // Fallback: hiển thị error page
    return (
      <div className="grid grid-cols-1 gap-[40px] lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
            <h2 className="text-2xl font-bold text-red-500 mb-4">
              Không tìm thấy truyện
            </h2>
            <p className="text-gray-600 mb-4">
              Truyện bạn tìm không tồn tại hoặc đã bị xóa.
            </p>
            <a 
              href="/nettrom" 
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Về trang chủ
            </a>
          </div>
        </div>
        <div>
          <TopTitles />
        </div>
      </div>
    );
  }
}