/**
 * LinkedIn DOM Selectors Utility
 * Handles the complexity of LinkedIn's ever-changing DOM structure
 *
 * As of 2025/2026, LinkedIn uses hashed CSS class names (e.g., _0005f205).
 * We now primarily rely on:
 * - data-view-name attributes (e.g., "feed-full-update", "feed-comment-button")
 * - aria-label attributes
 * - button text content
 * - role attributes
 * - Structural relationships (parent/child traversal)
 */

import type { PostData, CommentData, ThreadContext, EnrichedPostData } from '../../types';

// ======================== Helper Functions ========================

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
 * Find a button by its visible text content
 */
function findButtonByText(parent: Element | Document, text: string): HTMLButtonElement | null {
  const buttons = parent.querySelectorAll('button');
  for (const btn of buttons) {
    const btnText = btn.textContent?.trim();
    if (btnText === text) {
      return btn as HTMLButtonElement;
    }
  }
  return null;
}

/**
 * Find the action bar container that holds Like/Comment/Repost/Send buttons.
 * Traverses up from a known action button to find the common parent.
 */
function findActionBarFromButton(button: Element): Element | null {
  let parent = button.parentElement;
  while (parent) {
    const actionButtons = parent.querySelectorAll(
      '[data-view-name="reaction-button"], ' +
      '[data-view-name="feed-comment-button"], ' +
      '[data-view-name="feed-share-button"], ' +
      '[data-view-name="feed-send-as-message-button"]'
    );
    if (actionButtons.length >= 3) {
      return parent;
    }
    // Also check by text content of buttons
    const buttons = parent.querySelectorAll('button');
    let actionCount = 0;
    buttons.forEach(btn => {
      const text = btn.textContent?.trim();
      if (['Like', 'Comment', 'Repost', 'Send'].includes(text || '')) {
        actionCount++;
      }
    });
    if (actionCount >= 3) {
      return parent;
    }
    parent = parent.parentElement;
  }
  return null;
}

// ======================== Post Containers ========================

/**
 * Get all post containers on the page
 */
export function getPostContainers(): Element[] {
  // Primary: new LinkedIn uses data-view-name="feed-full-update"
  const newPosts = document.querySelectorAll('[data-view-name="feed-full-update"]');
  if (newPosts.length > 0) {
    return Array.from(newPosts);
  }

  // Fallback: old LinkedIn selectors
  return queryAllWithFallback(document, [
    '.feed-shared-update-v2',
    '.occludable-update',
    '[data-urn*="activity"]',
    '[data-urn*="ugcPost"]',
  ]);
}

/**
 * Get social action bar for button injection.
 * Returns the container div that holds Like/Comment/Repost/Send buttons.
 */
export function getSocialActionBar(postElement: Element): Element | null {
  // Strategy 1: Find via data-view-name on action buttons
  const commentButton = postElement.querySelector('[data-view-name="feed-comment-button"]');
  if (commentButton) {
    return findActionBarFromButton(commentButton);
  }

  // Strategy 2: Find by button text content
  const buttons = postElement.querySelectorAll('button');
  for (const btn of buttons) {
    const text = btn.textContent?.trim();
    if (text === 'Comment') {
      return findActionBarFromButton(btn);
    }
  }

  // Strategy 3: Find via reaction button data-view-name
  const reactionButton = postElement.querySelector('[data-view-name="reaction-button"]');
  if (reactionButton) {
    return findActionBarFromButton(reactionButton);
  }

  // Strategy 4: Fallback to old selectors
  return queryWithFallback(postElement, [
    '.social-actions-button',
    '.feed-shared-social-action-bar',
    '.social-details-social-activity',
    '[class*="social-actions"]',
  ]);
}

// ======================== Post Content Extraction ========================

/**
 * Clean up extracted text: remove "see more" buttons, extra whitespace, etc.
 */
function cleanExtractedText(text: string): string {
  let cleaned = text.trim();
  // Remove "see more/less" buttons in various languages
  cleaned = cleaned.replace(/…?see (more|less)/gi, '');
  cleaned = cleaned.replace(/…?\s*more\s*$/gi, '');
  cleaned = cleaned.replace(/…?voir (plus|moins)/gi, '');
  cleaned = cleaned.replace(/…?mehr (anzeigen|ausblenden)/gi, '');
  cleaned = cleaned.replace(/…?ещё/gi, '');
  cleaned = cleaned.replace(/…?больше/gi, '');
  cleaned = cleaned.replace(/…?mostrar (más|menos)/gi, '');
  // Remove reaction counts like "5,432 reactions"
  cleaned = cleaned.replace(/[\d,.]+ (reactions?|likes?|comments?|reposts?|shares?)/gi, '');
  // Remove "Like Comment Repost Send" action bar text that may leak in
  cleaned = cleaned.replace(/\b(Like|Comment|Repost|Send|Share|Reply)\b\s*/g, (match, word) => {
    // Only remove if it looks like an action button (standalone word)
    if (/^\s*$/.test(cleaned.substring(cleaned.indexOf(match) - 5, cleaned.indexOf(match)))) {
      return '';
    }
    return match;
  });
  // Normalize whitespace
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  return cleaned;
}

