import './global.css';
import {delay, easeInOutCubic, makeProject, map, range, sequence, tween, useScene, Vector2} from '@revideo/core';

import {Audio, Circle, Img, Layout, makeScene2D, Rect, Txt, Video, Node} from '@revideo/2d';
import {all, chain, createRef, waitFor} from '@revideo/core';

/**
 * The Revideo scene
 */
const scene = makeScene2D('scene', function* (view) {
    
    const textlines = range(5).map(rec => createRef<Txt>())
    const lines = [
        "This is textline 1.",
        "This is textline 2.",
        "This is textline 3.",
        "This is textline 4.",
        "This is textline 5.",
    ]
    const lineContainers = range(5).map(rec => createRef<Rect>())
    const globalContainer = createRef<Rect>()

    const screenWidth = 1080
    const screenHeight = 1920

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
        <Rect fill={'#00000099'} padding={20} ref={globalContainer} direction={'column'} layout>
            {lines.map((line, index) => 
                <Rect ref={lineContainers[index]} layout>
                    <Txt fill={'#ffffff'} ref={textlines[index]}>{line}</Txt>
                </Rect>
            )}
        </Rect>
    )

    function* test(){
        // yield* lineContainers.map(container => container().fill('#0000ff', 1))
        lineContainers.forEach(container => container().save())
        globalContainer().save()
        globalContainer().layout(false)
        globalContainer().restore()
        lineContainers.forEach(container => container().restore())
        lineContainers.forEach(container => container().layout(false))
        lineContainers.forEach(container => container().clip(true))
        // lineContainers.forEach(container => container().height(4))
        yield* lineContainers.map(container => container().height(0, 1))
        yield* delay(0.5, globalContainer().height(0, 1))
        yield* delay(0, globalContainer().width(0, 1))
        yield* delay(0, globalContainer().padding(0, 0.25))
        /*lineContainers.forEach(container => container().width(10))*/
        // globalContainer().fill('#ff0000')
    }

    yield* delay(2, test())

    yield* waitFor(8)
})

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