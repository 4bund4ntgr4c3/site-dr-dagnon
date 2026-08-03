import { useMemo } from 'react';
import { useSearchParams } from 'react-router';
import { Calendar, MapPin, ArrowUpRight, Presentation, Mic, Users, MessagesSquare, Newspaper, CalendarDays, CalendarPlus } from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { NameHighlight } from '@/components/NameHighlight';
import { useLang } from '@/i18n/useLang';
import { UI } from '@/i18n/translations';
import { localePath } from '@/i18n/routing';
import { track } from '@/lib/analytics';
import { AGENDA_ITEMS, type AgendaEntry, type AgendaType } from '@/data/agenda';
import { daysUntil, gcalUrl, outlookUrl } from '@/lib/calendar-links';
import type { Lang } from '@/i18n/lang';

const TYPE_META: Record<AgendaType, { icon: typeof Calendar; key: string }> = {
  conference: { icon: Presentation, key: 'agendaPage.type.conference' },
  speaking: { icon: Mic, key: 'agendaPage.type.speaking' },
  community: { icon: Users, key: 'agendaPage.type.community' },
  interview: { icon: MessagesSquare, key: 'agendaPage.type.interview' },
  press: { icon: Newspaper, key: 'agendaPage.type.press' },
};

/* iCal lines longer than 75 octets must be folded with a CRLF + space; the
   continuation segment carries the leading space, so it may only hold 73
   more characters (first segment 74) to keep every physical line at or
   under the 75-octet limit. */
const icsEscape = (s: string) =>
  s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
const fold = (line: string): string => {
  if (line.length <= 74) return line;
  const chunks: string[] = [line.slice(0, 74)];
  let rest = line.slice(74);
  while (rest.length > 73) {
    chunks.push(rest.slice(0, 73));
    rest = rest.slice(73);
  }
  chunks.push(rest);
  return chunks.join('\r\n ');
};

const buildIcs = (lang: Lang): string => {  const now = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//seynudedagnon.com//Agenda//FR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    ...AGENDA_ITEMS.flatMap((e) => [
      'BEGIN:VEVENT',
      `UID:${e.id}@seynudedagnon.com`,
      `DTSTAMP:${now}`,
      `DTSTART;VALUE=DATE:${e.date.replace(/-/g, '')}`,
      `SUMMARY:${icsEscape(e.title[lang])}`,
      `DESCRIPTION:${icsEscape(e.description[lang])}`,
      `LOCATION:${icsEscape(e.location[lang])}`,
      ...(e.link ? [`URL:${e.link}`] : []),
      'END:VEVENT',
    ]),
    'END:VCALENDAR',
  ];
  return lines.map(fold).join('\r\n') + '\r\n';
};

/* The ISO date is split, not parsed with new Date(), so the rendered day,
   month and year are exactly the ones in the data file regardless of the
   visitor's timezone (server-render at build time, client later). */
const parts = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  return { y, m, d };
};

