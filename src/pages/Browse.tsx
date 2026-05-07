import React from "react";
import { db, handleFirestoreError, OperationType } from "@/src/lib/firebase";
import { collection, query, orderBy, limit, onSnapshot, where } from "firebase/firestore";
import { Item } from "@/src/types";
import { motion } from "motion/react";
import { MapPin, Clock, Search, Filter } from "lucide-react";
import { Link } from "react-router-dom";

export default function BrowsePage() {
  const [items, setItems] = React.useState<Item[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filterType, setFilterType] = React.useState<"all" | "lost" | "found">("all");

  React.useEffect(() => {
    let q = query(collection(db, "items"), orderBy("createdAt", "desc"), limit(40));
    
    if (filterType !== "all") {
      q = query(collection(db, "items"), where("type", "==", filterType), orderBy("createdAt", "desc"), limit(40));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Item));
      setItems(data);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "items");
    });

    return () => unsubscribe();
  }, [filterType]);

  const filteredItems = items.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto py-12 px-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold font-display text-gray-900 tracking-tight">Browse Items</h1>
          <p className="text-gray-500 mt-1">Found something? Search here to see if anyone reported it lost.</p>
        </div>
        
        <div className="flex items-center gap-3 bg-white p-1 rounded-xl border border-gray-100 shadow-sm">
          <button 
            onClick={() => setFilterType("all")}
            className={`px-6 py-2 rounded-lg font-bold transition-all ${filterType === "all" ? "bg-primary text-white shadow-md shadow-primary/20" : "text-gray-500 hover:bg-gray-50"}`}
          >
            All
          </button>
          <button 
            onClick={() => setFilterType("lost")}
            className={`px-6 py-2 rounded-lg font-bold transition-all ${filterType === "lost" ? "bg-primary text-white shadow-md shadow-primary/20" : "text-gray-500 hover:bg-gray-50"}`}
          >
            Lost
          </button>
          <button 
            onClick={() => setFilterType("found")}
            className={`px-6 py-2 rounded-lg font-bold transition-all ${filterType === "found" ? "bg-primary text-white shadow-md shadow-primary/20" : "text-gray-500 hover:bg-gray-50"}`}
          >
            Found
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1 space-y-8">
          <div className="space-y-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Search className="w-5 h-5 text-primary" /> Quick Search
            </h3>
            <input 
              type="text" 
              placeholder="Keyword..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="space-y-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Filter className="w-5 h-5 text-primary" /> Filter by Category
            </h3>
            <div className="flex flex-col gap-2">
              {["Electronics", "Pets", "Documents", "Bags", "Accessories", "Keys", "Other"].map(cat => (
                <label key={cat} className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors">
                  <input type="checkbox" className="rounded text-primary focus:ring-primary w-4 h-4" />
                  <span className="text-sm font-medium">{cat}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Results Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-pulse">
              {[1, 2, 3, 4].map(idx => (
                <div key={idx} className="bg-gray-100 rounded-2xl h-[400px]"></div>
              ))}
            </div>
          ) : filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {filteredItems.map((item, idx) => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 text-white text-xs font-bold rounded-full shadow-lg ${item.type === "lost" ? "bg-red-500" : "bg-green-500"}`}>
                        {item.type.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-4 line-clamp-1 group-hover:text-primary transition-colors">{item.title}</h3>
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <MapPin className="w-4 h-4" />
                        <span>{item.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>{item.createdAt?.toDate ? item.createdAt.toDate().toLocaleDateString() : "Just now"}</span>
                      </div>
                    </div>
                    <Link to={`/item/${item.id}`} className="block w-full py-3 bg-gray-50 text-gray-700 font-bold text-center rounded-xl hover:bg-primary hover:text-white transition-all">
                      View Details
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900">No items found</h3>
              <p className="text-gray-500 mt-2">Try adjusting your search terms or filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
