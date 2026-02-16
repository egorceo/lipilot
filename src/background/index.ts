import { getSettings, getPersonaObservations, addPersonaObservation, migrateFromSaaSVersion } from '../utils/storage';
import { callLLM } from '../utils/llm-client';
import type { MessageRequest, MessageResponse, GenerateRequest, RefineRequest, RefineResponse, EnrichedPostData, ScoredComment, CommentScores, RecommendationTag, MessagingRequest, ScoredReply, MessagingRecommendationTag, ConversationSummary, ToneType } from '../types';

// Run migration on startup
migrateFromSaaSVersion();

// ==================== Message Handlers ====================

chrome.runtime.onMessage.addListener((request: MessageRequest, _sender, sendResponse) => {
  if (request.type === 'GENERATE_COMMENTS') {
    handleGenerateComments(request.payload)
      .then(sendResponse)
      .catch((error) => {
        sendResponse({ success: false, error: error.message || 'Failed to generate comments' });
      });
    return true;
  }

  if (request.type === 'GENERATE_MESSAGES') {
    handleGenerateMessages(request.payload)
      .then(sendResponse)
      .catch((error) => {
        sendResponse({ success: false, error: error.message || 'Failed to generate message replies' });
      });
    return true;
  }

  if (request.type === 'REFINE_COMMENT') {
    handleRefineComment(request.payload)
      .then(sendResponse)
      .catch((error) => {
        sendResponse({ success: false, error: error.message || 'Failed to refine comment' });
      });
    return true;
  }

  if (request.type === 'CHECK_CONFIG') {
    handleCheckConfig()
      .then(sendResponse)
      .catch((error) => {
        sendResponse({ success: false, error: error.message || 'Failed to check configuration' });
      });
    return true;
  }

  if (request.type === 'STREAM_UPDATE_PERSONA') {
    handleStreamUpdatePersona(request.payload)
      .then(sendResponse)
      .catch((error) => {
        sendResponse({ success: false, error: error.message || 'Failed to update persona' });
      });
    return true;
  }

  if (request.type === 'OPEN_OPTIONS') {
    chrome.runtime.openOptionsPage();
    return false;
  }

  if (request.type === 'generate-post') {
    if (!request.data) {
      sendResponse({ success: false, error: 'Invalid request: missing data' });
      return true;
    }
    handleGeneratePost(request.data)
      .then(sendResponse)
      .catch((error) => {
        sendResponse({ success: false, error: error.message || 'Failed to generate post' });
      });
    return true;
  }

  return false;
});

// ==================== Comment Generation ====================

async function handleGenerateComments(payload: GenerateRequest): Promise<MessageResponse> {
  const { postData, tone, userThoughts, enableImageAnalysis, includeServiceOffer, serviceDescription } = payload;
  const settings = await getSettings();

  if (!settings.apiKey) {
    return { success: false, error: 'API key not configured. Please add it in the extension settings (click the gear icon).' };
  }

  const persona = settings.persona;
  const enableEmojis = settings.enableEmojis;
  const languageLevel = settings.languageLevel;

  const shouldAnalyzeImage = enableImageAnalysis && postData.imageUrl;
  const shouldIncludeService = includeServiceOffer && serviceDescription?.trim();

  // Get persona observations for learning
  const observations = await getPersonaObservations();

  const systemPrompt = buildSystemPrompt(persona, postData.threadContext?.mode === 'reply', enableEmojis, languageLevel, userThoughts, !!shouldAnalyzeImage, shouldIncludeService ? serviceDescription : undefined, observations.map(o => o.text));
  const userPrompt = buildUserPrompt(postData, tone, userThoughts, shouldIncludeService ? serviceDescription : undefined);

  // Convert image to base64 if needed
  let imageBase64: string | undefined;
  let imageMimeType: string | undefined;
  if (shouldAnalyzeImage && postData.imageUrl) {
    const imageData = await convertImageToBase64(postData.imageUrl);
    if (imageData) {
      imageBase64 = imageData.base64;
      imageMimeType = imageData.mimeType;
    }
  }

  const result = await callLLM(settings.llmProvider, settings.apiKey, settings.model, {
    systemPrompt,
    userPrompt,
    imageBase64,
    imageMimeType,
    jsonMode: true,
    temperature: 0.8,
    maxTokens: 1500,
  });

  if (!result.success) {
    return { success: false, error: result.error };
  }

  const scoredComments = parseScoredComments(result.content, includeServiceOffer);

  if (scoredComments.length === 0) {
    const comments = parseComments(result.content);
    if (comments.length === 0) {
      return { success: false, error: 'Could not parse generated comments.' };
    }
    return { success: true, comments };
  }

  return { success: true, scoredComments, comments: scoredComments.map(c => c.text) };
}

// ==================== Comment Refinement ====================

