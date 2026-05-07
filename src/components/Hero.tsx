import React from "react";
import { motion } from "motion/react";
import { PlusCircle, Search, ShieldCheck, Heart, Globe } from "lucide-react";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32 px-6 bg-white">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-8 text-center lg:text-left"
        >
          <div className="inline-flex items-center gap-2 self-center lg:self-start bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
             <ShieldCheck className="w-4 h-4 text-primary" />
             <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Trusted by 10k+ Cambodians</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.9] text-gray-900 tracking-tighter sm:max-w-xl mx-auto lg:mx-0">
            Lost it? <br />
            <span className="text-primary italic">Find it.</span> <br />
            <span className="text-gray-400">Feel better.</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-500 max-w-lg leading-relaxed mx-auto lg:mx-0">
            FindKH is Cambodia's premier community network for returning lost belongings. From BKK1 to Siem Reap, we keep stories connected.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 mt-4 mx-auto lg:mx-0">
            <Link 
              to="/report" 
              className="w-full sm:w-auto group flex items-center justify-center gap-3 bg-gray-900 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-primary transition-all shadow-2xl hover:shadow-primary/30 active:scale-95"
            >
              <PlusCircle className="w-6 h-6 group-hover:rotate-90 transition-transform duration-500" />
              Report Item
            </Link>
            <Link 
              to="/browse" 
              className="w-full sm:w-auto group flex items-center justify-center gap-3 bg-white text-gray-900 border-2 border-gray-100 px-10 py-5 rounded-2xl font-bold text-lg hover:border-gray-900 transition-all active:scale-95"
            >
              <Search className="w-6 h-6 group-hover:scale-110 transition-transform" />
              Browse Map
            </Link>
          </div>

          <div className="flex items-center gap-8 pt-6 border-t border-gray-50 mt-4 justify-center lg:justify-start">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Heart className="w-4 h-4 fill-current" />
              </div>
              <span className="text-sm font-bold text-gray-500">100% Free</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                <Globe className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold text-gray-500">Countrywide</span>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, delay: 0.2, type: "spring", bounce: 0.4 }}
          className="relative mt-12 lg:mt-0"
        >
          <div className="relative z-10 w-full aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-gray-100 shadow-[0_48px_96px_-12px_rgba(0,0,0,0.15)] flex items-center justify-center">
            <img 
              src="https://images.unsplash.com/photo-1518133835878-5a93cc3f89e5?auto=format&fit=crop&q=80&w=1200" 
              alt="Phnom Penh Cityscape" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent"></div>
            
            {/* Live Stats Overlay */}
            <div className="absolute bottom-10 left-10 right-10 bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-1">Recent Success</p>
                  <p className="text-white font-bold">Passport returned in BKK3</p>
                </div>
                <div className="bg-emerald-400 w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg ">
                   <ShieldCheck className="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Decorative Floating Cards */}
          <motion.div 
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-10 -right-6 md:-right-10 z-20 bg-white p-5 rounded-3xl shadow-2xl border border-gray-50 w-48 hidden sm:block"
          >
            <div className="bg-rose-50 w-10 h-10 rounded-2xl flex items-center justify-center mb-3">
              <Search className="w-5 h-5 text-rose-500" />
            </div>
            <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Lost</p>
            <p className="font-bold text-gray-800 text-sm">Toyota Keys</p>
            <p className="text-[10px] text-gray-400">Near Aeon Mall 1</p>
          </motion.div>

          <motion.div 
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute -bottom-10 -left-6 md:-left-10 z-20 bg-white p-5 rounded-3xl shadow-2xl border border-gray-50 w-48 hidden sm:block"
          >
            <div className="bg-emerald-50 w-10 h-10 rounded-2xl flex items-center justify-center mb-3">
              <PlusCircle className="w-5 h-5 text-emerald-500" />
            </div>
            <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Found</p>
            <p className="font-bold text-gray-800 text-sm">Leather Wallet</p>
            <p className="text-[10px] text-gray-400">Central Market</p>
          </motion.div>
          
          {/* Abstract backgrounds */}
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-[100px] z-0"></div>
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] z-0"></div>
        </motion.div>
      </div>
    </section>
  );
}
