import React from "react";
import { MapPin, Clock, ChevronRight, PackageSearch } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { db, handleFirestoreError, OperationType } from "@/src/lib/firebase";
import { collection, query, orderBy, limit, onSnapshot, where } from "firebase/firestore";
import { Item } from "@/src/types";

export default function RecentItems() {
  const [items, setItems] = React.useState<Item[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const q = query(
      collection(db, "items"), 
      where("type", "==", "found"),
      orderBy("createdAt", "desc"), 
      limit(4)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Item));
      setItems(data);
      setLoading(false);
    }, (error) => {
      // If collection doesn't exist yet or has no data, we handle it gracefully
      if (error.code === 'failed-precondition') {
        console.warn("Index needed for Firestore query.");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <section className="py-20 px-6 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">Recently Found</h2>
            <p className="text-gray-500">The most recent items reported as found in the community</p>
          </div>
          <Link to="/browse" className="text-primary font-semibold flex items-center gap-1 hover:underline">
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map(idx => (
              <div key={idx} className="bg-gray-200 rounded-2xl h-[400px] animate-pulse"></div>
            ))}
          </div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {items.map((item, idx) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group bg-white rounded-2xl overflow-hidden border border-gray-100 transition-all hover:shadow-2xl hover:shadow-primary/5"
              >
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                  <img 
                    src={item.imageUrl || "https://picsum.photos/seed/item/400/400"} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-green-500 text-white text-xs font-extra-bold rounded-full shadow-lg font-display tracking-tight uppercase">
                      Found
                    </span>
                  </div>
                </div>
                
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 truncate group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="truncate">{item.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>{item.createdAt?.toDate ? item.createdAt.toDate().toLocaleDateString() : "Just now"}</span>
                    </div>
                  </div>
                  
                  <Link 
                    to={`/item/${item.id}`}
                    className="mt-6 w-full flex items-center justify-center gap-2 bg-gray-50 text-gray-700 py-3 rounded-xl font-semibold hover:bg-primary hover:text-white transition-all active:scale-95"
                  >
                    View Details
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 border border-dashed border-gray-200 text-center">
            <PackageSearch className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No items found yet</h3>
            <p className="text-gray-500">Be the first to report a found item and help your community!</p>
            <Link to="/report?type=found" className="inline-block mt-6 text-primary font-bold hover:underline">Report an item now</Link>
          </div>
        )}
      </div>
    </section>
  );
}
