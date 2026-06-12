const cheerio = require('cheerio');

// Hard safety cap on extracted text, in words. Generation guidance in SKILL.md
// works from a smaller slice (~1,500 words); this cap just keeps the JSON manageable.
const MAX_CONTENT_LENGTH = 10000;

async function extractBlogContent(url) {
  try {
    // Native fetch (Node >= 18) — no HTTP client dependency needed.
    const response = await fetch(url, {
      signal: AbortSignal.timeout(10000),
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} ${response.statusText}`);
    }
    const html = await response.text();

    const $ = cheerio.load(html);

    // Remove non-content elements
    $('script, style, nav, header, footer, .sidebar, .navigation, iframe, noscript').remove();

    // Extract title. Prefer og:title (usually the clean article title);
    // <title> often carries a "| Site Name" suffix, so strip that as a fallback.
    let title = ($('meta[property="og:title"]').attr('content') || '').trim();
    if (!title) {
      title = $('title').text().trim() || $('h1').first().text().trim() || 'Untitled Article';
      title = title.split(' | ')[0].trim();
    }
    
    // Extract main content areas (ordered by typical semantic importance)
    let content = '';
    const selectors = ['article', 'main', '.content', '.post-content', '.entry-content', '.article-content'];
    
    for (const selector of selectors) {
      const element = $(selector);
      if (element.length > 0) {
        content = element.text().trim();
        break;
      }
    }
    
    // Fallback to body if no specific block tag found
    if (!content) {
      content = $('body').text().trim();
    }
    
    // Clean up white space
    content = content.replace(/\s+/g, ' ').trim();
    
    // Enforce the hard safety cap
    const words = content.split(/\s+/);
    if (words.length > MAX_CONTENT_LENGTH) {
      content = words.slice(0, MAX_CONTENT_LENGTH).join(' ');
    }
    
    const wordCount = content.split(/\s+/).length;
    
    return {
      title,
      content,
      wordCount,
      contentType: 'blog'
    };
  } catch (error) {
    throw new Error(`Failed to extract blog content: ${error.message}`);
  }
}

// CLI Execution
async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error('Usage: node blog_content_extractor.js <blog_url>');
    process.exit(1);
  }
  
  const url = args[0];
  try {
    const data = await extractBlogContent(url);
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { extractBlogContent };