/**
 * Extract post content text
 */
export function extractPostContentSync(postElement: Element): string {
  // Strategy 1: New LinkedIn - find feed-commentary elements
  // The main post text is in elements with data-view-name="feed-commentary"
  // But we need to get ONLY the post text, not comment text
  const commentaryElements = postElement.querySelectorAll('[data-view-name="feed-commentary"]');
  if (commentaryElements.length > 0) {
    // The FIRST feed-commentary is usually the main post text
    // Subsequent ones may be inside comments - we need to filter
    const mainPostCommentary: Element[] = [];

    for (const el of commentaryElements) {
      // Check if this commentary is inside a comment (has Reply button as sibling)
      let isInsideComment = false;
      let parent = el.parentElement;
      for (let i = 0; i < 8; i++) {
        if (!parent || parent === postElement) break;
        const replyBtn = Array.from(parent.querySelectorAll('button')).find(
          b => b.textContent?.trim() === 'Reply'
        );
        if (replyBtn) {
          isInsideComment = true;
          break;
        }
        parent = parent.parentElement;
      }

      if (!isInsideComment) {
        mainPostCommentary.push(el);
      }
    }

    if (mainPostCommentary.length > 0) {
      // Try to find the container that holds the main post text
      const firstCommentary = mainPostCommentary[0];
      let contentContainer = firstCommentary.parentElement;

      // Walk up to find a container that wraps all post commentary
      while (contentContainer && contentContainer !== postElement) {
        const innerCommentary = contentContainer.querySelectorAll('[data-view-name="feed-commentary"]');
        // Check that this container doesn't also contain comment text
        const hasReplyButton = Array.from(contentContainer.querySelectorAll('button')).some(
          b => b.textContent?.trim() === 'Reply'
        );
        if (innerCommentary.length >= mainPostCommentary.length && !hasReplyButton) {
          break;
        }
        contentContainer = contentContainer.parentElement;
      }

      if (contentContainer && contentContainer !== postElement) {
        const text = cleanExtractedText(contentContainer.textContent || '');
        if (text.length > 10) return text;
      }

      // Fallback: concatenate all main post commentary text
      const texts: string[] = [];
      mainPostCommentary.forEach(el => {
        const t = el.textContent?.trim();
        if (t) texts.push(t);
      });
      const fullText = cleanExtractedText(texts.join('\n'));
      if (fullText.length > 10) return fullText;
    }
  }

  // Strategy 2: Find the main content area by structure
  // LinkedIn posts typically have: header (author) -> content -> media -> action bar
  // The content is usually the second major section
  const actionBar = getSocialActionBar(postElement);
  if (actionBar) {
    // Walk backwards from the action bar to find text content
    let sibling = actionBar.previousElementSibling;
    while (sibling) {
      const text = cleanExtractedText(sibling.textContent || '');
      // Skip media containers (usually have very little text but images)
      const hasImages = sibling.querySelectorAll('img').length > 0;
      const textLength = text.length;
      if (textLength > 30 && (!hasImages || textLength > 100)) {
        return text;
      }
      sibling = sibling.previousElementSibling;
    }
  }

  // Strategy 3: Old LinkedIn selectors
  const contentElement = queryWithFallback(postElement, [
    '[class*="update-components-text"]',
    '.feed-shared-update-v2__description',
    '.feed-shared-text',
    '.feed-shared-inline-show-more-text',
    '.break-words',
    '[data-test-id="main-feed-activity-card__commentary"]',
  ]);

  if (contentElement) {
    const text = cleanExtractedText(contentElement.textContent || '');
    if (text.length > 10) return text;
  }

  // Strategy 4: Brute force - find the largest text block in the post
  // that is NOT in the action bar area and NOT in comments
  let bestText = '';
  let bestLength = 0;
  const children = postElement.children;
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    // Skip action bar and comments area
    if (child === actionBar || child.contains(actionBar as Node)) continue;
    const hasReplyButton = Array.from(child.querySelectorAll('button')).some(
      b => b.textContent?.trim() === 'Reply'
    );
    if (hasReplyButton) continue;

    const text = cleanExtractedText(child.textContent || '');
    if (text.length > bestLength && text.length > 30) {
      bestText = text;
      bestLength = text.length;
    }
  }
  if (bestText) return bestText;

  return '';
}

/**
 * Extract post content (async - expands "see more" first)
 */
export async function extractPostContent(postElement: Element): Promise<string> {
  await expandSeeMoreAndWait(postElement);
  return extractPostContentSync(postElement);
}

/**
 * Expand "see more" button to reveal full content.
 * This is critical for getting the full post text before analysis.
 */
