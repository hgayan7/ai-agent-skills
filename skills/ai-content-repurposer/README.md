# AI Content Repurposer

An agent-only skill that extracts blog articles and webpages, then empowers AI agents to generate high-performing social media posts for X (Twitter), LinkedIn, and Reddit.

**No API keys. No configuration. No `.env` files.** The agent uses its own LLM reasoning to generate all content.

## Installation

```bash
cd skills/ai-content-repurposer
npm install
```

The scraper is optional: agents without Node can use their built-in web-fetch tool instead (see the workflow in `SKILL.md`). The bundled scraper is preferred for URLs because it returns the article's full verbatim text, not a summarized digest.

## How It Works

1. The agent gets the source text — from the user directly, via the extractor script, or via its own fetch tool.
2. The agent reads the extracted content.
3. The agent generates platform-specific social posts using its own model reasoning, following the guidelines in `SKILL.md`.

## Scripts

### Extract from a blog post or webpage:
```bash
node scripts/blog_content_extractor.js "https://example.com/blog-post-url"
```

The script outputs structured JSON to stdout with `title`, `content`, `wordCount`, and `contentType`.

## File Structure

```
ai-content-repurposer/
├── SKILL.md                              # Agent instructions & prompts
├── README.md                             # This file
├── package.json                          # Dependencies
└── scripts/
    └── blog_content_extractor.js         # Cheerio-based web scraper
```

## Full Documentation

See [`SKILL.md`](./SKILL.md) for complete agent instructions, output format schema, and platform copywriting guidelines.
