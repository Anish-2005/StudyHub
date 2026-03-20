import type { Metadata } from 'next';
import PublicTopicClient from './PublicTopicClient';
import { decodeTopicFromUrl, decodeUsernameFromUrl } from '@/utils/slug';
import { SITE_NAME, SITE_URL } from '@/lib/seo';

interface PublicTopicPageProps {
  params: Promise<{
    username: string;
    topic: string;
  }>;
}

export async function generateMetadata({ params }: PublicTopicPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const username = decodeUsernameFromUrl(resolvedParams.username);
  const topicName = decodeTopicFromUrl(resolvedParams.topic);
  const canonicalPath = `/${resolvedParams.username}/${resolvedParams.topic}`;
  const title = `${topicName} by ${username}`;
  const description = `Public StudyHub topic: ${topicName}. Explore tasks, reminders, and notes shared by ${username}.`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url: `${SITE_URL}${canonicalPath}`,
      type: 'article',
      siteName: SITE_NAME,
    },
    twitter: {
      title: `${title} | ${SITE_NAME}`,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function PublicTopicPage() {
  return <PublicTopicClient />;
}
