import React from "react";
import { motion } from "motion/react";
import { PlusCircle, Search } from "lucide-react";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-32 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col gap-6"
        >
          <h1 className="text-6xl md:text-8xl font-bold leading-[1.05] text-gray-900 tracking-tight">
            Lost something? <br />
            <span className="text-primary">We help people find it.</span>
          </h1>
          <p className="text-xl text-gray-500 max-w-lg leading-relaxed">
            FindKH is Cambodia's community platform for returning lost items. Join thousands of users in Phnom Penh and beyond.
          </p>
          <div className="flex flex-wrap gap-5 mt-6">
            <Link 
              to="/report?type=lost" 
              className="group flex items-center gap-3 bg-primary text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-primary-dark transition-all shadow-xl shadow-primary/30 active:scale-[0.97]"
            >
              <Search className="w-6 h-6 group-hover:scale-110 transition-transform" />
              Report Lost Item
            </Link>
            <Link 
              to="/report?type=found" 
              className="group flex items-center gap-3 bg-white text-gray-900 border-2 border-gray-100 px-10 py-5 rounded-2xl font-bold text-lg hover:border-primary/50 transition-all active:scale-[0.97]"
            >
              <PlusCircle className="w-6 h-6 text-primary group-hover:rotate-90 transition-transform" />
              Report Found Item
            </Link>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, type: "spring", bounce: 0.4 }}
          className="relative"
        >
          <div className="relative z-10 w-full aspect-square rounded-[3rem] overflow-hidden bg-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] flex items-center justify-center border border-white/50">
            <img 
              src="https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=1200" 
              alt="Lost and Found Illustration" 
              className="w-full h-full object-cover scale-110"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-blue-600/10 mix-blend-overlay"></div>
          </div>
          
          {/* Floating UI Elements for Illustration feel */}
          <motion.div 
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-4 -left-4 z-20 bg-white p-4 rounded-2xl shadow-xl border border-gray-50 hidden md:block"
          >
            <div className="bg-rose-50 p-2 rounded-lg mb-2">
              <Search className="w-6 h-6 text-rose-500" />
            </div>
            <div className="w-20 h-2 bg-gray-100 rounded-full"></div>
          </motion.div>

          <motion.div 
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute -bottom-8 -right-4 z-20 bg-white p-4 rounded-2xl shadow-xl border border-gray-50 hidden md:block"
          >
            <div className="flex gap-3 items-center">
              <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center">
                <PlusCircle className="w-6 h-6 text-emerald-500" />
              </div>
              <div className="space-y-1">
                <div className="w-16 h-2 bg-gray-100 rounded-full"></div>
                <div className="w-10 h-1.5 bg-gray-50 rounded-full"></div>
              </div>
            </div>
          </motion.div>
          
          {/* Decorative gradients */}
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-primary/20 rounded-full blur-[80px]"></div>
          <div className="absolute -bottom-16 -left-16 w-80 h-80 bg-blue-400/20 rounded-full blur-[100px]"></div>
        </motion.div>
      </div>
    </section>
  );
}
