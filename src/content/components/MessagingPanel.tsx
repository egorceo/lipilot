import { useState, useEffect, useRef } from 'react';
import type { ConversationContext, MessagingToneType, MessageRequest, MessageResponse, ScoredReply, ConversationSummary } from '../../types';
import { getSettings } from '../../utils/storage';

const MESSAGING_TONE_OPTIONS: { value: MessagingToneType; label: string }[] = [
  { value: 'friendly', label: 'Friendly' },
  { value: 'professional', label: 'Professional' },
  { value: 'follow-up', label: 'Follow-up' },
  { value: 'closing-deal', label: 'Closing Deal' },
  { value: 'networking', label: 'Networking' },
];

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
 * Safely send a message to the background script
 */
async function safeSendMessage(request: MessageRequest): Promise<MessageResponse> {
  if (!isExtensionContextValid()) {
    return { 
      success: false, 
      error: 'Extension was updated. Please refresh the page.' 
    };
  }
  
  try {
    const response = await chrome.runtime.sendMessage(request) as MessageResponse;
    return response;
  } catch (error) {
    if (error instanceof Error && 
        (error.message.includes('Extension context invalidated') || 
         error.message.includes('Receiving end does not exist'))) {
      return { 
        success: false, 
        error: 'Extension was updated. Please refresh the page.' 
      };
    }
    throw error;
  }
}

interface MessagingPanelProps {
  conversationContext: ConversationContext | null;
  isScanning?: boolean;
  onClose: () => void;
  onInsertReply: (reply: string) => void;
}