async function handleRefineComment(payload: RefineRequest): Promise<RefineResponse> {
  const { comment, refinementType } = payload;
  const settings = await getSettings();

  if (!settings.apiKey) {
    return { success: false, error: 'API key not configured. Please add it in the extension settings.' };
  }

  const systemPrompt = `You are a professional LinkedIn comment editor. You edit comments while keeping them natural and human-sounding.
RULES:
- Respond with ONLY the edited comment text, nothing else
- Never use em-dashes (\u2014). Use commas, semicolons, or " - " instead
- Never wrap the output in quotation marks
- Keep the same language as the original comment
- Preserve the same tone and meaning`;

  const refinementPrompt = refinementType === 'concise'
    ? `Make this LinkedIn comment shorter and more concise. Cut filler words, tighten the prose. Keep the core message and impact.

Comment to shorten:
${comment}

Write ONLY the shortened comment:`
    : `Rephrase this LinkedIn comment using different words. Keep the same meaning, tone, and length. Make it sound fresh.

Comment to rephrase:
${comment}

Write ONLY the rephrased comment:`;

  try {
    const result = await callLLM(settings.llmProvider, settings.apiKey, settings.model, {
      systemPrompt,
      userPrompt: refinementPrompt,
      jsonMode: false,
      temperature: 0.7,
      maxTokens: 500,
    });

    if (!result.success) {
      return { success: false, error: result.error };
    }

    let cleanedComment = result.content.trim();
    // Remove any wrapping quotes
    cleanedComment = cleanedComment.replace(/^["'"'\u201C\u201D]+|["'"'\u201C\u201D]+$/g, '');
    // Replace em-dashes
    cleanedComment = cleanedComment.replace(/\u2014/g, ' - ');
    cleanedComment = cleanedComment.trim();

    if (!cleanedComment || cleanedComment.length < 5) {
      return { success: false, error: 'Refinement returned empty result. Please try again.' };
    }

    return { success: true, comment: cleanedComment };
  } catch (error) {
    console.error('[LiPilot] Refine error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to refine comment' };
  }
}

// ==================== Configuration Check ====================

async function handleCheckConfig(): Promise<MessageResponse> {
  const settings = await getSettings();
  const hasApiKey = !!settings.apiKey?.trim();
  const hasPersona = !!settings.persona?.trim();

  if (!hasApiKey || !hasPersona) {
    const missing = [];
    if (!hasPersona) missing.push('persona');
    if (!hasApiKey) missing.push('API key');
    return {
      success: false,
      error: `Please complete your setup in settings: ${missing.join(', ')}`,
      settings,
    };
  }

  return { success: true, settings };
}

// ==================== Local Persona Learning ====================

async function handleStreamUpdatePersona(payload: {
  originalAiSuggestion: string;
  finalUserVersion: string;
}): Promise<MessageResponse> {
  try {
    const { originalAiSuggestion, finalUserVersion } = payload;

    // Skip if texts are very similar (user accepted as-is)
    const similarity = calculateSimilarity(originalAiSuggestion, finalUserVersion);
    if (similarity > 0.95) {
      return { success: true };
    }

    const settings = await getSettings();
    if (!settings.apiKey) {
      return { success: true }; // Silently skip if no API key
    }

    // Use LLM to extract observations
    const result = await callLLM(settings.llmProvider, settings.apiKey, settings.model, {
      systemPrompt: 'You analyze how a user edits AI-generated text to understand their writing preferences.',
      userPrompt: `Compare these two texts and extract 1-3 concise observations about the user's writing preferences.

Original AI suggestion: "${originalAiSuggestion}"
User's final version: "${finalUserVersion}"

Examples of good observations: "Prefers shorter comments", "Removes technical jargon", "Adds personal anecdotes", "Uses more direct language"

Respond as JSON: { "observations": ["observation1", "observation2"] }`,
      jsonMode: true,
      temperature: 0.3,
      maxTokens: 200,
    });

    if (result.success) {
      try {
        const parsed = JSON.parse(result.content);
        if (parsed.observations && Array.isArray(parsed.observations)) {
          for (const obs of parsed.observations) {
            if (typeof obs === 'string' && obs.length > 3) {
              await addPersonaObservation(obs);
            }
          }
        }
      } catch {
        // Silently ignore parse errors for learning
      }
    }

    return { success: true };
  } catch (error) {
    console.error('[LiPilot] Persona learning error:', error);
    return { success: true }; // Don't fail the main flow
  }
}

function calculateSimilarity(a: string, b: string): number {
  const wordsA = a.toLowerCase().split(/\s+/);
  const wordsB = b.toLowerCase().split(/\s+/);
  const setA = new Set(wordsA);
  const setB = new Set(wordsB);
  const intersection = new Set([...setA].filter(x => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  return union.size === 0 ? 1 : intersection.size / union.size;
}

// ==================== Messaging Mode ====================

async function handleGenerateMessages(payload: MessagingRequest): Promise<MessageResponse> {
  const { conversationContext, tone, persona, enableEmojis, languageLevel, userThoughts, includeServiceOffer, serviceDescription } = payload;
  const settings = await getSettings();

  if (!settings.apiKey) {
    return { success: false, error: 'API key not configured. Please add it in the extension settings.' };
  }

  const observations = await getPersonaObservations();
  const systemPrompt = buildMessagingSystemPrompt(persona || settings.persona, enableEmojis, languageLevel, includeServiceOffer ? serviceDescription : undefined, observations.map(o => o.text));
  const userPrompt = buildMessagingUserPrompt(conversationContext, tone, userThoughts, includeServiceOffer ? serviceDescription : undefined);

  const result = await callLLM(settings.llmProvider, settings.apiKey, settings.model, {
    systemPrompt,
    userPrompt,
    jsonMode: true,
    temperature: 0.8,
    maxTokens: 1200,
  });

  if (!result.success) {
    return { success: false, error: result.error };
  }

  const parsed = parseMessagingResponse(result.content);
  if (!parsed.replies || parsed.replies.length === 0) {
    return { success: false, error: 'Could not parse generated replies.' };
  }

  return { success: true, replies: parsed.replies, summary: parsed.summary };
}

// ==================== Post Generation ====================

async function handleGeneratePost(data: { topic: string; tone: ToneType; keyPoints?: string }): Promise<MessageResponse> {
  const settings = await getSettings();

  if (!settings.apiKey) {
    return { success: false, error: 'API key not configured. Please add it in the extension settings.' };
  }

  const systemPrompt = `You are an expert LinkedIn content strategist. Generate a compelling LinkedIn post based on the user's topic and tone.

RULES:
1. Write in the first person as the user
2. Use line breaks for readability (LinkedIn format)
3. Include 3-5 relevant hashtags at the end
4. Keep it between 150-300 words
5. NO markdown formatting (no **, no ##, no bullet points with -)
6. Use plain text with line breaks
7. Make it engaging and shareable
8. Start with a hook that grabs attention
9. ABSOLUTELY NO em-dashes (\u2014) or en-dashes (\u2013). Use commas, semicolons, or " - " instead
10. Match the persona's language and style`;

  const toneInstructions: Record<string, string> = {
    'professional': 'Write in a polished, executive tone. Data-driven, strategic insights.',
    'raw': 'Write authentically and vulnerably. Share real experiences, lessons learned. Be genuine.',
    'bold': 'Write with strong opinions. Take a stance. Be provocative but respectful.',
  };

  const userPrompt = `Generate a LinkedIn post about: ${data.topic}

Tone: ${data.tone}
${toneInstructions[data.tone] || ''}

${data.keyPoints ? `Key points to include:\n${data.keyPoints}` : ''}

Write the post directly. No preamble, no "Here's your post:" prefix.`;

  const result = await callLLM(settings.llmProvider, settings.apiKey, settings.model, {
    systemPrompt,
    userPrompt,
    jsonMode: false,
    temperature: 0.8,
    maxTokens: 1000,
  });

  if (!result.success) {
    return { success: false, error: result.error };
  }

  // Clean up markdown artifacts and em-dashes
  let post = result.content.trim();
  post = post.replace(/\*\*/g, '');
  post = post.replace(/^#+\s*/gm, '');
  post = post.replace(/^[-*]\s/gm, '');
  // Remove em-dashes and en-dashes
  post = post.replace(/\u2014/g, ' - ');
  post = post.replace(/\u2013/g, ' - ');

  return { success: true, data: { post, originalPost: result.content.trim() } };
}

// ==================== Image Conversion ====================

async function convertImageToBase64(imageUrl: string): Promise<{ base64: string; mimeType: string } | undefined> {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const mimeType = blob.type || 'image/jpeg';

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        const base64 = dataUrl.split(',')[1];
        resolve({ base64, mimeType });
      };
      reader.onerror = () => resolve(undefined);
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('[LiPilot] Error converting image to base64:', error);
    return undefined;
  }
}

// ==================== Prompt Builders ====================

function buildSystemPrompt(persona: string, isReplyMode: boolean = false, enableEmojis: boolean = false, languageLevel: string = 'fluent', userThoughts?: string, hasImage: boolean = false, serviceDescription?: string, learnedTraits?: string[]): string {
  const defaultPersona = 'You are a seasoned professional who writes high-value, thought-provoking comments on LinkedIn.';

  const emojiInstruction = enableEmojis
    ? 'Use 1-2 relevant emojis sparingly to add warmth and make the tone friendlier. Place emojis naturally, not at the beginning.'
    : 'Do NOT use any emojis. Keep the text strictly professional and text-only.';

  const imageInstruction = hasImage
    ? `

IMAGE ANALYSIS:
You have been provided with an image from the LinkedIn post. Use this visual information to:
1. Reference specific details from the image (charts, graphs, screenshots, UI elements, text in images)
2. Make your comment more specific and insightful based on what you see
3. If the image contains data or statistics, mention them to show you've analyzed the content
4. If it's a screenshot or UI mockup, comment on specific design or feature elements
5. Connect the visual content with the text content for a more comprehensive response`
    : '';

  const serviceInstruction = serviceDescription
    ? `

SERVICE BRIDGING (SUBTLE LEAD GENERATION):
The user wants to subtly showcase their expertise and services. Their service description:
"${serviceDescription}"

CRITICAL INSTRUCTIONS FOR SERVICE BRIDGING:
1. Find a NATURAL connection between the post's topic and the user's service
2. DO NOT be pushy, salesy, or spammy - absolutely NO hard-sell phrases like "Buy now", "Hire me", "Check out my services"
3. The bridge must feel organic - as if the user is genuinely contributing expertise, not advertising
4. Position the user as a thought leader who happens to have relevant experience
5. Create a subtle opening for business conversation without explicitly pitching
6. The service mention should be woven into the comment naturally, not tacked on at the end
7. Focus on adding VALUE first, with the service connection as a secondary element`
    : '';

  const languageLevelInstructions: Record<string, string> = {
    'native': `LANGUAGE LEVEL: Native/Bilingual
- Use sophisticated vocabulary, idioms, and nuanced expressions
- Complex sentence structures are fine
- Feel free to use industry jargon and advanced terminology
- Natural flow with varied rhythm and pacing`,

    'fluent': `LANGUAGE LEVEL: Fluent/Advanced (B2-C1)
- Use rich vocabulary but avoid obscure words
- Natural sentence flow with some complexity
- Occasional advanced terms are okay, but not overly academic
- Sound professional but accessible`,

    'intermediate': `LANGUAGE LEVEL: Intermediate (B1-B2)
- Use clear, straightforward vocabulary
- Prefer simpler sentence structures
- Avoid idioms, slang, and complex expressions
- Short to medium sentences (15-20 words max)
- Focus on clarity over sophistication
- Common words preferred over fancy alternatives`,

    'basic': `LANGUAGE LEVEL: Basic (A2-B1)
- Use simple, everyday words only
- Very short sentences (8-12 words)
- No idioms, no metaphors, no complex grammar
- Subject-verb-object structure preferred
- One idea per sentence
- Write like explaining to someone learning the language`,
  };

  const languageInstruction = languageLevelInstructions[languageLevel] || languageLevelInstructions['fluent'];

  const userThoughtsInstruction = userThoughts
    ? `

USER'S KEY POINT (PRIORITY):
The user wants to make this specific point or angle in their comment:
"${userThoughts}"

CRITICAL INSTRUCTIONS FOR USER'S KEY POINT:
1. You MUST incorporate this point naturally into ALL 3 comment variations
2. TRANSLATE the user's point to match the language of the original post/conversation - do NOT copy it verbatim if it's in a different language
3. This is the user's main intention - weave it organically into each response while maintaining the selected tone
4. Don't just append it; integrate it as the central thesis or key argument of the comment
5. The final comment must be entirely in the SAME language as the post being commented on`
    : '';

  const learnedTraitsSection = learnedTraits && learnedTraits.length > 0
    ? `

LEARNED USER PREFERENCES:
Based on past interactions, the user prefers:
${learnedTraits.map(t => `- ${t}`).join('\n')}
Incorporate these preferences naturally into your comments.`
    : '';

  const basePrompt = `You are a world-class LinkedIn engagement specialist. Your mission is to craft high-value, professional comments that establish the commenter as a thought leader and valuable connection.${userThoughtsInstruction}

${persona ? `The commenter's professional identity: "${persona}"` : defaultPersona}

CORE PRINCIPLES FOR HIGH-VALUE COMMENTS:

1. **Add Unique Perspective**: Share a fresh angle, contrarian view, or complementary insight that wasn't in the original post. Reference relevant industry trends, data points, or experiences.

2. **Demonstrate Expertise**: Use precise language and domain-specific knowledge. Avoid vague statements. Show you understand the nuances of the topic.

3. **Create Engagement Value**: Write comments that others will want to like or reply to. Provoke thought without being controversial. Ask questions that the author would genuinely want to answer.

4. **Sound Authentically Human**:
   - Vary sentence structure and length
   - Use natural transitions ("That said...", "What I've found...", "This reminds me of...")
   - Occasionally start with lowercase or use contractions
   - NO hashtags, NO exclamation marks overuse

5. **Be Concise but Substantive**: Aim for 2-3 impactful sentences. Every word should earn its place. Cut filler phrases like "I think that..." or "In my opinion..."

6. **Match the Conversation's Language**: Detect and respond in the SAME language as the post and existing comments (English, Spanish, French, German, etc.)

EMOJI POLICY:
${emojiInstruction}

${languageInstruction}${imageInstruction}${serviceInstruction}${learnedTraitsSection}`;

  const formattingRules = `

STRICT FORMATTING RULES:
1. **ABSOLUTELY NO EM-DASHES (\u2014)**: NEVER use the long dash character (\u2014) anywhere in ANY comment. This is a hard rule with zero exceptions. Use a comma, semicolon, period, or " - " (hyphen with spaces) instead. Examples:
   - WRONG: "Great insight\u2014this changes everything"
   - RIGHT: "Great insight, this changes everything"
   - RIGHT: "Great insight - this changes everything"
2. **NO Quotation Marks**: Do not wrap the entire comment in quotation marks. Write the comment as plain text.
3. **NO Leading Quotes**: Never start a comment with " or ' characters.
4. **Clean Output**: Each comment should be ready to paste directly - no formatting artifacts.
5. **NO En-Dashes (\u2013)**: Also avoid en-dashes. Use " - " (hyphen with spaces) instead.`;

  const discussionContext = `

DISCUSSION CONTEXT AWARENESS:
- Analyze any existing comments provided. If you see a consensus forming, you can either add a new perspective or build upon a specific point.
- Avoid repeating what others have already said. Look for gaps in the discussion.
- If multiple people are making similar points, acknowledge it subtly ("Building on what others have noted...") then add fresh value.`;

  const replyModeContext = `

REPLY MODE - THREAD CONVERSATION:
- You are replying to a SPECIFIC person in a comment thread, not the original post directly.
- Address their point directly while staying aligned with the original post's topic.
- Be conversational and direct - you're having a dialogue with this person.
- You can agree, respectfully disagree, ask follow-up questions, or extend their thinking.
- Use their name naturally if appropriate ("@Name, that's interesting because...")
- Keep replies slightly shorter than top-level comments - 1-2 sentences is often ideal for thread replies.`;

  const avoidSection = `

AVOID AT ALL COSTS:
- Generic praise ("Great post!", "Love this!", "So true!")
- Obvious statements that add no value
- Self-promotion or pitching (unless Service Bridging is enabled)
- Corporate buzzword soup
- Starting with "I"
- Sycophantic or overly agreeable tone
- Repeating points already made by other commenters
- Em-dashes (\u2014) - NEVER use this character, use commas or " - " instead
- En-dashes (\u2013) - NEVER use this character either
- Wrapping comments in quotation marks

Generate exactly 3 DISTINCT comment variations with different approaches/angles.

SCORING & OUTPUT FORMAT:
You MUST respond with a valid JSON object. For each comment, score it on three dimensions (0-10):
- engagement: How likely to get likes, replies, and start discussions
- expertise: How much domain knowledge and professional credibility is shown
- conversion: How well it bridges to business/networking opportunities (relevant even if no service is mentioned)

Also assign ONE recommendation_tag from these options:
- "Best for Engagement" - most likely to get reactions
- "Most Insightful" - demonstrates deep expertise
- "Best for Sales" - creates business opportunities
- "Safe & Professional" - reliable, conservative choice
- "Most Creative" - unique, stands out
- "Thought-Provoking" - sparks discussion

Your response MUST be a JSON object with this exact structure:
{
  "comments": [
    {
      "text": "First comment here without any surrounding quotes",
      "scores": { "engagement": 8, "expertise": 7, "conversion": 5 },
      "recommendation_tag": "Best for Engagement"
    },
    {
      "text": "Second comment here",
      "scores": { "engagement": 6, "expertise": 9, "conversion": 4 },
      "recommendation_tag": "Most Insightful"
    },
    {
      "text": "Third comment here",
      "scores": { "engagement": 7, "expertise": 6, "conversion": 8 },
      "recommendation_tag": "Best for Sales"
    }
  ]
}`;

  return basePrompt + formattingRules + discussionContext + (isReplyMode ? replyModeContext : '') + avoidSection;
}

function buildUserPrompt(postData: EnrichedPostData, tone: string, userThoughts?: string, serviceDescription?: string): string {
  const { authorName, authorHeadline, postContent, threadContext } = postData;

  const toneInstructions: Record<string, string> = {
    'professional': 'Craft executive-level commentary. Use data-driven language, reference industry frameworks, and position insights as strategic observations. Think C-suite perspective.',
    'funny': 'Deploy wit and clever observations while maintaining professional credibility. Use unexpected analogies, gentle irony, or self-aware humor. Never force jokes - if humor doesn\'t fit naturally, lean intellectual instead.',
    'question': 'Ask thought-provoking questions that reveal deep understanding of the topic. Frame questions that the author would genuinely want to explore. Avoid yes/no questions - aim for "What if..." or "How might..." formats.',
    'agree-add-value': 'Build on the post\'s thesis with a complementary case study, contrasting example, or "yes, and..." extension. Add a dimension the author didn\'t explore. Position as collaborative thought partnership.',
  };

  let prompt = `Generate 3 LinkedIn comment variations for this post:

POST AUTHOR: ${authorName}
${authorHeadline ? `AUTHOR HEADLINE: ${authorHeadline}` : ''}

POST CONTENT:
"""
${postContent}
"""`;

  if (threadContext?.existingComments && threadContext.existingComments.length > 0) {
    prompt += `

EXISTING DISCUSSION (${threadContext.existingComments.length} comments):
${threadContext.existingComments.map((c, i) =>
  `${i + 1}. ${c.authorName}${c.authorHeadline ? ` (${c.authorHeadline})` : ''}: "${c.content}"`
).join('\n')}

IMPORTANT: Do NOT repeat points already made above. Add NEW value to the discussion.`;
  }

  if (threadContext?.mode === 'reply' && threadContext.parentComment) {
    prompt += `

REPLY MODE - You are replying to this specific comment:
REPLYING TO: ${threadContext.parentComment.authorName}${threadContext.parentComment.authorHeadline ? ` (${threadContext.parentComment.authorHeadline})` : ''}
THEIR COMMENT: "${threadContext.parentComment.content}"

${threadContext.threadParticipants.length > 1 ? `Other participants in this thread: ${threadContext.threadParticipants.filter(p => p !== threadContext.parentComment?.authorName).join(', ')}` : ''}

Generate replies that directly engage with ${threadContext.parentComment.authorName}'s point.`;
  }

  prompt += `

DESIRED TONE: ${tone}
${toneInstructions[tone] || ''}`;

  if (userThoughts) {
    prompt += `

USER'S KEY POINT TO INCLUDE:
"${userThoughts}"
IMPORTANT: Translate this point to match the post's language if needed, then weave it naturally into each comment variation. The entire comment must be in the same language as the original post.`;
  }

  if (serviceDescription) {
    prompt += `

SERVICE TO SUBTLY BRIDGE:
"${serviceDescription}"
IMPORTANT: Find a natural connection to this service/expertise. Position as thought leadership, NOT advertising.`;
  }

  let nextPoint = 5;
  prompt += `

Remember to:
1. Detect the language of the conversation and write ALL comments in that SAME language
2. Make each comment variation distinct and unique
3. Keep the tone consistent with the request
4. Write naturally as if you're a real person engaging with the content`;

  if (threadContext?.mode === 'reply') {
    prompt += `\n${nextPoint}. Address the specific person you are replying to`;
    nextPoint++;
  }

  if (userThoughts) {
    prompt += `\n${nextPoint}. PRIORITIZE integrating the user's key point above`;
    nextPoint++;
  }

  if (serviceDescription) {
    prompt += `\n${nextPoint}. Subtly bridge to the user's service - establish authority, don't sell`;
  }

  return prompt;
}

// ==================== Messaging Prompts ====================

function buildMessagingSystemPrompt(persona: string, enableEmojis: boolean, languageLevel: string, serviceDescription?: string, learnedTraits?: string[]): string {
  const defaultPersona = 'You are a skilled communicator who helps craft thoughtful, effective LinkedIn messages.';

  const emojiInstruction = enableEmojis
    ? 'Use 1-2 emojis sparingly to add warmth where appropriate. Keep it professional.'
    : 'Do NOT use any emojis. Keep the text clean and professional.';

  const serviceInstruction = serviceDescription
    ? `
SERVICE BRIDGING (SUBTLE):
If appropriate, the user wants to naturally mention their services:
"${serviceDescription}"

Find an organic opportunity to position this expertise. Do NOT be pushy or salesy. Position as helpful, not promotional.`
    : '';

  const languageLevelInstructions: Record<string, string> = {
    'native': 'Use sophisticated, natural language with idioms and nuanced expressions.',
    'fluent': 'Use rich but accessible vocabulary with natural flow.',
    'intermediate': 'Use clear, straightforward language. Avoid complex expressions.',
    'basic': 'Use simple words and short sentences. Very easy to understand.',
  };

  const languageInstruction = languageLevelInstructions[languageLevel] || languageLevelInstructions['fluent'];

  const learnedTraitsSection = learnedTraits && learnedTraits.length > 0
    ? `

LEARNED USER PREFERENCES:
${learnedTraits.map(t => `- ${t}`).join('\n')}`
    : '';

  return `You are an expert business negotiator and the user's personal conversation co-pilot.

${persona ? `The user's professional identity: "${persona}"` : defaultPersona}

YOUR MISSION:
- Analyze the conversation history provided
- Craft replies that feel natural and advance the conversation toward the user's goal
- Match the tone and language already established in the chat
- Never sound robotic or templated

COMMUNICATION PRINCIPLES:
1. **Read the Room**: If the conversation is casual, stay casual. If formal, stay formal.
2. **Be Concise**: DMs should be brief and punchy. 1-3 sentences is ideal.
3. **Advance the Goal**: Every message should move the conversation forward - toward a meeting, a deal, or a stronger relationship.
4. **Be Human**: Use natural transitions, contractions, and conversational flow.
5. **Don't Overdo It**: Avoid over-enthusiasm ("So excited!", "Amazing!") unless the context warrants it.

AVOID:
- "Dear [Name]" if the conversation is already casual
- Long paragraphs - keep it short and scannable
- Repeated pleasantries if they've already been exchanged
- Sounding desperate or overly available
- Generic phrases like "I hope this finds you well" if they've already chatted

EMOJI POLICY:
${emojiInstruction}

LANGUAGE LEVEL:
${languageInstruction}
${serviceInstruction}${learnedTraitsSection}

Generate exactly 3 DISTINCT reply options with different approaches.

Your response MUST be a valid JSON object with this structure:
{
  "summary": {
    "topic": "Brief description of what this conversation is about",
    "lastMessageSummary": "What the last message was about",
    "suggestedAction": "What the user should do next (e.g., 'Schedule a call', 'Follow up on proposal')"
  },
  "replies": [
    {
      "text": "First reply option",
      "recommendation_tag": "Best Follow-up"
    },
    {
      "text": "Second reply option",
      "recommendation_tag": "Build Rapport"
    },
    {
      "text": "Third reply option",
      "recommendation_tag": "Move Forward"
    }
  ]
}

Valid recommendation_tags: "Best Follow-up", "Move Forward", "Build Rapport", "Safe Choice", "Close the Deal"`;
}

function buildMessagingUserPrompt(context: ConversationContext, tone: string, userThoughts?: string, serviceDescription?: string): string {
  const { participantName, participantHeadline, messages, topic, sentiment, lastMessageFrom } = context;

  const toneInstructions: Record<string, string> = {
    'friendly': 'Keep it warm and personable. Build rapport and show genuine interest.',
    'professional': 'Maintain a business-appropriate tone. Be respectful and to-the-point.',
    'follow-up': 'Gently remind or check in. Don\'t be pushy but show you\'re engaged.',
    'closing-deal': 'Move toward concrete next steps. Be confident and action-oriented.',
    'networking': 'Focus on building the relationship. Find common ground.',
  };

  const conversationHistory = messages
    .map((msg) => `[${msg.sender === 'me' ? 'YOU' : participantName}]: ${msg.content}`)
    .join('\n');

  let prompt = `Generate 3 reply options for this LinkedIn conversation:

CHATTING WITH: ${participantName}
${participantHeadline ? `THEIR ROLE: ${participantHeadline}` : ''}

CONVERSATION HISTORY:
${conversationHistory}

CONTEXT ANALYSIS:
- Topic: ${topic || 'General discussion'}
- Sentiment: ${sentiment || 'neutral'}
- Last message from: ${lastMessageFrom === 'me' ? 'You (waiting for their reply)' : participantName}

DESIRED TONE: ${tone}
${toneInstructions[tone] || ''}`;

  if (userThoughts) {
    prompt += `

USER'S GOAL FOR THIS REPLY:
"${userThoughts}"
IMPORTANT: Incorporate this goal naturally into the reply options.`;
  }

  if (serviceDescription) {
    prompt += `

SERVICE TO SUBTLY MENTION (if natural):
"${serviceDescription}"
Only include if there's a genuinely organic opportunity.`;
  }

  if (lastMessageFrom === 'me') {
    prompt += `

NOTE: The last message was from YOU. The user might be considering a follow-up since there's no response yet. Be mindful of not appearing pushy.`;
  }

  return prompt;
}

// ==================== Response Parsers ====================

function parseScoredComments(content: string, prioritizeConversion: boolean = false): ScoredComment[] {
  try {
    const parsed = JSON.parse(content);

    if (!parsed.comments || !Array.isArray(parsed.comments)) {
      return [];
    }

    const validTags: RecommendationTag[] = [
      'Best for Engagement', 'Most Insightful', 'Best for Sales',
      'Safe & Professional', 'Most Creative', 'Thought-Provoking'
    ];

    const scoredComments: ScoredComment[] = parsed.comments
      .filter((c: unknown) => {
        if (!c || typeof c !== 'object') return false;
        const comment = c as Record<string, unknown>;
        return typeof comment.text === 'string' && (comment.text as string).length > 10;
      })
      .map((c: Record<string, unknown>) => {
        const scores = c.scores as Record<string, unknown> | undefined;
        const rawTag = c.recommendation_tag as string | undefined;

        const normalizedScores: CommentScores = {
          engagement: normalizeScore(scores?.engagement),
          expertise: normalizeScore(scores?.expertise),
          conversion: normalizeScore(scores?.conversion),
        };

        const recommendationTag: RecommendationTag = validTags.includes(rawTag as RecommendationTag)
          ? (rawTag as RecommendationTag)
          : 'Safe & Professional';

        return {
          text: cleanComment(c.text as string),
          scores: normalizedScores,
          recommendationTag,
          isRecommended: false,
        } as ScoredComment;
      })
      .slice(0, 3);

    if (scoredComments.length > 0) {
      const sortedByScore = [...scoredComments].sort((a, b) => {
        if (prioritizeConversion) {
          return b.scores.conversion - a.scores.conversion;
        }
        return b.scores.engagement - a.scores.engagement;
      });

      const bestIndex = scoredComments.findIndex(c => c.text === sortedByScore[0].text);
      if (bestIndex !== -1) {
        scoredComments[bestIndex].isRecommended = true;
      }
    }

    return scoredComments;
  } catch {
    return [];
  }
}

function normalizeScore(value: unknown): number {
  if (typeof value === 'number') {
    return Math.max(0, Math.min(10, Math.round(value)));
  }
  if (typeof value === 'string') {
    const num = parseFloat(value);
    if (!isNaN(num)) {
      return Math.max(0, Math.min(10, Math.round(num)));
    }
  }
  return 5;
}

function parseComments(content: string): string[] {
  const comments: string[] = [];

  const commentPattern = /COMMENT\s*\d+:\s*([\s\S]*?)(?=COMMENT\s*\d+:|$)/gi;
  let match;

  while ((match = commentPattern.exec(content)) !== null) {
    const comment = match[1].trim();
    if (comment && comment.length > 10) {
      comments.push(comment);
    }
  }

  if (comments.length === 0) {
    const numberedPattern = /(?:^|\n)\s*(?:\d+[\.\)]\s*)([\s\S]*?)(?=(?:^|\n)\s*\d+[\.\)]|$)/gm;
    while ((match = numberedPattern.exec(content)) !== null) {
      const comment = match[1].trim();
      if (comment && comment.length > 10) {
        comments.push(comment);
      }
    }
  }

  if (comments.length === 0) {
    const paragraphs = content.split(/\n\s*\n/).filter((p) => p.trim().length > 10);
    comments.push(...paragraphs.slice(0, 3));
  }

  return comments.slice(0, 3).map((c) => cleanComment(c));
}

