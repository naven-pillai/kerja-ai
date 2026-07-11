import '@/app/globals.css'
import Navbar from '@/components/common/Navbar'
import Footer from '@/components/common/Footer'
import ClickyAnalytics from '@/components/analytics/ClickyAnalytics'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Toaster } from 'sonner'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import ExitIntentPopup from '@/components/common/ExitIntentPopup'

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })

export const metadata: Metadata = {
  title: 'Kerja-AI.com | Trusted Remote & Hybrid Job Platform for APAC',
  description:
    'Find real and legit Remote and Hybrid job opportunities in APAC. Curated and verified by the Kerja-AI.com team.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
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
