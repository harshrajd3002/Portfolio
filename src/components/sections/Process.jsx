import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { staggerContainer, staggerItem } from '../../utils/animations'

const PROCESS_STEPS = [
  {
    id: 'discover',
    num: '01',
    name: 'Discover',
    title: 'Understanding before solving',
    description:
      'I start by listening — to users, stakeholders, and data. Before any design decisions, I need to genuinely understand the problem space. This means interviews, observation, competitive analysis, and mapping what we know vs. what we assume.',
    methods: ['User Interviews', 'Competitive Analysis', 'Stakeholder Workshops', 'Heuristic Evaluation'],
  },
  {
    id: 'define',
    num: '02',
    name: 'Define',
    title: 'Clarity creates direction',
    description:
      'Insights without focus lead nowhere. I synthesize research into clear problem statements, user personas, and design principles. This phase is where ambiguity transforms into a shared direction that both design and engineering can rally around.',
    methods: ['Affinity Mapping', 'Problem Framing', 'How Might We', 'Jobs To Be Done'],
  },
  {
    id: 'explore',
    num: '03',
    name: 'Explore',
    title: 'Diverge before converging',
    description:
      'Exploration is about breadth, not polish. I sketch quickly, generate many directions, and evaluate them against the defined problem. The goal is to find the most promising path before committing to high fidelity.',
    methods: ['Sketching', 'Crazy 8s', 'User Flow Mapping', 'Information Architecture'],
  },
  {
    id: 'design',
    num: '04',
    name: 'Design',
    title: 'Precision in execution',
    description:
      'With a clear direction, I build high-fidelity designs that reflect the full experience — states, edge cases, accessibility, and micro-interactions. Design is not decoration; it\'s decision-making made visible.',
    methods: ['High-fidelity UI', 'Component Systems', 'Interaction Design', 'Accessibility Review'],
  },
  {
    id: 'test',
    num: '05',
    name: 'Test',
    title: 'Assumptions meet reality',
    description:
      'Testing is not a checkpoint — it\'s a conversation with the people we\'re designing for. I use prototypes to validate hypotheses, uncover blind spots, and measure whether the solution actually solves the problem.',
    methods: ['Usability Testing', 'A/B Testing', 'Prototype Validation', 'Accessibility Testing'],
  },
  {
    id: 'refine',
    num: '06',
    name: 'Refine',
    title: 'Design is never done',
    description:
      'The best products are never finished, only iterated. Post-launch, I track real usage patterns, gather feedback, and identify what the prototype couldn\'t tell us. Refinement is where good design becomes great design.',
    methods: ['Analytics Review', 'Heatmap Analysis', 'Feedback Synthesis', 'Iteration Planning'],
  },
]

export default function Process() {
  const [activeStep, setActiveStep] = useState(PROCESS_STEPS[0])

  return (
    <section className="section" id="process" aria-label="Design process">
      <div className="container">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          <motion.div variants={staggerItem}>
            <span className="section-label">Process</span>
          </motion.div>

          <motion.h2
            className="text-display-md"
            variants={staggerItem}
            style={{ color: 'var(--text-primary)', marginBottom: 'var(--space-12)' }}
          >
            How I think<br />
            <span style={{ color: 'var(--accent)' }}>when I design</span>
          </motion.h2>

          {/* Step buttons */}
          <motion.div
            className="process-steps"
            variants={staggerItem}
            role="tablist"
            aria-label="Design process stages"
          >
            {PROCESS_STEPS.map(step => (
              <button
                key={step.id}
                className={`process-step ${activeStep.id === step.id ? 'active' : ''}`}
                onClick={() => setActiveStep(step)}
                role="tab"
                aria-selected={activeStep.id === step.id}
                aria-controls={`process-detail-${step.id}`}
                id={`process-tab-${step.id}`}
              >
                <div className="process-step-num">{step.num}</div>
                <div className="process-step-name">{step.name}</div>
              </button>
            ))}
          </motion.div>

          {/* Detail panel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep.id}
              className="process-detail"
              role="tabpanel"
              id={`process-detail-${activeStep.id}`}
              aria-labelledby={`process-tab-${activeStep.id}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="process-detail-title">{activeStep.title}</div>
              <p className="process-detail-desc">{activeStep.description}</p>

              <div className="process-detail-methods">
                {activeStep.methods.map(method => (
                  <span key={method} className="tag">{method}</span>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
