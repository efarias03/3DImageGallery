import * as THREE from 'three';
import { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useCursor, MeshReflectorMaterial, Image, Text, Environment, OrbitControls, Loader } from '@react-three/drei';
import { useRoute, useLocation } from 'wouter';
import { easing } from 'maath';
import getUuid from 'uuid-by-string';
import { useControls } from 'leva';

const isMobile = window.innerWidth < 768;
const GOLDENRATIO = 1.61803398875;


export const App = ({ images }) => (
  <>
    <Canvas
      camera={{ fov: `${isMobile ? 110 : 70}` }}>
      <color attach="background" args={['#F0ECE2']} />
      <fog attach="fog" args={['#F0ECE2', 0, 15]} />
      <Suspense fallback={null} >
        <group position={[0, -0.5, 0]}>
          <Frames images={images} />
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[50, 50]} />
            <MeshReflectorMaterial
              blur={[600, 600]}
              resolution={`${isMobile ? 256 : 1080}`}
              mixBlur={0.5}
              mixStrength={1}
              roughness={1}
              depthScale={2}
              minDepthThreshold={1.5}
              maxDepthThreshold={2}
              color="#DFD3C3"
              metalness={1} />
          </mesh>
        </group>
        <Environment preset="city" />
        <Text color={"#000000"} maxWidth={1} anchorX={"center"} anchorY={"top"} position={[0, 4, -2]} fontSize={1}>
          ETIC Museum
        </Text>
      </Suspense>
    </Canvas >
    <Loader />
  </>
);


function Frames({ images, q = new THREE.Quaternion(), p = new THREE.Vector3() }) {
  const ref = useRef();
  const clicked = useRef();
  const [, params] = useRoute("/item/:id");
  const [, setLocation] = useLocation();
  useEffect(() => {
    clicked.current = ref.current.getObjectByName(params?.id);

    if (clicked.current) {
      clicked.current.parent.updateWorldMatrix(true, true);
      clicked.current.parent.localToWorld(p.set(isMobile ? .06 : 0, GOLDENRATIO / 2, isMobile ? 0.8 : 1.25))
      clicked.current.parent.getWorldQuaternion(q);
    } else {
      p.set(0, 0, 5.5);
      q.identity()
    }
  })
  useFrame((state, dt) => {
    easing.damp3(state.camera.position, p, 0.4, dt);
    easing.dampQ(state.camera.quaternion, q, 0.4, dt);
  });

  return (
    <group
      ref={ref}
      onClick={(e) => (e.stopPropagation(), setLocation(clicked.current === e.object ? '/3DImageGallery/' : '/item/' + e.object.name))}
      onPointerMissed={() => setLocation("/3DImageGallery/")}>
      {images.map((props) => <Frame key={props.url} {...props} />)}
    </group>
  )
};


function Frame({ url, c = new THREE.Color(), ...props }) {
  const image = useRef();
  const frame = useRef();
  const [, params] = useRoute("/item/:id")
  const [hover, setHover] = useState(false);
  const [rnd] = useState(() => Math.random());
  const actualName = props.name ? props.name : getUuid(url);
  const name = getUuid(url);
  const isActive = params?.id === name;
  useCursor(hover)
  useFrame((state, dt) => {
    image.current.material.zoom = 1.5 + Math.sin(rnd * 10000 + state.clock.elapsedTime / 3) / 2;
    easing.damp3(image.current.scale, [0.85 * (!isActive && hover ? 0.85 : 1), 0.9 * (!isActive && hover ? 0.905 : 1), 1], 0.1, dt);
    easing.dampC(frame.current.material.color, hover ? 'orange' : 'white', 0.1, dt)
  })

  return (
    <group {...props} >
      <mesh
        name={name}
        onPointerOver={(e) => (e.stopPropagation(), setHover(true))}
        onPointerOut={() => setHover(false)}
        scale={[1, GOLDENRATIO, 0.05]}
        position={[0, GOLDENRATIO / 2, 0]}
      >
        <boxGeometry />
        <meshStandardMaterial
          color={"#151515"}
          metalness={0.5}
          roughness={0.5}
          envMapIntensity={2}
        />
        <mesh ref={frame} raycast={() => null} scale={[0.9, 0.93, 0.9]} position={[0, 0, 0.2]}>
          <boxGeometry />
          <meshBasicMaterial toneMapped={false} fog={false} />
        </mesh>
        <Image raycast={() => null} ref={image} position={[0, 0, 0.7]} url={url} />
      </mesh>
      <Text color={"#000000"} maxWidth={0.1} anchorX={"left"} anchorY={"top"} position={[0.55, GOLDENRATIO, 0]} fontSize={0.025}>
        {actualName ? actualName : name.split("-").join(" ")}
      </Text>
    </group>
  )
}
