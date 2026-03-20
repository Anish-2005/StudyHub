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

export type ShareTab = 'overview' | 'tasks' | 'reminders' | 'notes';

/**
 * Get a smart topic link that opens a specific tab.
 */
export function getTopicShareUrl(username: string, topicName: string, tab: ShareTab = 'overview'): string {
  const topicUrl = getTopicPublicUrl(username, topicName);
  return `${topicUrl}?tab=${encodeURIComponent(tab)}`;
}

/**
 * Get a smart task link that opens the topic in the tasks tab and targets a task.
 */
export function getTaskShareUrl(username: string, topicName: string, taskId: string): string {
  const topicUrl = getTopicPublicUrl(username, topicName);
  const encodedTaskId = encodeURIComponent(taskId);
  return `${topicUrl}?tab=tasks&task=${encodedTaskId}`;
}
