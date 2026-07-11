import '@/app/globals.css'
import Navbar from '@/components/common/Navbar'
import Footer from '@/components/common/Footer'
import ClickyAnalytics from '@/components/analytics/ClickyAnalytics'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Toaster } from 'sonner'
import ExitIntentPopup from '@/components/common/ExitIntentPopup'

import type { Metadata } from 'next'
import { Inter, Titillium_Web } from 'next/font/google'

// Inter stays as the heading font; Titillium Web is the body font.
const inter = Inter({ subsets: ['latin'], variable: '--font-heading', display: 'swap' })
const titillium = Titillium_Web({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://kerja-ai.com'),
  title: 'Kerja-AI | AI & Data Careers in Malaysia & Singapore',
  description:
    'The job board for AI, machine learning and data careers in Malaysia and Singapore. Real roles, salary context in RM and SGD, and zero general-board noise.',
  openGraph: {
    siteName: 'Kerja-AI',
    type: 'website',
    images: [{ url: '/default-og-image-1200x630.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/default-og-image-1200x630.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${titillium.variable}`} suppressHydrationWarning>
      <body className="bg-background text-foreground font-sans antialiased">
        <Navbar />
        <main className="min-h-[80vh]">{children}</main>
        <Footer />
        <ClickyAnalytics />
        <SpeedInsights />
        <Toaster position="top-center" richColors />
        <ExitIntentPopup />
      </body>
    </html>
  )
}
