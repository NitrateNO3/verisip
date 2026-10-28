import Nav from './components/Nav'
import Hero from './components/Hero'
import Evening from './components/Evening'
import Journeys from './components/Journeys'
import Record from './components/Record'
import Benefits from './components/Benefits'
import Safeguards from './components/Safeguards'
import Dashboard from './components/Dashboard'
import Letter from './components/Letter'
import Roadmap from './components/Roadmap'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Evening />
        <Journeys />
        <Record />
        <Benefits />
        <Safeguards />
        <Dashboard />
        <Letter />
        <Roadmap />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
