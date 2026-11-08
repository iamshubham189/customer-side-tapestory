"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, OrbitControls, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import type {
  AvatarBodyRepresentation,
  AvatarCanvas3DProps,
  AvatarViewPreset,
} from "./AvatarCanvas3D.types";

function CameraRig({ viewAngle }: { viewAngle: AvatarViewPreset }) {
  const { camera } = useThree();
  const targetPos = useMemo(() => {
    switch (viewAngle) {
      case "Front":
        return new THREE.Vector3(0, 0.35, 3.35);
      case "Side":
        return new THREE.Vector3(3.25, 0.35, 0.35);
      case "Back":
        return new THREE.Vector3(0, 0.35, -3.35);
      case "Orbit":
      default:
        return new THREE.Vector3(1.85, 0.45, 2.85);
    }
  }, [viewAngle]);

  useEffect(() => {
    camera.position.copy(targetPos);
    camera.lookAt(0, 0.2, 0);
  }, [camera, targetPos]);

  return null;
}

interface MannequinAndGarmentProps {
  colorHex: string;
  fabricFamily: string;
  collarType: string;
  pocketType: string;
  fitEaseFactor: number;
  shoulderScale: number;
  chestScale: number;
  waistScale: number;
  hipScale: number;
  garmentLengthScale: number;
  sleeveLengthScale: number;
  showMeasurementRings: boolean;
  autoRotate: boolean;
}

