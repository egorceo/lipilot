/**
 * LinkedIn DOM Selectors Utility
 * Handles the complexity of LinkedIn's ever-changing DOM structure
 */

import type { PostData, CommentData, ThreadContext, EnrichedPostData } from '../../types';

// Selector configurations with fallbacks
const SELECTORS = {
  // Post containers
  postContainer: [
    '.feed-shared-update-v2',
    '.occludable-update',
    '[data-urn*="activity"]',
    '[data-urn*="ugcPost"]',
    '.scaffold-finite-scroll__content > div',
  ],

  // Post content
  postContent: [
    '[class*="update-components-text"]',
    '.feed-shared-update-v2__description',
    '.feed-shared-text',
    '.feed-shared-inline-show-more-text',
    '.break-words',
    '[data-test-id="main-feed-activity-card__commentary"]',
  ],

  // Post images
  postImage: [
    '.update-components-image__image',
    '.feed-shared-image__image',
    '.ivm-view-attr__img--centered',
    '.feed-shared-update-v2__content img',
    '[class*="update-components-image"] img',
    '.feed-shared-article__image',
    '.feed-shared-external-video__thumbnail',
    'img[data-delayed-url]',
    '.feed-shared-mini-update-v2 img',
  ],

  // Author name
  authorName: [
    '[class*="update-components-actor__name"]',
    '.feed-shared-actor__name',
    '.feed-shared-actor__title',
    '[data-control-name="actor"] .visually-hidden',
    '.update-components-actor__meta-link',
    'a[class*="actor-name"]',
  ],

  // Author headline/description
  authorHeadline: [
    '[class*="update-components-actor__description"]',
    '.feed-shared-actor__description',
    '.feed-shared-actor__sub-description',
    '.update-components-actor__sublabel',
    '[class*="actor-description"]',
  ],

  // See more buttons
  seeMoreButton: [
    '.feed-shared-inline-show-more-text__see-more-less-toggle',
    '.see-more',
    '[data-control-name="see_more"]',
    'button[aria-label*="see more"]',
    'button[aria-label*="Show more"]',
    '.feed-shared-text__text-view--show-more',
  ],

  // Comment input boxes
  commentBox: [
    '.comments-comment-box__form-container .ql-editor',
    '.comments-comment-texteditor .ql-editor',
    '[data-placeholder="Add a comment…"]',
    '[data-placeholder="Add a comment..."]',
    '.editor-content [contenteditable="true"]',
    '.ql-editor[contenteditable="true"]',
    '[role="textbox"][contenteditable="true"]',
  ],

  // Post creation modal
  postModal: [
    '.share-box-feed-entry__modal',
    '.share-box__modal',
    '[role="dialog"][aria-label*="Start a post"]',
    '[role="dialog"][aria-label*="Create a post"]',
    '[role="dialog"][aria-label*="start a post"]',
    '[role="dialog"][aria-label*="create a post"]',
    '.artdeco-modal',
    '.share-box',
    '.share-box-feed-entry',
    '[data-test-modal*="share"]',
    '[class*="share-box"]',
    '[class*="share-modal"]',
  ],

  // Post editor in modal
  postEditor: [
    '.ql-editor[contenteditable="true"]',
    '.share-box__editor [contenteditable="true"]',
    '.share-box-feed-entry__editor [contenteditable="true"]',
    '[data-placeholder*="What do you want to talk about"]',
    '[data-placeholder*="What do you want to talk about?"]',
    '[role="textbox"][contenteditable="true"]',
    '.ql-container .ql-editor',
  ],

  // Post modal toolbar
  postToolbar: [
    '.share-box__toolbar',
    '.share-box-feed-entry__toolbar',
    '.share-box__footer',
    '.share-creation-state__toolbar',
    '.share-box__actions',
    '.share-box-feed-entry__actions',
    '[class*="share-box"][class*="toolbar"]',
    '[class*="share-box"][class*="footer"]',
    '[class*="share-box"][class*="actions"]',
    '.artdeco-modal__actionbar',
    '[class*="modal"][class*="toolbar"]',
    '[class*="modal"][class*="footer"]',
  ],

  // Social action bar (for button injection)
  socialActionBar: [
    '.social-actions-button',
    '.feed-shared-social-action-bar',
    '.social-details-social-activity',
    '[class*="social-actions"]',
    '.feed-shared-social-action-bar__action-button',
  ],

  // Comments section (the actual list of comments, not the counts)
  commentsSection: [
    '.comments-comments-list',
    '.comments-comment-list',
    '[class*="comments-comments-list"]',
  ],

  // Individual comment items (must contain actual comment content)
  commentItem: [
    '.comments-comment-item',
    '.comments-comment-entity',
    'article[class*="comments-comment-item"]',
  ],

  // Comment content/text
  commentContent: [
    '.comments-comment-item__main-content',
    '[class*="comment-item__main-content"]',
    '.comments-comment-item-content-body',
    '.update-components-text',
    '.feed-shared-inline-show-more-text',
  ],

  // Comment author name
  commentAuthorName: [
    '.comments-post-meta__name-text',
    '.comments-post-meta__name',
    '.comments-comment-item__post-meta .comments-post-meta__name',
    '[class*="comments-post-meta__name"]',
    '.comment-actor-name',
    // New LinkedIn selectors
    '.comments-comment-item-content-body a[class*="hoverable-link"]',
    '.comments-comment-item a.app-aware-link span[dir="ltr"]',
    'a.app-aware-link .visually-hidden',
    '.feed-shared-inline-show-more-text a.app-aware-link',
    '[data-test-app-aware-link]',
  ],

  // Comment author headline
  commentAuthorHeadline: [
    '.comments-post-meta__headline',
    '[class*="comments-post-meta__headline"]',
    '.comments-comment-item__post-meta .comments-post-meta__headline',
    // New selectors
    '.comments-post-meta__subtitle',
    '[class*="post-meta__subtitle"]',
  ],

  // Reply thread container (nested comments)
  replyThread: [
    '.comments-comment-item__replies-list',
    '.comments-replies-list',
    '[class*="replies-list"]',
  ],

  // Reply button (to detect if in reply mode)
  replyButton: [
    '.comments-comment-social-bar__reply-action',
    '[class*="reply-action"]',
    'button[aria-label*="Reply"]',
  ],
} as const;

