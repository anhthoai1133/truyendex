import { Metadata, ResolvingMetadata } from "next";
import * as SeriesApi from "@/api/core/series";
import { Utils } from "@/utils";
import { Constants } from "@/constants";

export async function generateMetadata(
  { params }: { params: { mangaId: string } },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  // read route params
  const id = params.mangaId;

  const previousImages = (await parent).openGraph?.images || [];
  const mdImage = {
    url: `https://og.mangadex.org/og-image/manga/${id}`,
    width: 1200,
    height: 630,
  };
  
  try {
    // Lấy data từ backend thay vì MangaDex
    const backendSeries = await SeriesApi.getSeriesDetail(id);
    
    // Convert sang format tương thích
    const manga = Utils.Manga.convertBackendSeriesToMangaFormat(backendSeries);
    
    // Get title từ backend data
    const title = typeof manga.attributes.title === 'string' 
      ? manga.attributes.title 
      : manga.attributes.title?.vi || manga.attributes.title?.en || Object.values(manga.attributes.title || {})[0] || 'Unknown Title';
    
    // Get description từ backend data  
    const description = typeof manga.attributes.description === 'string'
      ? manga.attributes.description
      : manga.attributes.description?.vi || manga.attributes.description?.en || Object.values(manga.attributes.description || {})[0] || '';

    return {
      title: `${title} - Đọc ngay tại ${Constants.APP_NAME}`,
      description: description,
      openGraph: {
        images: [mdImage],
      },
      twitter: {
        images: [mdImage],
      },
    };
  } catch (error) {
    console.error('Error generating metadata from backend:', error);
  }

  return {
    title: "Đọc ngay tại NetTrom",
    description: "NetTrom - Website Trộm Truyện Văn Minh",
    openGraph: {
      images: [mdImage, ...previousImages],
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="">{children}</div>;
}