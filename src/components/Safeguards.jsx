import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView } from 'framer-motion'
import '../styles/rules.css'

// Sample state configuration used by the game.
const LEGAL_AGE = 25
const OPEN = 10 * 60
const CLOSE = 22 * 60
const MAX_BOTTLES = 2

const LEGAL = { age: 27, time: 20 * 60, date: 'normal', qty: 1, zone: 'ok', shop: 'valid', door: 'ok' }

const scenarios = [
  ['A 17-year-old tries to order', { age: 17 }],
  ['Someone orders at 11:30 pm', { time: 23 * 60 + 30 }],
  ['Stocking up on a dry day', { date: 'dry' }],
  ['Ordering 6 bottles at once', { qty: 6 }],
  ['Ordering from a shop with an expired licence', { shop: 'expired' }],
  ['A friend opens the door instead', { door: 'friend' }],
  ['The buyer is drunk at the door', { door: 'drunk' }],
  ['A normal, legal order', {}],
]

const gates = [
  { label: 'Age check', rule: `DigiLocker DOB · legal age ${LEGAL_AGE}`, test: (c) => c.age >= LEGAL_AGE,
    fail: (c) => ['BLOCKED', `Age ${c.age}. The account is never created — they can’t even browse.`] },
  { label: 'Shop licence', rule: 'excise licence must be valid', test: (c) => c.shop === 'valid',
    fail: () => ['HIDDEN', 'Licence expired. The shop is invisible on the app until it’s renewed.'] },
  { label: 'Retail hours', rule: '10:00 – 22:00 only', test: (c) => c.time >= OPEN && c.time < CLOSE,
    fail: (c) => ['BLOCKED', `${fmt(c.time)} is outside permitted hours. Ordering is closed.`] },
  { label: 'Dry day', rule: 'notified dry days & election days', test: (c) => c.date === 'normal',
    fail: (c) => ['BLOCKED', `${c.date === 'dry' ? '2 October is a dry day' : 'Polling day is a dry day'}. The app takes no orders, statewide.`] },
  { label: 'Quantity limit', rule: `max ${MAX_BOTTLES} bottles per order`, test: (c) => c.qty <= MAX_BOTTLES,
    fail: (c) => ['BLOCKED', `${c.qty} bottles is over the personal limit. Checkout is disabled.`] },
  { label: 'Delivery zone', rule: 'no dry or restricted areas', test: (c) => c.zone === 'ok',
    fail: () => ['BLOCKED', 'The address is inside a notified dry area. No delivery there.'] },
  { label: 'Doorstep check', rule: 'ID + OTP + visibly sober', test: (c) => c.door === 'ok',
    fail: (c) => ['REFUSED', c.door === 'drunk' ? 'Buyer is visibly intoxicated. Not handed over, bottle returned.' : 'ID doesn’t match the account holder. Not handed over, bottle returned.'] },
]

function fmt(m) {
  const h = Math.floor(m / 60) % 24
  return `${String(h).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`
}

function Barrier({ state }) {
  const open = state === 'pass'
  const color = state === 'pass' ? '#1f8a4c' : state === 'fail' ? '#d7322b' : '#5a5650'
  return (
    <svg width="66" height="30" viewBox="0 0 66 30" overflow="visible" aria-hidden="true">
      <rect x="2" y="8" width="8" height="22" rx="2" fill="#5a5650" />
      <g style={{ transform: `rotate(${open ? -28 : 0}deg)`, transformOrigin: '6px 12px', transition: 'transform .4s cubic-bezier(.3,1.5,.5,1)' }}>
        <rect x="6" y="9" width="58" height="6" rx="3" fill={color} style={{ transition: 'fill .2s' }} />
        {state === 'fail' && <line x1="14" y1="12" x2="62" y2="12" stroke="#fff" strokeWidth="6" strokeDasharray="6 8" />}
      </g>
    </svg>
  )
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

export default function Safeguards() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.4 })
  const [active, setActive] = useState(null)
  const [states, setStates] = useState(Array(gates.length).fill('idle'))
  const [verdict, setVerdict] = useState(null)
  const runId = useRef(0)

  const run = async (k) => {
    const cfg = { ...LEGAL, ...scenarios[k][1] }
    const id = ++runId.current
    setActive(k)
    setVerdict(null)
    const s = Array(gates.length).fill('idle')
    setStates([...s])
    for (let i = 0; i < gates.length; i++) {
      s[i] = 'checking'; setStates([...s])
      await sleep(320)
      if (id !== runId.current) return
      if (!gates[i].test(cfg)) {
        s[i] = 'fail'
        for (let j = i + 1; j < gates.length; j++) s[j] = 'dim'
        setStates([...s])
        const [v, why] = gates[i].fail(cfg)
        setVerdict({ bad: true, v, why })
        return
      }
      s[i] = 'pass'; setStates([...s])
    }
    setVerdict({ bad: false, v: 'DELIVERED', why: 'Every rule checked. e-Bill with duty sent to the Excise Department.' })
  }

  // Play the first situation once, so the section explains itself
  useEffect(() => {
    if (inView) run(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView])

  return (
    <section className="rules" id="rules" ref={ref}>
      <div className="container">
        <div className="rules-head">
          <h2>Go on. Try to break the rules.</h2>
          <p>Pick a situation. The app checks every order against the state’s excise rules — automatically.</p>
        </div>

        <div className="rules-grid">
          <div className="tries">
            {scenarios.map(([label, over], k) => (
              <button key={label} className={`try ${active === k ? 'on' : ''} ${Object.keys(over).length ? '' : 'legal'}`} onClick={() => run(k)}>
                <span>{label}</span><i>→</i>
              </button>
            ))}
          </div>

          <div className="gates">
            <div className="gates-h"><span>CHECKPOINTS</span><span>sample state config</span></div>
            {gates.map((g, i) => (
              <div key={g.label} className={`gate ${states[i]}`}>
                <div className="gate-n">{states[i] === 'pass' ? '✓' : states[i] === 'fail' ? '✕' : i + 1}</div>
                <b>{g.label}</b><small>{g.rule}</small>
                <Barrier state={states[i]} />
              </div>
            ))}
            <div className="verdict-box">
              <AnimatePresence mode="wait">
                {verdict ? (
                  <motion.div key={verdict.v + verdict.why} initial={{ opacity: 0, scale: 1.4, rotate: -4 }} animate={{ opacity: 1, scale: 1, rotate: -2 }} transition={{ type: 'spring', stiffness: 380, damping: 18 }}>
                    <span className={`stamp-v ${verdict.bad ? 'bad' : 'good'}`}>{verdict.bad ? '✕' : '✓'} {verdict.v}</span>
                    <p>{verdict.why}</p>
                    <div className="logged">→ logged to the Excise dashboard</div>
                  </motion.div>
                ) : (
                  <motion.div key="idle" className="verdict-idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    Checking…
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {verdict && (
              <motion.div key={verdict.why} className="flash" initial={{ opacity: 0.35 }} animate={{ opacity: 0 }} transition={{ duration: 0.8 }}
                style={{ background: verdict.bad ? '#d7322b' : '#1f8a4c' }} />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
