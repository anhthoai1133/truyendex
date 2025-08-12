import { DateUtils } from "./date";
import { ErrorHandlerUtils } from "./error";
import { MangaDexUtils } from "./mangadex";
import { MangaUtils } from "./manga";
import { NumberUtils } from "./number";
import { UrlUtils } from "./url";

export class Utils {
  static Mangadex = new MangaDexUtils();
  static Manga = new MangaUtils();
  static Date = new DateUtils();
  static Url = new UrlUtils();
  static Number = new NumberUtils();
  static Error = new ErrorHandlerUtils();
}