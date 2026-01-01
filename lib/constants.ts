export const BITE_PATTERNS = [
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
        horizontalDrift: 2
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
        horizontalDrift: 10
    },
    {
        id: "BITE_03",
        name: "Carp Dash (Sink)",
        steps: [
            { y: 5, duration: 200, ease: "linear" },
            { y: 120, duration: 800, ease: "ease-in" },
            { y: 120, duration: 1500, ease: "linear" }
        ],
        horizontalDrift: 30
    },
    {
        id: "BITE_04",
        name: "Sensitive Winter",
        steps: [
            { y: -10, duration: 2000, ease: "ease-out" },
            { y: -15, duration: 5000, ease: "linear" },
            { y: 0, duration: 1000, ease: "ease-in" }
        ],
        horizontalDrift: 0
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
        horizontalDrift: 0
    },
    {
        id: "BITE_06",
        name: "Big Crucian (Endless Rise)",
        steps: [
            { y: 3, duration: 1000, ease: "linear" },
            { y: -80, duration: 7000, ease: "ease-in-out" },
            { y: -80, duration: 2000, ease: "linear" }
        ],
        horizontalDrift: 5
    },
    {
        id: "BITE_07",
        name: "Catfish Drift",
        steps: [
            { y: 18, duration: 1000, ease: "ease-in" },
            { y: 35, duration: 4000, ease: "linear" }
        ],
        horizontalDrift: 150
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
        horizontalDrift: 2
    },
    {
        id: "BITE_09",
        name: "Flowing Bite",
        steps: [
            { y: 5, duration: 2000, ease: "linear" },
            { y: 15, duration: 4000, ease: "linear" }
        ],
        horizontalDrift: 40
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
        ]
    }
];
