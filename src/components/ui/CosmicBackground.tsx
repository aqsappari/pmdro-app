import { useEffect, useRef } from "react";

export function CosmicBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let centerX = width / 2;
    let centerY = height / 2;

    // Advanced helper to extract/convert hex or space-separated channels dynamically
    const getAccentRGB = (): string => {
      const rawAccent = window
        .getComputedStyle(document.documentElement)
        .getPropertyValue("--accent")
        .trim();

      if (!rawAccent) return "157 133 187"; // Ultimate fallback

      // Case 1: If the CSS variable is a HEX code (e.g., #9d85bb or #fff)
      if (rawAccent.startsWith("#")) {
        // Strip the '#' prefix
        let hex = rawAccent.substring(1);

        // Handle shorthand hex codes (like #fff -> #ffffff)
        if (hex.length === 3) {
          hex = hex
            .split("")
            .map((char) => char + char)
            .join("");
        }

        // Parse individual R, G, B hex pairs into base-10 integers
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);

        // Return structured as space-separated values if parsing succeeded
        return !isNaN(r) && !isNaN(g) && !isNaN(b)
          ? `${r} ${g} ${b}`
          : "157 133 187";
      }

      // Case 2: If it's already space-separated or comma-separated channels (Tailwind style)
      if (/^[\d\s,]+$/.test(rawAccent)) {
        return rawAccent.replace(/,/g, " ");
      }

      return "157 133 187";
    };

    const particleCount = 350;
    const particles: Array<{
      baseDistance: number;
      distanceOffset: number;
      angle: number;
      speed: number;
      size: number;
      baseOpacity: number;
    }> = [];

    for (let i = 0; i < particleCount; i++) {
      const arm = i % 2 === 0 ? 0 : Math.PI;
      const baseDistance =
        Math.pow(Math.random(), 1.6) * Math.min(width, height) * 0.45 + 15;
      const spiralTightness = 2.8;
      const angle =
        baseDistance * (spiralTightness / 100) +
        arm +
        (Math.random() - 0.5) * 0.25;

      particles.push({
        baseDistance,
        distanceOffset: 0,
        angle,
        speed:
          (0.002 + Math.random() * 0.004) *
          (1 - baseDistance / (Math.min(width, height) * 0.6)),
        size: Math.random() * 1.0 + 0.2,
        baseOpacity: Math.random() * 0.35 + 0.25,
      });
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      centerX = width / 2;
      centerY = height / 2;
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("resize", handleResize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const currentAccentRGB = getAccentRGB();

      const mouse = mouseRef.current;
      const repulsionRadius = 130;
      const maxRepulsionForce = 45;

      for (let i = 0; i < particleCount; i++) {
        const p = particles[i];

        p.angle += p.speed;

        const targetDistance = p.baseDistance + p.distanceOffset;
        const defaultX = centerX + Math.cos(p.angle) * targetDistance;
        const defaultY = centerY + Math.sin(p.angle) * targetDistance;

        const dx = defaultX - mouse.x;
        const dy = defaultY - mouse.y;
        const mouseDistance = Math.sqrt(dx * dx + dy * dy);

        if (mouseDistance < repulsionRadius) {
          const forceFactor =
            (repulsionRadius - mouseDistance) / repulsionRadius;
          const targetPush = forceFactor * maxRepulsionForce;
          p.distanceOffset += (targetPush - p.distanceOffset) * 0.1;
        } else {
          p.distanceOffset += (0 - p.distanceOffset) * 0.04;
        }

        const finalDistance = p.baseDistance + p.distanceOffset;
        const x = centerX + Math.cos(p.angle) * finalDistance;
        const y = centerY + Math.sin(p.angle) * finalDistance;

        if (x < 0 || x > width || y < 0 || y > height) continue;

        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);

        const distanceFade =
          1 - p.baseDistance / (Math.min(width, height) * 0.55);
        const finalOpacity = Math.max(0, p.baseOpacity * distanceFade);

        ctx.fillStyle = `rgb(${currentAccentRGB} / ${finalOpacity.toFixed(3)})`;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-90 transition-opacity duration-1000"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
