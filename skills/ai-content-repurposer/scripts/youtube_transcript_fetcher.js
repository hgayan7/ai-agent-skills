// Constants
const MAX_CONTENT_LENGTH = 10000; // in words

function extractYouTubeVideoId(url) {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : url.length === 11 ? url : null;
}

async function extractYouTubeContent(url) {
  try {
    const videoId = extractYouTubeVideoId(url);
    if (!videoId) {
      throw new Error('Invalid YouTube URL or Video ID');
    }

    // Dynamic import of youtubei.js (since it is an ES module)
    const { Innertube } = await import('youtubei.js');
    
    // Create Innertube client
    const yt = await Innertube.create();

    const info = await yt.getInfo(videoId);
    
    const title = info.basic_info?.title || 'YouTube Video';
    const description = info.basic_info?.short_description || '';
    
    let content = '';
    let contentSource = '';

    // Attempt to extract transcript
    try {
      const languages = ['en', 'en-US', 'en-GB'];
      let transcript = null;
      
      for (const lang of languages) {
        try {
          transcript = await info.getTranscript(lang);
          if (transcript && transcript.transcript?.content?.body?.initial_segments) {
            break;
          }
        } catch (langError) {
          // Keep trying languages
        }
      }

      if (!transcript || !transcript.transcript?.content?.body?.initial_segments) {
        try {
          transcript = await info.getTranscript();
        } catch (defaultError) {
          // No transcript
        }
      }

      if (transcript && transcript.transcript?.content?.body?.initial_segments) {
        const segments = transcript.transcript.content.body.initial_segments;
        content = segments
          .map(segment => segment.snippet?.text || '')
          .filter(text => text.trim())
          .join(' ');
        
        contentSource = 'transcript';
      }
    } catch (transcriptError) {
      // Transcript retrieval failed
    }

    // Fall back to video description if transcript is empty
    if (!content && description && description.length > 50) {
      content = description;
      contentSource = 'description';
    }

    if (!content) {
      throw new Error('No transcript or description available for this video.');
    }

    // Clean up white space
    content = content.replace(/\s+/g, ' ').trim();
    
    // Truncate content if necessary
    const words = content.split(/\s+/);
    if (words.length > MAX_CONTENT_LENGTH) {
      content = words.slice(0, MAX_CONTENT_LENGTH).join(' ');
    }

    const wordCount = content.split(/\s+/).length;

    return {
      title,
      content,
      wordCount,
      contentType: 'video',
      source: contentSource
    };
  } catch (error) {
    throw new Error(`Failed to extract YouTube content: ${error.message}`);
  }
}

// CLI Execution
async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error('Usage: node youtube_transcript_fetcher.js <youtube_url_or_video_id>');
    process.exit(1);
  }
  
  const url = args[0];
  try {
    const data = await extractYouTubeContent(url);
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { extractYouTubeContent };
