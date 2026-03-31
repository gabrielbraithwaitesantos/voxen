/** Utility type to add an 'id' field to a given type T. */
export type WithId<T> = T & { id: string };

/** User profile data stored in Firestore */
export interface UserProfile {
  uid: string;
  voxenId: string;
  joinDate: string; // ISO 8601
  level: string;
  role?: 'disciple' | 'tutor' | 'admin';
  onboarding?: {
    hasSeenWelcome: boolean;
    hasReadGuidelines: boolean;
    hasPostedFirstDailyPractice: boolean;
    completedAt?: string; // ISO 8601
  };
  access?: {
    knowledgeUnlocked: boolean;
    labUnlocked: boolean;
    eliteUnlocked: boolean;
  };
  avatarUrl?: string;
  avatarPath?: string;
  displayName?: string;
}

/** Achievement data */
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string; // e.g., 'zap', 'shield-check'
  color: string; // e.g., 'text-yellow-400'
  unlockedAt?: string; // ISO 8601, optional for locked achievements
}

/** User achievement progress */
export interface UserAchievement {
  userId: string;
  achievementId: string;
  unlockedAt: string; // ISO 8601
}

/** Timeline event */
export interface TimelineEvent {
  id: string;
  title: string;
  date: string; // ISO 8601
  imageUrl?: string;
  imagePath?: string;
  createdAt: string; // ISO 8601
}

/** Gallery image */
export interface GalleryImage {
  id: string;
  description: string;
  imageUrl: string;
  imagePath: string;
  createdAt: string; // ISO 8601
}

/** Message in chat */
export interface Message {
  id: string;
  sender: string;
  text?: string;
  imageUrl?: string;
  imagePath?: string;
  audioUrl?: string;
  audioPath?: string;
  timestamp: any; // Firestore timestamp
  likes: string[];
  status?: 'sending' | 'sent' | 'failed';
}