/**
 * Query element using multiple selectors with fallback
 */
function queryWithFallback(
  parent: Element | Document,
  selectors: readonly string[]
): Element | null {
  for (const selector of selectors) {
    try {
      const element = parent.querySelector(selector);
      if (element) return element;
    } catch (e) {
      // Invalid selector, skip
      console.warn(`[LinkedIn AI] Invalid selector: ${selector}`);
    }
  }
  return null;
}

/**
 * Query all elements using multiple selectors
 */
function queryAllWithFallback(
  parent: Element | Document,
  selectors: readonly string[]
): Element[] {
  const results: Element[] = [];
  const seen = new Set<Element>();

  for (const selector of selectors) {
    try {
      const elements = parent.querySelectorAll(selector);
      elements.forEach((el) => {
        if (!seen.has(el)) {
          seen.add(el);
          results.push(el);
        }
      });
    } catch (e) {
      // Invalid selector, skip
    }
  }

  return results;
}

/**
 * Expand "see more" button to reveal full content
 * Returns true if a button was clicked (content will expand)
 */
export function expandSeeMore(postElement: Element): boolean {
  const buttons = queryAllWithFallback(postElement, SELECTORS.seeMoreButton);
  let clicked = false;
  
  buttons.forEach((button) => {
    const text = button.textContent?.toLowerCase() || '';
    if (
      text.includes('see more') ||
      text.includes('show more') ||
      text.includes('...more') ||
      text.includes('more') ||
      text.includes('voir plus') ||
      text.includes('mehr anzeigen') ||
      text.includes('ещё') ||
      text.includes('больше')
    ) {
      (button as HTMLElement).click();
      clicked = true;
    }
  });
  
  return clicked;
}

/**
 * Expand "see more" and wait for content to load
 */
export async function expandSeeMoreAndWait(postElement: Element): Promise<void> {
  const clicked = expandSeeMore(postElement);
  
  if (clicked) {
    // Wait for LinkedIn to expand the content
    await new Promise(resolve => setTimeout(resolve, 300));
  }
}

/**
 * Extract author name from post element
 */
export function extractAuthorName(postElement: Element): string {
  const nameElement = queryWithFallback(postElement, SELECTORS.authorName);
  
  if (nameElement) {
    let text = nameElement.textContent?.trim() || '';
    // Clean up name (remove "View profile" and similar)
    text = text.split('\n')[0]
      .replace(/View.*profile/gi, '')
      .replace(/•.*$/g, '')
      .trim();
    
    if (text) return text;
  }
  
  return 'Unknown Author';
}

/**
 * Extract author headline from post element
 */
export function extractAuthorHeadline(postElement: Element): string {
  const headlineElement = queryWithFallback(postElement, SELECTORS.authorHeadline);
  
  if (headlineElement) {
    let text = headlineElement.textContent?.trim() || '';
    // Clean up - remove follower counts and timestamps
    text = text.split('•')[0].trim();
    text = text.replace(/\d+\s*(followers?|connections?)/gi, '').trim();
    
    if (text) return text;
  }
  
  return '';
}

/**
 * Extract post content from post element (sync version - may get truncated text)
 */
