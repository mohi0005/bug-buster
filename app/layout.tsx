import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CivicAI — Citizen Grievance Intelligence System',
  description: 'AI-powered classification, prioritization and routing of public infrastructure complaints.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}
