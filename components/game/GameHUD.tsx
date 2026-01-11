"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { GameStatus } from "@/lib/constants";
import { FloatSystemHandle } from "./FloatSystem";
import { FLOATS } from "@/lib/floats";
import { DynamicFloat } from "./DynamicFloat";

interface GameHUDProps {
    gameStatus: GameStatus;
    onHookClick: () => void;
    onDebugInput: (val: number) => void;
    floatSystemRef?: React.RefObject<FloatSystemHandle | null>;
}

export function GameHUD({ gameStatus, onHookClick, onDebugInput, floatSystemRef }: GameHUDProps) {
    const isCastMode = gameStatus === 'READY' || gameStatus === 'HIT' || gameStatus === 'MISS' || gameStatus === 'BROKEN';
    const [showTackleBox, setShowTackleBox] = useState(false);
    const [selectedFloatIndex, setSelectedFloatIndex] = useState(0);

    // Status Text
    let statusText = "Ready to Cast";
    if (gameStatus === 'CASTING') statusText = "Casting...";
    if (gameStatus === 'FISHING') statusText = "Waiting for bite...";
    if (gameStatus === 'BITE') statusText = "BITE! HOOK NOW!";
    if (gameStatus === 'HIT') statusText = "Catch Success!";
    if (gameStatus === 'MISS') statusText = "Missed...";

    // Button Style
    const buttonGradient = isCastMode
        ? "bg-gradient-to-br from-cyan-400 to-blue-600 shadow-[0_8px_40px_rgba(34,211,238,0.3)]"
        : "btn-hook-gradient shadow-[0_8px_40px_rgba(34,197,94,0.3)]";

    const buttonIcon = isCastMode ? "waves" : "touch_app";
    const buttonLabel = isCastMode ? "CAST" : "HOOK";

    const handleFloatSelect = (index: number) => {
        setSelectedFloatIndex(index);
        floatSystemRef?.current?.changeFloat(index);
    };

    return (
        <>
            {/* Top Bar */}
            <div className="relative z-20 flex items-center justify-between p-4 pt-12">
                <div className="glass-modern flex items-center gap-3 px-3 py-1.5 rounded-full">
                    <div
                        className="size-8 rounded-full bg-cover bg-center border border-white/20"
                        style={{
                            backgroundImage:
                                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCjRlgZonxC2a5kEJlAwQm08e3lI-u47ZEO-nn9hc2PithaSR9Pec9RjwXq242A_GI6Y2rO4IFL36mTpQeSJ8zhdwa8mjVXkUDqEqTjQqVA45qdixL5ONFKr128BaqxTMj3EO6wkgms_PuIY5DJ7QHep4e6QoOhnusXfohlvJTAE8RnTcsgwDQivjvPghJY2Nt4I2Vs_upbNr_DATwkOXC-ywgD9cqa7W3IMrN-x_kFpINuumqnu-frdpkpfUZJrdy1PgDMIYsYLsw5')",
                        }}
                    ></div>
                    <div className="flex flex-col pr-2">
                        <span className="text-[10px] text-primary font-bold tracking-wider leading-none mb-1">
                            LV. 24
                        </span>
                        <span className="text-sm font-semibold leading-none text-white/90">
                            Angler Kim
                        </span>
                    </div>
                </div>
                <div className="glass-modern flex items-center gap-4 px-4 py-2 rounded-full h-10">
                    <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-primary text-[18px]">
                            phishing
                        </span>
                        <span className="text-sm font-bold tracking-wide">12</span>
                    </div>
                    <div className="w-px h-3 bg-white/10"></div>
                    <button className="material-symbols-outlined text-white/70 hover:text-white transition-colors text-[20px]">
                        settings
                    </button>
                </div>
            </div>

            {/* Main Content Spacer (Float area) */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center pb-20 w-full pointer-events-none">
                {/* Float is rendered by parent */}
            </div>

            {/* Status Badge */}
            <div className="absolute top-[67%] left-1/2 -translate-x-1/2 pointer-events-none">
                <div className="px-4 py-1.5 rounded-full glass-modern text-white/90 text-xs font-medium tracking-wide flex items-center gap-2 shadow-lg border border-primary/20">
                    <span className="relative flex h-2 w-2">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${gameStatus === 'BITE' ? 'bg-red-500' : 'bg-primary'}`}></span>
                        <span className={`relative inline-flex rounded-full h-2 w-2 ${gameStatus === 'BITE' ? 'bg-red-500' : 'bg-primary'}`}></span>
                    </span>
                    {statusText}
                </div>
            </div>

            {/* Controls */}
            <div className="relative z-30 w-full flex flex-col gap-6 pb-16 px-6">

                {/* Tackle Box Overlay */}
                {showTackleBox && (
                    <div className="absolute bottom-full left-6 mb-4 p-3 glass-modern rounded-2xl flex flex-col gap-3 min-w-[200px] border border-white/10 animate-in slide-in-from-bottom-2 fade-in duration-200 pointer-events-auto">
                        <div className="flex items-center justify-between pb-2 border-b border-white/5">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-[16px] text-primary">lunch_dining</span>
                                <span className="text-xs font-bold text-white/90">Select Float</span>
                            </div>
                            <button onClick={() => setShowTackleBox(false)} className="text-white/50 hover:text-white">
                                <span className="material-symbols-outlined text-[16px]">close</span>
                            </button>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            {FLOATS.map((float, idx) => (
                                <button
                                    key={float.id}
                                    onClick={() => handleFloatSelect(idx)}
                                    className={cn(
                                        "relative h-28 rounded-xl flex flex-col items-center justify-center gap-1 transition-all border overflow-hidden group/item",
                                        selectedFloatIndex === idx
                                            ? "bg-white/10 border-primary/50 shadow-[0_0_10px_rgba(74,222,128,0.2)]"
                                            : "bg-black/20 border-transparent hover:bg-white/5 hover:border-white/10"
                                    )}
                                >
                                    <div className="flex-1 flex items-center justify-center w-full pt-2">
                                        {/* Preview scaled down */}
                                        <div className="scale-[0.25] origin-center translate-y-4 group-hover/item:scale-[0.28] transition-transform">
                                            <DynamicFloat float={float} />
                                        </div>
                                    </div>
                                    <span className="text-[9px] text-white/70 font-medium truncate w-full text-center px-1 pb-2 uppercase tracking-wide">
                                        {float.name}
                                    </span>
                                    {selectedFloatIndex === idx && (
                                        <div className="absolute top-2 right-2 size-1.5 rounded-full bg-primary shadow-[0_0_5px_rgba(74,222,128,0.8)]"></div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                )}


                <div className="flex justify-between items-center px-2">
                    <div className="flex flex-col gap-2">
                        <button
                            onClick={() => setShowTackleBox(!showTackleBox)}
                            className={cn(
                                "glass-modern flex items-center gap-3 pl-2 pr-4 py-2 rounded-2xl hover:bg-white/5 active:scale-95 transition-all group border border-white/10 pointer-events-auto",
                                showTackleBox && "bg-white/10 border-white/20"
                            )}>
                            <div className="bg-gradient-to-br from-amber-300 to-orange-500 rounded-xl p-1.5 text-black shadow-inner">
                                <svg
                                    fill="currentColor"
                                    version="1.1"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20px"
                                    height="20px"
                                    viewBox="0 0 54.959 54.958"
                                >
                                    <g>
                                        <path d="M24.73,25.605c-0.276,0-0.5,0.225-0.5,0.5v5c0,0.275,0.224,0.5,0.5,0.5h5.5c0.275,0,0.5-0.225,0.5-0.5v-5
                                            c0-0.275-0.225-0.5-0.5-0.5H24.73z"/>
                                        <path d="M54.959,31.851v-6.246H33.68c0.023,0.165,0.051,0.329,0.051,0.5v5c0,1.931-1.57,3.5-3.5,3.5h-5.5
                                            c-1.93,0-3.5-1.569-3.5-3.5v-5c0-0.171,0.027-0.335,0.051-0.5H0v5.944v3.091v9.201v2.23c0,2.871,2.262,4.287,5.197,5.197
                                            c0,0,14.313,1.857,22.281,1.771c8.922-0.048,22.283-1.771,22.283-1.771c3.031-0.981,5.197-2.326,5.197-5.197V34.791l0,0
                                            L54.959,31.851L54.959,31.851z"/>
                                        <path d="M24.73,22.605h5.5h24.729v-6.675c0-2.87-2.352-4.347-5.197-5.197c0,0-4.949-0.691-10.775-1.241l-0.266-3.124
                                            c-0.043-2.463-2.058-4.453-4.531-4.453H20.77c-2.473,0-4.488,1.99-4.531,4.453l-0.271,3.124c-5.824,0.55-10.77,1.241-10.77,1.241
                                            c-2.906,0.887-5.197,2.327-5.197,5.197v1.793v4.882H24.73z M19.524,6.589l0.006-0.143c0-0.684,0.557-1.239,1.24-1.239h13.419
                                            c0.685,0,1.24,0.556,1.24,1.239l0.234,2.757c-2.844-0.221-5.717-0.375-8.186-0.375c-2.467,0-5.338,0.154-8.182,0.375L19.524,6.589
                                            z"/>
                                    </g>
                                </svg>
                            </div>
                            <div className="flex flex-col items-start">
                                <span className="text-xs font-bold text-white group-hover:text-primary transition-colors">
                                    Tackle Box
                                </span>
                                <span className="text-[10px] text-white/50">{FLOATS.length} Items</span>
                            </div>
                        </button>
                    </div>
                    <div className="flex flex-col gap-1.5 w-32 items-end">
                        <span className="text-[10px] text-white/50 font-bold uppercase tracking-widest">
                            Line Tension
                        </span>
                        <div className="h-2 w-full bg-slate-800/80 rounded-full overflow-hidden border border-white/5">
                            <div className="h-full bg-gradient-to-r from-primary to-primary-dark w-[30%] shadow-[0_0_8px_rgba(74,222,128,0.6)] rounded-full relative">
                                <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/50"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-between gap-4">
                    <button className="flex flex-col items-center justify-center size-14 rounded-2xl glass-modern text-white/60 hover:text-white hover:bg-white/10 active:scale-95 transition-all border border-white/5 pointer-events-auto">
                        <span className="material-symbols-outlined text-[24px]">
                            backpack
                        </span>
                        <span className="text-[10px] font-bold mt-1">Bag</span>
                    </button>
                    <button
                        onClick={onHookClick}
                        className={cn(
                            "relative group flex items-center justify-center size-24 rounded-full transition-all duration-200 z-20 cursor-pointer active:scale-95 active:shadow-none pointer-events-auto",
                            buttonGradient
                        )}
                    >
                        {/* Removed inner border div */}
                        <div className="flex flex-col items-center z-10 -mt-1">
                            <span className="material-symbols-outlined text-white text-[40px] drop-shadow-md group-active:scale-90 transition-transform">
                                {buttonIcon}
                            </span>
                            <span className="text-[11px] font-black uppercase tracking-widest text-white/90 drop-shadow mt-1">
                                {buttonLabel}
                            </span>
                        </div>
                        <div className="absolute top-0 inset-x-0 h-[45%] bg-gradient-to-b from-white/20 to-transparent rounded-t-full pointer-events-none"></div>
                        <div className="absolute inset-0 rounded-full bg-white opacity-0 group-active:animate-ping"></div>
                    </button>
                    <button className="flex flex-col items-center justify-center size-14 rounded-2xl glass-modern text-white/60 hover:text-white hover:bg-white/10 active:scale-95 transition-all border border-white/5 pointer-events-auto">
                        <span className="material-symbols-outlined text-[24px]">map</span>
                        <span className="text-[10px] font-bold mt-1">Map</span>
                    </button>
                </div>
            </div>

            {/* Debug Input */}
            <div className="absolute bottom-11 left-6 z-50 pointer-events-auto">
                <input
                    type="number"
                    placeholder="Test # (1-10)"
                    min="1"
                    max="10"
                    className="w-28 px-3 py-1.5 rounded-lg glass-modern text-xs text-white placeholder-white/50 outline-none focus:border-primary/50 transition-colors"
                    onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (!isNaN(val)) onDebugInput(val);
                    }}
                />
            </div>
        </>
    );
}
