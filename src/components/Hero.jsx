import { motion } from 'framer-motion'
import PhoneMockup from './PhoneMockup'
import '../styles/hero.css'

const rise = (d) => ({
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, delay: d, ease: [0.2, 0.9, 0.3, 1] },
})

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-photo" style={{ backgroundImage: 'url(/images/night-delivery.jpg)' }} />
      <div className="hero-shade" />
      <div className="hero-grain" />

      <div className="container hero-body">
        <div>
          <motion.div className="hero-file" {...rise(0)}>
            <span>PROPOSAL / <b>2026</b></span>
            <span>FOR: STATE EXCISE &amp; TRANSPORT DEPTS.</span>
          </motion.div>
          <h1>
            <motion.span style={{ display: 'block' }} {...rise(0.1)}>The safest</motion.span>
            <motion.span style={{ display: 'block' }} {...rise(0.2)}>drive home is</motion.span>
            <motion.span style={{ display: 'block' }} {...rise(0.3)}>the one <span className="lit">nobody</span></motion.span>
            <motion.span style={{ display: 'block' }} {...rise(0.4)}><span className="lit">takes.</span></motion.span>
          </h1>
          <motion.p className="hero-sub" {...rise(0.55)}>
            We’re building an app that lets verified adults order liquor from licensed shops, delivered to their door —
            so nobody has to drive to a theka, queue outside one, or drive back from one.
          </motion.p>
          <motion.p className="hero-hindi hindi" {...rise(0.65)}>
            न ठेके पे भीड़, न सड़क पे नशे में गाड़ी, न लड़ाइयाँ।
            <small>No crowds at the theka. No drunk driving. No fights.</small>
          </motion.p>
          <motion.div className="hero-actions" {...rise(0.75)}>
            <a href="#contact" className="hero-btn">Discuss a pilot</a>
            <a href="#evening" className="hero-link">Why this matters ↓</a>
          </motion.div>
        </div>
        <motion.div className="hero-phone" initial={{ opacity: 0, y: 60, rotate: 4 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ duration: 1.1, delay: 0.4 }}>
          <PhoneMockup />
        </motion.div>
      </div>

      <div className="hero-status">
        <div className="container">
          <span><i />APP STATUS: IN DEVELOPMENT</span>
          <span>NEXT STEP: ONE-DISTRICT PILOT WITH EXCISE OVERSIGHT</span>
        </div>
      </div>
    </section>
  )
}
