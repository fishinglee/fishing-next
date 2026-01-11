export function Background() {
    return (
        <div className="absolute inset-0 z-0 bg-slate-900 pointer-events-none">
            <div
                className="absolute inset-0 bg-cover bg-center opacity-10 mix-blend-overlay"
                style={{
                    backgroundImage:
                        "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBvtgz8ptLlu3JI5TjyIgSfZk-ZVXf7z6elAV_SVFdmm26ab6CRRDU5wUvalUmr8E01PQjx7QrCVguVc7SFuGMqwagdIckdE83sD7bg3xGQAnACAYwxcyXt-3c0XIxbxUKe_FwS9up-O1gALUkyiUBXgJb9dqXCKZJCn-BQ6zC7eZSu6DdDzd5np9hOXY8qiwlWtmoLtFA0yZv4MgbrpfZCgoadx5yGKyaqw5A8MbvEw9OE2mFiOBmizHBnvdSaqU1IyYUxlTiLWthG')",
                }}
            ></div>
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 w-full h-[70%] vector-sky">
                    <div className="absolute top-10 left-8 w-0.5 h-0.5 bg-white rounded-full opacity-60"></div>
                    <div className="absolute top-20 right-12 w-0.5 h-0.5 bg-white rounded-full opacity-40"></div>
                    <div className="absolute top-32 left-1/3 w-1 h-1 bg-white rounded-full opacity-70"></div>
                    <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-[-20%] w-[80%] h-32 bg-slate-800/80 rounded-tr-[100%] rounded-tl-[50%]"></div>
                    <div className="absolute bottom-0 right-[-10%] w-[90%] h-24 bg-slate-700/80 rounded-tl-[120%] rounded-tr-[20%]"></div>
                </div>
                <div className="absolute bottom-0 w-full h-[30%] vector-water">
                    <div className="absolute top-0 w-full h-[1px] bg-white/10"></div>
                    <div className="absolute left-1/2 -translate-x-1/2 top-0 w-32 h-full bg-primary/5 blur-xl"></div>
                </div>
                <div className="absolute bottom-[30%] left-[-10px] opacity-30 text-slate-900">
                    <svg
                        fill="currentColor"
                        height="120"
                        viewBox="0 0 100 120"
                        width="100"
                    >
                        <path d="M20 120 C20 80 40 40 30 10 L32 10 C42 40 22 80 22 120 Z"></path>
                        <path d="M45 120 C45 70 60 30 50 5 L52 5 C62 30 47 70 47 120 Z"></path>
                        <path d="M70 120 C70 85 85 45 75 25 L77 25 C87 45 72 85 72 120 Z"></path>
                    </svg>
                </div>
            </div>
        </div>
    );
}
