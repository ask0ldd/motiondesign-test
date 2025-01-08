import './global.css';
import {Three} from './components/Three';
import {delay, easeInOutCubic, linear, loop, makeProject, map, Reference, sequence, tween, useScene, Vector2} from '@revideo/core';

import {Audio, Circle, Img, Layout, makeScene2D, Rect, Txt, Video, Node, SVG} from '@revideo/2d';
import {all, chain, createRef, waitFor} from '@revideo/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

function setup3DScene() {
  const threeScene = new THREE.Scene();
  const renderer = new THREE.WebGLRenderer();

  const geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
  const material = new THREE.MeshNormalMaterial();

  const mesh = new THREE.Mesh( geometry, material );
  // threeScene.add(mesh);

  let model : THREE.Group<THREE.Object3DEventMap>;

  const loadModel = () => {
    const loader = new GLTFLoader();
    loader.load('http://localhost:9000/public/models/boombox/BoomBox.gltf', (gltf) => {
      gltf.scene.position.set(0, 0, -10);
      gltf.scene.scale.set(200, 200, 200);
      threeScene.add(gltf.scene);
      model = gltf.scene
  })}

  loadModel()

  // Add ambient light
  const ambientLight = new THREE.AmbientLight('white', 0.5); // Adjusted intensity for better effect
  threeScene.add(ambientLight);

  // Add point lights
  const pointLight1 = new THREE.PointLight(0xffffff, 100, 50); // White light
  pointLight1.position.set(5, 5, 5); // Position of the first light
  threeScene.add(pointLight1);

  const pointLight2 = new THREE.PointLight(0xffffff, 100, 50); // White light
  pointLight2.position.set(-5, -5, -5); // Position of the second light
  threeScene.add(pointLight2);

  const pointLight3 = new THREE.PointLight(0xffffff, 100, 50); // White light
  pointLight3.position.set(5, -5, -5); // Position of the third light
  threeScene.add(pointLight3);

  // Optional: Add helpers for the lights to visualize their position and range
  const lightHelper1 = new THREE.PointLightHelper(pointLight1);
  const lightHelper2 = new THREE.PointLightHelper(pointLight2);
  const lightHelper3 = new THREE.PointLightHelper(pointLight3);

  threeScene.add(lightHelper1);
  threeScene.add(lightHelper2);
  threeScene.add(lightHelper3);

  const camera = new THREE.PerspectiveCamera(90);

  mesh.position.set(0, 0, 0);
  mesh.scale.set(1, 1, 1);
  camera.rotation.set(0, 0, 0);
  camera.position.set(0, 0, 0.5);

  const clock = new THREE.Clock();
  function animate() {
    const elapsedTime = clock.getElapsedTime();
    requestAnimationFrame(animate);
    if(model) model.rotation.y += 3.14/100
    renderer.render(threeScene, camera);
  }
  animate();

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
  const starRef = createRef<Img>();
  const blurredStarRef = createRef<Img>();

  yield view.add(<Img ref={starRef} src={'http://localhost:9000/public/star.svg'}/>)

  yield view.add(<Img ref={blurredStarRef} src={'http://localhost:9000/public/star.svg'}/>)
  yield blurredStarRef().filters.blur(100, 0);

  /*yield tween(11, (value) => {
    const scaleValue = Math.abs(Math.cos(value * 2 * Math.PI)); // Scale between 0 and 1
    starRef().scale(scaleValue);
  });*/

  yield loop(() => 
    starRef().scale(0.5, 2).to(1, 2) // Scale down to 0.5 over 1 second, then back to 1 over 1 second
  );

  yield loop(() => 
    blurredStarRef().scale(0.5, 2).to(1, 2) // Scale down to 0.5 over 1 second, then back to 1 over 1 second
  );

  yield view.add(
    <>
      <Three
          width={1080}
          height={1920}
          camera={camera}
          scene={threeScene}
          opacity={0}
          fontWeight={900}
          ref={threeRef}
      />
    </>
  );

  yield view.add(<Txt fill={"white"} ref={txtRef} fontSize={64} fontFamily="Inter"/>)

  yield* chain(
    txtRef().text("PROJECT3D", 1),
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

  /*yield addRotatingCube(threeRef().scene(), 0.1, 0.2, -0.2, 0.1);
  yield addRotatingCube(threeRef().scene(), 0.1, -0.2, -0.2, 0.1);*/

  yield* waitFor(7);

  /*if (chair) {
    yield* tween(4, value => {
      chair.rotation.set(
        0,
        linear(value, 0, 2 * Math.PI),
        0
      );
    });
  } else {
    console.log("error")
  }*/

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