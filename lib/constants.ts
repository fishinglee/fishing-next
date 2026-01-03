export interface BiteStep {
    y: number;
    duration: number;
    ease?: string;
}

export interface BitePattern {
    id: string;
    name: string;
    steps: BiteStep[];
    horizontalDrift?: number;
    catchWindows?: { start: number; end: number }[];
}

export const BITE_PATTERNS: BitePattern[] = [
    {
        id: "BITE_01",
        name: "Standard Crucian (Slow Rise)",
        steps: [
            { y: 15, duration: 300, ease: "ease-out" },
            { y: 0, duration: 500, ease: "linear" },
            { y: 0, duration: 500, ease: "linear" },
            { y: -60, duration: 1000, ease: "ease-out" },
            { y: -60, duration: 1000, ease: "ease-out" },
            { y: 0, duration: 2500, ease: "ease-in" }
        ],
        horizontalDrift: 2,
        catchWindows: [
            { start: 1300, end: 2000 }, // 초반 잡기
            { start: 2300, end: 3300 } // 후반 잡기
        ]
    },
    {
        id: "BITE_02",
        name: "Small Fish (Jitter)",
        steps: [
            { y: 10, duration: 200, ease: "ease-in-out" },
            { y: -10, duration: 200, ease: "ease-in-out" },
            { y: 15, duration: 200, ease: "ease-in-out" },
            { y: -5, duration: 200, ease: "ease-in-out" },
            { y: 0, duration: 2000, ease: "linear" }
        ],
        horizontalDrift: 10,
        catchWindows: [{ start: 400, end: 800 }] // 중간 잡기
    },
    {
        id: "BITE_03",
        name: "Carp Dash (Sink)",
        steps: [
            { y: 5, duration: 200, ease: "linear" },
            { y: 120, duration: 800, ease: "ease-in" },
            { y: 120, duration: 1500, ease: "linear" }
        ],
        horizontalDrift: 30,
        catchWindows: [{ start: 200, end: 1000 }] // While sinking down
    },
    {
        id: "BITE_04",
        name: "Sensitive Winter",
        steps: [
            { y: -10, duration: 2000, ease: "ease-out" },
            { y: -15, duration: 5000, ease: "linear" },
            { y: 0, duration: 1000, ease: "ease-in" }
        ],
        horizontalDrift: 0,
        catchWindows: [{ start: 2000, end: 4000 }] // Long slow rise
    },
    {
        id: "BITE_05",
        name: "Bullet Bite",
        steps: [
            { y: -40, duration: 800, ease: "ease-out" },
            { y: -40, duration: 600, ease: "ease-out" },
            { y: -80, duration: 1500, ease: "ease-in-out" },
            { y: -80, duration: 600, ease: "ease-in-out" },
            { y: 0, duration: 1500, ease: "ease-in-out" }
        ],
        horizontalDrift: 0,
        catchWindows: [{ start: 800, end: 1400 }] // First Plateau
    },
    {
        id: "BITE_06",
        name: "Big Crucian (Endless Rise)",
        steps: [
            { y: 3, duration: 1000, ease: "linear" },
            { y: -80, duration: 7000, ease: "ease-in-out" },
            { y: -80, duration: 2000, ease: "linear" }
        ],
        horizontalDrift: 5,
        catchWindows: [{ start: 4000, end: 8000 }] // Late rise
    },
    {
        id: "BITE_07",
        name: "Catfish Drift",
        steps: [
            { y: 18, duration: 1000, ease: "ease-in" },
            { y: 35, duration: 4000, ease: "linear" }
        ],
        horizontalDrift: 150,
        catchWindows: [{ start: 1000, end: 4000 }] // While drifting
    },
    {
        id: "BITE_08",
        name: "False Strike (Blink)",
        steps: [
            { y: 8, duration: 300, ease: "ease-in" },
            { y: 0, duration: 500, ease: "ease-out" },
            { y: 8, duration: 300, ease: "ease-in" },
            { y: 0, duration: 2900, ease: "linear" }
        ],
        horizontalDrift: 2,
        catchWindows: [
            { start: 0, end: 300 }, // Initial dip
            { start: 800, end: 1100 } // Second dip
        ]
    },
    {
        id: "BITE_09",
        name: "Flowing Bite",
        steps: [
            { y: 5, duration: 2000, ease: "linear" },
            { y: 15, duration: 4000, ease: "linear" }
        ],
        horizontalDrift: 40,
        catchWindows: [{ start: 2000, end: 5000 }]
    },
    {
        id: "BITE_10",
        name: "Turtle/Crab",
        steps: [
            { y: 3, duration: 100, ease: "linear" },
            { y: 0, duration: 1500, ease: "linear" },
            { y: 4, duration: 100, ease: "linear" },
            { y: 0, duration: 1500, ease: "linear" },
            { y: 2, duration: 100, ease: "linear" }
        ],
        catchWindows: [
            { start: 0, end: 200 }, // First tap
            { start: 1600, end: 1800 }, // Second tap
            { start: 3200, end: 3400 } // Third tap
        ]
    }
];

export type GameStatus = 'READY' | 'CASTING' | 'FISHING' | 'BITE' | 'HIT' | 'MISS' | 'BROKEN';

export interface CastPhase {
    y: number; // Target Y position relative to resting (0)
    duration: number;
    ease: string;
}

export const CAST_CONFIG = {
    startHeight: -600, // Starting height (pixels above resting)
    phases: [
        // Phase 1: Fast Drop to Surface (Body at water level)
        // -80 puts the body center at water level
        { y: -80, duration: 1000, ease: "cubic-bezier(0.5, 0, 1, 1)" },

        // Phase 2: Buoyancy Bob (Bobbing at surface)
        { y: -60, duration: 150, ease: "ease-out" },
        { y: -80, duration: 150, ease: "ease-in" },
        { y: -70, duration: 150, ease: "ease-out" },
        { y: -80, duration: 150, ease: "ease-in" },
        { y: -70, duration: 800, ease: "ease-in" },

        // Phase 3: Slow Settle (Sinking to fishing depth 0)
        { y: 0, duration: 2000, ease: "ease-out" }
    ]
};
