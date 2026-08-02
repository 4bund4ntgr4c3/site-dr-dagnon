/* "Add to calendar" deep links for one-day agenda events — Google Calendar
   and Outlook. Pure functions over the fields an agenda entry carries, so
   the node test runner can compile and test them without the data files. */

export interface CalendarEvent {
  date: string;
  title: string;
  description: string;
  location: string;
}

const ymd = (date: string) => {
  const [y, m, d] = date.split('-').map(Number);
  return { y, m, d };
};

/* Google Calendar takes an exclusive end date: a one-day event on 2026-08-02
   runs through 2026-08-03. Computed in UTC so no visitor timezone can shift
   the day shown in their calendar. */
const gcalEnd = (date: string) => {
  const { y, m, d } = ymd(date);
  const next = new Date(Date.UTC(y, m - 1, d + 1));
  return `${next.getUTCFullYear()}${String(next.getUTCMonth() + 1).padStart(2, '0')}${String(next.getUTCDate()).padStart(2, '0')}`;
};

export function gcalUrl(e: CalendarEvent): string {
  const q = new URLSearchParams({
    action: 'TEMPLATE',
    text: e.title,
    dates: `${e.date.replace(/-/g, '')}/${gcalEnd(e.date)}`,
    details: e.description,
    location: e.location,
  });
  return `https://calendar.google.com/calendar/render?${q.toString()}`;
}

/* Whole days between two ISO dates, computed in UTC so no visitor timezone
   can shift the count — "in 12 days" must mean the same on every device. */
export function daysUntil(date: string, from = new Date()): number {
  const [y, m, d] = date.split('-').map(Number);
  const target = Date.UTC(y, m - 1, d);
  const today = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate());
  return Math.round((target - today) / 86_400_000);
}

/* Outlook treats an all-day event's end date as inclusive. */
export function outlookUrl(e: CalendarEvent): string {
  const q = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject: e.title,
    startdt: e.date,
    enddt: e.date,
    body: e.description,
    location: e.location,
  });
  return `https://outlook.live.com/calendar/0/action/compose?${q.toString()}`;
}
