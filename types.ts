export enum SlideType {
  POLL = 'POLL',
  WORD_CLOUD = 'WORD_CLOUD',
  QNA = 'QNA'
}

export interface PollOption {
  id: string;
  label: string;
  count: number;
}

export interface WordEntry {
  text: string;
  count: number;
}

export interface Slide {
  id: string;
  type: SlideType;
  question: string;
  options?: PollOption[]; // For Polls
  words?: WordEntry[]; // For Word Cloud
  qnaEntries?: string[]; // For Q&A
}

export interface SessionState {
  code: string;
  isActive: boolean;
  currentSlideIndex: number;
  slides: Slide[];
}

export interface UserResponse {
  slideId: string;
  value: string; // Option ID for poll, text for word cloud
}

// Event types for LocalStorage sync
export const STORAGE_KEY = 'hudong_session_state';
export const EVENT_UPDATE = 'hudong_update';