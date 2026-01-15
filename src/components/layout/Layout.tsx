import { ReactNode } from 'react';
import { Header } from './Header';
import { ArtisticNav } from './ArtisticNav';
import { Footer } from './Footer';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Desktop: ArtisticNav, Mobile: Header */}
      <div className="hidden lg:block">
        <ArtisticNav />
      </div>
      <div className="lg:hidden">
        <Header />
      </div>
      <main className="flex-1 pt-20">
        {children}
      </main>
      <Footer />
    </div>
  );
}
