import { UserSettings, HistoryEntry, CommentFeedback, PersonaObservation } from '../types';

const STORAGE_KEYS = {
  LLM_PROVIDER: 'llm_provider',
  API_KEY: 'openai_api_key',
  MODEL: 'llm_model',
  PERSONA: 'user_persona',
  HISTORY: 'comment_history',
  ENABLE_EMOJIS: 'enable_emojis',
  LANGUAGE_LEVEL: 'language_level',
  ENABLE_IMAGE_ANALYSIS: 'enable_image_analysis',
  SERVICE_DESCRIPTION: 'service_description',
  FEEDBACK: 'comment_feedback',
  PERSONA_OBSERVATIONS: 'persona_observations',
} as const;

const MAX_HISTORY_ENTRIES = 10;
const MAX_PERSONA_OBSERVATIONS = 20;

const DEFAULT_SETTINGS: UserSettings = {
  llmProvider: 'openai',
  apiKey: '',
  model: 'gpt-4o',
  persona: '',
  enableEmojis: false,
  languageLevel: 'fluent',
  enableImageAnalysis: false,
  serviceDescription: '',
};

/**
 * Check if the extension context is still valid
 */
function isExtensionContextValid(): boolean {
  try {
    return !!(chrome?.runtime?.id);
  } catch {
    return false;
  }
}

/**
 * Safely execute a chrome storage operation with error handling
 */
async function safeStorageOperation<T>(
  operation: () => Promise<T>,
  fallback: T
): Promise<T> {
  if (!isExtensionContextValid()) {
    console.warn('Extension context invalidated. Please refresh the page.');
    return fallback;
  }

  try {
    return await operation();
  } catch (error) {
    if (error instanceof Error && error.message.includes('Extension context invalidated')) {
      console.warn('Extension context invalidated. Please refresh the page.');
      return fallback;
    }
    throw error;
  }
}

export async function getSettings(): Promise<UserSettings> {
  return safeStorageOperation(
    () => new Promise((resolve) => {
      chrome.storage.local.get([
        STORAGE_KEYS.LLM_PROVIDER,
        STORAGE_KEYS.API_KEY,
        STORAGE_KEYS.MODEL,
        STORAGE_KEYS.PERSONA,
        STORAGE_KEYS.ENABLE_EMOJIS,
        STORAGE_KEYS.LANGUAGE_LEVEL,
        STORAGE_KEYS.ENABLE_IMAGE_ANALYSIS,
        STORAGE_KEYS.SERVICE_DESCRIPTION,
      ], (result) => {
        if (chrome.runtime.lastError) {
          console.warn('Storage error:', chrome.runtime.lastError);
          resolve(DEFAULT_SETTINGS);
          return;
        }
        resolve({
          llmProvider: result[STORAGE_KEYS.LLM_PROVIDER] || 'openai',
          apiKey: result[STORAGE_KEYS.API_KEY] || '',
          model: result[STORAGE_KEYS.MODEL] || 'gpt-4o',
          persona: result[STORAGE_KEYS.PERSONA] || '',
          enableEmojis: result[STORAGE_KEYS.ENABLE_EMOJIS] ?? false,
          languageLevel: result[STORAGE_KEYS.LANGUAGE_LEVEL] || 'fluent',
          enableImageAnalysis: result[STORAGE_KEYS.ENABLE_IMAGE_ANALYSIS] ?? false,
          serviceDescription: result[STORAGE_KEYS.SERVICE_DESCRIPTION] || '',
        });
      });
    }),
    DEFAULT_SETTINGS
  );
}

