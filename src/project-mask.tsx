import './global.css';
import {delay, easeInOutCubic, makeProject, map, sequence, tween, useScene, Vector2} from '@revideo/core';

import {Audio, Circle, Img, Layout, makeScene2D, Rect, Txt, Video, Node} from '@revideo/2d';
import {all, chain, createRef, waitFor} from '@revideo/core';

/**
 * The Revideo scene
 */
const scene = makeScene2D('scene', function* (view) {
  const text = createRef<Txt>()
  const rec = createRef<Rect>()
  const maskRef = createRef<Circle>()

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

  yield view.add(
    <Node cache>
        <Circle fill="#ffffff" ref={maskRef} position={[0, 0]} width={128} height={128} opacity={0.5}/>
        <Rect fill="#8c994d" ref={rec} position={[0, 0]} width={screenWidth/2} height={screenWidth/2} compositeOperation={'source-out'} layout>
            <Txt position={[-200, 0]}>AAAAAAAAAA</Txt>
        </Rect>
    </Node>
  );

  yield* tween(4, value => {
    maskRef().absolutePosition(
        Vector2.lerp(
          new Vector2(0, 1920/2),
          new Vector2(1080, 1920/2),
          easeInOutCubic(value)
        )
    );
  })

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