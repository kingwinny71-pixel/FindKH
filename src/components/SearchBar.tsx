import React from "react";
import { Search, MapPin, ListFilter } from "lucide-react";
import { motion } from "motion/react";

export default function SearchBar() {
  return (
    <div className="max-w-7xl mx-auto px-6 -mt-12 relative z-20">
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-white p-4 md:p-2 rounded-2xl md:rounded-full shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col md:flex-row items-center gap-2"
      >
        <div className="flex-1 flex items-center gap-3 px-4 w-full border-b md:border-b-0 md:border-r border-gray-100 py-3 md:py-0">
          <Search className="w-5 h-5 text-gray-400 shrink-0" />
          <input 
            type="text" 
            placeholder="Search for lost or found items..." 
            className="w-full bg-transparent focus:outline-none text-gray-800 placeholder:text-gray-400 py-2"
          />
        </div>
        
        <div className="flex-1 flex items-center gap-3 px-4 w-full border-b md:border-b-0 md:border-r border-gray-100 py-3 md:py-0">
          <MapPin className="w-5 h-5 text-gray-400 shrink-0" />
          <input 
            type="text" 
            placeholder="Location" 
            className="w-full bg-transparent focus:outline-none text-gray-800 placeholder:text-gray-400 py-2"
          />
        </div>
        
        <div className="flex-1 flex items-center gap-3 px-4 w-full py-3 md:py-0">
          <ListFilter className="w-5 h-5 text-gray-400 shrink-0" />
          <select className="w-full bg-transparent focus:outline-none text-gray-800 appearance-none cursor-pointer">
            <option>All Categories</option>
            <option>Electronics</option>
            <option>Pets</option>
            <option>Documents</option>
            <option>Bags</option>
            <option>Accessories</option>
            <option>Keys</option>
          </select>
        </div>
        
        <button className="w-full md:w-auto bg-primary text-white px-10 py-4 rounded-xl md:rounded-full font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 hover:scale-105 active:scale-95">
          Search
        </button>
      </motion.div>
    </div>
  );
}
