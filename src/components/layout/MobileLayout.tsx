import type { ReactNode } from 'react';
import { AfricanPatternFooter } from '../common/AfricanPatternFooter';
import { FideleBottomNav } from '../navigation/FideleBottomNav';

interface MobileLayoutProps {
  children: ReactNode;
  showBottomNav?: boolean;
  showPattern?: boolean;
  header?: ReactNode;
}

export function MobileLayout({
  children,
  showBottomNav = true,
  showPattern = true,
  header,
}: MobileLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 mx-auto max-w-mobile w-full relative">
      {header}
      <main className={showBottomNav ? 'pb-[72px]' : 'pb-8'}>{children}</main>
      {showPattern ? <AfricanPatternFooter /> : null}
      {showBottomNav ? <FideleBottomNav /> : null}
    </div>
  );
}
