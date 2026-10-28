import { useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionTemplate, useMotionValueEvent, useScroll, useTransform } from 'framer-motion'
import '../styles/evening.css'

const events = [
  { t: [7, 0], title: 'The queue spills onto the road.', text: 'Scooters park on the footpath, cars slow down to look, and a traffic constable is pulled off his post to manage it.' },
  { t: [7, 45], title: 'A woman steps into the road to get past.', text: 'Nothing happened. Walking past that crowd after dark just doesn’t feel safe. Every night, the same detour.' },
  { t: [8, 30], title: 'A 17-year-old hands cash to a stranger.', text: <><span className="quote">“भैया, एक ले आना।”</span> Nobody at a busy counter is checking age, and nothing is written down.</> },
  { t: [9, 15], title: 'An argument over parking turns into a shove.', text: 'A bottle has already been opened in a parked car. Voices go up. Someone calls the police — a normal weeknight.' },
  { t: [10, 40], title: 'The last-hour rush.', text: 'Cash changes hands fast, no bill is asked for. Some of what’s sold may never have paid duty at all.' },
  { t: [11, 5], title: 'He drives home.', text: 'Drunk driving appears every year among the causes of road deaths in the Ministry of Road Transport’s accident reports. Every trip that never happens is one less risk on the road.', final: true },
]
const STEPS = events.length
const mins = events.map((e) => e.t[0] * 60 + e.t[1]).concat(11 * 60 + 10)

// Feet positions of people in the crowd; later entries spill into the road.
const crowd = [
  [470, 412], [505, 415], [540, 410], [575, 414], [610, 411], [645, 416], [680, 412], [455, 438],
  [520, 444], [590, 440], [660, 446], [722, 436], [490, 474], [560, 480], [630, 470], [700, 478], [770, 462], [418, 466],
]
const crowdByStep = [7, 10, 12, 13, 18, 4]

// Windows in the skyline behind the shop: [x, y]
const windows = []
for (let b = 0; b < 9; b++) for (let r = 0; r < 4; r++) for (let c = 0; c < 2; c++) windows.push([b * 160 + 20 + c * 34 + (b % 2) * 10, 150 + r * 46 + (b % 3) * 12])
const litByStep = [10, 18, 26, 34, 40, 14]

function Person({ x, y, fill = '#0c0b0a', teen, woman, className }) {
  const s = (teen ? 0.78 : 1) * (0.92 + (y - 410) / 260)
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} className={className}>
      <circle cx="0" cy="-60" r="9.5" fill={fill} />
      {woman
        ? <path d="M-11 -48 Q0 -52 11 -48 L19 0 L-19 0 Z" fill={fill} />
        : <path d="M-13 -48 Q0 -52 13 -48 L15 -16 L8 -16 L7 0 L-7 0 L-8 -16 L-15 -16 Z" fill={fill} />}
    </g>
  )
}

function Scooter({ x }) {
  return (
    <g transform={`translate(${x} 412)`} fill="#151312">
      <circle cx="-22" cy="-10" r="10" /><circle cx="24" cy="-10" r="10" />
      <path d="M-30 -14 Q-28 -34 -8 -34 L10 -34 L18 -52 L26 -52 L22 -34 Q34 -30 34 -14 Z" />
    </g>
  )
}

