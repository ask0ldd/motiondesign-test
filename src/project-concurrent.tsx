import './global.css';
import {delay, easeInOutCubic, makeProject, map, range, sequence, tween, useScene, Vector2} from '@revideo/core';

import {Audio, Circle, Img, Layout, makeScene2D, Rect, Txt, Video, Node} from '@revideo/2d';
import {all, chain, createRef, waitFor} from '@revideo/core';

/**
 * The Revideo scene
 */
const scene = makeScene2D('scene', function* (view) {
    
    const rectangles = range(15).map(rec => createRef<Rect>())
    const layoutRef = createRef<Rect>()

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
        <Rect ref={layoutRef} fill={'#000000aa'} columnGap={40} height={200} layout>
            {rectangles.map((ref) => <Rect ref={ref} width={20} height={800} fill={'blue'} />)}
        </Rect>
    )

    layoutRef().children().forEach(child => {
        child.rotation(45)
        child.save()
    })

    layoutRef().layout(false)

    layoutRef().children().forEach(child => {
        child.restore()
        child.position([child.position.x()-100, child.position.y()-200])
    })

    layoutRef().clip(true)

    layoutRef().width(400)

    yield* all(
        tween(2, value => {
            layoutRef().position.x(map(-1000, (layoutRef().width() / 2) - screenWidth / 2 + 56, easeInOutCubic(value)))
        }),
        tween(2, value => {
            layoutRef().opacity(map(0, 1, easeInOutCubic(value)))
        })
    );

    const txtContainer = createRef<Rect>()
    const txt = createRef<Txt>()
    view.add(
        <Rect ref={txtContainer} position={[-250, 0]} layout>
            <Txt fontFamily={"Inter"} fontSize={42} fontWeight={700} ref={txt} fill={"#ffffff"}>Here is a small text</Txt>
        </Rect>
    )
    txt().save()
    txtContainer().save()
    txtContainer().layout(false)
    txtContainer().restore()
    txt().restore()
    txtContainer().clip(true)
    const height = txtContainer().height()
    txtContainer().height(0)
    yield* all(
        // layoutRef().height(10,2), 
        txtContainer().height(height,2)
    )

    yield* waitFor(4)

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