import { useEffect, useRef, useState } from 'react'
import { motion, useInView, animate } from 'framer-motion'
import '../styles/portal.css'

// Illustrative sample data for the mock-up — not real figures.
const hours = [
  { h: 8, locked: true }, { h: 9, locked: true },
  { h: 10, v: 42 }, { h: 11, v: 58 }, { h: 12, v: 74 }, { h: 13, v: 81 }, { h: 14, v: 66 },
  { h: 15, v: 70 }, { h: 16, v: 88 }, { h: 17, v: 112 }, { h: 18, v: 148 }, { h: 19, v: 176 },
  { h: 20, v: 164 }, { h: 21, v: 121 }, { h: 22, locked: true }, { h: 23, locked: true },
]
const MAX = 200

const kpis = [
  { label: 'Orders today', value: 1300, note: 'all with e-bill' },
  { label: 'ID checks at door', value: 1300, note: '100% of handovers' },
  { label: 'Refused / returned', value: 37, note: 'under-age, ID mismatch, intoxicated' },
  { label: 'Duty on today’s bills (₹)', value: 1842600, note: 'auto-reconciled' },
]

const vendors = [
  ['L-0412', 'Gill Wine Shop', 212, 4, 'Valid'],
  ['L-0388', 'Sharma Beverages', 0, 0, 'Expired · hidden'],
  ['L-0451', 'Model Town Vend', 187, 6, 'Valid'],
  ['L-0503', 'Civil Lines Store', 164, 2, 'Valid'],
  ['L-0277', 'Bus Stand Vend', 141, 9, 'Valid'],
]

const log = [
  ['21:58', 'Order #A-55102 delivered · ID + OTP matched'],
  ['21:51', 'Order #A-55097 refused · buyer appeared under-age'],
  ['21:40', 'Order blocked · address inside notified dry area'],
  ['21:12', 'Vendor L-0388 hidden · licence not renewed'],
  ['20:47', 'Order #A-54988 refused · buyer intoxicated'],
]

function Counter({ to }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!inView) return
    const c = animate(0, to, { duration: 1.8, ease: 'easeOut', onUpdate: (v) => setVal(Math.round(v)) })
    return () => c.stop()
  }, [inView, to])
  return <strong ref={ref}>{val.toLocaleString('en-IN')}</strong>
}

export default function Dashboard() {
  const [hover, setHover] = useState(null)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="portal-sec" id="dashboard">
      <div className="container">
        <div className="portal-head">
          <h2>And this is what the department sees.</h2>
          <p>A monitoring portal for Excise officers — the same data we see, live, with nothing filtered out.</p>
        </div>

        <motion.div className="portal" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.7 }}>
          <div className="portal-top">
            <div>
              <b>Home Delivery Monitoring Portal</b>
              <span className="hindi">आबकारी विभाग · होम डिलीवरी निगरानी</span>
            </div>
            <div className="user">Logged in: District Excise Officer<br />Sample District · 28-10-2026</div>
          </div>
          <div className="portal-strip" />
          <div className="portal-tabs">
            {['Overview', 'Orders', 'Vendors & licences', 'Refusals', 'Riders', 'Reports'].map((t, k) => <span key={t} className={k === 0 ? 'on' : ''}>{t}</span>)}
          </div>
          <div className="portal-inner">
            <div className="p-kpis">
              {kpis.map((k) => (
                <div className="p-kpi" key={k.label}>
                  <span>{k.label}</span>
                  <Counter to={k.value} />
                  <em>{k.note}</em>
                </div>
              ))}
            </div>
            <div className="p-cols">
              <div className="p-box" ref={ref}>
                <div className="p-box-h">Orders by hour <span>retail hours 10:00–22:00</span></div>
                <div className="p-box-b">
                  <div className="chart" onMouseLeave={() => setHover(null)}>
                    {[0, 100, 200].map((g) => (
                      <div key={g} className="chart-grid" style={{ bottom: `${(g / MAX) * 100}%` }}><em>{g}</em></div>
                    ))}
                    {hours.map((d, k) => (
                      <div key={d.h} className={`bar-col ${d.locked ? 'locked' : ''}`} onMouseEnter={() => setHover(k)}>
                        {!d.locked && (
                          <motion.div className="bar" initial={{ height: 0 }} animate={{ height: inView ? `${(d.v / MAX) * 100}%` : 0 }} transition={{ duration: 0.7, delay: k * 0.04 }} />
                        )}
                        {hover === k && <div className="tip">{String(d.h).padStart(2, '0')}:00 · {d.locked ? 'ordering locked' : `${d.v} orders`}</div>}
                      </div>
                    ))}
                  </div>
                  <div className="x-labels">{hours.map((d) => <span key={d.h}>{d.h % 2 === 0 ? d.h : ''}</span>)}</div>
                  <div className="chart-key"><i />outside permitted hours — app does not accept orders</div>
                </div>
              </div>
              <div className="p-box">
                <div className="p-box-h">Exceptions log <span>auto-recorded</span></div>
                <div className="p-box-b p-log">
                  {log.map(([t, m]) => <div key={t}><time>{t}</time><span>{m}</span></div>)}
                </div>
              </div>
              <div className="p-box">
                <div className="p-box-h">Vendors <span>synced with licence records</span></div>
                <div className="p-box-b" style={{ overflowX: 'auto' }}>
                  <table className="p-table">
                    <thead><tr><th>Licence</th><th>Shop</th><th className="num">Orders</th><th>Status</th></tr></thead>
                    <tbody>
                      {vendors.map(([l, n, o, r, s]) => (
                        <tr key={l}><td className="mono">{l}</td><td>{n}</td><td className="num">{o}</td><td className={s.startsWith('Expired') ? 'tag-bad' : ''}>{s}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        <p className="portal-note">* Mock-up with sample data. Not connected to any real department system.</p>
      </div>
    </section>
  )
}
