import React from 'react';
import { Wrench, Clock, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function UnderDevelopment({handleBack}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 text-gray-700">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="bg-white p-10 rounded-3xl shadow-2xl text-center max-w-md w-full"
      >
        <div className="flex justify-center mb-6">
          <div className="relative">
            <Wrench className="w-14 h-14 text-blue-600 animate-bounce" />
            <Clock className="w-6 h-6 text-yellow-500 absolute -top-1 -right-2 animate-spin-slow" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Page Under Development 🚧
        </h1>
        <p className="text-gray-600 mb-6">
          We’re working hard to bring this feature to life.  
          Please check back soon!
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleBack}
          className="flex items-center justify-center gap-2 mx-auto px-5 py-3 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-md"
        >
          <ArrowLeft className="w-5 h-5" />
          Go Back
        </motion.button>

        <motion.div
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-sm text-gray-500 italic"
        >
          — The SlotSwapper Team
        </motion.div>
      </motion.div>
    </div>
  );
}
