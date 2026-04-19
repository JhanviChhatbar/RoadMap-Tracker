import { format, addDays, parseISO, getDay } from "date-fns";

/**
 * Get the ISO date string for today
 */
export function getTodayDate(): string {
  return format(new Date(), "yyyy-MM-dd");
}

/**
 * Get the ISO date string for a specific date
 */
export function getDateString(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

/**
 * Add days to a date and return ISO string
 */
export function addDaysToDate(dateString: string, days: number): string {
  const date = parseISO(dateString);
  const newDate = addDays(date, days);
  return getDateString(newDate);
}

/**
 * Get the week number for a date (ISO week)
 */
export function getWeekNumber(dateString: string): number {
  const date = parseISO(dateString);
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

/**
 * Get day of week (0 = Sunday, 6 = Saturday)
 */
export function getDayOfWeek(dateString: string): number {
  const date = parseISO(dateString);
  return getDay(date);
}

/**
 * Get day name from day of week number
 */
export function getDayName(dayOfWeek: number): string {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return days[dayOfWeek];
}

/**
 * Format date for display
 */
export function formatDateForDisplay(dateString: string): string {
  const date = parseISO(dateString);
  return format(date, "MMM dd, yyyy");
}

/**
 * Check if a date is today
 */
export function isToday(dateString: string): boolean {
  return dateString === getTodayDate();
}

/**
 * Check if a date is in the past
 */
export function isPast(dateString: string): boolean {
  return dateString < getTodayDate();
}

/**
 * Check if a date is in the future
 */
export function isFuture(dateString: string): boolean {
  return dateString > getTodayDate();
}

/**
 * Get date range for a week
 */
export function getWeekDateRange(weekNumber: number, year: number = new Date().getFullYear()) {
  const jan1 = new Date(year, 0, 1);
  const firstMonday = new Date(jan1);
  firstMonday.setDate(jan1.getDate() + ((1 - jan1.getDay() + 7) % 7) || 7);

  const startDate = new Date(firstMonday);
  startDate.setDate(firstMonday.getDate() + (weekNumber - 1) * 7);

  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);

  return {
    start: getDateString(startDate),
    end: getDateString(endDate),
  };
}
