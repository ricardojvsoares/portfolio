"use client";

import { useTheme } from "next-themes";

import GhostFibers from "@/components/ui/ghost-fibers";

export function GhostBackground() {
  const { resolvedTheme } = useTheme();

  if (!resolvedTheme) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
      <GhostFibers
        lineColor="#1a9f6a"
        glowColor="#121a22"
        speed={0.2}
        scale={2}
        rotation={0}
        rotationSpeed={0.25}
        layers={3}
        waveAmplitude={0.3}
        waveFrequency={6}
        waveSpeed={0}
        layerSpeed={0}
        twist={0}
        twistFrequency={0.5}
        twistSpeed={0}
        lineFrequency={5}
        lineSpacing={2}
        lineSharpness={16}
        glowFalloff={10}
        glowIntensity={1.6}
        brightness={2}
        vignette={0.8}
        grain={0.05}
        dpr={1}
        fps={60}
        paused={false}
        lightMode={resolvedTheme === "light"}
      />
    </div>
  );
}