export async function saveSettings(settings: UserSettings): Promise<void> {
  return safeStorageOperation(
    () => new Promise((resolve) => {
      chrome.storage.local.set(
        {
          [STORAGE_KEYS.LLM_PROVIDER]: settings.llmProvider,
          [STORAGE_KEYS.API_KEY]: settings.apiKey,
          [STORAGE_KEYS.MODEL]: settings.model,
          [STORAGE_KEYS.PERSONA]: settings.persona,
          [STORAGE_KEYS.ENABLE_EMOJIS]: settings.enableEmojis,
          [STORAGE_KEYS.LANGUAGE_LEVEL]: settings.languageLevel,
          [STORAGE_KEYS.ENABLE_IMAGE_ANALYSIS]: settings.enableImageAnalysis,
          [STORAGE_KEYS.SERVICE_DESCRIPTION]: settings.serviceDescription,
        },
        () => {
          if (chrome.runtime.lastError) {
            console.warn('Storage error:', chrome.runtime.lastError);
          }
          resolve();
        }
      );
    }),
    undefined
  );
}

export async function clearSettings(): Promise<void> {
  return safeStorageOperation(
    () => new Promise((resolve) => {
      chrome.storage.local.remove(
        [STORAGE_KEYS.API_KEY, STORAGE_KEYS.PERSONA, STORAGE_KEYS.ENABLE_EMOJIS],
        () => {
          if (chrome.runtime.lastError) {
            console.warn('Storage error:', chrome.runtime.lastError);
          }
          resolve();
        }
      );
    }),
    undefined
  );
}

export async function getApiKey(): Promise<string> {
  const settings = await getSettings();
  return settings.apiKey;
}

export async function getPersona(): Promise<string> {
  const settings = await getSettings();
  return settings.persona;
}

// ==================== Persona Observations ====================

export async function getPersonaObservations(): Promise<PersonaObservation[]> {
  return safeStorageOperation(
    () => new Promise((resolve) => {
      chrome.storage.local.get([STORAGE_KEYS.PERSONA_OBSERVATIONS], (result) => {
        if (chrome.runtime.lastError) {
          console.warn('Storage error:', chrome.runtime.lastError);
          resolve([]);
          return;
        }
        resolve(result[STORAGE_KEYS.PERSONA_OBSERVATIONS] || []);
      });
    }),
    []
  );
}

export async function addPersonaObservation(observationText: string): Promise<void> {
  if (!isExtensionContextValid()) return;

  const observations = await getPersonaObservations();

  const newObservation: PersonaObservation = {
    text: observationText,
    timestamp: Date.now(),
  };

  const updated = [newObservation, ...observations].slice(0, MAX_PERSONA_OBSERVATIONS);

  return safeStorageOperation(
    () => new Promise((resolve) => {
      chrome.storage.local.set(
        { [STORAGE_KEYS.PERSONA_OBSERVATIONS]: updated },
        () => {
          if (chrome.runtime.lastError) {
            console.warn('Storage error:', chrome.runtime.lastError);
          }
          resolve();
        }
      );
    }),
    undefined
  );
}

export async function clearPersonaObservations(): Promise<void> {
  return safeStorageOperation(
    () => new Promise((resolve) => {
      chrome.storage.local.remove([STORAGE_KEYS.PERSONA_OBSERVATIONS], () => {
        if (chrome.runtime.lastError) {
          console.warn('Storage error:', chrome.runtime.lastError);
        }
        resolve();
      });
    }),
    undefined
  );
}

// ==================== History Management ====================

export async function getHistory(): Promise<HistoryEntry[]> {
  return safeStorageOperation(
    () => new Promise((resolve) => {
      chrome.storage.local.get([STORAGE_KEYS.HISTORY], (result) => {
        if (chrome.runtime.lastError) {
          console.warn('Storage error:', chrome.runtime.lastError);
          resolve([]);
          return;
        }
        resolve(result[STORAGE_KEYS.HISTORY] || []);
      });
    }),
    []
  );
}

