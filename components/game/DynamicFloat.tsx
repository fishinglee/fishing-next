import React, { forwardRef } from "react";
import { FloatModel } from "@/lib/floats";
import { cn } from "@/lib/utils";

interface DynamicFloatProps {
    float: FloatModel;
    isReflection?: boolean;
    className?: string; // For passing animation classes like 'animate-sway'
    showGlow?: boolean; // Controls if the glow tip should be active
}

export const DynamicFloat = forwardRef<HTMLDivElement, DynamicFloatProps>(
    ({ float, isReflection = false, className, showGlow = false }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "relative flex justify-center items-center pointer-events-none",
                    className
                )}
                style={{
                    // Scale the float to match the desired visual size.
                    // Original Height 450 is very tall. We scale it down.
                    width: `${float.width * float.scale}px`,
                    height: `${float.height * float.scale}px`,
                }}
            >
                <svg
                    viewBox={`0 0 ${float.width} ${float.height}`}
                    className={cn(
                        "w-full h-full overflow-visible",
                        // If reflection, flip vertically
                        isReflection && "scale-y-[-1] opacity-85 blur-[0.5px]"
                    )}
                    preserveAspectRatio="xMidYMid meet"
                >
                    <defs>{float.components.defs}</defs>

                    {/* Render Layers in Order */}
                    {/* 1. Leg */}
                    {float.components.leg}

                    {/* 2. Antenna */}
                    {float.components.antenna}

                    {/* 3. Body */}
                    {float.components.body}

                    {/* 4. Glow Tip */}
                    {/* Apply pulse animation if showGlow is true */}
                    <g
                        className={cn("transition-all duration-300")}
                        style={{
                            filter: showGlow
                                ? `drop-shadow(0 0 8px ${float.glowColor || 'white'}) brightness(1.2)`
                                : 'none'
                        }}
                    >
                        {float.components.glowTip}
                    </g>
                </svg>
            </div>
        );
    }
);

DynamicFloat.displayName = "DynamicFloat";
