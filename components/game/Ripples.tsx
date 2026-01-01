"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export function Ripples() {
    const ripple1Ref = useRef<HTMLDivElement>(null);
    const ripple2Ref = useRef<HTMLDivElement>(null);

    // We can expose a reset method via ref or context if needed, 
    // but for now relying on CSS animations is fine, or we can use the key prop to force re-render from parent.
    // The original code had specific logic to reset ripples on bite end.
    // We'll handle that by allowing the parent to force a re-mount or CSS class toggle if needed.
    // For the MVP, just rendering them with the loop is enough, they are background ambience mostly.
    // The bite interaction 'reset' was to synchronize visually. 

    return (
        <div id="ripple-container" className="absolute top-[115px] inset-x-0 h-0 flex items-center justify-center pointer-events-none">
            <div
                ref={ripple1Ref}
                className="absolute w-16 h-5 border border-white/20 rounded-[100%] animate-ping-slow"
            ></div>
            <div
                ref={ripple2Ref}
                className="absolute w-24 h-8 border border-white/10 rounded-[100%] animate-ping-slower delay-1000"
            ></div>
        </div>
    );
}
