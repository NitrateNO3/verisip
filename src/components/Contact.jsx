import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BRAND } from '../config'
import '../styles/contact.css'

// Grows a text input to fit what's typed, so the sentence keeps flowing.
function Blank({ name, placeholder, type = 'text', value, onChange, required = true }) {
  return (
    <input name={name} type={type} placeholder={placeholder} required={required} value={value}
      onChange={(e) => onChange(name, e.target.value)}
      style={{ width: `calc(${Math.max((value || placeholder).length, 6) + 1}ch * .78)` }} />
  )
}

export default function Contact() {
  const [f, setF] = useState({ name: '', dept: '', state: '', want: 'discuss a district pilot', email: '' })
  const [sent, setSent] = useState(false)
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }))

  // Front-end only for now: hook this up to an email service or backend later.
  const onSubmit = (e) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <section className="contact" id="contact">
      <div className="container contact-grid">
        <div className="contact-aside">
          <h2>Write to us.</h2>
          <p>If you work in an Excise, Transport or Home department and would like to explore a pilot — or just ask hard questions — we’d like to hear from you.</p>
          <div className="contact-direct">
            <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a>
            <span>{BRAND.phone}</span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {sent ? (
            <motion.p key="sent" className="sent" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              Thank you{f.name ? `, ${f.name}` : ''}. <span>We’ll write back soon.</span>
            </motion.p>
          ) : (
            <motion.form key="form" className="madlib" onSubmit={onSubmit} exit={{ opacity: 0, y: -20 }}>
              Namaste, I’m <Blank name="name" placeholder="your name" value={f.name} onChange={set} /> from{' '}
              <Blank name="dept" placeholder="department / organisation" value={f.dept} onChange={set} />,{' '}
              <Blank name="state" placeholder="state" value={f.state} onChange={set} required={false} />.
              I’d like to{' '}
              <select value={f.want} onChange={(e) => set('want', e.target.value)} style={{ width: `${f.want.length + 1}ch` }}>
                <option>discuss a district pilot</option>
                <option>see a live demo</option>
                <option>ask about compliance</option>
                <option>talk about something else</option>
              </select>
              . You can reach me at <Blank name="email" type="email" placeholder="name@gov.in" value={f.email} onChange={set} />.
              <div className="send-row">
                <button type="submit" className="send">Send →</button>
                <small>We reply personally. No newsletters.</small>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
