import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const NAME = 'Harshrajsinh'

export default function LoadingScreen({ onComplete }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 1800)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <motion.div
      className="loading-screen"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="loading-name" aria-label="Loading">
        {NAME.split('').map((char, i) => (
          <motion.span
            key={i}
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              delay: i * 0.05,
              duration: 0.45,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{ display: 'inline-block' }}
          >
            {char}
          </motion.span>
        ))}
        <motion.span
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: NAME.length * 0.05 + 0.1, duration: 0.4 }}
          style={{ color: 'var(--accent)', marginLeft: '2px', originX: 0 }}
        >
          .
        </motion.span>
      </div>
    </motion.div>
  )
}
