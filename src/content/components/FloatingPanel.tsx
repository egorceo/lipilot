import { useState, useEffect, useRef } from 'react';
import type { EnrichedPostData, ToneType, MessageRequest, MessageResponse, HistoryEntry, ScoredComment } from '../../types';
import { getSettings, getHistory, addToHistory, clearHistory } from '../../utils/storage';
// Removed direct API imports - using background script instead
import { ContextAwareness } from './ContextAwareness';
import { findActiveCommentBox } from '../utils/linkedin-selectors';

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
  console.log('[FloatingPanel] safeSendMessage called with type:', request.type);
  
  if (!isExtensionContextValid()) {
    console.error('[FloatingPanel] Extension context invalidated!');
    return { 
      success: false, 
      error: 'Extension was updated. Please refresh the page.' 
    };
  }
  
  try {
    console.log('[FloatingPanel] Sending message to background script...');
    const response = await chrome.runtime.sendMessage(request) as MessageResponse;
    console.log('[FloatingPanel] Received response from background:', response);
    return response;
  } catch (error) {
    console.error('[FloatingPanel] Error sending message:', error);
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

const TONE_OPTIONS: { value: ToneType; label: string }[] = [
  { value: 'professional', label: 'Professional' },
  { value: 'funny', label: 'Funny' },
  { value: 'question', label: 'Question' },
  { value: 'agree-add-value', label: 'Agree & Add Value' },
];

interface FloatingPanelProps {
  postData: EnrichedPostData | null;
  isScanning?: boolean;
  onClose: () => void;
  onInsertComment: (comment: string) => void;
}

type TabType = 'generate' | 'history';

export function FloatingPanel({ postData, isScanning = false, onClose, onInsertComment }: FloatingPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>('generate');
  const [tone, setTone] = useState<ToneType>('professional');
  const [userThoughts, setUserThoughts] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [comments, setComments] = useState<string[]>([]);
  const [scoredComments, setScoredComments] = useState<ScoredComment[]>([]);
  const [refiningIndex, setRefiningIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isConfigured, setIsConfigured] = useState(false);
  const [isCheckingConfig, setIsCheckingConfig] = useState(true);
  const [configError, setConfigError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedHistoryId, setCopiedHistoryId] = useState<string | null>(null);
  const [includeServiceOffer, setIncludeServiceOffer] = useState(false);
  const [hasServiceDescription, setHasServiceDescription] = useState(false);
  const [analyzeImage, setAnalyzeImage] = useState(false); // Will auto-enable if image found
  const [imageAnalysisEnabled, setImageAnalysisEnabled] = useState(false);
  const [userConfig, setUserConfig] = useState<{
    enableEmojis: boolean;
    languageLevel: string;
    serviceDescription: string;
  } | null>(null);

  // Check if we have enough context to generate
  const canGenerate = !isScanning && postData && postData.postContent && isConfigured;
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  };
  
  const panelRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ isDragging: false, startX: 0, startY: 0, initialX: 0, initialY: 0 });

  useEffect(() => {
    checkConfiguration();
    loadHistory();
  }, []);

  // Auto-enable image analysis when a post with an image is detected
  useEffect(() => {
    if (postData?.imageUrl && imageAnalysisEnabled) {
      setAnalyzeImage(true);
    }
  }, [postData?.imageUrl, imageAnalysisEnabled]);

  const checkConfiguration = async () => {
    setIsCheckingConfig(true);
    setConfigError(null);

    try {
      const response = await safeSendMessage({ type: 'CHECK_CONFIG' });

      if (!response.success) {
        setIsConfigured(false);
        setConfigError(response.error || 'Failed to check configuration');
        setIsCheckingConfig(false);
        return;
      }

      const settings = response.settings;
      if (!settings) {
        setIsConfigured(false);
        setConfigError('Settings not found. Please configure the extension in Settings.');
        setIsCheckingConfig(false);
        return;
      }

      // Store user config for generation
      setUserConfig({
        enableEmojis: settings.enableEmojis ?? false,
        languageLevel: settings.languageLevel || 'fluent',
        serviceDescription: settings.serviceDescription || '',
      });

      // Check if required fields are configured
      const hasPersona = settings.persona && settings.persona.trim().length > 0;
      const hasApiKey = settings.apiKey && settings.apiKey.trim().length > 0;

      const isFullyConfigured = hasPersona && hasApiKey;

      setIsConfigured(isFullyConfigured);
      setHasServiceDescription(!!settings.serviceDescription?.trim());
      setImageAnalysisEnabled(settings.enableImageAnalysis ?? false);
      setAnalyzeImage(settings.enableImageAnalysis ?? false);

      if (!isFullyConfigured) {
        const missing = [];
        if (!hasPersona) missing.push('persona');
        if (!hasApiKey) missing.push('API key');
        setConfigError(`Please complete your setup in Settings: ${missing.join(', ')}`);
      } else {
        console.log('[FloatingPanel] Configuration check successful - extension ready');
      }
    } catch (error: any) {
      console.error('[FloatingPanel] Configuration check failed:', error);
      setIsConfigured(false);
      if (error?.message) {
        setConfigError(`Error: ${error.message}`);
      } else {
        setConfigError('Failed to check configuration. Please try again.');
      }
    } finally {
      setIsCheckingConfig(false);
    }
  };

  const loadHistory = async () => {
    const h = await getHistory();
    setHistory(h);
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
    if (!postData) {
      setError('No post data available. Please try again.');
      return;
    }

    if (!userConfig || !isConfigured) {
      setError('Configuration not ready. Please wait...');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setComments([]);
    setScoredComments([]);

    try {
      const request: MessageRequest = {
        type: 'GENERATE_COMMENTS',
        payload: {
          postData,
          tone,
          // Persona and API key are handled by backend - don't pass from local storage
          enableEmojis: userConfig.enableEmojis,
          languageLevel: userConfig.languageLevel as any,
          userThoughts: userThoughts.trim() || undefined,
          enableImageAnalysis: analyzeImage && !!postData?.imageUrl,
          includeServiceOffer: includeServiceOffer && !!userConfig.serviceDescription?.trim(),
          serviceDescription: includeServiceOffer ? userConfig.serviceDescription : undefined,
        },
      };

      const response = await safeSendMessage(request);

      if (response.success) {
        if (response.scoredComments && response.scoredComments.length > 0) {
          setScoredComments(response.scoredComments);
          setComments(response.scoredComments.map(c => c.text));
        } else if (response.comments) {
          setComments(response.comments);
        }
      } else {
        setError(response.error || 'Failed to generate comments');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRefine = async (index: number, type: 'concise' | 'rephrase') => {
    setRefiningIndex(index);
    
    try {
      const commentText = scoredComments.length > 0 ? scoredComments[index].text : comments[index];
      
      const request: MessageRequest = {
        type: 'REFINE_COMMENT',
        payload: {
          comment: commentText,
          refinementType: type,
        },
      };

      const response = await safeSendMessage(request);

      if (response.success && response.comment) {
        if (scoredComments.length > 0) {
          const newScoredComments = [...scoredComments];
          newScoredComments[index] = { ...newScoredComments[index], text: response.comment };
          setScoredComments(newScoredComments);
        }
        const newComments = [...comments];
        newComments[index] = response.comment;
        setComments(newComments);
      } else if (response.error) {
        setError(response.error);
      }
    } catch (err) {
      console.error('Refine error:', err);
    } finally {
      setRefiningIndex(null);
    }
  };


  const handleCopyToClipboard = async (text: string, index?: number, historyId?: string) => {
    try {
      await navigator.clipboard.writeText(text);
      if (index !== undefined) {
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
      }
      if (historyId) {
        setCopiedHistoryId(historyId);
        setTimeout(() => setCopiedHistoryId(null), 2000);
      }
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const handleInsertAndSave = async (comment: string, selectedIndex?: number) => {
    if (postData) {
      await addToHistory(comment, postData.postContent);
    }

    // Capture original AI suggestion for local learning
    const originalAiSuggestion = selectedIndex !== undefined
      ? (scoredComments[selectedIndex]?.text || comments[selectedIndex] || comment)
      : comment;

    // Insert comment
    onInsertComment(comment);

    // Send to local persona learning (fire-and-forget)
    safeSendMessage({
      type: 'STREAM_UPDATE_PERSONA',
      payload: {
        originalAiSuggestion,
        finalUserVersion: comment,
      },
    }).catch((error) => {
      console.error('[FloatingPanel] Persona update error:', error);
    });

    loadHistory();
  };

  const handleClearHistory = async () => {
    await clearHistory();
    setHistory([]);
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

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  const formatTimestamp = (ts: number) => {
    const date = new Date(ts);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };


  // Not Configured State
  if (isCheckingConfig) {
    return (
      <div className="panel" ref={panelRef}>
        <div className="panel-header">
          <div className="panel-title">
            <div className="panel-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/>
              </svg>
            </div>
            <span>AI Comment Assistant</span>
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
              <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
            </div>
            <h3>Checking Configuration...</h3>
            <p>Verifying your setup</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isConfigured) {
    return (
      <>
        <div className="panel" ref={panelRef}>
          <div className="panel-header">
            <div className="panel-title">
              <div className="panel-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/>
                </svg>
              </div>
              <span>AI Comment Assistant</span>
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
              <h3>Setup Required</h3>
              <p>{configError || 'Please complete your setup in Settings'}</p>
              <button className="settings-btn" onClick={openSettings}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                </svg>
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
      </>
    );
  }

  return (
    <>
      <div className="panel" ref={panelRef}>
      <div className="panel-header">
        <div className="panel-title">
          <div className="panel-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/>
            </svg>
          </div>
          <span>AI Comment Assistant</span>
        </div>
        <button className="close-btn" onClick={onClose}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'generate' ? 'active' : ''}`}
          onClick={() => setActiveTab('generate')}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
          </svg>
          Generate
        </button>
        <button 
          className={`tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => { setActiveTab('history'); loadHistory(); }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
          History
        </button>
      </div>

      {/* Context Awareness Section */}
      <ContextAwareness 
        postData={postData} 
        isScanning={isScanning}
        analyzeImage={analyzeImage}
        onAnalyzeImageChange={setAnalyzeImage}
      />

      <div className="panel-content">
        {activeTab === 'generate' ? (
          <>
            {/* Your Thoughts Input */}
            <div className="section">
              <div className="section-label">Your key point <span className="optional-label">(optional)</span></div>
              <div className="thoughts-input-wrapper">
                <textarea
                  ref={textareaRef}
                  className="thoughts-input"
                  value={userThoughts}
                  onChange={(e) => {
                    setUserThoughts(e.target.value);
                    adjustTextareaHeight();
                  }}
                  placeholder="e.g., Mention that we just launched a similar feature, or ask about their pricing model..."
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
                      <span className="toggle-hint">Subtly promote your expertise</span>
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
              <div className="section-label">Tone</div>
              <select
                className="tone-select"
                value={tone}
                onChange={(e) => setTone(e.target.value as ToneType)}
              >
                {TONE_OPTIONS.map((option) => (
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
                    Scanning Context...
                  </>
                ) : isGenerating ? (
                  <>
                    <div className="spinner" />
                    Generating...
                  </>
                ) : !postData ? (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M12 8v4M12 16h.01"/>
                    </svg>
                    Waiting for Context...
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                    </svg>
                    Generate Comments
                  </>
                )}
              </button>
            </div>

            {/* Loading Shimmer */}
            {isGenerating && (
              <div className="shimmer-container">
                <div className="shimmer-card">
                  <div className="shimmer-line long"></div>
                  <div className="shimmer-line medium"></div>
                  <div className="shimmer-line short"></div>
                </div>
                <div className="shimmer-card">
                  <div className="shimmer-line long"></div>
                  <div className="shimmer-line medium"></div>
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
            {comments.length > 0 && !isGenerating && (
              <div className="section">
                <div className="section-label">Generated Comments</div>
                <div className="results">
                  {comments.map((comment, index) => {
                    const scored = scoredComments[index];
                    
                    return (
                      <div 
                        key={index} 
                        className={`comment-card ${refiningIndex === index ? 'refining' : ''}`}
                      >
                        {/* Recommendation Tag */}
                        {scored?.recommendationTag && (
                          <div className="recommendation-tag">{scored.recommendationTag}</div>
                        )}
                        
                        <div className="comment-text">{comment}</div>
                        
                        <div className="comment-actions">
                          <div className="action-group">
                            <button
                              className="action-btn refine-btn"
                              onClick={() => handleRefine(index, 'concise')}
                              disabled={refiningIndex !== null}
                              title="Make more concise"
                            >
                              {refiningIndex === index ? (
                                <div className="spinner-small" />
                              ) : (
                                <>
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M4 12h16M4 12l4-4M4 12l4 4M20 12l-4-4M20 12l-4 4"/>
                                  </svg>
                                  <span>Shorter</span>
                                </>
                              )}
                            </button>
                            <button
                              className="action-btn refine-btn"
                              onClick={() => handleRefine(index, 'rephrase')}
                              disabled={refiningIndex !== null}
                              title="Rephrase"
                            >
                              {refiningIndex === index ? (
                                <div className="spinner-small" />
                              ) : (
                                <>
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M1 4v6h6"/>
                                    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
                                  </svg>
                                  <span>Rephrase</span>
                                </>
                              )}
                            </button>
                          </div>
                          <div className="action-group">
                            <button
                              className={`action-btn ${copiedIndex === index ? 'copied' : ''}`}
                              onClick={() => handleCopyToClipboard(comment, index)}
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
                              onClick={() => handleInsertAndSave(comment, index)}
                              title="Insert into comment box"
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M5 12h14M12 5l7 7-7 7"/>
                              </svg>
                              Insert
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        ) : (
          /* History Tab */
          <div className="history-section">
            {history.length === 0 ? (
              <div className="empty-history">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                <p>No comments in history yet.</p>
                <span>Generated comments will appear here.</span>
              </div>
            ) : (
              <>
                <div className="history-header">
                  <span className="history-count">{history.length} recent comments</span>
                  <button className="clear-history-btn" onClick={handleClearHistory}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                    Clear
                  </button>
                </div>
                <div className="history-list">
                  {history.map((entry) => (
                    <div key={entry.id} className="history-item">
                      <div className="history-meta">
                        <span className="history-time">{formatTimestamp(entry.timestamp)}</span>
                        <span className="history-post">{truncateText(entry.postPreview, 30)}</span>
                      </div>
                      <div className="history-comment">{entry.comment}</div>
                      <div className="history-actions">
                        <button
                          className={`action-btn ${copiedHistoryId === entry.id ? 'copied' : ''}`}
                          onClick={() => handleCopyToClipboard(entry.comment, undefined, entry.id)}
                        >
                          {copiedHistoryId === entry.id ? (
                            <>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="20 6 9 17 4 12"/>
                              </svg>
                              Copied
                            </>
                          ) : (
                            <>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                              </svg>
                              Copy
                            </>
                          )}
                        </button>
                        <button
                          className="insert-btn"
                          onClick={() => onInsertComment(entry.comment)}
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14M12 5l7 7-7 7"/>
                          </svg>
                          Insert
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
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
    </>
  );
}
