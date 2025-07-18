/**
 * Generate a URL-friendly version of topic name for URLs
 */
export function formatTopicForUrl(topicName: string): string {
  return encodeURIComponent(topicName.trim());
}

/**
 * Generate a URL-friendly version of username for URLs
 */
export function formatUsernameForUrl(username: string): string {
  return encodeURIComponent(username.trim());
}

/**
 * Decode topic name from URL
 */
export function decodeTopicFromUrl(urlParam: string): string {
  return decodeURIComponent(urlParam);
}

/**
 * Decode username from URL
 */
export function decodeUsernameFromUrl(urlParam: string): string {
  return decodeURIComponent(urlParam);
}

/**
 * Get the public URL for a topic using topic name
 */
export function getTopicPublicUrl(username: string, topicName: string): string {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const encodedUsername = formatUsernameForUrl(username);
  const encodedTopicName = formatTopicForUrl(topicName);
  return `${baseUrl}/${encodedUsername}/${encodedTopicName}`;
}
