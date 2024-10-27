import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navbar from '@/components/navbar';
import { cn } from '@/lib/utils';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Grits Greenbeans and Grandmothers',
  description: 'A site for family recipes',
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
          <main className='bg-zinc-100 pt-4 flex-grow overflow-y-auto'>
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
