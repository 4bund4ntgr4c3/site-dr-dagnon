/* "Add to calendar" deep links for one-day events.
 * Compiled to node_modules/.tmp/calendar-links by scripts/run-tests.mjs. */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const { gcalUrl, outlookUrl } = await import(
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
