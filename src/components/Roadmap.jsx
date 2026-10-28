import { motion } from 'framer-motion'
import '../styles/highway.css'

const signs = [
  { cls: 'done', hi: 'अनुसंधान', en: 'Research', d: 'Excise rules, age limits and dry days mapped state by state, plus the home-delivery models states allowed in 2020.', dist: ['✓', 'Done'] },
  { cls: 'here', hi: 'ऐप निर्माण', en: 'Building the app', d: 'Customer app, shop app, rider app and the department’s monitoring portal.', dist: ['●', 'You are here'] },
  { cls: '', hi: 'ज़िला पायलट', en: 'District pilot', d: 'One district, selected licensed shops, under direct Excise Department supervision.', dist: ['→', 'Next'] },
  { cls: '', hi: 'राज्य विस्तार', en: 'State rollout', d: 'Only if the pilot shows safer streets and cleaner records, reviewed independently.', dist: ['→', 'Later'] },
]

export default function Roadmap() {
  return (
    <section className="highway" id="roadmap">
      <div className="container">
        <div className="highway-head">
          <h2>Where we are<br /><span>on the road.</span></h2>
          <p>The app is being built right now. The next milestone isn’t ours to reach alone — it needs a department willing to run a pilot.</p>
        </div>
        <div className="signs">
          {signs.map((s, i) => (
            <motion.div key={s.en} className={`sign-post ${s.cls}`} initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }} transition={{ delay: i * 0.15, type: 'spring', stiffness: 120, damping: 14 }}>
              <div className="board">
                <div className="board-in">
                  <span className="hindi">{s.hi}</span>
                  <b>{s.en}</b>
                  <p>{s.d}</p>
                  <div className="dist"><span>{s.dist[1]}</span><span>{s.dist[0]}</span></div>
                </div>
              </div>
              <div className="post" />
            </motion.div>
          ))}
        </div>
      </div>
      <div className="road">
        <div className="road-line" />
        <div className="container" style={{ position: 'relative', height: '100%' }}>
          <motion.div className="scooter" initial={{ left: '0%' }} whileInView={{ left: '37.5%' }} viewport={{ once: true }} transition={{ duration: 2.2, ease: 'easeOut', delay: 0.4 }}>
            WE’RE HERE
          </motion.div>
        </div>
      </div>
    </section>
  )
}