function MannequinAndGarmentMesh({
  colorHex,
  fabricFamily,
  collarType,
  pocketType,
  fitEaseFactor,
  shoulderScale,
  chestScale,
  waistScale,
  hipScale,
  garmentLengthScale,
  sleeveLengthScale,
  showMeasurementRings,
  autoRotate,
}: MannequinAndGarmentProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.35;
    }
  });

  // Compute physical material properties from selected fabric
  const materialProps = useMemo(() => {
    switch (fabricFamily) {
      case "Silk":
        return { roughness: 0.28, metalness: 0.12, clearcoat: 0.35 };
      case "Wool":
        return { roughness: 0.78, metalness: 0.04, clearcoat: 0.05 };
      case "Cotton":
        return { roughness: 0.68, metalness: 0.02, clearcoat: 0.02 };
      case "Linen":
      default:
        return { roughness: 0.85, metalness: 0.02, clearcoat: 0.0 };
    }
  }, [fabricFamily]);

  const skinMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#d9ccb9",
        roughness: 0.55,
        metalness: 0.05,
      }),
    []
  );

  const standMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#b69a68",
        roughness: 0.32,
        metalness: 0.68,
      }),
    []
  );

  const trouserMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#dad0c0",
        roughness: 0.72,
        metalness: 0.03,
      }),
    []
  );

  const buttonMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#3a2a1d",
        roughness: 0.35,
        metalness: 0.2,
      }),
    []
  );

  const isFourPockets =
    pocketType.toLowerCase().includes("4") ||
    pocketType.toLowerCase().includes("four");
  const isStandCollar =
    collarType.toLowerCase().includes("stand") ||
    collarType.toLowerCase().includes("mandarin");

  const torsoWidth = 0.54 * chestScale * fitEaseFactor;
  const torsoDepth = 0.31 * chestScale * fitEaseFactor;
  const jacketHeight = 0.86 * garmentLengthScale;

  return (
    <group ref={groupRef} position={[0, -0.35, 0]}>
      {/* Tailoring Pedestal Base & Brass Pole */}
      <mesh position={[0, -0.95, 0]} material={standMaterial} receiveShadow>
        <cylinderGeometry args={[0.38, 0.44, 0.08, 48]} />
      </mesh>
      <mesh position={[0, -0.45, 0]} material={standMaterial}>
        <cylinderGeometry args={[0.028, 0.028, 0.95, 24]} />
      </mesh>

      {/* Mannequin Head & Neck */}
      <mesh position={[0, 1.44, 0]} material={skinMaterial} castShadow>
        <sphereGeometry args={[0.145, 32, 32]} />
      </mesh>
      <mesh position={[0, 1.24, 0]} material={skinMaterial} castShadow>
        <cylinderGeometry args={[0.068, 0.078, 0.18, 24]} />
      </mesh>

      {/* Inner Mannequin Torso */}
      <mesh
        position={[0, 0.72, 0]}
        scale={[chestScale, 1, waistScale]}
        material={skinMaterial}
      >
        <cylinderGeometry args={[0.21, 0.18, 0.82, 32]} />
      </mesh>

      {/* Customized Tailored Jacket / Upper Garment */}
      <group position={[0, 0.7, 0]}>
        {/* Main Jacket Body */}
        <RoundedBox
          args={[torsoWidth, jacketHeight, torsoDepth]}
          radius={0.065}
          smoothness={4}
          castShadow
          receiveShadow
        >
          <meshPhysicalMaterial
            color={colorHex}
            roughness={materialProps.roughness}
            metalness={materialProps.metalness}
            clearcoat={materialProps.clearcoat}
          />
        </RoundedBox>

        {/* Sculpted Shoulder Yoke */}
        <RoundedBox
          position={[0, jacketHeight / 2 - 0.05, 0]}
          args={[0.64 * shoulderScale * fitEaseFactor, 0.13, torsoDepth * 1.03]}
          radius={0.05}
          smoothness={4}
          castShadow
        >
          <meshPhysicalMaterial
            color={colorHex}
            roughness={materialProps.roughness}
            metalness={materialProps.metalness}
          />
        </RoundedBox>

        {/* Collar Geometry (Stand Collar vs Pointed/Notch Collar) */}
        {isStandCollar ? (
          <mesh position={[0, jacketHeight / 2 + 0.04, 0]} castShadow>
            <cylinderGeometry args={[0.095, 0.105, 0.09, 32, 1, true]} />
            <meshPhysicalMaterial
              color={colorHex}
              roughness={materialProps.roughness}
              side={THREE.DoubleSide}
            />
          </mesh>
        ) : (
          <group position={[0, jacketHeight / 2 + 0.02, 0.04]}>
            <RoundedBox
              position={[-0.08, 0, 0.08]}
              rotation={[0.2, 0.25, -0.35]}
              args={[0.11, 0.14, 0.02]}
              radius={0.006}
            >
              <meshPhysicalMaterial
                color={colorHex}
                roughness={materialProps.roughness}
              />
            </RoundedBox>
            <RoundedBox
              position={[0.08, 0, 0.08]}
              rotation={[0.2, -0.25, 0.35]}
              args={[0.11, 0.14, 0.02]}
              radius={0.006}
            >
              <meshPhysicalMaterial
                color={colorHex}
                roughness={materialProps.roughness}
              />
            </RoundedBox>
          </group>
        )}

        {/* Center Front Placket & Horn Buttons */}
        <RoundedBox
          position={[0, 0, torsoDepth / 2 + 0.008]}
          args={[0.045, jacketHeight - 0.04, 0.015]}
          radius={0.004}
        >
          <meshPhysicalMaterial
            color={colorHex}
            roughness={materialProps.roughness}
          />
        </RoundedBox>

        {[-0.26, -0.12, 0.02, 0.16, 0.3].map((yPos, idx) => (
          <mesh
            key={idx}
            position={[0, yPos, torsoDepth / 2 + 0.018]}
            rotation={[Math.PI / 2, 0, 0]}
            material={buttonMaterial}
          >
            <cylinderGeometry args={[0.014, 0.014, 0.008, 16]} />
          </mesh>
        ))}

        {/* Utility Flap / Patch Pockets */}
        {isFourPockets && (
          <>
            {/* Upper Chest Pockets */}
            {[-0.145, 0.145].map((xOffset, i) => (
              <RoundedBox
                key={`chest-pocket-${i}`}
                position={[xOffset, 0.16, torsoDepth / 2 + 0.012]}
                args={[0.125, 0.14, 0.022]}
                radius={0.006}
              >
                <meshPhysicalMaterial
                  color={colorHex}
                  roughness={materialProps.roughness}
                />
              </RoundedBox>
            ))}
          </>
        )}

        {/* Lower Hip Pockets */}
        {[-0.15, 0.15].map((xOffset, i) => (
          <RoundedBox
            key={`lower-pocket-${i}`}
            position={[xOffset, -0.17, torsoDepth / 2 + 0.012]}
            args={[0.14, 0.16, 0.024]}
            radius={0.006}
          >
            <meshPhysicalMaterial
              color={colorHex}
              roughness={materialProps.roughness}
            />
          </RoundedBox>
        ))}

        {/* Left & Right Tailored Sleeves */}
        {[-1, 1].map((dir) => {
          const xBase = dir * (0.31 * shoulderScale * fitEaseFactor + 0.04);
          const sleeveLen = 0.68 * sleeveLengthScale;
          return (
            <group
              key={`sleeve-${dir}`}
              position={[xBase, jacketHeight / 2 - 0.1, 0]}
              rotation={[0, 0, dir * -0.12]}
            >
              <mesh position={[0, -sleeveLen / 2, 0]} castShadow>
                <cylinderGeometry
                  args={[0.088 * fitEaseFactor, 0.072 * fitEaseFactor, sleeveLen, 24]}
                />
                <meshPhysicalMaterial
                  color={colorHex}
                  roughness={materialProps.roughness}
                  metalness={materialProps.metalness}
                />
              </mesh>
              {/* Button Cuff Band */}
              <mesh position={[0, -sleeveLen + 0.03, 0]}>
                <cylinderGeometry
                  args={[0.075 * fitEaseFactor, 0.075 * fitEaseFactor, 0.055, 24]}
                />
                <meshPhysicalMaterial
                  color={colorHex}
                  roughness={materialProps.roughness}
                />
              </mesh>
              {/* Mannequin Hand */}
              <mesh
                position={[0, -sleeveLen - 0.04, 0]}
                material={skinMaterial}
              >
                <sphereGeometry args={[0.052, 20, 20]} />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* Lower Tailored Linen Trousers */}
      <group position={[0, -0.12, 0]} scale={[hipScale, 1, hipScale]}>
        <mesh position={[-0.11, -0.32, 0]} material={trouserMaterial} castShadow>
          <cylinderGeometry args={[0.105, 0.092, 0.78, 24]} />
        </mesh>
        <mesh position={[0.11, -0.32, 0]} material={trouserMaterial} castShadow>
          <cylinderGeometry args={[0.105, 0.092, 0.78, 24]} />
        </mesh>
      </group>

      {/* Optional Gold Measurement Guide Rings (Chest / Waist / Hip) */}
      {showMeasurementRings && (
        <group>
          {/* Chest Ring */}
          <mesh position={[0, 0.88, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[torsoWidth * 0.62, 0.006, 16, 64]} />
            <meshBasicMaterial color="#b69a68" />
          </mesh>
          {/* Waist Ring */}
          <mesh position={[0, 0.62, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[torsoWidth * 0.58, 0.006, 16, 64]} />
            <meshBasicMaterial color="#b69a68" />
          </mesh>
          {/* Hip Ring */}
          <mesh position={[0, 0.36, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[torsoWidth * 0.61, 0.006, 16, 64]} />
            <meshBasicMaterial color="#b69a68" />
          </mesh>
        </group>
      )}
    </group>
  );
}

export function AvatarCanvas3D({
  configuration,
  measurements,
  viewAngle,
  bodyRepresentation = "Unisex Balanced",
  fitOverride,
  garmentLengthCm = 72,
  sleeveLengthCm = 61,
  showMeasurementRings = true,
  className,
}: AvatarCanvas3DProps) {
  const activeFit = fitOverride ?? configuration.styleSilhouette.name;

  const fitEaseFactor = useMemo(() => {
    if (activeFit.toLowerCase().includes("slim")) return 0.93;
    if (
      activeFit.toLowerCase().includes("regular") ||
      activeFit.toLowerCase().includes("classic")
    ) {
      return 1.0;
    }
    return 1.07; // Relaxed Fit
  }, [activeFit]);

  const bodyScales = useMemo(() => {
    const baseChest = (measurements?.chest ?? 96) / 96;
    const baseWaist = (measurements?.waist ?? 80) / 80;
    const baseHip = (measurements?.seatHips ?? 98) / 98;
    const baseShoulder = (measurements?.shoulderWidth ?? 44) / 44;

    const repMultipliers: Record<
      AvatarBodyRepresentation,
      { shoulder: number; chest: number; waist: number; hip: number }
    > = {
      "Unisex Balanced": { shoulder: 1, chest: 1, waist: 1, hip: 1 },
      "Feminine Contoured": { shoulder: 0.94, chest: 0.98, waist: 0.88, hip: 1.06 },
      "Masculine Broad": { shoulder: 1.08, chest: 1.05, waist: 0.96, hip: 0.97 },
      Petite: { shoulder: 0.92, chest: 0.92, waist: 0.9, hip: 0.94 },
      Tall: { shoulder: 1.03, chest: 1.02, waist: 0.98, hip: 1.0 },
    };

    const mult = repMultipliers[bodyRepresentation];
    return {
      shoulderScale: THREE.MathUtils.clamp(baseShoulder * mult.shoulder, 0.85, 1.2),
      chestScale: THREE.MathUtils.clamp(baseChest * mult.chest, 0.85, 1.22),
      waistScale: THREE.MathUtils.clamp(baseWaist * mult.waist, 0.8, 1.22),
      hipScale: THREE.MathUtils.clamp(baseHip * mult.hip, 0.85, 1.22),
      garmentLengthScale: THREE.MathUtils.clamp(garmentLengthCm / 72, 0.86, 1.18),
      sleeveLengthScale: THREE.MathUtils.clamp(sleeveLengthCm / 61, 0.84, 1.16),
    };
  }, [measurements, bodyRepresentation, garmentLengthCm, sleeveLengthCm]);

  return (
    <div className={className || "relative size-full select-none"}>
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 0.35, 3.35], fov: 36 }}
      >
        <color attach="background" args={["#e9e0d3"]} />
        <ambientLight intensity={0.85} />
        <directionalLight
          position={[3.5, 5, 4]}
          intensity={1.35}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <directionalLight position={[-3, 2, -2]} intensity={0.45} />
        <Environment preset="city" />

        <CameraRig viewAngle={viewAngle} />

        <MannequinAndGarmentMesh
          colorHex={configuration.color.hex}
          fabricFamily={configuration.fabric.materialFamily}
          collarType={configuration.details.collar}
          pocketType={configuration.details.pockets}
          fitEaseFactor={fitEaseFactor}
          shoulderScale={bodyScales.shoulderScale}
          chestScale={bodyScales.chestScale}
          waistScale={bodyScales.waistScale}
          hipScale={bodyScales.hipScale}
          garmentLengthScale={bodyScales.garmentLengthScale}
          sleeveLengthScale={bodyScales.sleeveLengthScale}
          showMeasurementRings={showMeasurementRings}
          autoRotate={viewAngle === "Orbit"}
        />

        <ContactShadows
          position={[0, -1.35, 0]}
          opacity={0.35}
          scale={4.5}
          blur={2.2}
          far={4}
        />

        <OrbitControls
          enablePan={false}
          minDistance={2.2}
          maxDistance={4.8}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.85}
        />
      </Canvas>
    </div>
  );
}