export function expandSeeMore(postElement: Element): boolean {
  let clicked = false;

  // Strategy 1: Find buttons/spans with "more" text (works for all LinkedIn versions & languages)
  const allClickables = postElement.querySelectorAll('button, span[role="button"], a[role="button"], span.see-more, a.see-more');

  allClickables.forEach((button) => {
    const text = button.textContent?.trim().toLowerCase() || '';
    const ariaLabel = button.getAttribute('aria-label')?.toLowerCase() || '';

    if (
      text === 'more' ||
      text === '...more' ||
      text === '…more' ||
      text === '…ещё' ||
      text === 'ещё' ||
      text.includes('see more') ||
      text.includes('show more') ||
      text.includes('voir plus') ||
      text.includes('mehr anzeigen') ||
      text.includes('mostrar más') ||
      text.includes('больше') ||
      ariaLabel.includes('see more') ||
      ariaLabel.includes('show more') ||
      ariaLabel.includes('expand')
    ) {
      // Make sure this "more" button is for the POST content, not for comments
      // Post "see more" is before the action bar; comment "see more" is after Reply buttons
      const isInComment = Array.from(button.parentElement?.querySelectorAll('button') || []).some(
        b => b.textContent?.trim() === 'Reply' && b !== button
      );
      if (!isInComment) {
        (button as HTMLElement).click();
        clicked = true;
        console.log('[LinkedIn AI] Expanded "see more" text');
      }
    }
  });

  // Strategy 2: New LinkedIn - find truncated text containers with ellipsis
  if (!clicked) {
    const textElements = postElement.querySelectorAll('[data-view-name="feed-commentary"]');
    for (const el of textElements) {
      const parent = el.parentElement;
      if (parent) {
        const seeMoreBtn = parent.querySelector('button, span[role="button"]');
        if (seeMoreBtn && (seeMoreBtn.textContent?.trim().toLowerCase().includes('more') ||
            seeMoreBtn.textContent?.trim().toLowerCase().includes('ещё'))) {
          (seeMoreBtn as HTMLElement).click();
          clicked = true;
          console.log('[LinkedIn AI] Expanded truncated commentary');
        }
      }
    }
  }

  // Strategy 3: Old selectors
  if (!clicked) {
    const oldButtons = queryAllWithFallback(postElement, [
      '.feed-shared-inline-show-more-text__see-more-less-toggle',
      '.see-more',
      '[data-control-name="see_more"]',
      'button[aria-label*="see more"]',
      'button[aria-label*="Show more"]',
    ]);
    oldButtons.forEach((button) => {
      (button as HTMLElement).click();
      clicked = true;
    });
  }

  return clicked;
}

/**
 * Expand "see more" and wait for content to load
 */
