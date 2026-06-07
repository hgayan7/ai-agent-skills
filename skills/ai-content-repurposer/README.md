# AI Content Repurposer

An agent-only skill that extracts blog articles and YouTube video transcripts, then empowers AI agents to generate high-performing social media posts for X (Twitter), LinkedIn, and Reddit.

**No API keys. No configuration. No `.env` files.** The agent uses its own LLM reasoning to generate all content.

## Installation

```bash
cd skills/ai-content-repurposer
npm install
```

## How It Works

1. The agent runs extractor scripts to pull content from a URL.
2. The agent reads the extracted JSON output.
3. The agent generates platform-specific social posts using its own model reasoning, following the guidelines in `SKILL.md`.

## Scripts

### Extract from a blog post:
```bash
node scripts/blog_content_extractor.js "https://example.com/blog-post-url"
```

### Extract from a YouTube video:
```bash
node scripts/youtube_transcript_fetcher.js "https://www.youtube.com/watch?v=VIDEO_ID"
```

Both scripts output structured JSON to stdout with `title`, `content`, `wordCount`, and `contentType`.

## File Structure

```
ai-content-repurposer/
├── SKILL.md                              # Agent instructions & copywriting guidelines
├── README.md                             # This file
├── package.json                          # Dependencies
└── scripts/
    ├── blog_content_extractor.js         # Cheerio-based web scraper
    └── youtube_transcript_fetcher.js     # youtubei.js-based transcript extractor
```

## Full Documentation

See [`SKILL.md`](./SKILL.md) for complete agent instructions, output format schema, and platform copywriting guidelines.
