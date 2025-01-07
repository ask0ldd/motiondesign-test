import './global.css';
import {delay, easeInOutCubic, makeProject, map, sequence, tween, useScene} from '@revideo/core';

import {Audio, Img, Layout, makeScene2D, Rect, Txt, Video} from '@revideo/2d';
import {all, chain, createRef, waitFor} from '@revideo/core';

/**
 * The Revideo scene
 */
const scene = makeScene2D('scene', function* (view) {
  // const logoRef = createRef<Img>();
  const textRect = createRef<Rect>()
  const text = createRef<Txt>()
  const smallBar = createRef<Rect>()
  const textLayout = createRef<Layout>()

  const screenWidth = 1080
  const screenHeight = 1920

  const name = useScene().variables.get('username', 'new user');

  yield view.add(
    <>
      <Video
        src={'http://localhost:9000/public/see.mp4'}
        size={['100%', '100%']}
        play={true}
      />
      <Audio
        src={'http://localhost:9000/public/chill-beat.mp3'}
        play={true}
        time={17.0}
      />
    </>,
  );

  view.add(
    <Rect fill="#ffffff" ref={smallBar} position={[-screenWidth / 2 + 32, 0]} width={8} height={250} zIndex={3}></Rect>
  )

  view.add(
    <Rect fill="#00000000" ref={textRect} padding={[24, 48]} position={[-1000, 0]} zIndex={2} layout>
      <Layout direction="column" ref={textLayout}>
        <Txt
          fill="#ffffff"
          ref={text}
          position={[0, 0]}
          fontFamily="Inter"
          lineHeight="120%"
          fontWeight={800}
          maxWidth={600}
          grow={0}
          width={600}
          wrap="wrap"
          textWrap
        >
          {"The Mediterranean Sea is an intercontinental sea stretching approximately 4,000 km between Europe, Africa, and Asia."}
        </Txt>
      </Layout>
  </Rect>
  );

  yield tween(1.5, value => {
    smallBar().height(map(0, textRect().height(), easeInOutCubic(value)));
  }),

  yield* waitFor(0.5);

  yield* all(
    tween(2, value => {
      textRect().position.x(map(-1000, (textRect().width() / 2) - screenWidth / 2 + 44, easeInOutCubic(value)));
    }),
    delay(0.5, textRect().fill('rgba(0, 0, 0, 0.5)', 1)),
    // delay(2, text().fill('rgb(125, 0, 0)', 1))
  )

  text().save()
  // chain but with delay between actions
  yield* sequence(0.3,
    /*text().save(),
    text().layout(false),*/
    text().absolutePosition(-300, 1),
  );

  yield text().restore()

  /*view.add(
    <Img
      width={'1%'}
      ref={logoRef}
      src={
        'https://revideo-example-assets.s3.amazonaws.com/revideo-logo-white.png'
      }
    />,
  );*/

  /*yield* chain(
    all(logoRef().scale(40, 2), logoRef().rotation(360, 2)),
    logoRef().scale(60, 1),
  );*/
});

/**
 * The final revideo project
 */
export default makeProject({
  scenes: [scene],
  settings: {
    // Example settings:
    shared: {
      size: {x: 1080, y: 1920},
    },
  },
});

// https://github.com/redotvideo/examples/tree/main/youtube-shorts