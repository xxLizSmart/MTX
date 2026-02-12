import React from 'react';
import { motion } from 'framer-motion';

const MobileHero = () => {
  return (
    <motion.section 
      className="relative block sm:hidden w-full h-[300px] overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <img
        src="https://horizons-cdn.hostinger.com/911b6dd9-a6dc-482b-b727-f1a7cb5e689b/dcbe84853c83cd27e84b6afd1c8840f7.png"
        alt="MetaTradeX - Where Innovation Meets Trading"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/30" />
    </motion.section>
  );
};

export default MobileHero;