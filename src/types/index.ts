export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
}

export interface Topic {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  folderPath: string;
  isPublic: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  reminderDate?: Date;
  topicId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
}

export interface Reminder {
  id: string;
  title: string;
  description: string;
  date: Date;
  type: 'task' | 'study' | 'review';
  topicId: string;
  taskId?: string;
  userId: string;
  completed: boolean;
  createdAt: Date;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  topicId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
}

export interface StudySession {
  id: string;
  topicId: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  duration?: number; // in minutes
  notes?: string;
  completed: boolean;
}

export interface Suggestion {
  id: string;
  title: string;
  description: string;
  type: 'related_topic' | 'study_plan' | 'resource';
  relatedTopicIds: string[];
  userId: string;
  dismissed: boolean;
  createdAt: Date;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  reminderOffset: number; // minutes before due date
  studyReminders: boolean;
  taskReminders: boolean;
}
