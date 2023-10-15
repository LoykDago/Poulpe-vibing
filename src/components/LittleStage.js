
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useLoader } from "@react-three/fiber";
import React from "react";

import { RigidBody, CuboidCollider, useRapier } from "@react-three/rapier";

import * as THREE from "three";

function LittleStage() {
    const gltf = useLoader(GLTFLoader, "little stage.glb");
  return (
    <RigidBody
      type="fixed"
      colliders="trimesh"
      position={[0,0,0]}
    >
      <primitive object={gltf.scene} />
    </RigidBody>
  );
}

export default LittleStage;


