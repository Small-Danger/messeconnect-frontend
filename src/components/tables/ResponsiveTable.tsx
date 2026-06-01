import type { ReactNode } from 'react';
import { useIsMobile } from '../../hooks';
import { MobileCard } from './MobileCard';

export interface TableColumn<T> {
  key: string;
  header: string;
  render: (item: T) => ReactNode;
  mobileTitle?: (item: T) => string;
  mobileSubtitle?: (item: T) => string;
  mobileBadge?: (item: T) => string;
}

interface ResponsiveTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  getRowId: (item: T) => string;
}

export function ResponsiveTable<T>({ data, columns, getRowId }: ResponsiveTableProps<T>) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="space-y-3 md:hidden">
        {data.map((item) => {
          const primary = columns[0];

          return (
            <MobileCard
              key={getRowId(item)}
              title={primary.mobileTitle?.(item) ?? String(primary.render(item))}
              subtitle={primary.mobileSubtitle?.(item)}
              badge={primary.mobileBadge?.(item)}
            />
          );
        })}
      </div>
    );
  }

  return (
    <div className="hidden md:block overflow-x-auto rounded-xl border border-gray-100 bg-white">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-left">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className="px-4 py-3 font-medium text-gray-600">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={getRowId(item)} className="border-t border-gray-100">
              {columns.map((column) => (
                <td key={column.key} className="px-4 py-3">
                  {column.render(item)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
