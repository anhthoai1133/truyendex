export class MangaUtils {
  // Utility để phân biệt UUID từ backend vs MangaDex ID
  isBackendUUID(id: string): boolean {
    // UUID format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  }

  // Convert backend series data sang format tương tự MangaDex
  convertBackendSeriesToMangaFormat(backendSeries: any) {
    return {
      id: backendSeries.uuid,
      type: 'manga',
      // Thêm coverImage trực tiếp để getCoverArt() tìm thấy dễ dàng
      coverImage: backendSeries.coverImage,
      attributes: {
        title: backendSeries.title,
        altTitles: [],
        description: backendSeries.description,
        status: backendSeries.status,
        contentRating: backendSeries.contentRating,
        originalLanguage: backendSeries.originalLanguage || 'ja',
        publicationDemographic: backendSeries.publicationDemographic,
        year: backendSeries.year,
        createdAt: backendSeries.createdAt,
        updatedAt: backendSeries.updatedAt,
        tags: [], // Add empty tags array to prevent errors
      },
      relationships: backendSeries.coverImage ? [{
        type: 'cover_art',
        attributes: {
          fileName: backendSeries.coverImage,
          volume: null,
          description: ''
        }
      }] : [],
      statistics: {
        follows: backendSeries.followCount || 0,
        rating: {
          bayesian: backendSeries.rating || 0
        }
      }
    };
  }
}
