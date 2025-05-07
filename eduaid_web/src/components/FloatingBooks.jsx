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
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); // Transparent background
    
    // Add renderer to the DOM
    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }
    
    // Book/paper materials - using education-themed colors
    const materials = [
      new THREE.MeshBasicMaterial({ 
        color: 0xFFFFFF, // White for paper
        transparent: true, 
        opacity: 0.35,
        side: THREE.DoubleSide 
      }),
      new THREE.MeshBasicMaterial({ 
        color: 0xFFF8E1, // Light yellow for old paper
        transparent: true, 
        opacity: 0.35,
        side: THREE.DoubleSide 
      }),
      new THREE.MeshBasicMaterial({ 
        color: 0xFFB300, // Amber for book cover (more vibrant)
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
    ];
    
    // Create books/papers/quiz items
    const books = [];
    const totalObjects = 25; // Increased for more engaging effect
    
    for (let i = 0; i < totalObjects; i++) {
      // Create either book, paper, or "quiz" icon
      let geometry, material, book;
      
      const objectType = Math.random();
      
      if (objectType > 0.7) {
        // Paper
        geometry = new THREE.PlaneGeometry(2.5 + Math.random(), 3 + Math.random(), 1, 1);
        material = materials[Math.floor(Math.random() * 2)]; // First two materials (white/yellowed paper)
        book = new THREE.Mesh(geometry, material);
      } else if (objectType > 0.3) {
        // Book (use extruded rectangle for more book-like appearance)
        const shape = new THREE.Shape();
        const width = 2 + Math.random();
        const height = 3 + Math.random();
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
        material = materials[2 + Math.floor(Math.random() * 4)]; // Colored materials
        book = new THREE.Mesh(geometry, material);
      } else {
        // Quiz icon (question mark using TorusGeometry)
        geometry = new THREE.TorusGeometry(1 + Math.random() * 0.5, 0.3, 16, 32);
        material = materials[Math.floor(Math.random() * materials.length)];
        book = new THREE.Mesh(geometry, material);
      }
      
      // Set random position in 3D space, more concentrated in center
      book.position.x = (Math.random() - 0.5) * 40;
      book.position.y = (Math.random() - 0.5) * 30;
      book.position.z = (Math.random() - 0.5) * 20;
      
      // Set random rotation
      book.rotation.x = Math.random() * Math.PI;
      book.rotation.y = Math.random() * Math.PI;
      book.rotation.z = Math.random() * Math.PI;
      
      // Set random movement parameters
      book.userData = {
        rotationSpeed: {
          x: (Math.random() - 0.5) * 0.005,
          y: (Math.random() - 0.5) * 0.005,
          z: (Math.random() - 0.5) * 0.005,
        },
        movementSpeed: {
          x: (Math.random() - 0.5) * 0.02,
          y: (Math.random() - 0.5) * 0.02,
          z: (Math.random() - 0.5) * 0.005,
        },
        movementRange: {
          x: { min: book.position.x - 5, max: book.position.x + 5 },
          y: { min: book.position.y - 5, max: book.position.y + 5 },
          z: { min: book.position.z - 2, max: book.position.z + 2 },
        },
      };
      
      scene.add(book);
      books.push(book);
    }
    
    // Add some ambient light to see the colored materials better
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    
    // Add directional light for subtle shadows
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Animation loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      
      // Update each book/paper position and rotation
      books.forEach(book => {
        // Rotation
        book.rotation.x += book.userData.rotationSpeed.x;
        book.rotation.y += book.userData.rotationSpeed.y;
        book.rotation.z += book.userData.rotationSpeed.z;
        
        // Movement - gentle floating motion
        book.position.x += book.userData.movementSpeed.x;
        book.position.y += book.userData.movementSpeed.y;
        book.position.z += book.userData.movementSpeed.z;
        
        // Reverse direction when reaching bounds
        if (book.position.x <= book.userData.movementRange.x.min || 
            book.position.x >= book.userData.movementRange.x.max) {
          book.userData.movementSpeed.x *= -1;
        }
        if (book.position.y <= book.userData.movementRange.y.min || 
            book.position.y >= book.userData.movementRange.y.max) {
          book.userData.movementSpeed.y *= -1;
        }
        if (book.position.z <= book.userData.movementRange.z.min || 
            book.position.z >= book.userData.movementRange.z.max) {
          book.userData.movementSpeed.z *= -1;
        }
      });
      
      renderer.render(scene, camera);
    };
    
    animate();
    
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
      books.forEach(book => {
        if (book.geometry) book.geometry.dispose();
        
        if (book.material) {
          if (Array.isArray(book.material)) {
            book.material.forEach(mat => {
              if (mat && typeof mat.dispose === 'function') {
                mat.dispose();
              }
            });
          } else if (typeof book.material.dispose === 'function') {
            book.material.dispose();
          }
        }
        
        // Remove from scene
        scene.remove(book);
      });
      
      // Clear references
      books.length = 0;
      
      // Dispose renderer
      if (renderer) {
        renderer.dispose();
      }
      
      // We don't call scene.dispose() as it doesn't exist in Three.js
      // Instead, we've removed all objects from the scene and disposed of their resources
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