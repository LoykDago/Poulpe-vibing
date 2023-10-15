
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useLoader } from "@react-three/fiber";
import React from "react";

import { RigidBody, CuboidCollider, useRapier } from "@react-three/rapier";

import * as THREE from "three";

function Lobby() {
    const gltf = useLoader(GLTFLoader, "maison.glb");
  return (
    <RigidBody
      type="fixed"
      colliders="trimesh"
      position={[0,2,0]}
    >
      <primitive object={gltf.scene} />
    </RigidBody>
  );
}

export default Lobby;


