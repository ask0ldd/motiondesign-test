import './global.css';
import {easeInOutCubic, makeProject, map, tween} from '@revideo/core';

import {Audio, Img, Layout, makeScene2D, Rect, Txt, Video} from '@revideo/2d';
import {all, chain, createRef, waitFor} from '@revideo/core';

/**
 * The Revideo scene
 */
const scene = makeScene2D('scene', function* (view) {
  // const logoRef = createRef<Img>();
  const text = createRef<Txt>();
  const smallBar = createRef<Rect>()

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
    <Rect fill="#ffffff" ref={smallBar} position={[-540 + 32, 0]} width={8} height={250} zIndex={3}></Rect>
  )

  yield tween(1.5, value => {
    smallBar().scale.y(map(0, 1.5, easeInOutCubic(value)));
  }),

  yield* waitFor(0.5);

  view.add(
    <Rect fill="#00000000" ref={text} padding={[24, 48]} position={[0, 0]} zIndex={2} layout>
      <Layout direction="column">
        <Txt
          fill="#ffffff"
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
          {"The Mediterranean Sea is an intercontinental sea stretching approximately 4,000 km between Europe, Africa, and Asia"}
        </Txt>
      </Layout>
  </Rect>
  );

  yield* chain(
    tween(2, value => {
      text().position.x(map(-1000, -150, easeInOutCubic(value)));
    }),
    text().fill('rgba(0, 0, 0, 0.6)', 1)
  )

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
