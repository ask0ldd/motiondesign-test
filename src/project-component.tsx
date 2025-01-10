import './global.css';
import {Direction, easeInCirc, easeInExpo, easeInSine, easeOutSine, makeProject, range, sequence, slideTransition, ThreadGenerator} from '@revideo/core';
import {Img, makeScene2D, SVG, Video, Node} from '@revideo/2d';
import {all, chain, createRef, waitFor} from '@revideo/core';
import TxtBlock, { Side } from './components/TxtBlock';
import { Logo } from './components/Logo';
import { Watermark } from './components/Watermark';
import { Star } from './components/Star';

const lines = [
  "Lorem ipsum dolor sit",
  "amet, consectetur",
  "adipiscing elit.",
  "Sed dapibus orci enim,",
  "quis fringilla nibh fringilla non.",
]

const screenWidth = 1080
const screenHeight = 1920

/**
 * The Revideo scene
 */
const scene = makeScene2D('scene', function* (view) {

  const textBlockRef = createRef<TxtBlock>()
  const video = createRef<Video>()
  const hashPattern = createRef<Node>()
  const stars = range(4).map(rec => createRef<Star>())

  yield view.add(
      <>
        <Video
          ref={video}
          src={'http://localhost:9000/public/sea.mp4'}
          size={['100%', '100%']}
          play={true}
        />
        {/*<Audio
          src={'http://localhost:9000/public/chill-beat.mp3'}
          play={true}
          time={17.0}
        />*/}
      </>,
  );

  yield view.add(
    <Node ref={hashPattern}>
      <Img position={[0, 150]} width={300} height={300} opacity={0.15} src={'http://localhost:9000/public/rice.svg'}/>
      <Img position={[300, -150]} width={300} height={300} opacity={0.15} src={'http://localhost:9000/public/rice.svg'}/>
      <Img position={[-screenWidth/2+200, screenHeight/2]} width={500} height={500} opacity={0.10} src={'http://localhost:9000/public/rice.svg'}/>
    </Node>
  )

  yield all(
    hashPattern().scale(2, 8, easeOutSine),
    hashPattern().opacity(0.01, 8, easeOutSine)
  )

  stars.forEach(star => view.add(<Star ref={star} size={40} opacity={0.5} position={[getRandomInt(-view.width()/2, view.width()/2), getRandomInt(-view.height()/2, view.height()/2)]}/>))
  view.add(<Logo/>)
  view.add(<Watermark/>)

  yield sequence(
    0.35,
    ...stars.map(star => star().randomBlinking(view))
  );

  yield view.add(<TxtBlock decorator={Side.Left} ref={textBlockRef} textLines={lines}/>)
  view.clip()
  yield* textBlockRef().snapLeftBorder(10, view.width())
  yield* textBlockRef().dissociate(false)

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

  // yield* waitFor(1)
  yield video().pause()
})

const scene2 = makeScene2D('scene2', function* (view) {

  const textBlockRef = createRef<TxtBlock>()
  const stars = range(4).map(rec => createRef<Star>())
  const hashPattern = createRef<Node>()

  yield view.add(
    <Video
        src={'http://localhost:9000/public/sea3.mp4'}
        size={['100%', '100%']}
        play={true}
    />
  );
  stars.forEach(star => view.add(<Star ref={star} size={40} opacity={0.5} position={[getRandomInt(-view.width()/2, view.width()/2), getRandomInt(-view.height()/2, view.height()/2)]}/>))
  view.add(<Logo/>)
  view.add(<Watermark/>)

  yield view.add(
    <Node ref={hashPattern}>
      <Img position={[0, 150]} width={300} height={300} opacity={0.15} src={'http://localhost:9000/public/rice.svg'}/>
      <Img position={[300, -150]} width={300} height={300} opacity={0.15} src={'http://localhost:9000/public/rice.svg'}/>
      <Img position={[-screenWidth/2+200, screenHeight/2]} width={500} height={500} opacity={0.10} src={'http://localhost:9000/public/rice.svg'}/>
    </Node>
  )

  yield all(
    hashPattern().scale(2, 8, easeOutSine),
    hashPattern().opacity(0.01, 8, easeOutSine)
  )


  yield all(
    yield* stars.map(star => star().randomMove(view))
  )

  yield* slideTransition(Direction.Right)
  yield view.add(<TxtBlock decorator={Side.Right} ref={textBlockRef} textLines={lines}/>)
  view.clip()
  yield* textBlockRef().snapRightBorder(10, view.width())
  yield* textBlockRef().dissociate(false)

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

function getRandomInt(min : number, max : number){
  return Math.floor(Math.random() * ((max-min)+1) + min)
}