import { Canvas, useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

interface TechnologySceneProps {
  activeIndex: number
}

function TechnologyOrb({ activeIndex }: TechnologySceneProps) {
  const group = useRef<THREE.Group>(null)

  const pointer = useRef({ x: 0, y: 0 })
  const targetRotation = useRef({ x: 0, y: 0 })

  const nodes = useMemo(
    () => [
      [-1.8, 0.4, 0],
      [-0.8, 1.3, 0.2],
      [0.5, 1, -0.1],
      [1.6, 0.35, 0.1],
      [1.1, -0.9, -0.2],
      [-0.2, -1.2, 0],
      [-1.4, -0.7, 0.15],
    ] as [number, number, number][],
    [],
  )

  const connections = useMemo(
    () => [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 6],
      [6, 0],
      [1, 5],
      [2, 4],
    ],
    [],
  )

  useFrame(({ pointer: cursor }) => {
    pointer.current.x = cursor.x
    pointer.current.y = cursor.y

    targetRotation.current.y = cursor.x * 0.25
    targetRotation.current.x = -cursor.y * 0.15

    if (!group.current) return

    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      targetRotation.current.y,
      0.04,
    )

    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      targetRotation.current.x,
      0.04,
    )

    group.current.rotation.z += 0.0008
  })

  const accent = new THREE.Color('#c8d751')

  return (
    <group ref={group}>
      {/* outer orbital rings */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.25, 0.006, 8, 128]} />
        <meshBasicMaterial color="#edebe5" transparent opacity={0.18} />
      </mesh>

      <mesh rotation={[0.8, 0.4, 0.2]}>
        <torusGeometry args={[1.7, 0.004, 8, 128]} />
        <meshBasicMaterial color="#c8d751" transparent opacity={0.3} />
      </mesh>

      {/* connection structure */}
      {connections.map(([from, to]) => (
        <Line
          key={`${from}-${to}`}
          points={[nodes[from], nodes[to]]}
          color="#edebe5"
          transparent
          opacity={0.25}
          lineWidth={0.7}
        />
      ))}

      {/* nodes */}
      {nodes.map((position, index) => {
        const isActive = index % 5 === activeIndex

        return (
          <mesh key={index} position={position}>
            <sphereGeometry args={[isActive ? 0.105 : 0.065, 12, 12]} />
            <meshBasicMaterial
              color={isActive ? accent : '#edebe5'}
              transparent
              opacity={isActive ? 1 : 0.65}
            />
          </mesh>
        )
      })}

      {/* central signal */}
      <mesh>
        <icosahedronGeometry args={[0.52, 1]} />
        <meshBasicMaterial
          color="#c8d751"
          wireframe
          transparent
          opacity={0.85}
        />
      </mesh>

      <mesh>
        <sphereGeometry args={[0.34, 24, 24]} />
        <meshBasicMaterial color="#c8d751" transparent opacity={0.12} />
      </mesh>

      {/* axis */}
      <Line
        points={[
          [-2.5, 0, 0],
          [2.5, 0, 0],
        ]}
        color="#edebe5"
        transparent
        opacity={0.1}
        lineWidth={0.5}
      />

      <Line
        points={[
          [0, -2.5, 0],
          [0, 2.5, 0],
        ]}
        color="#edebe5"
        transparent
        opacity={0.1}
        lineWidth={0.5}
      />
    </group>
  )
}

export function TechnologyScene({ activeIndex }: TechnologySceneProps) {
  return (
    <div className="technology-scene" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 38 }}
        dpr={[1, 1.5]}
        frameloop="always"
      >
        <TechnologyOrb activeIndex={activeIndex} />
      </Canvas>

      <span className="technology-scene__label technology-scene__label--top">
        DIRECTION
      </span>

      <span className="technology-scene__label technology-scene__label--left">
        TECHNOLOGY
      </span>

      <span className="technology-scene__label technology-scene__label--right">
        CAREER
      </span>
    </div>
  )
}