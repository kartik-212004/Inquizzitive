import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const FloatingBooks = () => {
  const mountRef = useRef(null);
  
  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 20;
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true,
      powerPreference: 'high-performance' // Request high performance mode
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); // Transparent background
    
    // Add renderer to the DOM
    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }
    
    // Book/paper/educational items materials - using vibrant education-themed colors
    const materials = [
      new THREE.MeshBasicMaterial({ 
        color: 0xFFFFFF, // White for paper
        transparent: true, 
        opacity: 0.4,
        side: THREE.DoubleSide 
      }),
      new THREE.MeshBasicMaterial({ 
        color: 0xFFF8E1, // Light yellow for old paper
        transparent: true, 
        opacity: 0.4,
        side: THREE.DoubleSide 
      }),
      new THREE.MeshBasicMaterial({ 
        color: 0xFFB300, // Amber for book cover
        transparent: true, 
        opacity: 0.35,
        side: THREE.DoubleSide 
      }),
      new THREE.MeshBasicMaterial({ 
        color: 0x42A5F5, // Blue for book cover
        transparent: true, 
        opacity: 0.35,
        side: THREE.DoubleSide 
      }),
      new THREE.MeshBasicMaterial({ 
        color: 0x66BB6A, // Green for book cover
        transparent: true, 
        opacity: 0.35,
        side: THREE.DoubleSide 
      }),
      new THREE.MeshBasicMaterial({ 
        color: 0xEF5350, // Red for book cover
        transparent: true, 
        opacity: 0.35,
        side: THREE.DoubleSide 
      }),
      new THREE.MeshBasicMaterial({ 
        color: 0x9C27B0, // Purple for pen/pencil
        transparent: true, 
        opacity: 0.5,
        side: THREE.DoubleSide 
      }),
      new THREE.MeshBasicMaterial({ 
        color: 0x00BCD4, // Cyan for highlighter
        transparent: true, 
        opacity: 0.4,
        side: THREE.DoubleSide 
      }),
      new THREE.MeshBasicMaterial({ 
        color: 0xFFA000, // Dark amber for notebook
        transparent: true, 
        opacity: 0.4,
        side: THREE.DoubleSide 
      }),
    ];
    
    // Determine object count based on device performance (fewer for mobile)
    const isMobile = window.innerWidth < 768;
    const totalObjects = isMobile ? 18 : 28; // Reduced for better performance
    
    // Create educational items (books, papers, pens, etc.)
    const educationalItems = [];
    
    for (let i = 0; i < totalObjects; i++) {
      let geometry, material, item;
      
      // Determine which type of object to create
      const objectType = Math.random();
      
      if (objectType > 0.85) {
        // Paper/note
        geometry = new THREE.PlaneGeometry(2.5 + Math.random() * 0.5, 3 + Math.random() * 0.5, 1, 1);
        material = materials[Math.floor(Math.random() * 2)]; // White or yellow paper
        item = new THREE.Mesh(geometry, material);
      } else if (objectType > 0.7 && !isMobile) { // Skip complex objects on mobile
        // Open book (two connected planes)
        const group = new THREE.Group();
        
        // Left page
        const leftGeometry = new THREE.PlaneGeometry(1.5 + Math.random() * 0.3, 2 + Math.random() * 0.3, 1, 1);
        const leftMaterial = materials[Math.floor(Math.random() * 2)]; // White or yellow paper
        const leftPage = new THREE.Mesh(leftGeometry, leftMaterial);
        leftPage.position.x = -0.75;
        leftPage.rotation.y = Math.PI / 12; // Slight angle
        
        // Right page
        const rightGeometry = new THREE.PlaneGeometry(1.5 + Math.random() * 0.3, 2 + Math.random() * 0.3, 1, 1);
        const rightMaterial = materials[Math.floor(Math.random() * 2)]; // White or yellow paper
        const rightPage = new THREE.Mesh(rightGeometry, rightMaterial);
        rightPage.position.x = 0.75;
        rightPage.rotation.y = -Math.PI / 12; // Slight angle
        
        // Spine/binding
        const spineGeometry = new THREE.BoxGeometry(0.2, 2 + Math.random() * 0.3, 0.3);
        const spineMaterial = materials[2 + Math.floor(Math.random() * 4)]; // Colored book materials
        const spine = new THREE.Mesh(spineGeometry, spineMaterial);
        
        group.add(leftPage);
        group.add(rightPage);
        group.add(spine);
        
        item = group;
      } else if (objectType > 0.55) {
        // Closed book (use extruded rectangle for more book-like appearance)
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
        material = materials[2 + Math.floor(Math.random() * 4)]; // Colored book covers
        item = new THREE.Mesh(geometry, material);
      } else if (objectType > 0.4) {
        // Pen/pencil (cylinder)
        geometry = new THREE.CylinderGeometry(0.1, 0.1, 4 + Math.random(), 8);
        material = materials[6]; // Purple for pen
        item = new THREE.Mesh(geometry, material);
      } else if (objectType > 0.25) {
        // Highlighter (slightly thicker cylinder)
        geometry = new THREE.CylinderGeometry(0.15, 0.15, 3 + Math.random(), 8);
        material = materials[7]; // Cyan for highlighter
        item = new THREE.Mesh(geometry, material);
      } else if (objectType > 0.1) {
        // Notebook (slightly thicker book)
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
        material = materials[8]; // Dark amber for notebook
        item = new THREE.Mesh(geometry, material);
      } else {
        // Quiz icon (question mark using TorusGeometry)
        geometry = new THREE.TorusGeometry(1 + Math.random() * 0.3, 0.2, 16, 32);
        material = materials[Math.floor(Math.random() * materials.length)];
        item = new THREE.Mesh(geometry, material);
      }
      
      // Set random position in 3D space - distributed more evenly across the screen
      const randomFactor = 0.5;
      item.position.x = (Math.random() - randomFactor) * 50; // wider x-distribution
      item.position.y = (Math.random() - randomFactor) * 35; // taller y-distribution 
      item.position.z = (Math.random() - randomFactor) * 25; // deeper z-distribution
      
      // Set random rotation - create more dynamic angles
      item.rotation.x = Math.random() * Math.PI * 2;
      item.rotation.y = Math.random() * Math.PI * 2;
      item.rotation.z = Math.random() * Math.PI * 2;
      
      // Set random movement parameters - gentler movements for more elegant animation
      item.userData = {
        rotationSpeed: {
          x: (Math.random() - 0.5) * 0.003,
          y: (Math.random() - 0.5) * 0.003,
          z: (Math.random() - 0.5) * 0.003,
        },
        movementSpeed: {
          x: (Math.random() - 0.5) * 0.015,
          y: (Math.random() - 0.5) * 0.01,
          z: (Math.random() - 0.5) * 0.004,
        },
        movementRange: {
          x: { min: item.position.x - 6, max: item.position.x + 6 },
          y: { min: item.position.y - 5, max: item.position.y + 5 },
          z: { min: item.position.z - 3, max: item.position.z + 3 },
        },
      };
      
      scene.add(item);
      educationalItems.push(item);
    }
    
    // Add ambient light for general brightness
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    
    // Add directional light for subtle depth
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    // Add subtle point lights for extra dimension (only on desktop)
    let pointLight1, pointLight2;
    if (!isMobile) {
      pointLight1 = new THREE.PointLight(0xFFB74D, 0.4, 50);
      pointLight1.position.set(10, 10, 10);
      scene.add(pointLight1);
      
      pointLight2 = new THREE.PointLight(0x4FC3F7, 0.4, 50);
      pointLight2.position.set(-10, -10, 10);
      scene.add(pointLight2);
    }
    
    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Add subtle camera movement for more dynamic scene (reduced for mobile)
    let cameraAngle = 0;
    const cameraSpeed = isMobile ? 0.0002 : 0.0004;
    
    // Throttle function to limit how often animation updates
    const throttledRender = (() => {
      let lastTime = 0;
      const interval = isMobile ? 30 : 16; // 30ms on mobile (approx 33fps), 16ms on desktop (approx 60fps)
      
      return (currentTime, renderCallback) => {
        if (currentTime - lastTime >= interval) {
          lastTime = currentTime;
          renderCallback();
        }
      };
    })();
    
    // Animation loop
    let animationFrameId;
    const animate = (timestamp) => {
      animationFrameId = requestAnimationFrame(animate);
      
      // Throttled updates for better performance
      throttledRender(timestamp, () => {
        // Subtly move camera in a circular pattern
        cameraAngle += cameraSpeed;
        camera.position.x = Math.sin(cameraAngle) * 2;
        camera.position.y = Math.cos(cameraAngle) * 1;
        camera.lookAt(0, 0, 0);
        
        // Update each item position and rotation
        educationalItems.forEach(item => {
          // Rotation
          if (item.rotation) {
            item.rotation.x += item.userData.rotationSpeed.x;
            item.rotation.y += item.userData.rotationSpeed.y;
            item.rotation.z += item.userData.rotationSpeed.z;
          } else if (item.children) {
            // For group objects
            item.rotateX(item.userData.rotationSpeed.x);
            item.rotateY(item.userData.rotationSpeed.y);
            item.rotateZ(item.userData.rotationSpeed.z);
          }
          
          // Movement - gentle floating motion
          item.position.x += item.userData.movementSpeed.x;
          item.position.y += item.userData.movementSpeed.y;
          item.position.z += item.userData.movementSpeed.z;
          
          // Reverse direction when reaching bounds
          if (item.position.x <= item.userData.movementRange.x.min || 
              item.position.x >= item.userData.movementRange.x.max) {
            item.userData.movementSpeed.x *= -1;
          }
          if (item.position.y <= item.userData.movementRange.y.min || 
              item.position.y >= item.userData.movementRange.y.max) {
            item.userData.movementSpeed.y *= -1;
          }
          if (item.position.z <= item.userData.movementRange.z.min || 
              item.position.z >= item.userData.movementRange.z.max) {
            item.userData.movementSpeed.z *= -1;
          }
        });
        
        renderer.render(scene, camera);
      });
    };
    
    animate(0);
    
    // Clean up
    return () => {
      // Cancel animation frame
      cancelAnimationFrame(animationFrameId);
      
      // Remove event listener
      window.removeEventListener('resize', handleResize);
      
      // Remove renderer from DOM safely
      if (mountRef.current && renderer.domElement && mountRef.current.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      // Dispose resources
      educationalItems.forEach(item => {
        // Handle single mesh items
        if (item.geometry) {
          item.geometry.dispose();
        }
        
        if (item.material) {
          if (Array.isArray(item.material)) {
            item.material.forEach(mat => {
              if (mat && typeof mat.dispose === 'function') {
                mat.dispose();
              }
            });
          } else if (typeof item.material.dispose === 'function') {
            item.material.dispose();
          }
        }
        
        // Handle group items with children
        if (item.children && item.children.length > 0) {
          item.children.forEach(child => {
            if (child.geometry) child.geometry.dispose();
            if (child.material) {
              if (Array.isArray(child.material)) {
                child.material.forEach(mat => {
                  if (mat) mat.dispose();
                });
              } else {
                child.material.dispose();
              }
            }
          });
        }
        
        // Remove from scene
        scene.remove(item);
      });
      
      // Clear references
      educationalItems.length = 0;
      
      // Clean up lights
      scene.remove(ambientLight);
      scene.remove(directionalLight);
      if (pointLight1) scene.remove(pointLight1);
      if (pointLight2) scene.remove(pointLight2);
      
      // Dispose renderer
      if (renderer) {
        renderer.dispose();
      }
    };
  }, []);
  
  return (
    <div 
      ref={mountRef} 
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%',
        zIndex: 5,
        pointerEvents: 'none' // Allow clicking through the animation
      }}
    />
  );
};

export default FloatingBooks; 