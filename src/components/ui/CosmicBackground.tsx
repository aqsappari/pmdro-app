// CosmicBackground.tsx
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

    // Shift center to the right
    let centerX = width * 0.65;
    let centerY = height * 0.5;

    // 3D Perspective settings
    const focalLength = 400;

    // Tilting rules: Leaning towards the right, facing the BOTTOM-RIGHT of the screen
    const tiltX = 0.5;
    const tiltY = -0.5;

    const normalizeAccentRGB = (rawAccent: string): string | null => {
      if (!rawAccent) return null;
      const accent = rawAccent.trim();
      if (!accent) return null;

      if (accent.startsWith("#")) {
        let hex = accent.substring(1);
        if (hex.length === 3) {
          hex = hex
            .split("")
            .map((char) => char + char)
            .join("");
        }
        if (hex.length !== 6) return null;

        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        return !isNaN(r) && !isNaN(g) && !isNaN(b) ? `${r}, ${g}, ${b}` : null;
      }

      if (accent.startsWith("rgb")) {
        const matches = accent.match(/\d+/g);
        if (matches && matches.length >= 3) {
          return `${matches[0]}, ${matches[1]}, ${matches[2]}`;
        }
      }

      const numeric = accent.replace(/,/g, " ").trim();
      if (/^[\d\s]+$/.test(numeric)) {
        return numeric.split(/\s+/).join(", ");
      }

      return null;
    };

    const getComputedAccentRGB = (): string => {
      const rawAccent = window
        .getComputedStyle(document.documentElement)
        .getPropertyValue("--accent");
      return normalizeAccentRGB(rawAccent) ?? "157, 133, 187";
    };

    const collectThemeAccentRGBs = (): string[] => {
      const accents = new Set<string>();
      for (const sheet of Array.from(document.styleSheets)) {
        let rules: CSSRuleList | null;
        try {
          rules = sheet.cssRules;
        } catch {
          continue;
        }
        if (!rules) continue;

        for (const rule of Array.from(rules)) {
          if (rule.type !== CSSRule.STYLE_RULE) continue;
          const styleRule = rule as CSSStyleRule;
          if (!styleRule.selectorText.includes(".theme-")) continue;

          const accentValue = styleRule.style.getPropertyValue("--accent");
          const rgb = normalizeAccentRGB(accentValue);
          if (rgb) accents.add(rgb);
        }
      }
      return Array.from(accents);
    };

    type ThemePaletteItem = { rgb: string; threshold: number };

    const buildThemePalette = (): ThemePaletteItem[] => {
      const currentAccentRGB = getComputedAccentRGB();
      const allAccents = collectThemeAccentRGBs();
      const otherAccents = allAccents.filter((rgb) => rgb !== currentAccentRGB);

      const otherCount = otherAccents.length;
      const currentWeight = Math.max(100 - otherCount * 5, 20);
      const totalOtherWeight = 100 - currentWeight;
      const eachOtherWeight =
        otherCount > 0 ? totalOtherWeight / otherCount : 0;

      const palette: ThemePaletteItem[] = [];
      let threshold = 0;

      palette.push({
        rgb: currentAccentRGB,
        threshold: (threshold += currentWeight / 100),
      });

      for (const rgb of otherAccents) {
        palette.push({
          rgb,
          threshold: (threshold += eachOtherWeight / 100),
        });
      }

      if (palette.length > 0) palette[palette.length - 1].threshold = 1;
      return palette;
    };

    const chooseParticleAccent = (
      seed: number,
      palette: ThemePaletteItem[],
    ): string => {
      if (!palette || palette.length === 0) return "157, 133, 187";
      for (const item of palette) {
        if (seed < item.threshold) return item.rgb;
      }
      return palette[palette.length - 1]?.rgb ?? "157, 133, 187";
    };

    // --- INITIALIZE 3D STARS ---
    const particleCount = 350;
    const particles: Array<{
      initialRadius: number;
      initialAngle: number;
      yOffset: number;
      size: number;
      baseOpacity: number;
      colorSeed: number;
      distanceOffset: number;
    }> = [];

    for (let i = 0; i < particleCount; i++) {
      const initialRadius =
        Math.pow(Math.random(), 1.2) * Math.min(width, height) * 0.6 + 10;
      const arm = i % 2 === 0 ? 0 : Math.PI;
      const spiralTightness = 1.8;
      const initialAngle =
        initialRadius * (spiralTightness / 100) +
        arm +
        (Math.random() - 0.5) * 0.35;

      particles.push({
        initialRadius,
        initialAngle,
        yOffset: (Math.random() - 0.5) * 40,
        size: Math.random() * 1.0 + 0.3,
        baseOpacity: Math.random() * 0.4 + 0.2,
        colorSeed: Math.random(),
        distanceOffset: 0,
      });
    }

    // --- INITIALIZE 3D BACKGROUND CLOUDS ---
    type CloudLayer3D = {
      x: number;
      y: number;
      z: number;
      radius: number;
      opacity: number;
      driftSpeed: number;
      driftSeed: number;
    };

    const cloudCount = 18;
    const clouds: CloudLayer3D[] = [];
    const stableRandom = (seed: number) =>
      Math.abs(Math.sin(seed * 12.9898 + 78.233) * 43758.5453) % 1;

    for (let i = 0; i < cloudCount; i++) {
      const seed = i + 1;
      clouds.push({
        x: (stableRandom(seed * 0.1) - 0.5) * 350,
        y: (stableRandom(seed * 0.2) - 0.5) * 200,
        z: stableRandom(seed * 0.3) * -150 - 100,
        radius: stableRandom(seed * 0.4) * 120 + 90,
        opacity: stableRandom(seed * 0.5) * 0.02 + 0.015,
        driftSpeed: stableRandom(seed * 0.6) * 0.02 + 0.005,
        driftSeed: stableRandom(seed * 0.7) * Math.PI * 2,
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
      centerX = width * 0.65;
      centerY = height * 0.5;
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("resize", handleResize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const themePalette = buildThemePalette();
      const currentAccentRGB = getComputedAccentRGB();
      const mouse = mouseRef.current;

      const time = Date.now() * 0.0001;
      const globalSpin = time * 0.15;

      const cosX = Math.cos(tiltX);
      const sinX = Math.sin(tiltX);
      const cosY = Math.cos(tiltY);
      const sinY = Math.sin(tiltY);

      // --- 1. RENDER BACKGROUND NEBULA CLOUDS ---
      for (const cloud of clouds) {
        const dynamicDrift =
          Math.sin(time * 0.2 + cloud.driftSpeed + cloud.driftSeed) * 15;

        const cx = cloud.x + dynamicDrift;
        const cy = cloud.y;
        const cz = cloud.z;

        const x1 = cx * cosY - cz * sinY;
        const z1 = cx * sinY + cz * cosY;
        const y2 = cy * cosX - z1 * sinX;
        const z2 = cy * sinX + z1 * cosX;

        const cloudDepth = focalLength / (focalLength + z2 + 250);
        const screenX = centerX + x1 * cloudDepth;
        const screenY = centerY + y2 * cloudDepth;
        const screenRadius = cloud.radius * cloudDepth;

        if (screenRadius <= 0) continue;

        ctx.save();
        const gradient = ctx.createRadialGradient(
          screenX,
          screenY,
          0,
          screenX,
          screenY,
          screenRadius,
        );
        gradient.addColorStop(0, `rgba(${currentAccentRGB}, ${cloud.opacity})`);
        gradient.addColorStop(
          0.5,
          `rgba(${currentAccentRGB}, ${cloud.opacity * 0.3})`,
        );
        gradient.addColorStop(1, "rgba(0,0,0,0)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(screenX, screenY, screenRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // --- 2. RENDER 3D STARS ---
      for (let i = 0; i < particleCount; i++) {
        const p = particles[i];
        const localAngle = p.initialAngle + globalSpin;

        const lx = Math.cos(localAngle) * (p.initialRadius + p.distanceOffset);
        const ly = p.yOffset;
        const lz = Math.sin(localAngle) * (p.initialRadius + p.distanceOffset);

        const x1 = lx * cosY - lz * sinY;
        const z1 = lx * sinY + lz * cosY;
        const y2 = ly * cosX - z1 * sinX; // Fixed typo line here
        const z2 = ly * sinX + z1 * cosX;

        const perspectiveFactor = focalLength / (focalLength + z2);
        const projectedX = centerX + x1 * perspectiveFactor;
        const projectedY = centerY + y2 * perspectiveFactor;

        const dx = projectedX - mouse.x;
        const dy = projectedY - mouse.y;
        const mouseDistance = Math.sqrt(dx * dx + dy * dy);
        const repulsionRadius = 140;

        if (mouseDistance < repulsionRadius) {
          const forceFactor =
            (repulsionRadius - mouseDistance) / repulsionRadius;
          const targetPush = Math.pow(forceFactor, 1.2) * 25;
          p.distanceOffset += (targetPush - p.distanceOffset) * 0.1;
        } else {
          p.distanceOffset += (0 - p.distanceOffset) * 0.04;
        }

        if (
          projectedX < 0 ||
          projectedX > width ||
          projectedY < 0 ||
          projectedY > height
        )
          continue;

        const sizeScale = Math.max(0.1, perspectiveFactor);
        const finalSize = p.size * sizeScale;

        const maxRadius = Math.min(width, height) * 0.7;
        const distanceFade = Math.max(
          0,
          1 - Math.pow(p.initialRadius / maxRadius, 2),
        );
        const finalOpacity = Math.max(
          0,
          p.baseOpacity * distanceFade * (perspectiveFactor * 0.75 + 0.25),
        );

        const particleAccentRGB = chooseParticleAccent(
          p.colorSeed,
          themePalette,
        );

        ctx.beginPath();
        ctx.arc(projectedX, projectedY, finalSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${particleAccentRGB}, ${finalOpacity.toFixed(3)})`;
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
      className="fixed inset-0 pointer-events-none z-0 opacity-75 transition-opacity duration-1000"
      style={{ mixBlendMode: "plus-lighter" }}
    />
  );
}
