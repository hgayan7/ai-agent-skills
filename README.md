# AI Agent Skills

An open-source collection of reusable AI agent skills — structured prompts, extraction scripts, and output templates — designed to extend the capabilities of agentic coding assistants like Gemini, Claude, Codex, and Cursor.

**Agent-Only by design.** These skills require zero API keys or external service configuration. Agents use the provided scripts for data extraction and their own LLM reasoning for generation.

## Skill Registry

| Skill | Description | Path |
| :--- | :--- | :--- |
| **`ai-content-repurposer`** | Extracts blog articles and YouTube transcripts, then generates optimized X threads, Reddit posts, and LinkedIn posts. | [`skills/ai-content-repurposer`](./skills/ai-content-repurposer) |

---

## Installation & General Setup

Each subdirectory under `skills/` is a self-contained skill that can be installed into any compatible AI coding assistant.

1.  Copy the desired skill folder to your agent's skills directory (e.g. for Gemini/Antigravity):
    ```bash
    cp -r skills/ai-content-repurposer ~/.gemini/config/skills/
    ```
2.  Install dependencies:
    ```bash
    cd ~/.gemini/config/skills/ai-content-repurposer
    npm install
    ```
3.  The agent will automatically read the `SKILL.md` file and gain the capability.

---

## How to Use Across Different AI Agents

Because these skills are designed to be **Agent-Only** (relying on lightweight local extraction scripts and the agent's internal reasoning), they are compatible with any modern agentic coding assistant that has access to a terminal and filesystem.

### 1. Gemini / Antigravity (Native Integration)
Antigravity natively scans the configuration directory for skills. Just tell the agent what you want to do. It already knows the skill exists and has read the `SKILL.md` file.

**Prompt Examples:**
> *"Use the ai-content-repurposer skill to scrape this blog post: https://example.com/blog-post-url"*
>
> *"Repurpose the latest video from this channel into a LinkedIn post and X thread using the content repurposer skill: https://www.youtube.com/watch?v=VIDEO_ID"*

### 2. Claude Code (Terminal/CLI Agent)
`claude` runs directly in your terminal and has full access to the project directory. Feed the `SKILL.md` path directly to Claude in your prompt. Since Claude Code is highly agentic, it will read the markdown file, figure out what scripts it needs to run, run them, and follow the copywriting templates.

**Prompt Example:**
```bash
claude "Read the skill rules in skills/ai-content-repurposer/SKILL.md and repurpose this URL: https://example.com/some-article"
```

### 3. Cursor (VS Code Fork)
Open Cursor Chat (`Cmd + L` / `Ctrl + L`) or Composer (`Cmd + I` / `Ctrl + I`) and reference the skill instructions and the platform guides using the `@` symbol:

**Prompt Example:**
> *"Run the extraction script in @blog_content_extractor.js on this URL: https://example.com/article. Then, following the rules in @SKILL.md and @linkedin_posts.md, write a LinkedIn post. Finally, run the output through @x_threads.md to write a Twitter thread."*

*Tip: You can automate this globally in Cursor by creating a `.cursorrules` file in the root of your project containing:*
```json
{
  "instruction": "When asked to repurpose content, write social media posts, or scrape URLs, look at skills/ai-content-repurposer/SKILL.md and follow the per-platform copywriting guides in skills/ai-content-repurposer/guides/."
}
```

### 4. Cline / Roo Code (VS Code Extensions)
Extensions like Cline and Roo Code let you customize system prompts or use `.clinerules` to teach the agent new capabilities.

Create a `.clinerules` file in the workspace root. This file is automatically read by the agent at the beginning of every session:

```markdown
# AI Content Repurposer Capability
You have access to a local content scraping and repurposing skill.
Location: skills/ai-content-repurposer/

When a user asks to scrape a blog, get a YouTube transcript, or write social posts:
1. Run the appropriate Node.js extractor in `skills/ai-content-repurposer/scripts/`.
2. Apply the copywriting frameworks defined in `skills/ai-content-repurposer/guides/`.
3. Format the final output according to the JSON schema in `skills/ai-content-repurposer/SKILL.md`.
```

### 5. Claude Desktop (MCP - Model Context Protocol)
If you use the official Claude Desktop App with MCP servers, you can use the **Filesystem MCP Server** to expose the skill folder to Claude by adding it to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/himshikhargayan/Documents/ai-agent-skills"
      ]
    }
  }
}
```

Once configured, tell Claude Desktop:
> *"Read the file /Users/himshikhargayan/Documents/ai-agent-skills/skills/ai-content-repurposer/SKILL.md and use the scripts inside to scrape and repurpose https://example.com/my-post"*

---

## Contributing

We welcome contributions of new skills!

1.  Fork this repository.
2.  Create a subfolder under `skills/` following the layout of existing skills.
3.  Include a `SKILL.md` with frontmatter (`name`, `description`) detailing capabilities, scripts, and output formats.
4.  Submit a pull request.

## License

MIT
