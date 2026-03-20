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
    <html lang="en" data-theme="warm" className={`${nunito.variable} ${sora.variable}`} suppressHydrationWarning>
      <body className="bg-vscode-bg text-vscode-text antialiased">
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('studyhub-theme');document.documentElement.setAttribute('data-theme',t==='midnight'?'midnight':'warm')}catch(_){document.documentElement.setAttribute('data-theme','warm')}})();`,
          }}
        />
        <AuthProvider>
          {children}
          <Toaster
            position="bottom-right"
            containerClassName="!bottom-4 !right-4"
            toastOptions={{
              duration: 3200,
              style: {
                background: 'rgb(var(--toast-bg) / 0.96)',
                color: 'rgb(var(--toast-text))',
                border: '1px solid rgb(var(--toast-border) / 0.82)',
                borderRadius: '12px',
                fontSize: '13px',
                maxWidth: '92vw',
                boxShadow: '0 10px 24px rgb(var(--toast-shadow) / 0.28)',
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  )
}
