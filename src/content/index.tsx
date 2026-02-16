import React from 'react';
import ReactDOM from 'react-dom/client';
import { FloatingPanel } from './components/FloatingPanel';
import { MessagingPanel } from './components/MessagingPanel';
import { PostAssistantPanel } from './components/PostAssistantPanel';
import { createAIButton } from './components/AIButton';
import { 
  scrapePostData, 
  getPostContainers, 
  getSocialActionBar, 
  findActiveCommentBox,
  injectTextIntoCommentBox,
  createPostDataFromSelection,
  findPostModal,
  findPostEditor,
  findPostToolbar,
  injectTextIntoPostEditor,
} from './utils/linkedin-selectors';
import {
  isMessagingPage,
  scrapeConversationContext,
  findMessageFormContainer,
  injectTextIntoMessageInput,
} from './utils/messaging-scraper';
import type { PostData, EnrichedPostData, ConversationContext } from '../types';

// CSS for content script (injected inline to avoid LinkedIn conflicts)
const contentStyles = `
  .lai-ai-button {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: linear-gradient(135deg, #0a66c2 0%, #0077b5 100%);
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 8px rgba(10, 102, 194, 0.3);
    margin-left: 8px;
  }
  
  .lai-ai-button:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(10, 102, 194, 0.4);
  }
  
  .lai-ai-button:active {
    transform: scale(0.95);
  }
  
  .lai-ai-button svg {
    width: 18px;
    height: 18px;
    color: white;
  }

  .lai-ai-button::after {
    content: 'AI Comment';
    position: absolute;
    bottom: calc(100% + 8px);
    left: 50%;
    transform: translateX(-50%) scale(0.9);
    padding: 6px 10px;
    background: #1a1a2e;
    color: white;
    font-size: 12px;
    font-weight: 500;
    border-radius: 6px;
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    transition: all 0.2s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  .lai-ai-button::before {
    content: '';
    position: absolute;
    bottom: calc(100% + 2px);
    left: 50%;
    transform: translateX(-50%);
    border: 6px solid transparent;
    border-top-color: #1a1a2e;
    opacity: 0;
    pointer-events: none;
    transition: all 0.2s ease;
  }

  .lai-ai-button:hover::after,
  .lai-ai-button:hover::before {
    opacity: 1;
    transform: translateX(-50%) scale(1);
  }

  .lai-ai-button:hover::before {
    transform: translateX(-50%);
  }

  .lai-selection-btn {
    position: fixed;
    bottom: 20px;
    right: 20px;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    background: linear-gradient(135deg, #0a66c2 0%, #0077b5 100%);
    border: none;
    border-radius: 12px;
    color: white;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    box-shadow: 0 4px 20px rgba(10, 102, 194, 0.4);
    z-index: 999998;
    transition: all 0.2s ease;
  }

  .lai-selection-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 24px rgba(10, 102, 194, 0.5);
  }

  .lai-selection-btn svg {
    width: 18px;
    height: 18px;
  }

  /* Messaging AI Button */
  .lai-messaging-ai-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: linear-gradient(135deg, #0a66c2 0%, #0077b5 100%);
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 6px rgba(10, 102, 194, 0.25);
    margin: 0 4px;
    flex-shrink: 0;
    vertical-align: middle;
  }
  
  .lai-messaging-ai-button:hover {
    transform: scale(1.1);
    box-shadow: 0 3px 10px rgba(10, 102, 194, 0.4);
    background: linear-gradient(135deg, #004182 0%, #0066a2 100%);
  }
  
  .lai-messaging-ai-button:active {
    transform: scale(0.95);
  }
  
  .lai-messaging-ai-button svg {
    width: 16px;
    height: 16px;
    color: white;
  }

  /* Post Assistant Sparkle Button */
  .lai-post-sparkle-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 8px;
    background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 8px rgba(139, 92, 246, 0.3);
    margin: 0 4px;
    flex-shrink: 0;
  }
  
  .lai-post-sparkle-button:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
    background: linear-gradient(135deg, #7c3aed 0%, #9333ea 100%);
  }
  
  .lai-post-sparkle-button:active {
    transform: scale(0.95);
  }
  
  .lai-post-sparkle-button svg {
    width: 18px;
    height: 18px;
    color: white;
  }
`;

// State
let panelRoot: ReactDOM.Root | null = null;
let panelContainer: HTMLElement | null = null;
let selectionButton: HTMLElement | null = null;
let currentPostData: EnrichedPostData | null = null;
let currentConversationContext: ConversationContext | null = null;
let targetCommentBox: HTMLElement | null = null;
let isMessagingMode: boolean = false;
let isPostAssistantMode: boolean = false;

// Inject global styles
function injectStyles() {
  if (document.getElementById('lai-content-styles')) return;
  const style = document.createElement('style');
  style.id = 'lai-content-styles';
  style.textContent = contentStyles;
  document.head.appendChild(style);
}

// Create or get panel container
function getPanelContainer(): HTMLElement {
  if (panelContainer) return panelContainer;
  
  panelContainer = document.createElement('div');
  panelContainer.id = 'lai-panel-container';
  
  // Create shadow root for style isolation
  const shadow = panelContainer.attachShadow({ mode: 'open' });
  
  // Inject styles into shadow DOM
  const styleSheet = document.createElement('style');
  styleSheet.textContent = getPanelStyles();
  shadow.appendChild(styleSheet);
  
  // Create mount point
  const mountPoint = document.createElement('div');
  mountPoint.id = 'lai-panel-mount';
  shadow.appendChild(mountPoint);
  
  document.body.appendChild(panelContainer);
  return panelContainer;
}

