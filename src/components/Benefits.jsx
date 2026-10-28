import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import '../styles/files.css'

const files = [
  {
    id: 'excise', en: 'Excise Department', hi: 'आबकारी विभाग', no: 'VS/EXC/01',
    title: 'You see every sale, as it happens.',
    subject: 'Each order arrives as a digital record — buyer verified, shop licensed, bottle scanned, duty on the bill.',
    points: [
      ['Live sales data', 'by district, by shop, by brand.'],
      ['Leakage closes', '— no cash, no over-MRP, no stock without a valid hologram.'],
      ['Licences enforced automatically', '— an expired licence takes the shop offline the same day.'],
      ['Evidence for policy', 'on timings, zones and duty, instead of estimates.'],
    ],
  },
  {
    id: 'police', en: 'Police & Traffic', hi: 'पुलिस एवं यातायात', no: 'VS/POL/02',
    title: 'Fewer calls on a Friday night.',
    subject: 'When buyers stay home, there is no crowd to manage and no drive back to worry about.',
    points: [
      ['Fewer drunk-driving trips', '— the round trip to the vend doesn’t happen.'],
      ['No evening crowd outside vends', 'and fewer fights that start there.'],
      ['Every order linked to a verified ID', ', available on lawful request.'],
      ['Riders police-verified', 'before they are allowed to deliver.'],
    ],
  },
  {
    id: 'citizens', en: 'Citizens & Families', hi: 'नागरिक एवं परिवार', no: 'VS/CIT/03',
    title: 'The street outside the theka becomes just a street again.',
    subject: 'The people who benefit most are the ones who never buy — neighbours, women walking home, children.',
    points: [
      ['Calmer neighbourhoods', 'with no crowd gathering every evening.'],
      ['Minors kept out', '— age checked by DigiLocker and again at the door.'],
      ['Genuine product only', ', which matters every time a hooch tragedy makes the news.'],
      ['Built-in limits', ', self-exclusion and de-addiction helpline links.'],
    ],
  },
  {
    id: 'vendors', en: 'Licensed Vendors', hi: 'लाइसेंसधारी विक्रेता', no: 'VS/VEN/04',
    title: 'Existing shops stay in business — with less trouble.',
    subject: 'We don’t hold stock or replace licensees. Every order is fulfilled by a licensed shop.',
    points: [
      ['No crowd to control', 'and no age checks to do under pressure.'],
      ['A fair fight against illegal sellers', ', who lose customers when the legal option is easy.'],
      ['Rules applied for them', '— timings, dry days and limits are built in.'],
      ['Clean digital books', 'for inspections and licence renewals.'],
    ],
  },
]

export default function Benefits() {
  const [active, setActive] = useState(files[0].id)
  const f = files.find((x) => x.id === active)

  return (
    <section className="files" id="benefits">
      <div className="container">
        <div className="files-head">
          <h2>Four departments. One file each.</h2>
          <p>Open a file to see what changes for that department.</p>
        </div>

        <div className="folder-tabs">
          {files.map((x) => (
            <button key={x.id} className={`folder-tab ${active === x.id ? 'active' : ''}`} onClick={() => setActive(x.id)}>
              {x.en}<small>{x.hi}</small>
            </button>
          ))}
        </div>
        <div className="folder">
          <AnimatePresence mode="wait">
            <motion.div key={f.id} className="sheet"
              initial={{ y: 40, opacity: 0, rotate: 1.5 }} animate={{ y: 0, opacity: 1, rotate: -0.4 }} exit={{ y: -20, opacity: 0, rotate: -1 }}
              transition={{ duration: 0.4, ease: [0.2, 0.9, 0.3, 1] }}>
              <div className="clip" />
              <motion.div className="action-stamp" initial={{ scale: 1.8, opacity: 0 }} animate={{ scale: 1, opacity: 0.8 }} transition={{ delay: 0.35, type: 'spring', stiffness: 400, damping: 16 }}>
                FOR ACTION
              </motion.div>
              <div className="sheet-meta">
                <span>FILE NO. {f.no}</span>
                <span>TO: {f.en.toUpperCase()}</span>
              </div>
              <h3>{f.title}</h3>
              <p className="subject">{f.subject}</p>
              <ol>
                {f.points.map(([b, t]) => <li key={b}><span><b>{b}</b>{/^[,.]/.test(t) ? '' : ' '}{t}</span></li>)}
              </ol>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
