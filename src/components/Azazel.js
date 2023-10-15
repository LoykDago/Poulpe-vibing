import { useTrimesh, useBox } from "@react-three/cannon";
import { useGLTF, useAnimations, KeyboardControls } from "@react-three/drei";
import { useLoader, useFrame } from "@react-three/fiber";
import React, { useMemo, useRef, useEffect, useState } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { RigidBody, CuboidCollider, useRapier } from "@react-three/rapier";
import { useKeyboardControls } from "@react-three/drei";
import { MathUtils, Vector3 } from "three";
import * as THREE from "three";

const direction = new Vector3();
const frontVector = new Vector3();
const sideVector = new Vector3();
const characterTranslation = new Vector3();

function AzazelCharacterController() {
  const horizontalVelocity = useRef({ x: 0, z: 0 });
  const characterController = useRef();
  const characterRigidBody = useRef();
  const characterColliderRef = useRef();
  const jumpVelocity = useRef(0);
  const holdingJump = useRef(false);
  const jumpTime = useRef(0);
  const jumping = useRef(false);
  const jumpGravity = 0.6;
  const maxJumpVelocity = 0.8;
  const minJumpVelocity = 0.5;

  const rapier = useRapier();
  const gltf = useLoader(GLTFLoader, "azazel.glb");
  //ANIM
  let mixer = new THREE.AnimationMixer(gltf.scene);
  void mixer.clipAction(gltf.animations[0]).play();
  useFrame((state, delta) => {
    mixer.update(delta);
  });

  const [, getKeyboardControls] = useKeyboardControls();

  useEffect(() => {
    const { world } = rapier;

    characterController.current = world.createCharacterController(0);
    characterController.current.enableAutostep(0.7, 0.3, true);
    characterController.current.enableSnapToGround(0.1);
    characterController.current.setApplyImpulsesToDynamicBodies(true);

    return () => {
      characterController.current.free();
    };
  }, []);

  useFrame((state, delta) => {
    // console.log(delta)
    if (
      !characterRigidBody.current ||
      !characterController.current ||
      !characterColliderRef.current
    ) {
      return;
    }
    const { forward, backward, left, right, jump, sprint } =
      getKeyboardControls();

    const characterCollider = characterColliderRef.current;
    const grounded = characterController.current.computedGrounded();

    frontVector.set(0, 0, Number(backward) - Number(forward));
    sideVector.set(Number(left) - Number(right), 0, 0);
    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(0.2);

    horizontalVelocity.current = {
      x: MathUtils.lerp(horizontalVelocity.current.x, direction.x, 0.5),
      z: MathUtils.lerp(horizontalVelocity.current.z, direction.z, 0.5),
    };

    //jumping
    if (jump && grounded) {
      jumping.current = true;
      holdingJump.current = true;
      jumpTime.current = state.clock.elapsedTime;
      jumpVelocity.current = maxJumpVelocity;
    }

    if (!jump && grounded) {
      jumping.current = false;
    }
    if (jumping.current && holdingJump.current && !jump) {
      if (jumpVelocity.current > minJumpVelocity) {
        jumpVelocity.current = minJumpVelocity;
      }
    }

    if (!jump && grounded) {
      jumpVelocity.current = 0;
    } else {
      jumpVelocity.current += jumpGravity * -0.1;
    }

    holdingJump.current = jump;

    //update everything

    let movementDirection = {
      x: horizontalVelocity.current.x,
      y: jumpVelocity.current * 0.5,
      z: horizontalVelocity.current.z,
    };

    characterController.current.computeColliderMovement(
      characterCollider,
      movementDirection
    );
    const translation = characterRigidBody.current.translation();
    const newPosition = characterTranslation.copy(translation);
    const movement = characterController.current.computedMovement();
    newPosition.x += movement.x;
    newPosition.y += movement.y;
    newPosition.z += movement.z;
    characterRigidBody.current.setNextKinematicTranslation(newPosition);
  });
  return (
    <RigidBody
      ref={characterRigidBody}
      position={[0, 3, 30]}
      enabledRotations={[false, false, false]}
      type="kinematicPosition"
      mass={1}
    >
      <primitive object={gltf.scene} color="red"/>
      <CuboidCollider ref={characterColliderRef} args={[0.5, 1, 0.5]} />
    </RigidBody>
  );
}
function Azazel() {
  return (
    <KeyboardControls
      map={[
        { name: "forward", keys: ["ArrowUp", "w", "W"] },
        { name: "backward", keys: ["ArrowDown", "s", "S"] },
        { name: "left", keys: ["ArrowLeft", "a", "A"] },
        { name: "right", keys: ["ArrowRight", "d", "D"] },
        { name: "jump", keys: ["Space"] },
        { name: "sprint", keys: ["Shift"] },
      ]}
    >
      <AzazelCharacterController />
    </KeyboardControls>
  );
}

export default Azazel;

// let currentImpulse={x:0,y:0,z:0}
// let isFacingForward=true
// const keyDownHandler = (event) => {
//   console.log(rigidBody.current)
//   if (event.code=== "KeyW") {
//     if(!isFacingForward){
//       rigidBody.current.setEnabledRotations(false,true,false)
//       rigidBody.current.applyTorqueImpulse({ x: 0, y: 11, z: 0 }, true);
//       isFacingForward=true
//     }
//     currentImpulse.z=5
//     rigidBody.current.applyImpulse(currentImpulse, true);
//   }
//   else if (event.code=== "KeyA") {
//     currentImpulse.z+=2.5
//     currentImpulse.x+=2.5
//     rigidBody.current.applyImpulse(currentImpulse, true);
//     rigidBody.current.setEnabledRotations(false,true,false)
//     rigidBody.current.applyTorqueImpulse({ x: 0, y: 2.5, z: 0 }, true);

//   }
//   else if (event.code=== "KeyS") {
//     currentImpulse.z=-5
//     if(isFacingForward){
//       rigidBody.current.setEnabledRotations(false,true,false)
//       rigidBody.current.applyTorqueImpulse({ x: 0, y: 11, z: 0 }, true);
//       isFacingForward=false
//     }
//     rigidBody.current.applyImpulse(currentImpulse, true);

//   }
//   else if (event.code=== "KeyD") {
//     rigidBody.current.applyImpulse({ x: -2.5, y: 0, z: 2.5 }, true);
//   }
//   else if (event.code=== "Space") {
//     rigidBody.current.applyImpulse({ x: 0, y: 12, z: 0 }, true);
//   }
// };
// const keyUpHandler = (event) => {
//       event.preventDefault();
//       if (event.code=== "KeyW") {
//         rigidBody.current.setEnabledRotations(false,false,false)

//       }
//       else if (event.code=== "KeyA") {
//         rigidBody.current.setEnabledRotations(false,false,false)

//       }
//       else if (event.code=== "KeyS") {
//         rigidBody.current.setEnabledRotations(false,false,false)
//       }
//       else if (event.code=== "KeyD") {
//       }
//       else if (event.code=== "Space") {
//       }
// };
// document.addEventListener("keydown", keyDownHandler);
// document.addEventListener("keyup", keyUpHandler);
