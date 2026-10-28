import { BookOpenIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Footer } from './Footer';
import { ThemeToggle } from './ThemeToggle';

export function Layout({ children, back }: { children: ReactNode; back?: boolean }) {
  return (
    <div className="page">
      <header className="topbar">
        {back ? (
          <Link to="/" className="icon-btn" aria-label="回首頁">
            <ChevronLeftIcon className="icon" aria-hidden />
          </Link>
        ) : (
          <span className="brand">
            <BookOpenIcon className="icon" aria-hidden />
            IELTS 單字
          </span>
        )}
        <ThemeToggle />
      </header>
      <main className="content">{children}</main>
      <Footer />
    </div>
  );
}