function Car({ step }) {
  const leaving = step === 5
  return (
    <motion.g initial={false} animate={{ x: leaving ? 760 : 0 }} transition={{ duration: leaving ? 3.2 : 0.6, delay: leaving ? 0.9 : 0, ease: 'easeIn' }}>
      <g transform="translate(1000 436)">
        <motion.polygon points="216,30 560,-10 560,84" fill="url(#beam)" initial={false} animate={{ opacity: leaving ? 1 : 0 }} transition={{ duration: 0.2, delay: leaving ? 0.4 : 0 }} />
        <path d="M0 40 L12 18 Q24 0 54 0 L130 0 Q150 0 166 18 L208 24 Q220 27 220 40 L220 54 L0 54 Z" fill="#36343f" stroke="#ff8a1e" strokeOpacity=".35" strokeWidth="1.5" />
        <path d="M30 18 L48 5 L96 5 L96 18 Z M104 5 L132 5 Q144 6 154 18 L104 18 Z" fill="#5a5670" />
        <circle cx="48" cy="56" r="15" fill="#0b0a0d" /><circle cx="174" cy="56" r="15" fill="#0b0a0d" />
        <motion.rect x="212" y="30" width="8" height="8" rx="2" fill="#fff6c8" initial={false} animate={{ opacity: leaving ? 1 : 0.15 }} />
        <motion.rect x="0" y="30" width="6" height="9" rx="2" fill="#ff2d2d" initial={false} animate={{ opacity: leaving ? 1 : 0.3 }} />
      </g>
    </motion.g>
  )
}

