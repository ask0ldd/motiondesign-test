import {renderVideo} from '@revideo/renderer';

const scene1Lines = [
    "Lorem ipsum dolor sit",
    "amet, consectetur",
    "adipiscing elit.",
    "Sed dapibus orci enim,",
    "quis fringilla nibh fringilla non.",
  ]

async function render(videoUrls, AudioUrl, Text) {
  console.log('Rendering video...');

  // This is the main function that renders the video
  const file = await renderVideo({
    projectFile: './src/project-componentVar.tsx',
    variables: {text: Text, videoUrls : videoUrls, audioUrl : AudioUrl},
    settings: {
      // outFile: 'test.mp4',
      outDir: './public',
      logProgress: true,
      ffmpeg: {
        ffmpegLogLevel: 'error',
        // https://docs.re.video/api/renderer/renderVideo
        ffmpegPath: './ffmpeg/bin/ffmpeg',
        ffprobePath: './ffmpeg/bin/ffprobe',
      },
      puppeteer: {
        args: ['--no-sandbox'],
      }
    },
    
  });

  console.log(`Rendered video to ${file}`);

  return file
}

function extractParameters(){
    const args = process.argv.slice(2);
    if (args.length < 3) {
        throw new Error("Invalid parameters. Expected at least 3 arguments.");
    }

    try {
        const videoFiles = JSON.parse(args[0]);
        const audioFile = JSON.parse(args[1]);
        const sceneLines = JSON.parse(args[2]);
        
        if (!Array.isArray(videoFiles) || typeof audioFile !== 'string' || !Array.isArray(sceneLines)) {
            throw new Error("Invalid argument types.");
        }
        
        return [videoFiles, audioFile, sceneLines];
    } catch (error) {
        throw new Error(`Error parsing arguments: ${error.message}`);
    }
    // return [["sea-01.mp4", "sea3.mp4"], "chill-beat.mp3", [scene1Lines,]]
}

try {
    const parameters = extractParameters();
    render(...parameters);
} catch (error) {
    console.error(error.message);
    process.exit(1);
}
