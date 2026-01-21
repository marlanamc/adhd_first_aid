import './globals.css'
import AppShell from './AppShell'
import { Inter, Playfair_Display } from 'next/font/google'

// Optimize fonts using next/font
const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
})

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
  preload: true,
})

export const metadata = {
  title: { default: 'ADHD First Aid Kit', template: '%s | ADHD First Aid Kit' },
  description: 'A comprehensive toolkit for managing ADHD challenges with practical strategies, guides, and resources.',
  keywords: ['ADHD', 'mental health', 'strategies', 'support', 'resources'],
  authors: [{ name: 'ADHD First Aid Kit' }],
  openGraph: {
    title: 'ADHD First Aid Kit',
    description: 'A comprehensive toolkit for managing ADHD challenges',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfairDisplay.variable}`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ec4899" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="light-content" />
        <meta name="apple-mobile-web-app-title" content="ADHD First Aid Kit" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="ADHD First Aid Kit" />
        <meta name="msapplication-TileColor" content="#ec4899" />
        <meta name="msapplication-TileImage" content="/icon-144x144.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover" />
      </head>
      <body className={`${inter.variable} ${playfairDisplay.variable} font-inter m-0 p-0`}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  )
}
