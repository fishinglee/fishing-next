"use client";

import { useEffect, useRef, useImperativeHandle, forwardRef, useState } from "react";
import { cn } from "@/lib/utils";
import { BITE_PATTERNS, BitePattern, CAST_CONFIG } from "@/lib/constants";
import { FLOATS, FloatModel } from "@/lib/floats";
import { DynamicFloat } from "./DynamicFloat";
import { Ripples, RipplesHandle } from "./Ripples";

export interface FloatSystemHandle {
    playBite: (patternIndex: number) => void;
    castIn: () => void;
    sink: () => void;
    reset: () => void;
    changeFloat: (index: number) => void;
}

// Helper to convert BiteSteps to Keyframes
const convertStepsToKeyframes = (pattern: BitePattern, baseOffset: number) => {
    const steps = pattern.steps;
    const totalDuration = steps.reduce((acc, step) => acc + step.duration, 0);

    let currentDuration = 0;
    const keyframes: Keyframe[] = [
        { transform: `translateY(${baseOffset}px)`, offset: 0 }
    ];

    steps.forEach(step => {
        currentDuration += step.duration;
        const offset = currentDuration / totalDuration;
        keyframes.push({
            transform: `translateY(${step.y + baseOffset}px)`,
            offset: offset,
            easing: step.ease || 'linear'
        });
    });

    return { keyframes, duration: totalDuration };
};

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

    // Horizontal Drift Refs (New Wrappers)
    const floatDriftRef = useRef<HTMLDivElement>(null);
    const reflectDriftRef = useRef<HTMLDivElement>(null);

    // Drift Animation Refs
    const floatDriftAnimRef = useRef<Animation | null>(null);
    const reflectDriftAnimRef = useRef<Animation | null>(null);

    // State
    const [currentFloatIndex, setCurrentFloatIndex] = useState(0);
    const [isBiting, setIsBiting] = useState(false);

    // Helper to get active float cleanly
    const activeFloat = FLOATS[currentFloatIndex] || FLOATS[0];

    // Initial setup - default hidden
    useEffect(() => {
        const float = floatRef.current;
        const reflect = reflectionRef.current;
        if (float && reflect) {
            float.style.opacity = "0";
            reflect.style.opacity = "0";
        }
    }, []);

    // Reflection Constants
    // Adjust this value to fine-tune the reflection position
    // Positive moves reflection DOWN, Negative moves UP
    const REFLECTION_ADJUSTMENT = -203;
    const BASE_OFFSET = 185; // DOM baseline (Moved down 40px from 145)

    // Dynamic Surface Level (based on the first "hit water" phase)
    const surfaceBodyY = CAST_CONFIG.phases[0]?.y || -150;

    // The visual mirror line (Y pixel value where the surface is)
    // Float Y at surface = 180 + surfaceBodyY
    const mirrorLine = BASE_OFFSET + surfaceBodyY + REFLECTION_ADJUSTMENT;

    // Helper to get Mirror Y
    const getMirrorY = (floatTargetY: number) => {
        // FloatPos = BASE_OFFSET + y
        // ReflectPos = 2 * MirrorLine - FloatPos
        return (2 * mirrorLine) - (BASE_OFFSET + floatTargetY);
    };

    const playBite = (patternIndex: number) => {
        const float = floatRef.current;
        const reflect = reflectionRef.current;
        const rippleContainer = rippleContainerRef.current;

        if (!float || !reflect || !rippleContainer) return;

        // Cleanup
        if (currentAnimationRef.current) currentAnimationRef.current.cancel();
        if (currentReflectionAnimRef.current) currentReflectionAnimRef.current.cancel();
        if (currentRippleAnimRef.current) currentRippleAnimRef.current.cancel();

        if (floatDriftAnimRef.current) floatDriftAnimRef.current.cancel();
        if (reflectDriftAnimRef.current) reflectDriftAnimRef.current.cancel();

        float.classList.remove("animate-bob-float");
        reflect.classList.remove("animate-bob-reflect");

        setIsBiting(true);

        const pattern = BITE_PATTERNS[patternIndex] || BITE_PATTERNS[0];

        // Convert steps to keyframes
        const { keyframes, duration } = convertStepsToKeyframes(pattern, BASE_OFFSET);

        // Reflection keyframes: Use consistent mirror logic
        const reflectKeyframes = keyframes.map(kf => {
            const transform = kf.transform as string;
            // Extract the float's Y position from the transform string
            const match = transform.match(/translateY\(([-\d.]+)px\)/);
            if (!match) return kf;

            const floatY_DOM = parseFloat(match[1]); // This is (BASE_OFFSET + y)
            const reflectY = (2 * mirrorLine) - floatY_DOM;

            return {
                ...kf,
                transform: transform.replace(/translateY\(([-\d.]+)px\)/, `translateY(${reflectY}px)`)
            };
        });

        const options: KeyframeAnimationOptions = {
            duration: duration,
            fill: "forwards"
        };

        // Drift logic
        const drift = pattern.horizontalDrift || 0;
        if (drift > 0) {
            const driftDelta = Math.random() > 0.5 ? drift : -drift;
            const driftKeyframes = [
                { transform: 'translateX(0)', offset: 0 },
                { transform: `translateX(${driftDelta}px)`, offset: 0.6 },
                { transform: 'translateX(0)', offset: 1 }
            ];

            // 1. Ripple
            currentRippleAnimRef.current = rippleContainer.animate(driftKeyframes, { duration: duration, fill: "forwards" });

            // 2. Float Drift
            if (floatDriftRef.current) {
                floatDriftAnimRef.current = floatDriftRef.current.animate(driftKeyframes, { duration: duration, fill: "forwards" });
            }

            // 3. Reflection Drift
            if (reflectDriftRef.current) {
                reflectDriftAnimRef.current = reflectDriftRef.current.animate(driftKeyframes, { duration: duration, fill: "forwards" });
            }
        }

        currentAnimationRef.current = float.animate(keyframes, options);
        currentReflectionAnimRef.current = reflect.animate(reflectKeyframes, options);

        // Trigger ripple
        if (rippleRef.current) {
            rippleRef.current.triggerImpact();
        }
    };
    const castIn = () => {
        const float = floatRef.current;
        const reflect = reflectionRef.current;
        const rippleContainer = rippleContainerRef.current;

        if (!float || !reflect || !rippleContainer) return;

        setIsBiting(false);
        reset(); // Clear previous states

        // Reset positions
        float.style.opacity = "1";
        reflect.style.opacity = "1";

        // Reset Ripples fully
        if (currentRippleAnimRef.current) {
            currentRippleAnimRef.current.cancel();
            currentRippleAnimRef.current = null;
        }
        // Reset Drift
        rippleContainer.style.transform = "translateX(0)";
        if (floatDriftRef.current) floatDriftRef.current.style.transform = "translateX(0)";
        if (reflectDriftRef.current) reflectDriftRef.current.style.transform = "translateX(0)";
        rippleContainer.style.opacity = "1";

        // Calculate total duration from config
        const totalDuration = CAST_CONFIG.phases.reduce((acc, phase) => acc + phase.duration, 0);

        // NOTE: Mirror logic moved to component scope (getMirrorY)

        // Sync CSS Variables for seamless transition to bobbing
        const finalReflectionY = getMirrorY(0);
        reflect.style.setProperty('--reflection-pos', `${finalReflectionY}px`);
        reflect.style.setProperty('--reflection-bob-pos', `${finalReflectionY + 5}px`); // Standard 5px bob

        // Fix: Sync Float Variables (forces the animation to start at the correct end position)
        const finalFloatY = BASE_OFFSET; // Use BASE_OFFSET constant
        float.style.setProperty('--float-pos', `${finalFloatY}px`);
        float.style.setProperty('--float-bob-pos', `${finalFloatY + 5}px`);


        // Build Keyframes
        let currentDuration = 0;

        // Initial State (Start Height)
        const startY = CAST_CONFIG.startHeight;
        const floatKeyframes: Keyframe[] = [
            { transform: `translateY(${startY + BASE_OFFSET}px) scale(0.8)`, opacity: 0, offset: 0 },
            { transform: `translateY(${startY + BASE_OFFSET}px) scale(1)`, opacity: 1, offset: 0.05 }
        ];

        const reflectKeyframes: Keyframe[] = [
            { transform: `translateY(${getMirrorY(startY)}px) scale(0.8)`, opacity: 0, offset: 0 },
            { transform: `translateY(${getMirrorY(startY)}px) scale(1)`, opacity: 1, offset: 0.05 }
        ];

        CAST_CONFIG.phases.forEach(phase => {
            currentDuration += phase.duration;
            const offset = currentDuration / totalDuration;
            const y = phase.y;

            floatKeyframes.push({
                transform: `translateY(${y + BASE_OFFSET}px)`,
                offset: offset,
                easing: phase.ease || 'linear'
            });

            reflectKeyframes.push({
                transform: `translateY(${getMirrorY(y)}px)`,
                offset: offset,
                easing: phase.ease || 'linear'
            });
        });

        // Float Animation
        currentAnimationRef.current = float.animate(floatKeyframes, {
            duration: totalDuration,
            fill: 'forwards'
        });

        // Reflection Animation
        currentReflectionAnimRef.current = reflect.animate(reflectKeyframes, {
            duration: totalDuration,
            fill: 'forwards'
        });

        // Trigger heavy splash ripple
        setTimeout(() => {
            if (rippleRef.current) rippleRef.current.triggerImpact();
        }, 600);

        // Add Sway after cast
        setTimeout(() => {
            // Clean handoff: Cancel WAAPI animation to let CSS take over without conflict
            // We already set the CSS variables above so it should match the final frame.
            if (currentAnimationRef.current) currentAnimationRef.current.cancel();
            if (currentReflectionAnimRef.current) currentReflectionAnimRef.current.cancel();

            float.classList.add("animate-bob-float");
            reflect.classList.add("animate-bob-reflect");

            // Ensure sway inner elements are animating
            if (floatInnerRef.current) floatInnerRef.current.classList.add("animate-sway");
            if (reflectInnerRef.current) reflectInnerRef.current.classList.add("animate-sway-reflect");

        }, totalDuration);
    };

    const sink = () => {
        const float = floatRef.current;
        const reflect = reflectionRef.current;
        const rippleContainer = rippleContainerRef.current;
        if (!float || !reflect) return;

        // Capture current state if needed
        const computedStyle = window.getComputedStyle(float);
        const floatTransform = computedStyle.transform;
        const reflectComputed = window.getComputedStyle(reflect);
        const reflectTransform = reflectComputed.transform;

        // Calculate Sink Depth
        const scaledWaterline = activeFloat.waterlineY * activeFloat.scale;
        const floatHeight = activeFloat.height * activeFloat.scale;
        const distFromBottom = floatHeight - scaledWaterline;
        const sinkDistance = distFromBottom * 0.9;

        const startFloat = floatTransform === 'none' ? `translateY(${BASE_OFFSET}px)` : floatTransform;
        const startReflect = reflectTransform === 'none' ? `translateY(${BASE_OFFSET}px)` : reflectTransform;

        // Ripple Reset Logic for Hook/Sink
        if (rippleContainer) {
            // 1. Hide immediately
            rippleContainer.style.opacity = "0";

            // 2. Schedule reappear at center
            setTimeout(() => {
                // Cancel Drift Animation if active
                if (currentRippleAnimRef.current) {
                    currentRippleAnimRef.current.cancel();
                    currentRippleAnimRef.current = null;
                }
                // Reset Position
                rippleContainer.style.transform = "translateX(0)";
                // Show again
                rippleContainer.style.opacity = "1";
            }, 500);
        }

        // Float sinks DOWN
        currentAnimationRef.current = float.animate([
            { transform: startFloat },
            { transform: `${startFloat} translateY(${sinkDistance}px)` } // Append translation
        ], {
            duration: 200,
            fill: 'forwards',
            easing: 'ease-in-out'
        });

        // Reflection moves UP (mirror)
        currentReflectionAnimRef.current = reflect.animate([
            { transform: startReflect },
            { transform: `${startReflect} translateY(${-sinkDistance}px)` }
        ], {
            duration: 300,
            fill: 'forwards',
            easing: 'ease-in-out'
        });
    };

    const reset = () => {
        const float = floatRef.current;
        const reflect = reflectionRef.current;
        const rippleContainer = rippleContainerRef.current;
        if (!float || !reflect) return;

        setIsBiting(false);

        // Cancel all animations
        if (currentAnimationRef.current) currentAnimationRef.current.cancel();
        if (currentReflectionAnimRef.current) currentReflectionAnimRef.current.cancel();

        // Reset Ripples animations
        if (currentRippleAnimRef.current) {
            currentRippleAnimRef.current.cancel();
            currentRippleAnimRef.current = null;
        }

        if (floatDriftAnimRef.current) floatDriftAnimRef.current.cancel();
        if (reflectDriftAnimRef.current) reflectDriftAnimRef.current.cancel();

        float.getAnimations().forEach(anim => anim.cancel());
        reflect.getAnimations().forEach(anim => anim.cancel());

        // Hide
        float.style.opacity = "0";
        reflect.style.opacity = "0";

        // Reset Ripple Container visual state just in case
        if (rippleContainer) {
            rippleContainer.style.transform = "translateX(0)";
            rippleContainer.style.opacity = "1";
        }

        // Reset Drift Wrappers
        if (floatDriftRef.current) floatDriftRef.current.style.transform = "translateX(0)";
        if (reflectDriftRef.current) reflectDriftRef.current.style.transform = "translateX(0)";

        // Remove classes
        if (floatInnerRef.current) floatInnerRef.current.classList.remove("animate-sway");
        if (reflectInnerRef.current) reflectInnerRef.current.classList.remove("animate-sway-reflect");
        float.classList.remove("animate-bob-float");
        reflect.classList.remove("animate-bob-reflect");
    };

    const changeFloat = (index: number) => {
        if (index >= 0 && index < FLOATS.length) {
            setCurrentFloatIndex(index);
        }
    };

    useImperativeHandle(ref, () => ({
        playBite,
        castIn,
        sink,
        reset,
        changeFloat
    }));

    // Calculate Dynamic Pivot for Sway
    // User requested raising the pivot (moving it up relative to float body) to close sway gap.
    const PIVOT_ADJUSTMENT = -30;
    const pivotY = (activeFloat.waterlineY + PIVOT_ADJUSTMENT) * (activeFloat.scale || 1);
    const reflectPivotY = (activeFloat.height - (activeFloat.waterlineY + PIVOT_ADJUSTMENT)) * (activeFloat.scale || 1);

    return (
        <div className="relative flex flex-col items-center cursor-pointer group pointer-events-auto">
            {/* Main Float Container */}
            <div
                style={{ clipPath: "inset(-500px -500px 0px -500px)", height: "100px", width: "100%", display: "flex", justifyContent: "center", alignItems: "flex-end" }}
                className="relative z-20 pb-0"
            >
                <div ref={floatDriftRef}>
                    <div
                        id="fishing-float"
                        ref={floatRef}
                        className="relative flex flex-col items-center translate-y-[145px] z-20 opacity-0"
                    >
                        <div ref={floatInnerRef} style={{ transformOrigin: `50% ${pivotY}px` }}>
                            <DynamicFloat
                                float={activeFloat}
                                className="animate-sway"
                                showGlow={true}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Reflection Container */}
            <div
                className="absolute top-[100px] left-1/2 -translate-x-1/2 w-[400px] h-[500px] overflow-hidden pointer-events-none z-10 flex justify-center items-start"
            >
                <div ref={reflectDriftRef}>
                    <div
                        id="fishing-float-reflection"
                        ref={reflectionRef}
                        className="relative flex flex-col items-center opacity-0 translate-y-[145px]"
                        style={{
                            maskImage: "linear-gradient(to bottom, black 70%, transparent 100%)",
                            WebkitMaskImage: "linear-gradient(to bottom, black 70%, transparent 100%)",
                            transformOrigin: "top center"
                        }}
                    >
                        <div ref={reflectInnerRef} style={{ transformOrigin: `50% ${reflectPivotY}px` }}>
                            <DynamicFloat
                                float={activeFloat}
                                isReflection={true}
                                className="animate-sway"
                                showGlow={true}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Ripples */}
            <div className="absolute inset-0 pointer-events-none -translate-y-[12px]">
                <div ref={rippleContainerRef} className="w-full h-full flex justify-center">
                    <Ripples ref={rippleRef} />
                </div>
            </div>
        </div>
    );
});

FloatSystem.displayName = "FloatSystem";
