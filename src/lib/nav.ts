export function navHref(id: string): string {
  if (id === 'contact') return '/contact';
  if (id === 'medias') return '/media';
  if (id === 'publications') return '/publications';
  return `/#${id}`;
}
