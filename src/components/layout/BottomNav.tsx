import { NavLink } from 'react-router-dom';
import type { NavItem } from '../../types/routes';

interface BottomNavProps {
  items: NavItem[];
}

export function BottomNav({ items }: BottomNavProps) {
  return (
    <>
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            [
              'flex-1 flex flex-col items-center justify-center gap-1 text-xs min-h-touch active:scale-95 transition-transform',
              isActive ? 'text-teal font-medium' : 'text-gray-500',
            ].join(' ')
          }
        >
          <span aria-hidden className="text-lg">
            •
          </span>
          <span className="truncate max-w-[4.5rem]">{item.shortLabel ?? item.label}</span>
        </NavLink>
      ))}
    </>
  );
}
