import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const FloatingObjects = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    // Current reference to the div
    const currentRef = mountRef.current;
    
    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75, 
      window.innerWidth / window.innerHeight, 
      0.1, 
      1000
    );
    camera.position.z = 5;
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setClearColor(0x000000, 0); // transparent background
    renderer.setSize(window.innerWidth, window.innerHeight);
    currentRef.appendChild(renderer.domElement);
    
    // Create a group to hold all objects
    const group = new THREE.Group();
    scene.add(group);
    
    // Create floating objects
    const objects = [];
    const objectColors = [
      0x3498db, // blue
      0xe74c3c, // red
      0x2ecc71, // green
      0xf39c12, // orange
      0x9b59b6, // purple
    ];
    
    // Create 15 random objects
    for (let i = 0; i < 15; i++) {
      let geometry;
      const random = Math.random();
      
      // Random geometry type
      if (random < 0.33) {
        geometry = new THREE.SphereGeometry(0.3, 32, 32);
      } else if (random < 0.66) {
        geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
      } else {
        geometry = new THREE.TorusGeometry(0.3, 0.1, 16, 100);
      }
      
      // Create material with random color
      const colorIndex = Math.floor(Math.random() * objectColors.length);
      const material = new THREE.MeshBasicMaterial({ 
        color: objectColors[colorIndex],
        transparent: true,
        opacity: 0.7
      });
      
      // Create mesh and set random position
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.x = (Math.random() - 0.5) * 10;
      mesh.position.y = (Math.random() - 0.5) * 10;
      mesh.position.z = (Math.random() - 0.5) * 10;
      
      // Store animation properties
      mesh.userData = {
        rotationSpeed: {
          x: (Math.random() - 0.5) * 0.01,
          y: (Math.random() - 0.5) * 0.01,
          z: (Math.random() - 0.5) * 0.01
        },
        movementSpeed: {
          x: (Math.random() - 0.5) * 0.005,
          y: (Math.random() - 0.5) * 0.005,
          z: (Math.random() - 0.5) * 0.005
        }
      };
      
      group.add(mesh);
      objects.push(mesh);
    }
    
    // Animation loop
    const animate = () => {
      objects.forEach(obj => {
        // Rotate the object
        obj.rotation.x += obj.userData.rotationSpeed.x;
        obj.rotation.y += obj.userData.rotationSpeed.y;
        obj.rotation.z += obj.userData.rotationSpeed.z;
        
        // Move the object
        obj.position.x += obj.userData.movementSpeed.x;
        obj.position.y += obj.userData.movementSpeed.y;
        obj.position.z += obj.userData.movementSpeed.z;
        
        // Boundary check and bounce
        ['x', 'y', 'z'].forEach(axis => {
          if (Math.abs(obj.position[axis]) > 5) {
            obj.userData.movementSpeed[axis] *= -1;
          }
        });
      });
      
      // Slowly rotate the entire group
      group.rotation.x += 0.0005;
      group.rotation.y += 0.0008;
      
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    
    animate();
    
    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      currentRef.removeChild(renderer.domElement);
      
      // Dispose of geometries and materials
      objects.forEach(obj => {
        obj.geometry.dispose();
        obj.material.dispose();
      });
      
      renderer.dispose();
    };
  }, []);
  
  return (
    <div 
      ref={mountRef} 
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        overflow: 'hidden',
        pointerEvents: 'none' // Allows clicking through to elements behind
      }}
    />
  );
};

export default FloatingObjects; 