import { useState } from 'react';
import type { EnrichedPostData } from '../../types';

interface ContextAwarenessProps {
  postData: EnrichedPostData | null;
  isScanning: boolean;
  analyzeImage?: boolean;
  onAnalyzeImageChange?: (value: boolean) => void;
}

interface ContextItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | null;
  fullValue?: string | null;
  status: 'success' | 'warning' | 'scanning';
  subLabel?: string;
}

function ContextItem({ icon, label, value, fullValue, status, subLabel }: ContextItemProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  
  const hasFullContent = fullValue && fullValue.length > 0 && fullValue !== value;

  const getStatusIcon = () => {
    if (status === 'scanning') {
      return (
        <div className="context-status scanning">
          <div className="scan-spinner" />
        </div>
      );
    }
    if (status === 'success') {
      return (
        <div className="context-status success">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
      );
    }
    return (
      <div className="context-status warning">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <path d="M12 9v4M12 17h.01" />
        </svg>
      </div>
    );
  };

  return (
    <div 
      className={`context-item ${status} ${hasFullContent ? 'has-tooltip' : ''}`}
      onMouseEnter={() => hasFullContent && setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className="context-item-line" />
      <div className="context-item-icon">{icon}</div>
      <div className="context-item-content">
        <div className="context-item-header">
          <span className="context-item-label">{label}</span>
          {getStatusIcon()}
          {hasFullContent && (
            <span className="hover-hint">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 16v-4M12 8h.01"/>
              </svg>
            </span>
          )}
        </div>
        {status === 'scanning' ? (
          <div className="context-item-value scanning">Scanning...</div>
        ) : value ? (
          <div className="context-item-value">{value}</div>
        ) : (
          <div className="context-item-value warning">{subLabel || 'Not found'}</div>
        )}
      </div>
      
      {/* Tooltip with full content */}
      {showTooltip && fullValue && (
        <div className="context-tooltip">
          <div className="context-tooltip-header">{label}</div>
          <div className="context-tooltip-content">{fullValue}</div>
        </div>
      )}
    </div>
  );
}

export function ContextAwareness({ postData, isScanning, analyzeImage, onAnalyzeImageChange }: ContextAwarenessProps) {
  const truncate = (text: string, length: number) => {
    if (!text) return '';
    return text.length > length ? text.slice(0, length) + '...' : text;
  };

  const getPostStatus = (): 'success' | 'warning' | 'scanning' => {
    if (isScanning) return 'scanning';
    return postData?.postContent ? 'success' : 'warning';
  };

  const getAuthorStatus = (): 'success' | 'warning' | 'scanning' => {
    if (isScanning) return 'scanning';
    return postData?.authorName ? 'success' : 'warning';
  };

  const getThreadStatus = (): 'success' | 'warning' | 'scanning' => {
    if (isScanning) return 'scanning';
    return 'success';
  };

  const getDiscussionStatus = (): 'success' | 'warning' | 'scanning' => {
    if (isScanning) return 'scanning';
    const count = postData?.threadContext?.existingComments?.length || 0;
    return count > 0 ? 'success' : 'warning';
  };

  const getThreadModeLabel = () => {
    if (!postData) return null;
    
    if (postData.threadContext?.mode === 'reply' && postData.threadContext?.parentComment) {
      return `Replying to ${postData.threadContext.parentComment.authorName}`;
    }
    return 'Direct Comment Mode';
  };

  const getThreadModeValue = () => {
    if (!postData) return null;
    
    if (postData.threadContext?.mode === 'reply' && postData.threadContext?.parentComment) {
      return truncate(postData.threadContext.parentComment.content, 50);
    }
    return 'Commenting directly on the main post';
  };

  const getThreadModeFullValue = () => {
    if (!postData) return null;
    
    if (postData.threadContext?.mode === 'reply' && postData.threadContext?.parentComment) {
      return postData.threadContext.parentComment.content;
    }
    return null;
  };

  const getDiscussionValue = () => {
    if (!postData) return null;
    const count = postData.threadContext?.existingComments?.length || 0;
    if (count === 0) return 'No previous comments found';
    return `${count} previous comment${count > 1 ? 's' : ''} analyzed`;
  };

  const getDiscussionFullValue = () => {
    if (!postData) return null;
    const comments = postData.threadContext?.existingComments;
    if (!comments || comments.length === 0) return null;
    
    return comments.map((c, i) => 
      `${i + 1}. ${c.authorName}: "${truncate(c.content, 100)}"`
    ).join('\n\n');
  };

  const getAuthorFullValue = () => {
    if (!postData) return null;
    const parts = [];
    if (postData.authorName) parts.push(`Name: ${postData.authorName}`);
    if (postData.authorHeadline) parts.push(`Headline: ${postData.authorHeadline}`);
    return parts.length > 0 ? parts.join('\n') : null;
  };

  const getImageStatus = (): 'success' | 'warning' | 'scanning' => {
    if (isScanning) return 'scanning';
    return postData?.imageUrl ? 'success' : 'warning';
  };

  const getImageValue = () => {
    if (!postData) return null;
    if (postData.imageUrl) {
      return 'Image detected & ready for analysis';
    }
    return 'No image in post';
  };

  return (
    <div className="context-awareness">
      <div className="context-header">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4M12 8h.01" />
        </svg>
        <span>Context Analysis</span>
        {isScanning && <span className="scanning-badge">Scanning</span>}
      </div>

      <div className="context-timeline">
        <ContextItem
          icon={
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
          }
          label="Post Content"
          value={postData ? truncate(postData.postContent, 50) : null}
          fullValue={postData?.postContent || null}
          status={getPostStatus()}
          subLabel="Unable to scrape post content"
        />

        <ContextItem
          icon={
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          }
          label="Author"
          value={
            postData?.authorName 
              ? `${postData.authorName}${postData.authorHeadline ? ` • ${truncate(postData.authorHeadline, 30)}` : ''}`
              : null
          }
          fullValue={getAuthorFullValue()}
          status={getAuthorStatus()}
          subLabel="Author info not found"
        />

        <ContextItem
          icon={
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 17 4 12 9 7" />
              <path d="M20 18v-2a4 4 0 0 0-4-4H4" />
            </svg>
          }
          label={getThreadModeLabel() || 'Thread Mode'}
          value={getThreadModeValue()}
          fullValue={getThreadModeFullValue()}
          status={getThreadStatus()}
        />

        <ContextItem
          icon={
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          }
          label="Discussion Context"
          value={getDiscussionValue()}
          fullValue={getDiscussionFullValue()}
          status={getDiscussionStatus()}
        />

        {/* Image Analysis with Toggle */}
        <div className={`context-item ${getImageStatus()}`}>
          <div className="context-item-line" />
          <div className="context-item-icon">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
          <div className="context-item-content">
            <div className="context-item-header">
              <span className="context-item-label">Image Analysis</span>
              {getImageStatus() === 'scanning' ? (
                <div className="context-status scanning">
                  <div className="scan-spinner" />
                </div>
              ) : getImageStatus() === 'success' ? (
                <div className="context-status success">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              ) : (
                <div className="context-status warning">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M12 9v4M12 17h.01" />
                  </svg>
                </div>
              )}
              {/* Toggle for Image Analysis - only show if image detected */}
              {postData?.imageUrl && onAnalyzeImageChange && (
                <label className="image-analysis-toggle" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={analyzeImage ?? false}
                    onChange={(e) => onAnalyzeImageChange(e.target.checked)}
                  />
                  <span className={`mini-toggle ${analyzeImage ? 'active' : ''}`} />
                </label>
              )}
            </div>
            {getImageStatus() === 'scanning' ? (
              <div className="context-item-value scanning">Scanning...</div>
            ) : postData?.imageUrl ? (
              <div className="context-item-value">
                {analyzeImage ? 'Will analyze image' : 'Image skipped (click toggle)'}
              </div>
            ) : (
              <div className="context-item-value warning">No image in post</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
