import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';

interface CinematicIntroProps {
  onComplete: () => void;
}

export default function CinematicIntro({ onComplete }: CinematicIntroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    document.body.style.overflow = 'hidden';

    // 1. THREE.JS SCENE & CAMERA SETUP
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050505, 0.0012);

    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    );
    camera.position.set(0, 0, 750);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 2. CINEMATIC ATMOSPHERIC LIGHTING (Matching User Reference Image)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const purpleLight = new THREE.PointLight(0x8B5CF6, 5, 1400);
    purpleLight.position.set(-200, 150, 300);
    scene.add(purpleLight);

    const cyanLight = new THREE.PointLight(0x06B6D4, 5, 1400);
    cyanLight.position.set(200, -150, 300);
    scene.add(cyanLight);

    const pinkLight = new THREE.PointLight(0xEC4899, 4, 1200);
    pinkLight.position.set(0, -200, 400);
    scene.add(pinkLight);

    const flowerSpot = new THREE.SpotLight(0xFDBA74, 5.5, 1500, Math.PI / 4, 0.5);
    flowerSpot.position.set(0, 350, 500);
    scene.add(flowerSpot);

    // 3. PHOTOREALISTIC GLOWING BUTTERFLY ASSET RENDERER
    const butterflyGroup = new THREE.Group();

    // High-Definition Photorealistic Wing Texture Canvas
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      // Base Iridescent Glow: Core Pink -> Deep Purple -> Cyan -> Neon Edge
      const radial = ctx.createRadialGradient(512, 512, 40, 512, 512, 500);
      radial.addColorStop(0, 'rgba(236, 72, 153, 0.98)');   // Glowing Pink
      radial.addColorStop(0.3, 'rgba(139, 92, 246, 0.92)'); // Deep Purple
      radial.addColorStop(0.65, 'rgba(6, 182, 212, 0.88)'); // Cyan Blue
      radial.addColorStop(0.9, 'rgba(253, 186, 116, 0.95)');  // Warm peach edge
      radial.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = radial;
      ctx.fillRect(0, 0, 1024, 1024);

      // Fine Vein Network
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
      ctx.lineWidth = 3;
      for (let i = 0; i < 28; i++) {
        ctx.beginPath();
        ctx.moveTo(512, 512);
        ctx.quadraticCurveTo(
          512 + Math.cos(i * 0.22) * 320,
          512 + Math.sin(i * 0.22) * 320,
          512 + Math.cos(i * 0.22) * 480,
          512 + Math.sin(i * 0.22) * 480
        );
        ctx.stroke();
      }
    }

    const wingTexture = new THREE.CanvasTexture(canvas);

    // Natural Curved Wing Geometries
    const wingGeo = new THREE.PlaneGeometry(160, 220, 32, 32);

    const wingMaterial = new THREE.MeshPhysicalMaterial({
      map: wingTexture,
      emissive: 0x8B5CF6,
      emissiveIntensity: 0.5,
      transmission: 0.85,
      roughness: 0.1,
      metalness: 0.2,
      transparent: true,
      opacity: 0.95,
      side: THREE.DoubleSide
    });

    const leftWing = new THREE.Mesh(wingGeo, wingMaterial);
    leftWing.position.set(-75, 0, 0);

    const rightWing = new THREE.Mesh(wingGeo, wingMaterial);
    rightWing.position.set(75, 0, 0);
    rightWing.rotation.y = Math.PI;

    const leftWingPivot = new THREE.Group();
    leftWingPivot.add(leftWing);

    const rightWingPivot = new THREE.Group();
    rightWingPivot.add(rightWing);

    // Anatomical Body, Antennae & Legs
    const bodyGroup = new THREE.Group();
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.3 });

    const thorax = new THREE.Mesh(new THREE.CylinderGeometry(5, 7, 50, 16), bodyMat);
    thorax.rotation.x = Math.PI / 2;

    const head = new THREE.Mesh(new THREE.SphereGeometry(7, 16, 16), bodyMat);
    head.position.set(0, 30, 0);

    const antennaMat = new THREE.MeshBasicMaterial({ color: 0xFDBA74 });
    const leftAntenna = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.4, 45, 8), antennaMat);
    leftAntenna.position.set(-5, 45, 8);
    leftAntenna.rotation.z = -0.3;

    const rightAntenna = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.4, 45, 8), antennaMat);
    rightAntenna.position.set(5, 45, 8);
    rightAntenna.rotation.z = 0.3;

    bodyGroup.add(thorax, head, leftAntenna, rightAntenna);

    butterflyGroup.add(leftWingPivot, rightWingPivot, bodyGroup);
    butterflyGroup.scale.set(1.1, 1.1, 1.1);
    scene.add(butterflyGroup);

    // 4. FLOATING DUST & POLLEN PARTICLES
    const particleCount = 1500;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const colorPeach = new THREE.Color(0xFDBA74);
    const colorPink = new THREE.Color(0xF472B6);
    const colorLavender = new THREE.Color(0xC084FC);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 900;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 900;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 900;

      const palette = [colorPeach, colorPink, colorLavender];
      const col = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 2.8,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 5. ANIMATION LOOP
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Wing Flap Motion
      const flapAngle = Math.sin(elapsed * 12) * 0.7;
      leftWingPivot.rotation.y = flapAngle;
      rightWingPivot.rotation.y = -flapAngle;

      // Antennae Motion
      leftAntenna.rotation.z = -0.3 + Math.sin(elapsed * 5) * 0.06;
      rightAntenna.rotation.z = 0.3 - Math.sin(elapsed * 5) * 0.06;

      // Particle Drift
      particles.rotation.y = elapsed * 0.03;

      renderer.render(scene, camera);
    };

    animate();

    // 6. GSAP CINEMATIC FLIGHT TRAJECTORY (7 SCENES TO HERO FLOWER LANDING)
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 1.2,
          ease: 'power3.inOut',
          onComplete: () => {
            cancelAnimationFrame(animId);
            renderer.dispose();
            document.body.style.overflow = '';
            onComplete();
          }
        });
      }
    });

    // SCENE 1 & 2: FLY INTO SCENE FROM OFF-SCREEN
    tl.fromTo(butterflyGroup.position,
      { x: -550, y: 350, z: 700 },
      { x: -120, y: 140, z: 250, duration: 2.5, ease: 'power2.out' }
    )
    // SCENE 3 & 4: CURVED FLIGHT & CAMERA FOLLOW
    .to(butterflyGroup.position, {
      x: 160,
      y: 60,
      z: 120,
      duration: 2.2,
      ease: 'sine.inOut'
    }, '-=0.4')
    .to(camera.position, {
      x: 60,
      y: 20,
      z: 480,
      duration: 2.2,
      ease: 'sine.inOut'
    }, '-=2.2')
    // SCENE 5 & 6: CIRCLE & GENTLE LANDING ON HERO FLOWER PETAL
    .to(butterflyGroup.position, {
      x: 0,
      y: -130,
      z: 40,
      duration: 2.5,
      ease: 'power3.out'
    }, '-=0.3')
    .to(butterflyGroup.rotation, {
      x: 0.25,
      y: -0.15,
      z: 0.08,
      duration: 2.0,
      ease: 'power2.out'
    }, '-=2.0');

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      document.body.style.overflow = '';
    };
  }, [onComplete]);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[1000] bg-[#050505] overflow-hidden select-none pointer-events-none"
    >
      <canvas ref={canvasRef} className="w-full h-full block" />

      {/* Atmospheric Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_50%,_rgba(5,5,5,0.95)_100%)] pointer-events-none" />

      {/* Top Brand Badge */}
      <div className="absolute top-10 inset-x-0 flex justify-center pointer-events-none">
        <div className="inline-flex items-center gap-2.5 border border-white/10 px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-[#FDBA74] animate-pulse" />
          <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#A7A7A7] font-outfit font-medium">
            PORTFOLIO OS • CINEMATIC EXPERIENCE
          </span>
        </div>
      </div>
    </div>
  );
}
