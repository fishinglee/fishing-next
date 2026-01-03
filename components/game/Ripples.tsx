"use client";

import { useEffect, useRef, useImperativeHandle, forwardRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface RipplesHandle {
    triggerImpact: () => void;
}

export const Ripples = forwardRef<RipplesHandle>((_, ref) => {
    const ripple1Ref = useRef<HTMLDivElement>(null);
    const ripple2Ref = useRef<HTMLDivElement>(null);
    const [impacts, setImpacts] = useState<{ id: number; variant: 'main' | 'secondary' }[]>([]);

    useImperativeHandle(ref, () => ({
        triggerImpact: () => {
            const now = Date.now();

            // 1. Add Main Impact
            setImpacts(prev => [...prev, { id: now, variant: 'main' }]);

            // 2. Add Secondary Impact (Small follow-up) after 200ms
            setTimeout(() => {
                setImpacts(prev => [...prev, { id: now + 1, variant: 'secondary' }]);
            }, 200);

            // Auto cleanup
            setTimeout(() => {
                setImpacts(prev => prev.filter(i => i.id !== now && i.id !== now + 1));
            }, 1500); // Extended cleanup window to cover both
        }
    }));

    // We can expose a reset method via ref or context if needed, 
    // but for now relying on CSS animations is fine, or we can use the key prop to force re-render from parent.
    // The original code had specific logic to reset ripples on bite end.
    // We'll handle that by allowing the parent to force a re-mount or CSS class toggle if needed.
    // For the MVP, just rendering them with the loop is enough, they are background ambience mostly.
    // The bite interaction 'reset' was to synchronize visually. 

    return (
        <div id="ripple-container" className="absolute top-[115px] inset-x-0 h-0 flex items-center justify-center pointer-events-none">
            {/* Ambient Ripples */}
            <div
                ref={ripple1Ref}
                className="absolute w-16 h-5 border border-white/20 rounded-[100%] animate-ping-slow"
            ></div>
            <div
                ref={ripple2Ref}
                className="absolute w-24 h-8 border border-white/10 rounded-[100%] animate-ping-slower delay-1000"
            ></div>

            {/* Impact Ripples */}
            {impacts.map(impact => (
                <div
                    key={impact.id}
                    className={cn(
                        "absolute border rounded-[100%] animate-impact",
                        impact.variant === 'main'
                            ? "w-20 h-6 border-white/50" // Stronger main impact
                            : "w-12 h-4 border-white/30"  // Weaker secondary impact
                    )}
                ></div>
            ))}
        </div>
    );
});

Ripples.displayName = "Ripples";
