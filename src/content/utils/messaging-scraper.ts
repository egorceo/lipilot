/**
 * LinkedIn Messaging Scraper
 * Extracts conversation context from LinkedIn DMs
 */

import type { ConversationContext, ChatMessage } from '../../types';

// Selectors for LinkedIn Messaging UI
const MESSAGING_SELECTORS = {
  // Conversation container
  conversationContainer: [
    '.msg-s-message-list',
    '.msg-conversations-container__conversations-list',
    '[class*="msg-s-message-list"]',
  ],
  
  // Individual message items
  messageItem: [
    '.msg-s-message-list__event',
    '.msg-s-event-listitem',
    '[class*="msg-s-event-listitem"]',
  ],
  
  // Message content
  messageContent: [
    '.msg-s-event-listitem__body',
    '.msg-s-message-group__content',
    '[class*="msg-s-event-listitem__body"]',
    'p.msg-s-event-listitem__body',
  ],
  
  // Sender name
  senderName: [
    '.msg-s-message-group__name',
    '.msg-s-event-listitem__message-actor',
    '[class*="msg-s-message-group__name"]',
    '.msg-s-message-group__profile-link',
  ],
  
  // Timestamp
  messageTimestamp: [
    '.msg-s-message-list__time-heading',
    '.msg-s-message-group__timestamp',
    'time',
  ],
  
  // Participant info (in header)
  participantName: [
    '.msg-overlay-bubble-header__title',
    '.msg-thread__link-to-profile',
    '.msg-entity-lockup__entity-title',
    '[class*="msg-overlay-bubble-header__title"]',
    'h2.msg-entity-lockup__entity-title',
  ],
  
  participantHeadline: [
    '.msg-entity-lockup__entity-subtitle',
    '.msg-overlay-bubble-header__subtitle',
    '[class*="msg-entity-lockup__entity-subtitle"]',
  ],
  
  // Input area for injection
  messageInput: [
    '.msg-form__contenteditable',
    '.msg-form__message-texteditor',
    '[contenteditable="true"][role="textbox"]',
    'div.msg-form__contenteditable',
  ],
  
  // Message form container
  messageForm: [
    '.msg-form__msg-content-container',
    '.msg-form',
    '[class*="msg-form"]',
  ],
  
  // My messages (sent by me)
  myMessageIndicator: [
    '.msg-s-message-group--selfsend',
    '[class*="selfsend"]',
  ],
} as const;

/**
 * Query with fallback selectors
 */
function queryWithFallback(container: Element | Document, selectors: readonly string[]): Element | null {
  for (const selector of selectors) {
    const element = container.querySelector(selector);
    if (element) return element;
  }
  return null;
}

/**
 * Query all with fallback selectors
 */
function queryAllWithFallback(container: Element | Document, selectors: readonly string[]): Element[] {
  for (const selector of selectors) {
    const elements = container.querySelectorAll(selector);
    if (elements.length > 0) return Array.from(elements);
  }
  return [];
}

/**
 * Check if we're on the messaging page
 */
export function isMessagingPage(): boolean {
  return window.location.pathname.includes('/messaging');
}

/**
 * Get the current user's name from LinkedIn
 */
function getCurrentUserName(): string {
  // Try to get from global nav profile
  const profileLink = document.querySelector('.global-nav__me-photo, .feed-identity-module__actor-meta');
  const altText = profileLink?.getAttribute('alt');
  if (altText) return altText;
  
  // Try nav menu
  const navProfile = document.querySelector('.global-nav__me .t-14');
  if (navProfile?.textContent) return navProfile.textContent.trim();
  
  return 'Me';
}

/**
 * Extract participant information from the conversation header
 */
function extractParticipantInfo(): { name: string; headline?: string } {
  const nameElement = queryWithFallback(document, MESSAGING_SELECTORS.participantName);
  const headlineElement = queryWithFallback(document, MESSAGING_SELECTORS.participantHeadline);
  
  return {
    name: nameElement?.textContent?.trim() || 'Unknown',
    headline: headlineElement?.textContent?.trim() || undefined,
  };
}

/**
 * Determine if a message is from the current user
 */
function isMyMessage(messageElement: Element): boolean {
  // Check if the message group has self-send class
  const messageGroup = messageElement.closest('.msg-s-message-group');
  if (messageGroup) {
    for (const indicator of MESSAGING_SELECTORS.myMessageIndicator) {
      if (messageGroup.matches(indicator) || messageGroup.querySelector(indicator)) {
        return true;
      }
    }
  }
  
  // Also check the message item itself
  for (const indicator of MESSAGING_SELECTORS.myMessageIndicator) {
    if (messageElement.matches(indicator) || messageElement.closest(indicator)) {
      return true;
    }
  }
  
  return false;
}

/**
 * Extract messages from the conversation
 */
function extractMessages(maxMessages: number = 10): ChatMessage[] {
  const messages: ChatMessage[] = [];
  const currentUserName = getCurrentUserName();
  const participant = extractParticipantInfo();
  
  // Find all message elements
  const messageElements = queryAllWithFallback(document, MESSAGING_SELECTORS.messageItem);
  
  // Process messages (take last N)
  const recentMessages = messageElements.slice(-maxMessages);
  
  for (const msgElement of recentMessages) {
    // Get message content
    const contentElement = queryWithFallback(msgElement, MESSAGING_SELECTORS.messageContent);
    const content = contentElement?.textContent?.trim();
    
    if (!content || content.length < 2) continue;
    
    // Determine sender
    const isMine = isMyMessage(msgElement);
    
    // Get timestamp if available
    const timestampElement = queryWithFallback(msgElement, MESSAGING_SELECTORS.messageTimestamp);
    const timestamp = timestampElement?.textContent?.trim();
    
    messages.push({
      sender: isMine ? 'me' : 'other',
      senderName: isMine ? currentUserName : participant.name,
      content,
      timestamp,
    });
  }
  
  return messages;
}

