import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { useAuthStore } from './stores/authStore';
import { useParoisseAppStore } from './stores/paroisseAppStore';
import { useParoisseStore } from './stores/paroisseStore';

async function bootstrap() {
  await Promise.all([
    useAuthStore.persist.rehydrate(),
    useParoisseStore.persist.rehydrate(),
    useParoisseAppStore.persist.rehydrate(),
  ]);
  useAuthStore.setState({ hasHydrated: true });

  createRoot(document.getElementById('root')!).render(<App />);
}

void bootstrap();