export async function expandSeeMoreAndWait(postElement: Element): Promise<void> {
  const clicked = expandSeeMore(postElement);
  if (clicked) {
    // Wait longer for LinkedIn to actually expand the text (500ms)
    await new Promise(resolve => setTimeout(resolve, 500));
    // Try expanding again in case there's nested "see more"
    const clickedAgain = expandSeeMore(postElement);
    if (clickedAgain) {
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  }
}

// ======================== Author Info Extraction ========================

/**
 * Extract author name from post element
 */
export function extractAuthorName(postElement: Element): string {
  // Strategy 1: New LinkedIn - find the actor image link and nearby text
  const actorImage = postElement.querySelector('[data-view-name="feed-actor-image"]');
  if (actorImage) {
    // The author name is usually in a sibling or nearby element
    const parent = actorImage.parentElement;
    if (parent) {
      // Look for links that go to profiles
      const profileLinks = parent.querySelectorAll('a[href*="/in/"], a[href*="/company/"]');
      for (const link of profileLinks) {
        if (link === actorImage) continue; // Skip the image link itself
        const text = link.textContent?.trim();
        if (text && text.length >= 2 && text.length < 100) {
          return text.split('\n')[0].trim();
        }
      }
    }

    // Try the grandparent
    const grandparent = actorImage.parentElement?.parentElement;
    if (grandparent) {
      const profileLinks = grandparent.querySelectorAll('a[href*="/in/"], a[href*="/company/"]');
      for (const link of profileLinks) {
        if (link === actorImage) continue;
        // Get text from spans inside the link
        const spans = link.querySelectorAll('span');
        for (const span of spans) {
          const text = span.textContent?.trim();
          if (text && text.length >= 2 && text.length < 80 &&
              !text.includes('•') && !text.includes('followers')) {
            return text;
          }
        }
        const text = link.textContent?.trim()?.split('\n')[0]?.trim();
        if (text && text.length >= 2 && text.length < 80) {
          return text;
        }
      }
    }
  }

  // Strategy 2: Find feed-header-text
  const headerText = postElement.querySelector('[data-view-name="feed-header-text"]');
  if (headerText) {
    const text = headerText.textContent?.trim()?.split('\n')[0]?.trim();
    if (text && text.length >= 2) return text;
  }

  // Strategy 3: Old LinkedIn selectors
  const nameElement = queryWithFallback(postElement, [
    '[class*="update-components-actor__name"]',
    '.feed-shared-actor__name',
    '.feed-shared-actor__title',
    'a[class*="actor-name"]',
  ]);
  if (nameElement) {
    let text = nameElement.textContent?.trim() || '';
    text = text.split('\n')[0]
      .replace(/View.*profile/gi, '')
      .replace(/•.*$/g, '')
      .trim();
    if (text) return text;
  }

  // Strategy 4: Find first profile link in the post header area
  const postChildren = postElement.children[0]?.children;
  if (postChildren) {
    for (let i = 0; i < Math.min(3, postChildren.length); i++) {
      const child = postChildren[i];
      const link = child?.querySelector('a[href*="/in/"], a[href*="/company/"]');
      if (link) {
        const text = link.textContent?.trim()?.split('\n')[0]?.trim();
        if (text && text.length >= 2 && text.length < 80) {
          return text;
        }
      }
    }
  }

  return 'Unknown Author';
}

/**
 * Extract author headline from post element
 */
export function extractAuthorHeadline(postElement: Element): string {
  // Strategy 1: New LinkedIn - find text near actor area that looks like a headline
  const actorImage = postElement.querySelector('[data-view-name="feed-actor-image"]');
  if (actorImage) {
    // Headline is usually in the same area as the name but in a different div
    const container = actorImage.parentElement?.parentElement;
    if (container) {
      // Find all text spans, skip the name and timestamps
      const allSpans = container.querySelectorAll('span');
      for (const span of allSpans) {
        const text = span.textContent?.trim();
        if (text && text.length >= 5 && text.length < 200 &&
            !text.includes('•') &&
            !text.match(/^\d+[hdwmy]$/) && // Skip timestamps like "5d", "1w"
            !text.match(/^\d+\s*(followers?|connections?)/i) &&
            !text.includes('Follow') &&
            !text.includes('Promoted')) {
          // This might be a headline - check if it's not the author name
          const nameEl = actorImage.parentElement?.querySelector('a[href*="/in/"], a[href*="/company/"]');
          const authorName = nameEl?.textContent?.trim();
          if (authorName && text !== authorName && !text.startsWith(authorName)) {
            return text;
          }
        }
      }
    }
  }

  // Strategy 2: Old selectors
  const headlineElement = queryWithFallback(postElement, [
    '[class*="update-components-actor__description"]',
    '.feed-shared-actor__description',
    '.feed-shared-actor__sub-description',
    '.update-components-actor__sublabel',
  ]);
  if (headlineElement) {
    let text = headlineElement.textContent?.trim() || '';
    text = text.split('•')[0].trim();
    text = text.replace(/\d+\s*(followers?|connections?)/gi, '').trim();
    if (text) return text;
  }

  return '';
}

// ======================== Image Extraction ========================

/**
 * Extract the main image URL from a post
 */
export function extractPostImage(postElement: Element): string | undefined {
  // Strategy 1: New LinkedIn - find images via data-view-name
  const imageElements = postElement.querySelectorAll('[data-view-name="feed-update-image"] img, [data-view-name="image"] img');
  for (const img of imageElements) {
    const imgElement = img as HTMLImageElement;
    // Skip profile pictures (usually inside actor areas)
    if (imgElement.closest('[data-view-name="feed-actor-image"]')) continue;
    if (imgElement.closest('[data-view-name="feed-header-actor-image"]')) continue;

    const imageUrl = imgElement.src || imgElement.getAttribute('data-delayed-url') || imgElement.getAttribute('data-src');
    if (!imageUrl || imageUrl.startsWith('data:')) continue;
    if (imageUrl.includes('/icons/') || imageUrl.includes('ghost-organization') || imageUrl.includes('ghost-person')) continue;

    const width = imgElement.naturalWidth || imgElement.width;
    const height = imgElement.naturalHeight || imgElement.height;
    if (width && height && (width < 100 || height < 100)) continue;

    return imageUrl;
  }

  // Strategy 2: Find any large image in the post that's not a profile pic
  const allImages = postElement.querySelectorAll('img');
  for (const img of allImages) {
    const imgElement = img as HTMLImageElement;
    // Skip profile pictures
    if (imgElement.closest('[data-view-name="feed-actor-image"]')) continue;
    if (imgElement.closest('[data-view-name="feed-header-actor-image"]')) continue;
    if (imgElement.closest('[data-view-name="identity-module"]')) continue;

    const imageUrl = imgElement.src || imgElement.getAttribute('data-delayed-url');
    if (!imageUrl || imageUrl.startsWith('data:')) continue;
    if (imageUrl.includes('/icons/') || imageUrl.includes('ghost-') || imageUrl.includes('logo')) continue;

    const width = imgElement.naturalWidth || imgElement.width;
    const height = imgElement.naturalHeight || imgElement.height;
    if (width && height && (width < 100 || height < 100)) continue;

    // Check if this looks like a content image (larger than profile pics)
    const rect = imgElement.getBoundingClientRect();
    if (rect.width > 150 && rect.height > 100) {
      return imageUrl;
    }
  }

  // Strategy 3: Old LinkedIn selectors
  const oldSelectors = [
    '.update-components-image__image',
    '.feed-shared-image__image',
    '.ivm-view-attr__img--centered',
    '[class*="update-components-image"] img',
    'img[data-delayed-url]',
  ];
  for (const selector of oldSelectors) {
    const images = postElement.querySelectorAll(selector);
    for (const img of images) {
      const imgElement = img as HTMLImageElement;
      if (imgElement.closest('.feed-shared-actor, [class*="actor"]')) continue;
      const imageUrl = imgElement.src || imgElement.getAttribute('data-delayed-url');
      if (imageUrl && !imageUrl.startsWith('data:') && !imageUrl.includes('/icons/')) {
        return imageUrl;
      }
    }
  }

  return undefined;
}

// ======================== Comment Box ========================

/**
 * Find the active comment box
 */
export function findActiveCommentBox(): HTMLElement | null {
  const selectors = [
    '[role="textbox"][contenteditable="true"]',
    '.ql-editor[contenteditable="true"]',
    '[data-placeholder="Add a comment…"]',
    '[data-placeholder="Add a comment..."]',
    '[aria-placeholder="Add a comment…"]',
    '[aria-placeholder="Add a comment..."]',
    '[contenteditable="true"][aria-label*="comment" i]',
    '[contenteditable="true"][aria-label*="reply" i]',
    '.editor-content [contenteditable="true"]',
  ];

  const boxes = queryAllWithFallback(document, selectors);

  // Find the most recently visible/focused comment box
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
      '[class*="mention"], ' +
      'a[href*="/in/"]'
    );

    const mentionsToPreserve: HTMLElement[] = [];
    existingMentions.forEach((mention) => {
      mentionsToPreserve.push(mention.cloneNode(true) as HTMLElement);
    });

    const existingText = commentBox.textContent || '';
    const mentionMatch = existingText.match(/^(@[\w\s]+)\s*/);
    const textMention = mentionMatch ? mentionMatch[1] : null;

    // Clear existing content
    commentBox.innerHTML = '';

    // Restore mentions
    if (mentionsToPreserve.length > 0) {
      mentionsToPreserve.forEach((mention) => {
        commentBox.appendChild(mention);
        commentBox.appendChild(document.createTextNode(' '));
      });
    } else if (textMention) {
      commentBox.appendChild(document.createTextNode(textMention + ' '));
    }

    // Add the new text
    const p = document.createElement('p');
    p.textContent = text;
    commentBox.appendChild(p);

    // Dispatch events
    commentBox.dispatchEvent(new InputEvent('input', {
      bubbles: true,
      cancelable: true,
      inputType: 'insertText',
      data: text,
    }));
    commentBox.dispatchEvent(new Event('change', { bubbles: true }));
    commentBox.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));

    // Focus and move cursor to end
    commentBox.focus();
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

