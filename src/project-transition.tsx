import './global.css';
import {delay, Direction, easeInOutCubic, makeProject, map, sequence, slideTransition, tween, useScene, Vector2} from '@revideo/core';

import {Audio, Circle, Img, Layout, makeScene2D, Rect, Txt, Video, Node} from '@revideo/2d';
import {all, chain, createRef, waitFor} from '@revideo/core';

/**
 * The Revideo scene
 */
const scene = makeScene2D('scene', function* (view) {
  const rect = createRef<Rect>();
  const text = createRef<Txt>();

  yield view.add(
    <>
      {<Audio
        src={'http://localhost:9000/public/chill-beat.mp3'}
        play={true}
        time={17.0}
      />}
    </>,
);

  view.add(
    <Rect
      ref={rect}
      width={'100%'}
      height={'100%'}
      fill={'lightcoral'}
      layout
      alignItems={'center'}
      justifyContent={'center'}
    >
      <Txt
        ref={text}
        fontSize={40}
        fontWeight={700}
        fill={'#fff'}
        fontFamily={'"JetBrains Mono", monospace'}
      >
        SECOND SCENE
      </Txt>
    </Rect>,
  );

  yield* slideTransition(Direction.Left);

  yield* waitFor(0.4);
  /*yield* all(
    rect().fill('lightseagreen', 0.6),
    text().text('FIRST SCENE', 0.6),
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