// Render the panel with current state
function renderPanel(postData: EnrichedPostData | null, isScanning: boolean) {
  const container = getPanelContainer();
  const shadow = container.shadowRoot!;
  const mountPoint = shadow.getElementById('lai-panel-mount')!;
  
  if (!panelRoot) {
    panelRoot = ReactDOM.createRoot(mountPoint);
  }
  
  panelRoot.render(
    <React.StrictMode>
      <FloatingPanel
        postData={postData}
        isScanning={isScanning}
        onClose={closePanel}
        onInsertComment={insertComment}
      />
    </React.StrictMode>
  );
}

// Render the messaging panel
function renderMessagingPanel(conversationContext: ConversationContext | null, isScanning: boolean) {
  const container = getPanelContainer();
  const shadow = container.shadowRoot!;
  const mountPoint = shadow.getElementById('lai-panel-mount')!;
  
  if (!panelRoot) {
    panelRoot = ReactDOM.createRoot(mountPoint);
  }
  
  panelRoot.render(
    <React.StrictMode>
      <MessagingPanel
        conversationContext={conversationContext}
        isScanning={isScanning}
        onClose={closePanel}
        onInsertReply={insertReply}
      />
    </React.StrictMode>
  );
}

// Render the post assistant panel
function renderPostAssistantPanel() {
  const container = getPanelContainer();
  const shadow = container.shadowRoot!;
  const mountPoint = shadow.getElementById('lai-panel-mount')!;
  
  if (!panelRoot) {
    panelRoot = ReactDOM.createRoot(mountPoint);
  }
  
  panelRoot.render(
    <React.StrictMode>
      <PostAssistantPanel
        onClose={closePanel}
        onInsertPost={insertPost}
      />
    </React.StrictMode>
  );
}

// Insert reply into LinkedIn message input
function insertReply(reply: string) {
  const success = injectTextIntoMessageInput(reply);
  if (success) {
    closePanel();
  }
}

// Insert post into LinkedIn post editor
function insertPost(post: string) {
  const postEditor = findPostEditor();
  if (postEditor) {
    const success = injectTextIntoPostEditor(postEditor, post);
    if (success) {
      closePanel();
    }
  } else {
    // Fallback: copy to clipboard
    navigator.clipboard.writeText(post).then(() => {
      alert('Post copied to clipboard! Paste it into the post editor.');
      closePanel();
    }).catch(() => {
      console.error('[LinkedIn AI] Failed to copy to clipboard');
    });
  }
}

// Open the post assistant panel
function openPostAssistantPanel() {
  isPostAssistantMode = true;
  getPanelContainer();
  renderPostAssistantPanel();
}

// Open the messaging panel
function openMessagingPanel() {
  isMessagingMode = true;
  getPanelContainer();
  
  // Show panel in scanning state
  currentConversationContext = null;
  renderMessagingPanel(null, true);

  // Scrape conversation asynchronously
  (async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const context = await scrapeConversationContext();
    if (context) {
      currentConversationContext = context;
      renderMessagingPanel(context, false);
    } else {
      renderMessagingPanel(null, false);
    }
  })();
}

// Find the closest comment box to a post element
function findClosestCommentBox(postElement: Element): HTMLElement | null {
  // First, look for a comment box within the post element's context
  const SELECTORS = [
    '.comments-comment-box__form-container .ql-editor',
    '.comments-comment-texteditor .ql-editor',
    '[data-placeholder="Add a comment…"]',
    '[data-placeholder="Add a comment..."]',
    '.editor-content [contenteditable="true"]',
    '.ql-editor[contenteditable="true"]',
    '[role="textbox"][contenteditable="true"]',
  ];

  // Look within the post element first
  for (const selector of SELECTORS) {
    const boxes = postElement.querySelectorAll(selector);
    for (const box of boxes) {
      const rect = (box as HTMLElement).getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        return box as HTMLElement;
      }
    }
  }

  // If not found in post, look for the most recently visible/focused one near this post
  // Find all comment boxes on the page
  const allBoxes: { box: HTMLElement; distance: number }[] = [];
  const postRect = postElement.getBoundingClientRect();
  
  for (const selector of SELECTORS) {
    const boxes = document.querySelectorAll(selector);
    for (const box of boxes) {
      const rect = (box as HTMLElement).getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        // Calculate vertical distance from the post
        const distance = Math.abs(rect.top - postRect.top);
        allBoxes.push({ box: box as HTMLElement, distance });
      }
    }
  }

  // Sort by distance and return the closest one
  allBoxes.sort((a, b) => a.distance - b.distance);
  return allBoxes[0]?.box || null;
}

// Open the floating panel with scanning state
function openPanelWithScanning(clickedElement: Element, isReplyContext: boolean = false) {
  getPanelContainer();
  
  // First, show the panel in scanning state
  currentPostData = null;
  renderPanel(null, true);
  hideSelectionButton();

  // Scrape the data asynchronously (this now expands "see more" and waits)
  (async () => {
    // Wait a bit longer if reply context - to let the reply box appear
    const delay = isReplyContext ? 400 : 100;
    await new Promise(resolve => setTimeout(resolve, delay));
    
    // Find and save the target comment box AFTER any Reply button was clicked
    targetCommentBox = findClosestCommentBox(clickedElement);
    
    const postData = await scrapePostData(clickedElement);
    if (postData) {
      currentPostData = postData;
      renderPanel(postData, false);
    } else {
      // Show panel with null data (warning state)
      renderPanel(null, false);
      // Also show selection button as fallback
      showSelectionButton();
    }
  })();
}

// Open the floating panel directly (for manual selection)
function openPanel(postData: PostData) {
  getPanelContainer();
  
  // Convert to EnrichedPostData
  const enrichedData: EnrichedPostData = {
    ...postData,
    threadContext: (postData as EnrichedPostData).threadContext || {
      mode: 'post',
      existingComments: [],
      threadParticipants: [],
    },
  };
  
  currentPostData = enrichedData;
  renderPanel(enrichedData, false);
  hideSelectionButton();
}

