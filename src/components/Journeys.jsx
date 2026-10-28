import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, animate, motion, useInView, useMotionValue, useMotionValueEvent } from 'framer-motion'
import { Pause, Play, RotateCcw } from 'lucide-react'
import { BRAND } from '../config'
import '../styles/journeys.css'

const HOME = [60, 240]
const SHOP = [330, 60]
const DURATION = 11 // seconds for a full play-through
const TOTAL_MIN = 95 // minutes the "today" journey takes

// Piecewise-linear map from global progress to a fraction of the route; flat pieces are waits.
const lerpMap = (p, stops) => {
  for (let i = 1; i < stops.length; i++) {
    const [p0, f0] = stops[i - 1]
    const [p1, f1] = stops[i]
    if (p <= p1) return f0 + (f1 - f0) * ((p - p0) / (p1 - p0 || 1))
  }
  return stops[stops.length - 1][1]
}

const journeys = {
  today: {
    cls: 'red', n: '1', title: 'Today', sub: 'the buyer goes to the shop',
    route: 'M60 240 L150 240 L150 150 L250 150 L250 60 L330 60 L330 150 L250 150 L250 240 L60 240',
    // reach shop, queue, drive to lane, drink, drive home
    stops: [[0, 0], [0.35, 0.5], [0.5, 0.5], [0.6, 0.69], [0.68, 0.69], [1, 1]],
    vehicle: 'car',
    events: [
      { at: 0.02, xy: HOME, text: 'Leaves home, takes the car' },
      { at: 0.15, xy: [150, 195], text: 'Has already had two drinks', bad: true },
      { at: 0.36, xy: SHOP, text: 'Queue spills onto the road — 35 min', bad: true },
      { at: 0.48, xy: [345, 80], text: 'Pays cash. No ID check, no bill', bad: true },
      { at: 0.62, xy: [250, 150], text: 'Drinks in the parked car', bad: true },
      { at: 0.75, xy: [250, 215], text: 'Drives back home', bad: true },
      { at: 0.99, xy: HOME, text: 'Home, after 1 h 35 min out' },
    ],
  },
  app: {
    cls: 'green', n: '2', title: `With ${BRAND.name}`, sub: 'the shop comes to the buyer',
    route: 'M330 60 L330 150 L250 150 L250 240 L60 240',
    stops: [[0, 0], [0.16, 0], [0.5, 1], [1, 1]],
    vehicle: 'rider',
    events: [
      { at: 0.02, xy: HOME, text: 'Orders from home · age verified on DigiLocker', check: 'age' },
      { at: 0.1, xy: SHOP, text: 'Licensed shop packs it · hologram scanned' },
      { at: 0.16, xy: [345, 80], text: 'Police-verified rider picks up the sealed bag' },
      { at: 0.52, xy: HOME, text: 'ID + OTP matched at the door', check: 'age' },
      { at: 0.57, xy: [75, 260], text: 'e-Bill with duty sent to Excise', record: true },
      { at: 0.62, xy: HOME, text: 'Done. The buyer never left home.' },
    ],
  },
}