export function extractPostContentSync(postElement: Element): string {
  const contentElement = queryWithFallback(postElement, SELECTORS.postContent);
  
  if (contentElement) {
    let text = contentElement.textContent?.trim() || '';
    
    // Clean up "see less" or "see more" text
    text = text.replace(/…?see (more|less)/gi, '').trim();
    text = text.replace(/…?voir (plus|moins)/gi, '').trim();
    text = text.replace(/…?mehr (anzeigen|ausblenden)/gi, '').trim();
    text = text.replace(/…?ещё/gi, '').trim();
    text = text.replace(/…?больше/gi, '').trim();
    
    if (text.length > 10) return text;
  }
  
  return '';
}

/**
 * Extract post content from post element (async - expands "see more" first)
 */
export async function extractPostContent(postElement: Element): Promise<string> {
  // First, try to expand "see more"
  await expandSeeMoreAndWait(postElement);
  
  return extractPostContentSync(postElement);
}

/**
 * Extract the main image URL from a post
 */
export function extractPostImage(postElement: Element): string | undefined {
  // Try each selector to find the main post image
  for (const selector of SELECTORS.postImage) {
    const images = postElement.querySelectorAll(selector);
    
    for (const img of images) {
      // Skip profile pictures and small icons
      const imgElement = img as HTMLImageElement;
      
      // Check if it's a real content image (not profile pic or icon)
      const isProfilePic = imgElement.closest('.feed-shared-actor, .comments-post-meta, [class*="actor"]');
      if (isProfilePic) continue;
      
      // Get the image URL
      let imageUrl = imgElement.src || imgElement.getAttribute('data-delayed-url') || imgElement.getAttribute('data-src');
      
      // Skip data URIs and small placeholder images
      if (!imageUrl || imageUrl.startsWith('data:')) continue;
      
      // Skip LinkedIn UI icons (usually contain specific patterns)
      if (imageUrl.includes('/icons/') || imageUrl.includes('ghost-organization') || imageUrl.includes('ghost-person')) {
        continue;
      }
      
      // Check image dimensions (if available) - skip small images
      const width = imgElement.naturalWidth || imgElement.width;
      const height = imgElement.naturalHeight || imgElement.height;
      if (width && height && (width < 100 || height < 100)) {
        continue;
      }
      
      // Found a valid image
      console.log('[LinkedIn AI] Found post image:', imageUrl.substring(0, 100) + '...');
      return imageUrl;
    }
  }
  
  // Also check for background images in divs (LinkedIn sometimes uses this)
  const mediaContainers = postElement.querySelectorAll('.update-components-image, .feed-shared-image, [class*="media-container"]');
  for (const container of mediaContainers) {
    const style = (container as HTMLElement).style;
    if (style.backgroundImage) {
      const match = style.backgroundImage.match(/url\(["']?([^"')]+)["']?\)/);
      if (match && match[1] && !match[1].startsWith('data:')) {
        console.log('[LinkedIn AI] Found background image:', match[1].substring(0, 100) + '...');
        return match[1];
      }
    }
  }
  
  return undefined;
}

/**
 * Get all post containers on the page
 */
export function getPostContainers(): Element[] {
  return queryAllWithFallback(document, SELECTORS.postContainer);
}

/**
 * Get social action bar for button injection
 */
export function getSocialActionBar(postElement: Element): Element | null {
  return queryWithFallback(postElement, SELECTORS.socialActionBar);
}

/**
 * Find the active comment box
 */
export function findActiveCommentBox(): HTMLElement | null {
  const boxes = queryAllWithFallback(document, SELECTORS.commentBox);
  
  // Find the most recently focused/visible comment box
  const visibleBox = boxes.find((box) => {
    const rect = (box as HTMLElement).getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  });
  
  return (visibleBox as HTMLElement) || null;
}

/**
 * Robust text injection into LinkedIn comment box
 */
