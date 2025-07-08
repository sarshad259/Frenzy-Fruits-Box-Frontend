import frenzyLogo from "@/assets/frenzy-logo.png";

function Loader({ className = "", size = 120 }) {
  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center w-full h-full ${className}`}
      aria-busy="true"
      aria-live="polite"
      role="status"
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[6px]" />
      {/* Glassmorphism Card */}
      <div className="relative flex flex-col items-center justify-center z-10">
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
          {/* Glass card */}
          <div className="absolute inset-0 rounded-3xl bg-white/10 border border-white/30 shadow-2xl backdrop-blur-[10px]" style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)' }} />
          {/* Animated Gradient Spinner (full circle) */}
          <svg
            className="animate-spin-slow absolute inset-0 drop-shadow-xl"
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ zIndex: 2 }}
          >
            <defs>
              <linearGradient id="loader-gradient-anim" x1="0" y1="0" x2={size} y2={size}>
                <stop offset="0%" stopColor="#fbbf24">
                  <animate attributeName="stop-color" values="#fbbf24;#34d399;#60a5fa;#f472b6;#fbbf24" dur="2s" repeatCount="indefinite" />
                </stop>
                <stop offset="100%" stopColor="#f472b6">
                  <animate attributeName="stop-color" values="#f472b6;#fbbf24;#34d399;#60a5fa;#f472b6" dur="2s" repeatCount="indefinite" />
                </stop>
              </linearGradient>
            </defs>
            <circle
              cx={size / 2}
              cy={size / 2}
              r={size / 2 - 10}
              stroke="#fff"
              strokeWidth="10"
              opacity="0.12"
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={size / 2 - 10}
              stroke="url(#loader-gradient-anim)"
              strokeWidth="10"
              strokeLinecap="round"
              className="animate-spin-loader"
              style={{ filter: 'drop-shadow(0 0 16px #fbbf24)' }}
            />
          </svg>
          {/* Sparkles/Particles */}
          <div className="absolute inset-0 pointer-events-none z-10">
            {/* 3 sparkles, animated */}
            <span className="absolute left-2 top-6 w-2 h-2 bg-yellow-300 rounded-full opacity-80 animate-ping" style={{ animationDelay: '0.2s' }} />
            <span className="absolute right-4 bottom-8 w-1.5 h-1.5 bg-pink-400 rounded-full opacity-70 animate-ping" style={{ animationDelay: '0.6s' }} />
            <span className="absolute left-10 bottom-2 w-1.5 h-1.5 bg-blue-400 rounded-full opacity-70 animate-ping" style={{ animationDelay: '1s' }} />
          </div>
          {/* Logo with pulse/scale animation */}
          <img
            src={frenzyLogo}
            alt="Frenzy Fruits Logo"
            className="w-20 h-20 object-contain z-20 rounded-full bg-white/80 p-2 shadow-2xl border-2 border-yellow-300 animate-logo-pulse"
            style={{ left: size / 2 - 40, top: size / 2 - 40 }}
          />
        </div>
        {/* Animated Loading Text */}
        <div className="mt-8 text-2xl font-extrabold tracking-wide flex items-center gap-2 animate-fade-in-up text-white drop-shadow-lg" style={{ fontFamily: 'Poppins, Inter, sans-serif', textShadow: '0 2px 16px #fbbf24, 0 1px 2px #000' }}>
          <span className="animate-pulse">Loading</span>
          <span className="animate-bounce text-yellow-300">.</span>
          <span className="animate-bounce text-yellow-300 delay-150">.</span>
          <span className="animate-bounce text-yellow-300 delay-300">.</span>
        </div>
      </div>
    </div>
  );
}

export { Loader };

// Add this to your global CSS if not present:
// @keyframes logo-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.08); } }
// .animate-logo-pulse { animation: logo-pulse 1.6s infinite cubic-bezier(0.4,0,0.2,1); }

// Tailwind custom animation (add to your global CSS if not present):
// @keyframes spin-loader { 100% { transform: rotate(360deg); } }
// .animate-spin-loader { animation: spin-loader 1.2s linear infinite; }
// .animate-spin-slow { animation: spin 2s linear infinite; } 