export type LanguageLevel = 'native' | 'fluent' | 'intermediate' | 'basic';

// ================== LLM Provider Types ==================

export type LLMProvider = 'openai' | 'anthropic' | 'gemini';

export const PROVIDER_MODELS: Record<LLMProvider, { value: string; label: string }[]> = {
  openai: [
    { value: 'gpt-4o', label: 'GPT-4o' },
    { value: 'gpt-4o-mini', label: 'GPT-4o Mini' },
    { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
  ],
  anthropic: [
    { value: 'claude-sonnet-4-5-20250929', label: 'Claude Sonnet 4.5' },
    { value: 'claude-haiku-4-5-20251001', label: 'Claude Haiku 4.5' },
    { value: 'claude-opus-4-6', label: 'Claude Opus 4.6' },
  ],
  gemini: [
    { value: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash' },
    { value: 'gemini-2.0-flash-lite', label: 'Gemini 2.0 Flash Lite' },
    { value: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro' },
  ],
};

export const PROVIDER_LABELS: Record<LLMProvider, string> = {
  openai: 'OpenAI',
  anthropic: 'Anthropic (Claude)',
  gemini: 'Google Gemini',
};

export interface PersonaObservation {
  text: string;
  timestamp: number;
}

// ================== User Settings ==================

export interface UserSettings {
  llmProvider: LLMProvider;
  apiKey: string;
  model: string;
  persona: string;
  enableEmojis: boolean;
  languageLevel: LanguageLevel;
  enableImageAnalysis: boolean;
  serviceDescription: string;
}

export const LANGUAGE_LEVEL_OPTIONS: { value: LanguageLevel; label: string; description: string }[] = [
  {
    value: 'native',
    label: 'Native / Bilingual',
    description: 'Complex vocabulary, idioms, sophisticated expressions',
  },
  {
    value: 'fluent',
    label: 'Fluent / Advanced',
    description: 'Rich vocabulary, natural flow, occasional advanced terms',
  },
  {
    value: 'intermediate',
    label: 'Intermediate',
    description: 'Clear and correct, simpler vocabulary, straightforward sentences',
  },
  {
    value: 'basic',
    label: 'Basic / Learning',
    description: 'Simple words, short sentences, easy to understand',
  },
];

// ================== Post & Comment Types ==================

export interface PostData {
  authorName: string;
  authorHeadline: string;
  postContent: string;
  imageUrl?: string;
}

export interface CommentData {
  authorName: string;
  authorHeadline: string;
  content: string;
  isReply?: boolean;
}

export interface ThreadContext {
  mode: 'post' | 'reply';
  parentComment?: CommentData;
  existingComments: CommentData[];
  threadParticipants: string[];
}

export interface EnrichedPostData extends PostData {
  threadContext: ThreadContext;
  imageUrl?: string;
}

export type ToneType = 'professional' | 'funny' | 'question' | 'agree-add-value' | 'raw' | 'bold';

export interface GenerateRequest {
  postData: EnrichedPostData;
  tone: ToneType;
  persona?: string;
  enableEmojis: boolean;
  languageLevel: LanguageLevel;
  userThoughts?: string;
  enableImageAnalysis: boolean;
  includeServiceOffer: boolean;
  serviceDescription?: string;
}

export interface RefineRequest {
  comment: string;
  refinementType: 'concise' | 'rephrase';
}

export interface CommentScores {
  engagement: number;
  expertise: number;
  conversion: number;
}

export type RecommendationTag =
  | 'Best for Engagement'
  | 'Most Insightful'
  | 'Best for Sales'
  | 'Safe & Professional'
  | 'Most Creative'
  | 'Thought-Provoking';

export interface ScoredComment {
  text: string;
  scores: CommentScores;
  recommendationTag: RecommendationTag;
  isRecommended?: boolean;
}

export interface GenerateResponse {
  success: boolean;
  comments?: string[];
  scoredComments?: ScoredComment[];
  error?: string;
}

export interface RefineResponse {
  success: boolean;
  comment?: string;
  error?: string;
}

export interface HistoryEntry {
  id: string;
  comment: string;
  postPreview: string;
  timestamp: number;
}

export type MessageRequest =
  | { type: 'GENERATE_COMMENTS'; payload: GenerateRequest }
  | { type: 'GENERATE_MESSAGES'; payload: MessagingRequest }
  | { type: 'REFINE_COMMENT'; payload: RefineRequest }
  | { type: 'CHECK_CONFIG' }
  | { type: 'STREAM_UPDATE_PERSONA'; payload: { originalAiSuggestion: string; finalUserVersion: string } }
  | { type: 'OPEN_OPTIONS' }
  | { type: 'generate-post'; data: { topic: string; tone: ToneType; keyPoints?: string } };

export interface MessageResponse {
  success: boolean;
  comments?: string[];
  scoredComments?: ScoredComment[];
  comment?: string;
  error?: string;
  // Config check
  settings?: UserSettings;
  // Messaging mode
  replies?: ScoredReply[];
  summary?: ConversationSummary;
  // Post generation
  data?: { post?: string; originalPost?: string };
}

export interface CommentFeedback {
  commentId: string;
  isPositive: boolean;
  timestamp: number;
}

// ================== Messaging Types ==================

export interface ChatMessage {
  sender: 'me' | 'other';
  senderName: string;
  content: string;
  timestamp?: string;
}

export interface ConversationContext {
  participantName: string;
  participantHeadline?: string;
  messages: ChatMessage[];
  topic?: string;
  sentiment?: 'positive' | 'neutral' | 'negotiating' | 'cold';
  lastMessageFrom: 'me' | 'other';
}

export type MessagingToneType =
  | 'friendly'
  | 'professional'
  | 'follow-up'
  | 'closing-deal'
  | 'networking';

export const MESSAGING_TONE_OPTIONS: { value: MessagingToneType; label: string; description: string }[] = [
  {
    value: 'friendly',
    label: 'Friendly',
    description: 'Warm and casual, building rapport',
  },
  {
    value: 'professional',
    label: 'Professional',
    description: 'Formal business communication',
  },
  {
    value: 'follow-up',
    label: 'Follow-up',
    description: 'Gentle reminder or check-in',
  },
  {
    value: 'closing-deal',
    label: 'Closing Deal',
    description: 'Moving toward agreement or next steps',
  },
  {
    value: 'networking',
    label: 'Networking',
    description: 'Building professional connections',
  },
];

export interface MessagingRequest {
  conversationContext: ConversationContext;
  tone: MessagingToneType;
  persona: string;
  enableEmojis: boolean;
  languageLevel: LanguageLevel;
  userThoughts?: string;
  includeServiceOffer: boolean;
  serviceDescription?: string;
}

export interface MessagingResponse {
  success: boolean;
  replies?: ScoredReply[];
  error?: string;
  summary?: ConversationSummary;
}

export interface ScoredReply {
  text: string;
  recommendationTag: MessagingRecommendationTag;
}

export type MessagingRecommendationTag =
  | 'Best Follow-up'
  | 'Move Forward'
  | 'Build Rapport'
  | 'Safe Choice'
  | 'Close the Deal';

export interface ConversationSummary {
  topic: string;
  lastMessageSummary: string;
  suggestedAction: string;
}

export const TONE_OPTIONS: { value: ToneType; label: string; description: string }[] = [
  {
    value: 'professional',
    label: 'Professional',
    description: 'Formal and business-oriented tone',
  },
  {
    value: 'funny',
    label: 'Funny',
    description: 'Light-hearted with appropriate humor',
  },
  {
    value: 'question',
    label: 'Question',
    description: 'Engage with thoughtful questions',
  },
  {
    value: 'agree-add-value',
    label: 'Agree & Add Value',
    description: 'Support the post and contribute insights',
  },
];
