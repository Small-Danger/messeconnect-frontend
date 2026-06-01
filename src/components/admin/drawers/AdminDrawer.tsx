import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import type { ReactNode } from 'react';

interface AdminDrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  wide?: boolean;
}

export function AdminDrawer({ open, onClose, title, children, wide }: AdminDrawerProps) {
  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <motion.button
            type="button"
            aria-label="Fermer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className={[
              'relative bg-white h-full shadow-2xl flex flex-col',
              wide ? 'w-full max-w-2xl' : 'w-full max-w-lg',
            ].join(' ')}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-purple-dark text-white shrink-0">
              <h2 className="font-semibold text-lg">{title}</h2>
              <button
                type="button"
                onClick={onClose}
                className="min-h-touch min-w-touch flex items-center justify-center rounded-lg hover:bg-white/10 active:scale-95"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">{children}</div>
          </motion.aside>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
