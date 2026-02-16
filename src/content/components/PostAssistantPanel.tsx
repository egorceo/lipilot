import { useState } from 'react';
import type { ToneType, MessageRequest, MessageResponse } from '../../types';

interface PostAssistantPanelProps {
  onClose: () => void;
  onInsertPost: (text: string) => void;
}

type PostTemplate = 'business-mistake' | 'custom';

const POST_TEMPLATES = {
  'business-mistake': {
    name: 'Business Mistake & Lesson',
    prompt: 'Write a post about a business mistake and lessons learned — in the style of a founder who honestly documents their journey. Format: hook → crisis → solution → key takeaway.',
  },
};

const TONES: { value: ToneType; label: string }[] = [
  { value: 'professional', label: 'Professional' },
  { value: 'raw', label: 'Raw/Authentic' },
  { value: 'bold', label: 'Bold' },
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
    console.error('[PostAssistant] Error sending message:', error);
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

export function PostAssistantPanel({ onClose, onInsertPost }: PostAssistantPanelProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<PostTemplate>('business-mistake');
  const [customTopic, setCustomTopic] = useState('');
  const [keyPoints, setKeyPoints] = useState('');
  const [tone, setTone] = useState<ToneType>('raw');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPost, setGeneratedPost] = useState<string | null>(null); // Cleaned version for insertion
  const [originalPost, setOriginalPost] = useState<string | null>(null); // Original with markdown for preview
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    setGeneratedPost(null);

    try {
      // Build the prompt based on template or custom input
      let prompt = '';
      if (selectedTemplate === 'business-mistake') {
        prompt = POST_TEMPLATES['business-mistake'].prompt;
      } else if (customTopic.trim()) {
        prompt = customTopic.trim();
      } else {
        // Default prompt
        prompt = 'Write a post about a business mistake and lessons learned — in the style of a founder who honestly documents their journey. Format: hook → crisis → solution → key takeaway.';
      }

      console.log('[PostAssistant] Sending request:', {
        topic: prompt,
        tone,
        keyPoints: keyPoints.trim() || undefined,
      });

      const response = await safeSendMessage({
        type: 'generate-post',
        data: {
          topic: prompt,
          tone,
          keyPoints: keyPoints.trim() || undefined,
        },
      });

      console.log('[PostAssistant] Received response:', response);

      if (response.success && response.data?.post) {
        setGeneratedPost(response.data.post); // Cleaned version for insertion
        setOriginalPost(response.data.originalPost || response.data.post); // Original with markdown for preview
      } else {
        const errorMsg = response.error || 'Failed to generate post';
        console.error('[PostAssistant] Error:', errorMsg);
        setError(errorMsg);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleInsert = () => {
    if (generatedPost) {
      // Use cleaned version (without markdown) for insertion
      onInsertPost(generatedPost);
      onClose();
    }
  };

  /**
   * Parse markdown to HTML for preview
   */
  const parseMarkdown = (text: string): string => {
    if (!text) return '';
    
    // Escape HTML to prevent XSS
    const escapeHtml = (str: string) => {
      const div = document.createElement('div');
      div.textContent = str;
      return div.innerHTML;
    };
    
    let html = escapeHtml(text);
    
    // Process line by line to handle headers and paragraphs correctly
    const lines = html.split('\n');
    const processedLines: string[] = [];
    
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      const trimmed = line.trim();
      
      // Empty line = paragraph break
      if (trimmed === '') {
        processedLines.push('<br/>');
        continue;
      }
      
      // Headers (must be at start of line)
      if (trimmed.startsWith('### ')) {
        processedLines.push(`<h3>${trimmed.substring(4)}</h3>`);
        continue;
      }
      if (trimmed.startsWith('## ')) {
        processedLines.push(`<h2>${trimmed.substring(3)}</h2>`);
        continue;
      }
      if (trimmed.startsWith('# ')) {
        processedLines.push(`<h1>${trimmed.substring(2)}</h1>`);
        continue;
      }
      
      // Process inline markdown in the line
      // Bold (**text** or __text__)
      line = line.replace(/\*\*([^*]+?)\*\*/g, '<strong>$1</strong>');
      line = line.replace(/__([^_]+?)__/g, '<strong>$1</strong>');
      
      // Italic (*text* or _text_) - but not if it's part of bold
      line = line.replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, '<em>$1</em>');
      line = line.replace(/(?<!_)_([^_]+?)_(?!_)/g, '<em>$1</em>');
      
      // Hashtags (style them)
      line = line.replace(/#(\w+)/g, '<span style="color: #70b5f9; font-weight: 600;">#$1</span>');
      
      // Wrap in paragraph
      processedLines.push(`<p>${line}</p>`);
    }
    
    return processedLines.join('');
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-title">
          <div className="panel-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/>
              <circle cx="7.5" cy="14.5" r="1.5"/>
              <circle cx="16.5" cy="14.5" r="1.5"/>
            </svg>
          </div>
          <span>Post Assistant</span>
        </div>
        <button className="close-btn" onClick={onClose} title="Close">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <div className="panel-content">
        {/* Template Selector */}
        <div className="section">
          <div className="section-label">Template</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              onClick={() => setSelectedTemplate('business-mistake')}
              style={{
                padding: '12px',
                background: selectedTemplate === 'business-mistake' 
                  ? 'rgba(10, 102, 194, 0.2)' 
                  : 'rgba(255, 255, 255, 0.05)',
                border: `1px solid ${selectedTemplate === 'business-mistake' 
                  ? 'rgba(10, 102, 194, 0.4)' 
                  : 'rgba(255, 255, 255, 0.1)'}`,
                borderRadius: '10px',
                color: '#fff',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: '13px',
                fontWeight: selectedTemplate === 'business-mistake' ? 600 : 400,
              }}
            >
              {POST_TEMPLATES['business-mistake'].name}
            </button>
            <button
              onClick={() => setSelectedTemplate('custom')}
              style={{
                padding: '12px',
                background: selectedTemplate === 'custom' 
                  ? 'rgba(10, 102, 194, 0.2)' 
                  : 'rgba(255, 255, 255, 0.05)',
                border: `1px solid ${selectedTemplate === 'custom' 
                  ? 'rgba(10, 102, 194, 0.4)' 
                  : 'rgba(255, 255, 255, 0.1)'}`,
                borderRadius: '10px',
                color: '#fff',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: '13px',
                fontWeight: selectedTemplate === 'custom' ? 600 : 400,
              }}
            >
              Custom Topic
            </button>
          </div>
        </div>

        {/* Custom Input */}
        {selectedTemplate === 'custom' && (
          <div className="section">
            <div className="section-label">Topic</div>
            <textarea
              className="thoughts-input"
              placeholder="Write about our new update, My thoughts on AI, etc."
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              rows={3}
            />
          </div>
        )}

        {/* Key Points Input */}
        <div className="section">
          <div className="section-label">
            Key Points <span className="optional-label">(optional)</span>
          </div>
          <textarea
            className="thoughts-input"
            placeholder="Add context, specific points, or details you want to include in the post..."
            value={keyPoints}
            onChange={(e) => setKeyPoints(e.target.value)}
            rows={3}
          />
        </div>

        {/* Tone Selector */}
        <div className="section">
          <div className="section-label">Tone</div>
          <select
            className="tone-select"
            value={tone}
            onChange={(e) => setTone(e.target.value as ToneType)}
          >
            {TONES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* Generate Button */}
        <button
          className="generate-btn"
          onClick={handleGenerate}
          disabled={isGenerating || (selectedTemplate === 'custom' && !customTopic.trim())}
        >
          {isGenerating ? (
            <>
              <div className="spinner" />
              Generating...
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>
              Generate Post
            </>
          )}
        </button>

        {/* Error Message */}
        {error && (
          <div className="error-message">
            <svg className="error-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 8v4M12 16h.01"/>
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Generated Post Preview */}
        {generatedPost && (
          <div className="section">
            <div className="section-label" style={{ marginBottom: '12px', fontSize: '14px', fontWeight: 600 }}>
              Generated Post
            </div>
            <div 
              className="post-preview" 
              style={{ 
                maxHeight: '300px', 
                overflowY: 'auto',
                padding: '16px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                fontSize: '14px',
                lineHeight: '1.6',
                color: '#fff',
                wordWrap: 'break-word',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
              }}
              dangerouslySetInnerHTML={{ 
                __html: parseMarkdown(originalPost || generatedPost) 
              }}
            />
            <button
              className="insert-btn"
              onClick={handleInsert}
              style={{ 
                marginTop: '16px', 
                width: '100%',
                padding: '12px 16px',
                background: 'linear-gradient(135deg, #0a66c2 0%, #004182 100%)',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #004182 0%, #0a66c2 100%)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #0a66c2 0%, #004182 100%)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12l7-7 7 7"/>
              </svg>
              Insert into Post
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

