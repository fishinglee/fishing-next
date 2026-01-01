"use client";

import { useRef, useState } from "react";
import { Background } from "@/components/Background";
import { FloatSystem, FloatSystemHandle } from "@/components/game/FloatSystem";
import { GameHUD } from "@/components/game/GameHUD";
import { BITE_PATTERNS } from "@/lib/constants";

export default function Home() {
  const floatSystemRef = useRef<FloatSystemHandle>(null);
  const [debugBiteIndex, setDebugBiteIndex] = useState<number | null>(null);

  const handleHookClick = () => {
    let patternIndex = 0;
    if (debugBiteIndex !== null && debugBiteIndex >= 1 && debugBiteIndex <= 10) {
      patternIndex = debugBiteIndex - 1;
    } else {
      patternIndex = Math.floor(Math.random() * BITE_PATTERNS.length);
    }

    console.log(`Playing pattern: ${BITE_PATTERNS[patternIndex]?.name}`);
    floatSystemRef.current?.playBite(patternIndex);
  };

  return (
    <main className="relative flex h-full w-full flex-col max-w-md mx-auto bg-slate-900 shadow-2xl overflow-hidden min-h-[max(884px,100dvh)]">
      <Background />

      {/* Game Container */}
      <div className="relative z-10 flex-1 flex flex-col h-full w-full">
        <div className="absolute inset-0 z-0">
          {/* Float System layer */}
        </div>

        <GameHUD
          onHookClick={handleHookClick}
          onDebugInput={(val) => setDebugBiteIndex(val)}
        />

        <div className="absolute inset-x-0 top-[105px] bottom-[275px] pointer-events-none flex flex-col justify-center">
          <FloatSystem ref={floatSystemRef} />
        </div>
      </div>
    </main>
  );
}
