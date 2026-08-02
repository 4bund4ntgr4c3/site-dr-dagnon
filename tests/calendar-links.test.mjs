/* "Add to calendar" deep links for one-day events.
 * Compiled to node_modules/.tmp/calendar-links by scripts/run-tests.mjs. */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const { gcalUrl, outlookUrl, daysUntil } = await import(
  pathToFileURL(path.resolve('node_modules/.tmp/calendar-links/calendar-links.js')).href
);

const talk = {
  date: '2026-08-02',
  title: 'La campagne d’élimination du paludisme au Bénin',
  description: 'Conférence internationale & table ronde.',
  location: 'Cotonou, Bénin',
};

test('gcal links use the exclusive end date (UTC) for a one-day event', () => {
  const out = gcalUrl(talk);
  assert.ok(out.startsWith('https://calendar.google.com/calendar/render?'));
  assert.ok(out.includes('action=TEMPLATE'));
  assert.ok(out.includes('text=La+campagne+d%E2%80%99%C3%A9limination+du+paludisme+au+B%C3%A9nin'));
  /* URLSearchParams encodes the slash separating start/end dates — Google
     Calendar decodes it, so the link still works */
  assert.ok(out.includes('dates=20260802%2F20260803'));
  assert.ok(out.includes('location=Cotonou%2C+B%C3%A9nin'));
});

test('gcal crosses the year boundary without a timezone shift', () => {
  const out = gcalUrl({ ...talk, date: '2026-12-31' });
  assert.ok(out.includes('dates=20261231%2F20270101'));
});

test('outlook links treat the end date as inclusive', () => {
  const out = outlookUrl(talk);
  assert.ok(out.startsWith('https://outlook.live.com/calendar/0/action/compose?'));
  assert.ok(out.includes('path=%2Fcalendar%2Faction%2Fcompose'));
  assert.ok(out.includes('startdt=2026-08-02'));
  assert.ok(out.includes('enddt=2026-08-02'));
  assert.ok(out.includes('body=Conf%C3%A9rence+internationale+%26+table+ronde.'));
});

test('both links survive a title with an ampersand and a hash', () => {
  const evil = { ...talk, title: 'A&B #1', location: 'Dakar, Sénégal' };
  const g = gcalUrl(evil);
  const o = outlookUrl(evil);
  assert.ok(g.includes('text=A%26B+%231'));
  assert.ok(o.includes('subject=A%26B+%231'));
  assert.ok(!g.includes('#1'));
  assert.ok(!o.includes('#1'));
});

test('a single-character month and day stay zero-padded', () => {
  const out = gcalUrl({ ...talk, date: '2026-03-05' });
  assert.ok(out.includes('dates=20260305%2F20260306'));
  const one = gcalUrl({ ...talk, date: '2026-01-09' });
  assert.ok(one.includes('dates=20260109%2F20260110'));
});

test('daysUntil counts whole UTC days, same-day included as zero', () => {
  assert.equal(daysUntil('2026-08-15', new Date(2026, 7, 3, 23, 59)), 12);
  assert.equal(daysUntil('2026-08-03', new Date('2026-08-03T00:01:00Z')), 0);
  assert.equal(daysUntil('2026-09-01', new Date('2026-08-02T12:00:00Z')), 30);
  assert.equal(daysUntil('2026-12-31', new Date(2026, 11, 31, 23, 59)), 0);
});

test('daysUntil crosses the year boundary correctly', () => {
  assert.equal(daysUntil('2027-01-05', new Date('2026-12-31T00:00:00Z')), 5);
  assert.equal(daysUntil('2026-01-01', new Date('2026-12-31T00:00:00Z')), -364);
});

test('daysUntil is immune to the local timezone', () => {
  /* the count compares date-only values, not instants: 23:59 on the start
     day still counts zero days — an instant-based diff would already be a
     full day away. Local constructor keeps the local date unambiguous. */
  assert.equal(daysUntil('2026-08-10', new Date(2026, 7, 10, 23, 59)), 0);
  assert.equal(daysUntil('2026-08-20', new Date(2026, 7, 10, 23, 59)), 10);
});
