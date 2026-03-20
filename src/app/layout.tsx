import type { Metadata, Viewport } from 'next'
import { Nunito_Sans, Sora } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { Toaster } from 'react-hot-toast'
import type { ReactNode } from 'react'
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/seo'

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
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    'study planner',
    'student productivity',
    'task manager for students',
    'study reminders',
    'topic notes',
    'study dashboard',
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: 'education',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: '/logo-studyhub.svg',
        width: 512,
        height: 512,
        alt: 'StudyHub logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: ['/logo-studyhub.svg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: SITE_NAME,
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
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fffaf3' },
    { media: '(prefers-color-scheme: dark)', color: '#1b273f' },
  ],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': ['WebSite', 'SoftwareApplication'],
              name: SITE_NAME,
              url: SITE_URL,
              description: SITE_DESCRIPTION,
              applicationCategory: 'EducationalApplication',
              operatingSystem: 'Web',
            }),
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
