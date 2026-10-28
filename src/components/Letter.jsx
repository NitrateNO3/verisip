import { motion } from 'framer-motion'
import { BRAND } from '../config'
import '../styles/letter.css'

const promises = [
  'Every sale on a digital bill',
  'Every buyer ID-checked — twice',
  'Full access for the department from day one',
  'An independent review before any expansion',
]

function Tick({ delay }) {
  return (
    <svg width="28" height="28" viewBox="0 0 30 30">
      <rect x="2" y="2" width="26" height="26" fill="none" stroke="#2a2620" strokeWidth="2" rx="3" />
      <motion.path d="M7 15 L13 21 L24 7" fill="none" stroke="#1f8a4c" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ delay, duration: 0.5 }} />
    </svg>
  )
}

export default function Letter() {
  return (
    <section className="letter-sec" id="letter">
      <div className="bg" style={{ backgroundImage: 'url(/images/family.jpg)' }} />
      <div className="container letter-wrap">
        <motion.div className="letter" initial={{ opacity: 0, y: 60, rotate: -1.5 }} whileInView={{ opacity: 1, y: 0, rotate: 0.4 }}
          viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.9, ease: [0.2, 0.9, 0.3, 1] }}>
          <div>
            <div className="letter-date">Why we’re building this</div>
            <p className="salute">Dear Sir / Madam,</p>
            <p>
              We are not trying to get anyone to drink more. People who drink will buy either way — the only question is <em>how</em>.
              Today, that means a crowded road, a counter where nobody checks age, cash without a bill, and too often, a drive home that shouldn’t happen.
            </p>
            <p>
              We believe the state can keep every rule it has, collect every rupee it is owed, and still take that drive off the road.
              We’d like to prove it in one district, under your supervision — and if it doesn’t make the streets safer and the records cleaner, it shouldn’t go further.
            </p>
            <div className="sign">Team {BRAND.name}<small>{BRAND.email}</small></div>
          </div>

          <div className="letter-side">
            <div className="polaroid">
              <div className="tape" />
              <img src="/images/family.jpg" alt="Friends walking together at sunset" />
              <span>who this is for</span>
            </div>
            <div className="promises">
              <h4>WHAT WE PROMISE IN WRITING</h4>
              {promises.map((p, i) => (
                <div className="promise" key={p}><Tick delay={0.3 + i * 0.35} />{p}</div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
