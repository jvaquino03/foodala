'use client';

import { useEffect, useState } from 'react';

// Sticky category tab bar with scroll-spy, mirroring the mobile restaurant page.
export function MenuNav({ categories }: { categories: { id: string; name: string }[] }) {
  const [active, setActive] = useState(categories[0]?.id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: '-120px 0px -65% 0px', threshold: 0 }
    );
    for (const c of categories) {
      const el = document.getElementById(c.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [categories]);

  return (
    <div className="sticky top-16 z-30 -mx-5 border-b border-border bg-background/90 px-5 py-3 backdrop-blur">
      <div className="flex gap-2 overflow-x-auto">
        {categories.map((c) => (
          <a
            key={c.id}
            href={`#${c.id}`}
            className={`whitespace-nowrap rounded-pill px-4 py-2 text-sm font-semibold transition-colors ${
              active === c.id
                ? 'bg-primary text-white'
                : 'border border-border bg-surface text-text-secondary hover:text-white'
            }`}
          >
            {c.name}
          </a>
        ))}
      </div>
    </div>
  );
}
