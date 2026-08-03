import { Link } from 'react-router';
import { ChevronRight } from 'lucide-react';

/* The visible counterpart of the BreadcrumbList JSON-LD block: a home → list
   → item trail on deep pages. Rendered inside the dark hero on article pages
   (gold on pine), inside light sections elsewhere — hence the two variants. */

export function Breadcrumbs({
  items,
  dark = false,
}: {
  items: { label: string; to?: string }[];
  dark?: boolean;
}) {
  return (
    <nav
      aria-label="Breadcrumb"
      data-breadcrumb=""
      className={`flex flex-wrap items-center gap-1.5 text-[11.5px] font-semibold ${
        dark ? 'text-pine-100/85' : 'text-pine-900/80'
      }`}
    >
      {items.map((item, i) => {
        const inner = item.to ? (
          <Link
            to={item.to}
            className={`transition-colors ${dark ? 'hover:text-gold-300' : 'hover:text-gold-700'}`}
          >
            {item.label}
          </Link>
        ) : (
          <span aria-current="page">{item.label}</span>
        );
        return (
          <span key={i} className="inline-flex items-center gap-1.5">
            {i > 0 && <ChevronRight size={11} aria-hidden="true" />}
            {inner}
          </span>
        );
      })}
    </nav>
  );
}
