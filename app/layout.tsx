import '@/app/globals.css'
import Navbar from '@/components/common/Navbar'
import Footer from '@/components/common/Footer'
import ClickyAnalytics from '@/components/analytics/ClickyAnalytics'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Toaster } from 'sonner'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
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
  title: 'Kerja-AI | AI & Data Careers in Malaysia & Singapore',
  description:
    'The job board for AI, machine learning and data careers in Malaysia and Singapore. Real roles, salary context in RM and SGD, and zero general-board noise.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${titillium.variable}`} suppressHydrationWarning>
      <head>
        {/* AdSense account meta (fine to keep) */}
        <meta name="google-adsense-account" content="ca-pub-7483313879152211" />
      </head>

      <body className="bg-background text-foreground font-sans antialiased">
        <ThemeProvider>
          <Navbar />
          <main className="min-h-[80vh]">{children}</main>
          <Footer />
          <ClickyAnalytics />
          <SpeedInsights />
          <Toaster position="top-center" richColors />
          <ExitIntentPopup />
        </ThemeProvider>
      </body>
    </html>
  )
}