export function MessagingPanel({ conversationContext, isScanning = false, onClose, onInsertReply }: MessagingPanelProps) {
  const [tone, setTone] = useState<MessagingToneType>('friendly');
  const [userThoughts, setUserThoughts] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [replies, setReplies] = useState<ScoredReply[]>([]);
  const [summary, setSummary] = useState<ConversationSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasApiKey, setHasApiKey] = useState(true);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [includeServiceOffer, setIncludeServiceOffer] = useState(false);
  const [hasServiceDescription, setHasServiceDescription] = useState(false);

  const canGenerate = !isScanning && conversationContext && conversationContext.messages.length > 0 && hasApiKey;
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ isDragging: false, startX: 0, startY: 0, initialX: 0, initialY: 0 });

  useEffect(() => {
    getSettings().then((settings) => {
      setHasApiKey(!!settings.apiKey);
      setHasServiceDescription(!!settings.serviceDescription?.trim());
    });
  }, []);

  // Auto-resize textarea
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  };

  // Draggable functionality
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.panel-header')) return;
      
      dragRef.current.isDragging = true;
      dragRef.current.startX = e.clientX;
      dragRef.current.startY = e.clientY;
      
      const rect = panel.getBoundingClientRect();
      dragRef.current.initialX = rect.left;
      dragRef.current.initialY = rect.top;
      
      panel.style.transition = 'none';
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragRef.current.isDragging) return;
      
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      
      panel.style.right = 'auto';
      panel.style.left = `${dragRef.current.initialX + dx}px`;
      panel.style.top = `${dragRef.current.initialY + dy}px`;
    };

    const handleMouseUp = () => {
      dragRef.current.isDragging = false;
      panel.style.transition = '';
    };

    panel.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      panel.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const handleGenerate = async () => {
    if (!conversationContext) {
      setError('No conversation context available.');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setReplies([]);
    setSummary(null);

    try {
      const settings = await getSettings();
      
      if (!settings.apiKey) {
        setHasApiKey(false);
        return;
      }

      const request: MessageRequest = {
        type: 'GENERATE_MESSAGES',
        payload: {
          conversationContext,
          tone,
          persona: settings.persona,
          enableEmojis: settings.enableEmojis ?? false,
          languageLevel: settings.languageLevel || 'fluent',
          userThoughts: userThoughts.trim() || undefined,
          includeServiceOffer: includeServiceOffer && !!settings.serviceDescription?.trim(),
          serviceDescription: includeServiceOffer ? settings.serviceDescription : undefined,
        },
      };

      const response = await safeSendMessage(request);

      if (response.success && response.replies) {
        setReplies(response.replies);
        if (response.summary) {
          setSummary(response.summary);
        }
      } else {
        setError(response.error || 'Failed to generate replies');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const openSettings = () => {
    if (isExtensionContextValid()) {
      try {
        chrome.runtime.sendMessage({ type: 'OPEN_OPTIONS' });
      } catch {
        setError('Extension was updated. Please refresh the page.');
      }
    } else {
      setError('Extension was updated. Please refresh the page.');
    }
  };

  // No API Key State
  if (!hasApiKey) {
    return (
      <div className="panel messaging-panel" ref={panelRef}>
        <div className="panel-header">
          <div className="panel-title">
            <div className="panel-icon messaging">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <span>Conversation Co-pilot</span>
          </div>
          <button className="close-btn" onClick={onClose}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
        
        <div className="panel-content">
          <div className="no-api-key">
            <div className="no-api-key-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
              </svg>
            </div>
            <h3>API Key Required</h3>
            <p>Please configure your API key in the extension settings.</p>
            <button className="settings-btn" onClick={openSettings}>
              Open Settings
            </button>
          </div>
        </div>

        <div className="panel-footer">
          <span>Supported by </span>
          <a href="https://travel-code.com/" target="_blank" rel="noopener noreferrer" className="sponsor-link">Travel Code</a>
          <span> — AI-powered corporate travel platform. Managing all corporate travel in one place.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="panel messaging-panel" ref={panelRef}>
      <div className="panel-header">
        <div className="panel-title">
          <div className="panel-icon messaging">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <span>Conversation Co-pilot</span>
        </div>
        <button className="close-btn" onClick={onClose}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>

      {/* Context Summary */}
      <div className="messaging-context">
        {isScanning ? (
          <div className="context-scanning">
            <div className="spinner-small" />
            <span>Analyzing conversation...</span>
          </div>
        ) : conversationContext ? (
          <>
            <div className="context-participant">
              <span className="context-label">Chatting with:</span>
              <span className="context-value">{conversationContext.participantName}</span>
            </div>
            {conversationContext.participantHeadline && (
              <div className="context-headline">{conversationContext.participantHeadline}</div>
            )}
            <div className="context-stats">
              <span className="stat">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                {conversationContext.messages.length} messages
              </span>
              <span className="stat">
                <span className={`sentiment-dot ${conversationContext.sentiment}`} />
                {conversationContext.sentiment}
              </span>
            </div>
            {summary && (
              <div className="ai-summary">
                <div className="summary-topic">{summary.topic}</div>
                <div className="summary-action">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                  </svg>
                  {summary.suggestedAction}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="context-empty">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 8v4M12 16h.01"/>
            </svg>
            <span>Open a conversation to get started</span>
          </div>
        )}
      </div>

      <div className="panel-content">
        {/* Your Goal Input */}
        <div className="section">
          <div className="section-label">Your goal for this reply <span className="optional-label">(optional)</span></div>
          <div className="thoughts-input-wrapper">
            <textarea
              ref={textareaRef}
              className="thoughts-input"
              value={userThoughts}
              onChange={(e) => {
                setUserThoughts(e.target.value);
                adjustTextareaHeight();
              }}
              placeholder="e.g., Schedule a call for next week, or ask about their budget..."
              rows={2}
            />
            {userThoughts && (
              <button
                className="clear-thoughts-btn"
                onClick={() => {
                  setUserThoughts('');
                  if (textareaRef.current) {
                    textareaRef.current.style.height = 'auto';
                  }
                }}
                title="Clear"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Include Service Offer Toggle */}
        <div className="section">
          <label className={`service-offer-toggle ${!hasServiceDescription ? 'disabled' : ''}`}>
            <div className="toggle-left">
              <div className="toggle-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
              </div>
              <div className="toggle-text">
                <span className="toggle-label">Include Service Offer</span>
                {hasServiceDescription ? (
                  <span className="toggle-hint">Subtly mention your expertise</span>
                ) : (
                  <span className="toggle-hint warning">Configure in Settings first</span>
                )}
              </div>
            </div>
            <input
              type="checkbox"
              checked={includeServiceOffer}
              onChange={(e) => setIncludeServiceOffer(e.target.checked)}
              disabled={!hasServiceDescription}
              className="toggle-checkbox"
            />
            <span className={`toggle-switch ${includeServiceOffer ? 'active' : ''}`} />
          </label>
        </div>

        {/* Tone Selector */}
        <div className="section">
          <div className="section-label">Conversation Tone</div>
          <select
            className="tone-select"
            value={tone}
            onChange={(e) => setTone(e.target.value as MessagingToneType)}
          >
            {MESSAGING_TONE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Generate Button */}
        <div className="section">
          <button
            className="generate-btn"
            onClick={handleGenerate}
            disabled={!canGenerate || isGenerating}
          >
            {isScanning ? (
              <>
                <div className="spinner" />
                Analyzing Chat...
              </>
            ) : isGenerating ? (
              <>
                <div className="spinner" />
                Crafting Replies...
              </>
            ) : !conversationContext ? (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                Open a Conversation
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                </svg>
                Suggest Replies
              </>
            )}
          </button>
        </div>

        {/* Loading Shimmer */}
        {isGenerating && (
          <div className="shimmer-container">
            <div className="shimmer-card">
              <div className="shimmer-line long"></div>
              <div className="shimmer-line short"></div>
            </div>
            <div className="shimmer-card">
              <div className="shimmer-line medium"></div>
              <div className="shimmer-line long"></div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="error-message">
            <svg className="error-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Results */}
        {replies.length > 0 && !isGenerating && (
          <div className="section">
            <div className="section-label">Suggested Replies</div>
            <div className="results">
              {replies.map((reply, index) => (
                <div key={index} className="comment-card">
                  {/* Recommendation Tag */}
                  <div className="recommendation-tag">{reply.recommendationTag}</div>
                  
                  <div className="comment-text">{reply.text}</div>
                  
                  <div className="comment-actions">
                    <div className="action-group">
                      <button
                        className={`action-btn ${copiedIndex === index ? 'copied' : ''}`}
                        onClick={() => handleCopyToClipboard(reply.text, index)}
                        title="Copy to clipboard"
                      >
                        {copiedIndex === index ? (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        ) : (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                          </svg>
                        )}
                      </button>
                      <button
                        className="insert-btn"
                        onClick={() => onInsertReply(reply.text)}
                        title="Insert into message box"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sponsor Footer */}
      <div className="panel-footer">
        <span>Supported by </span>
        <a href="https://travel-code.com/" target="_blank" rel="noopener noreferrer" className="sponsor-link">Travel Code</a>
        <span> — AI-powered corporate travel platform. Managing all corporate travel in one place.</span>
      </div>
    </div>
  );
}

