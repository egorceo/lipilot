import{m as A,g as f,a as O,f as C}from"./storage-BROYPw1S.js";import{c as w}from"./llm-client-CDVh1Nha.js";A();chrome.runtime.onMessage.addListener((s,e,i)=>s.type==="GENERATE_COMMENTS"?(x(s.payload).then(i).catch(a=>{i({success:!1,error:a.message||"Failed to generate comments"})}),!0):s.type==="GENERATE_MESSAGES"?(M(s.payload).then(i).catch(a=>{i({success:!1,error:a.message||"Failed to generate message replies"})}),!0):s.type==="REFINE_COMMENT"?(P(s.payload).then(i).catch(a=>{i({success:!1,error:a.message||"Failed to refine comment"})}),!0):s.type==="CHECK_CONFIG"?(L().then(i).catch(a=>{i({success:!1,error:a.message||"Failed to check configuration"})}),!0):s.type==="STREAM_UPDATE_PERSONA"?(R(s.payload).then(i).catch(a=>{i({success:!1,error:a.message||"Failed to update persona"})}),!0):s.type==="OPEN_OPTIONS"?(chrome.runtime.openOptionsPage(),!1):s.type==="generate-post"?s.data?(U(s.data).then(i).catch(a=>{i({success:!1,error:a.message||"Failed to generate post"})}),!0):(i({success:!1,error:"Invalid request: missing data"}),!0):!1);async function x(s){var T;const{postData:e,tone:i,userThoughts:a,enableImageAnalysis:r,includeServiceOffer:o,serviceDescription:n}=s,t=await f();if(!t.apiKey)return{success:!1,error:"API key not configured. Please add it in the extension settings (click the gear icon)."};const l=t.persona,c=t.enableEmojis,h=t.languageLevel,m=r&&e.imageUrl,u=o&&(n==null?void 0:n.trim()),p=await O(),g=G(l,((T=e.threadContext)==null?void 0:T.mode)==="reply",c,h,a,!!m,u?n:void 0,p.map(d=>d.text)),y=B(e,i,a,u?n:void 0);let I,S;if(m&&e.imageUrl){const d=await $(e.imageUrl);d&&(I=d.base64,S=d.mimeType)}const v=await w(t.llmProvider,t.apiKey,t.model,{systemPrompt:g,userPrompt:y,imageBase64:I,imageMimeType:S,jsonMode:!0,temperature:.8,maxTokens:1500});if(!v.success)return{success:!1,error:v.error};const E=Y(v.content,o);if(E.length===0){const d=j(v.content);return d.length===0?{success:!1,error:"Could not parse generated comments."}:{success:!0,comments:d}}return{success:!0,scoredComments:E,comments:E.map(d=>d.text)}}async function P(s){const{comment:e,refinementType:i}=s,a=await f();if(!a.apiKey)return{success:!1,error:"API key not configured. Please add it in the extension settings."};const r=`You are a professional LinkedIn comment editor. You edit comments while keeping them natural and human-sounding.
RULES:
- Respond with ONLY the edited comment text, nothing else
- Never use em-dashes (—). Use commas, semicolons, or " - " instead
- Never wrap the output in quotation marks
- Keep the same language as the original comment
- Preserve the same tone and meaning`,o=i==="concise"?`Make this LinkedIn comment shorter and more concise. Cut filler words, tighten the prose. Keep the core message and impact.

Comment to shorten:
${e}

Write ONLY the shortened comment:`:`Rephrase this LinkedIn comment using different words. Keep the same meaning, tone, and length. Make it sound fresh.

Comment to rephrase:
${e}

Write ONLY the rephrased comment:`;try{const n=await w(a.llmProvider,a.apiKey,a.model,{systemPrompt:r,userPrompt:o,jsonMode:!1,temperature:.7,maxTokens:500});if(!n.success)return{success:!1,error:n.error};let t=n.content.trim();return t=t.replace(/^["'"'\u201C\u201D]+|["'"'\u201C\u201D]+$/g,""),t=t.replace(/\u2014/g," - "),t=t.trim(),!t||t.length<5?{success:!1,error:"Refinement returned empty result. Please try again."}:{success:!0,comment:t}}catch(n){return console.error("[LiPilot] Refine error:",n),{success:!1,error:n instanceof Error?n.message:"Failed to refine comment"}}}async function L(){var a,r;const s=await f(),e=!!((a=s.apiKey)!=null&&a.trim()),i=!!((r=s.persona)!=null&&r.trim());if(!e||!i){const o=[];return i||o.push("persona"),e||o.push("API key"),{success:!1,error:`Please complete your setup in settings: ${o.join(", ")}`,settings:s}}return{success:!0,settings:s}}async function R(s){try{const{originalAiSuggestion:e,finalUserVersion:i}=s;if(k(e,i)>.95)return{success:!0};const r=await f();if(!r.apiKey)return{success:!0};const o=await w(r.llmProvider,r.apiKey,r.model,{systemPrompt:"You analyze how a user edits AI-generated text to understand their writing preferences.",userPrompt:`Compare these two texts and extract 1-3 concise observations about the user's writing preferences.

Original AI suggestion: "${e}"
User's final version: "${i}"

Examples of good observations: "Prefers shorter comments", "Removes technical jargon", "Adds personal anecdotes", "Uses more direct language"

Respond as JSON: { "observations": ["observation1", "observation2"] }`,jsonMode:!0,temperature:.3,maxTokens:200});if(o.success)try{const n=JSON.parse(o.content);if(n.observations&&Array.isArray(n.observations))for(const t of n.observations)typeof t=="string"&&t.length>3&&await C(t)}catch{}return{success:!0}}catch(e){return console.error("[LiPilot] Persona learning error:",e),{success:!0}}}function k(s,e){const i=s.toLowerCase().split(/\s+/),a=e.toLowerCase().split(/\s+/),r=new Set(i),o=new Set(a),n=new Set([...r].filter(l=>o.has(l))),t=new Set([...r,...o]);return t.size===0?1:n.size/t.size}async function M(s){const{conversationContext:e,tone:i,persona:a,enableEmojis:r,languageLevel:o,userThoughts:n,includeServiceOffer:t,serviceDescription:l}=s,c=await f();if(!c.apiKey)return{success:!1,error:"API key not configured. Please add it in the extension settings."};const h=await O(),m=D(a||c.persona,r,o,t?l:void 0,h.map(y=>y.text)),u=F(e,i,n,t?l:void 0),p=await w(c.llmProvider,c.apiKey,c.model,{systemPrompt:m,userPrompt:u,jsonMode:!0,temperature:.8,maxTokens:1200});if(!p.success)return{success:!1,error:p.error};const g=H(p.content);return!g.replies||g.replies.length===0?{success:!1,error:"Could not parse generated replies."}:{success:!0,replies:g.replies,summary:g.summary}}async function U(s){const e=await f();if(!e.apiKey)return{success:!1,error:"API key not configured. Please add it in the extension settings."};const i=`You are an expert LinkedIn content strategist. Generate a compelling LinkedIn post based on the user's topic and tone.

RULES:
1. Write in the first person as the user
2. Use line breaks for readability (LinkedIn format)
3. Include 3-5 relevant hashtags at the end
4. Keep it between 150-300 words
5. NO markdown formatting (no **, no ##, no bullet points with -)
6. Use plain text with line breaks
7. Make it engaging and shareable
8. Start with a hook that grabs attention
9. ABSOLUTELY NO em-dashes (—) or en-dashes (–). Use commas, semicolons, or " - " instead
10. Match the persona's language and style`,a={professional:"Write in a polished, executive tone. Data-driven, strategic insights.",raw:"Write authentically and vulnerably. Share real experiences, lessons learned. Be genuine.",bold:"Write with strong opinions. Take a stance. Be provocative but respectful."},r=`Generate a LinkedIn post about: ${s.topic}

Tone: ${s.tone}
${a[s.tone]||""}

${s.keyPoints?`Key points to include:
${s.keyPoints}`:""}

Write the post directly. No preamble, no "Here's your post:" prefix.`,o=await w(e.llmProvider,e.apiKey,e.model,{systemPrompt:i,userPrompt:r,jsonMode:!1,temperature:.8,maxTokens:1e3});if(!o.success)return{success:!1,error:o.error};let n=o.content.trim();return n=n.replace(/\*\*/g,""),n=n.replace(/^#+\s*/gm,""),n=n.replace(/^[-*]\s/gm,""),n=n.replace(/\u2014/g," - "),n=n.replace(/\u2013/g," - "),{success:!0,data:{post:n,originalPost:o.content.trim()}}}async function $(s){try{const i=await(await fetch(s)).blob(),a=i.type||"image/jpeg";return new Promise(r=>{const o=new FileReader;o.onloadend=()=>{const t=o.result.split(",")[1];r({base64:t,mimeType:a})},o.onerror=()=>r(void 0),o.readAsDataURL(i)})}catch(e){console.error("[LiPilot] Error converting image to base64:",e);return}}function G(s,e=!1,i=!1,a="fluent",r,o=!1,n,t){const l="You are a seasoned professional who writes high-value, thought-provoking comments on LinkedIn.",c=i?"Use 1-2 relevant emojis sparingly to add warmth and make the tone friendlier. Place emojis naturally, not at the beginning.":"Do NOT use any emojis. Keep the text strictly professional and text-only.",h=o?`

IMAGE ANALYSIS:
You have been provided with an image from the LinkedIn post. Use this visual information to:
1. Reference specific details from the image (charts, graphs, screenshots, UI elements, text in images)
2. Make your comment more specific and insightful based on what you see
3. If the image contains data or statistics, mention them to show you've analyzed the content
4. If it's a screenshot or UI mockup, comment on specific design or feature elements
5. Connect the visual content with the text content for a more comprehensive response`:"",m=n?`

SERVICE BRIDGING (SUBTLE LEAD GENERATION):
The user wants to subtly showcase their expertise and services. Their service description:
"${n}"

CRITICAL INSTRUCTIONS FOR SERVICE BRIDGING:
1. Find a NATURAL connection between the post's topic and the user's service
2. DO NOT be pushy, salesy, or spammy - absolutely NO hard-sell phrases like "Buy now", "Hire me", "Check out my services"
3. The bridge must feel organic - as if the user is genuinely contributing expertise, not advertising
4. Position the user as a thought leader who happens to have relevant experience
5. Create a subtle opening for business conversation without explicitly pitching
6. The service mention should be woven into the comment naturally, not tacked on at the end
7. Focus on adding VALUE first, with the service connection as a secondary element`:"",u={native:`LANGUAGE LEVEL: Native/Bilingual
- Use sophisticated vocabulary, idioms, and nuanced expressions
- Complex sentence structures are fine
- Feel free to use industry jargon and advanced terminology
- Natural flow with varied rhythm and pacing`,fluent:`LANGUAGE LEVEL: Fluent/Advanced (B2-C1)
- Use rich vocabulary but avoid obscure words
- Natural sentence flow with some complexity
- Occasional advanced terms are okay, but not overly academic
- Sound professional but accessible`,intermediate:`LANGUAGE LEVEL: Intermediate (B1-B2)
- Use clear, straightforward vocabulary
- Prefer simpler sentence structures
- Avoid idioms, slang, and complex expressions
- Short to medium sentences (15-20 words max)
- Focus on clarity over sophistication
- Common words preferred over fancy alternatives`,basic:`LANGUAGE LEVEL: Basic (A2-B1)
- Use simple, everyday words only
- Very short sentences (8-12 words)
- No idioms, no metaphors, no complex grammar
- Subject-verb-object structure preferred
- One idea per sentence
- Write like explaining to someone learning the language`},p=u[a]||u.fluent,g=r?`

USER'S KEY POINT (PRIORITY):
The user wants to make this specific point or angle in their comment:
"${r}"

CRITICAL INSTRUCTIONS FOR USER'S KEY POINT:
1. You MUST incorporate this point naturally into ALL 3 comment variations
2. TRANSLATE the user's point to match the language of the original post/conversation - do NOT copy it verbatim if it's in a different language
3. This is the user's main intention - weave it organically into each response while maintaining the selected tone
4. Don't just append it; integrate it as the central thesis or key argument of the comment
5. The final comment must be entirely in the SAME language as the post being commented on`:"",y=t&&t.length>0?`

LEARNED USER PREFERENCES:
Based on past interactions, the user prefers:
${t.map(d=>`- ${d}`).join(`
`)}
Incorporate these preferences naturally into your comments.`:"";return`You are a world-class LinkedIn engagement specialist. Your mission is to craft high-value, professional comments that establish the commenter as a thought leader and valuable connection.${g}

${s?`The commenter's professional identity: "${s}"`:l}

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
${c}

${p}${h}${m}${y}`+`

STRICT FORMATTING RULES:
1. **ABSOLUTELY NO EM-DASHES (—)**: NEVER use the long dash character (—) anywhere in ANY comment. This is a hard rule with zero exceptions. Use a comma, semicolon, period, or " - " (hyphen with spaces) instead. Examples:
   - WRONG: "Great insight—this changes everything"
   - RIGHT: "Great insight, this changes everything"
   - RIGHT: "Great insight - this changes everything"
2. **NO Quotation Marks**: Do not wrap the entire comment in quotation marks. Write the comment as plain text.
3. **NO Leading Quotes**: Never start a comment with " or ' characters.
4. **Clean Output**: Each comment should be ready to paste directly - no formatting artifacts.
5. **NO En-Dashes (–)**: Also avoid en-dashes. Use " - " (hyphen with spaces) instead.`+`

DISCUSSION CONTEXT AWARENESS:
- Analyze any existing comments provided. If you see a consensus forming, you can either add a new perspective or build upon a specific point.
- Avoid repeating what others have already said. Look for gaps in the discussion.
- If multiple people are making similar points, acknowledge it subtly ("Building on what others have noted...") then add fresh value.`+(e?`

REPLY MODE - THREAD CONVERSATION:
- You are replying to a SPECIFIC person in a comment thread, not the original post directly.
- Address their point directly while staying aligned with the original post's topic.
- Be conversational and direct - you're having a dialogue with this person.
- You can agree, respectfully disagree, ask follow-up questions, or extend their thinking.
- Use their name naturally if appropriate ("@Name, that's interesting because...")
- Keep replies slightly shorter than top-level comments - 1-2 sentences is often ideal for thread replies.`:"")+`

AVOID AT ALL COSTS:
- Generic praise ("Great post!", "Love this!", "So true!")
- Obvious statements that add no value
- Self-promotion or pitching (unless Service Bridging is enabled)
- Corporate buzzword soup
- Starting with "I"
- Sycophantic or overly agreeable tone
- Repeating points already made by other commenters
- Em-dashes (—) - NEVER use this character, use commas or " - " instead
- En-dashes (–) - NEVER use this character either
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
}`}function B(s,e,i,a){const{authorName:r,authorHeadline:o,postContent:n,threadContext:t}=s,l={professional:"Craft executive-level commentary. Use data-driven language, reference industry frameworks, and position insights as strategic observations. Think C-suite perspective.",funny:"Deploy wit and clever observations while maintaining professional credibility. Use unexpected analogies, gentle irony, or self-aware humor. Never force jokes - if humor doesn't fit naturally, lean intellectual instead.",question:'Ask thought-provoking questions that reveal deep understanding of the topic. Frame questions that the author would genuinely want to explore. Avoid yes/no questions - aim for "What if..." or "How might..." formats.',"agree-add-value":`Build on the post's thesis with a complementary case study, contrasting example, or "yes, and..." extension. Add a dimension the author didn't explore. Position as collaborative thought partnership.`};let c=`Generate 3 LinkedIn comment variations for this post:

POST AUTHOR: ${r}
${o?`AUTHOR HEADLINE: ${o}`:""}

POST CONTENT:
"""
${n}
"""`;t!=null&&t.existingComments&&t.existingComments.length>0&&(c+=`

EXISTING DISCUSSION (${t.existingComments.length} comments):
${t.existingComments.map((m,u)=>`${u+1}. ${m.authorName}${m.authorHeadline?` (${m.authorHeadline})`:""}: "${m.content}"`).join(`
`)}

IMPORTANT: Do NOT repeat points already made above. Add NEW value to the discussion.`),(t==null?void 0:t.mode)==="reply"&&t.parentComment&&(c+=`

REPLY MODE - You are replying to this specific comment:
REPLYING TO: ${t.parentComment.authorName}${t.parentComment.authorHeadline?` (${t.parentComment.authorHeadline})`:""}
THEIR COMMENT: "${t.parentComment.content}"

${t.threadParticipants.length>1?`Other participants in this thread: ${t.threadParticipants.filter(m=>{var u;return m!==((u=t.parentComment)==null?void 0:u.authorName)}).join(", ")}`:""}

Generate replies that directly engage with ${t.parentComment.authorName}'s point.`),c+=`

DESIRED TONE: ${e}
${l[e]||""}`,i&&(c+=`

USER'S KEY POINT TO INCLUDE:
"${i}"
IMPORTANT: Translate this point to match the post's language if needed, then weave it naturally into each comment variation. The entire comment must be in the same language as the original post.`),a&&(c+=`

SERVICE TO SUBTLY BRIDGE:
"${a}"
IMPORTANT: Find a natural connection to this service/expertise. Position as thought leadership, NOT advertising.`);let h=5;return c+=`

Remember to:
1. Detect the language of the conversation and write ALL comments in that SAME language
2. Make each comment variation distinct and unique
3. Keep the tone consistent with the request
4. Write naturally as if you're a real person engaging with the content`,(t==null?void 0:t.mode)==="reply"&&(c+=`
${h}. Address the specific person you are replying to`,h++),i&&(c+=`
${h}. PRIORITIZE integrating the user's key point above`,h++),a&&(c+=`
${h}. Subtly bridge to the user's service - establish authority, don't sell`),c}function D(s,e,i,a,r){const o="You are a skilled communicator who helps craft thoughtful, effective LinkedIn messages.",n=e?"Use 1-2 emojis sparingly to add warmth where appropriate. Keep it professional.":"Do NOT use any emojis. Keep the text clean and professional.",t=a?`
SERVICE BRIDGING (SUBTLE):
If appropriate, the user wants to naturally mention their services:
"${a}"

Find an organic opportunity to position this expertise. Do NOT be pushy or salesy. Position as helpful, not promotional.`:"",l={native:"Use sophisticated, natural language with idioms and nuanced expressions.",fluent:"Use rich but accessible vocabulary with natural flow.",intermediate:"Use clear, straightforward language. Avoid complex expressions.",basic:"Use simple words and short sentences. Very easy to understand."},c=l[i]||l.fluent,h=r&&r.length>0?`

LEARNED USER PREFERENCES:
${r.map(m=>`- ${m}`).join(`
`)}`:"";return`You are an expert business negotiator and the user's personal conversation co-pilot.

${s?`The user's professional identity: "${s}"`:o}

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
${n}

LANGUAGE LEVEL:
${c}
${t}${h}

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

Valid recommendation_tags: "Best Follow-up", "Move Forward", "Build Rapport", "Safe Choice", "Close the Deal"`}function F(s,e,i,a){const{participantName:r,participantHeadline:o,messages:n,topic:t,sentiment:l,lastMessageFrom:c}=s,h={friendly:"Keep it warm and personable. Build rapport and show genuine interest.",professional:"Maintain a business-appropriate tone. Be respectful and to-the-point.","follow-up":"Gently remind or check in. Don't be pushy but show you're engaged.","closing-deal":"Move toward concrete next steps. Be confident and action-oriented.",networking:"Focus on building the relationship. Find common ground."},m=n.map(p=>`[${p.sender==="me"?"YOU":r}]: ${p.content}`).join(`
`);let u=`Generate 3 reply options for this LinkedIn conversation:

CHATTING WITH: ${r}
${o?`THEIR ROLE: ${o}`:""}

CONVERSATION HISTORY:
${m}

CONTEXT ANALYSIS:
- Topic: ${t||"General discussion"}
- Sentiment: ${l||"neutral"}
- Last message from: ${c==="me"?"You (waiting for their reply)":r}

DESIRED TONE: ${e}
${h[e]||""}`;return i&&(u+=`

USER'S GOAL FOR THIS REPLY:
"${i}"
IMPORTANT: Incorporate this goal naturally into the reply options.`),a&&(u+=`

SERVICE TO SUBTLY MENTION (if natural):
"${a}"
Only include if there's a genuinely organic opportunity.`),c==="me"&&(u+=`

NOTE: The last message was from YOU. The user might be considering a follow-up since there's no response yet. Be mindful of not appearing pushy.`),u}function Y(s,e=!1){try{const i=JSON.parse(s);if(!i.comments||!Array.isArray(i.comments))return[];const a=["Best for Engagement","Most Insightful","Best for Sales","Safe & Professional","Most Creative","Thought-Provoking"],r=i.comments.filter(o=>{if(!o||typeof o!="object")return!1;const n=o;return typeof n.text=="string"&&n.text.length>10}).map(o=>{const n=o.scores,t=o.recommendation_tag,l={engagement:b(n==null?void 0:n.engagement),expertise:b(n==null?void 0:n.expertise),conversion:b(n==null?void 0:n.conversion)},c=a.includes(t)?t:"Safe & Professional";return{text:N(o.text),scores:l,recommendationTag:c,isRecommended:!1}}).slice(0,3);if(r.length>0){const o=[...r].sort((t,l)=>e?l.scores.conversion-t.scores.conversion:l.scores.engagement-t.scores.engagement),n=r.findIndex(t=>t.text===o[0].text);n!==-1&&(r[n].isRecommended=!0)}return r}catch{return[]}}function b(s){if(typeof s=="number")return Math.max(0,Math.min(10,Math.round(s)));if(typeof s=="string"){const e=parseFloat(s);if(!isNaN(e))return Math.max(0,Math.min(10,Math.round(e)))}return 5}function j(s){const e=[],i=/COMMENT\s*\d+:\s*([\s\S]*?)(?=COMMENT\s*\d+:|$)/gi;let a;for(;(a=i.exec(s))!==null;){const r=a[1].trim();r&&r.length>10&&e.push(r)}if(e.length===0){const r=/(?:^|\n)\s*(?:\d+[\.\)]\s*)([\s\S]*?)(?=(?:^|\n)\s*\d+[\.\)]|$)/gm;for(;(a=r.exec(s))!==null;){const o=a[1].trim();o&&o.length>10&&e.push(o)}}if(e.length===0){const r=s.split(/\n\s*\n/).filter(o=>o.trim().length>10);e.push(...r.slice(0,3))}return e.slice(0,3).map(r=>N(r))}function N(s){let e=s.trim();return e=e.replace(/^["'"'\u201C\u201D\u2018\u2019]+|["'"'\u201C\u201D\u2018\u2019]+$/g,""),e=e.replace(/\u2014/g," - "),e=e.replace(/\u2013/g," - "),e=e.replace(/\s+/g," "),e=e.trim(),e}function H(s){try{const e=JSON.parse(s),i=["Best Follow-up","Move Forward","Build Rapport","Safe Choice","Close the Deal"],a=(e.replies||[]).filter(o=>{if(!o||typeof o!="object")return!1;const n=o;return typeof n.text=="string"&&n.text.length>5}).map(o=>({text:N(o.text),recommendationTag:i.includes(o.recommendation_tag)?o.recommendation_tag:"Safe Choice"})).slice(0,3),r=e.summary?{topic:e.summary.topic||"Professional discussion",lastMessageSummary:e.summary.lastMessageSummary||"",suggestedAction:e.summary.suggestedAction||"Continue the conversation"}:void 0;return{replies:a,summary:r}}catch{return{replies:[]}}}
