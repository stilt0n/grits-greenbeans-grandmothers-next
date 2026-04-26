import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navbar from '@/components/navbar';
import { SITE_URL } from '@/lib/constants';
import { cn } from '@/lib/utils';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

const SITE_NAME = 'Grits Greenbeans and Grandmothers';
const SITE_DESCRIPTION =
  'Heritage Southern recipes passed down through generations of our family — from a 1994 family cookbook to your kitchen today.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang='en' className='h-full'>
        <body className={cn('h-full flex flex-col', inter.className)}>
          <header className='h-18 flex-shrink-0'>
            <Navbar />
          </header>
          {/* FIXME: Main here should not be focusable but seems to sometimes be. The tabIndex is kind of a lazy fix. */}
          <main
            className='bg-zinc-100 pt-4 flex-grow overflow-y-auto'
            tabIndex={-1}
          >
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
