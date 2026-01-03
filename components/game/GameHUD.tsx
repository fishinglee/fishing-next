"use client";

import { cn } from "@/lib/utils";

import { GameStatus } from "@/lib/constants";

interface GameHUDProps {
    gameStatus: GameStatus;
    onHookClick: () => void;
    onDebugInput: (val: number) => void;
}

export function GameHUD({ gameStatus, onHookClick, onDebugInput }: GameHUDProps) {
    const isCastMode = gameStatus === 'READY' || gameStatus === 'HIT' || gameStatus === 'MISS' || gameStatus === 'BROKEN';

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
            <div className="absolute top-[65%] left-1/2 -translate-x-1/2">
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
                <div className="flex justify-between items-center px-2">
                    <div className="flex flex-col gap-2">
                        <button className="glass-modern flex items-center gap-3 pl-2 pr-4 py-2 rounded-2xl hover:bg-white/5 active:scale-95 transition-all group border border-white/10">
                            <div className="bg-gradient-to-br from-amber-300 to-orange-500 rounded-xl p-1.5 text-black shadow-inner">
                                <span className="material-symbols-outlined text-[18px]">
                                    lunch_dining
                                </span>
                            </div>
                            <div className="flex flex-col items-start">
                                <span className="text-xs font-bold text-white group-hover:text-primary transition-colors">
                                    Tackle Box
                                </span>
                                <span className="text-[10px] text-white/50">24 Qty</span>
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
                    <button className="flex flex-col items-center justify-center size-14 rounded-2xl glass-modern text-white/60 hover:text-white hover:bg-white/10 active:scale-95 transition-all border border-white/5">
                        <span className="material-symbols-outlined text-[24px]">
                            backpack
                        </span>
                        <span className="text-[10px] font-bold mt-1">Bag</span>
                    </button>
                    <button
                        onClick={onHookClick}
                        className={cn(
                            "relative group flex items-center justify-center size-24 rounded-full transition-all duration-200 border-4 border-white/10 z-20 cursor-pointer active:scale-95 active:shadow-none",
                            buttonGradient
                        )}
                    >
                        <div className="absolute inset-1 rounded-full border border-white/20"></div>
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
                    <button className="flex flex-col items-center justify-center size-14 rounded-2xl glass-modern text-white/60 hover:text-white hover:bg-white/10 active:scale-95 transition-all border border-white/5">
                        <span className="material-symbols-outlined text-[24px]">map</span>
                        <span className="text-[10px] font-bold mt-1">Map</span>
                    </button>
                </div>
            </div>

            {/* Debug Input */}
            <div className="absolute bottom-11 left-6 z-50">
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
