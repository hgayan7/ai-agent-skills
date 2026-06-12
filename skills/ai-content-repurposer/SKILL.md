---
name: ai-content-repurposer
description: Turn a blog post, article, webpage, or any long-form text into platform-optimized social posts — X (Twitter) threads, LinkedIn posts, and Reddit posts. Use whenever the user wants to share, promote, announce, or repurpose an article or URL on social media, or asks to "make a thread", "write a LinkedIn post", or "post this on Reddit" from existing content — even if they never say "repurpose". Bundled scraper extracts the source; generation uses agent reasoning, no API keys.
---

# AI Content Repurposer Skill

This skill enables AI agents to extract clean text content from blog articles and webpages, then generate high-performing, platform-specific social media posts for X (Twitter), LinkedIn, and Reddit — all using the agent's own LLM reasoning. No API keys or external services required.

## Capabilities

### Content Extraction
- **Blog Scraper**: Extracts clean article text from standard blog/article URLs using `cheerio`. Automatically strips headers, footers, navigation, sidebars, scripts, and stylesheets to isolate core reading content.
- **Text Normalization**: Cleans up whitespace, formats sentences, and handles content truncation.

### Content Repurposing (Agent-Driven)
After extraction, you (the agent) generate platform-specific social posts using your own model reasoning. Do not make external API calls. You **MUST** read and apply the detailed platform guidelines linked below to write the copy.

---

## Workflow

1.  **Get the source text** — first available path wins:
    - **User-provided text:** if the user already has the text (a transcript, draft, newsletter, or pasted article), use it directly and skip to step 3.
    - **Bundled scraper (preferred for URLs):** deterministic, and returns the article's full clean text rather than a summary. Needs Node ≥ 18 — if `node_modules/` is missing in this skill's directory, run `npm install` there once first.
      ```bash
      node scripts/blog_content_extractor.js "https://example.com/some-article"
      ```
    - **Your built-in fetch tool (fallback):** if Node isn't available or the install fails, fetch the URL with your environment's web-fetch capability instead. Make sure you obtain the article's actual full text, not a summarized digest — the platform guides rely on the source's real phrasing, numbers, and examples.

2.  **Read the extracted JSON** (scraper path only):
    The script outputs a JSON object to stdout. Parse it to get the `title`, `content`, `wordCount`, and `contentType`.

3.  **Read the Platform Repurposing Guides**:
    Read the following files to align your generation with verified viral patterns and structures:
    - [X (Twitter) Threads Guide](./guides/x_threads.md)
    - [LinkedIn Posts Guide](./guides/linkedin_posts.md)
    - [Reddit Posts Guide](./guides/reddit_posts.md)

4.  **Generate social posts**:
    Format your response to match the [Output Format](#output-format) structure, ensuring all platform-specific copy matches the rules defined in the guides. If the user asked for specific platforms only (e.g., just a LinkedIn post), generate only those sections; default to all three when unspecified.

---

## Output Format

All generated posts must be rendered in human-readable Markdown using this exact structure:

```markdown
# Repurposed Social Media Posts

---

## 🐦 X (Twitter) Thread
*Copywriting rules: 1-3-1 structure, hook first, numbered markers, <280 chars per tweet.*

### Tweet 1
[Tweet Hook Content]

---

### Tweet 2
[First body tweet...]

---

### Tweet 3
[Second body tweet...]

---

### Tweet 4
[Last tweet / CTA...]

---

## 💼 LinkedIn Post
*Copywriting rules: "see more" open-loop hook, one sentence per line, mobile spacing, no external links in body.*

[LinkedIn Post Content...]

---

## 🤖 Reddit Post
*Copywriting rules: PAS or narrative framework, markdown headers, TL;DR at the bottom.*

**Suggested Subreddits:** r/subreddit1, r/subreddit2, r/subreddit3

### Title: [Curiosity-driven Reddit title]

[Reddit Post body content...]

**TL;DR:** [1-2 sentence summary]
```

---

## Scripts

### `blog_content_extractor.js`
Scrapes the body content of blog posts and webpages.
- **Input**: URL string (command line argument)
- **Output**: JSON to stdout with `title`, `content`, `wordCount`, and `contentType: "blog"`

---

## Generation Prompt Template

When generating the social posts, apply this persona and configuration:

```
You are an elite copywriter specializing in high-engagement organic social media growth.
You have been given a source content JSON containing:
- Title: {TITLE}
- Source Text: {CONTENT}

Your goal is to extract the core ideas, lessons, and stories from this source text and repurpose them into three formats:
1. An X (Twitter) Thread (following x_threads.md rules: 1-3-1 rule, hooks, numbering, strict <280 char limit)
2. A LinkedIn Post (following linkedin_posts.md rules: "see more" line break hook, one sentence per line, no external links in body)
3. A Reddit Post (following reddit_posts.md rules: PAS or Case Study narrative, Markdown headers, TL;DR at bottom, 3 suggested subreddits)

CRITICAL: Do NOT output JSON. Do NOT wrap your response in a json block. You must output the content strictly in the human-readable Markdown format defined in the Output Format section so the user can easily read and copy it.
```

---

## Best Practices

1.  **Safety Truncation**: The script hard-caps extraction at 10,000 words; for generation, work from roughly the first 1,500 words (~6,000 characters) — enough to capture the core ideas without flooding your context. Read deeper only if the piece's key value sits in later sections.
2.  **Clean HTML Extraction**: The scraper already removes `<script>`, `<style>`, `<nav>`, `<header>`, and `<footer>` tags — but verify the output is clean before generating.
3.  **Character Validation**: After generating X threads, verify each tweet is strictly under 280 characters. Trim if necessary.
4.  **Tone Matching**: Match the writing tone to the source content — technical for dev blogs, conversational for vlogs, professional for business content.

---

## Limitations

- **Paywalled Blogs**: The scraper does not support paywalled articles requiring user authentication.
- **Dynamic JS Sites**: Basic single-page apps that require full client-side Javascript execution to load text might return empty content. (Your built-in fetch tool may handle these better — fall back to it.)
- **No Node available**: The scraper is an optimization, not a requirement — use the fetch-tool fallback from step 1.