export async function addToHistory(comment: string, postPreview: string): Promise<void> {
  if (!isExtensionContextValid()) {
    console.warn('Extension context invalidated. Cannot save to history.');
    return;
  }

  const history = await getHistory();

  const newEntry: HistoryEntry = {
    id: Date.now().toString(),
    comment,
    postPreview: postPreview.slice(0, 100),
    timestamp: Date.now(),
  };

  const updatedHistory = [newEntry, ...history].slice(0, MAX_HISTORY_ENTRIES);

  return safeStorageOperation(
    () => new Promise((resolve) => {
      chrome.storage.local.set(
        { [STORAGE_KEYS.HISTORY]: updatedHistory },
        () => {
          if (chrome.runtime.lastError) {
            console.warn('Storage error:', chrome.runtime.lastError);
          }
          resolve();
        }
      );
    }),
    undefined
  );
}

export async function removeFromHistory(id: string): Promise<void> {
  if (!isExtensionContextValid()) {
    console.warn('Extension context invalidated. Cannot modify history.');
    return;
  }

  const history = await getHistory();
  const updatedHistory = history.filter((entry) => entry.id !== id);

  return safeStorageOperation(
    () => new Promise((resolve) => {
      chrome.storage.local.set(
        { [STORAGE_KEYS.HISTORY]: updatedHistory },
        () => {
          if (chrome.runtime.lastError) {
            console.warn('Storage error:', chrome.runtime.lastError);
          }
          resolve();
        }
      );
    }),
    undefined
  );
}

export async function clearHistory(): Promise<void> {
  return safeStorageOperation(
    () => new Promise((resolve) => {
      chrome.storage.local.remove([STORAGE_KEYS.HISTORY], () => {
        if (chrome.runtime.lastError) {
          console.warn('Storage error:', chrome.runtime.lastError);
        }
        resolve();
      });
    }),
    undefined
  );
}

// ==================== Feedback Management ====================

const MAX_FEEDBACK_ENTRIES = 100;

export async function getFeedback(): Promise<CommentFeedback[]> {
  return safeStorageOperation(
    () => new Promise((resolve) => {
      chrome.storage.local.get([STORAGE_KEYS.FEEDBACK], (result) => {
        if (chrome.runtime.lastError) {
          console.warn('Storage error:', chrome.runtime.lastError);
          resolve([]);
          return;
        }
        resolve(result[STORAGE_KEYS.FEEDBACK] || []);
      });
    }),
    []
  );
}

export async function saveFeedback(feedback: CommentFeedback): Promise<void> {
  if (!isExtensionContextValid()) {
    console.warn('Extension context invalidated. Cannot save feedback.');
    return;
  }

  const existingFeedback = await getFeedback();
  const updatedFeedback = [feedback, ...existingFeedback].slice(0, MAX_FEEDBACK_ENTRIES);

  return safeStorageOperation(
    () => new Promise((resolve) => {
      chrome.storage.local.set(
        { [STORAGE_KEYS.FEEDBACK]: updatedFeedback },
        () => {
          if (chrome.runtime.lastError) {
            console.warn('Storage error:', chrome.runtime.lastError);
          }
          resolve();
        }
      );
    }),
    undefined
  );
}

export async function getFeedbackStats(): Promise<{ positive: number; negative: number }> {
  const feedback = await getFeedback();
  return {
    positive: feedback.filter(f => f.isPositive).length,
    negative: feedback.filter(f => !f.isPositive).length,
  };
}

// ==================== Migration ====================

export async function migrateFromSaaSVersion(): Promise<void> {
  return safeStorageOperation(
    () => new Promise((resolve) => {
      chrome.storage.local.get(['migration_v2_done'], (result) => {
        if (result.migration_v2_done) {
          resolve();
          return;
        }
        // Clean up old SaaS keys
        chrome.storage.local.remove([
          'auth_token', 'server_url', 'use_backend',
          'auth_step', 'auth_userEmail', 'extension_user_email',
          'fullenrich_api_key',
        ], () => {
          chrome.storage.local.set({ migration_v2_done: true }, () => {
            console.log('[LiPilot] Migration from SaaS version completed');
            resolve();
          });
        });
      });
    }),
    undefined
  );
}
