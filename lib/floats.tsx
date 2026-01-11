import React from "react";

export interface FloatModel {
    id: string;
    name: string;
    width: number;
    height: number;
    waterlineY: number; // The Y coordinate on the SVG that should align with the water surface
    scale: number;
    glowColor?: string;
    components: {
        leg: React.ReactNode;
        body: React.ReactNode;
        antenna: React.ReactNode;
        glowTip: React.ReactNode;
        defs: React.ReactNode; // For gradients specific to this float
    };
}

export const FLOATS: FloatModel[] = [
    {
        id: "float_01",
        name: "Standard Float",
        width: 230,
        height: 450,
        waterlineY: 250, // Estimate based on body position (~226 + height)
        scale: 0.9,
        glowColor: "#05df72",
        components: {
            defs: (
                <>
                    <linearGradient id="float01_Linear1" x1="0" y1="0" x2="1" y2="0" gradientUnits="userSpaceOnUse" gradientTransform="matrix(0,142.636253,-17020.97099,0,231.849121,74.000417)">
                        <stop offset="0" style={{ stopColor: "#6b6b6b", stopOpacity: 1 }} />
                        <stop offset="1" style={{ stopColor: "#939393", stopOpacity: 0 }} />
                    </linearGradient>
                    <linearGradient id="float01_Linear2" x1="0" y1="0" x2="1" y2="0" gradientUnits="userSpaceOnUse" gradientTransform="matrix(0,75.802156,-374.936655,0,96.404238,220.298687)">
                        <stop offset="0" style={{ stopColor: "#fb2c36", stopOpacity: 1 }} />
                        <stop offset="1" style={{ stopColor: "#f1ae00", stopOpacity: 1 }} />
                    </linearGradient>
                    <linearGradient id="float01_Linear3" x1="0" y1="0" x2="1" y2="0" gradientUnits="userSpaceOnUse" gradientTransform="matrix(0,33.181461,-134.875758,0,83.171327,233.915202)">
                        <stop offset="0" style={{ stopColor: "#fd7468", stopOpacity: 1 }} />
                        <stop offset="1" style={{ stopColor: "#ff9b4d", stopOpacity: 1 }} />
                    </linearGradient>
                </>
            ),
            leg: (
                <g transform="matrix(0.589725,0,0,1.033575,-20.177334,259.929866)">
                    <rect x="231.849" y="28.677" width="3.391" height="177.073" style={{ fill: "url(#float01_Linear1)" }} />
                </g>
            ),
            antenna: (
                <g transform="matrix(0.589725,0,0,1.033575,-20.177334,-17.715577)">
                    <rect x="231.849" y="74" width="3.391" height="146.734" style={{ fill: "#7f8c84" }} />
                </g>
            ),
            body: (
                <g id="body-g">
                    <g transform="matrix(1,0,0,1,21.145601,-7.858053)">
                        <path d="M98.904,226.374c3.164,1.067 5.446,4.061 5.446,7.583l0,55.472c0,4.415 -3.585,8 -8,8c-4.415,0 -8,-3.585 -8,-8l0,-55.472c0,-3.562 2.334,-6.584 5.554,-7.619l0,-6.8c0,-0.69 0.56,-1.25 1.25,-1.25l2.5,0c0.69,0 1.25,0.56 1.25,1.25l0,6.835Z" style={{ fill: "url(#float01_Linear2)" }} />
                    </g>
                    <g transform="matrix(1,0,0,1.04,18.582615,-19.01258)">
                        <rect x="90.913" y="270.718" width="16" height="8.145" style={{ fill: "#cc6800" }} />
                    </g>
                    <g transform="matrix(1,0,0,1,32.21284,-8.214405)">
                        <path d="M86.03,235.913l0,28.887c0,1.588 -1.29,2.878 -2.878,2.878c-1.588,0 -2.878,-1.29 -2.878,-2.878l0,-28.887c0,-1.588 1.29,-2.878 2.878,-2.878c1.588,0 2.878,1.29 2.878,2.878Z" style={{ fill: "url(#float01_Linear3)" }} />
                    </g>
                </g>
            ),
            glowTip: (
                <g transform="matrix(0.83084,0,0,1,33.847181,-46.459845)">
                    <path d="M105.483,74.005l0,27.224c0,2.208 -2.157,4 -4.814,4c-2.657,0 -4.814,-1.792 -4.814,-4l0,-27.224c0,-2.208 2.157,-4 4.814,-4c2.657,0 4.814,1.792 4.814,4Z" style={{ fill: "#05df72" }} />
                </g>
            )
        }
    },
    {
        id: "float_02",
        name: "Red Dot Float",
        width: 230,
        height: 450,
        waterlineY: 250,
        scale: 0.9,
        glowColor: "#ff3636",
        components: {
            defs: (
                <>
                    <linearGradient id="float02_Linear1" x1="0" y1="0" x2="1" y2="0" gradientUnits="userSpaceOnUse" gradientTransform="matrix(0,142.636253,-17020.97099,0,231.849121,74.000417)">
                        <stop offset="0" style={{ stopColor: "#6b6b6b", stopOpacity: 1 }} />
                        <stop offset="1" style={{ stopColor: "#939393", stopOpacity: 0 }} />
                    </linearGradient>
                    <linearGradient id="float02_Linear2" x1="0" y1="0" x2="1" y2="0" gradientUnits="userSpaceOnUse" gradientTransform="matrix(0,79.140051,-79.140051,0,96.350092,218.288027)">
                        <stop offset="0" style={{ stopColor: "#f20d0d", stopOpacity: 1 }} />
                        <stop offset="1" style={{ stopColor: "#ff6161", stopOpacity: 1 }} />
                    </linearGradient>
                </>
            ),
            leg: (
                <g transform="matrix(0.589725,0,0,1.033575,-20.177334,259.929866)">
                    <rect x="231.849" y="28.677" width="3.391" height="177.073" style={{ fill: "url(#float02_Linear1)" }} />
                </g>
            ),
            antenna: (
                <g transform="matrix(0.589725,0,0,1.033575,-20.177334,-17.715577)">
                    <rect x="231.849" y="74" width="3.391" height="146.734" style={{ fill: "#7f8c84" }} />
                </g>
            ),
            body: (
                <g id="body-g">
                    <g transform="matrix(1,0,0,1,21.145601,-7.858053)">
                        <path d="M98.904,226.374c3.164,1.067 5.446,4.061 5.446,7.583l0,55.472c0,4.415 -3.585,8 -8,8c-4.415,0 -8,-3.585 -8,-8l0,-55.472c0,-3.562 2.334,-6.584 5.554,-7.619l0,-6.8c0,-0.69 0.56,-1.25 1.25,-1.25l2.5,0c0.69,0 1.25,0.56 1.25,1.25l0,6.835Z" style={{ fill: "url(#float02_Linear2)" }} />
                    </g>
                    <g transform="matrix(1,0,0,1.04,18.582615,-19.01258)">
                        <rect x="90.913" y="270.718" width="16" height="8.145" style={{ fill: "#024000", fillOpacity: 0.35 }} />
                    </g>
                    <g transform="matrix(1,0,0,1,32.21284,-8.214405)">
                        <path d="M86.03,235.913l0,28.887c0,1.588 -1.29,2.878 -2.878,2.878c-1.588,0 -2.878,-1.29 -2.878,-2.878l0,-28.887c0,-1.588 1.29,-2.878 2.878,-2.878c1.588,0 2.878,1.29 2.878,2.878Z" style={{ fill: "#fe5b5b" }} />
                    </g>
                    <g id="circle3" transform="matrix(0.5,0,0,0.5,68.961715,98.126497)">
                        <circle cx="97.068" cy="85.163" r="8" style={{ fill: "#f20e0e" }} />
                    </g>
                    <g id="circle2" transform="matrix(0.5,0,0,0.5,68.961715,68.126497)">
                        <circle cx="97.068" cy="85.163" r="8" style={{ fill: "#ffef36" }} />
                    </g>
                    <g id="circle1" transform="matrix(0.5,0,0,0.5,68.961715,38.126497)">
                        <circle cx="97.068" cy="85.163" r="8" style={{ fill: "#36ff40" }} />
                    </g>
                </g>
            ),
            glowTip: (
                <g transform="matrix(0.83084,0,0,1,33.847181,-46.459845)">
                    <path d="M105.483,74.005l0,27.224c0,2.208 -2.157,4 -4.814,4c-2.657,0 -4.814,-1.792 -4.814,-4l0,-27.224c0,-2.208 2.157,-4 4.814,-4c2.657,0 4.814,1.792 4.814,4Z" style={{ fill: "#ff3636" }} />
                </g>
            )
        }
    },
    {
        id: "float_03",
        name: "Slim Float",
        width: 21,
        height: 450,
        waterlineY: 250, // Estimate based on visual center of body
        scale: 0.9,
        glowColor: "#e8f442",
        components: {
            defs: (
                <>
                    <linearGradient id="float03_Linear1" x1="0" y1="0" x2="1" y2="0" gradientUnits="userSpaceOnUse" gradientTransform="matrix(0,142.636253,-17020.97099,0,231.849121,74.000417)">
                        <stop offset="0" style={{ stopColor: "#6b6b6b", stopOpacity: 1 }} />
                        <stop offset="1" style={{ stopColor: "#939393", stopOpacity: 0 }} />
                    </linearGradient>
                    <linearGradient id="float03_Linear2" x1="0" y1="0" x2="1" y2="0" gradientUnits="userSpaceOnUse" gradientTransform="matrix(0.043667,-62.743392,825.63654,0.119304,157.860101,308.391885)">
                        <stop offset="0" style={{ stopColor: "#000", stopOpacity: 1 }} />
                        <stop offset="0.13" style={{ stopColor: "#000", stopOpacity: 1 }} />
                        <stop offset="0.5" style={{ stopColor: "#00e96e", stopOpacity: 1 }} />
                        <stop offset="0.88" style={{ stopColor: "#000", stopOpacity: 1 }} />
                        <stop offset="1" style={{ stopColor: "#000", stopOpacity: 1 }} />
                    </linearGradient>
                    <radialGradient id="float03_Radial4" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(16,0,0,16,89.067954,85.162925)">
                        <stop offset="0" style={{ stopColor: "#06ff7c", stopOpacity: 1 }} />
                        <stop offset="0.35" style={{ stopColor: "#04ea71", stopOpacity: 1 }} />
                        <stop offset="0.72" style={{ stopColor: "#00b254", stopOpacity: 1 }} />
                        <stop offset="0.87" style={{ stopColor: "#1ae97c", stopOpacity: 1 }} />
                        <stop offset="1" style={{ stopColor: "#25ff8c", stopOpacity: 1 }} />
                    </radialGradient>
                    <linearGradient id="float03_Linear5" x1="0" y1="0" x2="1" y2="0" gradientUnits="userSpaceOnUse" gradientTransform="matrix(0,35.224395,-331.861616,0,100.769853,70.004879)">
                        <stop offset="0" style={{ stopColor: "#d2dc37", stopOpacity: 1 }} />
                        <stop offset="1" style={{ stopColor: "#edfa45", stopOpacity: 1 }} />
                    </linearGradient>
                    <linearGradient id="float03_Linear6" x1="0" y1="0" x2="1" y2="0" gradientUnits="userSpaceOnUse" gradientTransform="matrix(8,0,0,10.042397,140.882162,56.708129)">
                        <stop offset="0" style={{ stopColor: "#000", stopOpacity: 1 }} />
                        <stop offset="1" style={{ stopColor: "#7a7a7a", stopOpacity: 1 }} />
                    </linearGradient>
                    <linearGradient id="float03_Linear7" x1="0" y1="0" x2="1" y2="0" gradientUnits="userSpaceOnUse" gradientTransform="matrix(8,0,0,10.042397,140.882162,56.708129)">
                        <stop offset="0" style={{ stopColor: "#000", stopOpacity: 1 }} />
                        <stop offset="1" style={{ stopColor: "#808080", stopOpacity: 1 }} />
                    </linearGradient>
                </>
            ),
            leg: (
                <g transform="matrix(1,0,0,1,-134.863033,-24)">
                    <g transform="matrix(1,0,0,1,27.38647,0.454966)">
                        <g id="leg" transform="matrix(0.589725,0,0,1.033575,-20.177334,259.929866)">
                            <rect x="231.849" y="28.677" width="3.391" height="177.073" style={{ fill: "url(#float03_Linear1)" }} />
                        </g>
                    </g>
                </g>
            ),
            antenna: (
                <g transform="matrix(1,0,0,1,-134.863033,-24)">
                    <g transform="matrix(1,0,0,1,27.38647,0.454966)">
                        <g id="antenna" transform="matrix(0.589725,0,0,1.033575,-20.177334,-17.715577)">
                            <rect x="231.849" y="74" width="3.391" height="146.734" style={{ fill: "#7f8c84" }} />
                        </g>
                        <g id="circle3" transform="matrix(0.375,0,0,0.375,81.09521,102.771862)">
                            <circle cx="97.068" cy="85.163" r="8" style={{ fill: "#e8f442" }} />
                        </g>
                        <g id="circle2" transform="matrix(0.5,0,0,0.5,68.961715,68.126497)">
                            <circle cx="97.068" cy="85.163" r="8" style={{ fill: "url(#float03_Radial4)" }} />
                        </g>
                        <g id="circle1" transform="matrix(0.375,0,0,0.375,81.09521,55.771862)">
                            <circle cx="97.068" cy="85.163" r="8" style={{ fill: "#e8f442" }} />
                        </g>
                        <g id="highlight" transform="matrix(0.214251,0,0,0.914832,95.949917,-37.497652)">
                            <path d="M105.483,71.132l0,32.969c0,0.622 -2.157,1.128 -4.814,1.128c-2.657,0 -4.814,-0.505 -4.814,-1.128l0,-32.969c0,-0.622 2.157,-1.128 4.814,-1.128c2.657,0 4.814,0.505 4.814,1.128Z" style={{ fill: "#fbffcb" }} />
                        </g>
                    </g>
                </g>
            ),
            body: (
                <g transform="matrix(1,0,0,1,-134.863033,-24)">
                    <g transform="matrix(1,0,0,1,27.38647,0.454966)">
                        <g id="body-g" transform="matrix(1.109718,0,0,1.708276,-12.897306,-181.847529)">
                            <g id="float-body" transform="matrix(0.649891,0,0,0.926527,14.929552,-2.68908)">
                                <path d="M155.119,246.723c0.227,-0.62 1.405,-1.075 2.785,-1.075c1.38,0 2.558,0.455 2.785,1.075c4.075,11.133 11.182,30.551 11.182,30.551c0,0 -6.861,18.744 -10.965,29.958c-0.245,0.669 -1.514,1.159 -3.002,1.159c-1.488,0 -2.757,-0.49 -3.002,-1.159c-4.105,-11.215 -10.965,-29.958 -10.965,-29.958c0,0 7.108,-19.419 11.182,-30.551Z" style={{ fill: "url(#float03_Linear2)" }} />
                            </g>
                            <g id="body-bar" transform="matrix(0.708702,0,0,1,58.619929,1.929276)">
                                <path d="M86.03,234.857l0,30.998c0,1.006 -1.29,1.822 -2.878,1.822c-1.588,0 -2.878,-0.817 -2.878,-1.822l0,-30.998c0,-1.006 1.29,-1.822 2.878,-1.822c1.588,0 2.878,0.817 2.878,1.822Z" style={{ fill: "#30ff91" }} />
                            </g>
                        </g>
                        <g id="holder" transform="matrix(1,0,0,1,0,3)">
                            <g id="a1" transform="matrix(1,0,0,1,-27.38647,-0.454966)">
                                <path d="M148.882,53.687l0,6.042c0,1.104 -0.896,2 -2,2l-4,0c-1.104,0 -2,-0.896 -2,-2l0,-6.042c0,-1.104 0.896,-2 2,-2l4,0c1.104,0 2,0.896 2,2Z" />
                            </g>
                            <g id="a2" transform="matrix(0.5,0,0,0.945679,45.054611,2.898239)">
                                <path d="M148.882,52.744l0,7.928c0,0.584 -0.896,1.057 -2,1.057l-4,0c-1.104,0 -2,-0.474 -2,-1.057l0,-7.928c0,-0.584 0.896,-1.057 2,-1.057l4,0c1.104,0 2,0.474 2,1.057Z" style={{ fill: "url(#float03_Linear6)" }} />
                            </g>
                            <g id="dark-line" transform="matrix(0.5,0,0,2.072971,45.054611,-61.496094)">
                                <rect x="140.882" y="59.224" width="8" height="0.699" />
                            </g>
                            <g id="down-g" transform="matrix(0.568492,0,0,0.568492,50.700381,31.276916)">
                                <g id="b1" transform="matrix(1,0,0,1,-27.38647,-0.454966)">
                                    <path d="M148.882,53.687l0,6.042c0,1.104 -0.896,2 -2,2l-4,0c-1.104,0 -2,-0.896 -2,-2l0,-6.042c0,-1.104 0.896,-2 2,-2l4,0c1.104,0 2,0.896 2,2Z" />
                                </g>
                                <g id="b2" transform="matrix(0.5,0,0,1,45.054611,-0.454966)">
                                    <path d="M148.882,52.687l0,8.042c0,0.552 -0.896,1 -2,1l-4,0c-1.104,0 -2,-0.448 -2,-1l0,-8.042c0,-0.552 0.896,-1 2,-1l4,0c1.104,0 2,0.448 2,1Z" style={{ fill: "url(#float03_Linear7)" }} />
                                </g>
                            </g>
                        </g>
                    </g>
                </g>
            ),
            glowTip: (
                <g transform="matrix(1,0,0,1,-134.863033,-24)">
                    <g transform="matrix(1,0,0,1,27.38647,0.454966)">
                        <g id="glow-tip" transform="matrix(0.62313,0,0,1,54.757099,-46.459845)">
                            <path d="M105.483,73.005l0,29.224c0,1.656 -2.157,3 -4.814,3c-2.657,0 -4.814,-1.344 -4.814,-3l0,-29.224c0,-1.656 2.157,-3 4.814,-3c2.657,0 4.814,1.344 4.814,3Z" style={{ fill: "url(#float03_Linear5)" }} />
                        </g>
                    </g>
                </g>
            )
        }
    }
];
