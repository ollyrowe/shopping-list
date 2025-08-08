import type { DayOfWeek } from '@/types';

export class DateUtils {
  /**
   * Returns all of the days and their associated dates which make up the current week.
   *
   * @param offset - used to select previous or future weeks
   */
  public static getDaysInWeek(offset = 0): { day: DayOfWeek; date: Date }[] {
    const today = new Date();

    today.setDate(today.getDate() + offset * 7);

    // Sunday is 0 for whatever reason
    const currentDayOfWeekIndex = today.getDay() === 0 ? 6 : today.getDay() - 1;

    const monday = new Date(today);

    monday.setDate(today.getDate() - currentDayOfWeekIndex);

    const days: DayOfWeek[] = [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ];

    return days.map((day, i) => {
      const date = new Date(monday);

      date.setDate(monday.getDate() + i);

      return { day, date };
    });
  }

  /**
   * Returns a human-readable alias for the current week.
   *
   * @param offset - used to select previous or future weeks
   */
  public static getWeekAlias(offset = 0) {
    if (offset === 0) {
      return 'this week';
    }

    if (offset === 1) {
      return 'next week';
    }

    if (offset === -1) {
      return 'last week';
    }

    const days = DateUtils.getDaysInWeek(offset);

    const weekStart = days[0].date;
    const weekEnd = days[days.length - 1].date;

    const weekStartString = DateUtils.getShortDateString(weekStart);
    const weekEndString = DateUtils.getShortDateString(weekEnd);

    return `${weekStartString} - ${weekEndString}`;
  }

  public static getDayOfWeek(date: Date): DayOfWeek | undefined {
    switch (date.getDay()) {
      case 1:
        return 'Monday';
      case 2:
        return 'Tuesday';
      case 3:
        return 'Wednesday';
      case 4:
        return 'Thursday';
      case 5:
        return 'Friday';
      case 6:
        return 'Saturday';
      case 0:
        return 'Sunday';
    }
  }

  public static getIsoDateString(date: Date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getDate()}`;
  }

  public static getShortDateString(date: Date): string {
    return date.toLocaleDateString('default', {
      day: 'numeric',
      month: 'short',
    });
  }
}
