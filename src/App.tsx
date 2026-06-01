import { Suspense } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { AppProviders } from './app/providers';
import { appRoutes } from './app/router';
import { PageSkeleton } from './components/common/PageSkeleton';

const router = createBrowserRouter(appRoutes);

export default function App() {
  return (
    <AppProviders>
      <Suspense fallback={<PageSkeleton />}>
        <RouterProvider router={router} />
      </Suspense>
    </AppProviders>
  );
}
