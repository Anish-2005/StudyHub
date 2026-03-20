import type { Metadata, Viewport } from 'next'
import { Nunito_Sans, Sora } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { Toaster } from 'react-hot-toast'
import type { ReactNode } from 'react'

const nunito = Nunito_Sans({
  subsets: ['latin'],
  variable: '--font-nunito',
  display: 'swap',
})

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'StudyHub',
  description: 'A polished study workspace for topics, tasks, reminders, and notes.',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'StudyHub',
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/icon.svg',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#fffaf3',
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en" className={`${nunito.variable} ${sora.variable}`}>
      <body className="bg-vscode-bg text-vscode-text antialiased">
        <AuthProvider>
          {children}
          <Toaster
            position="bottom-right"
            containerClassName="!bottom-4 !right-4"
            toastOptions={{
              duration: 3200,
              style: {
                background: '#fffdf8',
                color: '#2f2a24',
                border: '1px solid #ded3c6',
                borderRadius: '12px',
                fontSize: '13px',
                maxWidth: '92vw',
                boxShadow: '0 10px 24px rgba(84,58,28,0.14)',
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  )
}
