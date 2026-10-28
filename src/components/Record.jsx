import { motion } from 'framer-motion'
import { BRAND } from '../config'
import '../styles/record.css'

const Row = ({ l, r, ok }) => (
  <div className="r-row"><span>{l}</span><span className={ok ? 'r-ok' : ''}>{r}</span></div>
)

const notes = [
  ['Age is checked by DigiLocker — not by a shopkeeper with a queue of forty people.', 'And checked again at the door.'],
  ['Only licensed shops can sell.', 'If a licence lapses, the shop simply disappears from the app.'],
  ['Every bottle’s hologram is scanned.', 'Fake or duty-unpaid stock gets caught before it leaves the shop.'],
  ['The tax is on the bill.', 'No cash, no over-MRP, nothing off the books.'],
  ['The rider is police-verified and tracked.', 'Pick-up and drop times and the full route are saved.'],
  ['No ID, wrong person, or drunk at the door? No handover.', 'The refusal is logged and the bottle goes back.'],
]

// Parent wrapper triggers on scroll; the receipt and stamps follow via variants
// (the receipt itself starts fully clipped, so it can't detect being in view).
const stamp = (delay, rotate) => ({
  variants: {
    hidden: { opacity: 0, scale: 2.2, rotate: rotate - 10 },
    show: { opacity: 0.85, scale: 1, rotate, transition: { delay, type: 'spring', stiffness: 400, damping: 18 } },
  },
})

export default function Record() {
  return (
    <section className="record" id="record">
      <div className="container">
        <div className="record-head">
          <h2>Every bottle leaves a paper trail.</h2>
          <p>This is the record the Excise Department would receive for a single delivery. Today, at a theka counter, most of these lines simply don’t exist.</p>
        </div>

        <div className="record-grid">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
          <motion.div className="receipt" variants={{
            hidden: { clipPath: 'inset(0 0 100% 0)' },
            show: { clipPath: 'inset(0 0 0% 0)', transition: { duration: 2.2, ease: 'linear' } },
          }}>
            <div className="r-center r-title">{BRAND.name.toUpperCase()}</div>
            <div className="r-center">DELIVERY RECORD · SAMPLE</div>
            <div className="r-hr" />
            <Row l="Order" r="#A-55102" />
            <Row l="Date" r="28-10-2026  21:42" />
            <div className="r-sec">① BUYER</div>
            <Row l="Name" r="Rohit S." />
            <Row l="Age check" r="DigiLocker ✓ 27y" ok />
            <Row l="Aadhaar" r="XXXX-XXXX-4821" />
            <div className="r-sec">② SELLER</div>
            <Row l="Gill Wine Shop" r="" />
            <Row l="Excise licence" r="L-0412 ✓" ok />
            <div className="r-sec">③ ITEM</div>
            <Row l="1 × Whisky 750ml" r="₹1,150" />
            <Row l="Hologram" r="HX-29831 ✓" ok />
            <div className="r-sec">④ TAX</div>
            <Row l="Excise duty + VAT" r="on bill ✓" ok />
            <Row l="Payment" r="UPI" />
            <div className="r-sec">⑤ DELIVERY</div>
            <Row l="Rider" r="R-2291 (verified)" />
            <Row l="Picked / Delivered" r="21:44 / 21:58" />
            <div className="r-sec">⑥ HANDOVER</div>
            <Row l="ID shown + OTP" r="Matched ✓" ok />
            <Row l="Visibly sober" r="Yes ✓" ok />
            <div className="r-hr" />
            <div className="r-center">Copy sent to State Excise Dept.</div>
            <div className="r-center">— — — — — — — — — —</div>

            <motion.div className="stamp s1" {...stamp(1.2, -8)}>Age verified</motion.div>
            <motion.div className="stamp s2" {...stamp(1.9, 6)}>Duty paid</motion.div>
            <motion.div className="stamp s3" {...stamp(2.5, -4)}>Delivered to ID holder</motion.div>
          </motion.div>
          </motion.div>

          <div className="notes">
            {notes.map(([p, s], i) => (
              <motion.div key={i} className="note-item" initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.6 }} transition={{ duration: 0.6 }}>
                <div className="note-num">{i + 1}</div>
                <div><p>{p}</p><small>{s}</small></div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
