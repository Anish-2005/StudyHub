import type { Metadata } from 'next';
import PublicTopicClient from './PublicTopicClient';
import { decodeTopicFromUrl, decodeUsernameFromUrl } from '@/utils/slug';
import { SITE_NAME, SITE_URL } from '@/lib/seo';

interface PublicTopicPageProps {
  params: {
    username: string;
    topic: string;
  };
}

export function generateMetadata({ params }: PublicTopicPageProps): Metadata {
  const username = decodeUsernameFromUrl(params.username);
  const topicName = decodeTopicFromUrl(params.topic);
  const canonicalPath = `/${params.username}/${params.topic}`;
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
