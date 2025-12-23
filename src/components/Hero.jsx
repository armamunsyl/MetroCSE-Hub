const stats = [
  { key: 'questions', value: '1,250+', label: 'Total Questions', icon: 'Q', tone: 'stat-blue' },
  { key: 'batches', value: '18', label: 'Total Batches', icon: 'B', tone: 'stat-green' },
  { key: 'contributors', value: '60+', label: 'Contributors', icon: 'C', tone: 'stat-amber' },
]

const toneClasses = {
  'stat-blue': 'bg-white/25',
  'stat-green': 'bg-[rgba(217,255,237,0.3)]',
  'stat-amber': 'bg-[rgba(255,237,204,0.3)]',
}

function Hero() {
  return (
    <section
      className="grid items-center gap-8 lg:grid-cols-2 animate-fade-up"
      style={{ animationDelay: '0.12s' }}
    >
      <div className="sm:rounded-[28px] sm:bg-[#f0f4ff] sm:p-1 sm:shadow-[0_18px_40px_rgba(45,60,120,0.12)]">
        <div className="overflow-hidden rounded-[22px] sm:hidden">
          <div className="flex w-[200%] animate-slide-loop">
            {[{ src: '/hero.png', alt: 'MetroCSE banner one' }, { src: '/hero1.png', alt: 'MetroCSE banner two' }].map(
              (item) => (
                <div key={item.src} className="w-1/2">
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="h-[220px] w-full rounded-2xl object-contain"
                  />
                </div>
              ),
            )}
          </div>
        </div>
        <svg
          viewBox="0 0 520 360"
          role="img"
          aria-label="Students studying in library"
          className="hidden sm:block"
        >
          <defs>
            <linearGradient id="hero-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#b7d4ff" />
              <stop offset="100%" stopColor="#d8c7ff" />
            </linearGradient>
          </defs>
          <rect width="520" height="360" rx="48" fill="url(#hero-grad)" opacity="0.35" />
          <rect x="40" y="70" width="200" height="170" rx="16" fill="#3f6ed8" />
          <rect x="60" y="90" width="160" height="18" rx="8" fill="#d7e6ff" />
          <rect x="60" y="120" width="150" height="18" rx="8" fill="#d7e6ff" />
          <rect x="60" y="150" width="165" height="18" rx="8" fill="#d7e6ff" />
          <rect x="60" y="180" width="120" height="18" rx="8" fill="#d7e6ff" />
          <rect x="270" y="85" width="170" height="15" rx="7" fill="#b8c9ff" />
          <rect x="270" y="110" width="120" height="15" rx="7" fill="#b8c9ff" />
          <rect x="270" y="135" width="150" height="15" rx="7" fill="#b8c9ff" />
          <circle cx="410" cy="60" r="28" fill="#8aa9ff" />
          <circle cx="410" cy="60" r="18" fill="#f5f8ff" />
          <rect x="85" y="235" width="110" height="60" rx="24" fill="#f06c7e" />
          <rect x="200" y="230" width="130" height="70" rx="28" fill="#ff7b87" />
          <circle cx="115" cy="230" r="14" fill="#ffc0a5" />
          <circle cx="245" cy="230" r="14" fill="#ffd4b5" />
          <rect x="105" y="245" width="24" height="34" rx="6" fill="#2b3b5a" />
          <rect x="235" y="245" width="24" height="34" rx="6" fill="#2b3b5a" />
          <rect x="260" y="252" width="36" height="24" rx="4" fill="#ffd66b" />
          <rect x="120" y="252" width="30" height="20" rx="4" fill="#7db4ff" />
        </svg>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#5a6ac9]">
          MetroCSE Question Bank
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-[#1f2a63] md:text-4xl">
          MetroCSE Question Bank
        </h1>
        <p className="mt-3 max-w-[480px] text-base text-[#45508f]">
          Previous year final &amp; class test questions for MU CSE students
        </p>
        <div className="mt-6 flex items-center justify-between gap-3 rounded-[18px] bg-gradient-to-r from-[#6ea0ff] to-[#8c63ff] p-4 text-white shadow-[0_15px_30px_rgba(72,88,199,0.25)]">
          {stats.map((stat) => (
            <div key={stat.key} className="flex-1 text-center">
              <div className="text-base font-semibold">{stat.value}</div>
              <div className="mt-1 text-[11px] opacity-80">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Hero