export function injectTextIntoCommentBox(
  commentBox: HTMLElement,
  text: string
): boolean {
  try {
    // Find existing mentions to preserve them
    const existingMentions = commentBox.querySelectorAll(
      'a[data-attribute-index], ' +
      'span[data-mention], ' +
      '.mentions-container, ' +
      '[class*="mention"], ' +
      'a.ember-view[href*="/in/"]'
    );
    
    // Collect mention elements and their text
    const mentionsToPreserve: HTMLElement[] = [];
    existingMentions.forEach((mention) => {
      mentionsToPreserve.push(mention.cloneNode(true) as HTMLElement);
    });
    
    // Also check for simple text mentions (like "@Name ")
    const existingText = commentBox.textContent || '';
    const mentionMatch = existingText.match(/^(@[\w\s]+)\s*/);
    const textMention = mentionMatch ? mentionMatch[1] : null;
    
    // Clear existing content
    commentBox.innerHTML = '';
    
    // If we have preserved mention elements, add them back
    if (mentionsToPreserve.length > 0) {
      mentionsToPreserve.forEach((mention) => {
        commentBox.appendChild(mention);
        // Add space after mention
        commentBox.appendChild(document.createTextNode(' '));
      });
    } else if (textMention) {
      // Fallback: if we detected a text mention but no element, re-add it as text
      commentBox.appendChild(document.createTextNode(textMention + ' '));
    }
    
    // Add the new text in a paragraph
    const p = document.createElement('p');
    p.textContent = text;
    commentBox.appendChild(p);
    
    // Dispatch multiple events to ensure LinkedIn recognizes the input
    const inputEvent = new InputEvent('input', {
      bubbles: true,
      cancelable: true,
      inputType: 'insertText',
      data: text,
    });
    commentBox.dispatchEvent(inputEvent);
    
    // Also dispatch change event
    commentBox.dispatchEvent(new Event('change', { bubbles: true }));
    
    // Dispatch keyup event (some LinkedIn handlers listen for this)
    commentBox.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));
    
    // Focus the comment box
    commentBox.focus();
    
    // Move cursor to end
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(commentBox);
    range.collapse(false);
    selection?.removeAllRanges();
    selection?.addRange(range);
    
    return true;
  } catch (error) {
    console.error('[LinkedIn AI] Failed to inject text:', error);
    return false;
  }
}

/**
 * Extract author name from a comment element using multiple strategies
 */
function extractCommentAuthorName(commentElement: Element): string {
  // Strategy 1: Look for the comment header area with author info
  const headerSelectors = [
    '.comments-post-meta',
    '.comments-comment-item__post-meta',
    '[class*="comment-item__post-meta"]',
    '.feed-shared-actor',
  ];
  
  for (const selector of headerSelectors) {
    const header = commentElement.querySelector(selector);
    if (header) {
      // Look for the name link/span inside header
      const nameLink = header.querySelector('a[href*="/in/"] span[aria-hidden="true"], a[href*="/in/"] span[dir="ltr"]');
      if (nameLink) {
        const name = nameLink.textContent?.trim();
        if (name && name.length >= 2 && name.length < 100) {
          console.log('[LinkedIn AI] Found author name via header:', name);
          return name;
        }
      }
      
      // Try getting text from the link itself
      const link = header.querySelector('a[href*="/in/"]');
      if (link) {
        // Get all text spans
        const spans = link.querySelectorAll('span');
        for (const span of spans) {
          const name = span.textContent?.trim();
          // Skip if it contains common non-name text
          if (name && name.length >= 2 && name.length < 80 && 
              !name.includes('•') && !name.includes('1st') && !name.includes('2nd') && !name.includes('3rd') &&
              !name.includes('Author') && !name.includes('Promoted')) {
            console.log('[LinkedIn AI] Found author name via span:', name);
            return name;
          }
        }
      }
    }
  }
  
  // Strategy 2: Find first profile link with name
  const profileLinks = commentElement.querySelectorAll('a[href*="/in/"]');
  for (const link of profileLinks) {
    // Skip if this is inside the comment content (mentions)
    if (link.closest('.comments-comment-item__main-content, [class*="main-content"]')) {
      continue;
    }
    
    const hiddenSpan = link.querySelector('span[aria-hidden="true"]');
    if (hiddenSpan) {
      const name = hiddenSpan.textContent?.trim();
      if (name && name.length >= 2 && name.length < 100) {
        console.log('[LinkedIn AI] Found author via aria-hidden:', name);
        return name;
      }
    }
    
    // Fallback to link text
    const text = link.textContent?.trim()?.split('\n')[0]?.trim();
    if (text && text.length >= 2 && text.length < 80 && !text.includes('•')) {
      console.log('[LinkedIn AI] Found author via link text:', text);
      return text;
    }
  }
  
  // Strategy 3: Try standard selectors as last resort
  const nameElement = queryWithFallback(commentElement, SELECTORS.commentAuthorName);
  if (nameElement) {
    let name = nameElement.textContent?.trim() || '';
    name = name.split('\n')[0].trim();
    if (name.length >= 2 && name.length < 100) {
      console.log('[LinkedIn AI] Found author via standard selector:', name);
      return name;
    }
  }
  
  console.log('[LinkedIn AI] Could not find author name for comment');
  return 'Unknown';
}

/**
 * Extract a single comment's data from a comment element
 */