// ======================== Comment Scraping ========================

/**
 * Extract author name from a comment element
 */
function extractCommentAuthorName(commentElement: Element): string {
  // Strategy 1: Find profile links in the comment header
  const profileLinks = commentElement.querySelectorAll('a[href*="/in/"]');
  for (const link of profileLinks) {
    // Skip links inside the comment content body (those are mentions)
    // Content body is usually deeper in the DOM
    const isInContent = link.closest('[data-view-name="feed-commentary"]');
    if (isInContent) continue;

    const hiddenSpan = link.querySelector('span[aria-hidden="true"]');
    if (hiddenSpan) {
      const name = hiddenSpan.textContent?.trim();
      if (name && name.length >= 2 && name.length < 100) {
        return name;
      }
    }

    const spans = link.querySelectorAll('span');
    for (const span of spans) {
      const name = span.textContent?.trim();
      if (name && name.length >= 2 && name.length < 80 &&
          !name.includes('•') && !name.includes('1st') && !name.includes('2nd') && !name.includes('3rd')) {
        return name;
      }
    }

    const text = link.textContent?.trim()?.split('\n')[0]?.trim();
    if (text && text.length >= 2 && text.length < 80 && !text.includes('•')) {
      return text;
    }
  }

  // Strategy 2: Old selectors
  const oldSelectors = [
    '.comments-post-meta__name-text',
    '.comments-post-meta__name',
    '[class*="comments-post-meta__name"]',
  ];
  const nameElement = queryWithFallback(commentElement, oldSelectors);
  if (nameElement) {
    const name = nameElement.textContent?.trim()?.split('\n')[0]?.trim();
    if (name && name.length >= 2) return name;
  }

  return 'Unknown';
}

/**
 * Extract a single comment's data
 */
