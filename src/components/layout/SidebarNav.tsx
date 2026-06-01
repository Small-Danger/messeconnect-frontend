import { NavLink } from 'react-router-dom';
import type { NavItem } from '../../types/routes';

interface SidebarNavProps {
  items: NavItem[];
  accentClass?: string;
}

export function SidebarNav({ items, accentClass = 'bg-teal-mid' }: SidebarNavProps) {
  return (
    <nav className="flex flex-col gap-1 p-4 pt-20" aria-label="Navigation latérale">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            [
              'min-h-touch flex items-center rounded-xl px-4 text-sm text-white/90 active:scale-[0.98] transition-transform',
              isActive ? `${accentClass} font-medium text-white` : 'hover:bg-white/10',
            ].join(' ')
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
