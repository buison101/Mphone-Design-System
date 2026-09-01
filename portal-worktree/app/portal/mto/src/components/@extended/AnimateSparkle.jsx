import PropTypes from 'prop-types';

// third-party
import { motion } from 'framer-motion';

// ==============================|| ANIMATION SPARKLE ||============================== //

export default function AnimateSparkle({ children, triggered = false }) {
  return (
    <motion.span
      animate={triggered ? { scale: [1, 1.2, 1], filter: ['brightness(1)', 'brightness(1.2)', 'brightness(1)'] } : {}}
      transition={{ duration: 2, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' }}
      style={{ display: 'inline-block' }}
    >
      {children}
    </motion.span>
  );
}

AnimateSparkle.propTypes = { children: PropTypes.node, triggered: PropTypes.bool };
