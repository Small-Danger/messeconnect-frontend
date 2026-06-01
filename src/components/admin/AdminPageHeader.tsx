interface AdminPageHeaderProps {
  title: string;
  description?: string;
  badge?: string;
}

export function AdminPageHeader({ title, description, badge }: AdminPageHeaderProps) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
        {description ? <p className="text-sm text-gray-500 mt-0.5 max-w-2xl">{description}</p> : null}
      </div>
      {badge ? (
        <span className="self-start rounded-full bg-purple-light px-3 py-1 text-xs font-medium text-purple-dark">
          {badge}
        </span>
      ) : null}
    </div>
  );
}
