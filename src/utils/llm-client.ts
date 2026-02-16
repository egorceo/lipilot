import type { LLMProvider } from '../types';

export interface LLMRequest {
  systemPrompt: string;
  userPrompt: string;
  imageBase64?: string;
  imageMimeType?: string;
  jsonMode: boolean;
  temperature?: number;
  maxTokens?: number;
}

export interface LLMResponse {
  content: string;
  success: boolean;
  error?: string;
}

export async function callLLM(
  provider: LLMProvider,
  apiKey: string,
  model: string,
  request: LLMRequest
): Promise<LLMResponse> {
  if (!apiKey) {
    return { content: '', success: false, error: 'API key not configured. Please add it in the extension settings.' };
  }

  try {
    switch (provider) {
      case 'openai':
        return await callOpenAI(apiKey, model, request);
      case 'anthropic':
        return await callAnthropic(apiKey, model, request);
      case 'gemini':
        return await callGemini(apiKey, model, request);
      default:
        return { content: '', success: false, error: `Unknown provider: ${provider}` };
    }
  } catch (error) {
    console.error(`[LiPilot] ${provider} API error:`, error);
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return { content: '', success: false, error: 'Network error. Please check your internet connection.' };
    }
    return {
      content: '',
      success: false,
      error: error instanceof Error ? error.message : 'Failed to call LLM API',
    };
  }
}

// ==================== OpenAI ====================

async function callOpenAI(apiKey: string, model: string, request: LLMRequest): Promise<LLMResponse> {
  type ContentPart = { type: 'text'; text: string } | { type: 'image_url'; image_url: { url: string; detail: string } };

  const messages: { role: string; content: string | ContentPart[] }[] = [
    { role: 'system', content: request.systemPrompt },
  ];

  if (request.imageBase64 && request.imageMimeType) {
    messages.push({
      role: 'user',
      content: [
        { type: 'text', text: request.userPrompt },
        {
          type: 'image_url',
          image_url: {
            url: `data:${request.imageMimeType};base64,${request.imageBase64}`,
            detail: 'auto',
          },
        },
      ],
    });
  } else {
    messages.push({ role: 'user', content: request.userPrompt });
  }

  const body: Record<string, unknown> = {
    model,
    messages,
    temperature: request.temperature ?? 0.8,
    max_completion_tokens: request.maxTokens ?? 1500,
  };

  if (request.jsonMode) {
    body.response_format = { type: 'json_object' };
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    return handleHttpError(response, 'OpenAI');
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    return { content: '', success: false, error: 'No response generated from OpenAI.' };
  }

  return { content, success: true };
}

// ==================== Anthropic ====================

async function callAnthropic(apiKey: string, model: string, request: LLMRequest): Promise<LLMResponse> {
  let systemPrompt = request.systemPrompt;
  if (request.jsonMode) {
    systemPrompt += '\n\nIMPORTANT: You must respond with a valid JSON object. Do not include any text before or after the JSON.';
  }

  type ContentBlock = { type: 'text'; text: string } | { type: 'image'; source: { type: 'base64'; media_type: string; data: string } };

  const content: ContentBlock[] = [{ type: 'text', text: request.userPrompt }];

  if (request.imageBase64 && request.imageMimeType) {
    content.unshift({
      type: 'image',
      source: {
        type: 'base64',
        media_type: request.imageMimeType,
        data: request.imageBase64,
      },
    });
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model,
      system: systemPrompt,
      messages: [{ role: 'user', content }],
      max_tokens: request.maxTokens ?? 1500,
      temperature: request.temperature ?? 0.8,
    }),
  });

  if (!response.ok) {
    return handleHttpError(response, 'Anthropic');
  }

  const data = await response.json();
  const text = data.content?.[0]?.text;

  if (!text) {
    return { content: '', success: false, error: 'No response generated from Anthropic.' };
  }

  return { content: text, success: true };
}

// ==================== Gemini ====================

async function callGemini(apiKey: string, model: string, request: LLMRequest): Promise<LLMResponse> {
  type Part = { text: string } | { inlineData: { mimeType: string; data: string } };

  const parts: Part[] = [];

  if (request.imageBase64 && request.imageMimeType) {
    parts.push({
      inlineData: {
        mimeType: request.imageMimeType,
        data: request.imageBase64,
      },
    });
  }

  parts.push({ text: request.userPrompt });

  const generationConfig: Record<string, unknown> = {
    temperature: request.temperature ?? 0.8,
    maxOutputTokens: request.maxTokens ?? 1500,
  };

  if (request.jsonMode) {
    generationConfig.responseMimeType = 'application/json';
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: request.systemPrompt }] },
        contents: [{ parts }],
        generationConfig,
      }),
    }
  );

  if (!response.ok) {
    return handleHttpError(response, 'Gemini');
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    const blockReason = data.candidates?.[0]?.finishReason;
    if (blockReason === 'SAFETY') {
      return { content: '', success: false, error: 'Response blocked by Gemini safety filters. Try rephrasing.' };
    }
    return { content: '', success: false, error: 'No response generated from Gemini.' };
  }

  return { content: text, success: true };
}

// ==================== Error Handling ====================

async function handleHttpError(response: Response, provider: string): Promise<LLMResponse> {
  const errorData = await response.json().catch(() => ({}));
  const errorMessage = errorData.error?.message || errorData.error?.type || `API request failed with status ${response.status}`;

  if (response.status === 401) {
    return { content: '', success: false, error: `Invalid API key for ${provider}. Please check your API key in settings.` };
  }
  if (response.status === 429) {
    return { content: '', success: false, error: 'Rate limit exceeded. Please try again in a few moments.' };
  }
  if (response.status === 500 || response.status === 503) {
    return { content: '', success: false, error: `${provider} service is temporarily unavailable. Please try again.` };
  }

  return { content: '', success: false, error: errorMessage };
}

// ==================== Test Connection ====================

export async function testLLMConnection(
  provider: LLMProvider,
  apiKey: string,
  model: string
): Promise<{ success: boolean; error?: string }> {
  const result = await callLLM(provider, apiKey, model, {
    systemPrompt: 'You are a helpful assistant.',
    userPrompt: 'Say "OK" and nothing else.',
    jsonMode: false,
    temperature: 0,
    maxTokens: 10,
  });

  return { success: result.success, error: result.error };
}
