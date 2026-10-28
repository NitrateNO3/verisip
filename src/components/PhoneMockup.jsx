import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BRAND } from '../config'
import '../styles/phone.css'

const ROUTE = 'M30 140 L30 100 L110 100 L110 50 L200 50 L200 30 L250 30'

const screens = [
  {
    bar: 'Sign up',
    body: (
      <>
        <div className="p-title">First, let’s confirm your age.</div>
        <div className="p-muted">We fetch your date of birth from DigiLocker. We never see or store your full Aadhaar number.</div>
        <div className="p-field"><em>Name</em> Rohit S.</div>
        <div className="p-field"><em>Date of birth</em> 14 Mar 1999</div>
        <div className="p-field"><em>Legal age in your state</em> 25</div>
        <motion.div className="p-field" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
          <em>Result</em> <span className="p-ok">Eligible · 27 yrs</span>
        </motion.div>
        <div className="p-btn">Continue</div>
      </>
    ),
  },
  {
    bar: 'Shops near you',
    body: (
      <>
        <div className="p-muted">Only shops with a valid excise licence appear here.</div>
        {[['Gill Wine Shop', '1.2 km', 'L-0412'], ['Sharma Beverages', '2.0 km', 'L-0388'], ['Model Town Vend', '2.6 km', 'L-0451']].map(([n, d, l], i) => (
          <motion.div key={n} className="p-shop" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }}>
            <div className="p-shop-img">{n[0]}</div>
            <div>{n}<small>{d} · open till 10 pm</small></div>
            <span className="p-lic">{l}</span>
          </motion.div>
        ))}
        <div className="p-note">Limit: 2 bottles per order, as per state rules.</div>
      </>
    ),
  },
  {
    bar: 'On the way',
    body: (
      <>
        <div className="p-map">
          <svg viewBox="0 0 280 170" width="100%" height="100%">
            {[20, 60, 100, 140].map((y) => <line key={y} x1="0" x2="280" y1={y} y2={y} stroke="#fff" strokeWidth="8" />)}
            {[30, 110, 200, 250].map((x) => <line key={x} y1="0" y2="170" x1={x} x2={x} stroke="#fff" strokeWidth="8" />)}
            <path d={ROUTE} fill="none" stroke="#1b1916" strokeWidth="3" />
            <circle cx="250" cy="30" r="7" fill="#1f8a4c" />
          </svg>
          <motion.div style={{ position: 'absolute', top: 0, left: 0, offsetPath: `path("${ROUTE}")` }}
            initial={{ offsetDistance: '0%' }} animate={{ offsetDistance: '100%' }} transition={{ duration: 3, ease: 'easeInOut' }}>
            <div style={{ width: 14, height: 14, borderRadius: 7, background: '#ff8a1e', border: '3px solid #fff', transform: 'translate(-50%,-50%)' }} />
          </motion.div>
        </div>
        <div className="p-title">Arriving in 12 min</div>
        <div className="p-muted">Rider Gurpreet · police-verified · sealed bag #A5510</div>
        <div className="p-field"><em>Bottle hologram</em> <span className="p-ok">Scanned · genuine</span></div>
      </>
    ),
  },
  {
    bar: 'Handover',
    body: (
      <>
        <div className="p-title">Show your ID to the rider and share this code.</div>
        <div className="p-otp">{['4', '8', '1', '7'].map((d, i) => (
          <motion.span key={i} initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.12 * i }}>{d}</motion.span>
        ))}</div>
        <div className="p-note">The rider will not hand over the order if the ID doesn’t match, or if you appear intoxicated.</div>
        <motion.div className="p-btn green" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>Delivered · bill sent</motion.div>
      </>
    ),
  },
]

export default function PhoneMockup() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % screens.length), 4000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="phone-wrap">
      <div className="phone">
        <div className="phone-screen">
          <div className="p-island" />
          <div className="p-status"><span>9:41</span><span>5G ▮▮▮</span></div>
          <div className="p-bar"><b>{BRAND.name.toUpperCase()}</b><span>{screens[i].bar}</span></div>
          <AnimatePresence mode="wait">
            <motion.div key={i} className="p-body" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.35 }}>
              {screens[i].body}
            </motion.div>
          </AnimatePresence>
          <div className="p-dots">{screens.map((_, k) => <span key={k} className={k === i ? 'on' : ''} />)}</div>
        </div>
      </div>
    </div>
  )
}