// Close the panel
function closePanel() {
  if (panelRoot) {
    panelRoot.unmount();
    panelRoot = null;
  }
  currentPostData = null;
  currentConversationContext = null;
  targetCommentBox = null;
  isMessagingMode = false;
  isPostAssistantMode = false;
}

// Insert comment into LinkedIn comment box
function insertComment(comment: string) {
  // Use the target comment box that was saved when AI button was clicked
  // Fall back to finding any active comment box
  let commentBox = targetCommentBox;
  
  // Verify the saved comment box is still in the DOM and visible
  if (commentBox) {
    const rect = commentBox.getBoundingClientRect();
    if (!document.body.contains(commentBox) || (rect.width === 0 && rect.height === 0)) {
      commentBox = null;
    }
  }
  
  // Fallback: find any active comment box
  if (!commentBox) {
    commentBox = findActiveCommentBox();
  }
  
  if (commentBox) {
    const success = injectTextIntoCommentBox(commentBox, comment);
    
    if (success) {
      closePanel();
      return;
    }
  }
  
  // Fallback: copy to clipboard
  navigator.clipboard.writeText(comment).then(() => {
    alert('Comment copied to clipboard! Paste it into the comment box.');
    closePanel();
  }).catch(() => {
    console.error('[LinkedIn AI] Failed to copy to clipboard');
  });
}

// Handle AI button click
function handleAIButtonClick(buttonElement: Element, isReplyContext: boolean = false) {
  // Open panel with scanning state first
  openPanelWithScanning(buttonElement, isReplyContext);
}

// Show floating button for manual selection
function showSelectionButton() {
  if (selectionButton) return;
  
  selectionButton = document.createElement('button');
  selectionButton.className = 'lai-selection-btn';
  selectionButton.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M4 7V4h16v3"/>
      <path d="M9 20h6"/>
      <path d="M12 4v16"/>
    </svg>
    Analyze Selected Text
  `;
  
  selectionButton.addEventListener('click', () => {
    const postData = createPostDataFromSelection();
    if (postData) {
      openPanel(postData);
      hideSelectionButton();
    } else {
      alert('Please highlight some text from a LinkedIn post first.');
    }
  });
  
  document.body.appendChild(selectionButton);
}

function hideSelectionButton() {
  if (selectionButton) {
    selectionButton.remove();
    selectionButton = null;
  }
}

// Find LinkedIn post containers and inject buttons
function injectAIButtons() {
  const postContainers = getPostContainers();
  
  postContainers.forEach((post) => {
    const htmlPost = post as HTMLElement;
    
    // Skip if already processed
    if (htmlPost.dataset.laiProcessed) return;
    htmlPost.dataset.laiProcessed = 'true';
    
    // Find the social action bar for the MAIN post (not inside comments)
    const socialBar = getSocialActionBar(post);
    
    if (socialBar) {
      // Make sure this social bar is NOT inside a comment
      const isInsideComment = socialBar.closest('.comments-comment-item, .comments-comment-entity, [class*="comments-comment-item"], .comments-comments-list');
      if (isInsideComment) return; // Skip - will be handled by injectCommentButtons
      
      // Find parent container
      const parent = socialBar.closest('.feed-shared-social-action-bar') || 
                     socialBar.parentElement;
      
      // Check if button already exists in this parent
      if (parent && !parent.querySelector('.lai-ai-button')) {
        // Create button and pass the button element itself as context
        const button = createAIButton(() => {
          // When clicked, pass the button element so we can detect context
          handleAIButtonClick(button, false);
        });
        parent.appendChild(button);
      }
    }
    
    // Also inject buttons into COMMENT action bars
    injectCommentButtons(post);
  });
}

// Click the Reply button to open the reply input
function clickReplyButton(commentElement: Element): void {
  const replyButton = commentElement.querySelector(
    'button[aria-label*="Reply"], ' +
    'button[aria-label*="reply"], ' +
    '[class*="reply-action"], ' +
    '.comments-comment-social-bar__reply-action, ' +
    'span.comments-comment-social-bar__reply-action-text'
  )?.closest('button') || commentElement.querySelector('button:has(span:contains("Reply"))');
  
  if (replyButton) {
    (replyButton as HTMLElement).click();
    console.log('[LinkedIn AI] Clicked Reply button');
  } else {
    // Try finding by text content
    const buttons = commentElement.querySelectorAll('button, span[role="button"]');
    for (const btn of buttons) {
      if (btn.textContent?.toLowerCase().includes('reply')) {
        (btn as HTMLElement).click();
        console.log('[LinkedIn AI] Clicked Reply button (by text)');
        return;
      }
    }
  }
}

// Inject AI buttons into comment action bars
function injectCommentButtons(postContainer: Element) {
  // Find all comments in this post (multiple selector patterns for feed and detail views)
  const commentSelectors = [
    '.comments-comment-item',
    '.comments-comment-entity', 
    'article[class*="comments-comment"]',
    '[data-urn*="comment"]',
    '.feed-shared-update-v2__comments-container .comments-comment-item',
  ];
  
  const comments = postContainer.querySelectorAll(commentSelectors.join(', '));
  
  comments.forEach((comment) => {
    const htmlComment = comment as HTMLElement;
    
    // Skip if already processed
    if (htmlComment.dataset.laiCommentProcessed) return;
    htmlComment.dataset.laiCommentProcessed = 'true';
    
    // Find the comment's action bar (where Like/Reply buttons are) - multiple selectors
    const actionBarSelectors = [
      '.comments-comment-social-bar',
      '[class*="comment-social-bar"]',
      '.comments-comment-item__action-bar',
      '.social-actions-button',
    ];
    
    let commentActionBar: Element | null = null;
    for (const selector of actionBarSelectors) {
      commentActionBar = comment.querySelector(selector);
      if (commentActionBar) break;
    }
    
    // Fallback: find the area with Like/Reply buttons
    if (!commentActionBar) {
      const likeButton = comment.querySelector('button[aria-label*="Like"], button[aria-label*="like"]');
      const replyButton = comment.querySelector('button[aria-label*="Reply"], button[aria-label*="reply"]');
      commentActionBar = likeButton?.parentElement || replyButton?.parentElement;
    }
    
    if (commentActionBar) {
      // Check if button already exists in this specific action bar
      if (!commentActionBar.querySelector('.lai-ai-button')) {
        // Create button that knows it's in a comment context
        const button = createAIButton(() => {
          // First, click Reply to open the reply input
          clickReplyButton(comment);
          // Small delay to let the reply box appear
          setTimeout(() => {
            handleAIButtonClick(button, true);
          }, 300);
        });
        // Style it slightly smaller for comments
        button.style.width = '28px';
        button.style.height = '28px';
        button.style.marginLeft = '4px';
        commentActionBar.appendChild(button);
      }
    }
  });
}

// Inject buttons into newly loaded comments (called by observer)
function injectButtonsIntoNewComments() {
  // Find all posts in the feed
  const posts = document.querySelectorAll('.feed-shared-update-v2, .occludable-update, [data-urn*="activity"]');
  posts.forEach((post) => {
    injectCommentButtons(post);
  });
}

// Create Sparkle button for post assistant (using standard AI icon)
function createSparkleButton(): HTMLButtonElement {
  const button = document.createElement('button');
  button.className = 'lai-post-sparkle-button';
  button.setAttribute('aria-label', 'AI Post Assistant');
  button.title = 'AI Post Assistant';
  button.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/>
      <circle cx="7.5" cy="14.5" r="1.5"/>
      <circle cx="16.5" cy="14.5" r="1.5"/>
    </svg>
  `;
  
  button.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    openPostAssistantPanel();
  });
  
  return button;
}

