import React from "react";
import { Smartphone, FileText, Briefcase, Sparkles, Key, Dog, ChevronRight, Laptop, Wallet, Watch } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

const categories = [
  { name: "Electronics", icon: Smartphone, color: "bg-blue-500", light: "bg-blue-50", text: "text-blue-600" },
  { name: "Documents", icon: FileText, color: "bg-amber-500", light: "bg-amber-50", text: "text-amber-600" },
  { name: "Bags", icon: Briefcase, color: "bg-emerald-500", light: "bg-emerald-50", text: "text-emerald-600" },
  { name: "Accessories", icon: Sparkles, color: "bg-purple-500", light: "bg-purple-50", text: "text-purple-600" },
  { name: "Keys", icon: Key, color: "bg-orange-500", light: "bg-orange-50", text: "text-orange-600" },
  { name: "Pets", icon: Dog, color: "bg-rose-500", light: "bg-rose-50", text: "text-rose-600" },
  { name: "Laptops", icon: Laptop, color: "bg-indigo-500", light: "bg-indigo-50", text: "text-indigo-600" },
  { name: "Wallets", icon: Wallet, color: "bg-cyan-500", light: "bg-cyan-50", text: "text-cyan-600" },
];

export default function CategorySection() {
  return (
    <section className="py-24 px-6 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tighter mb-4">
              Browse by <span className="text-primary italic">Category</span>
            </h2>
            <p className="text-lg text-gray-500">
              Quickly filter through reports by selecting a category. Our community helps recover everything from tech to furry friends.
            </p>
          </div>
          <Link 
            to="/browse" 
            className="group inline-flex items-center gap-2 text-gray-900 font-black uppercase tracking-widest text-[11px] hover:text-primary transition-colors"
          >
            Explore All 
            <div className="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center group-hover:border-primary group-hover:bg-primary group-hover:text-white transition-all">
              <ChevronRight className="w-4 h-4" />
            </div>
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
          {categories.slice(0, 8).map((cat, idx) => (
            <motion.div 
              key={cat.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05, duration: 0.5 }}
            >
              <Link to={`/browse?cat=${cat.name}`} className="group block">
                <div className="relative bg-gray-50 rounded-[2rem] p-8 h-full border border-transparent hover:border-primary/20 hover:bg-white hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500">
                  <div className={`${cat.light} ${cat.text} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                    <cat.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 truncate">{cat.name}</h3>
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                           <img src={`https://i.pravatar.cc/100?img=${i + idx * 3}`} alt="" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                    <span className="text-xs font-bold text-gray-400">Join the search</span>
                  </div>
                  
                  <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                     <div className={`w-2 h-2 rounded-full ${cat.color} animate-ping`}></div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
