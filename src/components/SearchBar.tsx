import React from "react";
import { Search, MapPin, ListFilter } from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

export default function SearchBar() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [category, setCategory] = React.useState("All Categories");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm) params.append("q", searchTerm);
    if (location) params.append("loc", location);
    if (category !== "All Categories") params.append("cat", category);
    
    navigate(`/browse?${params.toString()}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 -mt-12 relative z-20">
      <motion.form 
        onSubmit={handleSearch}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-white p-4 md:p-2 rounded-2xl md:rounded-full shadow-2xl shadow-gray-200/50 border border-gray-100 flex flex-col md:flex-row items-center gap-2"
      >
        <div className="flex-1 flex items-center gap-3 px-4 w-full border-b md:border-b-0 md:border-r border-gray-100 py-3 md:py-0">
          <Search className="w-5 h-5 text-primary shrink-0" />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search lost items..." 
            className="w-full bg-transparent focus:outline-none text-gray-800 placeholder:text-gray-400 py-2 font-medium"
          />
        </div>
        
        <div className="flex-1 flex items-center gap-3 px-4 w-full border-b md:border-b-0 md:border-r border-gray-100 py-3 md:py-0">
          <MapPin className="w-5 h-5 text-primary shrink-0" />
          <input 
            type="text" 
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location (e.g. BKK1)" 
            className="w-full bg-transparent focus:outline-none text-gray-800 placeholder:text-gray-400 py-2 font-medium"
          />
        </div>
        
        <div className="flex-1 flex items-center gap-3 px-4 w-full py-3 md:py-0 relative">
          <ListFilter className="w-5 h-5 text-primary shrink-0" />
          <select 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-transparent focus:outline-none text-gray-800 appearance-none cursor-pointer font-medium pr-8"
          >
            <option>All Categories</option>
            <option>Electronics</option>
            <option>Pets</option>
            <option>Documents</option>
            <option>Bags</option>
            <option>Accessories</option>
            <option>Keys</option>
            <option>Other</option>
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none md:hidden">
             {/* Built-in arrow for select is enough but can be styled */}
          </div>
        </div>
        
        <button 
          type="submit"
          className="w-full md:w-auto bg-gray-900 text-white px-10 py-4 rounded-xl md:rounded-full font-bold hover:bg-primary transition-all shadow-lg hover:shadow-primary/20 active:scale-95"
        >
          Search
        </button>
      </motion.form>
    </div>
  );
}