function MapBase({ shopLabel, shopColor, lane }) {
  const streets = [60, 150, 250, 330]
  const avenues = [60, 150, 240]
  return (
    <>
      <rect width="400" height="300" fill="#efe8da" />
      {[[75, 75, 60, 60], [165, 75, 70, 60], [265, 75, 50, 60], [75, 165, 60, 60], [165, 165, 70, 60], [265, 165, 50, 60], [345, 75, 40, 60], [345, 165, 40, 60]].map(([x, y, w, h], k) => (
        <rect key={k} x={x} y={y} width={w} height={h} rx="4" fill="#e2d8c3" />
      ))}
      {[[100, 110], [200, 200], [290, 110], [110, 195], [365, 200]].map(([x, y], k) => <circle key={k} cx={x} cy={y} r="9" fill="#c8d3b0" />)}
      {streets.map((x) => <line key={x} x1={x} y1="20" x2={x} y2="285" stroke="#fbf8f1" strokeWidth="18" />)}
      {avenues.map((y) => <line key={y} x1="20" y1={y} x2="385" y2={y} stroke="#fbf8f1" strokeWidth="18" />)}
      {lane && <g transform="translate(262 128)"><rect width="16" height="16" rx="3" fill="#1f3a68" /><text x="8" y="12.5" textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff">P</text></g>}
      <g transform={`translate(${HOME[0] - 14} ${HOME[1] - 40})`}>
        <path d="M0 14 L14 2 L28 14 L28 30 L0 30 Z" fill="#1b1916" />
        <rect x="11" y="19" width="6" height="11" fill="#ffcf7a" />
        <text x="14" y="-4" textAnchor="middle" fontSize="11" fontWeight="600" fill="#1b1916">Home</text>
      </g>
      <g transform={`translate(${SHOP[0] - 22} ${SHOP[1] - 42})`}>
        <rect width="44" height="28" rx="3" fill={shopColor} />
        <rect x="6" y="12" width="32" height="16" fill="#ffd98a" />
        <text x="22" y="-5" textAnchor="middle" fontSize="11" fontWeight="600" fill="#1b1916">{shopLabel}</text>
      </g>
    </>
  )
}

function Vehicle({ kind, x, y, angle, color }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle})`}>
      {kind === 'car' ? (
        <>
          <rect x="-11" y="-6.5" width="22" height="13" rx="3.5" fill={color} stroke="#fff" strokeWidth="1.5" />
          <rect x="2" y="-4.5" width="5" height="9" rx="1.5" fill="#fff" opacity=".7" />
        </>
      ) : (
        <>
          <circle r="8" fill={color} stroke="#fff" strokeWidth="2" />
          <rect x="-12" y="-5" width="7" height="10" rx="1.5" fill="#ffb15c" stroke="#fff" strokeWidth="1" />
        </>
      )}
    </g>
  )
}

function JourneyCard({ j, p }) {
  const pathRef = useRef(null)
  const [len, setLen] = useState(0)
  useLayoutEffect(() => setLen(pathRef.current.getTotalLength()), [])

  const frac = lerpMap(p, j.stops)
  const color = j.cls === 'red' ? '#d7322b' : '#1f8a4c'
  let pos = { x: 0, y: 0 }, angle = 0
  if (len) {
    const a = pathRef.current.getPointAtLength(frac * len)
    const b = pathRef.current.getPointAtLength(Math.min(len, frac * len + 1))
    const c = pathRef.current.getPointAtLength(Math.max(0, frac * len - 1))
    pos = a
    angle = (Math.atan2(b.y - c.y, b.x - c.x) * 180) / Math.PI
  }
  const shown = j.events.filter((e) => p >= e.at)

  const km = j.vehicle === 'car' ? (frac * 6.4).toFixed(1) : '0.0'
  const checks = shown.filter((e) => e.check).length
  const onRecord = shown.some((e) => e.record)
  const risks = shown.filter((e) => e.bad).length

  return (
    <div className={`j-card ${j.cls}`}>
      <div className="j-card-h"><span className="j-badge">{j.n}</span><b>{j.title}</b><span>— {j.sub}</span></div>
      <div className="j-body">
      <div className="j-map">
        <svg viewBox="0 0 400 300">
          <MapBase shopLabel={j.cls === 'red' ? 'Theka' : 'Licensed shop'} shopColor={j.cls === 'red' ? '#b8231b' : '#1f8a4c'} lane={j.cls === 'red'} />
          <path d={j.route} fill="none" stroke={color} strokeOpacity=".22" strokeWidth="4" strokeDasharray="2 7" strokeLinecap="round" />
          <path ref={pathRef} d={j.route} fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray={len || 1} strokeDashoffset={len ? len * (1 - frac) : 1} />
          {shown.map((e, k) => (
            <g key={k} transform={`translate(${e.xy[0]} ${e.xy[1]})`}>
              {e.bad && <circle r="8" fill={color} className="j-pin" />}
              <circle r="9" fill="#fff" stroke={color} strokeWidth="2.5" />
              <text y="3.5" textAnchor="middle" fontSize="10" fontWeight="700" fill={color}>{j.events.indexOf(e) + 1}</text>
            </g>
          ))}
          {len > 0 && (j.vehicle === 'car' || p >= 0.16) && <Vehicle kind={j.vehicle} x={pos.x} y={pos.y} angle={angle} color={color} />}
        </svg>
      </div>
      <div className="j-log">
        {shown.length === 0 && <span className="j-empty">Press play…</span>}
        <AnimatePresence initial={false}>
          {shown.map((e) => (
            <motion.div key={e.text} className="j-ev" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
              <i>{j.events.indexOf(e) + 1}</i>
              <span>{e.text}</span>
              <small>{e.bad ? 'risk' : j.cls === 'green' ? '✓' : ''}</small>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      </div>
      <div className="j-score">
        <div><span>Buyer on road</span><strong className={j.vehicle === 'car' ? 'hot' : ''}>{km} km</strong></div>
        <div><span>Age checks</span><strong className={checks ? 'hot' : ''}>{checks}</strong></div>
        <div><span>On record</span><strong className={onRecord ? 'hot' : ''}>{onRecord ? 'Yes' : 'No'}</strong></div>
        <div><span>Risk moments</span><strong className={risks ? 'hot' : ''}>{risks}</strong></div>
      </div>
    </div>
  )
}

export default function Journeys() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.35 })
  const progress = useMotionValue(0)
  const [p, setP] = useState(0)
  const [playing, setPlaying] = useState(false)
  const anim = useRef(null)
  useMotionValueEvent(progress, 'change', setP)

  const play = () => {
    if (progress.get() >= 1) progress.set(0)
    setPlaying(true)
    anim.current = animate(progress, 1, {
      duration: DURATION * (1 - progress.get()), ease: 'linear',
      onComplete: () => setPlaying(false),
    })
  }
  const pause = () => { anim.current?.stop(); setPlaying(false) }

  useEffect(() => {
    if (inView) play()
    return () => anim.current?.stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView])

  const elapsed = Math.round(p * TOTAL_MIN)
  const done = p >= 0.995

  return (
    <section className="journeys" id="journeys" ref={ref}>
      <div className="container">
        <div className="journeys-head">
          <div>
            <h2>Same bottle. Two journeys.</h2>
            <p>Same city, same shop, same bottle, same tax. Watch what happens in between.</p>
          </div>
          <div className={`j-controls ${done ? 'done' : ''}`}>
            <button className="j-play" onClick={done ? play : playing ? pause : play} aria-label={done ? 'Replay' : playing ? 'Pause' : 'Play'}>
              {done ? <RotateCcw size={18} /> : playing ? <Pause size={18} /> : <Play size={18} />}
            </button>
            {done ? (
              <motion.div className="j-verdict" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                <p>Only one of them put someone <em>on the road.</em></p>
                <div className="tally"><span className="r">5</span><small>vs</small><span className="g">0</span></div>
              </motion.div>
            ) : (
              <>
                <input className="j-range" type="range" min="0" max="1" step="0.001" value={p} style={{ '--p': `${p * 100}%` }}
                  onChange={(e) => { pause(); progress.set(Number(e.target.value)) }} aria-label="Scrub through the journeys" />
                <span className="j-clock">{Math.floor(elapsed / 60)} h {String(elapsed % 60).padStart(2, '0')} min</span>
              </>
            )}
          </div>
        </div>

        <div className="j-grid">
          <JourneyCard j={journeys.today} p={p} />
          <JourneyCard j={journeys.app} p={p} />
        </div>

      </div>
    </section>
  )
}
