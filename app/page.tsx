"use client";

import { useRef, useState, useEffect } from "react";
import { Background } from "@/components/Background";
import { FloatSystem, FloatSystemHandle } from "@/components/game/FloatSystem";
import { GameHUD } from "@/components/game/GameHUD";
import { BITE_PATTERNS, GameStatus } from "@/lib/constants";

export default function Home() {
  const floatSystemRef = useRef<FloatSystemHandle>(null);
  const [debugBiteIndex, setDebugBiteIndex] = useState<number | null>(null);

  // Game Loop State
  const [gameStatus, setGameStatus] = useState<GameStatus>('READY');
  const [gameMessage, setGameMessage] = useState<string>("Ready to Cast");

  // Bite Logic State
  const [biteStartTime, setBiteStartTime] = useState<number | null>(null);
  const [activePattern, setActivePattern] = useState<typeof BITE_PATTERNS[number] | null>(null);
  const [autoMissTimer, setAutoMissTimer] = useState<NodeJS.Timeout | null>(null);

  // Game Loop Effect
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (gameStatus === 'FISHING') {
      const waitTime = Math.random() * 3000 + 3000; // 3 ~ 6 sec

      // If we are resetting from a timeout, we might want to keep the "Fish left" message for a sec?
      // But simpler is to just show "Waiting..." appended or just "Waiting..."
      // The user wants efficient loop.
      setGameMessage(`Waiting... (${Math.round(waitTime / 1000)}s)`);

      timeoutId = setTimeout(() => {
        triggerBite();
      }, waitTime);

    } else if (gameStatus === 'HIT' || gameStatus === 'MISS') {
      // Result display duration handled in handleHookClick or auto-miss
      // Actually, let's handle the "Return to Ready" here for consistency
      timeoutId = setTimeout(() => {
        setGameStatus('READY');
        setGameMessage("Ready to Cast");
        floatSystemRef.current?.reset();
      }, 3000);
    }

    return () => clearTimeout(timeoutId);
  }, [gameStatus]);

  const triggerBite = () => {
    let patternIndex = 0;
    if (debugBiteIndex !== null && debugBiteIndex >= 1 && debugBiteIndex <= 10) {
      patternIndex = debugBiteIndex - 1;
    } else {
      patternIndex = Math.floor(Math.random() * BITE_PATTERNS.length);
    }

    const pattern = BITE_PATTERNS[patternIndex];
    if (!pattern) return;

    console.log(`[AutoLoop] Playing pattern: ${pattern.name}`);

    setGameStatus('BITE');
    setBiteStartTime(Date.now());
    setActivePattern(pattern);
    setGameMessage("입질이 온다...!");

    floatSystemRef.current?.playBite(patternIndex);

    // Auto-Miss Logic
    const totalDuration = pattern.steps.reduce((acc, step) => acc + step.duration, 0);
    // Wait slightly longer than animation to allow for late reactions or just to let it settle
    const settleTime = 500;

    if (autoMissTimer) clearTimeout(autoMissTimer);

    const timer = setTimeout(() => {
      setGameStatus(current => {
        if (current === 'BITE') {
          console.log("[AutoLoop] Time out - Continue Fishing");
          setGameMessage("물고기가 떠났습니다...");

          // Clear bite state so user can't hook late
          setBiteStartTime(null);
          setActivePattern(null);

          // Transition back to FISHING after a short delay to show the message
          // We can't use setTimeout inside this synchronous updater easily without risk.
          // Better to set a specific transient status or just assume FISHING handles it.
          // Let's rely on the fact that changing to FISHING triggers the effect which has a "Wait" lead time.

          // To ensure the user sees "Fish left..." before "Waiting...", 
          // we might want to handle message updates in the effect more carefully.
          // But for now, returning FISHING immediately is the most robust way to keep loop alive.
          // The message might get overwritten quickly by the FISHING effect.

          // Optimization: Set a flag or check previous message? 
          // Let's modify the FISHING effect to respect existing message for a moment?
          // Or simpler: Just set status FISHING. The 3-6s wait time starts. 
          // The message "Waiting..." appears immediately.
          // Maybe we want "Missed... Waiting..." combined?

          return 'FISHING';
        }
        return current;
      });
    }, totalDuration + settleTime);

    setAutoMissTimer(timer);
  };

  const handleHookClick = () => {
    // 1. If in Ready/Result state -> CAST
    if (gameStatus === 'READY' || gameStatus === 'HIT' || gameStatus === 'MISS') {
      setGameStatus('CASTING');
      setGameMessage("Casting...");
      floatSystemRef.current?.castIn();

      // Schedule transition to FISHING
      setTimeout(() => {
        setGameStatus(current => current === 'CASTING' ? 'FISHING' : current);
      }, 3000);
      return;
    }

    // 2. If in FISHING state -> Manual Retrieval (Empty Hook)
    if (gameStatus === 'FISHING') {
      console.log("Manual retrieval - No Fish");
      floatSystemRef.current?.sink();
      setGameStatus('MISS'); // Reuse MISS state for retrieval cycle
      setGameMessage("No Fish.");
      return;
    }

    // 3. If in BITE state -> Try to Catch
    if (gameStatus === 'BITE') {
      if (autoMissTimer) clearTimeout(autoMissTimer);

      if (!biteStartTime || !activePattern) {
        setGameStatus('MISS');
        return;
      }

      const elapsed = Date.now() - biteStartTime;
      const windows = activePattern.catchWindows;

      // Trigger Sink Animation
      floatSystemRef.current?.sink();

      // Check Hit Logic
      let isHit = false;
      if (windows && windows.length > 0) {
        isHit = windows.some(w => elapsed >= w.start && elapsed <= w.end);
      }

      if (isHit) {
        console.log("Result: HIT!");
        setGameStatus('HIT');
        setGameMessage("월척입니다! 🐟");
      } else {
        console.log(`Result: MISS. Elapsed: ${elapsed}`);
        setGameStatus('MISS');
        setGameMessage("놓쳤습니다...");
      }

      setBiteStartTime(null);
      setActivePattern(null);
      return;
    }
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
          gameStatus={gameStatus}
          onHookClick={handleHookClick}
          onDebugInput={(val) => setDebugBiteIndex(val)}
        />

        <div className="absolute inset-x-0 top-[105px] bottom-[36%] pointer-events-none flex flex-col justify-center overflow-hidden">
          <FloatSystem ref={floatSystemRef} />
        </div>
      </div>
    </main>
  );
}
