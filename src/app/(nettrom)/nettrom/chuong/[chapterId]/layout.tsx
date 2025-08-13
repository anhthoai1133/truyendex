import { Metadata, ResolvingMetadata } from "next";
import { ChapterContextProvider } from "@/contexts/chapter";
import { axios } from "@/api/core/axios";
import { Constants } from "@/constants";
import { Utils } from "@/utils";
import { ExtendChapter, ExtendManga } from "@/types/mangadex";

export async function generateMetadata(
  { params }: { params: { chapterId: string } },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  // read route params
  const id = params.chapterId;

  const previousImages = (await parent).openGraph?.images || [];
  const mdImage = undefined;
  try {
    const { data: chapter } = await axios({ method: 'GET', url: `/api/series/chapter/${id}` });
    const mangaTitle = chapter?.series?.title?.vi || chapter?.series?.title?.en || "";
    return {
      title: `Đọc chương ${Utils.Mangadex.getChapterTitle(chapter)} - ${mangaTitle} tại ${Constants.APP_NAME}`,
      openGraph: {},
      twitter: {},
    };
  } catch (error) {
    console.error(error);
  }

  return { title: `Đọc chương mới nhất tại ${Constants.APP_NAME}` };
}

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { chapterId: string };
}) {
  const { data: chapter } = await axios({ method: 'GET', url: `/api/series/chapter/${params.chapterId}` });
  const extenedChapter = Utils.Mangadex.extendRelationship({
    id: chapter.uuid,
    type: 'chapter',
    attributes: {
      title: chapter.title,
      volume: chapter.volume,
      chapter: chapter.chapterNo,
      translatedLanguage: chapter.translatedLanguage,
      publishAt: chapter.publishAt,
      readableAt: chapter.readableAt,
      updatedAt: chapter.updatedAt,
    },
    relationships: [
      chapter.series ? { id: chapter.series.uuid, type: 'manga', attributes: { title: chapter.series.title, coverImage: chapter.series.coverImage } } : undefined,
      chapter.group ? { id: chapter.group.uuid, type: 'scanlation_group', attributes: { name: chapter.group.name } } : undefined,
    ].filter(Boolean) as any,
  }) as ExtendChapter;
  return (
    <ChapterContextProvider prefectchedChapter={extenedChapter}>
      <div className="mx-[-12px]">
        <div className="w-full">{children}</div>
      </div>
    </ChapterContextProvider>
  );
}
