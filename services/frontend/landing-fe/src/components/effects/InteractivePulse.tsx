import React, { useRef, useEffect, useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import * as THREE from 'three';
import ChapterIcon from '../ui/ChapterIcon';
import { isLowEndDevice, prefersReducedMotion } from '@/utils/deviceDetection';

const InteractivePulse: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    if (isLowEndDevice() || prefersReducedMotion()) {
      setShowFallback(true);
      return;
    }

    const mount = mountRef.current;
    if (!mount) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, mount.clientWidth / mount.clientHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mount.appendChild(renderer.domElement);

    // Central Icon
    const iconSvgString = ReactDOMServer.renderToString(<ChapterIcon acronym="CS" size={256} />);
    const iconUrl = `data:image/svg+xml;base64,${btoa(iconSvgString)}`;
    const textureLoader = new THREE.TextureLoader();
    const iconTexture = textureLoader.load(iconUrl);
    const iconMaterial = new THREE.MeshBasicMaterial({ map: iconTexture, transparent: true });
    const iconGeometry = new THREE.PlaneGeometry(2, 2);
    const iconPlane = new THREE.Mesh(iconGeometry, iconMaterial);
    scene.add(iconPlane);

    // Lighting
    const pointLight = new THREE.PointLight(0x4d7fff, 2, 10);
    pointLight.position.set(0, 0, 2);
    scene.add(pointLight);
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    // Rings
    const rings: THREE.Mesh[] = [];

    const createRing = () => {
      const geometry = new THREE.TorusGeometry(1.5, 0.05, 16, 100);
      const material = new THREE.MeshBasicMaterial({ color: 0x00b4ff, transparent: true, opacity: 0.8 });
      const ring = new THREE.Mesh(geometry, material);
      ring.scale.set(0.1, 0.1, 0.1);
      scene.add(ring);
      rings.push(ring);
    };

    // Mouse tracking
    const mouse = new THREE.Vector2();
    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    const clock = new THREE.Clock();
    let ringCreationCounter = 0;

    const animate = () => {
      requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Update rings
      ringCreationCounter += 1;
      if (ringCreationCounter > 150) { // Create ring every ~2.5s
        createRing();
        ringCreationCounter = 0;
      }

      rings.forEach((ring, index) => {
        ring.scale.x += 0.01;
        ring.scale.y += 0.01;
        (ring.material as THREE.MeshBasicMaterial).opacity -= 0.01;

        if ((ring.material as THREE.MeshBasicMaterial).opacity <= 0) {
          scene.remove(ring);
          rings.splice(index, 1);
        }
      });

      // Update camera
      camera.position.x += (mouse.x * 2 - camera.position.x) * 0.05;
      camera.position.y += (mouse.y * 2 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);
      
      // Float icon
      iconPlane.position.z = Math.sin(elapsedTime * 0.5) * 0.2;

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      mount.removeChild(renderer.domElement);
    };
  }, []);

  // Fallback UI for low-end devices or reduced motion
  if (showFallback) {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(circle at center, rgba(77, 127, 255, 0.1) 0%, transparent 70%)',
          position: 'relative'
        }}
        aria-hidden="true"
      >
        <div style={{
          width: '200px',
          height: '200px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}>
          <ChapterIcon acronym="CS" size={180} />

          {/* Decorative rings */}
          <div style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            border: '2px solid rgba(0, 180, 255, 0.3)',
            borderRadius: '50%',
            transform: 'scale(1.2)'
          }} />
          <div style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            border: '2px solid rgba(77, 127, 255, 0.2)',
            borderRadius: '50%',
            transform: 'scale(1.5)'
          }} />
          <div style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            border: '1px solid rgba(77, 127, 255, 0.1)',
            borderRadius: '50%',
            transform: 'scale(1.8)'
          }} />
        </div>
      </div>
    );
  }

  return <div ref={mountRef} style={{ width: '100%', height: '100%' }} aria-hidden="true" />;
};

export default InteractivePulse;