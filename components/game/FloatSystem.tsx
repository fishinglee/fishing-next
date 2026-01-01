"use client";

import { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { BITE_PATTERNS } from "@/lib/constants";
import { Ripples } from "./Ripples";

export interface FloatSystemHandle {
    playBite: (patternIndex: number) => void;
}

export const FloatSystem = forwardRef<FloatSystemHandle>((_, ref) => {
    const floatRef = useRef<HTMLDivElement>(null);
    const reflectionRef = useRef<HTMLDivElement>(null);
    const rippleContainerRef = useRef<HTMLDivElement>(null);

    // Animation references
    const currentAnimationRef = useRef<Animation | null>(null);
    const currentReflectionAnimRef = useRef<Animation | null>(null);
    const currentRippleAnimRef = useRef<Animation | null>(null);

    // Initial Cast-in logic
    useEffect(() => {
        const float = floatRef.current;
        const reflect = reflectionRef.current;

        if (!float || !reflect) return;

        // Wait for the cast-in CSS animation to finish (3s)
        const timer = setTimeout(() => {
            float.classList.remove("animate-cast-in");
            float.classList.add("animate-bob");

            reflect.classList.remove("animate-cast-in-reflect");
            reflect.classList.add("animate-bob-reflect");
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    const playBite = (patternIndex: number) => {
        const float = floatRef.current;
        const reflect = reflectionRef.current;
        const rippleContainer = rippleContainerRef.current;

        if (!float || !reflect || !rippleContainer) return;

        // Cleanup
        if (currentAnimationRef.current) currentAnimationRef.current.cancel();
        if (currentReflectionAnimRef.current) currentReflectionAnimRef.current.cancel();
        if (currentRippleAnimRef.current) currentRippleAnimRef.current.cancel();

        float.classList.remove("animate-bob");
        reflect.classList.remove("animate-bob-reflect");
        // Ensure cast-in is also purely removed if somehow triggered early, though unlikely
        float.classList.remove("animate-cast-in");
        reflect.classList.remove("animate-cast-in-reflect");


        const pattern = BITE_PATTERNS[Math.min(patternIndex, BITE_PATTERNS.length - 1)];
        if (!pattern) return; // safety

        const steps = pattern.steps;
        const patternDuration = steps.reduce((sum, step) => sum + step.duration, 0);

        // Return logic
        const lastStep = steps[steps.length - 1];
        const finalY = lastStep ? lastStep.y : 0;
        const finalX = pattern.horizontalDrift || 0;
        const distance = Math.sqrt(finalY * finalY + finalX * finalX);
        const returnDuration = Math.max(800, distance * 15);
        const totalDuration = patternDuration + returnDuration;

        let keyframes: Keyframe[] = [];
        let reflectionKeyframes: Keyframe[] = [];
        let rippleKeyframes: Keyframe[] = [];

        let currentTime = 0;
        const restingY = 0;
        // Read CSS variable for single source of truth
        let reflectionRestingY = -107; // default fallback
        if (typeof window !== "undefined") {
            const styles = getComputedStyle(document.documentElement);
            const val = styles.getPropertyValue('--reflection-pos').trim();
            if (val && val.endsWith('px')) {
                reflectionRestingY = parseFloat(val);
            }
        }
        const driftDir = Math.random() > 0.5 ? 1 : -1;

        // Start Frame
        keyframes.push({ transform: `translateY(${restingY}px) translateX(0)`, easing: 'linear', offset: 0 });
        reflectionKeyframes.push({ transform: `translateY(${reflectionRestingY}px) translateX(0)`, easing: 'linear', offset: 0 });
        rippleKeyframes.push({ transform: `translateX(0)`, easing: 'linear', offset: 0 });

        // Steps
        for (const step of steps) {
            currentTime += step.duration;
            const offset = currentTime / totalDuration;
            const driftProgress = currentTime / patternDuration;
            const currentDrift = pattern.horizontalDrift ? (pattern.horizontalDrift * driftProgress * driftDir) : 0;

            keyframes.push({
                transform: `translateY(${restingY + step.y}px) translateX(${currentDrift}px)`,
                easing: step.ease || 'linear',
                offset: offset
            });

            // Reflection is inverted Y displacement
            reflectionKeyframes.push({
                transform: `translateY(${reflectionRestingY - step.y}px) translateX(${currentDrift}px)`,
                easing: step.ease || 'linear',
                offset: offset
            });

            rippleKeyframes.push({
                transform: `translateX(${currentDrift}px)`,
                easing: step.ease || 'linear',
                offset: offset
            });
        }

        // Return Frame
        keyframes.push({ transform: `translateY(${restingY}px) translateX(0)`, easing: 'ease-in-out', offset: 1 });
        reflectionKeyframes.push({ transform: `translateY(${reflectionRestingY}px) translateX(0)`, easing: 'ease-in-out', offset: 1 });
        rippleKeyframes.push({ transform: `translateX(0)`, easing: 'ease-in-out', offset: 1 });

        // Play
        currentAnimationRef.current = float.animate(keyframes, { duration: totalDuration, fill: 'forwards' });
        currentReflectionAnimRef.current = reflect.animate(reflectionKeyframes, { duration: totalDuration, fill: 'forwards' });
        currentRippleAnimRef.current = rippleContainer.animate(rippleKeyframes, { duration: totalDuration, fill: 'forwards' });

        currentAnimationRef.current.onfinish = () => {
            float.classList.add("animate-bob");
            reflect.classList.add("animate-bob-reflect");

            currentAnimationRef.current?.cancel();
            currentReflectionAnimRef.current?.cancel();
            currentRippleAnimRef.current?.cancel();

            currentAnimationRef.current = null;
            currentReflectionAnimRef.current = null;
            currentRippleAnimRef.current = null;
        };
    };

    useImperativeHandle(ref, () => ({
        playBite
    }));

    return (
        <div className="relative flex flex-col items-center cursor-pointer group pointer-events-auto">
            <div
                style={{ clipPath: "inset(-500px -500px 0px -500px)", height: "80px", width: "100%", display: "flex", justifyContent: "center" }}
                className="relative z-20"
            >
                <div
                    id="fishing-float"
                    ref={floatRef}
                    className="relative flex flex-col items-center animate-cast-in translate-y-0 z-20"
                >
                    <div className="flex flex-col items-center animate-sway origin-[50%_75px] pt-8 relative">
                        {/* Green Top */}
                        <div className="relative z-30 w-1.5 h-6 bg-primary rounded-full shadow-[0_0_15px_2px_rgba(74,222,128,0.6)]"></div>
                        {/* Rod */}
                        <div className="z-20 w-0.5 h-20 bg-white/40 -mt-0.5"></div>
                        {/* Paint */}
                        <div className="z-20 w-1 h-2 bg-red-500 rounded-sm -mt-0.5"></div>
                        {/* Body */}
                        <div className="relative z-20 w-2.5 h-12 rounded-full bg-gradient-to-b from-red-500 via-orange-500 to-yellow-500 -mt-0.5 shadow-lg flex flex-col items-center overflow-hidden">
                            <div className="absolute top-1 left-0.5 w-1 h-6 bg-white/30 rounded-full blur-[0.5px]"></div>
                            <div className="absolute bottom-3 w-full h-1.5 bg-black/20"></div>
                        </div>
                        {/* Stem */}
                        <div className="z-10 w-0.5 h-24 bg-gradient-to-b from-white/30 to-transparent -mt-1"></div>
                    </div>
                </div>
            </div>

            {/* Reflection */}
            <div className="absolute top-[80px] left-1/2 -translate-x-1/2 w-[400px] h-[500px] overflow-hidden pointer-events-none z-10 flex justify-center">
                <div
                    id="fishing-float-reflection"
                    ref={reflectionRef}
                    className="relative flex flex-col items-center opacity-60 blur-[0.5px] brightness-75 animate-cast-in-reflect"
                    style={{
                        maskImage: "linear-gradient(to bottom, black 85%, transparent 100%)",
                        WebkitMaskImage: "linear-gradient(to bottom, black 85%, transparent 100%)",
                        width: "100%",
                        transform: "translateY(var(--reflection-pos, -107px))"
                    }}
                >
                    <div className="flex flex-col items-center animate-sway origin-[50%_202px] relative">
                        {/* Long Stem */}
                        <div className="z-10 w-0.5 h-24 bg-white/50 -mb-1"></div>
                        {/* Body (Flipped) */}
                        <div className="relative z-20 w-2.5 h-12 rounded-full bg-gradient-to-t from-red-500 via-orange-500 to-yellow-500 -mb-0.5 flex flex-col items-center justify-end overflow-hidden shadow-lg">
                            <div className="absolute bottom-1 left-0.5 w-1 h-6 bg-white/30 rounded-full blur-[0.5px]"></div>
                            <div className="absolute top-3 w-full h-1.5 bg-black/20"></div>
                        </div>
                        {/* Paint */}
                        <div className="z-20 w-2 h-2 bg-red-500 rounded-sm -mb-0.5"></div>
                        {/* Rod */}
                        <div className="z-20 w-0.5 h-20 bg-white/60 -mb-0.5"></div>
                        {/* Green Top */}
                        <div className="relative z-30 w-1.5 h-6 bg-primary rounded-full shadow-[0_0_15px_2px_rgba(74,222,128,0.3)]"></div>
                    </div>
                </div>
            </div>

            {/* Ripples - Wrap for horizontal drift animation */}
            {/* Ripples - Wrap for horizontal drift animation */}
            <div className="absolute inset-0 pointer-events-none -translate-y-[35px]">
                <div ref={rippleContainerRef} className="w-full h-full">
                    <Ripples />
                </div>
            </div>
        </div>
    );
});

FloatSystem.displayName = "FloatSystem";
