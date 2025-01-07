import './global.css';
import {Three} from './components/Three';
import {delay, easeInOutCubic, linear, makeProject, map, sequence, tween, useScene, Vector2} from '@revideo/core';

import {Audio, Circle, Img, Layout, makeScene2D, Rect, Txt, Video, Node} from '@revideo/2d';
import {all, chain, createRef, waitFor} from '@revideo/core';
import * as THREE from 'three';

function setup3DScene() {
  const threeScene = new THREE.Scene();

  const geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
  const material = new THREE.MeshNormalMaterial();

  const mesh = new THREE.Mesh( geometry, material );
  threeScene.add(mesh);

  const camera = new THREE.PerspectiveCamera(90);

  mesh.position.set(0, 0, 0);
  mesh.scale.set(1, 1, 1);
  camera.rotation.set(0, 0, 0);
  camera.position.set(0, 0, 0.5);

  return {threeScene, camera, mesh};
}

/**
 * The Revideo scene
 */
const scene = makeScene2D('scene', function* (view) {
  const {threeScene, camera, mesh} = setup3DScene();

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

  const threeRef = createRef<Three>();
  const txtRef = createRef<Txt>();

  yield view.add(
    <>
      <Three
          width={1920}
          height={1080}
          camera={camera}
          scene={threeScene}
          opacity={0}
          fontWeight={900}
          ref={threeRef}
      />
    </>
  );

  yield view.add(<Txt fill={"white"} fontFamily={"Lexend"} ref={txtRef} fontSize={80}/>)

  yield* chain(
    txtRef().text("3D Test", 1),
    all(
      txtRef().position.y(-300, 1),
      delay(0.5, threeRef().opacity(1, 0.5))
    )
  )

  yield tween(4, value => {
    mesh.rotation.set(
        0,
        linear(value, 0, 2*3.14),
        0
    );
  });

  yield* waitFor(2);

  yield addRotatingCube(threeRef().scene(), 0.1, 0.2, -0.2, 0.1);
  yield addRotatingCube(threeRef().scene(), 0.1, -0.2, -0.2, 0.1);

  yield* waitFor(2);

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

function* addRotatingCube(threeScene: THREE.Scene, size: number, x: number, y: number, z: number){
  const geometry = new THREE.BoxGeometry( size, size, size );
  const material = new THREE.MeshNormalMaterial();
  const mesh = new THREE.Mesh( geometry, material );

  mesh.position.set(x, y, z);
  mesh.scale.set(1, 1, 1);

  threeScene.add(mesh);

  yield* tween(4, value => {
      mesh.rotation.set(
          0,
          linear(value, 0, 2*3.14),
          0
      );
  });
}