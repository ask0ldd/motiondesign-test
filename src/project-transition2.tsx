import { makeScene2D, Rect, Txt, Video, Audio } from "@revideo/2d";
import { createRef, Direction, makeProject, slideTransition, waitFor } from "@revideo/core";

const scene = makeScene2D('scene', function* (view) {
    const rect = createRef<Rect>();
    const text = createRef<Txt>();
    const video = createRef<Video>();

    view.add(
        <Video
            ref={video}
            src={'http://localhost:9000/public/see.mp4'}
            width={'100%'}
            height={'100%'}
            play={true}
        />
    );

    /*view.add(
        <Rect
          ref={rect}
          width={'100%'}
          height={'100%'}
          fill={'red'}
        />
    )*/

    yield* waitFor(2);
    yield video().pause()
});

const scene2 = makeScene2D('scene2', function* (view) {
    const rect = createRef<Rect>();
    const text = createRef<Txt>();
  
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
  
    yield* slideTransition(Direction.Right)
    yield* waitFor(2);
});


export default makeProject({
  scenes: [scene, scene2],
  settings: {
    // Example settings:
    shared: {
      size: {x: 1080, y: 1920},
    },
  },
});