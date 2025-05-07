import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Model URLs - these are free 3D models available from Sketchfab, Google Poly and similar sources
const MODEL_URLS = {
  book1: 'https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/models/book/model.gltf',
  notebook: 'https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/models/notebook/model.gltf',
  pen: 'https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/models/pen/model.gltf',
  pencil: 'https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/models/pencil/model.gltf',
  ruler: 'https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/models/ruler/model.gltf',
  eraser: 'https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/models/eraser/model.gltf',
  calculator: 'https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/models/calculator/model.gltf',
  globe: 'https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/models/globe/model.gltf',
  glasses: 'https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/models/glasses/model.gltf',
  backpack: 'https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/models/backpack/model.gltf',
};

const FloatingBooks = () => {
  const mountRef = useRef(null);
  
  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera setup with improved perspective for a more immersive view
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 20;
    
    // Renderer setup with improved settings
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true,
      powerPreference: 'high-performance',
      precision: 'highp',
      logarithmicDepthBuffer: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    // Add renderer to the DOM
    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }
    
    // Setup DRACO loader for compressed models
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
    
    // Setup GLTF loader with DRACO compression support
    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);
    
    // Orbit controls for better testing (can be removed in production)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 10;
    controls.maxDistance = 50;
    controls.enabled = false; // Disable user interaction by default
    
    // Determine object count based on device performance
    const isMobile = window.innerWidth < 768;
    const totalObjects = isMobile ? 15 : 30;
    
    // Array to store all loaded models
    const educationalItems = [];
    
    // Create custom materials for self-made objects
    const customMaterials = [
      // Paper materials
      new THREE.MeshStandardMaterial({ 
        color: 0xFFFFFF, 
        transparent: true, 
        opacity: 0.7,
        roughness: 0.5,
        metalness: 0.1,
        side: THREE.DoubleSide
      }),
      
      // Book cover materials
      new THREE.MeshStandardMaterial({ 
        color: 0x42A5F5, 
        transparent: true, 
        opacity: 0.8,
        roughness: 0.3,
        metalness: 0.2,
        side: THREE.DoubleSide
      }),
      
      // Mathematical symbol material
      new THREE.MeshBasicMaterial({
        color: 0xFFFFFF,
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide
      })
    ];
    
    // Function to create mathematical symbols
    const createMathSymbol = () => {
      const symbols = ['+', '−', '×', '÷', '=', '∑', '∫', 'π', '√', '∞', '∂', '∇', '≈', '≠', '≤', '≥'];
      const symbolIndex = Math.floor(Math.random() * symbols.length);
      const symbol = symbols[symbolIndex];
      
      // Create canvas with the symbol
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const context = canvas.getContext('2d');
      context.fillStyle = 'white';
      context.font = 'Bold 200px Arial';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText(symbol, 128, 128);
      
      // Create texture from canvas
      const texture = new THREE.CanvasTexture(canvas);
      const symbolMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide
      });
      
      const geometry = new THREE.PlaneGeometry(2, 2);
      return new THREE.Mesh(geometry, symbolMaterial);
    };
    
    // Atom model creation function
    const createAtomModel = () => {
      const atomGroup = new THREE.Group();
      
      // Nucleus
      const nucleusGeometry = new THREE.SphereGeometry(0.3, 16, 16);
      const nucleusMaterial = new THREE.MeshStandardMaterial({
        color: 0xFF5722,
        emissive: 0x441100,
        roughness: 0.2,
        metalness: 0.8
      });
      const nucleus = new THREE.Mesh(nucleusGeometry, nucleusMaterial);
      atomGroup.add(nucleus);
      
      // Electron orbits and electrons
      const orbits = [];
      for (let i = 0; i < 3; i++) {
        const orbitGeometry = new THREE.TorusGeometry(0.8 + i * 0.4, 0.02, 16, 100);
        const orbitMaterial = new THREE.MeshBasicMaterial({
          color: 0xFFFFFF,
          transparent: true,
          opacity: 0.4
        });
        const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
        orbit.rotation.x = Math.PI/2 * Math.random();
        orbit.rotation.y = Math.PI/2 * Math.random();
        atomGroup.add(orbit);
        orbits.push(orbit);
        
        // Add 1-2 electrons per orbit
        const electronCount = 1 + Math.floor(Math.random() * 2);
        for (let j = 0; j < electronCount; j++) {
          const electronGeometry = new THREE.SphereGeometry(0.1, 16, 16);
          const electronMaterial = new THREE.MeshBasicMaterial({
            color: 0x00FFFF,
            emissive: 0x004444,
            transparent: true,
            opacity: 0.9
          });
          const electron = new THREE.Mesh(electronGeometry, electronMaterial);
          electron.userData = {
            orbit: orbit,
            orbitRadius: 0.8 + i * 0.4,
            orbitSpeed: 0.01 + Math.random() * 0.02,
            orbitAngle: (j / electronCount) * Math.PI * 2
          };
          atomGroup.add(electron);
        }
      }
      
      return atomGroup;
    };
    
    // Function to load models and position them
    const loadModels = async () => {
      // Create a mix of loaded models and custom objects
      const modelKeys = Object.keys(MODEL_URLS);
      const loadedModels = [];
      
      // Load a subset of models first
      const modelPromises = [];
      
      // Determine how many pre-made models to load
      const preloadCount = Math.min(modelKeys.length, isMobile ? 5 : 10);
      
      // Create a set to track which models we've already chosen to load
      const selectedModelKeys = new Set();
      
      for (let i = 0; i < preloadCount; i++) {
        // Select a random model that hasn't been selected yet
        let randomIndex;
        do {
          randomIndex = Math.floor(Math.random() * modelKeys.length);
        } while (selectedModelKeys.has(randomIndex));
        
        selectedModelKeys.add(randomIndex);
        const modelKey = modelKeys[randomIndex];
        
        // Load the model
        modelPromises.push(
          new Promise((resolve) => {
            gltfLoader.load(
              MODEL_URLS[modelKey],
              (gltf) => {
                const model = gltf.scene;
                
                // Apply shadows to all meshes
                model.traverse((node) => {
                  if (node.isMesh) {
                    node.castShadow = true;
                    node.receiveShadow = true;
                    
                    // Enhance materials if needed
                    if (node.material) {
                      node.material.transparent = true;
                      node.material.opacity = 0.9;
                      
                      // Make book covers more vibrant
                      if (modelKey.includes('book')) {
                        node.material.color = new THREE.Color(
                          Math.random() * 0.5 + 0.5, 
                          Math.random() * 0.5 + 0.5, 
                          Math.random() * 0.5 + 0.5
                        );
                      }
                    }
                  }
                });
                
                // Scale model appropriately
                const modelScale = getAppropriateModelScale(modelKey);
                model.scale.set(modelScale, modelScale, modelScale);
                
                // Store model type for special animations
                model.userData.modelType = modelKey;
                
                loadedModels.push(model);
                resolve();
              },
              undefined, // onProgress callback not needed
              (error) => {
                console.error(`Error loading model ${modelKey}:`, error);
                resolve(); // Resolve even on error to continue loading other models
              }
            );
          })
        );
      }
      
      // Wait for initial models to load
      await Promise.all(modelPromises);
      
      // Create all objects (mix of loaded models and custom objects)
      for (let i = 0; i < totalObjects; i++) {
        let item;
        
        if (i < loadedModels.length) {
          // Use pre-loaded model
          item = loadedModels[i];
        } else {
          // Create custom object based on random choice
          const objectType = Math.random();
          
          if (objectType > 0.7) {
            // Mathematical symbol
            item = createMathSymbol();
          } else if (objectType > 0.4) {
            // Atom model
            item = createAtomModel();
          } else {
            // Simple floating paper/note
            const geometry = new THREE.PlaneGeometry(3 + Math.random(), 4 + Math.random(), 1, 1);
            const material = customMaterials[0];
            item = new THREE.Mesh(geometry, material);
            
            // Add text to some papers
            if (Math.random() > 0.5) {
              const canvas = document.createElement('canvas');
              canvas.width = 512;
              canvas.height = 512;
              const context = canvas.getContext('2d');
              context.fillStyle = 'black';
              context.font = '24px Arial';
              
              // Draw lines of "text"
              for (let line = 0; line < 10; line++) {
                const lineLength = Math.random() * 0.7 + 0.3; // Between 0.3 and 1.0
                context.fillRect(50, 50 + line * 40, 412 * lineLength, 20);
              }
              
              const texture = new THREE.CanvasTexture(canvas);
              const textMaterial = new THREE.MeshBasicMaterial({
                map: texture,
                transparent: true,
                opacity: 0.9,
                side: THREE.DoubleSide
              });
              
              const textPlane = new THREE.Mesh(
                new THREE.PlaneGeometry(2.9, 3.9),
                textMaterial
              );
              textPlane.position.z = 0.01;
              item.add(textPlane);
            }
          }
          
          // Store type for animations
          item.userData.modelType = 'custom';
        }
        
        // Set random position with wider distribution
        const distributionFactor = 0.5;
        item.position.x = (Math.random() - distributionFactor) * 50;
        item.position.y = (Math.random() - distributionFactor) * 35;
        item.position.z = (Math.random() - distributionFactor) * 30;
        
        // Set random rotation
        item.rotation.x = Math.random() * Math.PI * 2;
        item.rotation.y = Math.random() * Math.PI * 2;
        item.rotation.z = Math.random() * Math.PI * 2;
        
        // Add movement parameters
        item.userData = {
          ...item.userData,
          rotationSpeed: {
            x: (Math.random() - 0.5) * 0.002,
            y: (Math.random() - 0.5) * 0.002,
            z: (Math.random() - 0.5) * 0.002,
          },
          movementRange: {
            x: { min: item.position.x - 7, max: item.position.x + 7 },
            y: { min: item.position.y - 6, max: item.position.y + 6 },
            z: { min: item.position.z - 4, max: item.position.z + 4 },
          },
          phaseOffset: {
            x: Math.random() * Math.PI * 2,
            y: Math.random() * Math.PI * 2,
            z: Math.random() * Math.PI * 2,
          },
          period: {
            x: 3 + Math.random() * 4,
            y: 3 + Math.random() * 4,
            z: 4 + Math.random() * 5,
          }
        };
        
        // Add to scene and item array
        scene.add(item);
        educationalItems.push(item);
      }
    };
    
    // Helper function to determine appropriate scale for each model type
    const getAppropriateModelScale = (modelKey) => {
      switch (modelKey) {
        case 'book1':
          return 2 + Math.random() * 0.5;
        case 'notebook':
          return 1.8 + Math.random() * 0.3;
        case 'pen':
        case 'pencil':
          return 1.5 + Math.random() * 0.5;
        case 'ruler':
          return 2 + Math.random() * 0.5;
        case 'eraser':
          return 1.2 + Math.random() * 0.3;
        case 'calculator':
          return 1.5 + Math.random() * 0.3;
        case 'globe':
          return 1.8 + Math.random() * 0.4;
        case 'glasses':
          return 1.3 + Math.random() * 0.2;
        case 'backpack':
          return 2.5 + Math.random() * 0.5;
        default:
          return 1.5;
      }
    };
    
    // Improved lighting setup
    // Ambient light for general brightness
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    
    // Directional light for depth and shadows
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    scene.add(directionalLight);
    
    // Point lights for color and dimension
    let pointLight1, pointLight2, pointLight3;
    if (!isMobile) {
      // Warm amber light
      pointLight1 = new THREE.PointLight(0xFFB74D, 0.6, 70);
      pointLight1.position.set(10, 10, 10);
      scene.add(pointLight1);
      
      // Cool blue light
      pointLight2 = new THREE.PointLight(0x4FC3F7, 0.6, 70);
      pointLight2.position.set(-10, -10, 10);
      scene.add(pointLight2);
      
      // Purple accent light
      pointLight3 = new THREE.PointLight(0xD1C4E9, 0.5, 60);
      pointLight3.position.set(0, 15, -10);
      scene.add(pointLight3);
    }
    
    // Handle window resize
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // Update camera
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      
      // Update renderer
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    
    window.addEventListener('resize', handleResize);
    
    // Animation loop ID for cleanup
    let animationFrameId;
    
    // Animation function
    const animate = (timestamp) => {
      animationFrameId = requestAnimationFrame(animate);
      
      // Update orbit controls if enabled
      controls.update();
      
      const time = timestamp * 0.001; // Convert to seconds
      
      // Update each educational item
      educationalItems.forEach(item => {
        // Get movement properties
        const { rotationSpeed, movementRange, phaseOffset, period, modelType } = item.userData;
        
        // Apply special animation for atom models
        if (modelType === 'custom') {
          // Handle custom atom models
          item.children.forEach(child => {
            if (child.userData && child.userData.orbitRadius) {
              child.userData.orbitAngle += child.userData.orbitSpeed;
              
              // Calculate position on orbit
              const orbit = child.userData.orbit;
              const orbitMatrix = new THREE.Matrix4().makeRotationFromEuler(orbit.rotation);
              
              const angle = child.userData.orbitAngle;
              const radius = child.userData.orbitRadius;
              
              // Base position on unrotated circle
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              const z = 0;
              
              // Apply orbit rotation
              const position = new THREE.Vector3(x, y, z);
              position.applyMatrix4(orbitMatrix);
              
              child.position.copy(position);
            }
          });
        }
        
        // Special animation for books - they open and close slightly
        if (modelType && modelType.includes('book')) {
          // Subtle opening/closing animation
          const openAngle = Math.sin(time / 2 + phaseOffset.x) * 0.1;
          if (item.children.length > 1) {
            // Assuming book has cover parts that can be animated
            item.children.forEach((part, index) => {
              if (index > 0 && part.isMesh) {
                part.rotation.y = openAngle;
              }
            });
          }
        }
        
        // Rotate all items
        item.rotation.x += rotationSpeed.x;
        item.rotation.y += rotationSpeed.y;
        item.rotation.z += rotationSpeed.z;
        
        // Apply smooth sinusoidal movement to all items
        item.position.x = 
          ((movementRange.x.min + movementRange.x.max) / 2) + 
          ((movementRange.x.max - movementRange.x.min) / 2) * 
          Math.sin(time / period.x + phaseOffset.x);
        
        item.position.y = 
          ((movementRange.y.min + movementRange.y.max) / 2) + 
          ((movementRange.y.max - movementRange.y.min) / 2) * 
          Math.sin(time / period.y + phaseOffset.y);
        
        item.position.z = 
          ((movementRange.z.min + movementRange.z.max) / 2) + 
          ((movementRange.z.max - movementRange.z.min) / 2) * 
          Math.sin(time / period.z + phaseOffset.z);
      });
      
      // Gently rotate camera for parallax effect (only on desktop)
      if (!isMobile) {
        const cameraAngleX = Math.sin(time * 0.1) * 0.2;
        const cameraAngleY = Math.cos(time * 0.15) * 0.2;
        camera.position.x = Math.sin(cameraAngleX) * 2;
        camera.position.y = Math.sin(cameraAngleY) * 1;
        camera.lookAt(0, 0, 0);
      }
      
      // Animate lights
      if (!isMobile && pointLight1 && pointLight2 && pointLight3) {
        pointLight1.position.x = Math.sin(time * 0.3) * 15;
        pointLight1.position.y = Math.cos(time * 0.2) * 10;
        
        pointLight2.position.x = Math.sin(time * 0.4) * -15;
        pointLight2.position.y = Math.cos(time * 0.3) * -10;
        
        pointLight3.position.x = Math.sin(time * 0.2) * 10;
        pointLight3.position.z = Math.cos(time * 0.3) * -15;
      }
      
      renderer.render(scene, camera);
    };
    
    // Start loading models, then begin animation
    loadModels().then(() => {
      animate(0);
    });
    
    // Clean up function
    return () => {
      // Cancel animation frame
      cancelAnimationFrame(animationFrameId);
      
      // Remove event listener
      window.removeEventListener('resize', handleResize);
      
      // Dispose orbit controls
      controls.dispose();
      
      // Properly dispose ThreeJS resources
      educationalItems.forEach(item => {
        // Remove from scene
        scene.remove(item);
        
        // Traverse and dispose all geometries and materials
        item.traverse((node) => {
          if (node.isMesh) {
            if (node.geometry) node.geometry.dispose();
            
            if (node.material) {
              if (Array.isArray(node.material)) {
                node.material.forEach(material => {
                  if (material.map) material.map.dispose();
                  material.dispose();
                });
              } else {
                if (node.material.map) node.material.map.dispose();
                node.material.dispose();
              }
            }
          }
        });
      });
      
      // Dispose of lights
      scene.remove(ambientLight);
      scene.remove(directionalLight);
      if (pointLight1) scene.remove(pointLight1);
      if (pointLight2) scene.remove(pointLight2);
      if (pointLight3) scene.remove(pointLight3);
      
      // Dispose of loader
      dracoLoader.dispose();
      
      // Dispose of renderer
      renderer.dispose();
      
      // Clean up DOM
      if (mountRef.current && mountRef.current.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      } else if (mountRef.current) {
        mountRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <motion.div 
      ref={mountRef} 
      className="absolute top-0 left-0 w-full h-full z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
    />
  );
};

export default FloatingBooks; 