function extractCommentData(commentElement: Element): CommentData | null {
  try {
    // First, verify this element looks like an actual comment
    // It should have visible text content
    const elementText = commentElement.textContent?.trim() || '';
    if (elementText.length < 10) {
      return null;
    }
    
    // Get comment author name using improved extraction
    const authorName = extractCommentAuthorName(commentElement);
    
    // Get comment author headline
    const headlineElement = queryWithFallback(commentElement, SELECTORS.commentAuthorHeadline);
    const authorHeadline = headlineElement?.textContent?.trim() || '';
    
    // Get comment content - try multiple selectors
    const contentElement = queryWithFallback(commentElement, SELECTORS.commentContent);
    let content = contentElement?.textContent?.trim() || '';
    
    // Clean up content
    content = content.replace(/…?see (more|less)/gi, '').trim();
    content = content.replace(/…?voir (plus|moins)/gi, '').trim();
    
    // Validate we have actual comment content (not just metadata)
    if (!content || content.length < 5) {
      return null;
    }
    
    // Make sure content is different from author name (avoid metadata-only elements)
    if (authorName !== 'Unknown' && content.toLowerCase().includes(authorName.toLowerCase()) && content.length < 50) {
      return null;
    }
    
    // Check if this is a reply (nested in a replies list)
    const isReply = !!commentElement.closest('.comments-comment-item__replies-list, .comments-replies-list, [class*="replies-list"]');
    
    return {
      authorName,
      authorHeadline,
      content,
      isReply,
    };
  } catch (error) {
    console.error('[LinkedIn AI] Error extracting comment:', error);
    return null;
  }
}

/**
 * Scrape existing comments from a post
 */
export function scrapeExistingComments(postElement: Element, limit: number = 5): CommentData[] {
  const comments: CommentData[] = [];
  const seenContents = new Set<string>();
  
  // Find comments section ONLY within this post element
  const commentsSection = queryWithFallback(postElement, SELECTORS.commentsSection);
  if (!commentsSection) {
    return comments;
  }
  
  // Verify the comments section is actually inside this post
  // (not from a different post that might be nested somehow)
  if (!postElement.contains(commentsSection)) {
    return comments;
  }
  
  // Get all comment items - but only direct descendants to avoid duplicates
  const commentItems = queryAllWithFallback(commentsSection, SELECTORS.commentItem);
  
  for (const item of commentItems) {
    if (comments.length >= limit) break;
    
    // Skip if this comment element is not within our post
    if (!postElement.contains(item)) continue;
    
    const commentData = extractCommentData(item);
    if (commentData && commentData.content.length > 5) {
      // Deduplicate by content (avoid counting same comment twice)
      const contentKey = commentData.content.slice(0, 50).toLowerCase();
      if (!seenContents.has(contentKey)) {
        seenContents.add(contentKey);
        comments.push(commentData);
      }
    }
  }
  
  return comments;
}

/**
 * Detect if we're in a reply thread context
 * Returns the parent comment if replying to a specific comment
 */
export function detectReplyContext(postElement: Element): { isReply: boolean; parentComment: CommentData | null; threadParticipants: string[] } {
  // Look for an active/focused reply input
  const activeCommentBox = findActiveCommentBox();
  
  if (!activeCommentBox) {
    return { isReply: false, parentComment: null, threadParticipants: [] };
  }
  
  // Check if the comment box is inside a replies section (nested)
  const repliesContainer = activeCommentBox.closest('.comments-comment-item__replies-list, .comments-replies-list, [class*="replies-list"]');
  
  if (!repliesContainer) {
    // Not in a reply thread, just a top-level comment
    return { isReply: false, parentComment: null, threadParticipants: [] };
  }
  
  let parentComment: CommentData | null = null;
  const threadParticipants: string[] = [];
  
  // Strategy 1: Find the IMMEDIATE parent comment by looking at siblings before the reply box
  // The reply box usually appears AFTER the comment we're replying to
  const replyBoxWrapper = activeCommentBox.closest('.comments-comment-box, .comments-comment-texteditor, [class*="comment-box"]');
  
  if (replyBoxWrapper) {
    // Look for the comment item that is a sibling or just before the reply box
    let sibling = replyBoxWrapper.previousElementSibling;
    while (sibling) {
      if (sibling.matches('.comments-comment-item, .comments-comment-entity, [class*="comments-comment-item"]')) {
        const siblingData = extractCommentData(sibling);
        if (siblingData && siblingData.content) {
          parentComment = siblingData;
          console.log('[LinkedIn AI] Found immediate parent comment:', parentComment.authorName);
          break;
        }
      }
      sibling = sibling.previousElementSibling;
    }
  }
  
  // Strategy 2: If not found, look for the last comment in the replies list (before the input)
  if (!parentComment) {
    const commentsInThread = repliesContainer.querySelectorAll('.comments-comment-item, .comments-comment-entity');
    if (commentsInThread.length > 0) {
      // Get the last comment (most recent reply, which we're responding to)
      const lastComment = commentsInThread[commentsInThread.length - 1];
      parentComment = extractCommentData(lastComment);
      console.log('[LinkedIn AI] Found last comment in thread:', parentComment?.authorName);
    }
  }
  
  // Strategy 3: Fallback - find comment by looking for the @mention in the reply box
  if (!parentComment) {
    const mentionInBox = activeCommentBox.querySelector('a[href*="/in/"], [data-mention]');
    if (mentionInBox) {
      const mentionName = mentionInBox.textContent?.trim();
      console.log('[LinkedIn AI] Found mention in reply box:', mentionName);
      
      // Find comment with this author name
      const allComments = postElement.querySelectorAll('.comments-comment-item, .comments-comment-entity');
      for (const comment of allComments) {
        const commentData = extractCommentData(comment);
        if (commentData && mentionName && commentData.authorName.includes(mentionName.replace('@', ''))) {
          parentComment = commentData;
          console.log('[LinkedIn AI] Matched comment by mention:', parentComment.authorName);
          break;
        }
      }
    }
  }
  
  // Strategy 4: Last fallback - get the top-level comment
  if (!parentComment) {
    const parentCommentElement = repliesContainer.closest('.comments-comment-item, .comments-comment-entity, [class*="comments-comment-item"]');
    if (parentCommentElement) {
      parentComment = extractCommentData(parentCommentElement);
      console.log('[LinkedIn AI] Fallback to parent container:', parentComment?.authorName);
    }
  }
  
  // Collect thread participants
  if (parentComment) {
    threadParticipants.push(parentComment.authorName);
  }
  
  // Get other participants in this specific thread
  const threadReplies = queryAllWithFallback(repliesContainer, SELECTORS.commentItem);
  for (const reply of threadReplies) {
    const replyData = extractCommentData(reply);
    if (replyData && !threadParticipants.includes(replyData.authorName)) {
      threadParticipants.push(replyData.authorName);
    }
  }
  
  return {
    isReply: true,
    parentComment,
    threadParticipants,
  };
}

