import React from "react";
import { Smartphone, FileText, Briefcase, Sparkles, Key, Dog, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

const categories = [
  { name: "Electronics", count: 120, icon: Smartphone, color: "bg-blue-50 text-blue-600" },
  { name: "Documents", count: 86, icon: FileText, color: "bg-amber-50 text-amber-600" },
  { name: "Bags", count: 64, icon: Briefcase, color: "bg-emerald-50 text-emerald-600" },
  { name: "Accessories", count: 53, icon: Sparkles, color: "bg-purple-50 text-purple-600" },
  { name: "Keys", count: 42, icon: Key, color: "bg-orange-50 text-orange-600" },
  { name: "Pets", count: 31, icon: Dog, color: "bg-rose-50 text-rose-600" },
];

export default function CategorySection() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">Popular Categories</h2>
            <p className="text-gray-500">Browse items by category to find what you're looking for</p>
          </div>
          <Link to="/categories" className="text-primary font-semibold flex items-center gap-1 hover:underline">
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((cat, idx) => (
            <motion.div 
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col items-center gap-4 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-gray-100 group-hover:-translate-y-1">
                <div className={`${cat.color} p-4 rounded-xl transition-transform duration-300 group-hover:scale-110`}>
                  <cat.icon className="w-8 h-8" />
                </div>
                <div className="text-center">
                  <h3 className="font-bold text-gray-900">{cat.name}</h3>
                  <p className="text-sm text-gray-400">{cat.count} items</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