/**
 * Analyze conversation sentiment/stage
 */
function analyzeConversationSentiment(messages: ChatMessage[]): 'positive' | 'neutral' | 'negotiating' | 'cold' {
  if (messages.length === 0) return 'neutral';
  
  const lastFewMessages = messages.slice(-5);
  const combinedText = lastFewMessages.map(m => m.content.toLowerCase()).join(' ');
  
  // Positive indicators
  const positiveWords = ['great', 'awesome', 'thanks', 'thank you', 'excellent', 'love', 'excited', 'looking forward', 'happy', 'pleased'];
  const hasPositive = positiveWords.some(word => combinedText.includes(word));
  
  // Negotiating indicators
  const negotiatingWords = ['price', 'cost', 'budget', 'deal', 'offer', 'proposal', 'terms', 'negotiate', 'discount', 'rate'];
  const hasNegotiating = negotiatingWords.some(word => combinedText.includes(word));
  
  // Cold indicators (no response, formal)
  const lastMessage = messages[messages.length - 1];
  const isWaitingForReply = lastMessage.sender === 'me';
  const isShortResponse = lastMessage.content.length < 20;
  
  if (hasNegotiating) return 'negotiating';
  if (hasPositive) return 'positive';
  if (isWaitingForReply && messages.length > 3) return 'cold';
  
  return 'neutral';
}

/**
 * Infer the main topic of conversation
 */
function inferConversationTopic(messages: ChatMessage[]): string {
  if (messages.length === 0) return 'General conversation';
  
  // Simple keyword extraction from recent messages
  const allContent = messages.map(m => m.content).join(' ').toLowerCase();
  
  const topicPatterns: { pattern: RegExp; topic: string }[] = [
    { pattern: /job|position|opportunity|hiring|role|career/i, topic: 'Job opportunity discussion' },
    { pattern: /project|collaboration|partner|work together/i, topic: 'Collaboration proposal' },
    { pattern: /service|solution|help|consulting/i, topic: 'Business services' },
    { pattern: /meeting|call|schedule|calendar|zoom|coffee/i, topic: 'Scheduling a meeting' },
    { pattern: /price|cost|budget|quote|proposal/i, topic: 'Pricing negotiation' },
    { pattern: /connect|networking|intro|introduction/i, topic: 'Networking' },
    { pattern: /question|help|advice|recommend/i, topic: 'Seeking advice' },
    { pattern: /follow.?up|checking in|touch base/i, topic: 'Follow-up conversation' },
  ];
  
  for (const { pattern, topic } of topicPatterns) {
    if (pattern.test(allContent)) {
      return topic;
    }
  }
  
  return 'Professional discussion';
}

/**
 * Main function to scrape conversation context
 */
export async function scrapeConversationContext(): Promise<ConversationContext | null> {
  try {
    if (!isMessagingPage()) {
      console.log('[LinkedIn AI] Not on messaging page');
      return null;
    }
    
    const participant = extractParticipantInfo();
    const messages = extractMessages(10);
    
    if (messages.length === 0) {
      console.log('[LinkedIn AI] No messages found in conversation');
      return null;
    }
    
    const lastMessage = messages[messages.length - 1];
    const topic = inferConversationTopic(messages);
    const sentiment = analyzeConversationSentiment(messages);
    
    console.log('[LinkedIn AI] Scraped conversation:', {
      participant: participant.name,
      messageCount: messages.length,
      topic,
      sentiment,
      lastMessageFrom: lastMessage.sender,
    });
    
    return {
      participantName: participant.name,
      participantHeadline: participant.headline,
      messages,
      topic,
      sentiment,
      lastMessageFrom: lastMessage.sender,
    };
  } catch (error) {
    console.error('[LinkedIn AI] Error scraping conversation:', error);
    return null;
  }
}

/**
 * Find the message input element for text injection
 */
export function findMessageInput(): HTMLElement | null {
  const input = queryWithFallback(document, MESSAGING_SELECTORS.messageInput);
  return input as HTMLElement | null;
}

/**
 * Find the message form container for button injection
 */
export function findMessageFormContainer(): Element | null {
  return queryWithFallback(document, MESSAGING_SELECTORS.messageForm);
}

/**
 * Inject text into the messaging input
 */
export function injectTextIntoMessageInput(text: string): boolean {
  const input = findMessageInput();
  
  if (!input) {
    console.error('[LinkedIn AI] Message input not found');
    return false;
  }
  
  try {
    // Focus the input
    input.focus();
    
    // Clear existing content
    input.innerHTML = '';
    
    // Create a paragraph element with the text
    const p = document.createElement('p');
    p.textContent = text;
    input.appendChild(p);
    
    // Dispatch events to notify LinkedIn
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
    
    // Also try setting innerText
    setTimeout(() => {
      input.innerText = text;
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }, 50);
    
    return true;
  } catch (error) {
    console.error('[LinkedIn AI] Error injecting text:', error);
    return false;
  }
}