/**
 * Build full thread context for a post
 */
export function buildThreadContext(postElement: Element): ThreadContext {
  // Detect if we're replying to a specific comment
  const replyContext = detectReplyContext(postElement);
  
  let existingComments: CommentData[] = [];
  
  if (replyContext.isReply) {
    // When in reply mode, only scrape the CURRENT THREAD branch
    existingComments = scrapeCurrentThread(postElement);
    console.log('[LinkedIn AI] Scraped current thread:', existingComments.length, 'comments');
  } else {
    // When commenting on the main post, scrape all visible comments
    existingComments = scrapeExistingComments(postElement, 5);
    console.log('[LinkedIn AI] Scraped all comments:', existingComments.length, 'comments');
  }
  
  // Collect all participants
  const allParticipants = new Set<string>(replyContext.threadParticipants);
  for (const comment of existingComments) {
    if (comment.authorName !== 'Unknown') {
      allParticipants.add(comment.authorName);
    }
  }
  
  return {
    mode: replyContext.isReply ? 'reply' : 'post',
    parentComment: replyContext.parentComment || undefined,
    existingComments,
    threadParticipants: Array.from(allParticipants),
  };
}

/**
 * Scrape only the current thread branch (for reply mode)
 */
function scrapeCurrentThread(postElement: Element): CommentData[] {
  const comments: CommentData[] = [];
  const activeCommentBox = findActiveCommentBox();
  
  if (!activeCommentBox) {
    return comments;
  }
  
  // Find the thread container that holds the reply box
  const repliesContainer = activeCommentBox.closest('.comments-comment-item__replies-list, .comments-replies-list, [class*="replies-list"]');
  
  if (!repliesContainer) {
    return comments;
  }
  
  // Get the parent comment of this thread (top-level comment in this branch)
  const parentCommentElement = repliesContainer.closest('.comments-comment-item, .comments-comment-entity');
  if (parentCommentElement) {
    const parentData = extractCommentData(parentCommentElement);
    if (parentData) {
      // Mark this as the thread starter
      comments.push({ ...parentData, isReply: false });
    }
  }
  
  // Get all replies in this specific thread
  const threadReplies = repliesContainer.querySelectorAll(':scope > .comments-comment-item, :scope > .comments-comment-entity, :scope > article');
  
  for (const reply of threadReplies) {
    // Skip if this looks like the reply box container
    if (reply.querySelector('.comments-comment-box, .comments-comment-texteditor')) {
      continue;
    }
    
    const replyData = extractCommentData(reply);
    if (replyData) {
      comments.push({ ...replyData, isReply: true });
    }
  }
  
  console.log('[LinkedIn AI] Thread comments:', comments.map(c => c.authorName));
  return comments;
}

/**
 * Find the main post container (even if we clicked on a comment)
 */
