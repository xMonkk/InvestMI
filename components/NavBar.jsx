import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <motion.div 
      className="w-full px-10 py-5 bg-black/20 backdrop-blur-xl border-b border-white/10 shadow-lg"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex justify-between items-center">
        {}
        <motion.div
          className="text-3xl font-bold tracking-wide bg-gradient-to-r from-indigo-400 via-blue-400 to-cyan-300 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(79,70,229,0.7)]"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          MichiScope<span className="font-extrabold">AI</span>
        </motion.div>

        {}
        <div className="flex gap-8 text-gray-300 text-lg">
          {["Home", "Heatmaps", "Insights", "About"].map((item, i) => (
            <motion.button
              key={i}
              className="relative group font-medium"
              whileHover={{ scale: 1.08 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              {item}
              {}
              <span className="absolute left-0 bottom-0 w-full h-[2px] bg-gradient-to-r from-indigo-400 to-cyan-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full"></span>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
