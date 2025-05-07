import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';

const FloatingBooks = () => {
  const mountRef = useRef(null);
  
  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera setup with improved perspective for a more immersive view
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 20;
    
    // Renderer setup with improved settings for better performance and visuals
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
    
    // Add renderer to the DOM
    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }
    
    // Enhanced materials with better textures and colors for educational items
    const materials = [
      // Paper materials
      new THREE.MeshStandardMaterial({ 
        color: 0xFFFFFF, 
        transparent: true, 
        opacity: 0.7,
        roughness: 0.5,
        metalness: 0.1,
        side: THREE.DoubleSide,
        depthWrite: false
      }),
      new THREE.MeshStandardMaterial({ 
        color: 0xFFF8E1, 
        transparent: true, 
        opacity: 0.6,
        roughness: 0.6,
        metalness: 0.1,
        side: THREE.DoubleSide,
        depthWrite: false
      }),
      
      // Book cover materials
      new THREE.MeshStandardMaterial({ 
        color: 0xFFB300, 
        transparent: true, 
        opacity: 0.8,
        roughness: 0.3,
        metalness: 0.2,
        side: THREE.DoubleSide,
        depthWrite: false
      }),
      new THREE.MeshStandardMaterial({ 
        color: 0x42A5F5, 
        transparent: true, 
        opacity: 0.8,
        roughness: 0.3,
        metalness: 0.2,
        side: THREE.DoubleSide,
        depthWrite: false
      }),
      new THREE.MeshStandardMaterial({ 
        color: 0x66BB6A, 
        transparent: true, 
        opacity: 0.8,
        roughness: 0.3,
        metalness: 0.2,
        side: THREE.DoubleSide,
        depthWrite: false
      }),
      new THREE.MeshStandardMaterial({ 
        color: 0xEF5350, 
        transparent: true, 
        opacity: 0.8,
        roughness: 0.3,
        metalness: 0.2,
        side: THREE.DoubleSide,
        depthWrite: false
      }),
      
      // Stationery materials
      new THREE.MeshStandardMaterial({ 
        color: 0x9C27B0, 
        transparent: true, 
        opacity: 0.8,
        roughness: 0.2,
        metalness: 0.3,
        side: THREE.DoubleSide,
        depthWrite: false
      }),
      new THREE.MeshStandardMaterial({ 
        color: 0x00BCD4, 
        transparent: true, 
        opacity: 0.7,
        roughness: 0.2,
        metalness: 0.3,
        side: THREE.DoubleSide,
        depthWrite: false
      }),
      
      // Notebook materials
      new THREE.MeshStandardMaterial({ 
        color: 0xFFA000, 
        transparent: true, 
        opacity: 0.8,
        roughness: 0.4,
        metalness: 0.1,
        side: THREE.DoubleSide,
        depthWrite: false
      }),
      
      // New calculator material
      new THREE.MeshStandardMaterial({ 
        color: 0x212121, 
        transparent: true, 
        opacity: 0.9,
        roughness: 0.2,
        metalness: 0.5,
        side: THREE.DoubleSide,
        depthWrite: false
      }),
      
      // New ruler material
      new THREE.MeshStandardMaterial({ 
        color: 0x4CAF50, 
        transparent: true, 
        opacity: 0.7,
        roughness: 0.3,
        metalness: 0.2,
        side: THREE.DoubleSide,
        depthWrite: false
      }),
      
      // New globe material
      new THREE.MeshStandardMaterial({ 
        color: 0x2196F3, 
        transparent: true, 
        opacity: 0.8,
        roughness: 0.3,
        metalness: 0.4,
        side: THREE.DoubleSide,
        depthWrite: false
      }),
      
      // New physics object material
      new THREE.MeshStandardMaterial({ 
        color: 0xFF5722, 
        transparent: true, 
        opacity: 0.7,
        roughness: 0.2,
        metalness: 0.3,
        side: THREE.DoubleSide,
        depthWrite: false
      }),
    ];
    
    // Determine object count based on device performance
    const isMobile = window.innerWidth < 768;
    const totalObjects = isMobile ? 20 : 35;
    
    // Create educational items with more variety
    const educationalItems = [];
    
    for (let i = 0; i < totalObjects; i++) {
      let geometry, material, item;
      
      // Determine which type of object to create with more variety
      const objectType = Math.random();
      
      if (objectType > 0.85) {
        // Paper/note
        geometry = new THREE.PlaneGeometry(2.5 + Math.random() * 0.5, 3 + Math.random() * 0.5, 1, 1);
        material = materials[Math.floor(Math.random() * 2)];
        item = new THREE.Mesh(geometry, material);
      } else if (objectType > 0.75 && !isMobile) {
        // Open book
        const group = new THREE.Group();
        
        // Left page
        const leftGeometry = new THREE.PlaneGeometry(1.5 + Math.random() * 0.3, 2 + Math.random() * 0.3, 1, 1);
        const leftMaterial = materials[Math.floor(Math.random() * 2)];
        const leftPage = new THREE.Mesh(leftGeometry, leftMaterial);
        leftPage.position.x = -0.75;
        leftPage.rotation.y = Math.PI / 12;
        
        // Right page
        const rightGeometry = new THREE.PlaneGeometry(1.5 + Math.random() * 0.3, 2 + Math.random() * 0.3, 1, 1);
        const rightMaterial = materials[Math.floor(Math.random() * 2)];
        const rightPage = new THREE.Mesh(rightGeometry, rightMaterial);
        rightPage.position.x = 0.75;
        rightPage.rotation.y = -Math.PI / 12;
        
        // Spine
        const spineGeometry = new THREE.BoxGeometry(0.2, 2 + Math.random() * 0.3, 0.3);
        const spineMaterial = materials[2 + Math.floor(Math.random() * 4)];
        const spine = new THREE.Mesh(spineGeometry, spineMaterial);
        
        group.add(leftPage);
        group.add(rightPage);
        group.add(spine);
        
        item = group;
      } else if (objectType > 0.65) {
        // Closed book
        const shape = new THREE.Shape();
        const width = 2 + Math.random() * 0.5;
        const height = 3 + Math.random() * 0.5;
        const thickness = 0.5 + Math.random() * 0.5;
        
        shape.moveTo(0, 0);
        shape.lineTo(width, 0);
        shape.lineTo(width, height);
        shape.lineTo(0, height);
        shape.lineTo(0, 0);
        
        const extrudeSettings = {
          steps: 1,
          depth: thickness,
          bevelEnabled: false
        };
        
        geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        material = materials[2 + Math.floor(Math.random() * 4)];
        item = new THREE.Mesh(geometry, material);
      } else if (objectType > 0.55) {
        // Pen/pencil
        geometry = new THREE.CylinderGeometry(0.1, 0.1, 4 + Math.random(), 8);
        material = materials[6];
        item = new THREE.Mesh(geometry, material);
      } else if (objectType > 0.45) {
        // Highlighter
        geometry = new THREE.CylinderGeometry(0.15, 0.15, 3 + Math.random(), 8);
        material = materials[7];
        item = new THREE.Mesh(geometry, material);
      } else if (objectType > 0.38) {
        // Notebook
        const shape = new THREE.Shape();
        const width = 2 + Math.random() * 0.3;
        const height = 2.5 + Math.random() * 0.3;
        const thickness = 0.3 + Math.random() * 0.2;
        
        shape.moveTo(0, 0);
        shape.lineTo(width, 0);
        shape.lineTo(width, height);
        shape.lineTo(0, height);
        shape.lineTo(0, 0);
        
        const extrudeSettings = {
          steps: 1,
          depth: thickness,
          bevelEnabled: false
        };
        
        geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        material = materials[8];
        item = new THREE.Mesh(geometry, material);
      } else if (objectType > 0.32) {
        // Calculator
        const group = new THREE.Group();
        
        // Calculator body
        const bodyGeometry = new THREE.BoxGeometry(1.8, 3, 0.2);
        const bodyMaterial = materials[9];
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        
        // Calculator screen
        const screenGeometry = new THREE.PlaneGeometry(1.4, 0.8);
        const screenMaterial = new THREE.MeshBasicMaterial({
          color: 0x7CFC00,
          transparent: true,
          opacity: 0.7,
        });
        const screen = new THREE.Mesh(screenGeometry, screenMaterial);
        screen.position.z = 0.11;
        screen.position.y = 1;
        
        // Add some buttons
        for (let row = 0; row < 4; row++) {
          for (let col = 0; col < 4; col++) {
            const buttonGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.1);
            const buttonMaterial = new THREE.MeshBasicMaterial({
              color: 0xFFFFFF,
              transparent: true,
              opacity: 0.9,
            });
            const button = new THREE.Mesh(buttonGeometry, buttonMaterial);
            button.position.x = (col * 0.4) - 0.6;
            button.position.y = (row * 0.4) - 0.6;
            button.position.z = 0.11;
            group.add(button);
          }
        }
        
        group.add(body);
        group.add(screen);
        item = group;
      } else if (objectType > 0.26) {
        // Ruler
        const shape = new THREE.Shape();
        const width = 5;
        const height = 0.6;
        
        shape.moveTo(0, 0);
        shape.lineTo(width, 0);
        shape.lineTo(width, height);
        shape.lineTo(0, height);
        shape.lineTo(0, 0);
        
        const extrudeSettings = {
          steps: 1,
          depth: 0.05,
          bevelEnabled: false
        };
        
        geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        material = materials[10];
        item = new THREE.Mesh(geometry, material);
        
        // Add ruler marks
        const marks = new THREE.Group();
        for (let i = 0; i < 10; i++) {
          const markGeometry = new THREE.PlaneGeometry(0.02, i % 5 === 0 ? 0.4 : (i % 2 === 0 ? 0.3 : 0.2));
          const markMaterial = new THREE.MeshBasicMaterial({
            color: 0x000000,
            transparent: true,
            opacity: 0.8,
            side: THREE.DoubleSide
          });
          const mark = new THREE.Mesh(markGeometry, markMaterial);
          mark.position.x = i * 0.5 - width/2 + 0.25;
          mark.position.z = 0.03;
          marks.add(mark);
        }
        item.add(marks);
      } else if (objectType > 0.20 && !isMobile) {
        // Globe
        const globeRadius = 1.2;
        geometry = new THREE.SphereGeometry(globeRadius, 32, 32);
        material = materials[11];
        item = new THREE.Mesh(geometry, material);
        
        // Add longitude/latitude lines
        const linesMaterial = new THREE.LineBasicMaterial({ 
          color: 0xFFFFFF,
          transparent: true,
          opacity: 0.3
        });
        
        // Longitude lines
        for (let i = 0; i < 12; i++) {
          const points = [];
          const angle = (i / 12) * Math.PI * 2;
          for (let j = 0; j <= 32; j++) {
            const phi = (j / 32) * Math.PI * 2;
            const x = globeRadius * Math.cos(angle) * Math.sin(phi);
            const y = globeRadius * Math.sin(angle) * Math.sin(phi);
            const z = globeRadius * Math.cos(phi);
            points.push(new THREE.Vector3(x, z, y));
          }
          const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
          const line = new THREE.Line(lineGeometry, linesMaterial);
          item.add(line);
        }
        
        // Latitude lines
        for (let i = 0; i < 6; i++) {
          const points = [];
          const phi = (i / 6) * Math.PI;
          const radius = globeRadius * Math.sin(phi);
          const y = globeRadius * Math.cos(phi);
          for (let j = 0; j <= 32; j++) {
            const angle = (j / 32) * Math.PI * 2;
            const x = radius * Math.cos(angle);
            const z = radius * Math.sin(angle);
            points.push(new THREE.Vector3(x, y, z));
          }
          const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
          const line = new THREE.Line(lineGeometry, linesMaterial);
          item.add(line);
        }
      } else if (objectType > 0.15) {
        // Physics object - atom model
        const atomGroup = new THREE.Group();
        
        // Nucleus
        const nucleusGeometry = new THREE.SphereGeometry(0.3, 16, 16);
        const nucleusMaterial = materials[12];
        const nucleus = new THREE.Mesh(nucleusGeometry, nucleusMaterial);
        atomGroup.add(nucleus);
        
        // Electron orbits
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
          
          // Electron
          const electronGeometry = new THREE.SphereGeometry(0.1, 16, 16);
          const electronMaterial = new THREE.MeshBasicMaterial({
            color: 0x00FFFF,
            transparent: true,
            opacity: 0.8
          });
          const electron = new THREE.Mesh(electronGeometry, electronMaterial);
          electron.userData = {
            orbit: orbit,
            orbitRadius: 0.8 + i * 0.4,
            orbitSpeed: 0.01 + Math.random() * 0.02,
            orbitAngle: Math.random() * Math.PI * 2
          };
          
          atomGroup.add(electron);
        }
        
        item = atomGroup;
      } else if (objectType > 0.10) {
        // Mathematical symbol
        const symbols = ['+', '−', '×', '÷', '=', '∑', '∫', 'π', '√', '∞'];
        const symbolIndex = Math.floor(Math.random() * symbols.length);
        const symbol = symbols[symbolIndex];
        
        // Create a canvas with the symbol
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
          opacity: 0.7,
          side: THREE.DoubleSide
        });
        
        geometry = new THREE.PlaneGeometry(1.5, 1.5);
        item = new THREE.Mesh(geometry, symbolMaterial);
      } else {
        // Quiz icon (question mark)
        geometry = new THREE.TorusGeometry(0.8 + Math.random() * 0.3, 0.2, 16, 32);
        material = materials[Math.floor(Math.random() * materials.length)];
        item = new THREE.Mesh(geometry, material);
      }
      
      // Set random position with wider distribution
      const distributionFactor = 0.5;
      item.position.x = (Math.random() - distributionFactor) * 55;
      item.position.y = (Math.random() - distributionFactor) * 40;
      item.position.z = (Math.random() - distributionFactor) * 35; 
      
      // Set random rotation
      item.rotation.x = Math.random() * Math.PI * 2;
      item.rotation.y = Math.random() * Math.PI * 2;
      item.rotation.z = Math.random() * Math.PI * 2;
      
      // Enhanced movement parameters
      item.userData = {
        rotationSpeed: {
          x: (Math.random() - 0.5) * 0.002,
          y: (Math.random() - 0.5) * 0.002,
          z: (Math.random() - 0.5) * 0.002,
        },
        movementSpeed: {
          x: (Math.random() - 0.5) * 0.010,
          y: (Math.random() - 0.5) * 0.008,
          z: (Math.random() - 0.5) * 0.003,
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
        },
        itemType: objectType > 0.15 && objectType <= 0.20 ? 'atom' : 'regular'
      };
      
      scene.add(item);
      educationalItems.push(item);
    }
    
    // Improved lighting setup
    // Ambient light for general brightness
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    
    // Directional light for depth
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(5, 5, 5);
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
      
      const time = timestamp * 0.001; // Convert to seconds
      
      // Update each educational item
      educationalItems.forEach(item => {
        // Special animation for atom model
        if (item.userData.itemType === 'atom') {
          // Rotate the entire atom
          item.rotation.x += 0.002;
          item.rotation.y += 0.003;
          
          // Animate electrons around orbits
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
        } else {
          // Regular movement for other items
          const { rotationSpeed, movementRange, phaseOffset, period } = item.userData;
          
          // Apply smooth rotation
          item.rotation.x += rotationSpeed.x;
          item.rotation.y += rotationSpeed.y;
          item.rotation.z += rotationSpeed.z;
          
          // Apply smooth sinusoidal movement
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
        }
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
    
    animate(0);
    
    // Clean up function
    return () => {
      // Cancel animation frame
      cancelAnimationFrame(animationFrameId);
      
      // Remove event listener
      window.removeEventListener('resize', handleResize);
      
      // Properly dispose ThreeJS resources
      educationalItems.forEach(item => {
        if (item.children && item.children.length > 0) {
          // Handle group objects
          item.children.forEach(child => {
            if (child.geometry) child.geometry.dispose();
            if (child.material) {
              if (Array.isArray(child.material)) {
                child.material.forEach(material => material.dispose());
              } else {
                child.material.dispose();
              }
            }
            scene.remove(child);
          });
        }
        
        // Handle single mesh objects
        if (item.geometry) item.geometry.dispose();
        if (item.material) {
          if (Array.isArray(item.material)) {
            item.material.forEach(material => material.dispose());
          } else {
            item.material.dispose();
          }
        }
        scene.remove(item);
      });
      
      // Dispose of lights
      scene.remove(ambientLight);
      scene.remove(directionalLight);
      if (pointLight1) scene.remove(pointLight1);
      if (pointLight2) scene.remove(pointLight2);
      if (pointLight3) scene.remove(pointLight3);
      
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