// Inject Sparkle button into post creation modal
function injectPostAssistantButton() {
  // First, try to find modal
  const modal = findPostModal();
  
  // Also check if button already exists anywhere on page
  if (document.querySelector('.lai-post-sparkle-button')) {
    return;
  }

  // Try to find toolbar - first in modal, then in document
  let toolbar = findPostToolbar();
  
  // If no toolbar found in modal, try searching in document
  if (!toolbar) {
    const toolbarSelectors = [
      '.share-box__toolbar',
      '.share-box-feed-entry__toolbar',
      '.share-box__footer',
      '.share-creation-state__toolbar',
      '.share-box__actions',
      '.share-box-feed-entry__actions',
      '.artdeco-modal__actionbar',
      '[class*="share-box"][class*="toolbar"]',
      '[class*="share-box"][class*="footer"]',
      '[class*="share-box"][class*="actions"]',
    ];

    for (const selector of toolbarSelectors) {
      const container = document.querySelector(selector);
      if (container) {
        const rect = (container as HTMLElement).getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          toolbar = container as HTMLElement;
          break;
        }
      }
    }
  }

  if (toolbar) {
    const button = createSparkleButton();
    toolbar.insertBefore(button, toolbar.firstChild);
    console.log('[LinkedIn AI] Post Assistant button injected into toolbar');
    return;
  }

  // Fallback: try to find editor and inject near it
  const editor = findPostEditor();
  if (editor && editor.parentElement) {
    // Try to find a container with buttons/icons near the editor
    let container = editor.parentElement;
    for (let i = 0; i < 3; i++) {
      if (container) {
        // Look for a div with buttons or icons
        const buttonContainer = container.querySelector('[class*="toolbar"], [class*="footer"], [class*="actions"], [class*="button"]');
        if (buttonContainer) {
          const button = createSparkleButton();
          buttonContainer.insertBefore(button, buttonContainer.firstChild);
          console.log('[LinkedIn AI] Post Assistant button injected near editor');
          return;
        }
        container = container.parentElement;
      }
    }
    
    // Last resort: insert after editor's parent
    if (editor.parentElement) {
      const button = createSparkleButton();
      editor.parentElement.insertBefore(button, editor.nextSibling);
      console.log('[LinkedIn AI] Post Assistant button injected after editor');
      return;
    }
  }

  // If modal exists but no toolbar found, try to inject at the end of modal
  if (modal) {
    const button = createSparkleButton();
    button.style.position = 'absolute';
    button.style.top = '10px';
    button.style.right = '10px';
    button.style.zIndex = '10000';
    modal.appendChild(button);
    console.log('[LinkedIn AI] Post Assistant button injected as absolute positioned');
  }
}

