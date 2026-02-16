# LiPilot — Free Open-Source AI Comment Assistant for LinkedIn

LiPilot is a free, open-source Chrome extension that generates smart, context-aware LinkedIn comments using AI. It learns your voice over time, analyzes post images, understands thread context, and helps you engage authentically — all running locally in your browser with no server or account required.

**Supported by [Travel Code](https://travel-code.com) — AI-powered corporate travel management platform.**

---

## Features

- **Learns Your Voice** — LiPilot observes how you edit its suggestions and builds a profile of your communication style. Over time, comments sound more and more like you.
- **Multimodal Analysis** — Understands images, carousels, and infographics attached to posts, not just text.
- **Thread Awareness** — Reads existing comments and replies to generate responses that fit the conversation context.
- **DM Co-pilot** — Generate context-aware direct messages from any LinkedIn profile or conversation.
- **Integrated Prospecting** — Weave your service offering naturally into comments without sounding salesy.
- **Comment Scoring** — Each generated comment is scored for relevance, authenticity, and engagement potential.
- **Service Offer Integration** — Describe your product or service once, and LiPilot subtly integrates it where appropriate.
- **Privacy First** — All data stays in your browser. No server, no tracking, no account. Your API key never leaves your machine.

---

## Quick Install (Ready-to-Use)

1. **Download** the latest build: [lipilot-v2.0.zip](https://lipilot.com/lipilot-v2.0.zip)
2. **Unzip** the archive to any folder
3. Open `chrome://extensions` in your browser
4. Enable **Developer mode** (toggle in the top-right corner)
5. Click **Load unpacked** and select the unzipped folder
6. **Done!** Click the LiPilot icon → Settings to configure your API key

Works on **Chrome, Brave, Edge, Arc**, and any Chromium-based browser.

---

## Build from Source (Developer Mode)

```bash
git clone https://github.com/egorceo/lipilot.git
cd lipilot
npm install
npm run build
```

Then load the `dist/` folder as an unpacked extension in `chrome://extensions`.

---

## How It Works

1. **Set up** — Open the extension settings, choose your LLM provider (OpenAI, Anthropic, or Google Gemini), enter your API key, and describe your persona.
2. **Browse LinkedIn** — Navigate to any LinkedIn post. You'll see a small AI button near the comment box.
3. **Generate** — Click the button. LiPilot reads the post text, images, and existing thread, then generates 3 scored comment options.
4. **Refine & Insert** — Pick a comment, optionally refine it, and insert it into the comment box.
5. **Learn** — When you edit a comment before posting, LiPilot learns from your changes and improves future suggestions.

---

## Multi-Provider LLM Support

LiPilot supports three LLM providers. Bring your own API key:

| Provider | Models |
|----------|--------|
| **OpenAI** | GPT-5.2, GPT-5.1, GPT-4o Mini, GPT-4o |
| **Anthropic** | Claude Opus 4.6, Claude Sonnet 4.5, Claude Haiku 4.5 |
| **Google Gemini** | Gemini 2.5 Flash, Gemini 2.5 Pro, Gemini 2.5 Flash Lite |

---

## Why Open Source?

We built LiPilot as a commercial product, but decided to make it free and open-source. No catches, no freemium, no data harvesting. Just a useful tool for the LinkedIn community.

---

## Tech Stack

- **Chrome Extension** — Manifest V3, service worker background script
- **Frontend** — React + TypeScript
- **Build** — Vite + CRXJS
- **Styling** — Tailwind CSS (content scripts use Shadow DOM for isolation)
- **LLM** — Direct API calls to OpenAI, Anthropic, and Google Gemini

---

## Contributing

Contributions are welcome! Feel free to open issues and pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m 'Add my feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

## Links

- **Website**: [lipilot.com](https://lipilot.com)
- **Creator**: [Egor Karpovich](https://www.linkedin.com/in/egor-karpovich/) on LinkedIn
- **Supported by**: [Travel Code](https://travel-code.com) — AI-powered corporate travel management
