import {renderVideo} from '@revideo/renderer';

async function render(videoUrls, AudioUrl, Text) {
  console.log('Rendering video...');

  // This is the main function that renders the video
  const file = await renderVideo({
    projectFile: './src/project-component.tsx',
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
}

function extractParameters(){
    const args = process.argv.slice(2);
}

render();
