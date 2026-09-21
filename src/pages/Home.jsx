import React from 'react'
import { motion } from 'framer-motion'
import Hero from '../components/sections/Hero'
import About from '../components/sections/About'
import Experience from '../components/sections/Experience'
import Skills from '../components/sections/Skills'
import Projects from '../components/sections/Projects'
import Process from '../components/sections/Process'
import Education from '../components/sections/Education'
import Certifications from '../components/sections/Certifications'
import Contact from '../components/sections/Contact'
import Footer from '../components/layout/Footer'

export default function Home() {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Hero />
      <div className="divider" />
      <About />
      <div className="divider" />
      <Experience />
      <div className="divider" />
      <Skills />
      <div className="divider" />
      <Projects />
      <div className="divider" />
      <Process />
      <div className="divider" />
      <Education />
      <div className="divider" />
      <Certifications />
      <div className="divider" />
      <Contact />
      <Footer />
    </motion.main>
  )
}
