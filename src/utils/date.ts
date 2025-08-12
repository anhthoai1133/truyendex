import { format, formatDistance as dateFnsFormatDistance } from "date-fns";
import vi from "date-fns/locale/vi";

export class DateUtils {
  formatNowDistance(
    date: Date | number | string,
    options?: {
      addSuffix?: boolean;
      unit?: "second" | "minute" | "hour" | "day" | "month" | "year";
      roundingMethod?: "floor" | "ceil" | "round";
      locale?: Locale;
    },
  ): string {
    // Safely parse date if it's a string
    const parsedDate = typeof date === 'string' ? new Date(date) : date;
    
    // Check if date is valid
    if (parsedDate instanceof Date && isNaN(parsedDate.getTime())) {
      return 'Không xác định';
    }
    
    return dateFnsFormatDistance(parsedDate, new Date(), { locale: vi, ...options });
  }

  formatDateTime(date: Date | number, options?: { locale?: Locale }) {
    return format(date, "dd/MM/yyyy HH:mm", options);
  }
}
