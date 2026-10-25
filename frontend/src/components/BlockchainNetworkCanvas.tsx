import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  glow: boolean;
  pulsePhase: number;
}

export const BlockchainNetworkCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // More particles for denser network feel
    const particleCount = Math.min(120, Math.max(50, Math.floor((width * height) / 14000)));

    const colors = ['#38bdf8', '#3b82f6', '#06b6d4', '#6366f1', '#10b981', '#818cf8', '#22d3ee'];

    const particles: Particle[] = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: Math.random() * 2.5 + 1.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      glow: Math.random() > 0.4,
      pulsePhase: Math.random() * Math.PI * 2,
    }));

    let mouse = { x: -1000, y: -1000 };
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Pulse packets traveling between nodes
    const packets: Array<{ fromIdx: number; toIdx: number; progress: number; speed: number; color: string }> = [];

    const packetInterval = setInterval(() => {
      if (particles.length < 2) return;
      const fromIdx = Math.floor(Math.random() * particles.length);
      let toIdx = Math.floor(Math.random() * particles.length);
      while (fromIdx === toIdx) toIdx = Math.floor(Math.random() * particles.length);

      const dx = particles[fromIdx].x - particles[toIdx].x;
      const dy = particles[fromIdx].y - particles[toIdx].y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 250) {
        packets.push({
          fromIdx,
          toIdx,
          progress: 0,
          speed: 0.01 + Math.random() * 0.02,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
      if (packets.length > 40) packets.shift();
    }, 200);

    let frame = 0;

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      // Rich atmospheric background with multiple gradient layers
      const bgGrad = ctx.createRadialGradient(width * 0.5, height * 0.35, 20, width * 0.5, height * 0.5, width * 0.65);
      bgGrad.addColorStop(0, 'rgba(56, 189, 248, 0.12)');
      bgGrad.addColorStop(0.3, 'rgba(99, 102, 241, 0.06)');
      bgGrad.addColorStop(0.6, 'rgba(2, 6, 23, 0.5)');
      bgGrad.addColorStop(1, 'rgba(4, 6, 10, 0.9)');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Secondary ambient glow (top-left)
      const glow2 = ctx.createRadialGradient(width * 0.2, height * 0.2, 10, width * 0.2, height * 0.2, width * 0.35);
      glow2.addColorStop(0, 'rgba(99, 102, 241, 0.08)');
      glow2.addColorStop(1, 'transparent');
      ctx.fillStyle = glow2;
      ctx.fillRect(0, 0, width, height);

      // Third glow (bottom-right)
      const glow3 = ctx.createRadialGradient(width * 0.8, height * 0.8, 10, width * 0.8, height * 0.8, width * 0.3);
      glow3.addColorStop(0, 'rgba(16, 185, 129, 0.06)');
      glow3.addColorStop(1, 'transparent');
      ctx.fillStyle = glow3;
      ctx.fillRect(0, 0, width, height);

      // Subtle grid overlay
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
      ctx.lineWidth = 0.5;
      const gridSize = 60;
      for (let gx = 0; gx < width; gx += gridSize) {
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, height);
        ctx.stroke();
      }
      for (let gy = 0; gy < height; gy += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(width, gy);
        ctx.stroke();
      }

      // Connect nearby particles with lines
      const maxDist = 200;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.3;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        // Mouse interaction lines
        const mdx = particles[i].x - mouse.x;
        const mdy = particles[i].y - mouse.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < 200) {
          const malpha = (1 - mdist / 200) * 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(56, 189, 248, ${malpha})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      }

      // Draw packet pulses
      for (let k = packets.length - 1; k >= 0; k--) {
        const p = packets[k];
        const fromP = particles[p.fromIdx];
        const toP = particles[p.toIdx];
        if (!fromP || !toP) { packets.splice(k, 1); continue; }

        p.progress += p.speed;
        if (p.progress >= 1) { packets.splice(k, 1); continue; }

        const px = fromP.x + (toP.x - fromP.x) * p.progress;
        const py = fromP.y + (toP.y - fromP.y) * p.progress;

        // Glowing trail
        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 15;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Trailing ghost
        const tx = fromP.x + (toP.x - fromP.x) * Math.max(0, p.progress - 0.08);
        const ty = fromP.y + (toP.y - fromP.y) * Math.max(0, p.progress - 0.08);
        ctx.beginPath();
        ctx.arc(tx, ty, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = p.color.replace(')', ', 0.3)').replace('rgb', 'rgba');
        ctx.fill();
      }

      // Draw particle nodes with pulsing
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 5 || p.x > width - 5) p.vx *= -1;
        if (p.y < 5 || p.y > height - 5) p.vy *= -1;

        const pulse = Math.sin(frame * 0.03 + p.pulsePhase) * 0.4 + 1;
        const currentRadius = p.radius * pulse;

        // Outer halo ring
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentRadius + 5, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Main dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;

        if (p.glow) {
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 12;
          ctx.fill();
          ctx.shadowBlur = 0;
        } else {
          ctx.fill();
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearInterval(packetInterval);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-auto">
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};