export default function Agenda() {
  const { lang } = useLang();
  const t = UI[lang];
  const [searchParams, setSearchParams] = useSearchParams();
  const year = searchParams.get('y') ?? 'all';

  const years = useMemo(
    () => Array.from(new Set(AGENDA_ITEMS.map((e) => String(parts(e.date).y)))).sort((a, b) => b.localeCompare(a)),
    [],
  );

  const setYear = (value: string) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value === 'all') next.delete('y');
        else next.set('y', value);
        return next;
      },
      { replace: true },
    );
  };

  const { upcoming, past } = useMemo(() => {
    /* compare the ISO strings lexically — parsing dates would drag timezones
       into the cutoff and mislabel an event dated today */
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const matchesYear = (e: AgendaEntry) => year === 'all' || String(parts(e.date).y) === year;
    const sorted = [...AGENDA_ITEMS].sort((a, b) => b.date.localeCompare(a.date));
    return {
      upcoming: sorted.filter((e) => e.date > todayStr && matchesYear(e)),
      past: sorted.filter((e) => e.date <= todayStr && matchesYear(e)),
    };
  }, [year]);

  const fmtMonth = (e: AgendaEntry) => {
    const { y, m } = parts(e.date);
    return new Intl.DateTimeFormat(lang === 'fr' ? 'fr-FR' : 'en-US', { month: 'short' }).format(
      new Date(y, m - 1, 1),
    );
  };

  const fmtYear = (e: AgendaEntry) => String(parts(e.date).y);

  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen">
      {/* header — hero background */}
      <section className="relative overflow-hidden bg-pine-950">
        <div className="absolute inset-0 texture-net" />
        <div className="absolute -top-40 -right-40 h-[560px] w-[560px] rounded-full bg-pine-600/25 blur-[130px]" />
        <div className="absolute bottom-0 -left-40 h-[460px] w-[460px] rounded-full bg-gold-600/12 blur-[120px]" />

        <div className="relative mx-auto max-w-6xl px-5 pb-24 pt-32 lg:px-8 lg:pt-36">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-gold-500/40 bg-gold-500/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-300">
              <Calendar size={13} />
              {t['agendaPage.badge']}
            </span>
            <h1 className="mt-7 font-display text-[2.6rem] leading-[1.05] font-medium text-pine-100 sm:text-6xl lg:text-[4.4rem]">
              {t['agendaPage.badge']} — <NameHighlight />
            </h1>
            <p className="mt-4 font-display text-lg italic text-pine-200/90 sm:text-xl">
              {t['agendaPage.intro']}
            </p>
          </Reveal>
        </div>
      </section>

      {/* content — light */}
      <section className="bg-pine-50 py-16 lg:py-20">
        <div className="relative mx-auto max-w-6xl px-5 lg:px-8">
          {/* year filter — same pill pattern as the publications page, bound
              to the ?y= query parameter so a filtered view is shareable */}
          <div className="flex flex-nowrap items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <p className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.18em] text-pine-900/75">
              {t['agendaPage.filterYear']}
            </p>
            <div role="group" aria-label={t['agendaPage.filterYear']} className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => setYear('all')}
                aria-pressed={year === 'all'}
                className={`whitespace-nowrap rounded-full px-4 py-1.5 text-[12.5px] font-semibold transition-all ${
                  year === 'all'
                    ? 'bg-pine-950 text-gold-400 shadow'
                    : 'bg-pine-900/5 text-ink/75 ring-1 ring-pine-900/10 hover:text-pine-900 hover:ring-gold-500/50'
                }`}
              >
                {t['agendaPage.all']}
              </button>
              {years.map((y) => (
                <button
                  key={y}
                  type="button"
                  onClick={() => setYear(y)}
                  aria-pressed={year === y}
                  className={`whitespace-nowrap rounded-full px-4 py-1.5 text-[12.5px] font-semibold transition-all ${
                    year === y
                      ? 'bg-pine-950 text-gold-400 shadow'
                      : 'bg-pine-900/5 text-ink/75 ring-1 ring-pine-900/10 hover:text-pine-900 hover:ring-gold-500/50'
                  }`}
                >
                  {y}
                </button>
              ))}
            </div>
          </div>

          {/* upcoming */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="inline-flex items-center gap-2.5 font-display text-2xl font-semibold text-pine-900">
                <CalendarDays size={22} className="text-gold-500" />
                {t['agendaPage.upcoming']}
              </h2>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    track('ical_export', { event_category: 'engagement', event_label: 'client-side' });
                    const blob = new Blob([buildIcs(lang)], { type: 'text/calendar;charset=utf-8' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'agenda-dagnon.ics';
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  title={t['agendaPage.exportIcsTitle']}
                  className="inline-flex items-center gap-2 rounded-full border border-gold-500/40 bg-gold-500/10 px-4 py-2 text-[12.5px] font-semibold text-gold-700 transition-all hover:-translate-y-0.5 hover:bg-gold-500 hover:text-pine-950"
                >
                  <CalendarPlus size={14} />
                  {t['agendaPage.exportIcs']}
                </button>
                {/* static /agenda.ics, generated by scripts/prerender.mjs and
                    precached by the service worker — one URL to subscribe to */}
                <a
                  href="/agenda.ics"
                  download
                  onClick={() => track('ical_subscribe', { event_category: 'engagement', event_label: '/agenda.ics' })}
                  title={t['agendaPage.subscribeIcsTitle']}
                  className="inline-flex items-center gap-2 rounded-full border border-pine-900/15 bg-white px-4 py-2 text-[12.5px] font-semibold text-pine-900 transition-all hover:-translate-y-0.5 hover:border-gold-500/50 hover:text-gold-700"
                >
                  <Calendar size={14} />
                  {t['agendaPage.subscribeIcs']}
                </a>
              </div>
            </div>

            {upcoming.length > 0 ? (
              <div className="mt-6 grid gap-5 lg:grid-cols-2">
                {upcoming.map((e, i) => (
                  <Reveal key={e.id} delay={Math.min(i * 0.05, 0.3)}>
                    <EventCard e={e} lang={lang} t={t} fmtMonth={fmtMonth} fmtYear={fmtYear} upcoming />
                  </Reveal>
                ))}
              </div>
            ) : (
              <Reveal>
                <div className="mt-6 flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-pine-900/15 bg-white px-6 py-14 text-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-pine-950 text-gold-400">
                    <Calendar size={24} />
                  </span>
                  <p className="max-w-md text-sm leading-relaxed text-pine-900/70">{t['agendaPage.upcomingEmpty']}</p>
                  <a
                    href={localePath(lang, '/contact')}
                    className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-6 py-3 text-sm font-semibold text-pine-950 transition-all hover:-translate-y-0.5 hover:bg-gold-400"
                  >
                    {t['agendaPage.cta']}
                    <ArrowUpRight size={15} />
                  </a>
                </div>
              </Reveal>
            )}
          </div>

          {/* past */}
          <div className="mt-16">
            <h2 className="inline-flex items-center gap-2.5 font-display text-2xl font-semibold text-pine-900">
              <Calendar size={22} className="text-gold-500" />
              {t['agendaPage.past']}
            </h2>

            {past.length > 0 ? (
              <div className="mt-6 space-y-4">
                {past.map((e, i) => (
                  <Reveal key={e.id} delay={Math.min(i * 0.03, 0.3)}>
                    <EventCard e={e} lang={lang} t={t} fmtMonth={fmtMonth} fmtYear={fmtYear} />
                  </Reveal>
                ))}
              </div>
            ) : (
              <Reveal>
                <p className="mt-6 rounded-2xl border border-dashed border-pine-900/15 bg-white px-6 py-14 text-center text-sm text-pine-900/75">
                  {t['agendaPage.pastEmpty']}
                </p>
              </Reveal>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function EventCard({
  e,
  lang,
  t,
  fmtMonth,
  fmtYear,
  upcoming = false,
}: {
  e: AgendaEntry;
  lang: 'fr' | 'en';
  t: typeof UI['fr'];
  fmtMonth: (e: AgendaEntry) => string;
  fmtYear: (e: AgendaEntry) => string;
  upcoming?: boolean;
}) {
  const meta = TYPE_META[e.type];
  const TypeIcon = meta.icon;
  const { d } = parts(e.date);

  return (
    <article
      className={`group relative flex gap-5 rounded-2xl border bg-white p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-gold-500/40 sm:p-6 ${
        upcoming ? 'border-gold-500/50' : 'border-pine-900/10'
      }`}
    >
      {/* date block — day, month and year each on their own line */}
      <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-pine-950 text-center">
        <span className="font-display text-[1.4rem] leading-none font-semibold text-gold-400">{d}</span>
        <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-pine-100/70">
          {fmtMonth(e)}
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-pine-100/70">
          {fmtYear(e)}
        </span>
      </div>

      {upcoming && (
        <span className="absolute right-4 top-4 inline-flex items-center rounded-full bg-gold-500 px-2.5 py-1 text-[10.5px] font-bold text-pine-950">
          {(() => {
            const n = daysUntil(e.date);
            if (n <= 0) return t['agendaPage.today'];
            if (n === 1) return t['agendaPage.tomorrow'];
            return t['agendaPage.inDays'].replace('{n}', String(n));
          })()}
        </span>
      )}

      <div className={`min-w-0 flex-1 ${upcoming ? 'pr-16' : ''}`}>
        <div className="flex flex-wrap items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold ${upcoming ? 'bg-gold-500 text-pine-950' : 'bg-pine-950 text-gold-400'}`}>
            <TypeIcon size={12} />
            {t[meta.key]}
          </span>
          <span className="inline-flex items-center gap-1 text-[11.5px] text-pine-900/70">
            <MapPin size={12} />
            {e.location[lang]}
          </span>
        </div>
        <h3 className="mt-2 font-display text-[1.15rem] font-semibold leading-snug text-pine-900">
          {e.title[lang]}
        </h3>
        <p className="mt-1.5 text-[12.5px] leading-relaxed text-pine-900/70 line-clamp-3">{e.description[lang]}</p>
        {e.link && (
          <a
            href={e.link}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-semibold text-gold-700 transition-colors group-hover:text-gold-500"
          >
            {t['agendaPage.details']}
            <ArrowUpRight size={13} />
          </a>
        )}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <a
            href={gcalUrl({ date: e.date, title: e.title[lang], description: e.description[lang], location: e.location[lang] })}
            target="_blank"
            rel="noreferrer"
            title={t['agendaPage.addGcal']}
            className="inline-flex items-center gap-1.5 rounded-full border border-pine-900/15 px-3 py-1.5 text-[11.5px] font-semibold text-pine-900/75 transition-all hover:border-gold-500/50 hover:text-gold-700"
          >
            <CalendarPlus size={12} />
            {t['agendaPage.addGcal']}
          </a>
          <a
            href={outlookUrl({ date: e.date, title: e.title[lang], description: e.description[lang], location: e.location[lang] })}
            target="_blank"
            rel="noreferrer"
            title={t['agendaPage.addOutlook']}
            className="inline-flex items-center gap-1.5 rounded-full border border-pine-900/15 px-3 py-1.5 text-[11.5px] font-semibold text-pine-900/75 transition-all hover:border-gold-500/50 hover:text-gold-700"
          >
            <CalendarDays size={12} />
            {t['agendaPage.addOutlook']}
          </a>
        </div>
      </div>
    </article>
  );
}
