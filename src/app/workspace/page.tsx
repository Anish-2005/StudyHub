import type { Metadata } from 'next';
import HomeClient from '@/components/home/HomeClient';

export const metadata: Metadata = {
  title: 'Workspace',
  description: 'Your private StudyHub workspace for topics, tasks, reminders, and notes.',
  alternates: {
    canonical: '/workspace',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function WorkspacePage() {
  return <HomeClient />;
}