function extractCommentData(commentElement: Element): CommentData | null {
  try {
    const elementText = commentElement.textContent?.trim() || '';
    if (elementText.length < 10) return null;

    const authorName = extractCommentAuthorName(commentElement);

    // Get comment content - try multiple strategies
    let content = '';

    // Strategy 1: New LinkedIn - feed-commentary elements
    const commentaryEls = commentElement.querySelectorAll('[data-view-name="feed-commentary"]');
    if (commentaryEls.length > 0) {
      const texts: string[] = [];
      commentaryEls.forEach(el => {
        const t = el.textContent?.trim();
        if (t) texts.push(t);
      });
      content = texts.join(' ').trim();
    }

    // Strategy 2: Find text blocks that aren't author name or action buttons
    if (!content || content.length < 5) {
      // Walk through children looking for text content
      const textParts: string[] = [];
      const walker = document.createTreeWalker(
        commentElement,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: (node) => {
            const parent = node.parentElement;
            if (!parent) return NodeFilter.FILTER_REJECT;
            // Skip buttons (Like, Reply, etc.)
            if (parent.tagName === 'BUTTON') return NodeFilter.FILTER_REJECT;
            // Skip links to profiles (author name)
            if (parent.closest('a[href*="/in/"]') && !parent.closest('[data-view-name="feed-commentary"]')) {
              return NodeFilter.FILTER_REJECT;
            }
            // Skip timestamps
            if (parent.closest('time')) return NodeFilter.FILTER_REJECT;
            const text = node.textContent?.trim() || '';
            if (text.length < 3) return NodeFilter.FILTER_REJECT;
            // Skip action button text
            if (['Like', 'Reply', 'Report', '1st', '2nd', '3rd', '•'].includes(text)) {
              return NodeFilter.FILTER_REJECT;
            }
            return NodeFilter.FILTER_ACCEPT;
          }
        }
      );
      let node;
      while (node = walker.nextNode()) {
        const text = node.textContent?.trim() || '';
        if (text.length >= 3 && text !== authorName) {
          textParts.push(text);
        }
      }
      if (textParts.length > 0) {
        // The longest text part is most likely the comment content
        content = textParts.sort((a, b) => b.length - a.length)[0];
      }
    }

    // Strategy 3: Old LinkedIn selectors
    if (!content || content.length < 5) {
      const contentElement = queryWithFallback(commentElement, [
        '.comments-comment-item__main-content',
        '[class*="comment-item__main-content"]',
        '.comments-comment-item-content-body',
        '.update-components-text',
      ]);
      content = contentElement?.textContent?.trim() || '';
    }

    // Clean up
    content = cleanExtractedText(content);

    if (!content || content.length < 5) return null;

    // Check if this is a reply (nested comment)
    const isReply = !!commentElement.closest('[class*="replies-list"]') ||
                    !!commentElement.parentElement?.closest('[class*="replies"]');

    return { authorName, authorHeadline: '', content, isReply };
  } catch (error) {
    console.error('[LinkedIn AI] Error extracting comment:', error);
    return null;
  }
}

/**
 * Find comment elements within a post.
 * In new LinkedIn, comments appear as nested elements with Like/Reply buttons.
 */
function findCommentElements(postElement: Element): Element[] {
  // Strategy 1: Old selectors (still work on some pages)
  const oldComments = queryAllWithFallback(postElement, [
    '.comments-comment-item',
    '.comments-comment-entity',
    'article[class*="comments-comment-item"]',
  ]);
  if (oldComments.length > 0) return oldComments;

  // Strategy 2: New LinkedIn - find elements that have Reply buttons
  // Comments typically have a Like button and a Reply button
  const replyButtons = Array.from(postElement.querySelectorAll('button')).filter(btn => {
    const text = btn.textContent?.trim();
    return text === 'Reply';
  });

  const commentElements: Element[] = [];
  const seen = new Set<Element>();

  for (const replyBtn of replyButtons) {
    // Walk up to find the comment container
    // A comment container usually includes: author avatar, name, text, and action buttons
    let container = replyBtn.parentElement;
    for (let i = 0; i < 6; i++) {
      if (!container) break;
      // Check if this container has profile links (author) AND the reply button
      const hasProfileLink = container.querySelector('a[href*="/in/"]');
      const hasCommentary = container.querySelector('[data-view-name="feed-commentary"]');
      if (hasProfileLink && (hasCommentary || container.textContent!.length > 20)) {
        if (!seen.has(container)) {
          seen.add(container);
          commentElements.push(container);
        }
        break;
      }
      container = container.parentElement;
    }
  }

  return commentElements;
}

/**
 * Scrape existing comments from a post
 */
export function scrapeExistingComments(postElement: Element, limit: number = 5): CommentData[] {
  const comments: CommentData[] = [];
  const seenContents = new Set<string>();

  const commentElements = findCommentElements(postElement);

  for (const item of commentElements) {
    if (comments.length >= limit) break;
    if (!postElement.contains(item)) continue;

    const commentData = extractCommentData(item);
    if (commentData && commentData.content.length > 5) {
      const contentKey = commentData.content.slice(0, 50).toLowerCase();
      if (!seenContents.has(contentKey)) {
        seenContents.add(contentKey);
        comments.push(commentData);
      }
    }
  }

  return comments;
}

// ======================== Reply Context Detection ========================

/**
 * Detect if we're in a reply thread context.
 * Enhanced for new LinkedIn where replies may not have specific CSS classes.
 */
