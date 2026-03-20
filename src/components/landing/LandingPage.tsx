'use client';

import Link from 'next/link';
import StudyHubLogo from '@/components/branding/StudyHubLogo';
import ThemeToggle from '@/components/ui/ThemeToggle';

const featureCards = [
  {
    title: 'Topic-Centered Workspaces',
    description: 'Every subject gets its own focused dashboard with tasks, reminders, and notes aligned in one flow.',
  },
  {
    title: 'Deep Task + Reminder Control',
    description: 'Priorities, due dates, status filters, and smart link sharing designed for serious execution.',
  },
  {
    title: 'Mobile + Desktop Precision',
    description: 'Responsive interactions tuned for touch and keyboard workflows without losing context.',
  },
  {
    title: 'Real-Time Sync',
    description: 'Firebase-backed updates keep your data consistent across sessions and devices.',
  },
];

export default function LandingPage() {
  return (
    <main className="h-screen overflow-hidden" style={{ height: '100dvh' }}>
      <div className="mobile-scroll-container h-full px-4 pb-10 pt-4 md:px-8 md:pb-14 md:pt-6">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 md:gap-12">
          <header className="surface motion-fade-up flex items-center justify-between px-4 py-3 md:px-6">
            <StudyHubLogo size={34} />
            <div className="flex items-center gap-2">
              <ThemeToggle compact />
              <Link href="/workspace" className="btn-primary px-3.5 py-2 text-sm md:px-4">
                Launch Workspace
              </Link>
            </div>
          </header>

          <section className="grid gap-6 md:grid-cols-[1.2fr_0.8fr] md:gap-8">
            <article className="surface motion-scale-in p-6 md:p-8">
              <p className="panel-title">Structured Learning, Professional Execution</p>
              <h1 className="mt-4 max-w-2xl text-3xl font-semibold leading-tight text-secondary-100 md:text-5xl" style={{ fontFamily: 'var(--font-sora)' }}>
                Turn Study Chaos Into a Clear Daily System.
              </h1>
              <p className="mt-4 max-w-xl text-sm text-secondary-400 md:text-base">
                StudyHub gives you a single operational workspace for topics, tasks, reminders, and notes so you can plan once and execute consistently.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/workspace" className="btn-primary">
                  Get Started
                </Link>
                <a href="#features" className="btn-secondary">
                  Explore Features
                </a>
              </div>
            </article>

            <article className="surface motion-fade-up motion-delay-1 p-5 md:p-6">
              <p className="panel-title">At A Glance</p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="surface-soft p-3.5">
                  <p className="text-xs uppercase tracking-wide text-secondary-500">Modules</p>
                  <p className="mt-1 text-2xl font-semibold text-primary-200">4</p>
                </div>
                <div className="surface-soft p-3.5">
                  <p className="text-xs uppercase tracking-wide text-secondary-500">Views</p>
                  <p className="mt-1 text-2xl font-semibold text-accent-200">Adaptive</p>
                </div>
                <div className="surface-soft p-3.5">
                  <p className="text-xs uppercase tracking-wide text-secondary-500">Sync</p>
                  <p className="mt-1 text-2xl font-semibold text-success-200">Realtime</p>
                </div>
                <div className="surface-soft p-3.5">
                  <p className="text-xs uppercase tracking-wide text-secondary-500">Sharing</p>
                  <p className="mt-1 text-2xl font-semibold text-warning-200">Smart Links</p>
                </div>
              </div>
            </article>
          </section>

          <section id="features" className="grid gap-4 md:grid-cols-2">
            {featureCards.map((feature, index) => (
              <article
                key={feature.title}
                className="surface motion-lift motion-fade-up p-5 md:p-6"
                style={{ animationDelay: `${Math.min(index * 70, 280)}ms` }}
              >
                <h2 className="text-lg font-semibold text-secondary-100" style={{ fontFamily: 'var(--font-sora)' }}>
                  {feature.title}
                </h2>
                <p className="mt-2 text-sm text-secondary-400">{feature.description}</p>
              </article>
            ))}
          </section>

          <section className="surface motion-fade-up motion-delay-2 flex flex-col items-start justify-between gap-4 p-6 md:flex-row md:items-center md:p-7">
            <div>
              <h3 className="text-xl font-semibold text-secondary-100" style={{ fontFamily: 'var(--font-sora)' }}>
                Ready to run your study like a professional system?
              </h3>
              <p className="mt-1 text-sm text-secondary-400">Open your workspace and start building a trackable routine.</p>
            </div>
            <Link href="/workspace" className="btn-primary">
              Open StudyHub
            </Link>
          </section>
        </div>
      </div>
    </main>
  );
}
