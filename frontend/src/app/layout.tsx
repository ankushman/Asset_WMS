import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/shared/ThemeProvider';

export const metadata: Metadata = {
  title: 'SANKAJ LOGISTICS LIMITED | Enterprise Warehouse Management System',
  description:
    'Production-ready Enterprise Asset Management Tracker & Warehouse Management System (WMS) built for multi-tenant industrial organizations.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-[#F5F7FA] text-[#111827] dark:bg-slate-950 dark:text-slate-100 selection:bg-orange-600 selection:text-white">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
