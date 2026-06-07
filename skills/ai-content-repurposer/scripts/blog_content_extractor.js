const axios = require('axios');
const cheerio = require('cheerio');

// Constants
const MAX_CONTENT_LENGTH = 10000; // in words

async function extractBlogContent(url) {
  try {
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    
    // Remove non-content elements
    $('script, style, nav, header, footer, .sidebar, .navigation, iframe, noscript').remove();
    
    // Extract title
    const title = $('title').text().trim() || $('h1').first().text().trim() || 'Untitled Article';
    
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
    
    // Check content length (truncate if too long to conserve API tokens)
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
