import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'StudyHub - Your Personal Study Workspace',
  description: 'A VS Code-inspired study management app with topic organization, reminders, and smart suggestions.',
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
  themeColor: '#1e1e1e',
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="StudyHub" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme') || 'light';
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className={`${inter.className} bg-white dark:bg-vscode-bg text-secondary-900 dark:text-vscode-text antialiased`}>
        <ThemeProvider>
          <AuthProvider>
            {children}
            <Toaster 
              position="bottom-right"
              containerClassName="!bottom-safe !right-4"
              toastOptions={{
                style: {
                  background: '#252526',
                  color: '#cccccc',
                  border: '1px solid #3c3c3c',
                  borderRadius: '8px',
                  fontSize: '14px',
                  maxWidth: '90vw',
                },
                success: {
                  iconTheme: {
                    primary: '#4caf50',
                    secondary: '#252526',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#f44336',
                    secondary: '#252526',
                  },
                },
                duration: 4000,
              }}
            />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
