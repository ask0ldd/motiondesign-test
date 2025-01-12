import './global.css';
import {Direction, easeInCirc, easeInExpo, easeInSine, easeOutSine, makeProject, range, sequence, slideTransition, ThreadGenerator} from '@revideo/core';
import {Img, makeScene2D, SVG, Video, Node, Audio} from '@revideo/2d';
import {all, chain, createRef, waitFor} from '@revideo/core';
import TxtBlock, { Side } from './components/TxtBlock';
import { Logo } from './components/Logo';
import { Watermark } from './components/Watermark';
import { Star } from './components/Star';

/*const lines = [
  "Lorem ipsum dolor sit",
  "amet, consectetur",
  "adipiscing elit.",
  "Sed dapibus orci enim,",
  "quis fringilla nibh fringilla non.",
]

const screenWidth = 1080
const screenHeight = 1920*/

/**
 * The Revideo scene
 */
const scene = makeScene2D('scene', function* (view) {

    const textBlockRef = createRef<TxtBlock>()
    const video = createRef<Video>()
    const hashPattern = createRef<Node>()
    const stars = range(4).map(rec => createRef<Star>())

  
    function getRandomInt(min : number, max : number){
        return Math.floor(Math.random() * ((max-min)+1) + min)
    }

  view.add(
      <>
        <Video
          ref={video}
          src={'http://localhost:9000/public/sea2.mp4'}
          size={['100%', '100%']}
          play={true}
          awaitCanPlay
          time={1}
        />
        {<Audio
          src={'http://localhost:9000/public/chill-beat.mp3'}
          play={true}
          time={17.0}
        />}
      </>,
  );

  yield* waitFor(2)
})

/*const scene2 = makeScene2D('scene2', function* (view) {

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

  yield* waitFor(4)
})*/

export default makeProject({
  scenes: [scene],
  settings: {
    shared: {
      size: {x: 1080, y: 1920},
    },
  },
});