export function detectReplyContext(postElement: Element): { isReply: boolean; parentComment: CommentData | null; threadParticipants: string[] } {
  const activeCommentBox = findActiveCommentBox();

  if (!activeCommentBox) {
    return { isReply: false, parentComment: null, threadParticipants: [] };
  }

  // Check if the comment box is inside a replies section (old LinkedIn)
  let repliesContainer = activeCommentBox.closest('[class*="replies-list"], [class*="replies"]');

  // New LinkedIn: check if the comment box has a @mention (indicating reply)
  const mentionInBox = activeCommentBox.querySelector('a[href*="/in/"], [data-mention]');

  // Also check if the comment box's aria-label/placeholder mentions "reply"
  const ariaLabel = activeCommentBox.getAttribute('aria-label')?.toLowerCase() || '';
  const ariaPlaceholder = activeCommentBox.getAttribute('aria-placeholder')?.toLowerCase() || '';
  const isReplyByAttribute = ariaLabel.includes('reply') || ariaPlaceholder.includes('reply');

  if (!repliesContainer && !mentionInBox && !isReplyByAttribute) {
    return { isReply: false, parentComment: null, threadParticipants: [] };
  }

  let parentComment: CommentData | null = null;
  const threadParticipants: string[] = [];

  // Find the parent comment
  const commentElements = findCommentElements(postElement);

  // Strategy 1: Look for the comment that contains the replies section
  if (repliesContainer) {
    for (const comment of commentElements) {
      if (comment.contains(repliesContainer)) {
        parentComment = extractCommentData(comment);
        if (parentComment) {
          threadParticipants.push(parentComment.authorName);
        }
        break;
      }
    }
  }

  // Strategy 2: Find by @mention in the reply box
  if (!parentComment && mentionInBox) {
    const mentionName = mentionInBox.textContent?.trim()?.replace('@', '');
    if (mentionName) {
      for (const comment of commentElements) {
        const data = extractCommentData(comment);
        if (data && data.authorName.toLowerCase().includes(mentionName.toLowerCase())) {
          parentComment = data;
          threadParticipants.push(data.authorName);
          break;
        }
      }
    }
  }

  // Strategy 3: The comment box is near a specific comment - find the closest one
  if (!parentComment) {
    const boxRect = activeCommentBox.getBoundingClientRect();
    let closestComment: CommentData | null = null;
    let closestDist = Infinity;

    for (const comment of commentElements) {
      const rect = (comment as HTMLElement).getBoundingClientRect();
      const dist = Math.abs(rect.bottom - boxRect.top);
      if (dist < closestDist && dist < 200) {
        closestDist = dist;
        closestComment = extractCommentData(comment);
      }
    }
    if (closestComment) {
      parentComment = closestComment;
      threadParticipants.push(closestComment.authorName);
    }
  }

  // Collect all thread participants
  for (const comment of commentElements) {
    const data = extractCommentData(comment);
    if (data && data.authorName !== 'Unknown' && !threadParticipants.includes(data.authorName)) {
      threadParticipants.push(data.authorName);
    }
  }

  return { isReply: true, parentComment, threadParticipants };
}

/**
 * Build full thread context for a post
 */
export function buildThreadContext(postElement: Element): ThreadContext {
  const replyContext = detectReplyContext(postElement);

  let existingComments: CommentData[] = [];

  if (replyContext.isReply) {
    existingComments = scrapeCurrentThread(postElement);
  } else {
    existingComments = scrapeExistingComments(postElement, 5);
  }

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

  if (!activeCommentBox) return comments;

  const repliesContainer = activeCommentBox.closest('[class*="replies-list"], [class*="replies"]');
  if (!repliesContainer) return comments;

  // Get parent comment
  const commentElements = findCommentElements(postElement);
  for (const comment of commentElements) {
    if (comment.contains(repliesContainer)) {
      const parentData = extractCommentData(comment);
      if (parentData) {
        comments.push({ ...parentData, isReply: false });
      }
      break;
    }
  }

  // Get replies in this thread
  const replyElements = findCommentElements(repliesContainer as Element);
  for (const reply of replyElements) {
    const replyData = extractCommentData(reply);
    if (replyData) {
      comments.push({ ...replyData, isReply: true });
    }
  }

  return comments;
}

// ======================== Post Scraping ========================

/**
 * Find the main post container (even if we clicked on a comment)
 */
function findMainPostContainer(element: Element): Element | null {
  // Strategy 1: New LinkedIn
  const newPost = element.closest('[data-view-name="feed-full-update"]');
  if (newPost) return newPost;

  // Strategy 2: Old LinkedIn
  const oldSelectors = [
    '.feed-shared-update-v2',
    '.occludable-update',
    '[data-urn*="activity"]',
    '[data-urn*="ugcPost"]',
  ];
  for (const selector of oldSelectors) {
    const post = element.closest(selector);
    if (post) return post;
  }

  return element;
}

/**
 * Check if the clicked element is inside a comment (not the main post action bar)
 */
