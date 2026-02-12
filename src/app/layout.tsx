import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'TradeMojo - Find Trusted Tradies in Australia',
    template: '%s | TradeMojo',
  },
  description:
    "Australia's smartest trade directory. Search thousands of verified tradies with Mojo, your AI-powered assistant. Get instant quotes from plumbers, electricians, builders and more.",
  keywords: [
    'tradies',
    'tradespeople',
    'australia',
    'plumber',
    'electrician',
    'builder',
    'find a tradie',
    'trade directory',
    'home services',
    'local tradies',
  ],
  metadataBase: new URL('https://trademojo.com.au'),
  openGraph: {
    title: 'TradeMojo - Find Trusted Tradies in Australia',
    description:
      "Australia's smartest trade directory. AI-powered search to find the right tradie for your job.",
    url: 'https://trademojo.com.au',
    siteName: 'TradeMojo',
    locale: 'en_AU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TradeMojo - Find Trusted Tradies in Australia',
    description:
      "Australia's smartest trade directory. AI-powered search to find the right tradie for your job.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${outfit.variable} antialiased bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
