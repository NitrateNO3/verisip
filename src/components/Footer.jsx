import { BRAND, NAV_LINKS } from '../config'
import '../styles/footer.css'

export default function Footer() {
  return (
    <footer className="foot">
      <div className="container">
        <div className="foot-warning">
          <span className="hindi">मद्यपान स्वास्थ्य के लिए हानिकारक है। नशे में गाड़ी न चलाएँ।</span>
          <span>Consumption of alcohol is injurious to health. Do not drink and drive. Sale only to persons of legal drinking age under applicable state law.</span>
        </div>
        <div className="foot-row">
          <div className="foot-big">{BRAND.name.toUpperCase()}</div>
          <div className="foot-links">
            {NAV_LINKS.map((l) => <a key={l.href} href={l.href}>{l.label}</a>)}
          </div>
        </div>
        <div className="foot-bottom">
          <span>© {new Date().getFullYear()} {BRAND.name} · App in development</span>
          <span>Will operate only where permitted by state excise law.</span>
        </div>
      </div>
    </footer>
  )
}