function isInsideComment(element: Element): boolean {
  // Check old selectors
  const oldComment = element.closest('.comments-comment-item, .comments-comment-entity, [class*="comments-comment-item"]');
  if (oldComment) return true;

  // Check new LinkedIn: if a Reply button is a sibling, we're in a comment
  const parent = element.parentElement;
  if (parent) {
    const replyBtn = Array.from(parent.querySelectorAll('button')).find(b => b.textContent?.trim() === 'Reply');
    if (replyBtn) return true;
  }

  // Check if nearby area has Reply button (walk up a few levels)
  let current = element.parentElement;
  for (let i = 0; i < 4; i++) {
    if (!current) break;
    const btns = current.querySelectorAll('button');
    let hasReply = false;
    let hasLike = false;
    btns.forEach(b => {
      const t = b.textContent?.trim();
      if (t === 'Reply') hasReply = true;
      if (t === 'Like' && !b.getAttribute('data-view-name')?.includes('reaction')) hasLike = true;
    });
    if (hasReply && hasLike) return true;
    current = current.parentElement;
  }

  return false;
}

/**
 * Scrape post data from a post element (enriched with thread context)
 */
export async function scrapePostData(clickedElement: Element): Promise<EnrichedPostData | null> {
  try {
    const mainPostContainer = findMainPostContainer(clickedElement);

    if (!mainPostContainer) {
      console.warn('[LinkedIn AI] Could not find main post container');
      return null;
    }

    const isReplyMode = isInsideComment(clickedElement);

    // Extract author info
    const authorName = extractAuthorName(mainPostContainer);
    const authorHeadline = extractAuthorHeadline(mainPostContainer);

    // Expand "see more" and extract content
    await expandSeeMoreAndWait(mainPostContainer);
    const postContent = extractPostContentSync(mainPostContainer);

    if (!postContent) {
      console.warn('[LinkedIn AI] Could not extract post content');
      return null;
    }

    // Extract image
    const imageUrl = extractPostImage(mainPostContainer);

    // Build thread context
    const existingComments = scrapeExistingComments(mainPostContainer, 5);

    let parentComment: CommentData | undefined;
    const threadParticipants: string[] = [];

    if (isReplyMode) {
      const replyContext = detectReplyContext(mainPostContainer);
      parentComment = replyContext.parentComment || undefined;
      threadParticipants.push(...replyContext.threadParticipants);
    }

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

// ======================== Post Creation Modal ========================

/**
 * Find the LinkedIn post creation modal
 */
export function findPostModal(): HTMLElement | null {
  const selectors = [
    '[role="dialog"][aria-label*="Start a post" i]',
    '[role="dialog"][aria-label*="Create a post" i]',
    '[role="dialog"][aria-label*="post" i]',
    '[data-view-name*="share"]',
    '.share-box-feed-entry__modal',
    '.share-box__modal',
    '.artdeco-modal',
    '[class*="share-box"]',
    '[class*="share-modal"]',
  ];

  const modals = queryAllWithFallback(document, selectors);

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
  const selectors = [
    '[role="textbox"][contenteditable="true"]',
    '.ql-editor[contenteditable="true"]',
    '[data-placeholder*="What do you want to talk about"]',
    '[aria-placeholder*="What do you want to talk about"]',
    '[contenteditable="true"][aria-label*="post" i]',
    '[contenteditable="true"][aria-label*="Text editor" i]',
    '.ql-container .ql-editor',
  ];

  // Look within the modal first
  const modal = findPostModal();
  if (modal) {
    const modalEditors = queryAllWithFallback(modal, selectors);
    if (modalEditors.length > 0) {
      const visibleEditor = modalEditors.find((editor) => {
        const rect = (editor as HTMLElement).getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      });
      if (visibleEditor) return visibleEditor as HTMLElement;
    }
  }

  // Fallback: find any visible editor
  const editors = queryAllWithFallback(document, selectors);
  const visibleEditor = editors.find((editor) => {
    const rect = (editor as HTMLElement).getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  });

  return (visibleEditor as HTMLElement) || null;
}

/**
 * Find the toolbar in the post modal
 */
export function findPostToolbar(): HTMLElement | null {
  const modal = findPostModal();
  if (!modal) return null;

  const selectors = [
    '.share-box__toolbar',
    '.share-box-feed-entry__toolbar',
    '.share-box__footer',
    '.share-creation-state__toolbar',
    '[class*="share-box"][class*="toolbar"]',
    '[class*="share-box"][class*="footer"]',
    '.artdeco-modal__actionbar',
  ];

  const toolbars = queryAllWithFallback(modal, selectors);

  // Also try finding by role or button presence
  if (toolbars.length === 0) {
    // Find the area that has media buttons (photo, video, etc.)
    const buttons = modal.querySelectorAll('button');
    for (const btn of buttons) {
      const ariaLabel = btn.getAttribute('aria-label')?.toLowerCase() || '';
      if (ariaLabel.includes('photo') || ariaLabel.includes('video') || ariaLabel.includes('media')) {
        return btn.parentElement;
      }
    }
  }

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
    postEditor.innerHTML = '';

    const p = document.createElement('p');
    p.textContent = text;
    postEditor.appendChild(p);

    postEditor.dispatchEvent(new InputEvent('input', {
      bubbles: true,
      cancelable: true,
      inputType: 'insertText',
      data: text,
    }));
    postEditor.dispatchEvent(new Event('change', { bubbles: true }));
    postEditor.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));

    postEditor.focus();
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

// ======================== Utility Exports ========================

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