function Scene({ step, glow, moonY }) {
  const shown = crowdByStep[step]
  const lit = litByStep[step]
  return (
    <svg viewBox="0 0 1440 560" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <defs>
        <linearGradient id="shopLight" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffe3a3" /><stop offset="1" stopColor="#ff9d3c" /></linearGradient>
        <radialGradient id="spill" cx=".5" cy="0" r="1"><stop offset="0" stopColor="#ffb35c" stopOpacity=".45" /><stop offset="1" stopColor="#ffb35c" stopOpacity="0" /></radialGradient>
        <radialGradient id="lamp" cx=".5" cy="0" r="1"><stop offset="0" stopColor="#ff8a1e" stopOpacity=".55" /><stop offset="1" stopColor="#ff8a1e" stopOpacity="0" /></radialGradient>
        <linearGradient id="beam" x1="0" x2="1"><stop offset="0" stopColor="#fff6c8" stopOpacity=".7" /><stop offset="1" stopColor="#fff6c8" stopOpacity="0" /></linearGradient>
      </defs>

      {/* moon */}
      <motion.circle cx="1250" r="26" fill="#f3ead2" cy={moonY} />

      {/* skyline */}
      <path d="M0 402 V170 H130 V140 H170 V200 H300 V120 H350 V180 H470 V150 H620 V190 H760 V110 H820 V160 H960 V130 H1110 V180 H1250 V150 H1440 V402 Z" fill="#141219" />
      {windows.map(([x, y], k) => (
        <rect key={k} x={x} y={y} width="14" height="18" fill="#ffcf7a" opacity={(k * 7) % windows.length < lit ? 0.75 : 0.06} style={{ transition: 'opacity .8s' }} />
      ))}

      {/* footpath + road */}
      <rect x="0" y="400" width="1440" height="30" fill="#29241f" />
      <rect x="0" y="430" width="1440" height="130" fill="#17161a" />
      {Array.from({ length: 18 }, (_, k) => <rect key={k} x={k * 90 + 10} y="500" width="50" height="5" fill="#4a463f" />)}

      {/* the theka */}
      <rect x="380" y="170" width="380" height="232" fill="#2e2622" />
      <g className="sign-glow">
        <rect x="396" y="186" width="348" height="64" rx="4" fill="#b8231b" />
        <rect x="396" y="186" width="348" height="64" rx="4" fill="none" stroke="#ff6b52" strokeWidth="2" opacity=".7" />
        <text x="570" y="226" textAnchor="middle" fontFamily="'Tiro Devanagari Hindi', serif" fontSize="30" fill="#ffd34d">अंग्रेज़ी शराब ठेका</text>
        <text x="570" y="243" textAnchor="middle" fontFamily="'IBM Plex Mono', monospace" fontSize="10" fill="#ffd9c9" letterSpacing="3">LICENSED VEND</text>
      </g>
      <polygon points="430,400 710,400 900,560 240,560" fill="url(#spill)" />
      <rect x="430" y="268" width="280" height="132" fill="url(#shopLight)" />
      {[0, 1, 2].map((r) => <g key={r}>{Array.from({ length: 22 }, (_, c) => (
        <rect key={c} x={440 + c * 12} y={280 + r * 30} width="6" height={14 + (c % 3) * 3} fill={['#7a3b12', '#3d5a2a', '#5b2a1a'][(c + r) % 3]} opacity=".8" />
      ))}</g>)}
      {Array.from({ length: 29 }, (_, k) => <rect key={k} x={432 + k * 10} y="268" width="2.5" height="132" fill="#2a2420" />)}
      <rect x="430" y="358" width="280" height="8" fill="#2a2420" />
      <motion.rect x="430" y="268" width="280" fill="#3a332e" initial={false} animate={{ height: step === 5 ? 132 : 0 }} transition={{ duration: 1.4, delay: 0.2 }} />

      {/* street lamp */}
      <motion.polygon points="905,152 760,560 1080,560" fill="url(#lamp)" style={{ opacity: glow }} />
      <rect x="902" y="150" width="6" height="252" fill="#3a3733" />
      <path d="M905 152 Q905 132 930 132 L948 132" stroke="#3a3733" strokeWidth="5" fill="none" />
      <motion.ellipse cx="948" cy="138" rx="14" ry="6" fill="#ffb15c" style={{ opacity: glow }} />

      {/* parked scooters */}
      <Scooter x={150} /><Scooter x={232} /><Scooter x={310} />

      <Car step={step} />

      {/* crowd */}
      {crowd.map(([x, y], k) => (
        <motion.g key={k} initial={false} animate={{ opacity: k < shown ? 1 : 0, y: k < shown ? 0 : 10 }} transition={{ duration: 0.5, delay: (k % 5) * 0.06 }}>
          <g className="bob" style={{ animationDelay: `${(k % 6) * 0.3}s` }}>
            <Person x={x} y={y} />
          </g>
        </motion.g>
      ))}

      {/* 7:45 — a woman walks out into the road to avoid the crowd */}
      {step === 1 && (
        <motion.g initial={{ x: 0, opacity: 0 }} animate={{ x: -1250, opacity: [0, 1, 1, 1, 0] }} transition={{ duration: 7, ease: 'linear', repeat: Infinity }}>
          <motion.g animate={{ y: [0, 0, 70, 70, 0, 0] }} transition={{ duration: 7, ease: 'easeInOut', times: [0, 0.2, 0.35, 0.7, 0.85, 1], repeat: Infinity }}>
            <g className="bob"><Person x={1400} y={414} woman fill="#8a2e5c" /></g>
          </motion.g>
        </motion.g>
      )}

      {/* 8:30 — a teenager asks an adult to buy */}
      {step === 2 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Person x={850} y={440} teen fill="#0c0b0a" />
          <Person x={884} y={438} />
          <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4, type: 'spring' }} style={{ transformOrigin: '850px 360px' }}>
            <rect x="760" y="318" width="170" height="40" rx="20" fill="#f3eee4" />
            <polygon points="840,356 852,356 846,372" fill="#f3eee4" />
            <text x="845" y="345" textAnchor="middle" fontFamily="'Tiro Devanagari Hindi', serif" fontSize="18" fill="#1b1916">भैया, एक ले आना</text>
          </motion.g>
        </motion.g>
      )}

      {/* 9:15 — the shove, and the siren */}
      {step === 3 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <g className="shake"><Person x={950} y={478} /></g>
          <g className="shake" style={{ animationDelay: '.09s' }}><Person x={985} y={482} /></g>
          {[[925, 395, -20], [968, 386, 0], [1010, 395, 20]].map(([x, y, r], k) => (
            <motion.path key={k} d="M0 0 L0 -18" stroke="#ff3b30" strokeWidth="4" strokeLinecap="round" transform={`translate(${x} ${y}) rotate(${r})`}
              animate={{ opacity: [0, 1, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: k * 0.15 }} />
          ))}
          <rect x="1330" y="384" width="34" height="14" rx="4" className="siren" />
          <rect x="0" y="0" width="1440" height="560" className="siren" opacity=".06" />
        </motion.g>
      )}

      {/* 10:40 — cash, no bill */}
      {step === 4 && [470, 540, 610, 680].map((x, k) => (
        <motion.text key={x} x={x} y="350" fontFamily="'Anton', sans-serif" fontSize="28" fill="#7ee08a" textAnchor="middle"
          animate={{ y: [0, -110], opacity: [0, 1, 0] }} transition={{ duration: 2, repeat: Infinity, delay: k * 0.45 }}>₹</motion.text>
      ))}
    </svg>
  )
}