function cleanComment(comment: string): string {
  let cleaned = comment.trim();
  // Remove wrapping quotation marks (all types)
  cleaned = cleaned.replace(/^["'"'\u201C\u201D\u2018\u2019]+|["'"'\u201C\u201D\u2018\u2019]+$/g, '');
  // Replace em-dashes and en-dashes with " - "
  cleaned = cleaned.replace(/\u2014/g, ' - ');
  cleaned = cleaned.replace(/\u2013/g, ' - ');
  // Fix double spaces from replacements
  cleaned = cleaned.replace(/\s+/g, ' ');
  cleaned = cleaned.trim();
  return cleaned;
}

function parseMessagingResponse(content: string): { replies: ScoredReply[]; summary?: ConversationSummary } {
  try {
    const parsed = JSON.parse(content);

    const validTags: MessagingRecommendationTag[] = [
      'Best Follow-up', 'Move Forward', 'Build Rapport', 'Safe Choice', 'Close the Deal',
    ];

    const replies: ScoredReply[] = (parsed.replies || [])
      .filter((r: unknown) => {
        if (!r || typeof r !== 'object') return false;
        const reply = r as Record<string, unknown>;
        return typeof reply.text === 'string' && (reply.text as string).length > 5;
      })
      .map((r: Record<string, unknown>) => ({
        text: cleanComment(r.text as string),
        recommendationTag: validTags.includes(r.recommendation_tag as MessagingRecommendationTag)
          ? (r.recommendation_tag as MessagingRecommendationTag)
          : 'Safe Choice',
      }))
      .slice(0, 3);

    const summary: ConversationSummary | undefined = parsed.summary ? {
      topic: parsed.summary.topic || 'Professional discussion',
      lastMessageSummary: parsed.summary.lastMessageSummary || '',
      suggestedAction: parsed.summary.suggestedAction || 'Continue the conversation',
    } : undefined;

    return { replies, summary };
  } catch {
    return { replies: [] };
  }
}
