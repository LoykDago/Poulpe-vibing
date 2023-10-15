import React, { } from "react";
import "./App.css";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sky,Environment,PositionalAudio} from "@react-three/drei";
import { Physics, RigidBody } from "@react-three/rapier";
import { Suspense } from "react";
import Azazel from "./components/Azazel";
import LittleStage from "./components/LittleStage";
import Lobby from "./components/Lobby";
function App() {
 
  return (
    <Canvas camera={{ position: [-35, 35, 18], fov: 17.5 }}>
      <Suspense>
        <Physics >
          
            <axesHelper scale={20} />
            <Environment files="EnvironmentSky.hdr" />

            <Sky distance={450000} sunPosition={[0, 1, 0]} inclination={0} azimuth={180} mieDirectionalG={0.521} />
            <OrbitControls />
            <directionalLight color="red" position={[0, 10, 5]} />

   
            <Azazel/>
            {/* <CubeMoving position={[0, 1, 32]} color="blue" /> */}
            {/* <Azazel/>
            <CubeMoving position={[0, 4, -2]} color="blue" />
            <CubeMoving position={[-1, 4, 0]} color="blue" />
            <StaticCube />  */}
            <LittleStage/>
            <Lobby/>
        </Physics>
      </Suspense>
    </Canvas>
  );
}

function StaticCube() {

  return (
    <RigidBody position={[0,-2,0]} type="fixed">
      <mesh >
        <boxGeometry args={[22, 1, 22]} />
        <meshStandardMaterial color="orange" />
      </mesh>
    </RigidBody>
  );
}

const rockSound=()=>{
    let rockHit = new Audio('sounds/hitBlock.wav');
    rockHit.play();
}
function CubeMoving({ position, color }) {
  return (
    <RigidBody 
      position={position}
      onCollisionEnter={({ manifold, target, other }) => {
        if(other.rigidBodyObject){
          rockSound()
        }
      }}
    >
      <mesh >
        <boxGeometry />
        <meshStandardMaterial color={color} />
      </mesh>
    </RigidBody>
  );
}



export default App;