function findMainPostContainer(element: Element): Element | null {
  // Try to find the main post container by traversing up
  const postSelectors = [
    '.feed-shared-update-v2',
    '.occludable-update',
    '[data-urn*="activity"]',
    '[data-urn*="ugcPost"]',
  ];
  
  for (const selector of postSelectors) {
    const post = element.closest(selector);
    if (post) {
      return post;
    }
  }
  
  return element;
}

/**
 * Check if the clicked element is inside a comment (not the main post)
 */
function isInsideComment(element: Element): boolean {
  const commentSelectors = [
    '.comments-comment-item',
    '.comments-comment-entity',
    '[class*="comments-comment-item"]',
    '.comments-comments-list',
    '.comments-comment-list',
  ];
  
  for (const selector of commentSelectors) {
    const match = element.closest(selector);
    if (match) {
      // Make sure we're actually inside a comment, not just near the comments section
      // Check if we're inside a specific comment item
      const commentItem = element.closest('.comments-comment-item, .comments-comment-entity, [class*="comments-comment-item"]:not(.comments-comments-list)');
      if (commentItem) {
        console.log('[LinkedIn AI] Detected inside comment:', commentItem);
        return true;
      }
    }
  }
  
  // Also check by looking at the button's context - if the Reply button is nearby
  const nearbyReply = element.closest('[class*="comment"]')?.querySelector('button[aria-label*="Reply"], [class*="reply-action"]');
  if (nearbyReply) {
    console.log('[LinkedIn AI] Detected reply button nearby');
    return true;
  }
  
  return false;
}

/**
 * Get the comment element that was clicked (if any)
 */
function getClickedCommentElement(element: Element): Element | null {
  const commentSelectors = [
    '.comments-comment-item',
    '.comments-comment-entity',
    'article[class*="comments-comment-item"]',
    '[class*="comments-comment-item"]:not(.comments-comments-list)',
  ];
  
  for (const selector of commentSelectors) {
    try {
      const comment = element.closest(selector);
      if (comment && comment.querySelector('[class*="comment-item__main-content"], [class*="comment-content"]')) {
        console.log('[LinkedIn AI] Found clicked comment element:', comment);
        return comment;
      }
    } catch {
      // Invalid selector, skip
    }
  }
  
  // Fallback: find the closest element that looks like a comment
  let current: Element | null = element;
  while (current) {
    if (current.classList) {
      for (const cls of current.classList) {
        if (cls.includes('comment-item') || cls.includes('comment-entity')) {
          console.log('[LinkedIn AI] Found comment via classList:', current);
          return current;
        }
      }
    }
    current = current.parentElement;
  }
  
  return null;
}

/**
 * Scrape post data from a post element (enriched with thread context)
 */
export async function scrapePostData(clickedElement: Element): Promise<EnrichedPostData | null> {
  try {
    // First, find the MAIN post container (even if clicked on comment)
    const mainPostContainer = findMainPostContainer(clickedElement);
    
    if (!mainPostContainer) {
      console.warn('[LinkedIn AI] Could not find main post container');
      return null;
    }
    
    // Check if we clicked inside a comment
    const isReplyMode = isInsideComment(clickedElement);
    const clickedComment = isReplyMode ? getClickedCommentElement(clickedElement) : null;
    
    // Extract author info from the MAIN POST (not from comment)
    // The main post author is usually at the top of the post container
    const mainPostAuthorSection = mainPostContainer.querySelector('.feed-shared-actor, [class*="update-components-actor"], .update-components-actor');
    
    let authorName = 'Unknown Author';
    let authorHeadline = '';
    
    if (mainPostAuthorSection) {
      authorName = extractAuthorName(mainPostAuthorSection as Element) || 'Unknown Author';
      authorHeadline = extractAuthorHeadline(mainPostAuthorSection as Element) || '';
    } else {
      // Fallback: try to extract from the main post container
      authorName = extractAuthorName(mainPostContainer);
      authorHeadline = extractAuthorHeadline(mainPostContainer);
    }
    
    // Expand "see more" and extract full content from MAIN POST
    await expandSeeMoreAndWait(mainPostContainer);
    const postContent = extractPostContentSync(mainPostContainer);
    
    if (!postContent) {
      console.warn('[LinkedIn AI] Could not extract post content');
      return null;
    }
    
    // Extract image from the main post
    const imageUrl = extractPostImage(mainPostContainer);
    
    // Scrape existing comments from the main post
    const existingComments = scrapeExistingComments(mainPostContainer, 5);
    
    // Build thread context
    let parentComment: CommentData | undefined;
    const threadParticipants: string[] = [];
    
    if (isReplyMode && clickedComment) {
      // Extract the parent comment we're replying to
      parentComment = extractCommentData(clickedComment) || undefined;
      
      if (parentComment) {
        threadParticipants.push(parentComment.authorName);
      }
      
      // Find other participants in the same thread
      const repliesContainer = clickedComment.querySelector('.comments-comment-item__replies-list, .comments-replies-list, [class*="replies-list"]');
      if (repliesContainer) {
        const threadReplies = queryAllWithFallback(repliesContainer, SELECTORS.commentItem);
        for (const reply of threadReplies) {
          const replyData = extractCommentData(reply);
          if (replyData && !threadParticipants.includes(replyData.authorName)) {
            threadParticipants.push(replyData.authorName);
          }
        }
      }
    }
    
    // Add other participants from existing comments
    for (const comment of existingComments) {
      if (!threadParticipants.includes(comment.authorName)) {
        threadParticipants.push(comment.authorName);
      }
    }
    
    const threadContext: ThreadContext = {
      mode: isReplyMode ? 'reply' : 'post',
      parentComment,
      existingComments,
      threadParticipants,
    };
    
    console.log('[LinkedIn AI] Scraped data:', {
      authorName,
      authorHeadline,
      postContentLength: postContent.length,
      hasImage: !!imageUrl,
      isReplyMode,
      parentComment: parentComment?.authorName,
      existingCommentsCount: existingComments.length,
    });
    
    return {
      authorName,
      authorHeadline,
      postContent,
      imageUrl,
      threadContext,
    };
  } catch (error) {
    console.error('[LinkedIn AI] Error scraping post data:', error);
    return null;
  }
}

