/* Unit tests for the newsletter sender's pure logic (scripts/send-newsletter.mjs).
 * The KV/Resend side is exercised via the GitHub Action against the real store;
 * nothing here talks to the network. */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { plan, chunk, buildItems, digestHtml, digestText, subjectLine, frequencyDue } from '../scripts/send-newsletter.mjs';

const pub = (id) => ({ id, kind: 'publication', url: `https://seynudedagnon.com/publications`, title: { fr: `Titre ${id}`, en: `Title ${id}` }, description: { fr: `Description ${id}`, en: `Description ${id}` } });
const trib = (slug) => ({ id: slug, kind: 'tribune', url: `https://seynudedagnon.com/tribunes/${slug}`, title: { fr: `Tribune ${slug}`, en: `Op-ed ${slug}` }, description: { fr: 'Description FR', en: 'Description EN' } });

test('the first run establishes a baseline and sends nothing', () => {
  const items = [pub('a'), trib('b')];
  const { firstRun, send } = plan(items, null);
  assert.equal(firstRun, true);
  assert.deepEqual(send, []);
});

test('only ids absent from the state are sent', () => {
  const items = [pub('a'), pub('b'), trib('c')];
  const { send } = plan(items, { ids: ['pub:a', 'trib:c'] });
  assert.deepEqual(send.map((i) => i.id), ['b']);
});

test('nothing is sent when everything is already known', () => {
  const items = [pub('a'), trib('c')];
  const { send } = plan(items, { ids: ['pub:a', 'trib:c'] });
  assert.deepEqual(send, []);
});

test('frequency windows allow at most one weekly or monthly delivery', () => {
  assert.equal(frequencyDue('weekly', '2026-09-01', '2026-09-03'), false);
  assert.equal(frequencyDue('weekly', '2026-09-01', '2026-09-08'), true);
  assert.equal(frequencyDue('monthly', '2026-09-01', '2026-09-30'), false);
  assert.equal(frequencyDue('monthly', '2026-09-30', '2026-10-01'), true);
});

test('a publication id and a tribune slug cannot collide', () => {
  const items = [pub('x'), trib('x')];
  const { send } = plan(items, { ids: ['pub:x'] });
  assert.deepEqual(send.map((i) => i.id), ['x']);
  assert.equal(send[0].kind, 'tribune');
});

test('buildItems maps the data files onto digest items with namespaced ids', () => {
  const pubs = [{ id: 'p1', title: { fr: 'F', en: 'E' }, description: { fr: 'F', en: 'E' } }];
  const tribunes = [{ slug: 's1', title: { fr: 'F', en: 'E' }, description: { fr: 'F', en: 'E' } }];
  const items = buildItems(pubs, tribunes);
  assert.equal(items.length, 2);
  assert.equal(items[0].kind, 'tribune');
  assert.equal(items[0].url, 'https://seynudedagnon.com/tribunes/s1');
  assert.equal(items[1].kind, 'publication');
  assert.equal(items[1].url, 'https://seynudedagnon.com/publications');
});

test('chunk splits recipients into batches of the requested size', () => {
  const all = Array.from({ length: 121 }, (_, i) => `s${i}@example.test`);
  const batches = chunk(all, 50);
  assert.deepEqual(batches.map((b) => b.length), [50, 50, 21]);
  assert.deepEqual(chunk([], 50), []);
});

test('the digest HTML is escaped and carries both languages and links', () => {
  const html = digestHtml([{ ...pub('x'), title: { fr: '<script>alert(1)</script>', en: 'Safe title' } }]);
  assert.doesNotMatch(html, /<script>/i, 'injected markup must stay inert');
  assert.match(html, /&lt;script&gt;/);
  assert.match(html, /Safe title/);
  assert.match(html, /Lire la suite \/ Read more/);
  assert.match(html, /https:\/\/seynudedagnon.com\/publications/);
  assert.match(html, /Publication/);
});

test('the tribune block links to its own page and is labelled as such', () => {
  const html = digestHtml([trib('from-malaria-control-to-elimination')]);
  assert.match(html, /Tribune \/ Op-ed/);
  assert.match(html, /https:\/\/seynudedagnon.com\/tribunes\/from-malaria-control-to-elimination/);
});

test('the plain-text version lists titles and URLs', () => {
  const text = digestText([pub('a'), trib('b')]);
  assert.match(text, /PUBLICATION: Titre a \/ Title a/);
  assert.match(text, /TRIBUNE: Tribune b \/ Op-ed b/);
  assert.match(text, /https:\/\/seynudedagnon.com\/tribunes\/b/);
});

test('the subject counts the kinds sent', () => {
  assert.equal(subjectLine([pub('a')]), 'Newsletter — 1 new publication');
  assert.equal(subjectLine([pub('a'), pub('b')]), 'Newsletter — 2 new publications');
  assert.equal(subjectLine([trib('a')]), 'Newsletter — 1 new tribune');
  assert.equal(subjectLine([trib('a'), pub('b')]), 'Newsletter — 1 new publication & 1 new tribune');
});

test('a French digest is French-only, including the escape-hatch copy', () => {
  const html = digestHtml([pub('x'), trib('y')], 'fr');
  assert.match(html, /Bonjour,/);
  assert.match(html, /Nouvelles publications et tribunes/);
  assert.match(html, /Tribune/);
  assert.match(html, /Lire la suite/);
  assert.doesNotMatch(html, /Hello,|Read more|Op-ed/, 'no English string may leak into the French digest');
  const text = digestText([pub('x'), trib('y')], 'fr');
  assert.match(text, /PUBLICATION: Titre x/);
  assert.match(text, /TRIBUNE: Tribune y/);
  assert.equal(subjectLine([trib('y')], 'fr'), 'Newsletter — 1 nouvelle tribune');
  assert.equal(subjectLine([pub('x'), pub('x')], 'fr'), 'Newsletter — 2 nouvelles publications');
});

test('an English digest is English-only, including the escape-hatch copy', () => {
  const html = digestHtml([pub('x'), trib('y')], 'en');
  assert.match(html, /Hello,/);
  assert.match(html, /New publications and op-eds/);
  assert.match(html, /Op-ed/);
  assert.match(html, /Read more/);
  assert.doesNotMatch(html, /Bonjour,|Lire la suite|Tribune|nouvelles publications/, 'no French string may leak into the English digest');
  const text = digestText([pub('x'), trib('y')], 'en');
  assert.match(text, /PUBLICATION: Title x/);
  assert.match(text, /OP-ED: Op-ed y/);
  assert.equal(subjectLine([pub('x')], 'en'), 'Newsletter — 1 new publication');
  assert.equal(subjectLine([trib('y'), trib('y')], 'en'), 'Newsletter — 2 new tribunes');
  assert.equal(subjectLine([], 'en'), 'Newsletter — New content');
});

test('the bilingual default stays untouched for legacy subscribers and the owner copy', () => {
  const html = digestHtml([pub('x')]);
  assert.match(html, /Bonjour, \/ Hello,/);
  assert.match(html, /Titre x \/ Title x/);
  const text = digestText([pub('x')]);
  assert.match(text, /PUBLICATION: Titre x \/ Title x/);
  assert.equal(subjectLine([trib('a')]), 'Newsletter — 1 new tribune');
});
