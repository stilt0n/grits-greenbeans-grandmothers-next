import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navbar from '@/components/navbar';
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
      <html lang='en'>
        <body className={inter.className}>
          <header>
            <Navbar />
          </header>
          <main className='bg-zinc-100 pt-4'>{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