/**
 * Get selected/highlighted text from the page
 */
export function getSelectedText(): string {
  const selection = window.getSelection();
  return selection?.toString().trim() || '';
}

/**
 * Create post data from manually selected text
 */
export function createPostDataFromSelection(): EnrichedPostData | null {
  const selectedText = getSelectedText();
  
  if (!selectedText || selectedText.length < 10) {
    return null;
  }
  
  return {
    authorName: 'Selected Text',
    authorHeadline: '',
    postContent: selectedText,
    threadContext: {
      mode: 'post',
      existingComments: [],
      threadParticipants: [],
    },
  };
}

/**
 * Find the LinkedIn post creation modal
 */
export function findPostModal(): HTMLElement | null {
  const modals = queryAllWithFallback(document, SELECTORS.postModal);
  
  const visibleModal = modals.find((modal) => {
    const rect = (modal as HTMLElement).getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  });
  
  return (visibleModal as HTMLElement) || null;
}

/**
 * Find the post editor within the modal
 */
export function findPostEditor(): HTMLElement | null {
  const editors = queryAllWithFallback(document, SELECTORS.postEditor);
  
  // Look within the modal first
  const modal = findPostModal();
  if (modal) {
    const modalEditors = queryAllWithFallback(modal, SELECTORS.postEditor);
    if (modalEditors.length > 0) {
      const visibleEditor = modalEditors.find((editor) => {
        const rect = (editor as HTMLElement).getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      });
      if (visibleEditor) return visibleEditor as HTMLElement;
    }
  }
  
  // Fallback: find any visible editor
  const visibleEditor = editors.find((editor) => {
    const rect = (editor as HTMLElement).getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  });
  
  return (visibleEditor as HTMLElement) || null;
}

/**
 * Find the toolbar in the post modal (where we'll inject the button)
 */
export function findPostToolbar(): HTMLElement | null {
  const modal = findPostModal();
  if (!modal) return null;
  
  const toolbars = queryAllWithFallback(modal, SELECTORS.postToolbar);
  if (toolbars.length === 0) return null;
  
  return (toolbars[0] as HTMLElement) || null;
}

/**
 * Inject text into the LinkedIn post editor
 */
export function injectTextIntoPostEditor(
  postEditor: HTMLElement,
  text: string
): boolean {
  try {
    // Clear existing content
    postEditor.innerHTML = '';
    
    // Add the new text
    const p = document.createElement('p');
    p.textContent = text;
    postEditor.appendChild(p);
    
    // Dispatch multiple events to ensure LinkedIn recognizes the input
    const inputEvent = new InputEvent('input', {
      bubbles: true,
      cancelable: true,
      inputType: 'insertText',
      data: text,
    });
    postEditor.dispatchEvent(inputEvent);
    
    // Also dispatch change event
    postEditor.dispatchEvent(new Event('change', { bubbles: true }));
    
    // Dispatch keyup event
    postEditor.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));
    
    // Focus the editor
    postEditor.focus();
    
    // Move cursor to end
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(postEditor);
    range.collapse(false);
    selection?.removeAllRanges();
    selection?.addRange(range);
    
    return true;
  } catch (error) {
    console.error('[LinkedIn AI] Failed to inject text into post editor:', error);
    return false;
  }
}

