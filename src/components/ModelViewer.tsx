'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader, OrbitControls, OBJLoader, FBXLoader, STLLoader } from 'three-stdlib';
import { Tooltip } from '@/components/Tooltip';

interface ModelViewerProps {
  modelPath: string;
  mtlPath: string;
  texturePath: string;
  width?: number;
  height?: number;
}

export function ModelViewer({ 
  modelPath, 
  mtlPath, 
  texturePath, 
  width = 800, 
  height = 600 
}: ModelViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRotate, setAutoRotate] = useState(false);
  const [autoRotateSpeed, setAutoRotateSpeed] = useState(2);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<any | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Reset camera to initial position
  const resetCamera = () => {
    if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.set(0, 0, 5);
      cameraRef.current.lookAt(0, 0, 0);
      controlsRef.current.reset();
    }
  };

  // Detect file format from path
  const detectFileFormat = (modelPath: string): string => {
    const extension = modelPath.toLowerCase().split('.').pop() || '';
    
    switch (extension) {
      case 'glb':
      case 'gltf':
        return 'gltf';
      case 'obj':
        return 'obj';
      case 'fbx':
        return 'fbx';
      case 'stl':
        return 'stl';
      default:
        return 'unknown';
    }
  };

  // Create loader based on format
  const createLoader = (format: string): THREE.Loader | null => {
    switch (format) {
      case 'gltf':
        return new GLTFLoader();
      case 'obj':
        return new OBJLoader();
      case 'fbx':
        return new FBXLoader();
      case 'stl':
        return new STLLoader();
      default:
        return null;
    }
  };

  // Unified model loading function
  const loadModel = async (modelPath: string, format: string): Promise<THREE.Object3D> => {
    const loader = createLoader(format);
    if (!loader) {
      throw new Error(`Unsupported file format: ${format}`);
    }

    return new Promise((resolve, reject) => {
      if (format === 'gltf') {
        (loader as GLTFLoader).load(
          modelPath,
          (gltf) => {
            resolve(gltf.scene);
          },
          undefined,
          (error) => {
            reject(new Error(`Failed to load GLTF model: ${error.message}`));
          }
        );
      } else if (format === 'obj') {
        (loader as OBJLoader).load(
          modelPath,
          (object) => {
            resolve(object);
          },
          undefined,
          (error) => {
            reject(new Error(`Failed to load OBJ model: ${error.message}`));
          }
        );
      } else if (format === 'fbx') {
        (loader as FBXLoader).load(
          modelPath,
          (object) => {
            resolve(object);
          },
          undefined,
          (error) => {
            reject(new Error(`Failed to load FBX model: ${error.message}`));
          }
        );
      } else if (format === 'stl') {
        (loader as STLLoader).load(
          modelPath,
          (geometry) => {
            const material = new THREE.MeshStandardMaterial({ color: 0xcccccc });
            const mesh = new THREE.Mesh(geometry, material);
            resolve(mesh);
          },
          undefined,
          (error) => {
            reject(new Error(`Failed to load STL model: ${error.message}`));
          }
        );
      } else {
        reject(new Error(`Unsupported file format: ${format}`));
      }
    });
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Initialize OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 1;
    controls.maxDistance = 10;
    controls.maxPolarAngle = Math.PI / 2;
    controls.enablePan = true;
    controls.enableZoom = true;
    controls.enableRotate = true;
    controlsRef.current = controls;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    const loadModelWithFormat = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const format = detectFileFormat(modelPath);
        if (format === 'unknown') {
          throw new Error('Unsupported file format');
        }

        const model = await loadModel(modelPath, format);
        model.scale.set(1, 1, 1);
        model.position.y = -1;
        scene.add(model);

        setIsLoading(false);
      } catch (err) {
        console.error('Error loading model:', err);
        setError(err instanceof Error ? err.message : 'Failed to load 3D model');
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(loadModelWithFormat, 100);

    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      
      // Update controls
      if (controlsRef.current) {
        controlsRef.current.update();
      }

      if (rendererRef.current && cameraRef.current && sceneRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    animate();

    // Handle auto rotate state changes
    useEffect(() => {
      if (controlsRef.current) {
        controlsRef.current.autoRotate = autoRotate;
        controlsRef.current.autoRotateSpeed = autoRotateSpeed;
      }
    }, [autoRotate, autoRotateSpeed]);

    const handleResize = () => {
      if (cameraRef.current && rendererRef.current && containerRef.current) {
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;
        
        cameraRef.current.aspect = width / height;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(width, height);
        
        // Update controls after resize
        if (controlsRef.current) {
          controlsRef.current.update();
        }
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timeoutId);
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      window.removeEventListener('resize', handleResize);
      
      // Dispose controls
      if (controlsRef.current) {
        controlsRef.current.dispose();
      }
      
      if (containerRef.current && rendererRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
      
      if (sceneRef.current) {
        sceneRef.current.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            if (object.geometry) object.geometry.dispose();
            if (object.material) {
              if (Array.isArray(object.material)) {
                object.material.forEach(material => material.dispose());
              } else {
                object.material.dispose();
              }
            }
          }
        });
      }
    };

  }, [modelPath, mtlPath, texturePath, width, height]);

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-full bg-gray-100 rounded-lg overflow-hidden"
      style={{ width, height }}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-700">Loading 3D model...</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Control Panel */}
      <div className="absolute bottom-4 left-4 right-4 bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-md flex items-center gap-2">
        <button 
          onClick={() => setAutoRotate(!autoRotate)}
          className={`p-2 rounded-full ${autoRotate ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-gray-300 transition-colors`}
        >
          <Tooltip content={autoRotate ? 'Pause Auto Rotate' : 'Start Auto Rotate'} side="top" delay={100}>
            {autoRotate ? '⏸️' : '▶️'}
          </Tooltip>
        </button>
        <button 
          onClick={resetCamera}
          className="p-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
        >
          <Tooltip content="Reset Camera" side="top" delay={100}>
            🔄
          </Tooltip>
        </button>
        <div className="flex-1">
          <Tooltip content="Rotation Speed — adjust how fast the model auto-rotates" side="top" delay={100}>
            <input
              type="range"
              min="0.1"
              max="10"
              step="0.1"
              value={autoRotateSpeed}
              onChange={(e) => setAutoRotateSpeed(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </Tooltip>
        </div>
        <span className="text-sm text-gray-600 min-w-[40px]">{autoRotateSpeed.toFixed(1)}x</span>
      </div>
    </div>
  );
}
