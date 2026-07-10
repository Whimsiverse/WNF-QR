import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Whimsiverse QR',
  description: 'Dynamic QR codes for Whimsiverse collectible cards.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fredoka+One&family=Fredoka:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
