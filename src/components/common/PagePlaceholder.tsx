import { useMatches } from 'react-router-dom';
import type { PageHandle } from '../../types/routes';

export function PagePlaceholder() {
  const matches = useMatches();
  const handle = matches.at(-1)?.handle as PageHandle | undefined;

  if (!handle) {
    return null;
  }

  return (
    <article className="rounded-2xl border border-gray-100 bg-white p-5 md:p-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-teal mb-2">{handle.space}</p>
      <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">{handle.title}</h2>
      {handle.description ? (
        <p className="text-sm md:text-base text-gray-600 mb-4">{handle.description}</p>
      ) : null}
      {handle.apiHint ? (
        <p className="text-sm text-gray-500 mb-4">
          API : <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs">{handle.apiHint}</code>
        </p>
      ) : null}
      <p className="text-xs md:text-sm text-gray-400 italic">
        Page placeholder — en attente d&apos;implémentation.
      </p>
    </article>
  );
}
