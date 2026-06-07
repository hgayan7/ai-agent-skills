---
name: ai-content-repurposer
description: Extract blog articles and YouTube transcripts, then generate optimized platform-specific social posts (X threads, LinkedIn posts, Reddit posts) using agent reasoning.
---

# AI Content Repurposer Skill

This skill enables AI agents to extract text content from blog articles and YouTube video transcripts, then generate high-performing, platform-specific social media posts for X (Twitter), LinkedIn, and Reddit — all using the agent's own LLM reasoning. No API keys or external services required.

## Capabilities

### Content Extraction
- **Blog Scraper**: Extracts clean article text from standard blog/article URLs using `cheerio`. Automatically strips headers, footers, navigation, sidebars, scripts, and stylesheets to isolate core reading content.
- **YouTube Transcript Extractor**: Retrieves caption/transcript segments directly using `youtubei.js` without requiring official YouTube API quotas. Falls back to the video description if transcripts are unavailable.
- **Text Normalization**: Cleans up whitespace, formats sentences, and handles content truncation.

### Content Repurposing (Agent-Driven)
After extraction, you (the agent) generate platform-specific social posts using your own model reasoning. Do not make external API calls. You **MUST** read and apply the detailed platform guidelines linked below to write the copy.

---

## Workflow

1.  **Extract the source content**:
    Run the appropriate script based on the URL type:
    ```bash
    node scripts/blog_content_extractor.js "https://example.com/some-article"
    ```
    or
    ```bash
    node scripts/youtube_transcript_fetcher.js "https://www.youtube.com/watch?v=VIDEO_ID"
    ```

2.  **Read the extracted JSON**:
    The script outputs a JSON object to stdout. Parse it to get the `title`, `content`, `wordCount`, and `contentType`.

3.  **Read the Platform Repurposing Guides**:
    Read the following files to align your generation with verified viral patterns and structures:
    - [X (Twitter) Threads Guide](./guides/x_threads.md)
    - [LinkedIn Posts Guide](./guides/linkedin_posts.md)
    - [Reddit Posts Guide](./guides/reddit_posts.md)

4.  **Generate social posts**:
    Format your response to strictly match the [Output Format](#output-format) schema, ensuring all platform-specific copy matches the rules defined in the guides.

---

## Output Format

All generated posts must conform to this JSON structure:

```json
{
  "x_thread": [
    "Tweet 1/4 text...",
    "Tweet 2/4 text...",
    "Tweet 3/4 text...",
    "Tweet 4/4 text..."
  ],
  "reddit": {
    "title": "Engaging Reddit Title",
    "body": "Detailed markdown body...",
    "subreddits": ["productivity", "technology", "startup"]
  },
  "linkedin": "Professional LinkedIn post text with #hashtags and CTA."
}
```

---

## Scripts

### `blog_content_extractor.js`
Scrapes the body content of blog posts.
- **Input**: URL string (command line argument)
- **Output**: JSON to stdout with `title`, `content`, `wordCount`, and `contentType: "blog"`

### `youtube_transcript_fetcher.js`
Fetches YouTube captions and descriptions.
- **Input**: YouTube URL or video ID (command line argument)
- **Output**: JSON to stdout with `title`, `content` (transcript or description fallback), `wordCount`, `contentType: "video"`, and `source: "transcript" | "description"`

---

## Generation Prompt Template

When generating the JSON structure, apply this persona and configuration:

```
You are an elite copywriter specializing in high-engagement organic social media growth.
You have been given a source content JSON containing:
- Title: {TITLE}
- Source Text: {CONTENT}
- Type: {CONTENT_TYPE}

Your goal is to extract the core ideas, lessons, and stories from this source text and repurpose them into three formats:
1. An X (Twitter) Thread (following x_threads.md rules: 1-3-1 rule, hooks, numbering, strict <280 char limit)
2. A LinkedIn Post (following linkedin_posts.md rules: "see more" line break hook, one sentence per line, no external links in body)
3. A Reddit Post (following reddit_posts.md rules: PAS or Case Study narrative, Markdown headers, TL;DR at bottom, 3 suggested subreddits)

Output ONLY a single raw JSON object matching the defined Output Format. Do not wrap in backticks or add introductory/concluding text.
```

---

## Best Practices

1.  **Safety Truncation**: Truncate extracted content to ~1,500 words or 6,000 characters before generating posts to avoid overwhelming your context.
2.  **Clean HTML Extraction**: The scraper already removes `<script>`, `<style>`, `<nav>`, `<header>`, and `<footer>` tags — but verify the output is clean before generating.
3.  **Character Validation**: After generating X threads, verify each tweet is strictly under 280 characters. Trim if necessary.
4.  **Tone Matching**: Match the writing tone to the source content — technical for dev blogs, conversational for vlogs, professional for business content.

---

## Limitations

- **YouTube Transcript Limits**: Videos without standard or auto-generated captions, music-only videos, and age-restricted videos may fail to retrieve transcripts. The script automatically falls back to the description text.
- **Paywalled Blogs**: The scraper does not support paywalled articles requiring user authentication.
- **Rate Limits**: YouTube's Innertube API may rate-limit rapid consecutive requests. Space out extraction calls if processing multiple videos.

