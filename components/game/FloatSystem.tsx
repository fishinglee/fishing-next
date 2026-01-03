"use client";

import { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { BITE_PATTERNS, CAST_CONFIG } from "@/lib/constants";
import { Ripples, RipplesHandle } from "./Ripples";

export interface FloatSystemHandle {
    playBite: (patternIndex: number) => void;
    castIn: () => void;
    sink: () => void;
    reset: () => void;
}

export const FloatSystem = forwardRef<FloatSystemHandle>((_, ref) => {
    const floatRef = useRef<HTMLDivElement>(null);
    const reflectionRef = useRef<HTMLDivElement>(null);
    const rippleContainerRef = useRef<HTMLDivElement>(null);

    // Animation references
    const currentAnimationRef = useRef<Animation | null>(null);
    const currentReflectionAnimRef = useRef<Animation | null>(null);
    const currentRippleAnimRef = useRef<Animation | null>(null);
    const rippleRef = useRef<RipplesHandle>(null);

    // Inner refs for sway control
    const floatInnerRef = useRef<HTMLDivElement>(null);
    const reflectInnerRef = useRef<HTMLDivElement>(null);

    // Initial setup - default hidden
    useEffect(() => {
        const float = floatRef.current;
        const reflect = reflectionRef.current;
        if (float && reflect) {
            float.style.opacity = "0";
            reflect.style.opacity = "0";
        }
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

    const castIn = () => {
        const float = floatRef.current;
        const reflect = reflectionRef.current;
        const rippleContainer = rippleContainerRef.current;
        const floatInner = floatInnerRef.current;
        const reflectInner = reflectInnerRef.current;
        if (!float || !reflect || !floatInner || !reflectInner || !rippleContainer) return;

        // 1. Cleanup previous state
        if (currentAnimationRef.current) currentAnimationRef.current.cancel();
        if (currentReflectionAnimRef.current) currentReflectionAnimRef.current.cancel();
        if (currentRippleAnimRef.current) currentRippleAnimRef.current.cancel();

        // Capture current ripple drift before cancelling
        // (NOTE: We want to animate FROM this drifted position back to 0)
        const rippleStyle = window.getComputedStyle(rippleContainer);
        const startRippleTransform = rippleStyle.transform === 'none' ? 'translateX(0)' : rippleStyle.transform;

        // Safety: Clear any lingering WAAPI animations
        float.getAnimations().forEach(anim => anim.cancel());
        reflect.getAnimations().forEach(anim => anim.cancel());
        rippleContainer.getAnimations().forEach(anim => anim.cancel());

        // 2. Reset Styles
        float.style.opacity = "1";
        float.style.transform = "";
        reflect.style.opacity = "";
        reflect.style.transform = "";

        // Remove cast-in classes if they existed (legacy) and ensure clean state
        float.classList.remove("animate-cast-in", "animate-bob");
        reflect.classList.remove("animate-cast-in-reflect", "animate-bob-reflect");

        // Disable sway during cast
        floatInner.classList.remove("animate-sway");
        reflectInner.classList.remove("animate-sway");

        float.className = "relative flex flex-col items-center translate-y-0 z-20";
        reflect.className = "relative flex flex-col items-center opacity-60 blur-[0.5px] brightness-75";

        // 3. Prepare Animation Data
        // Get reflection base Y
        let reflectionRestingY = -107;
        if (typeof window !== "undefined") {
            const styles = getComputedStyle(document.documentElement);
            const val = styles.getPropertyValue('--reflection-pos').trim();
            if (val && val.endsWith('px')) {
                reflectionRestingY = parseFloat(val);
            }
        }

        const { startHeight, phases } = CAST_CONFIG;
        const totalDuration = phases.reduce((sum, p) => sum + p.duration, 0);

        const floatKeyframes: Keyframe[] = [];
        const reflectKeyframes: Keyframe[] = [];

        // Start Frame
        // Note: 'easing' in WAAPI applies to the transition FROM this keyframe TO the next.
        const firstEase = phases.length > 0 ? phases[0].ease : 'linear';

        floatKeyframes.push({
            transform: `translateY(${startHeight}px)`,
            offset: 0,
            easing: firstEase
        });

        reflectKeyframes.push({
            transform: `translateY(${reflectionRestingY - startHeight}px)`,
            offset: 0,
            easing: firstEase
        });

        let accumulatedTime = 0;

        phases.forEach((phase, index) => {
            accumulatedTime += phase.duration;
            const offset = accumulatedTime / totalDuration;

            // The easing for the NEXT segment
            const nextEase = (index < phases.length - 1) ? phases[index + 1].ease : 'ease-in-out';

            floatKeyframes.push({
                transform: `translateY(${phase.y}px)`,
                offset: offset,
                easing: nextEase
            });

            reflectKeyframes.push({
                transform: `translateY(${reflectionRestingY - phase.y}px)`,
                offset: offset,
                easing: nextEase
            });
        });

        // 4. Run Animation
        currentAnimationRef.current = float.animate(floatKeyframes, { duration: totalDuration, fill: 'forwards' });
        currentReflectionAnimRef.current = reflect.animate(reflectKeyframes, { duration: totalDuration, fill: 'forwards' });

        // Reset Ripple Container drift smoothly (during the drop phase)
        // We use the first phase duration (drop) to reset the drift.
        const resetDuration = phases.length > 0 ? phases[0].duration : 1000;

        currentRippleAnimRef.current = rippleContainer.animate([
            { transform: startRippleTransform, opacity: 1, offset: 0 },
            { transform: startRippleTransform, opacity: 0, offset: 0.2 }, // Fade out quickly (20% of drop)
            { transform: 'translateX(0)', opacity: 0, offset: 0.21 },     // Teleport to center while invisible
            { transform: 'translateX(0)', opacity: 0, offset: 0.9 },      // Stay hidden until near impact
            { transform: 'translateX(0)', opacity: 1, offset: 1 }         // Reappear at impact
        ], {
            duration: resetDuration,
            fill: 'forwards',
            easing: 'linear'
        });

        // Trigger Ripple Impact at end of Phase 1 (Drop)
        if (phases.length > 0) {
            setTimeout(() => {
                rippleRef.current?.triggerImpact();
            }, phases[0].duration);
        }

        // 5. Cleanup on Finish
        currentAnimationRef.current.onfinish = () => {
            float.classList.add("animate-bob");
            reflect.classList.add("animate-bob-reflect");

            // Re-enable sway after cast is done
            floatInner.classList.add("animate-sway");
            reflectInner.classList.add("animate-sway");

            currentAnimationRef.current?.cancel();
            currentReflectionAnimRef.current?.cancel();

            currentAnimationRef.current = null;
            currentReflectionAnimRef.current = null;
            currentRippleAnimRef.current = null;
        };
    };

    const sink = () => {
        const float = floatRef.current;
        const reflect = reflectionRef.current;
        if (!float || !reflect) return;

        // Capture current state before cancelling
        const floatStyle = window.getComputedStyle(float);
        const reflectStyle = window.getComputedStyle(reflect);
        const floatTransform = floatStyle.transform;
        const reflectTransform = reflectStyle.transform;

        // Cancel BITE/BOB animations
        if (currentAnimationRef.current) currentAnimationRef.current.cancel();
        if (currentReflectionAnimRef.current) currentReflectionAnimRef.current.cancel();

        // Track SINK animation
        // Start from captured matrix (or 'none' if idle)
        const startFloat = floatTransform === 'none' ? 'translateY(0)' : floatTransform;
        const startReflect = reflectTransform === 'none' ? 'translateY(-107px)' : reflectTransform;

        // Main Float sinks DOWN (+Y) into the water mask
        currentAnimationRef.current = float.animate([
            { transform: startFloat },
            { transform: `${startFloat} translateY(200px)` }
        ], {
            duration: 200,
            fill: 'forwards',
            easing: 'ease-in'
        });

        // Reflection moves UP (-Y) to meet the water line (mirror effect)
        currentReflectionAnimRef.current = reflect.animate([
            { transform: startReflect },
            { transform: `${startReflect} translateY(-200px)` }
        ], {
            duration: 200,
            fill: 'forwards',
            easing: 'ease-in'
        });
    };

    const reset = () => {
        const float = floatRef.current;
        const reflect = reflectionRef.current;
        if (!float || !reflect) return;

        // Cancel all animations
        if (currentAnimationRef.current) currentAnimationRef.current.cancel();
        if (currentReflectionAnimRef.current) currentReflectionAnimRef.current.cancel();
        float.getAnimations().forEach(anim => anim.cancel());
        reflect.getAnimations().forEach(anim => anim.cancel());

        // Hide
        float.style.opacity = "0";
        reflect.style.opacity = "0";

        // Remove Classes
        float.classList.remove("animate-bob", "animate-cast-in");
        reflect.classList.remove("animate-bob-reflect", "animate-cast-in-reflect");
    };

    // Make sure we are visible when casting starts
    useEffect(() => {
        if (!floatRef.current || !reflectionRef.current) return;
        // In castIn, we should ensure opacity is 1
    }, []);



    useImperativeHandle(ref, () => ({
        playBite,
        castIn,
        sink,
        reset
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
                    className="relative flex flex-col items-center translate-y-0 z-20 opacity-0"
                >
                    <div
                        ref={floatInnerRef}
                        className="flex flex-col items-center animate-sway origin-[50%_75px] pt-8 relative"
                    >
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
                    className="relative flex flex-col items-center opacity-0 blur-[0.5px] brightness-75"
                    style={{
                        maskImage: "linear-gradient(to bottom, black 85%, transparent 100%)",
                        WebkitMaskImage: "linear-gradient(to bottom, black 85%, transparent 100%)",
                        width: "100%",
                        transform: "translateY(var(--reflection-pos, -107px))"
                    }}
                >
                    <div
                        ref={reflectInnerRef}
                        className="flex flex-col items-center animate-sway origin-[50%_202px] relative"
                    >
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
            <div className="absolute inset-0 pointer-events-none -translate-y-[35px]">
                <div ref={rippleContainerRef} className="w-full h-full">
                    <Ripples ref={rippleRef} />
                </div>
            </div>
        </div>
    );
});

FloatSystem.displayName = "FloatSystem";
