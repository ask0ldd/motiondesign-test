import {renderVideo} from '@revideo/renderer';

async function render() {
  console.log('Rendering video...');

  // This is the main function that renders the video
  const file = await renderVideo({
    projectFile: './src/project.tsx',
    variables: {username: 'Mike'},
    settings: {
      outFile: 'test.mp4',
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

render();
