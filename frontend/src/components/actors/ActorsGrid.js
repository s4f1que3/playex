import React from 'react';
import { motion } from 'framer-motion';
import ActorCard from '../common/ActorCard';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2s
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const ActorsGrid = ({ actors, loading }) => {
  if (!actors?.length) return null;

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
    >
      {actors.map((actor) => (
        <motion.div key={actor.id} variants={item}>
          <ActorCard actor={actor} />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ActorsGrid;