function formatTime(m) {
  const h = Math.floor(m / 60)
  const mm = String(Math.floor(m % 60)).padStart(2, '0')
  return [h, mm]
}

export default function Evening() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const [p, setP] = useState(0)
  useMotionValueEvent(scrollYProgress, 'change', setP)

  const step = Math.min(STEPS - 1, Math.floor(p * STEPS))
  const local = Math.min(1, p * STEPS - step)
  const [h, mm] = formatTime(mins[step] + local * (mins[step + 1] - mins[step]) * 0.98)
  const e = events[step]

  const top = useTransform(scrollYProgress, [0, 0.5, 1], ['#3b2a4a', '#120f22', '#050409'])
  const horizon = useTransform(scrollYProgress, [0, 0.5, 1], ['#d0703f', '#3a1f2a', '#0d0a10'])
  const sky = useMotionTemplate`linear-gradient(180deg, ${top} 0%, ${horizon} 75%)`
  const stars = useTransform(scrollYProgress, [0.15, 0.6], [0, 0.9])
  const glow = useTransform(scrollYProgress, [0, 0.35], [0.35, 1])
  const moonY = useTransform(scrollYProgress, [0, 1], [320, 70])

  return (
    <>
      <section className="evening" id="evening" ref={ref}>
        <div className="ev-stage">
          <motion.div className="ev-sky" style={{ background: sky }} />
          <motion.div className="ev-stars" style={{ opacity: stars }} />

          <div className="container ev-top">
            <div>
              <div className="ev-kicker">One evening outside <em>almost any</em> theka.</div>
              <div className="ev-note">A composite of what residents, shopkeepers and traffic police describe.</div>
              <AnimatePresence mode="wait">
                <motion.div key={step} className={`ev-event ${e.final ? 'final' : ''}`}
                  initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.4 }}>
                  <h3>{e.title}</h3>
                  <p>{e.text}</p>
                </motion.div>
              </AnimatePresence>
            </div>
            <div className={`ev-clock ${e.final ? 'final' : ''}`}>
              {h}<span className="colon">:</span>{mm}<small>PM</small>
            </div>
          </div>

          <div className="ev-scene"><Scene step={step} glow={glow} moonY={moonY} /></div>
          {e.final && <motion.div className="ev-red" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 1 }} />}

          <div className="ev-hint">{step < STEPS - 1 ? 'keep scrolling ↓' : ''}</div>
          <div className="ev-timeline">
            <div className="container">
              <div className="ev-track"><div className="ev-fill" style={{ width: `${p * 100}%` }} /></div>
              <div className="ev-ticks">
                {events.map((x, k) => (
                  <span key={k} className={`${k <= step ? 'on' : ''} ${x.final ? 'last' : ''}`}>{x.t[0]}:{String(x.t[1]).padStart(2, '0')} PM</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="evening-end">
        <div className="container">
          <p>More raids won’t fix this. It gets fixed when the buyer can <em>stay home.</em></p>
          <span>↓ HERE’S HOW</span>
        </div>
      </div>
    </>
  )
}
