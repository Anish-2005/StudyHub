import type { Metadata, Viewport } from 'next'
import { Manrope, Space_Grotesk } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { Toaster } from 'react-hot-toast'

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'StudyHub',
  description: 'Structured study workspace for tasks, reminders, and topic planning.',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'StudyHub',
  },
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#070b14',
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${manrope.variable} ${spaceGrotesk.variable}`}>
      <body className="bg-vscode-bg text-vscode-text antialiased">
        <AuthProvider>
          {children}
          <Toaster
            position="bottom-right"
            containerClassName="!bottom-4 !right-4"
            toastOptions={{
              duration: 3500,
              style: {
                background: '#0f172a',
                color: '#e2e8f0',
                border: '1px solid rgba(148, 163, 184, 0.35)',
                borderRadius: '10px',
                fontSize: '13px',
                maxWidth: '92vw',
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  )
}