// Inject AI button into LinkedIn Messaging UI
function injectMessagingButton() {
  // Multiple selectors for different LinkedIn messaging UI versions
  const footerSelectors = [
    '.msg-form__footer',
    '.msg-form__left-actions',
    '.msg-form__content-container',
    '.msg-form',
  ];
  
  let footerContainer: Element | null = null;
  for (const selector of footerSelectors) {
    footerContainer = document.querySelector(selector);
    if (footerContainer) break;
  }
  
  if (!footerContainer) {
    console.log('[LinkedIn AI] Message form footer not found');
    return;
  }
  
  // Check if already injected anywhere on the page
  if (document.querySelector('.lai-messaging-ai-button')) return;
  
  // Create the AI button for messaging
  const button = document.createElement('button');
  button.className = 'lai-messaging-ai-button';
  button.type = 'button';
  button.title = 'AI Reply Assistant';
  button.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/>
    </svg>
  `;
  
  button.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    openMessagingPanel();
  });
  
  // Try to find the left actions area (where photo/attach icons are)
  const leftActions = document.querySelector('.msg-form__left-actions');
  if (leftActions) {
    // Insert as first child of left actions
    leftActions.insertBefore(button, leftActions.firstChild);
    console.log('[LinkedIn AI] Messaging AI button injected into left actions');
    return;
  }
  
  // Try to find the footer and insert there
  const footer = document.querySelector('.msg-form__footer');
  if (footer) {
    footer.insertBefore(button, footer.firstChild);
    console.log('[LinkedIn AI] Messaging AI button injected into footer');
    return;
  }
  
  // Fallback: find send button area and put before it
  const sendButton = document.querySelector('.msg-form__send-button, .msg-form__send-btn, button[type="submit"][class*="send"]');
  if (sendButton && sendButton.parentElement) {
    sendButton.parentElement.insertBefore(button, sendButton);
    console.log('[LinkedIn AI] Messaging AI button injected before send button');
    return;
  }
  
  console.log('[LinkedIn AI] Could not find suitable location for messaging button');
}


// Initialize
function init() {
  injectStyles();
  
  // Determine page type and inject appropriate buttons
  if (isMessagingPage()) {
    injectMessagingButton();
  } else {
    injectAIButtons();
  }

  // Always try to inject post assistant button (for post creation modal)
  injectPostAssistantButton();
  
  // More frequent check for post modal (it appears dynamically)
  let postModalCheckInterval: ReturnType<typeof setInterval> | null = null;
  const checkPostModal = () => {
    if (findPostModal() || findPostEditor()) {
      injectPostAssistantButton();
    }
  };
  
  // Check every 500ms for post modal
  postModalCheckInterval = setInterval(checkPostModal, 500);
  
  // Debounce function to prevent too many injections
  let injectTimeout: ReturnType<typeof setTimeout> | null = null;
  const debouncedInject = () => {
    if (injectTimeout) clearTimeout(injectTimeout);
    injectTimeout = setTimeout(() => {
      if (isMessagingPage()) {
        injectMessagingButton();
      } else {
        injectAIButtons();
        injectButtonsIntoNewComments();
      }
      // Always check for post modal
      injectPostAssistantButton();
    }, 300);
  };
  
  // Watch for new posts/comments being added (infinite scroll, comment expansion)
  const observer = new MutationObserver((mutations) => {
    let shouldInject = false;
    let shouldCheckPostModal = false;
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length > 0) {
        // Check if any added nodes contain comments or posts
        mutation.addedNodes.forEach((node) => {
          if (node instanceof Element) {
            if (node.matches?.('.comments-comment-item, .comments-comment-entity, [class*="comment"], .feed-shared-update-v2') ||
                node.querySelector?.('.comments-comment-item, .comments-comment-entity, [class*="comment"]')) {
              shouldInject = true;
            }
            // Check for post modal - more aggressive
            if (node.matches?.('.share-box-feed-entry__modal, .share-box__modal, [role="dialog"], .artdeco-modal, .share-box, [class*="share-box"], [class*="share-modal"]') ||
                node.querySelector?.('.share-box-feed-entry__modal, .share-box__modal, [role="dialog"][aria-label*="post"], .artdeco-modal, .share-box')) {
              shouldCheckPostModal = true;
            }
          }
        });
        // Also trigger for any DOM changes (comments loading, etc.)
        shouldInject = true;
      }
    });
    if (shouldInject) {
      debouncedInject();
    }
    if (shouldCheckPostModal) {
      // Immediate check for post modal
      setTimeout(() => injectPostAssistantButton(), 100);
      setTimeout(() => injectPostAssistantButton(), 500);
      setTimeout(() => injectPostAssistantButton(), 1000);
    }
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

// Wait for page to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Re-inject on navigation (LinkedIn is a SPA)
let lastUrl = location.href;
new MutationObserver(() => {
  if (location.href !== lastUrl) {
    lastUrl = location.href;
    setTimeout(() => {
      if (isMessagingPage()) {
        injectMessagingButton();
      } else {
        injectAIButtons();
      }
    }, 1000);
  }
}).observe(document, { subtree: true, childList: true });

// Panel styles
function getPanelStyles(): string {
  return `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    .panel {
      position: fixed;
      top: 80px;
      right: 20px;
      width: 400px;
      max-height: calc(100vh - 100px);
      background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
      border-radius: 16px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1);
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      color: #fff;
      z-index: 999999;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    
    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateX(30px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateX(0) scale(1);
      }
    }
    
    .panel-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(255, 255, 255, 0.02);
      cursor: move;
      flex-shrink: 0;
    }
    
    .panel-title {
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: 600;
      font-size: 14px;
    }
    
    .panel-icon {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      background: linear-gradient(135deg, #0a66c2 0%, #00a0dc 100%);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .panel-icon svg {
      width: 18px;
      height: 18px;
      color: white;
    }

    .panel-icon.messaging {
      background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
    }

    /* Messaging Context Styles */
    .messaging-context {
      padding: 12px 16px;
      background: rgba(124, 58, 237, 0.1);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .context-scanning {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #a78bfa;
      font-size: 13px;
    }

    .context-participant {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 4px;
    }

    .context-label {
      font-size: 11px;
      color: #9ca3af;
    }

    .context-value {
      font-size: 14px;
      font-weight: 600;
      color: #f3f4f6;
    }

    .context-headline {
      font-size: 12px;
      color: #9ca3af;
      margin-bottom: 8px;
    }

    .context-stats {
      display: flex;
      gap: 12px;
      margin-top: 8px;
    }

    .context-stats .stat {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 11px;
      color: #9ca3af;
    }

    .sentiment-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #6b7280;
    }

    .sentiment-dot.positive {
      background: #22c55e;
    }

    .sentiment-dot.neutral {
      background: #eab308;
    }

    .sentiment-dot.negotiating {
      background: #f97316;
    }

    .sentiment-dot.cold {
      background: #6b7280;
    }

    .ai-summary {
      margin-top: 10px;
      padding: 10px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 8px;
      border-left: 3px solid #a855f7;
    }

    .summary-topic {
      font-size: 12px;
      font-weight: 500;
      color: #e5e7eb;
      margin-bottom: 6px;
    }

    .summary-action {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      color: #a78bfa;
    }

    .context-empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      padding: 16px;
      color: #6b7280;
      font-size: 13px;
      text-align: center;
    }

    .context-empty svg {
      opacity: 0.5;
    }
    
    .close-btn {
      width: 28px;
      height: 28px;
      border-radius: 6px;
      border: none;
      background: rgba(255, 255, 255, 0.1);
      color: #9ca3af;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }
    
    .close-btn:hover {
      background: rgba(239, 68, 68, 0.2);
      color: #ef4444;
    }

    /* Tabs */
    .tabs {
      display: flex;
      padding: 0 12px;
      background: rgba(0, 0, 0, 0.2);
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      flex-shrink: 0;
    }

    .tab {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 12px 16px;
      border: none;
      background: transparent;
      color: #6b7280;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      border-bottom: 2px solid transparent;
      margin-bottom: -1px;
    }

    .tab:hover {
      color: #9ca3af;
    }

    .tab.active {
      color: #0a66c2;
      border-bottom-color: #0a66c2;
    }

    .tab svg {
      opacity: 0.7;
    }

    .tab.active svg {
      opacity: 1;
    }

    /* Reply Mode Indicator */
    .reply-mode-indicator {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 16px;
      background: linear-gradient(90deg, rgba(139, 92, 246, 0.15) 0%, rgba(139, 92, 246, 0.05) 100%);
      border-bottom: 1px solid rgba(139, 92, 246, 0.2);
      font-size: 12px;
      color: #a78bfa;
      font-weight: 500;
    }

    .reply-mode-indicator svg {
      flex-shrink: 0;
    }

    .reply-to-name {
      color: #c4b5fd;
      font-weight: 600;
      margin-left: 4px;
    }

    /* Context Awareness Section */
    .context-awareness {
      background: rgba(0, 0, 0, 0.25);
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      padding: 12px 16px;
    }

    .context-header {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #9ca3af;
      margin-bottom: 12px;
    }

    .context-header svg {
      color: #6b7280;
    }

    .scanning-badge {
      margin-left: auto;
      padding: 2px 8px;
      background: rgba(59, 130, 246, 0.2);
      border: 1px solid rgba(59, 130, 246, 0.3);
      border-radius: 10px;
      font-size: 9px;
      color: #60a5fa;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      animation: pulse 1.5s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    .context-timeline {
      display: flex;
      flex-direction: column;
      gap: 0;
      position: relative;
    }

    .context-item {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      padding: 8px 0;
      position: relative;
    }

    .context-item-line {
      position: absolute;
      left: 5px;
      top: 22px;
      bottom: -8px;
      width: 2px;
      background: rgba(255, 255, 255, 0.1);
    }

    .context-item:last-child .context-item-line {
      display: none;
    }

    .context-item-icon {
      width: 12px;
      height: 12px;
      margin-top: 2px;
      flex-shrink: 0;
      color: #6b7280;
      position: relative;
      z-index: 1;
    }

    .context-item.success .context-item-icon {
      color: #4ade80;
    }

    .context-item.warning .context-item-icon {
      color: #fbbf24;
    }

    .context-item.scanning .context-item-icon {
      color: #60a5fa;
    }

    .context-item-content {
      flex: 1;
      min-width: 0;
    }

    .context-item-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 2px;
    }

    .context-item-label {
      font-size: 11px;
      font-weight: 600;
      color: #e5e7eb;
    }

    .context-status {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .context-status.success {
      background: rgba(34, 197, 94, 0.2);
      color: #22c55e;
    }

    .context-status.warning {
      background: rgba(251, 191, 36, 0.2);
      color: #fbbf24;
    }

    .context-status.scanning {
      background: rgba(59, 130, 246, 0.2);
    }

    .scan-spinner {
      width: 8px;
      height: 8px;
      border: 1.5px solid rgba(96, 165, 250, 0.3);
      border-top-color: #60a5fa;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    /* Mini toggle for image analysis in context item */
    .image-analysis-toggle {
      display: flex;
      align-items: center;
      margin-left: auto;
      cursor: pointer;
    }

    .image-analysis-toggle input {
      display: none;
    }

    .mini-toggle {
      width: 28px;
      height: 16px;
      background: rgba(255, 255, 255, 0.15);
      border-radius: 8px;
      position: relative;
      transition: all 0.2s;
    }

    .mini-toggle::after {
      content: '';
      position: absolute;
      top: 2px;
      left: 2px;
      width: 12px;
      height: 12px;
      background: #fff;
      border-radius: 50%;
      transition: all 0.2s;
    }

    .mini-toggle.active {
      background: linear-gradient(135deg, #8b5cf6, #a855f7);
    }

    .mini-toggle.active::after {
      transform: translateX(12px);
    }

    .context-item-value {
      font-size: 11px;
      color: #9ca3af;
      line-height: 1.4;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .context-item-value.scanning {
      color: #60a5fa;
      font-style: italic;
    }

    .context-item-value.warning {
      color: #fbbf24;
      font-size: 10px;
    }

    /* Hover tooltip for context items */
    .context-item.has-tooltip {
      cursor: pointer;
    }

    .context-item.has-tooltip:hover {
      background: rgba(255, 255, 255, 0.03);
      border-radius: 6px;
      margin: -4px;
      padding: 4px;
    }

    .hover-hint {
      margin-left: 4px;
      opacity: 0.4;
      transition: opacity 0.2s;
    }

    .context-item:hover .hover-hint {
      opacity: 0.8;
    }

    .context-tooltip {
      position: absolute;
      left: 0;
      right: 0;
      top: 100%;
      margin-top: 4px;
      background: #1e1e2f;
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 10px;
      padding: 12px;
      z-index: 100;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
      animation: tooltipFadeIn 0.15s ease-out;
    }

    @keyframes tooltipFadeIn {
      from {
        opacity: 0;
        transform: translateY(-4px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .context-tooltip-header {
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #9ca3af;
      margin-bottom: 8px;
      padding-bottom: 8px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .context-tooltip-content {
      font-size: 12px;
      line-height: 1.6;
      color: #e5e7eb;
      max-height: 200px;
      overflow-y: auto;
      white-space: pre-wrap;
      word-break: break-word;
    }

    .context-tooltip-content::-webkit-scrollbar {
      width: 4px;
    }

    .context-tooltip-content::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 2px;
    }

    .context-tooltip-content::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 2px;
    }
    
    .panel-content {
      padding: 20px;
      overflow-y: auto;
      flex: 1;
    }
    
    .section {
      margin-bottom: 20px;
    }
    
    .section-label {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #9ca3af;
      margin-bottom: 8px;
    }
    
    .post-preview {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 10px;
      padding: 12px;
      font-size: 13px;
      line-height: 1.5;
      color: #d1d5db;
      max-height: 100px;
      overflow-y: auto;
    }
    
    .post-preview h1 {
      font-size: 18px;
      font-weight: 700;
      color: #fff;
      margin: 12px 0 8px 0;
    }
    
    .post-preview h2 {
      font-size: 16px;
      font-weight: 600;
      color: #fff;
      margin: 10px 0 6px 0;
    }
    
    .post-preview h3 {
      font-size: 14px;
      font-weight: 600;
      color: #e5e7eb;
      margin: 8px 0 4px 0;
    }
    
    .post-preview p {
      margin: 8px 0;
      line-height: 1.6;
    }
    
    .post-preview strong {
      font-weight: 600;
      color: #fff;
    }
    
    .post-preview em {
      font-style: italic;
      color: #d1d5db;
    }
    
    .post-preview br {
      line-height: 1.6;
    }
    
    .author-info {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      color: #9ca3af;
      margin-bottom: 8px;
    }
    
    .author-name {
      color: #fff;
      font-weight: 500;
    }
    
    /* Your Thoughts Input */
    .thoughts-input-wrapper {
      position: relative;
    }

    .thoughts-input {
      width: 100%;
      padding: 10px 32px 10px 12px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 10px;
      color: #fff;
      font-size: 13px;
      font-family: inherit;
      line-height: 1.5;
      resize: none;
      transition: all 0.2s;
      min-height: 60px;
      max-height: 120px;
    }

    .thoughts-input::placeholder {
      color: #6b7280;
      font-size: 12px;
    }

    .thoughts-input:hover {
      border-color: rgba(255, 255, 255, 0.2);
    }

    .thoughts-input:focus {
      outline: none;
      border-color: #0a66c2;
      box-shadow: 0 0 0 3px rgba(10, 102, 194, 0.2);
    }

    .clear-thoughts-btn {
      position: absolute;
      top: 8px;
      right: 8px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: none;
      background: rgba(255, 255, 255, 0.1);
      color: #9ca3af;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }

    .clear-thoughts-btn:hover {
      background: rgba(239, 68, 68, 0.2);
      color: #ef4444;
    }

    .optional-label {
      font-weight: 400;
      color: #6b7280;
      font-size: 10px;
    }

    /* Service Offer Toggle */
    .service-offer-toggle {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 12px;
      background: linear-gradient(135deg, rgba(245, 158, 11, 0.05), rgba(234, 88, 12, 0.05));
      border: 1px solid rgba(245, 158, 11, 0.2);
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.2s;
      position: relative;
    }

    .service-offer-toggle:not(.disabled):hover {
      background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(234, 88, 12, 0.1));
      border-color: rgba(245, 158, 11, 0.3);
    }

    .service-offer-toggle.disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .toggle-left {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .toggle-icon {
      width: 28px;
      height: 28px;
      border-radius: 8px;
      background: rgba(245, 158, 11, 0.15);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #f59e0b;
    }

    .toggle-text {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .toggle-label {
      font-size: 12px;
      font-weight: 500;
      color: #fff;
    }

    .toggle-hint {
      font-size: 10px;
      color: #9ca3af;
    }

    .toggle-hint.warning {
      color: #f59e0b;
    }

    .toggle-checkbox {
      position: absolute;
      opacity: 0;
      pointer-events: none;
    }

    .toggle-switch {
      width: 36px;
      height: 20px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 10px;
      position: relative;
      transition: all 0.2s;
      flex-shrink: 0;
    }

    .toggle-switch::after {
      content: '';
      position: absolute;
      top: 2px;
      left: 2px;
      width: 16px;
      height: 16px;
      background: #fff;
      border-radius: 50%;
      transition: all 0.2s;
    }

    .toggle-switch.active {
      background: linear-gradient(135deg, #f59e0b, #ea580c);
    }

    .toggle-switch.active::after {
      transform: translateX(16px);
    }

    /* Image Toggle */
    .image-toggle {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 12px;
      background: linear-gradient(135deg, rgba(139, 92, 246, 0.05), rgba(168, 85, 247, 0.05));
      border: 1px solid rgba(139, 92, 246, 0.2);
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.2s;
      position: relative;
    }

    .image-toggle:hover {
      background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(168, 85, 247, 0.1));
      border-color: rgba(139, 92, 246, 0.3);
    }

    .toggle-icon.image {
      background: rgba(139, 92, 246, 0.15);
      color: #a855f7;
    }

    .toggle-switch.image.active {
      background: linear-gradient(135deg, #8b5cf6, #a855f7);
    }

    .tone-select {
      width: 100%;
      padding: 10px 14px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 10px;
      color: #fff;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s;
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 12px center;
    }
    
    .tone-select:hover {
      border-color: rgba(255, 255, 255, 0.2);
    }
    
    .tone-select:focus {
      outline: none;
      border-color: #0a66c2;
      box-shadow: 0 0 0 3px rgba(10, 102, 194, 0.2);
    }
    
    .tone-select option {
      background: #1a1a2e;
      color: #fff;
    }
    
    .generate-btn {
      width: 100%;
      padding: 12px 20px;
      background: linear-gradient(135deg, #0a66c2 0%, #0077b5 100%);
      border: none;
      border-radius: 10px;
      color: #fff;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: all 0.2s;
    }
    
    .generate-btn:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(10, 102, 194, 0.4);
    }
    
    .generate-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    .spinner {
      width: 18px;
      height: 18px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    .spinner-small {
      width: 12px;
      height: 12px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* Shimmer Loading */
    .shimmer-container {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .shimmer-card {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 10px;
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .shimmer-line {
      height: 12px;
      border-radius: 6px;
      background: linear-gradient(
        90deg,
        rgba(255, 255, 255, 0.05) 0%,
        rgba(255, 255, 255, 0.1) 50%,
        rgba(255, 255, 255, 0.05) 100%
      );
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
    }

    .shimmer-line.long { width: 100%; }
    .shimmer-line.medium { width: 75%; }
    .shimmer-line.short { width: 50%; }

    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
    
    .results {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    
    .comment-card {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 10px;
      padding: 14px;
      transition: all 0.2s;
    }

    .comment-card.refining {
      opacity: 0.6;
    }
    
    .comment-card:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(255, 255, 255, 0.15);
    }
    
    .comment-text {
      font-size: 13px;
      line-height: 1.6;
      color: #e5e7eb;
      margin-bottom: 12px;
    }
    
    .comment-actions {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .action-group {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .action-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      padding: 6px 10px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 6px;
      background: rgba(255, 255, 255, 0.05);
      color: #9ca3af;
      font-size: 11px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .action-btn:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
    }

    .action-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .action-btn.copied {
      background: rgba(34, 197, 94, 0.2);
      border-color: rgba(34, 197, 94, 0.3);
      color: #22c55e;
    }

    .action-btn.refine-btn {
      padding: 5px 8px;
      font-size: 10px;
      gap: 4px;
    }

    .action-btn.refine-btn span {
      font-weight: 500;
    }

    .insert-btn {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 6px 12px;
      background: linear-gradient(135deg, #0a66c2 0%, #0077b5 100%);
      border: none;
      border-radius: 6px;
      color: #fff;
      font-size: 11px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .insert-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(10, 102, 194, 0.4);
    }
    
    /* Recommendation Tag */
    .recommendation-tag {
      display: inline-block;
      font-size: 10px;
      font-weight: 600;
      color: #93c5fd;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 8px;
      padding: 3px 8px;
      background: rgba(59, 130, 246, 0.15);
      border-radius: 4px;
    }
    
    .error-message {
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.3);
      border-radius: 10px;
      padding: 12px;
      color: #fca5a5;
      font-size: 13px;
      display: flex;
      align-items: flex-start;
      gap: 10px;
    }
    
    .error-icon {
      flex-shrink: 0;
      color: #ef4444;
    }
    
    .no-api-key {
      text-align: center;
      padding: 20px;
    }
    
    .no-api-key-icon {
      width: 48px;
      height: 48px;
      margin: 0 auto 16px;
      border-radius: 12px;
      background: rgba(251, 191, 36, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fbbf24;
    }
    
    .no-api-key h3 {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 8px;
    }
    
    .no-api-key p {
      font-size: 13px;
      color: #9ca3af;
      margin-bottom: 16px;
    }
    
    .settings-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 10px 16px;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      color: #fff;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .settings-btn:hover {
      background: rgba(255, 255, 255, 0.15);
    }

    /* History Tab */
    .history-section {
      min-height: 200px;
    }

    .empty-history {
      text-align: center;
      padding: 40px 20px;
      color: #6b7280;
    }

    .empty-history svg {
      margin-bottom: 16px;
      opacity: 0.5;
    }

    .empty-history p {
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 4px;
      color: #9ca3af;
    }

    .empty-history span {
      font-size: 12px;
    }

    .history-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
    }

    .history-count {
      font-size: 11px;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .clear-history-btn {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 4px 8px;
      background: transparent;
      border: 1px solid rgba(239, 68, 68, 0.3);
      border-radius: 4px;
      color: #ef4444;
      font-size: 11px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .clear-history-btn:hover {
      background: rgba(239, 68, 68, 0.1);
    }

    .history-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .history-item {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 10px;
      padding: 12px;
    }

    .history-meta {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
      font-size: 11px;
      color: #6b7280;
    }

    .history-time {
      color: #9ca3af;
      font-weight: 500;
    }

    .history-post {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .history-comment {
      font-size: 13px;
      line-height: 1.5;
      color: #d1d5db;
      margin-bottom: 10px;
    }

    .history-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .panel-footer {
      padding: 12px 20px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      background: rgba(0, 0, 0, 0.2);
      font-size: 11px;
      color: #6b7280;
      text-align: center;
      line-height: 1.5;
      flex-shrink: 0;
    }
    
    .panel-footer .sponsor-link {
      color: #9ca3af;
      font-weight: 600;
      text-decoration: none;
      transition: color 0.2s;
    }
    
    .panel-footer .sponsor-link:hover {
      color: #0a66c2;
      text-decoration: underline;
    }
    
    .panel-footer .footer-divider {
      margin: 0 8px;
      color: #4b5563;
    }
    
    .panel-footer .support-link {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      color: #ef4444;
      font-weight: 500;
      text-decoration: none;
      transition: all 0.2s;
      margin-left: 4px;
    }
    
    .panel-footer .support-link svg {
      width: 14px;
      height: 14px;
      fill: #ef4444;
      stroke: #ef4444;
    }
    
    .panel-footer .support-link:hover {
      color: #f87171;
      text-decoration: underline;
    }
    
    .panel-footer .support-link:hover svg {
      fill: #f87171;
      stroke: #f87171;
      transform: scale(1.1);
    }
  `;
}
