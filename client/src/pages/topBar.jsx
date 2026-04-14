import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function TopBar({ setSidebarOpen }) {
  const userData = localStorage.getItem('name') || 'User';
  const firstLetterOfUserName = userData[0];
  const date = new Date();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isNotifying, setIsNotifying] = useState(false);

  // Format date beautifully
  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <>
      {/* Top bar */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-white/95 backdrop-blur-xl border-b border-gray-200/60 px-4 md:px-8 py-3 flex items-center justify-between shrink-0 gap-3 shadow-sm"
      >
        <div className="flex items-center gap-3 min-w-0">
          {/* Hamburger Button */}
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: "rgba(13, 33, 69, 0.05)" }}
            whileTap={{ scale: 0.95 }}
            className="lg:hidden rounded-xl flex flex-col gap-1.5 p-2.5 shrink-0 transition-all duration-300 group"
            onClick={() => setSidebarOpen(true)}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-5 h-0.5 bg-[#0d2145] rounded-full origin-left transition-all duration-300"
                whileHover={{
                  width: i === 1 ? "16px" : "20px",
                }}
              />
            ))}
          </motion.button>

          <div className="min-w-0">
            <motion.h1 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-base md:text-xl font-bold bg-gradient-to-r from-[#0d2145] to-[#1a3a6e] bg-clip-text text-transparent truncate"
            >
              Hello, {userData} 
              <motion.span 
                animate={{ 
                  rotate: [0, 15, -10, 15, 0],
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity,
                  repeatDelay: 3
                }}
                className="inline-block ml-1"
              >
                👋
              </motion.span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xs text-slate-400 mt-0.5 hidden sm:block font-medium"
            >
              {formattedDate}
            </motion.p>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4 shrink-0">
          {/* Search Bar */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
            className={`hidden md:flex items-center gap-2 rounded-xl px-4 py-2 transition-all duration-300 ${
              isSearchFocused 
                ? 'bg-white shadow-lg ring-2 ring-blue-200 border-transparent' 
                : 'bg-slate-50 border border-gray-200 hover:shadow-md hover:bg-white'
            }`}
          >
            <motion.span 
              animate={isSearchFocused ? { scale: 1.1, color: "#3b82f6" } : {}}
              className="text-base"
            >
              🔍
            </motion.span>
            <input 
              placeholder="Search anything..." 
              className="bg-transparent text-sm outline-none text-slate-700 w-32 lg:w-48 placeholder:text-slate-400 font-medium"
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0 }}
              animate={isSearchFocused ? { opacity: 1, scale: 1 } : {}}
              className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md"
            >
              ⌘K
            </motion.div>
          </motion.div>

          {/* Notification Bell */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative cursor-pointer group"
            onClick={() => setIsNotifying(!isNotifying)}
          >
            <motion.div 
              className="w-10 h-10 rounded-xl bg-slate-50 border border-gray-200 flex items-center justify-center text-xl group-hover:bg-white group-hover:shadow-lg group-hover:border-blue-200 transition-all duration-300"
              animate={isNotifying ? {
                rotate: [0, -10, 10, -5, 5, 0],
                transition: { duration: 0.5 }
              } : {}}
            >
              <motion.span
                animate={isNotifying ? {
                  scale: [1, 1.2, 1],
                  transition: { duration: 0.3 }
                } : {}}
              >
                🔔
              </motion.span>
            </motion.div>
            
            {/* Notification Badge */}
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              whileHover={{ scale: 1.1 }}
              className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-gradient-to-r from-[#e8192c] to-[#ff3b4a] text-white text-[10px] flex items-center justify-center font-bold shadow-lg shadow-red-500/30 px-1"
            >
              <motion.span
                animate={{ 
                  scale: [1, 1.2, 1],
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity 
                }}
              >
                3
              </motion.span>
            </motion.div>
            
            {/* Notification Pulse Ring */}
            <motion.div
              className="absolute inset-0 rounded-xl border-2 border-red-400"
              initial={{ opacity: 0, scale: 1 }}
              animate={{ 
                opacity: [0, 0.5, 0],
                scale: [1, 1.3, 1.4],
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeOut"
              }}
            />
          </motion.div>

          {/* User Avatar */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25 }}
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <motion.div 
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 8px 20px rgba(13, 33, 69, 0.2)"
              }}
              className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-[#0d2145] to-[#1a3a6e] flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-md transition-all duration-300 group-hover:shadow-xl"
            >
              <motion.span
                initial={{ rotate: 0 }}
                whileHover={{ rotate: [0, -5, 5, 0] }}
                transition={{ duration: 0.3 }}
              >
                {firstLetterOfUserName}
              </motion.span>
              
              {/* Online indicator */}
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-white"
              >
                <motion.div
                  className="absolute inset-0 rounded-full bg-green-400"
                  animate={{ 
                    scale: [1, 1.5, 1],
                    opacity: [0.7, 0, 0.7]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity 
                  }}
                />
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="hidden sm:block"
              whileHover={{ x: 2 }}
            >
              <div className="text-sm font-semibold text-[#0d2145] group-hover:text-blue-600 transition-colors">
                {userData}
              </div>
              <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                Developer
              </div>
            </motion.div>
            
            {/* Dropdown Arrow */}
            <motion.div
              className="hidden sm:block text-slate-400"
              animate={{ rotate: 0 }}
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.3 }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Mobile Search - Appears when needed */}
      <AnimatePresence>
        {isSearchFocused && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-white border-b border-gray-200 px-4 py-3"
          >
            <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-4 py-2">
              <span>🔍</span>
              <input 
                placeholder="Search..." 
                className="bg-transparent text-sm outline-none text-slate-600 flex-1"
                autoFocus
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}