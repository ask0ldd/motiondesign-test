import './global.css';
import {delay, Direction, easeInOutCubic, fadeTransition, finishScene, makeProject, map, range, sequence, SignalValue, slideTransition, ThreadGenerator, tween, useScene, useTransition, Vector2} from '@revideo/core';
import {Audio, Circle, Img, Layout, makeScene2D, Rect, Txt, Video, Node, Filter} from '@revideo/2d';
import {all, chain, createRef, waitFor} from '@revideo/core';
import TxtBlock, { Side } from './components/TxtBlock';

const lines = [
  "Lorem ipsum dolor sit",
  "amet, consectetur",
  "adipiscing elit.",
  "Sed dapibus orci enim,",
  "quis fringilla nibh fringilla non.",
]

/**
 * The Revideo scene
 */
const scene = makeScene2D('scene', function* (view) {

  const textBlockRef = createRef<TxtBlock>()
  const video = createRef<Video>()

  const screenWidth = 1080
  const screenHeight = 1920

  yield view.add(
      <>
        <Video
          ref={video}
          src={'http://localhost:9000/public/sea.mp4'}
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

  yield view.add(<TxtBlock decorator={Side.Left} ref={textBlockRef} textLines={lines}/>)
  view.clip()
  yield* textBlockRef().snapLeftBorder(10, view.width())
  yield* textBlockRef().init(false)

  yield* chain(
      textBlockRef().openTextContainer(),
      textBlockRef().unfoldLineContainers(),
  )

  yield* waitFor(4)

  yield* chain(
    all(
      textBlockRef().foldLineContainers(),
      textBlockRef().decoratorDisappearLeft()
    ),
    textBlockRef().closeTextContainer(),
  )

  yield* waitFor(1)
  yield video().pause()
})

const scene2 = makeScene2D('scene2', function* (view) {

  const textBlockRef = createRef<TxtBlock>()

  yield view.add(
    <>
    <Video
        src={'http://localhost:9000/public/sea3.mp4'}
        size={['100%', '100%']}
        play={true}
    />
    </>,
  );
  yield* slideTransition(Direction.Right)
  yield view.add(<TxtBlock decorator={Side.Right} ref={textBlockRef} textLines={lines}/>)
  view.clip()
  yield* textBlockRef().snapRightBorder(10, view.width())
  yield* textBlockRef().init(false)

  yield* chain(
      textBlockRef().openTextContainer(),
      textBlockRef().unfoldLineContainers(),
  )
  yield* waitFor(4);
})

export default makeProject({
  scenes: [scene, scene2],
  settings: {
    shared: {
      size: {x: 1080, y: 1920},
    },
  },
});

/*function* waitTransition(
  duration = 0.6,
  previousOnTop: SignalValue<boolean> = true,
): ThreadGenerator {
  const endTransition = useTransition(
    () => {
      // do nothing
    },
    undefined,
    previousOnTop,
  );

  yield* waitFor(duration);
  endTransition();
}*/